import { Widget, _decorator } from 'cc';
import { UIBase } from './UIBase';
import { GameMgr } from '../manager/GameMgr';
import { UI } from '../enum/UI';
import { AudioMgr } from '../manager/AudioMgr';
import { CoinMgr } from '../manager/CoinMgr';
import { TimeMgr } from '../manager/TimeMgr';
import { InputBlock } from '../misc/InputBlock';
import { CoinItem } from './item/CoinItem';
import { Global } from '../Global';
import { AdMgr } from '../manager/AdMgr';
const { ccclass, property, requireComponent } = _decorator;

@ccclass('UI/UISuperWin')
@requireComponent(Widget)
export class UISuperWin extends UIBase {

    @property(CoinItem)
    coinItem: CoinItem = null

    public onOpen(data?: unknown): void {
        GameMgr.Pause = true
        this.coinItem.init(CoinMgr.CurCoin)
        AudioMgr.stopBgm()
        AudioMgr.playSfx('a通关成功')
        CoinMgr.CurCoin += Global.Super_Level_Coin_Default_Cnt
    }

    public onClose(data?: unknown): void {
        GameMgr.Pause = false
        InputBlock.Active = false
    }

    async onBtnGetClick() {
        InputBlock.Active = true
        this.coinItem.updateCoin(CoinMgr.CurCoin)
        await TimeMgr.delay(2)
        GameMgr.quitGame()
        await TimeMgr.delay(0.5)
        this.close()
        this.open(UI.Main)
    }

}


