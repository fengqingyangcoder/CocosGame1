import { _decorator, Button, Component, Enum, Node, Widget } from 'cc';
import { UIType } from '../enum/UIType';
import { EventMgr } from '../manager/EventMgr';
import { EventType } from '../enum/EventType';
const { ccclass, property, requireComponent } = _decorator;

@ccclass('ScriptBase/UIBase')
@requireComponent(Widget)
export class UIBase extends Component {

    @property({ "type": Enum(UIType) })
    public uiType: UIType = UIType.Common

    public onOpen(data?: unknown): void { }

    public onClose(data?: unknown): void { }

    public open(uiName: string, data?: unknown, uiType?: UIType): void {
        EventMgr.emit(EventType.OpenUI, uiName, data, uiType)
    }

    public delayOpen(time: number, uiName: string, data?: unknown, uiType?: UIType): void {
        this.scheduleOnce(this.open.bind(this, uiName, data, uiType), time)
    }

    public close(uiName?: string, data?: unknown): void {
        if (!uiName) uiName = this.node.name
        EventMgr.emit(EventType.CloseUI, uiName, data)
    }

    public delayClose(time: number, uiName?: string, data?: unknown): void {
        this.scheduleOnce(this.close.bind(this, uiName, data), time)
    }

    public bindClick(btn: Button, node: Node, comp: string, handler: string, customData?: string): void {
        var clickEventHandler = new Component.EventHandler();
        clickEventHandler.target = node;
        clickEventHandler.component = comp;
        clickEventHandler.handler = handler;
        clickEventHandler.customEventData = customData;
        btn.clickEvents = [clickEventHandler]
    }

    public unbindClick(btn: Button): void {
        btn.clickEvents = []
    }

}



