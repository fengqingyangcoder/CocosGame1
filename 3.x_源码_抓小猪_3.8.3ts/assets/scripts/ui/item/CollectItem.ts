import { _decorator, Button, Component, Material, Node, Sprite, SpriteFrame } from 'cc';
import { ResMgr } from '../../manager/ResMgr';
import { Bundle } from '../../enum/Bundle';
import { UIMgr } from '../../manager/UIMgr';
import { UI } from '../../enum/UI';
import { CfgItem, DtoItem } from '../../config/CfgItem';
import { CollectMgr } from '../../manager/CollectMgr';
const { ccclass, property } = _decorator;

@ccclass('Item/CollectItem')
export class CollectItem extends Component {

    @property(Sprite)
    bg: Sprite = null
    @property(Sprite)
    icon: Sprite = null
    @property(Node)
    redPoint: Node = null

    @property(Material)
    matNormal: Material = null
    @property(Material)
    matBlack: Material = null

    private btn: Button = null


    private data: DtoItem = null
    public get Data(): DtoItem {
        return this.data
    }
    public set Data(v: DtoItem) {
        this.data = v;

        this.updateState()
    }

    onLoad(): void {
        this.btn = this.getComponent(Button)
    }

    updateState(): void {
        const { id, bundle, icon, type } = this.data

        const has: boolean = CollectMgr.has(id)
        const canUnlock: boolean = CollectMgr.canUnlock(id)
        const isUnlocked: boolean = CollectMgr.isUnlocked(id)
        const bgName: string = isUnlocked ? 'tjdk1' : 'tjdk2'

        this.redPoint.active = has && canUnlock && !isUnlocked
        this.btn.interactable = has && (canUnlock || isUnlocked)

        this.icon.spriteFrame = ResMgr.getSpriteFrame(bundle, icon)
        this.bg.spriteFrame = ResMgr.getSpriteFrame(Bundle.UI, bgName, 'image/uiCollect/')

        if (!has || (canUnlock && !isUnlocked)) {
            this.icon.material = this.matBlack
        } else {
            this.icon.material = this.matNormal
        }
    }

    onClick(): void {
        UIMgr.open(UI.CollectInfo, this.data)
        CollectMgr.unlock(this.data.id)
        this.updateState()
    }

}


