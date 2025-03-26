import { Widget, _decorator, Node } from 'cc';
import { UIBase } from './UIBase';
import { UI } from '../enum/UI';
import { CoinMgr } from '../manager/CoinMgr';
import { Global } from '../Global';
import { EventMgr } from '../manager/EventMgr';
import { EventType } from '../enum/EventType';
import { CoinItem } from './item/CoinItem';
import { GashaponMgr } from '../manager/GashaponMgr';
import { AudioMgr } from '../manager/AudioMgr';
import { DtoReward } from '../dto/DtoReward';
import { ItemMgr } from '../manager/ItemMgr';
import { InputBlock } from '../misc/InputBlock';
import { TimeMgr } from '../manager/TimeMgr';
import { AdMgr } from '../manager/AdMgr';
import { TrackMgr } from '../manager/TrackMgr';
const { ccclass, property, requireComponent } = _decorator;

@ccclass('UI/UIGashapon')
@requireComponent(Widget)
export class UIGashapon extends UIBase {

    @property(CoinItem)
    coinItem: CoinItem = null

    public onOpen(data?: any): void {
        this.coinItem.init(CoinMgr.CurCoin)
    }

    public onClose(data?: any): void {
    }

    onBtnCloseClick(): void {
        this.close()
        this.open(UI.Main)
    }

    async onBtnOneClick() {
        if (CoinMgr.CurCoin < Global.Gashapon_One_Cost) {
            this.open(UI.Toast, '金币不足')
            return
        }
        AudioMgr.playSfx('a摇晃扭蛋')
        EventMgr.emit(EventType.StartGashapon)
        TrackMgr.track('gashapon', { mode: '单次' })
        CoinMgr.CurCoin -= Global.Gashapon_One_Cost
        CoinMgr.fakeCoin = CoinMgr.CurCoin
        this.coinItem.updateCoin(CoinMgr.CurCoin, false)

        const rewardData: DtoReward = GashaponMgr.getRandReward()
        const { itemId, cnt } = rewardData
        ItemMgr.updateItem(itemId, cnt)

        InputBlock.Active = true
        await TimeMgr.delay(2)
        InputBlock.Active = false
        EventMgr.emit(EventType.EndGashapon)

        this.open(UI.GetReward, [rewardData])

    }

    async onBtnTwoClick() {
        const onSucc = async (count?: number) => {
            TrackMgr.track('gashapon', { mode: '看视频' })
            AudioMgr.playSfx('a摇晃扭蛋')
            EventMgr.emit(EventType.StartGashapon)
            CoinMgr.fakeCoin = CoinMgr.CurCoin
            const rewardArr: DtoReward[] = []
            for (let i = 0; i < 2; i++) {
                const reward: DtoReward = GashaponMgr.getRandReward()
                const { itemId, cnt } = reward
                ItemMgr.updateItem(itemId, cnt)
                rewardArr.push(reward)
            }

            InputBlock.Active = true
            await TimeMgr.delay(2)
            InputBlock.Active = false
            EventMgr.emit(EventType.EndGashapon)

            this.open(UI.GetReward, rewardArr)
        }

        const onFail = () => {
            this.open(UI.Toast, '激励视频播放未完成')
        }

        const onError = () => {
            this.open(UI.Toast, '暂时没有合适的广告')
        }

        AdMgr.showRewardedVideo(onSucc, onFail, onError)
    }

    async onBtnTenClick() {
        if (CoinMgr.CurCoin < Global.Gashapon_Ten_Cost) {
            this.open(UI.Toast, '金币不足')
            return
        }
        AudioMgr.playSfx('a摇晃扭蛋')
        EventMgr.emit(EventType.StartGashapon)
        TrackMgr.track('gashapon', { mode: '十连' })

        CoinMgr.CurCoin -= Global.Gashapon_Ten_Cost
        CoinMgr.fakeCoin = CoinMgr.CurCoin
        this.coinItem.updateCoin(CoinMgr.CurCoin, false)

        const rewardArr: DtoReward[] = []
        for (let i = 0; i < 10; i++) {
            const reward: DtoReward = GashaponMgr.getRandReward()
            const { itemId, cnt } = reward
            ItemMgr.updateItem(itemId, cnt)
            rewardArr.push(reward)
        }

        InputBlock.Active = true
        await TimeMgr.delay(2)
        InputBlock.Active = false
        EventMgr.emit(EventType.EndGashapon)

        this.open(UI.GetReward, rewardArr)
    }

}


