import { math } from "cc"
import { CfgPassReward } from "../config/cfg_passReward"
import { DtoPassReward } from "../dto/DtoPassReward"
import { DtoReward } from "../dto/DtoReward"
import { SkillType } from "../enum/SkillType"
import { UI } from "../enum/UI"
import { MathUtil } from "../util/MathUtil"
import { StorageUtil } from "../util/StorageUtil"
import { CoinMgr } from "./CoinMgr"
import { GameMgr } from "./GameMgr"
import { SkillMgr } from "./SkillMgr"
import { UIMgr } from "./UIMgr"

export class PassRewardMgr {

    private static rewardedArr: number[] = []

    public static get CurData(): DtoPassReward {
        const id: number = math.clamp(this.rewardedArr.length, 0, CfgPassReward.length - 1)
        const rewardData: DtoPassReward = CfgPassReward[id]
        return rewardData
    }

    public static init(): void {
        this.rewardedArr = StorageUtil.getObj('passRewardedArr', [])
    }

    public static getReward(): void {
        const id: number = this.rewardedArr.length
        this.rewardedArr.push(id)
        StorageUtil.setObj('passRewardedArr', this.rewardedArr)
        const passReward: DtoPassReward = CfgPassReward[id]
        const { coinCnt, skillCnt } = passReward
        const rewardArr: DtoReward[] = []

        const skillArr: SkillType[] = [SkillType.Freeze, SkillType.Move, SkillType.Erase]
        const skillWeights: number[] = [15, 42.5, 42.5]
        for (let i = 0; i < skillCnt; i++) {
            const skillIdx: number = MathUtil.randWeight(skillWeights)
            const skill: SkillType = skillArr[skillIdx]
            SkillMgr.addSkill(skill, 1)
            rewardArr.push({
                itemId: SkillMgr.getSkillId(skill),
                cnt: 1
            })
        }

        CoinMgr.CurCoin += coinCnt
        rewardArr.push({
            itemId: 0,
            cnt: coinCnt
        })

        UIMgr.open(UI.GetReward, rewardArr)
    }

    public static canGetReward(): boolean {
        const data: DtoPassReward = this.CurData
        return GameMgr.CurLevel > data.passLevel
    }

    public static isAllGet(): boolean {
        return this.rewardedArr.length >= CfgPassReward.length
    }

}

