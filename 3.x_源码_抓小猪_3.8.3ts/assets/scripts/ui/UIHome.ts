import { Widget, _decorator, Node, PageView, math, Prefab, instantiate } from 'cc';
import { UIBase } from './UIBase';
import { UI } from '../enum/UI';
import { CoinItem } from './item/CoinItem';
import { CoinMgr } from '../manager/CoinMgr';
const { ccclass, property, requireComponent } = _decorator;

@ccclass('UI/UIHome')
@requireComponent(Widget)
export class UIHome extends UIBase {

    @property(Prefab)
    homeItemPre:Prefab = null
    @property(PageView)
    pageView: PageView = null
    @property(CoinItem)
    coinItem: CoinItem = null

    curPageIdx: number = 0

    maxPageCnt: number = 0

    public onOpen(data?: any): void {
        this.coinItem.init(CoinMgr.CurCoin)
        for (let i = 0; i < 3; i++) {
            const homeItemNode:Node = instantiate(this.homeItemPre)
            this.pageView.addPage(homeItemNode)
        }
        this.maxPageCnt = this.pageView.content.children.length
    }

    public onClose(data?: any): void {

    }

    onBtnCloseClick(): void {
        this.close()
        this.open(UI.Main)
    }

    onBtnLeftClick(): void {
        this.curPageIdx = math.clamp(this.curPageIdx - 1, 0, this.maxPageCnt - 1)
        console.log(this.curPageIdx)
        this.pageView.scrollToPage(this.curPageIdx, 0.5)
    }
    
    onBtnRightClick(): void {
        this.curPageIdx = math.clamp(this.curPageIdx + 1, 0, this.maxPageCnt - 1)
        console.log(this.curPageIdx)
        this.pageView.scrollToPage(this.curPageIdx, 0.5)
    }
}


