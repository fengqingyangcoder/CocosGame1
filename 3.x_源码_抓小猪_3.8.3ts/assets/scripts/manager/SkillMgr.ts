import { CfgItem, DtoItem } from "../config/CfgItem";
import { EventType } from "../enum/EventType";
import { SkillName, SkillType } from "../enum/SkillType";
import { EventMgr } from "./EventMgr";
import { ItemMgr } from "./ItemMgr";
import { TrackMgr } from "./TrackMgr";

export class SkillMgr {

    public static useSkill(skill: SkillType): void {
        const skillId: number = this.getSkillId(skill)
        const cnt: number = ItemMgr.updateItem(skillId, -1)
        EventMgr.emit(EventType.UpdateSkillCnt, skill, cnt)
        TrackMgr.track('use_skill', { skill_name: this.getSkillName(skill) })
        switch (skill) {
            case SkillType.Freeze:
                EventMgr.emit(EventType.UseSkillFreeze)
                break;
            case SkillType.Erase:
                EventMgr.emit(EventType.UseSkillErase)
                break
            case SkillType.Move:
                EventMgr.emit(EventType.UseSkillMove)
                break
        }
    }

    public static addSkill(skill: SkillType, cnt: number = 1): void {
        const skillId: number = this.getSkillId(skill)
        const curCnt: number = ItemMgr.updateItem(skillId, cnt)
        EventMgr.emit(EventType.UpdateSkillCnt, skill, curCnt)
        EventMgr.emit(EventType.AddSkill, skill)
        switch (skill) {
            case SkillType.Freeze:
                EventMgr.emit(EventType.AddSkillFreeze)
                break;
            case SkillType.Erase:
                EventMgr.emit(EventType.AddSkillErase)
                break
            case SkillType.Move:
                EventMgr.emit(EventType.AddSkillMove)
                break
        }
    }

    public static hasSkill(skill: SkillType): boolean {
        const skillId: number = this.getSkillId(skill)
        const cnt: number = ItemMgr.getCnt(skillId)
        return cnt > 0
    }

    public static skillCnt(skill: SkillType): number {
        const skillId: number = this.getSkillId(skill)
        const cnt: number = ItemMgr.getCnt(skillId)
        return cnt
    }

    public static getSkillId(skill: SkillType): number {
        for (let i = 0; i < CfgItem.length; i++) {
            const itemData: DtoItem = CfgItem[i];
            if (itemData?.skillType === skill) return itemData.id
        }
        return -1
    }

    public static getSkillName(skill: SkillType): string {
        return SkillName[skill]
    }

}