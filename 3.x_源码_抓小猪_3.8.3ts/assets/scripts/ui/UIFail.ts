import { Widget, _decorator } from 'cc';
import { UIBase } from './UIBase';
import { GameMgr } from '../manager/GameMgr';
import { UI } from '../enum/UI';
import { AudioMgr } from '../manager/AudioMgr';
import { TrackMgr } from '../manager/TrackMgr';
const { ccclass, property, requireComponent } = _decorator;

@ccclass('UI/UIFail')
@requireComponent(Widget)
export class UIFail extends UIBase {

    public onOpen(data?: unknown): void {
        AudioMgr.stopBgm()
        AudioMgr.playSfx('a通关失败')
        GameMgr.Pause = true
        TrackMgr.track('game_fail', { mode: GameMgr.GameModeName, level: GameMgr.GameLevelId })
    }

    public onClose(data?: unknown): void {
        GameMgr.Pause = false
    }

    onBtnReplayClick(): void {
        TrackMgr.track('restart_game', { mode: GameMgr.GameModeName, level: GameMgr.GameLevelId })
        GameMgr.startGame()
        this.close()
    }

    onBtnCloseClick(): void {
        GameMgr.quitGame()
        this.scheduleOnce(() => {
            this.close()
            this.open(UI.Main)
        }, 0.5)
    }

}


