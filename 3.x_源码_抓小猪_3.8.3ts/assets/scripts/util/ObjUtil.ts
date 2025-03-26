export class ObjUtil {

    public static isEmpty(obj) {
        return Object.keys(obj).length === 0
    }

    public static get(obj: Object, key: string | number, defaultValue: any): any {
        if (!obj) return defaultValue
        if (!obj.hasOwnProperty(key)) return defaultValue
        return obj[key]
    }

}


