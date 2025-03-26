import { ItemType } from "../enum/ItemType"
import { Debug } from "../util/Debug"
import { StorageUtil } from "../util/StorageUtil"
import { ItemMgr } from "./ItemMgr"

const Tag: string = 'CollectMgr'

export class CollectMgr {

    private static unlockedArr: number[] = []
    public static get UnlockedArr(): number[] {
        return this.unlockedArr
    }

    public static get Cnt(): number {
        let cnt: number = 0
        const itemDic = ItemMgr.ItemDic
        for (const key in ItemMgr.ItemDic) {
            if (Object.prototype.hasOwnProperty.call(itemDic, key)) {
                const itemId: number = Number(key)
                const itemType: ItemType = ItemMgr.getType(itemId)
                if (itemType === ItemType.Collection) cnt++
            }
        }
        return cnt
    }

    public static init(): void {
        this.unlockedArr = StorageUtil.getObj('unlockedCollectArr', [])
    }

    public static has(id: number): boolean {
        return !!ItemMgr.ItemDic[id]
    }

    public static isUnlocked(id: number): boolean {
        return this.unlockedArr.includes(id)
    }

    public static canUnlock(id: number): boolean {
        return this.has(id) && !this.unlockedArr.includes(id)
    }

    public static add(id: number): void {
        if (this.has(id)) {
            Debug.Warn(Tag, `已有id为${id}的图鉴`)
            return
        }
        ItemMgr.setItem(id, 1)
    }

    public static unlock(id: number): void {
        if (this.isUnlocked(id)) {
            Debug.Warn(Tag, `已解锁id为${id}的图鉴`)
            return
        }
        this.unlockedArr.push(id)
        this.unlockedArr.sort()
        StorageUtil.setObj('unlockedCollectArr', this.unlockedArr)
    }

    public static hasCollectCanUnlock(): boolean {
        return this.Cnt > this.unlockedArr.length
    }

}

globalThis.CollectMgr = CollectMgr
