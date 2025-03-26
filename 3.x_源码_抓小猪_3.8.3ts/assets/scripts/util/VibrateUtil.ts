import { WECHAT } from "cc/env";
import { Setting } from "../Setting";
import { WeChat } from "../sdk/wx/Wechat";

const Tag: string = "VibrateUtil"

export class VibrateUtil {

    private static _lastVibrateTime: number = 0

    public static vibrate(data?: any): void {
        if (!Setting.VibrateEnabled) return
        const now = Date.now()
        if (now - this._lastVibrateTime > 100) {
            this._lastVibrateTime = now
            // Debug.Log(Tag, '震动')
            if (WECHAT) WeChat.vibrate()
        }
    }

}


