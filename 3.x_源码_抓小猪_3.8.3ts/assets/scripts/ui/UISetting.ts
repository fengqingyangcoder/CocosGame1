import { Label, Toggle, Widget, _decorator } from 'cc';
import { UIBase } from './UIBase';
import { GameMgr } from '../manager/GameMgr';
import { Setting } from '../Setting';
import { AudioMgr } from '../manager/AudioMgr';
import { UI } from '../enum/UI';
import { Global } from '../Global';
const { ccclass, property, requireComponent } = _decorator;

@ccclass('UI/UISetting')
@requireComponent(Widget)
export class UISetting extends UIBase {

    @property(Toggle)
    tgSfx: Toggle = null
    @property(Toggle)
    tgBgm: Toggle = null
    @property(Toggle)
    tgVibrate: Toggle = null

    @property(Label)
    lbVersion: Label = null

    public onOpen(data?: unknown): void {
        GameMgr.Pause = true
        this.tgSfx.setIsCheckedWithoutNotify(Setting.SfxEnabled)
        this.tgBgm.setIsCheckedWithoutNotify(Setting.BgmEnabled)
        this.tgVibrate.setIsCheckedWithoutNotify(Setting.VibrateEnabled)
        this.lbVersion.string = `v${Global.Version}`
    }

    public onClose(data?: unknown): void {
        GameMgr.Pause = false
    }

    onBtnCloseClick(): void {
        this.close()
    }

    onTgSfxClick(): void {
        Setting.SfxEnabled = !Setting.SfxEnabled
    }

    onTgBgmClick(): void {
        Setting.BgmEnabled = !Setting.BgmEnabled
        if (Setting.BgmEnabled) {
            AudioMgr.resumeBgm()
        } else {
            AudioMgr.pauseBgm()
        }
    }

    onTgVibratelick(): void {
        Setting.VibrateEnabled = !Setting.VibrateEnabled
    }

}


