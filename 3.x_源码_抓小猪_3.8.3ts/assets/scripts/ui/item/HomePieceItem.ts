import { _decorator, Component, Prefab, Sprite, SpriteFrame } from 'cc';
import { ResMgr } from '../../manager/ResMgr';
import { Bundle } from '../../enum/Bundle';
import { HomeMgr } from '../../manager/HomeMgr';
import { EventMgr } from '../../manager/EventMgr';
import { EventType } from '../../enum/EventType';
import { EffectMgr } from '../../manager/EffectMgr';
const { ccclass, property } = _decorator;

@ccclass('Item/HomePieceItem')
export class HomePieceItem extends Component {

    private sp: Sprite = null

    private id: number = 0
    public get Id(): number {
        return this.id
    }
    public set Id(v: number) {
        this.id = v;
        this.updateState()
    }

    private isUnlocked: boolean = false

    protected onLoad(): void {
        this.sp = this.getComponent(Sprite)
        EventMgr.on(EventType.UnlockHomePeice, this.onUnlockHomePeice, this)
    }

    protected onDestroy(): void {
        EventMgr.off(EventType.UnlockHomePeice, this.onUnlockHomePeice, this)
    }

    updateState(): void {
        const idx: number = this.node.getSiblingIndex()
        const isUnlocked: boolean = HomeMgr.isUnlocked(this.id, idx)
        this.isUnlocked = isUnlocked
        const spfName: string = isUnlocked ? `${idx}` : `${idx}_1`
        const spf: SpriteFrame = ResMgr.getSpriteFrame(Bundle.UI, spfName, `image/uiHome/${this.id}/`)
        this.sp.spriteFrame = spf
    }

    onUnlockHomePeice(): void {
        const wasUnlocked: boolean = this.isUnlocked
        this.updateState()
        if (!wasUnlocked && this.isUnlocked) {
            const shinningPre: Prefab = ResMgr.getRes(Bundle.UI, 'Shinning', 'particle/')
            EffectMgr.create(shinningPre, this.node)
        }
    }

}


