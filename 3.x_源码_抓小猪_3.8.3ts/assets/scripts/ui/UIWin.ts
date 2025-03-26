import { Widget, _decorator, Node, tween, v3, Label, Vec2, v2, math, Tween } from 'cc';
import { UIBase } from './UIBase';
import { GameMgr } from '../manager/GameMgr';
import { AudioMgr } from '../manager/AudioMgr';
import { Global } from '../Global';
import { CoinMgr } from '../manager/CoinMgr';
import { ArrayUtil } from '../util/ArrayUtil';
import { InputBlock } from '../misc/InputBlock';
import { TimeMgr } from '../manager/TimeMgr';
import { CoinItem } from './item/CoinItem';
import { UI } from '../enum/UI';
import { AdMgr } from '../manager/AdMgr';
import { RankMgr } from '../manager/RankMgr';
import { TrackMgr } from '../manager/TrackMgr';
const { ccclass, property, requireComponent } = _decorator;

@ccclass('UI/UIWin')
@requireComponent(Widget)
export class UIWin extends UIBase {

    @property(Node)
    pointer: Node = null
    @property(Label)
    lbCoin: Label = null
    @property(CoinItem)
    coinItem: CoinItem = null

    private coin: number = 0
    public set Coin(v: number) {
        this.coin = Math.max(v, 0)
        this.lbCoin.string = `x${this.coin}`
    }

    private multi: number = 1

    private readonly posArr: Vec2[] = [
        v2(-180, -16),
        v2(0, 80),
        v2(90, 140),
        v2(150, 180)
    ]

    private readonly multiArr: number[] = [2, 3, 4, 3]

    private tw: Tween<Node> = null

    public onOpen(data?: unknown): void {
        AudioMgr.stopBgm()
        AudioMgr.playSfx('a通关成功')
        AdMgr.showInterstitialAd()
        TrackMgr.track('game_win', { mode: GameMgr.GameModeName, level: GameMgr.GameLevelId })
        this.coinItem.init(CoinMgr.CurCoin)

        GameMgr.Pause = true

        const duration: number = 0.75
        this.tw = tween(this.pointer).sequence(
            tween(this.pointer).to(duration, { position: v3(180, -170) }),
            tween(this.pointer).to(duration, { position: v3(-180, -170) })
        ).repeatForever().start()

        this.Coin = Global.Normal_Level_Coin_Default_Cnt + (GameMgr.CurLevel - 1) * Global.Normal_Level_Coin_Add_Cnt
        CoinMgr.CurCoin += this.coin
        RankMgr.updateRankData()
    }

    public onClose(data?: unknown): void {
        GameMgr.Pause = false
        InputBlock.Active = false
    }

    async onBtnMultiClick() {
        const onSucc = async (count?: number) => {
            TrackMgr.track('get_level_reward', { is_video: '看' })
            this.tw.stop()
            const idx: number = ArrayUtil.pickItem([0, 0, 0, 0, 0, 1, 2, 3])
            this.multi = this.multiArr[idx]
            const posRange: Vec2 = this.posArr[idx]
            const posX: number = math.randomRangeInt(posRange.x, posRange.y)
            this.pointer.setPosition(posX, -170)

            const extraCoin: number = (this.multi - 1) * this.coin
            this.Coin = this.multi * this.coin

            CoinMgr.CurCoin += extraCoin
            this.coinItem.updateCoin(CoinMgr.CurCoin)

            GameMgr.CurLevel++
            InputBlock.Active = true
            await TimeMgr.delay(2)
            GameMgr.startGame()
            this.close()
        }

        const onFail = () => {
            this.open(UI.Toast, '激励视频播放未完成')
        }


        const onError = () => {
            this.open(UI.Toast, '暂时没有合适的广告')
        }

        AdMgr.showRewardedVideo(onSucc, onFail, onError)
    }

    async onBtnNextClick() {
        this.coinItem.updateCoin(CoinMgr.CurCoin)
        TrackMgr.track('get_level_reward', { is_video: '没看' })

        GameMgr.CurLevel++
        InputBlock.Active = true
        await TimeMgr.delay(2)
        GameMgr.startGame()
        this.close()
    }

}


