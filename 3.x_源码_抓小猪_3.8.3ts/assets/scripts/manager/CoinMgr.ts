import { math } from "cc"
import { ItemMgr } from "./ItemMgr"

export class CoinMgr {
    public static get CurCoin(): number {
        return ItemMgr.ItemDic[0] ?? 0
    }
    public static set CurCoin(v: number) {
        ItemMgr.setItem(0, math.clamp(v, 0, 9999999))
    }

    public static fakeCoin: number = 0
}

globalThis.CoinMgr = CoinMgr
