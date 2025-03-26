import { _decorator, Component, Sprite, Vec3 } from 'cc';
import { EventMgr } from '../manager/EventMgr';
import { EventType } from '../enum/EventType';
import { GameMgr } from '../manager/GameMgr';
import { Global } from '../Global';
import { Debug } from '../util/Debug';
import { AudioMgr } from '../manager/AudioMgr';
import { VibrateUtil } from '../util/VibrateUtil';
import { DtoBall } from '../dto/DtoBall';
const { ccclass, property } = _decorator;

@ccclass('Game/Ball')
export class Ball extends Component {

    private _sp: Sprite = null

    private _selected: boolean = false
    public get Selected(): boolean {
        return this._selected
    }
    public set Selected(v: boolean) {
        this._selected = v;
    }

    private _data: DtoBall = null
    public get Data(): DtoBall {
        return this._data
    }
    public set Data(v: DtoBall) {
        this._data = v;
    }

    protected onLoad(): void {
        this._sp = this.getComponent(Sprite)
    }

    protected onDestroy(): void {
    }

    onSelect(): void {
        if (GameMgr.curIdArr.length >= Global.Slot_Cnt) {
            Debug.Warn('Ball', '槽位已满，无法继续')
            return
        }
        this.doSelect()
    }

    doSelect(): void {
        AudioMgr.playSfx('点击消除物')
        VibrateUtil.vibrate()
        this.Selected = true
        const worldPos: Vec3 = this.node.getWorldPosition()
        EventMgr.emit(EventType.SelectBall, worldPos, this.node.angle, this._data)
        this.node.destroy()
    }



}


