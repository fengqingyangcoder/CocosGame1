import { _decorator, Button, Component, EventHandler, Node } from 'cc';
import { AudioMgr } from '../manager/AudioMgr';
import { EventType } from '../enum/EventType';
const { ccclass, property, disallowMultiple, requireComponent } = _decorator;

@ccclass('UIExtend/BtnExtend')
@disallowMultiple(true)
@requireComponent(Button)
export class BtnExtend extends Component {
    @property({ range: [0, 1, 0.1], slide: true })
    public safeTime: number = 0.5

    @property
    clickSfx: string = 'btnClick'

    private btn: Button = null

    private clickEvents: EventHandler[]

    private isSafe: boolean = true

    onLoad() {
        this.btn = this.getComponent(Button)
        this.btn.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this)
        this.btn.node.on(EventType.Click, this.onClick, this)
    }

    onTouchStart(): void {
        this.handleClickSfx()
    }

    onClick(): void {
        this.handleSafe()
    }

    handleSafe(): void {
        if (!this.isSafe) return
        this.isSafe = false
        this.clickEvents = this.btn.clickEvents
        this.btn.clickEvents = []
        this.scheduleOnce(() => {
            this.isSafe = true
            this.btn.clickEvents = this.clickEvents
        }, this.safeTime)
    }

    handleClickSfx(): void {
        this.clickSfx && AudioMgr.playSfx(this.clickSfx)
    }
}


