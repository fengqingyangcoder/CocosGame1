import { Widget, _decorator, Node } from 'cc';
import { UIBase } from './UIBase';
import { UI } from '../enum/UI';
import { GameMgr } from '../manager/GameMgr';
import { GameMode } from '../enum/GameMode';
import { AudioMgr } from '../manager/AudioMgr';
import { DecMgr } from '../manager/DecMgr';
import { CollectMgr } from '../manager/CollectMgr';
import { CoinMgr } from '../manager/CoinMgr';
import { Global } from '../Global';
import { PassRewardMgr } from '../manager/PassRewardMgr';
import { CoinItem } from './item/CoinItem';
import { RedPoint } from '../misc/RedPoint';
import { AdMgr } from '../manager/AdMgr';
const { ccclass, property, requireComponent } = _decorator;

@ccclass('UI/UIMain')
@requireComponent(Widget)
export class UIMain extends UIBase {

    @property(CoinItem)
    coinItem: CoinItem = null

    @property(RedPoint)
    btnDecRedPoint: RedPoint = null
    @property(RedPoint)
    btnCollectRedPoint: RedPoint = null
    @property(RedPoint)
    btnHomeRedPoint: RedPoint = null
    @property(RedPoint)
    btnPassRewardRedPoint: RedPoint = null
    @property(RedPoint)
    btnGashaponRedPoint: RedPoint = null

    public onOpen(data?: unknown): void {
        this.coinItem.init(CoinMgr.CurCoin)
        AdMgr.showInterstitialAd()

        this.btnDecRedPoint.updateFunc = () => DecMgr.hasDecCanUnlock()
        this.btnCollectRedPoint.updateFunc = () => CollectMgr.hasCollectCanUnlock()
        this.btnHomeRedPoint.updateFunc = () => CoinMgr.CurCoin >= Global.HomePeice_Unlock_Cost
        this.btnGashaponRedPoint.updateFunc = () => CoinMgr.CurCoin >= Global.Gashapon_One_Cost
        this.btnPassRewardRedPoint.updateFunc = () => !PassRewardMgr.isAllGet() && PassRewardMgr.canGetReward()

        AudioMgr.playBgm('主界面音乐')
    }

    public onClose(data?: unknown): void {
        AudioMgr.stopBgm()
    }

    onBtnStartClick(): void {
        GameMgr.Mode = GameMode.Normal
        GameMgr.startGame()
        this.delayClose(0.5)
    }

    onBtnSuperClick(): void {
        GameMgr.Mode = GameMode.Super
        GameMgr.SuperLevel = 1
        GameMgr.startGame()
        this.delayClose(0.5)
    }

    onBtnSettingClick(): void {
        this.open(UI.Setting)
    }

    onBtnGashaponClick(): void {
        this.close()
        this.open(UI.Gashapon)
    }

    onBtnCollectClick(): void {
        this.open(UI.Collect)
    }

    onBtnDecorationClick(): void {
        this.open(UI.Decoration)
    }

    onBtnHomeClick(): void {
        this.close()
        this.open(UI.Home)
    }

    onBtnRewardClick(): void {
        this.open(UI.PassReward)
    }

    onBtnRankClick(): void {
        this.open(UI.Rank)
    }

}


