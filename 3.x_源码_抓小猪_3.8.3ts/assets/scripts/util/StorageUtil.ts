import { sys } from "cc"
import { Debug } from "./Debug"
import { PREVIEW } from "cc/env"

type SimpleType = number | string | boolean

const Tag: string = 'StorageUtil'

const Id: string = 'zxz'

export class StorageUtil {

    public static setItem(key: string, value: SimpleType, log: boolean = true): void {
        if (typeof value === "boolean") value = Number(value)
        const full_key: string = this.getFullKey(key)
        log && Debug.Log(Tag, `保存${full_key},值为:`, value)
        sys.localStorage.setItem(full_key, String(value))
    }

    /**存放对象或者数组 */
    public static setObj(key: string, obj: Object | any[], log: boolean = true): void {
        let str: string = JSON.stringify(obj)
        const full_key: string = this.getFullKey(key)
        log && Debug.Log(Tag, `保存${full_key},值为:`, str)
        sys.localStorage.setItem(full_key, str)
    }

    public static getItem(key: string, defaultValue?: SimpleType): any {
        const full_key: string = this.getFullKey(key)
        let value: string = sys.localStorage.getItem(full_key)
        if (value) return JSON.parse(value)
        Debug.Log(Tag, `${full_key}使用默认值:`, defaultValue)
        return defaultValue
    }

    /**获取对象或者数组 */
    public static getObj(key: string, defaultValue?: Object | any[]): any {
        const full_key: string = this.getFullKey(key)
        let str: string = sys.localStorage.getItem(full_key)
        if (str) return JSON.parse(str)
        Debug.Log(Tag, `${full_key}使用默认值:`, defaultValue)
        return defaultValue
    }

    public static removeItem(key: string): void {
        const full_key: string = this.getFullKey(key)
        sys.localStorage.removeItem(full_key)
    }

    public static clear(): void {
        sys.localStorage.clear()
    }

    private static getFullKey(key: string): string {
        return `${Id}_${key}`
    }

}

if (PREVIEW) {
    globalThis.StorageUtil = StorageUtil
}