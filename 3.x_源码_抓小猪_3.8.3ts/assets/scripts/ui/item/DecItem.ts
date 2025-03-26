import { _decorator, Button, Component, Label, Material, Node, Sprite } from 'cc';
import { CfgDec, DtoDec } from '../../config/CfgDec';
import { DecMgr } from '../../manager/DecMgr';
import { StorageUtil } from '../../util/StorageUtil';
import { ResMgr } from '../../manager/ResMgr';
import { Bundle } from '../../enum/Bundle';
import { CollectMgr } from '../../manager/CollectMgr';
const { ccclass, property } = _decorator;

@ccclass('Item/DecItem')
export class DecItem extends Component {

    @property(Sprite)
    bg: Sprite = null
    @property(Sprite)
    decType: Sprite = null
    @property(Sprite)
    decName: Sprite = null
    @property(Sprite)
    decDes: Sprite = null

    @property(Node)
    decUsing: Node = null
    @property(Node)
    decLocked: Node = null

    @property(Button)
    btnUse: Button = null
    @property(Button)
    btnUnlock: Button = null

    @property(Label)
    lbCondition: Label = null

    @property(Material)
    normalMat: Material = null
    @property(Material)
    grayMat: Material = null

    private data: DtoDec = null
    public get Data(): DtoDec {
        return this.data
    }
    public set Data(v: DtoDec) {
        this.data = v;
        const id: number = v.id
        this.id = id

        this.decType.spriteFrame = ResMgr.getSpriteFrame(Bundle.UI, `type_${id}`, 'image/uiDecoration/')
        this.decName.spriteFrame = ResMgr.getSpriteFrame(Bundle.UI, `name_${id}`, 'image/uiDecoration/')
        this.decDes.spriteFrame = ResMgr.getSpriteFrame(Bundle.UI, `des_${id}`, 'image/uiDecoration/')

        this.updateData()

    }

    private id: number = 0

    private isUsing: boolean = false
    public get IsUsing(): boolean {
        return this.isUsing
    }
    public set IsUsing(v: boolean) {
        this.isUsing = v;
        this.decUsing.active = v
    }

    private isUnlocked: boolean = false
    public get IsUnlocked(): boolean {
        return this.isUnlocked
    }
    public set IsUnlocked(v: boolean) {
        this.isUnlocked = v;
        this.decLocked.active = !v
        const mat: Material = v ? this.normalMat : this.grayMat
        this.bg.material = mat
        this.decType.material = mat
        this.decName.material = mat
        this.decDes.material = mat
    }

    updateData(): void {

        const id: number = this.id

        this.IsUnlocked = DecMgr.isUnlocked(id)
        this.IsUsing = DecMgr.isUsing(id)

        const curCatchedPigCnt: number = CollectMgr.Cnt
        const needCatchedPigCnt: number = CfgDec[id].needCatchedPigCnt

        const canUnlock: boolean = DecMgr.canUnlock(id)
        this.btnUse.node.active = !this.isUsing && this.isUnlocked
        this.btnUnlock.node.active = canUnlock && !this.isUnlocked
        this.lbCondition.node.active = !canUnlock

        this.lbCondition.string = `累计捕捉${curCatchedPigCnt}/${needCatchedPigCnt}只猪`
    }

    onBtnUseClick(): void {
        DecMgr.use(this.id)
        const decItems: DecItem[] = this.node.parent.getComponentsInChildren(DecItem)
        for (let i = 0; i < decItems.length; i++) {
            const decItem: DecItem = decItems[i];
            decItem.updateData()
        }
    }

    onBtnUnlockClick(): void {
        DecMgr.unlock(this.id)
        const decItems: DecItem[] = this.node.parent.getComponentsInChildren(DecItem)
        for (let i = 0; i < decItems.length; i++) {
            const decItem: DecItem = decItems[i];
            decItem.updateData()
        }
    }

}


