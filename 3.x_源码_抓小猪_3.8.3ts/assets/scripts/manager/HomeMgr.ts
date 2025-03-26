import { ArrayUtil } from "../util/ArrayUtil"
import { StorageUtil } from "../util/StorageUtil"
import { TrackMgr } from "./TrackMgr"

export class HomeMgr {

    private static unlockedHome: Object = {}

    public static init(): void {
        this.unlockedHome = StorageUtil.getObj('unlockedHome', { 0: [] })
    }

    public static unlock(id: number): void {
        if (!this.unlockedHome.hasOwnProperty(id)) {
            this.unlockedHome[id] = []
        }
        const unlockedArr: number[] = this.unlockedHome[id]
        const restArr: number[] = ArrayUtil.removeMultiIdx([0, 1, 2, 3, 4, 5, 6, 7, 8], unlockedArr)
        if (restArr.length <= 0) {
            return
        }
        const idx: number = ArrayUtil.pickItem(restArr)
        unlockedArr.push(idx)
        unlockedArr.sort()
        StorageUtil.setObj('unlockedHome', this.unlockedHome)
        TrackMgr.track('unlock_home')
    }

    public static isUnlocked(id: number, idx: number): boolean {
        const unlockedArr: number[] = this.unlockedHome[id]
        if (!unlockedArr) return null
        return unlockedArr.includes(idx)
    }

    public static isAllUnlocked(id: number): boolean {
        const unlockedArr: number[] = this.unlockedHome[id]
        if (!unlockedArr) return false
        return unlockedArr.length >= 9
    }

    public static canUnlock(id: number): boolean {
        if (id <= 0) return true
        const preId: number = id - 1
        const unlockedArr: number[] = this.unlockedHome[preId]
        if (!unlockedArr) return false
        return unlockedArr.length >= 9
    }

}

globalThis.HomeMgr = HomeMgr

