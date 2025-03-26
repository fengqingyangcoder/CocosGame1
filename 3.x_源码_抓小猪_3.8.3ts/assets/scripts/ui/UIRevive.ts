import { Widget, _decorator, Node, Label } from 'cc';
import { UIBase } from './UIBase';
import { UI } from '../enum/UI';
import { GameMgr } from '../manager/GameMgr';
import { EventMgr } from '../manager/EventMgr';
import { EventType } from '../enum/EventType';
import { FailType } from '../enum/FailType';
import { GameMode } from '../enum/GameMode';
import { AdMgr } from '../manager/AdMgr';
import { InputBlock } from '../misc/InputBlock';
const { ccclass, property, requireComponent } = _decorator;

@ccclass('UI/UIRevive')
@requireComponent(Widget)
export class UIRevive extends UIBase {

    @property(Label)
    lbTip: Label = null
    @property([Node])
    failNodes: Node[] = []

    failType: FailType

    public onOpen(data?: unknown): void {
        GameMgr.Pause = true
        this.failType = data as FailType
        this.failNodes.forEach((n, i) => {
            n.active = i === this.failType
        })
        const time: number = GameMgr.isHardLevel || GameMgr.Mode === GameMode.Super ? 5 : 1
        // console.log(time)
        this.scheduleOnce(() => {
            this.lbTip.string = `复活并加时${time}分钟`
        })
    }

    public onClose(data?: unknown): void {
        GameMgr.Pause = false
    }

    onBtnReviveClick(): void {
        const onSucc = (count?: number) => {
            EventMgr.emit(EventType.Revive, this.failType)
            this.close()
        }

        const onFail = () => {
            this.open(UI.Toast, '激励视频播放未完成')
        }

        const onError = () => {
            this.open(UI.Toast, '暂时没有合适的广告')
        }

        AdMgr.showRewardedVideo(onSucc, onFail, onError)
    }

    onBtnCloseClick(): void {
        this.close()
        this.open(UI.Fail)
    }

}


