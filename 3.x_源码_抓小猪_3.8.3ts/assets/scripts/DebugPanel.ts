import { _decorator, Component, isValid, Label, math, Node, Slider, Toggle } from 'cc';
import { Stage } from './game/Stage';
import { GameMgr } from './manager/GameMgr';
import { UIMgr } from './manager/UIMgr';
import { UI } from './enum/UI';
import { GameMode } from './enum/GameMode';
import { CoinMgr } from './manager/CoinMgr';
import { EventMgr } from './manager/EventMgr';
import { EventType } from './enum/EventType';
import { SkillMgr } from './manager/SkillMgr';
import { SkillType } from './enum/SkillType';
import { CollectMgr } from './manager/CollectMgr';
import { Global } from './Global';
const { ccclass, property } = _decorator;

@ccclass('Debug/DebugPanel')
export class DebugPanel extends Component {

    @property(Slider)
    levelTimeSlider: Slider = null
    @property(Label)
    lbLevelTime: Label = null

    @property(Slider)
    ballGroupSlider: Slider = null
    @property(Label)
    lbBallGroup: Label = null

    protected onLoad(): void {
        this.node.active = false
    }

    protected onEnable(): void {
        this.lbLevelTime.string = `${Global.Level_Time}s`
        this.lbBallGroup.string = `${Global.Ball_Group}组`
        this.levelTimeSlider.progress = Global.Level_Time / 500
        this.ballGroupSlider.progress = Global.Ball_Group / 300
    }

    onClick(): void {
        this.node.active = !this.node.active
    }

    onBtnPassClick(): void {
        if (!isValid(GameMgr.stage)) return
        const stage: Stage = GameMgr.stage.getComponent(Stage)
        UIMgr.close(UI.Game)
        switch (GameMgr.Mode) {
            case GameMode.Normal:
                stage.onNormalModeWin()
                break
            case GameMode.Super:
                stage.onSuperModeWin()
                break
        }
    }

    onBtnAddCoinClick(): void {
        CoinMgr.CurCoin += 1000
        EventMgr.emit(EventType.UpdateCoin, CoinMgr.CurCoin)
    }

    onBtnAddFreezeClick(): void {
        SkillMgr.addSkill(SkillType.Freeze)
    }

    onBtnAddEraseClick(): void {
        SkillMgr.addSkill(SkillType.Erase)

    }

    onBtnAddMoveClick(): void {
        SkillMgr.addSkill(SkillType.Move)
    }

    onBtnAddPigClick(): void {
        const pigId: number = math.randomRangeInt(4, 16)
        CollectMgr.add(pigId)
    }

    onBtnTestClick(): void {
        GameMgr.startGame()
        this.scheduleOnce(() => {
            UIMgr.close(UI.Main)
        }, 0.5)
        Global.Is_Test_Level = true
    }

    onTgHardLevelToggle(toggle: Toggle): void {
        Global.Is_Hard_Level = toggle.isChecked
        console.log(Global.Is_Hard_Level)
    }

    onLevelTimeSlider(slider: Slider): void {
        const progress: number = slider.progress
        const time: number = Math.floor(progress * 500)
        Global.Level_Time = Math.max(30, time)
        this.lbLevelTime.string = `${Global.Level_Time}s`
    }

    onBallGroupSlider(slider: Slider): void {
        const progress: number = slider.progress
        const group: number = Math.floor(progress * 300)
        Global.Ball_Group = Math.max(3, group)
        this.lbBallGroup.string = `${Global.Ball_Group}组`
    }

}


