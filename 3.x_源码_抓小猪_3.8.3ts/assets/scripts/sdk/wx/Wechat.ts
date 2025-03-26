import { wx } from "../../Global"
import { Debug } from "../../util/Debug"

const Tag: string = 'WeChat'

export class WeChat {

    private static _sysInfo = null

    public static get StatusBarHeight(): number {
        return this._sysInfo?.statusBarHeight ?? 0
    }

    public static init(): void {
        this._sysInfo = wx.getSystemInfoSync()
        Debug.Log(Tag, '系统信息:', this._sysInfo)
    }

    public static reboot() {
        wx.restartMiniProgram()
    }

    public static compareVersion(v1, v2) {
        v1 = v1.split('.')
        v2 = v2.split('.')
        const len = Math.max(v1.length, v2.length)

        while (v1.length < len) {
            v1.push('0')
        }
        while (v2.length < len) {
            v2.push('0')
        }

        for (let i = 0; i < len; i++) {
            const num1 = parseInt(v1[i])
            const num2 = parseInt(v2[i])

            if (num1 > num2) {
                return 1
            } else if (num1 < num2) {
                return -1
            }
        }

        return 0
    }

    public static showToast(tip: string, icon: string = "none", duration: number = 1500): void {
        wx.showToast({
            "title": tip,
            "icon": icon,
            "duration": duration
        })
    }

    public static hideToast(): void {
        wx.hideToast({})
    }

    public static vibrate(): void {
        wx.vibrateShort(null)
    }
    public static postMsg(msg?:object):void{
        wx.getOpenDataContext().postMessage(msg);
    }
}

// if (WECHAT) {

//     wx.getSystemInfo({
//         success(res) {
//             console.log(`========Info========`)
//             console.log(`WeChat --> 设备品牌:${res.brand}`)
//             console.log(`WeChat --> 设备型号:${res.model}`)
//             console.log(`WeChat --> 设备像素比:${res.pixelRatio}`)
//             console.log(`WeChat --> 屏幕宽度:${res.screenWidth}`)
//             console.log(`WeChat --> 屏幕高度:${res.screenHeight}`)
//             console.log(`WeChat --> 窗口宽度:${res.windowWidth}`)
//             console.log(`WeChat --> 窗口高度:${res.windowHeight}`)
//             console.log(`WeChat --> 状态栏高度:${res.statusBarHeight}`)
//             console.log(`WeChat --> 微信所用语言:${res.language}`)
//             console.log(`WeChat --> 微信版本号:${res.version}`)
//             console.log(`WeChat --> 操作系统及版本:${res.system}`)
//             console.log(`WeChat --> 客户端平台:${res.platform}`)
//             console.log(`WeChat --> 用户字体大小:${res.fontSizeSetting}`)
//             console.log(`WeChat --> 客户端基础库版本:${res.SDKVersion}`)
//             console.log(`WeChat --> 设备性能等级:${res.benchmarkLevel}`)
//             console.log(`WeChat --> 设备方向:${res.deviceOrientation}`)
//             console.log(`====================`)
//         }
//     })

//     wx.onShow(function (res) {
//         console.log(`WeChat --> 回到前台`, res)
//         EventMgr.emit(EventType.WxOnShow, res)
//     })

//     wx.onHide(function () {
//         console.log(`WeChat --> 退到后台`)
//         EventMgr.emit(EventType.WxOnHide)
//     })

// }