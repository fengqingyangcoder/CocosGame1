import { _decorator, Component, math, Node, RigidBody2D, Sprite, SpriteFrame, v2, Vec2, Vec3 } from 'cc';
import { ResMgr } from '../../manager/ResMgr';
import { Bundle } from '../../enum/Bundle';
import { ArrayUtil } from '../../util/ArrayUtil';
import { EventMgr } from '../../manager/EventMgr';
import { EventType } from '../../enum/EventType';
const { ccclass, property } = _decorator;

@ccclass('Item/Egg')
export class Egg extends Component {

    rigidBody: RigidBody2D = null
    sp: Sprite = null

    private orgPos: Vec3 = null

    protected onLoad(): void {
        this.rigidBody = this.getComponent(RigidBody2D)
        this.sp = this.getComponent(Sprite)
        this.rigidBody.gravityScale = 0
        const id: number = ArrayUtil.pickItem([1, 2, 3])
        const spf: SpriteFrame = ResMgr.getSpriteFrame(Bundle.UI, `niuidan${id}`, 'image/uiGashapon/')
        this.sp.spriteFrame = spf

        this.orgPos = this.node.getPosition()

        EventMgr.on(EventType.StartGashapon, this.onStartGashapon, this)
        EventMgr.on(EventType.EndGashapon, this.onEndGashapon, this)
    }

    protected onDestroy(): void {
        EventMgr.off(EventType.StartGashapon, this.onStartGashapon, this)
        EventMgr.off(EventType.EndGashapon, this.onEndGashapon, this)
    }

    onStartGashapon(): void {
        const power: number = 50
        const force: Vec2 = v2()
        force.x = math.randomRange(-power, power)
        force.y = power
        force.normalize().multiplyScalar(power)
        this.rigidBody.linearVelocity = force
    }

    onEndGashapon(): void {
        this.node.setPosition(this.orgPos)
        this.rigidBody.linearVelocity = v2()
    }

}


