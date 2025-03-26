import { sys } from "cc"
import { EventMgr } from "../../manager/EventMgr"
import { EventType } from "../../enum/EventType"
import {  WeChat } from "./Wechat"
import { wx } from "../../Global"

const ShareSuccessDuration: number = 3000

export class WxShare {

    private static shareTime: number = 0

    private static succCallBack: Function = null
    private static failCallBack: Function = null

    public static share(succCallBack: Function, failCallBack: Function, data: Object = {}) {
        if (sys.platform !== sys.Platform.WECHAT_GAME) return
        console.log(`WxShare --> 拉起分享`)

        this.shareTime = Date.now()
        this.succCallBack = succCallBack
        this.failCallBack = failCallBack
        EventMgr.on(EventType.WxOnShow, this.onShow, this)

        wx.shareAppMessage({
            title: "",
            imageUrlId: "",
            imageUrl: ''
        })
    }

    private static onShow(res) {
        if (this.shareTime <= 0) return
        let duration: number = Date.now() - this.shareTime
        this.shareTime = 0
        if (duration >= ShareSuccessDuration) {
            console.log(`WxShare --> 分享成功`)
            WeChat.showToast("分享成功")
            this.succCallBack && this.succCallBack()
        } else {
            console.log(`WxShare --> 分享失败`)
            WeChat.showToast("分享失败")
            this.failCallBack && this.failCallBack()
        }
    }

}
