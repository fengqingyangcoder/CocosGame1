import { Widget, _decorator } from 'cc';
import { UIBase } from './UIBase';
import { GameMgr } from '../manager/GameMgr';
import { UI } from '../enum/UI';
const { ccclass, property, requireComponent } = _decorator;

@ccclass('UI/UIReplay')
@requireComponent(Widget)
export class UIReplay extends UIBase {

    public onOpen(data?: unknown): void {
        GameMgr.Pause = true
    }

    public onClose(data?: unknown): void {
        GameMgr.Pause = false
    }

    onBtnContinueClick(): void {
        this.close()
    }

    onBtnReplayClick(): void {
        GameMgr.startGame()
        this.close()
        // this.close(UI.Game)
    }

    onBtnCloseClick():void{
        this.close()
    }

}


