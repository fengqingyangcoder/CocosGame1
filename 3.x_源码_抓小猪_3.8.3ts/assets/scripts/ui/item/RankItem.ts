import { _decorator, Component, Label, Node, Sprite } from 'cc';
import { DtoRank } from '../../dto/DtoRank';
import { ResMgr } from '../../manager/ResMgr';
import { Bundle } from '../../enum/Bundle';
const { ccclass, property } = _decorator;

@ccclass('Item/RankItem')
export class RankItem extends Component {

    @property(Sprite)
    bg: Sprite = null
    @property(Sprite)
    rankIcon: Sprite = null
    @property(Label)
    lbName: Label = null
    @property(Label)
    lbLevel: Label = null

    public init(rank: number, data: DtoRank): void {
        const { name, level } = data
        const bgName: string = rank < 3 ? 'ph_tiao1' : 'ph_tiao2'
        this.bg.spriteFrame = ResMgr.getSpriteFrame(Bundle.UI, bgName, 'image/uiRank/')
        this.rankIcon.spriteFrame = ResMgr.getSpriteFrame(Bundle.UI, `ph_mingci${rank}`, 'image/uiRank/')
        this.lbName.string = name
        this.lbLevel.string = `${level}关`
    }

}


