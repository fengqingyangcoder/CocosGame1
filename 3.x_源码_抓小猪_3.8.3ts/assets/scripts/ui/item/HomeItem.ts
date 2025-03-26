import { _decorator, Component, instantiate, Node, ParticleSystem2D, Prefab, v2 } from 'cc';
import { HomePieceItem } from './HomePieceItem';
import { HomeMgr } from '../../manager/HomeMgr';
import { CoinMgr } from '../../manager/CoinMgr';
import { Global } from '../../Global';
import { UIMgr } from '../../manager/UIMgr';
import { UI } from '../../enum/UI';
import { EventMgr } from '../../manager/EventMgr';
import { EventType } from '../../enum/EventType';
import { AudioMgr } from '../../manager/AudioMgr';
import { Bundle } from '../../enum/Bundle';
import { EffectMgr } from '../../manager/EffectMgr';
import { ResMgr } from '../../manager/ResMgr';
const { ccclass, property } = _decorator;

@ccclass('Item/HomeItem')
export class HomeItem extends Component {

    @property(Prefab)
    homePieceItemPre: Prefab = null
    @property(Node)
    btnUnlock: Node = null
    @property(Node)
    lock: Node = null
    @property(Node)
    content: Node = null

    private id: number = 0

    protected onLoad(): void {
        EventMgr.on(EventType.UnlockHomePeice, this.updateState, this)
    }

    protected start(): void {
        this.id = this.node.getSiblingIndex()
        for (let i = 0; i < 9; i++) {
            const homePieceItemNode: Node = instantiate(this.homePieceItemPre)
            this.content.addChild(homePieceItemNode)
            const homePieceItem: HomePieceItem = homePieceItemNode.getComponent(HomePieceItem)
            homePieceItem.Id = this.id
        }
        this.updateState()
    }

    protected onDestroy(): void {
        EventMgr.off(EventType.UnlockHomePeice, this.updateState, this)
    }

    onBtnUnlockClick(): void {
        if (CoinMgr.CurCoin < Global.HomePeice_Unlock_Cost) {
            UIMgr.open(UI.Toast, '金币不足')
            return
        }
        AudioMgr.playSfx('a家园解锁')
        CoinMgr.CurCoin -= Global.HomePeice_Unlock_Cost
        EventMgr.emit(EventType.UpdateCoin, CoinMgr.CurCoin, false)
        HomeMgr.unlock(this.id)
        EventMgr.emit(EventType.UnlockHomePeice)
        if (HomeMgr.isAllUnlocked(this.id)) {
            const shinningPre: Prefab = ResMgr.getRes(Bundle.UI, 'Shinning', 'particle/')
            const shinningNode: Node = EffectMgr.create(shinningPre, this.node)
            const particle: ParticleSystem2D = shinningNode.getComponent(ParticleSystem2D)
            particle.posVar = v2(360, 800)
            particle.totalParticles = 30
            particle.emissionRate = 15
            AudioMgr.playSfx('a通关成功')
        }
    }

    updateState(): void {
        const canUnlock: boolean = HomeMgr.canUnlock(this.id)
        const isAllUnlocked: boolean = HomeMgr.isAllUnlocked(this.id)
        this.btnUnlock.active = canUnlock && !isAllUnlocked
        this.lock.active = !canUnlock
    }

}


