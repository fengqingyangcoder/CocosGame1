import { _decorator, Component, Node } from 'cc';
import { TimeMgr } from '../manager/TimeMgr';
const { ccclass, property } = _decorator;

@ccclass('Game/SuperModeTip')
export class SuperModeTip extends Component {

    @property(Node)
    tip0: Node = null
    @property(Node)
    tip1: Node = null

    async start() {
        this.tip0.active = true
        this.tip1.active = false

        await TimeMgr.delay(1)
        this.tip0.active = false
        this.tip1.active = true
    }

}


