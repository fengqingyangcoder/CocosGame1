import { _decorator, Component, isValid, Node } from 'cc';
import { Global } from '../Global';
import { EventType } from '../enum/EventType';
import { EventMgr } from '../manager/EventMgr';
import { AudioMgr } from '../manager/AudioMgr';
const { ccclass, property } = _decorator;

@ccclass('Game/EffectFreeze')
export class EffectFreeze extends Component {
    
    protected onLoad(): void {
        EventMgr.on(EventType.UseSkillFreeze, this.onRemove, this)
    }

    protected onDestroy(): void {
        EventMgr.off(EventType.UseSkillFreeze, this.onRemove, this)
        this.unscheduleAllCallbacks()
    }

    start() {
        this.scheduleOnce(this.onRemove, Global.Freeze_Time)
        AudioMgr.playSfx('a冰冻道具')
    }

    onRemove(): void {
        if (isValid(this.node)) this.node.destroy()
    }

}


