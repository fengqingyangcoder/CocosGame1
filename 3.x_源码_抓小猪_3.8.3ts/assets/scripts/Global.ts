import { PREVIEW } from "cc/env"

export class Global {

    public static Version: string = '1.0.0'

    public static Default_Item = { 0: 0, 1: 1, 2: 1, 3: 1 }

    public static Level_Time: number = 30
    public static Is_Hard_Level: boolean = false
    public static Ball_Group: number = 3
    public static Pig_Group: number = 0
    public static Pair_Group: number = 0
    public static Is_Test_Level: boolean = false

    public static Freeze_Time: number = 30

    public static Slot_Cnt: number = 7

    public static Max_Group: number = 20 //整个屏幕所能容纳的最大组数
    public static Ball_Scale: number = 1
    public static Ball_Shrink_Scale: number = 0.025
    public static Min_Ball_Scale: number = 0.6

    public static Normal_Level_Coin_Default_Cnt: number = 100
    public static Normal_Level_Coin_Add_Cnt: number = 10

    public static Super_Level_Coin_Default_Cnt: number = 1000

    public static Gashapon_One_Cost: number = 500
    public static Gashapon_Ten_Cost: number = 4500

    public static HomePeice_Unlock_Cost: number = 1111

    public static SideBar_Reward_Coin: number = 300
    public static Share_Record_Coin: number = 300
    public static Last_Inter_Ad_Show_Time: number = 0
}

if (PREVIEW) {
    globalThis.Global = Global
}

export const ks = globalThis.ks //快手
export const wx = globalThis.wx //微信
export const qq = globalThis.qq //QQ
export const qg = globalThis.qg // oppo vivo 小米
export const tt = globalThis.tt //字节
export const my = globalThis.my //支付宝

export const TAPTAP: boolean = false