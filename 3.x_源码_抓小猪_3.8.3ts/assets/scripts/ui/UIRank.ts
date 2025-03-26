import { Widget, _decorator, Node, Prefab, Label, instantiate } from 'cc';
import { UIBase } from './UIBase';
import { RankMgr } from '../manager/RankMgr';
import { GameMgr } from '../manager/GameMgr';
import { RankItem } from './item/RankItem';
import { DtoRank } from '../dto/DtoRank';
import { TrackMgr } from '../manager/TrackMgr';
const { ccclass, property, requireComponent } = _decorator;

@ccclass('UI/UIRank')
@requireComponent(Widget)
export class UIRank extends UIBase {

    @property(Node)
    layout: Node = null
    @property(Node)
    selfItem: Node = null
    @property(Label)
    lbLevel: Label = null

    @property(Prefab)
    rankItemPre: Prefab = null

    public onOpen(data?: any): void {
        const selfRank: number = RankMgr.getRankByName('自己')
        const isSelfOnRank: boolean = selfRank < 7
        this.selfItem.active = !isSelfOnRank
        this.lbLevel.string = `${GameMgr.CurLevel}关`

        const itemCnt: number = isSelfOnRank ? 7 : 6

        for (let i = 0; i < itemCnt; i++) {
            const rankItemNode: Node = instantiate(this.rankItemPre)
            this.layout.addChild(rankItemNode)
            const rankItem: RankItem = rankItemNode.getComponent(RankItem)
            const rankData: DtoRank = RankMgr.RankArr[i]
            rankItem.init(i, rankData)
        }
        TrackMgr.track('open_rank', { isSucc: 1 })
    }

    public onClose(data?: any): void {

    }

    onBtnCloseClick(): void {
        this.close()
    }

}


