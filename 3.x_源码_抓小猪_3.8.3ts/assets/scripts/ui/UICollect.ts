import { Prefab, Widget, _decorator, Node, instantiate, Label } from 'cc';
import { UIBase } from './UIBase';
import { CollectItem } from './item/CollectItem';
import { CfgItem, DtoItem } from '../config/CfgItem';
import { ItemType } from '../enum/ItemType';
import { CollectMgr } from '../manager/CollectMgr';
const { ccclass, property, requireComponent } = _decorator;

@ccclass('UI/UICollect')
@requireComponent(Widget)
export class UICollect extends UIBase {

    @property(Prefab)
    collectItemPre: Prefab = null

    @property(Label)
    lbCnt: Label = null
    @property(Node)
    itemBox: Node = null

    public onOpen(data?: unknown): void {
        let totalCnt: number = 0
        for (let i = 0; i < CfgItem.length; i++) {
            const itemData: DtoItem = CfgItem[i];
            const { id, type } = itemData
            if (type !== ItemType.Collection) continue
            const collectItemNode: Node = instantiate(this.collectItemPre)
            this.itemBox.addChild(collectItemNode)
            const collectItem: CollectItem = collectItemNode.getComponent(CollectItem)
            collectItem.Data = itemData
            totalCnt++
        }
        this.lbCnt.string = `已收集${CollectMgr.Cnt}/${totalCnt}`
    }

    public onClose(data?: unknown): void {

    }

    onBtnCloseClick(): void {
        this.close()
    }

}


