import { _decorator, Component, macro, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Misc/RedPoint')
export class RedPoint extends Component {

    public updateFunc: () => boolean = null

    protected onDestroy(): void {
        this.unscheduleAllCallbacks()
    }

    protected start(): void {
        this.onUpdate()
        this.schedule(this.onUpdate, 1, macro.REPEAT_FOREVER)
    }

    onUpdate(): void {
        if (!this.updateFunc) return
        this.node.active = this.updateFunc()
    }

}


