import { Global } from "../Global";
import { InputBlock } from "../misc/InputBlock";
import { WxAd } from "../sdk/wx/WxAd";
import { Debug } from "../util/Debug";
import { PREVIEW, WECHAT } from "cc/env";

const Tag: string = 'AdMgr'

export class AdMgr {

    private static ad: any

    public static init() {
        if (WECHAT) this.ad = WxAd
        this.ad?.init()
    }

    public static showBanner(): void {
        if (PREVIEW) {
            Debug.Log(Tag, '预览模式下展示Banner')
            return
        }
        this.ad?.showBanner()
    }

    public static hideBanner(): void {
        if (PREVIEW) {
            Debug.Log(Tag, '预览模式下隐藏Banner')
            return
        }
        this.ad?.hideBanner()
    }

    public static showRewardedVideo(onSuccess: Function, onFail?: Function, onError?: Function): void {
        if (PREVIEW) {
            Debug.Log(Tag, '预览模式下播放激励视频直接发放奖励')
            onSuccess && onSuccess(1)
            return
        }
        InputBlock.setActive(2)
        this.ad?.showRewardedVideo(onSuccess, onFail, onError)
    }

    public static showInterstitialAd(onSuccess?: Function, onFail?: Function, onError?: Function): void {
        if (PREVIEW) {
            Debug.Log(Tag, '预览模式下展示插屏')
            onSuccess && onSuccess()
            return
        }
        if (Date.now() - Global.Last_Inter_Ad_Show_Time < 30000) {
            Debug.Log(Tag, '插屏冷却中')
            return
        }
        InputBlock.setActive(2)
        this.ad?.showInterstitialAd(onSuccess, onFail, onError)
    }

}