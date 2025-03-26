import { _decorator, Component, tween, UIOpacity } from 'cc';
import { EventMgr } from '../manager/EventMgr';
import { EventType } from '../enum/EventType';
import { AudioMgr } from '../manager/AudioMgr';
const { ccclass, property } = _decorator;

@ccclass('Game/EffectAlert')
export class EffectAlert extends Component {

    private uiOpacity: UIOpacity = null

    onLoad(): void {
        this.uiOpacity = this.getComponent(UIOpacity)
        EventMgr.on(EventType.TimeTick, this.onTimeTick, this)
        EventMgr.on(EventType.UseSkillFreeze, this.onUseSkillFreeze, this)
        this.node.active = false
    }

    start(): void {
        const duration: number = 0.5
        tween(this.uiOpacity).sequence(
            tween(this.uiOpacity).to(duration, { opacity: 50 }),
            tween(this.uiOpacity).to(duration, { opacity: 255 })
        ).repeatForever().start()
    }

    onDestroy(): void {
        EventMgr.off(EventType.TimeTick, this.onTimeTick, this)
        EventMgr.off(EventType.UseSkillFreeze, this.onUseSkillFreeze, this)
    }

    onTimeTick(time: number): void {
        const preActive: boolean = this.node.active
        const curActive: boolean = time > 0 && time <= 5
        this.node.active = curActive
        if (!preActive && curActive) {
            AudioMgr.playSfx('a倒计时')
        }
    }

    onUseSkillFreeze(): void {
        this.node.active = false
    }

}


