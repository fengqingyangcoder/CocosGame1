import { _decorator, BlockInputEvents, Component, Node } from 'cc';
const { ccclass, requireComponent, disallowMultiple } = _decorator;

@ccclass('Misc/InputBlock')
@disallowMultiple(true)
@requireComponent(BlockInputEvents)
export class InputBlock extends Component {

    private static _inst: InputBlock
    public static set Active(v: boolean) {
        this._inst.node.active = v
    }

    onLoad(): void {
        InputBlock._inst = this
        InputBlock.Active = false
    }

    public static setActive(duration: number): void {
        this._inst.unscheduleAllCallbacks()
        this.Active = true
        this._inst.scheduleOnce(() => {
            InputBlock.Active = false
        }, duration)
    }

}


