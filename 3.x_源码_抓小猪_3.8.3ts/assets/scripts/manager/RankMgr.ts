import { math } from "cc";
import { CfgName } from "../config/CfgName";
import { DtoRank } from "../dto/DtoRank";
import { ObjUtil } from "../util/ObjUtil";
import { StorageUtil } from "../util/StorageUtil";
import { GameMgr } from "./GameMgr";
import { ArrayUtil } from "../util/ArrayUtil";

export class RankMgr {

    public static get RankArr(): DtoRank[] {
        const arr: DtoRank[] = []
        for (const name in this.rankData) {
            if (Object.prototype.hasOwnProperty.call(this.rankData, name)) {
                const level: number = this.rankData[name]
                arr.push({
                    name: name,
                    level: level
                })
            }
        }
        arr.push({
            name: '自己',
            level: GameMgr.CurLevel
        })
        arr.sort((a, b) => { return b.level - a.level })
        return arr
    }

    private static rankData = {}

    public static init(): void {
        this.rankData = StorageUtil.getObj('rankData', {})
        if (ObjUtil.isEmpty(this.rankData)) {
            for (let i = 0; i < CfgName.length; i++) {
                const name: string = CfgName[i]
                this.rankData[name] = math.randomRangeInt(1, 20)
            }
            StorageUtil.setObj('rankData', this.rankData)
        }
    }

    public static getRankByName(name: string): number {
        for (let i = 0; i < this.RankArr.length; i++) {
            const data: DtoRank = this.RankArr[i];
            if (data.name !== name) continue
            return i
        }
        return -1
    }

    public static updateRankData(): void {
        for (const name in this.rankData) {
            if (Object.prototype.hasOwnProperty.call(this.rankData, name)) {
                this.rankData[name] += ArrayUtil.pickItem([0, 0, 0, 1, 1, 2])
            }
        }
        StorageUtil.setObj('rankData', this.rankData)
    }

}
globalThis.RankMgr = RankMgr

