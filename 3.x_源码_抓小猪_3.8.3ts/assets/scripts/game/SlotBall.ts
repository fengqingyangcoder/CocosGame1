import { _decorator, Tween, tween, Vec3 } from 'cc';
import { BallBase } from './BallBase';
import { GameMgr } from '../manager/GameMgr';
const { ccclass, property } = _decorator;

@ccclass('Game/SlotBall')
export class SlotBall extends BallBase {

    private curIdx: number = 0

    private tw: Tween<any> = null

    protected start(): void {
        this.curIdx = this.node.getSiblingIndex()
    }

    update(dt: number) {
        const newIdx: number = this.node.getSiblingIndex()
        if (newIdx === this.curIdx) return
        const offset: number = Math.abs(newIdx - this.curIdx)
        this.curIdx = newIdx
        const newWorldPos: Vec3 = this.getSlotWorldPos(newIdx)
        if (!newWorldPos) return
        if (this.tw) this.tw.stop()
        this.tw = tween(this.node)
        this.tw.to(0.15 * offset, { worldPosition: newWorldPos }).start()
    }

    getSlotWorldPos(idx: number): Vec3 {
        if (!GameMgr.slotBox) return null
        return GameMgr.slotBox.children[idx].worldPosition
    }

}


