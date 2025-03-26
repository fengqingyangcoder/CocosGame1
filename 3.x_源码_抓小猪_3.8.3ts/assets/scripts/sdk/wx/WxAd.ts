import { wx } from "../../Global"
import { Debug } from "../../util/Debug"
import { WeChat } from "./Wechat"

const Tag: string = 'WxAd'

const RewardedVideoAdId: string = '' //激励视频广告id
const BannerAdId: string = '' //Banner广告id
const InterstitialId: string = '' //插屏广告id

/**
 * 微信小游戏
 */
export class WxAd {

    private static rewardedVideoAd
    private static _bannerAd

    private static _windowWidth: number
    private static _windowHeight: number

    public static init() {
        let sysInfo = wx.getSystemInfoSync()
        this._windowWidth = sysInfo.windowWidth
        this._windowHeight = sysInfo.windowHeight

        if (RewardedVideoAdId) {
            this.preloadRewardedVideo()
        }
        if (BannerAdId) {
            this.createBanner()
        }
    }

    private static preloadRewardedVideo() {
        this.rewardedVideoAd = wx.createRewardedVideoAd({ adUnitId: RewardedVideoAdId })
        this.rewardedVideoAd.load().catch((err) => {
            Debug.Error(Tag, err)
        })
    }

    public static showRewardedVideo(onSuccess: Function, onFail: Function = null, onError: Function = null): void {
        this.rewardedVideoAd = wx.createRewardedVideoAd({ adUnitId: RewardedVideoAdId })
        const errFunc = (res) => {
            Debug.Error(Tag, '激励视频播放失败:', res.errMsg)
            WeChat.showToast("视频拉取失败")
            onError && onError()
        }
        this.rewardedVideoAd.offError()
        this.rewardedVideoAd.onError(errFunc)

        this.rewardedVideoAd.show().catch((err) => {
            this.rewardedVideoAd.load().then(() => this.rewardedVideoAd.show())
        })

        const closeFunc = (res) => {
            if (!this.rewardedVideoAd) return
            //关闭
            if (res && res.isEnded || res === undefined) {
                //正常播放结束，需要下发奖励
                onSuccess && onSuccess()
            } else {
                //播放退出，不下发奖励
                WeChat.showToast("中途退出，不下发奖励")
                onFail && onFail()
            }
        }

        this.rewardedVideoAd.offClose()
        this.rewardedVideoAd.onClose(closeFunc)
    }

    public static showInterstitialAd(): void {
        if (!wx) return
        const ad = wx.createInterstitialAd({
            adUnitId: InterstitialId
        });
        ad.load().then(() => {
            ad.show().then(() => {
                Debug.Log(Tag, '插屏展示成功')
            });
        }).catch((err) => {
            Debug.Error(Tag, '插屏展示失败', err)
        })
    }


    public static createBanner(autoShow?: boolean): void {
        this._bannerAd = wx.createBannerAd({
            adUnitId: BannerAdId,
            adIntervals: 60,
            style: {
                width: this._windowWidth,
                left: 0,
                top: 0
            }
        })

        if (!this._bannerAd) {
            Debug.Error(Tag, 'Banner创建失败')
            return
        }

        this._bannerAd.onLoad(() => {
            autoShow && this.showBanner()
        })

        //如果不需要让banner在底部，则注释掉onResize回调即可
        this._bannerAd.onResize(res => {
            this._bannerAd.style.top = this._windowHeight - this._bannerAd.style.realHeight;
        })

        this._bannerAd.onError((e) => {
            Debug.Error(Tag, 'Banner报错 ', e.errCode, ' ', e.errMsg)
        })

    }

    public static showBanner(): void {
        if (!this._bannerAd) {
            Debug.Warn(Tag, 'Banner暂未创建，无法展示')
            return
        }
        this._bannerAd.show().then(() => {
            Debug.Log(Tag, 'Banner展示成功')
        }).catch((err) => {
            Debug.Error(Tag, 'Banner展示失败', err)
        })
    }

    public static hideBanner(): void {
        if (!this._bannerAd) {
            Debug.Warn(Tag, 'Banner暂未创建，无法隐藏')
            return
        }
        this._bannerAd.hide()
        Debug.Log(Tag, 'Banner隐藏成功')
    }

}
