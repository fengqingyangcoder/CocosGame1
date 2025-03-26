import { _decorator, Button, Component, Node } from 'cc';
const { ccclass, property, requireComponent, executeInEditMode } = _decorator;

@ccclass('UIExtend/Switcher')
@requireComponent(Button)
@executeInEditMode(true)
export class Switcher extends Component {

    @property(Node)
    on: Node

    @property(Node)
    off: Node

    private _isOn: boolean = true
    @property
    public get IsOn(): boolean {
        return this._isOn
    }
    public set IsOn(v: boolean) {
        this._isOn = v;
        if (this.on) this.on.active = v
        if (this.off) this.off.active = !v
    }

    onLoad(): void {
        this.node.on(Button.EventType.CLICK, this.onClick, this)
    }

    protected onDestroy(): void {
        this.node.off(Button.EventType.CLICK, this.onClick, this)
    }

    onClick(): void {
        this.IsOn = !this.IsOn
    }

}


