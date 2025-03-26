import { Toggle, Widget, _decorator } from 'cc';
import { UIBase } from './UIBase';
import { UI } from '../enum/UI';
import { GameMgr } from '../manager/GameMgr';
import { Setting } from '../Setting';
import { AudioMgr } from '../manager/AudioMgr';
const { ccclass, property, requireComponent } = _decorator;

@ccclass('UI/UIPause')
@requireComponent(Widget)
export class UIPause extends UIBase {

    @property(Toggle)
    tgSfx: Toggle = null
    @property(Toggle)
    tgBgm: Toggle = null
    @property(Toggle)
    tgVibrate: Toggle = null

    public onOpen(data?: unknown): void {
        GameMgr.Pause = true
        this.tgSfx.setIsCheckedWithoutNotify(Setting.SfxEnabled)
        this.tgBgm.setIsCheckedWithoutNotify(Setting.BgmEnabled)
        this.tgVibrate.setIsCheckedWithoutNotify(Setting.VibrateEnabled)
    }

    public onClose(data?: unknown): void {
        GameMgr.Pause = false
    }

    onBtnQuitClick(): void {
        this.close()
        this.open(UI.Fail)
    }

    onBtnContinueClick(): void {
        this.close()
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

