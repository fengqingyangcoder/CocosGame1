import { Widget, _decorator, Node, Sprite, SpriteFrame, Label, Tween, tween, v3 } from 'cc';
import { UIBase } from './UIBase';
import { CfgItem } from '../config/CfgItem';
import { ResMgr } from '../manager/ResMgr';
import { ItemType } from '../enum/ItemType';
import { CoinMgr } from '../manager/CoinMgr';
import { InputBlock } from '../misc/InputBlock';
import { AudioMgr } from '../manager/AudioMgr';
import { DtoReward } from '../dto/DtoReward';
import { ItemMgr } from '../manager/ItemMgr';
import { CoinItem } from './item/CoinItem';
import { UI } from '../enum/UI';
import { AdMgr } from '../manager/AdMgr';
import { TrackMgr } from '../manager/TrackMgr';
const { ccclass, property, requireComponent } = _decorator;

@ccclass('UI/UIGetReward')
@requireComponent(Widget)
export class UIGetReward extends UIBase {

    @property(Sprite)
    icon: Sprite = null
    @property(Label)
    lbCnt: Label = null
    @property(Node)
    btnDoubleGet: Node = null
    @property(Node)
    btnGet: Node = null
    @property(CoinItem)
    coinItem: CoinItem = null

    private rewardArr: DtoReward[] = []

    private tw: Tween<Node>

    private curReward: DtoReward = null
    public set CurReward(reward: DtoReward) {
        this.curReward = reward
        const { itemId, cnt } = reward
        const { bundle, icon, type } = CfgItem[itemId]
        this.lbCnt.string = `x${cnt}`
        const spf: SpriteFrame = ResMgr.getSpriteFrame(bundle, icon)
        this.icon.spriteFrame = spf

        if (type === ItemType.Collection) AudioMgr.playSfx('a通关成功')

        if (this.tw) this.tw.stop()
        this.tw = tween(this.icon.node)
        this.tw.set({ scale: v3() })
        this.tw.to(0.5, { scale: v3(1, 1, 1) }, { easing: 'backOut' })
        this.tw.start()
    }

    protected onLoad(): void {
    }

    public onOpen(data?: any): void {
        this.coinItem.init(CoinMgr.fakeCoin)
        this.rewardArr = data
        this.CurReward = this.rewardArr.shift()
    }

    public onClose(data?: any): void {

    }

    async onBtnGetClick() {
        const len: number = this.rewardArr.length
        this.btnGet.active = len > 0
        this.btnDoubleGet.active = len > 0
        TrackMgr.track('get_reward', { is_video: '看' })
        if (len <= 0) {
            await this.getItem()
            this.close()
        } else {
            await this.getItem()
            this.CurReward = this.rewardArr.shift()
        }
    }

    async onBtnDoubleClick() {
        const onSucc = async (count?: number) => {
            const len: number = this.rewardArr.length
            this.btnGet.active = len > 0
            this.btnDoubleGet.active = len > 0
            TrackMgr.track('get_reward', { is_video: '没看' })
            if (len <= 0) {
                await this.getItem(1)
                this.close()
            } else {
                await this.getItem(1)
                this.CurReward = this.rewardArr.shift()
            }
        }

        const onFail = () => {
            this.open(UI.Toast, '激励视频播放未完成')
        }

        const onError = () => {
            this.open(UI.Toast, '暂时没有合适的广告')
        }

        AdMgr.showRewardedVideo(onSucc, onFail, onError)

    }

    getItem(time: number = 0) {
        return new Promise<void>((resolve, reject) => {
            const { itemId, cnt } = this.curReward
            const itemType: ItemType = ItemMgr.getType(itemId)

            if (time > 0) {
                this.lbCnt.string = `x${(time + 1) * cnt}`
                ItemMgr.updateItem(itemId, time * cnt)
            }

            switch (itemType) {
                case ItemType.Coin:
                    this.coinItem.updateCoin(this.coinItem.coin + (time + 1) * cnt)
                    InputBlock.setActive(2)
                    this.scheduleOnce(() => {
                        resolve()
                    }, 2)
                    break;
                case ItemType.Skill:
                    resolve()
                    break
                case ItemType.Collection:
                    resolve()
                default:
                    break;
            }
        })
    }

}


