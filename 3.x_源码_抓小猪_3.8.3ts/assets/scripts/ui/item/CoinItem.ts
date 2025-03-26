import { _decorator, Component, Input, input, Label, math, Node, Sprite, tween, v3 } from 'cc';
import { EventMgr } from '../../manager/EventMgr';
import { EventType } from '../../enum/EventType';
import { CoinMgr } from '../../manager/CoinMgr';
import { LabelTick } from '../../uiExtend/LabelTick';
import { ResMgr } from '../../manager/ResMgr';
import { Bundle } from '../../enum/Bundle';
import { AudioMgr } from '../../manager/AudioMgr';
import { PREVIEW } from 'cc/env';
const { ccclass, property } = _decorator;

@ccclass('Item/CoinItem')
export class CoinItem extends Component {

    @property(LabelTick)
    labelTick: LabelTick = null

    public coin: number = 0

    protected onLoad(): void {
        EventMgr.emit(EventType.CoinItemShow, this)
        EventMgr.on(EventType.CoinItemShow, this.onShow, this)
        EventMgr.on(EventType.CoinItemHide, this.onHide, this)
        EventMgr.on(EventType.UpdateCoin, this.updateCoin, this)
        // PREVIEW && input.on(Input.EventType.KEY_DOWN, this.addCoin, this)
    }

    protected onDisable(): void {
        this.unscheduleAllCallbacks()
    }

    protected onDestroy(): void {
        EventMgr.emit(EventType.CoinItemHide, this)
        this.unscheduleAllCallbacks()
        EventMgr.off(EventType.UpdateCoin, this.updateCoin, this)
        EventMgr.off(EventType.CoinItemShow, this.onShow, this)
        EventMgr.off(EventType.CoinItemHide, this.onHide, this)
        // PREVIEW && input.off(Input.EventType.KEY_DOWN, this.addCoin, this)
    }

    private onShow(other: CoinItem): void {
        if (this === other) return
        this.node.active = false
    }

    private onHide(other: CoinItem): void {
        if (this === other) return
        this.node.active = true
        this.init(other.coin)
    }

    private addCoin(): void {
        if (!this.node.active) return
        CoinMgr.CurCoin += 1000
        this.updateCoin(CoinMgr.CurCoin)
    }


    public init(coin: number): void {
        this.coin = coin
        this.labelTick.init(coin)
    }

    public updateCoin(coin: number, playAnim: boolean = true): void {
        if (!this.node.active) return

        this.coin = coin
        this.labelTick.tickLabel(coin)
        const rangeX: number = 50
        const rangeY: number = 100

        if (playAnim) {
            AudioMgr.playSfx('a获得金币')
            this.schedule(() => {
                const flyCoin: Node = this.createFlyCoin()
                const posX: number = math.randomRangeInt(-rangeX, rangeX)
                const posY: number = math.randomRangeInt(-rangeY, -50)
                const tw = tween(flyCoin)
                tw.to(0.5, { position: v3(posX, posY) }, { easing: 'cubicOut' })
                tw.to(1, { position: this.node.position }, { easing: 'backIn' })
                tw.call(() => {
                    AudioMgr.playSfx('a获得金币1')
                    flyCoin.destroy()
                })
                tw.start()
            }, 0.1, 5)
        }
    }

    private createFlyCoin(): Node {
        const flyCoin: Node = new Node()
        const sp: Sprite = flyCoin.addComponent(Sprite)
        sp.spriteFrame = ResMgr.getSpriteFrame(Bundle.UI, 'zzb', 'image/common/')
        this.node.parent.addChild(flyCoin)
        return flyCoin
    }

}


