import { _decorator, Component, Label } from 'cc';
import { TimeUtil } from '../util/TimeUtil';
import { EventMgr } from '../manager/EventMgr';
import { EventType } from '../enum/EventType';
import { GameMgr } from '../manager/GameMgr';
import { Debug } from '../util/Debug';
import { Global } from '../Global';
import { GameMode } from '../enum/GameMode';
import { FailType } from '../enum/FailType';
const { ccclass, property } = _decorator;

const Tag: string = 'StageTimer'

@ccclass('Game/StageTimer')
export class StageTimer extends Component {

    private _label: Label = null

    private leftTime: number = 0
    public get LeftTime(): number {
        return this.leftTime
    }
    public set LeftTime(v: number) {
        this.leftTime = Math.max(v, 0)
        EventMgr.emit(EventType.TimeTick, this.leftTime)
        this._label.string = TimeUtil.formatTime_HHMMSS(Math.round(this.leftTime) * 1000)
    }

    private _freeze: boolean = false
    private _freezeTime: number = 0
    private _pause: boolean = false

    onLoad() {
        this._label = this.getComponent(Label)
        globalThis.StageTimer = this
        EventMgr.on(EventType.Revive, this.onRevive, this)
        EventMgr.on(EventType.UseSkillFreeze, this.onUseSkillFreeze, this)
        EventMgr.on(EventType.TimeReset, this.onTimeReset, this)
    }

    onDestroy(): void {
        EventMgr.off(EventType.Revive, this.onRevive, this)
        EventMgr.off(EventType.UseSkillFreeze, this.onUseSkillFreeze, this)
        EventMgr.off(EventType.TimeReset, this.onTimeReset, this)
    }

    update(dt: number): void {
        if (this._pause) return
        if (GameMgr.Pause) return
        if (Global.Level_Time === -1) return
        if (this._freeze) {
            this._freezeTime -= dt
            if (this._freezeTime <= 0) {
                this._freeze = false
                Debug.Log(Tag, '结束冰冻')
            }
        } else {
            this.LeftTime -= dt
            if (this.leftTime <= 0) {
                this._pause = true
                EventMgr.emit(EventType.TimeOut)
            }
        }
    }

    onTimeReset(): void {
        this._pause = false
        this.LeftTime = Global.Level_Time
    }

    onRevive(failType: FailType): void {
        if (failType !== FailType.TimeOut) return
        this._pause = false
        switch (GameMgr.Mode) {
            case GameMode.Normal:
                this.LeftTime = GameMgr.isHardLevel ? 300 : 60
                break;
            case GameMode.Super:
                this.LeftTime = GameMgr.SuperLevel === 1 ? 60 : 300
                break;
        }
    }

    onUseSkillFreeze(): void {
        this._freeze = true
        this._freezeTime = Global.Freeze_Time
        Debug.Log(Tag, '开始冰冻')
    }

}


