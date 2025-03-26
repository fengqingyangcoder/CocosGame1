import { _decorator, AudioClip, AudioSource, Component, Game, game } from 'cc'
import { Debug } from '../util/Debug'
import { ResMgr } from './ResMgr'
import { Bundle } from '../enum/Bundle'
import { Setting } from '../Setting'
const { ccclass, property, requireComponent } = _decorator

const Tag: string = 'AudioMgr'

@ccclass('Manager/AudioMgr')
@requireComponent(AudioSource)
export class AudioMgr extends Component {

    private static _audio: AudioSource
    public static get Audio(): AudioSource {
        return this._audio
    }

    private static curBgm: string = null

    protected onLoad(): void {
        globalThis.AudioMgr = this
        AudioMgr._audio = this.getComponent(AudioSource)
        game.on(Game.EVENT_HIDE, this.onHide, this)
        game.on(Game.EVENT_SHOW, this.onShow, this)
    }

    onHide(): void {
        AudioMgr.pauseBgm()
        Debug.Log(Tag, '进入后台')
    }

    onShow(): void {
        AudioMgr.resumeBgm()
        Debug.Log(Tag, '回到前台')
    }

    public static playBgm(bgm?: string, volume: number = 1): void {
        if (!Setting.BgmEnabled) return
        if (!bgm) {
            bgm = this.curBgm
            if (!bgm) {
                Debug.Warn(Tag, '不需要播放BGM')
                return
            }
        }
        if (this.curBgm === bgm) {
            this._audio.volume = volume
            if (!this._audio.playing) this._audio.play()
        } else {
            let clip: AudioClip = ResMgr.getRes(Bundle.Audio, bgm)
            if (!clip) {
                console.warn(`当前声音文件 ${bgm} 未进行加载`)
                return
            }
            this._audio.stop()
            this.curBgm = bgm
            this._audio.clip = clip
            this._audio.loop = true
            this._audio.volume = volume
            this._audio.play()
        }
    }

    public static pauseBgm(): void {
        this.curBgm && this._audio.pause()
    }

    public static resumeBgm():void{
        this.curBgm && this._audio.play()
    }

    public static stopBgm(): void {
        this._audio.stop()
        this.curBgm = null
    }

    public static playSfx(sfxName: string, volumeScale: number = 1): void {
        if (!Setting.SfxEnabled) return
        let clip: AudioClip = ResMgr.getRes<AudioClip>(Bundle.Audio, sfxName)
        if (!clip) {
            Debug.Warn(Tag, `暂未加载音频${sfxName}`)
            return
        }
        this._audio.playOneShot(clip, volumeScale)
    }

}


