import { _decorator, Component, Label, Node } from 'cc';
import { GameMgr } from '../../manager/GameMgr';
import { GameMode } from '../../enum/GameMode';
const { ccclass, property } = _decorator;

@ccclass('Item/TimeOutReviveTip')
export class TimeOutReviveTip extends Component {

    label: Label = null

    protected onLoad(): void {
        this.label = this.getComponent(Label)
    }

    protected start(): void {
        let addMinute: number = 1
        switch (GameMgr.Mode) {
            case GameMode.Normal:
                addMinute = GameMgr.isHardLevel ? 1 : 5
                break;
            case GameMode.Super:
                addMinute = GameMgr.SuperLevel === 1 ? 1 : 5
                break;
        }
        this.label.string = `复活并加时${addMinute}分钟`
    }

}


