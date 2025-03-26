import { _decorator, Component, Node, tween } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Misc/Shake')
export class Shake extends Component {

    @property
    shakeAngle: number = 15
    @property
    shakeInterval: number = 0.1
    @property
    delay: number = 2

    protected start(): void {
        const tw = tween(this.node)
        tw.sequence(
            tween(this.node).delay(this.delay),
            tween(this.node).to(this.shakeInterval, { angle: this.shakeAngle }),
            tween(this.node).to(this.shakeInterval, { angle: -this.shakeAngle }),
            tween(this.node).to(this.shakeInterval, { angle: this.shakeAngle }),
            tween(this.node).to(this.shakeInterval, { angle: -this.shakeAngle }),
            tween(this.node).to(this.shakeInterval, { angle: 0 }),
        ).repeatForever().start()
    }

}


