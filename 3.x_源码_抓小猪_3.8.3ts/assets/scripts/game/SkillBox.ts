import { _decorator, Component, Label, Node, Sprite, SpriteFrame, tween, v3, Vec3 } from 'cc';
import { SkillMgr } from '../manager/SkillMgr';
import { SkillType } from '../enum/SkillType';
import { Debug } from '../util/Debug';
import { UIMgr } from '../manager/UIMgr';
import { UI } from '../enum/UI';
import { GameMgr } from '../manager/GameMgr';
import { EventMgr } from '../manager/EventMgr';
import { EventType } from '../enum/EventType';
const { ccclass, property } = _decorator;

const Tag: string = 'SkillBox'

@ccclass('Game/SkillBox')
export class SkillBox extends Component {

    @property([Label])
    skillCntTips: Label[] = []

    @property([SpriteFrame])
    skillIcons: SpriteFrame[] = []

    protected onLoad(): void {
        EventMgr.on(EventType.UpdateSkillCnt, this.onUpdateSkillCnt, this)
        EventMgr.on(EventType.AddSkill, this.onAddSkill, this)
    }

    protected start(): void {
        for (let i = 0; i < this.skillCntTips.length; i++) {
            const skillCntTip: Label = this.skillCntTips[i]
            const cnt: number = SkillMgr.skillCnt(i)
            skillCntTip.string = `${cnt}`
            skillCntTip.node.parent.active = cnt > 0
        }
    }

    protected onDestroy(): void {
        EventMgr.off(EventType.UpdateSkillCnt, this.onUpdateSkillCnt, this)
        EventMgr.off(EventType.AddSkill, this.onAddSkill, this)
    }

    onUpdateSkillCnt(skill: SkillType, cnt: number): void {
        const skillCntTip: Label = this.skillCntTips[skill]
        skillCntTip.string = `${cnt}`
        skillCntTip.node.parent.active = cnt > 0
    }

    onAddSkill(skill: SkillType): void {
        const flySkillNode: Node = new Node()
        const sp: Sprite = flySkillNode.addComponent(Sprite)
        sp.spriteFrame = this.skillIcons[skill]
        this.node.parent.addChild(flySkillNode)
        const btnSkillNode: Node = this.node.children[skill]
        const tw = tween(flySkillNode)
        tw.set({ scale: v3(0, 0, 0) })
        tw.to(0.2, { scale: v3(1, 1, 1) }, { easing: 'backOut' })
        tw.delay(0.1)
        tw.parallel(
            tween(flySkillNode).to(0.5, { worldPosition: btnSkillNode.worldPosition }),
            tween(flySkillNode).to(0.5, { scale: v3(0.5, 0.5, 0.5) }),
        )
        tw.call(() => {
            flySkillNode.destroy()
            tween(btnSkillNode).to(0.2, { scale: v3(1.2, 1.2, 1) }).to(0.2, { scale: v3(1, 1, 1) }).start()
        })
        tw.start()
    }

    onBtnFreezeClick(): void {
        if (SkillMgr.hasSkill(SkillType.Freeze)) {
            SkillMgr.useSkill(SkillType.Freeze)
        } else {
            UIMgr.open(UI.Skill, SkillType.Freeze)
            Debug.Warn(Tag, '冰冻道具数量不足，使用失败')
        }
    }

    onBtnEraseClick(): void {
        if (SkillMgr.hasSkill(SkillType.Erase)) {
            if (GameMgr.curIdArr.length <= 0) {
                UIMgr.open(UI.Toast, '放置栏不能没有物品')
                return
            }
            SkillMgr.useSkill(SkillType.Erase)
        } else {
            UIMgr.open(UI.Skill, SkillType.Erase)
            Debug.Warn(Tag, '移除道具数量不足，使用失败')
        }
    }

    onBtnMoveClick(): void {
        if (SkillMgr.hasSkill(SkillType.Move)) {
            if (GameMgr.curIdArr.length <= 0) {
                UIMgr.open(UI.Toast, '放置栏不能没有物品')
                return
            }
            SkillMgr.useSkill(SkillType.Move)
        } else {
            UIMgr.open(UI.Skill, SkillType.Move)
            Debug.Warn(Tag, '移出道具数量不足，使用失败')
        }
    }

}


