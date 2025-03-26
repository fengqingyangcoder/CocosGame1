import { Widget, _decorator, Node, Label } from 'cc';
import { UIBase } from './UIBase';
const { ccclass, property, requireComponent } = _decorator;

@ccclass('UI/UIToast')
@requireComponent(Widget)
export class UIToast extends UIBase {

    lbToast: Label = null

    protected onLoad(): void {
        this.lbToast = this.getComponentInChildren(Label)
    }

    protected onDestroy(): void {
        this.unscheduleAllCallbacks()
    }

    public onOpen(data?: any): void {
        this.lbToast.string = `${data}`
        this.scheduleOnce(() => {
            this.node.destroy()
        }, 2)
    }

    public onClose(data?: any): void {

    }

}


