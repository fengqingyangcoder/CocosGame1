import { CfgGashapon } from "../config/cfg_gashapon";
import { DtoGashapon } from "../dto/DtoGashapon";
import { DtoReward } from "../dto/DtoReward";
import { MathUtil } from "../util/MathUtil";

export class GashaponMgr {

    public static getRandId(): number {
        const weightArr: number[] = []
        for (let i = 0; i < CfgGashapon.length; i++) {
            const data: DtoGashapon = CfgGashapon[i];
            weightArr.push(data.weight)
        }
        return MathUtil.randWeight(weightArr)
    }

    public static getRandReward(): DtoReward {
        const id: number = this.getRandId()
        const gashaponData: DtoGashapon = CfgGashapon[id]
        const rewardData: DtoReward = {
            itemId: gashaponData.itemId,
            cnt: gashaponData.cnt
        }
        return rewardData
    }

}


