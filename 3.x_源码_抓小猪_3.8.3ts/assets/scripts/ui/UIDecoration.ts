import { Widget, _decorator, Node, Prefab, instantiate } from 'cc';
import { UIBase } from './UIBase';
import { CfgDec, DtoDec } from '../config/CfgDec';
import { DecItem } from './item/DecItem';
import { StorageUtil } from '../util/StorageUtil';
import { DecMgr } from '../manager/DecMgr';
import { CollectMgr } from '../manager/CollectMgr';
const { ccclass, property, requireComponent } = _decorator;

@ccclass('UI/UIDecoration')
@requireComponent(Widget)
export class UIDecoration extends UIBase {

    @property(Prefab)
    decItemPre: Prefab = null

    @property(Node)
    content: Node = null

    public onOpen(data?: any): void {
        const decCnt: number = CfgDec.length
        for (let i = 0; i < decCnt; i++) {
            const decData: DtoDec = CfgDec[i];
            this.createDecItem(decData)
        }
    }

    public onClose(data?: any): void {

    }

    onBtnCloseClick(): void {
        this.close()
    }

    createDecItem(data: DtoDec): void {
        const decItemNode: Node = instantiate(this.decItemPre)
        this.content.addChild(decItemNode)
        const decItem: DecItem = decItemNode.getComponent(DecItem)
        decItem.Data = data
    }

    onTest(){
        const curCatchedPigCnt:number = CollectMgr.Cnt
        StorageUtil.setItem('curCatchedPigCnt',curCatchedPigCnt + 1)
        const decItems: DecItem[] = this.node.getComponentsInChildren(DecItem)
        for (let i = 0; i < decItems.length; i++) {
            const decItem: DecItem = decItems[i];
            decItem.updateData()
        }
    }

    onReset(){
        StorageUtil.setItem('curCatchedPigCnt',0)
        DecMgr.reset()
        const decItems: DecItem[] = this.node.getComponentsInChildren(DecItem)
        for (let i = 0; i < decItems.length; i++) {
            const decItem: DecItem = decItems[i];
            decItem.updateData()
        }
    }

}


