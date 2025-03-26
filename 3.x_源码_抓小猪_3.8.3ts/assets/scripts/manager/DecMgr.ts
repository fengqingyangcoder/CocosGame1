import { CfgDec, DefaultDec, DtoDec } from "../config/CfgDec"
import { Debug } from "../util/Debug"
import { StorageUtil } from "../util/StorageUtil"
import { CollectMgr } from "./CollectMgr"

const Tag: string = 'DecMgr'
const UnlockedDecsKey: string = 'unlockedDecs'
const CurUseDecKey: string = 'curUseDec'

export class DecMgr {

    private static unlockedDecs: number[] = []
    public static get UnlockedDecs(): number[] {
        return this.unlockedDecs
    }

    private static curUseDec: number = 0
    public static get CurUseDec(): number {
        return this.curUseDec
    }
    public static set CurUseDec(v: number) {
        this.curUseDec = v;
        StorageUtil.setItem(CurUseDecKey, this.curUseDec)
    }

    public static init(): void {
        this.unlockedDecs = StorageUtil.getObj(UnlockedDecsKey, [...DefaultDec])
        StorageUtil.setObj(UnlockedDecsKey, this.unlockedDecs)
        this.CurUseDec = StorageUtil.getItem(CurUseDecKey, 0)
    }

    public static unlock(id: number): void {
        if (this.isUnlocked(id)) {
            Debug.Warn(Tag, `id为${id}的装饰已被解锁，无需重复解锁`)
            return
        }
        this.unlockedDecs.push(id)
        StorageUtil.setObj(UnlockedDecsKey, this.unlockedDecs)
        Debug.Log(Tag, `解锁id为${id}的装饰`)
    }

    public static use(id: number): void {
        if (this.curUseDec === id) {
            Debug.Warn(Tag, `id为${id}的装饰已被使用，无需重复使用`)
            return
        }
        this.CurUseDec = id
    }

    public static isUnlocked(id: number): boolean {
        return this.unlockedDecs.includes(id)
    }

    public static isUsing(id: number): boolean {
        return this.curUseDec === id
    }

    public static canUnlock(id: number): boolean {
        const curCatchedPigCnt: number = CollectMgr.Cnt
        const needCatchedPigCnt: number = CfgDec[id].needCatchedPigCnt
        const preId: number = Math.max(id - 1, 0)
        const isPreUnlocked: boolean = this.isUnlocked(preId)
        return curCatchedPigCnt >= needCatchedPigCnt && isPreUnlocked
    }

    public static hasDecCanUnlock(): boolean {
        for (let i = 0; i < CfgDec.length; i++) {
            const cfg: DtoDec = CfgDec[i];
            if (this.canUnlock(cfg.id) && !this.isUnlocked(cfg.id)) return true
        }
        return false
    }

    public static reset(): void {
        this.CurUseDec = 0
        this.unlockedDecs = [...DefaultDec]
        StorageUtil.setObj(UnlockedDecsKey, this.unlockedDecs)
    }


}


