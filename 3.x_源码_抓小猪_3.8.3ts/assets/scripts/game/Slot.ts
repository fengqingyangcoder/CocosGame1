import { _decorator, Component, tween, v3, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Game/Slot')
export class Slot extends Component {

    public orgWorldPos: Vec3

    start() {
        this.scheduleOnce(() => {
            this.orgWorldPos = this.node.getWorldPosition()
        }, 0.1)
    }

    shake(delayTime: number): void {
        tween(this.node).delay(delayTime).by(0.1, { position: v3(0, -10, 0) }).by(0.1, { position: v3(0, 10, 0) }).start()
    }

}


