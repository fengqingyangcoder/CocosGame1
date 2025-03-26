import { Label, Widget, _decorator, Node } from 'cc';
import { UIBase } from './UIBase';
import { UI } from '../enum/UI';
import { GameMgr } from '../manager/GameMgr';
import { EventMgr } from '../manager/EventMgr';
import { EventType } from '../enum/EventType';
import { GameMode } from '../enum/GameMode';
import { AudioMgr } from '../manager/AudioMgr';
import { Global } from '../Global';
const { ccclass, property, requireComponent } = _decorator;

@ccclass('UI/UIGame')
@requireComponent(Widget)
export class UIGame extends UIBase {

    @property(Label)
    lbLevel: Label = null
    @property(Node)
    timer: Node = null

    public onOpen(data?: unknown): void {
        this.timer.active = Global.Level_Time > 0
        AudioMgr.playBgm('游戏内音乐')
        EventMgr.on(EventType.UpdateLevel, this.onUpdateLevel, this)
        switch (GameMgr.Mode) {
            case GameMode.Normal:
                this.lbLevel.node.active = true
                this.onUpdateLevel(GameMgr.CurLevel)
                break;
            case GameMode.Super:
                this.lbLevel.node.active = false
                this.onUpdateLevel(GameMgr.SuperLevel)
                break;
        }
    }

    public onClose(data?: unknown): void {
        EventMgr.off(EventType.UpdateLevel, this.onUpdateLevel, this)
    }

    onBtnSettingClick(): void {
        this.open(UI.Setting)
    }

    onBtnReplayClick(): void {
        this.open(UI.Replay)
    }

    onBtnPauseClick(): void {
        this.open(UI.Pause)
    }

    onUpdateLevel(v: number): void {
        this.lbLevel.string = `第${v}关`
    }

}


