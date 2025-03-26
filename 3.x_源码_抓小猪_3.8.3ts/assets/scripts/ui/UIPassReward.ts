import { Widget, _decorator, Node, Label, ProgressBar } from 'cc';
import { UIBase } from './UIBase';
import { PassRewardMgr } from '../manager/PassRewardMgr';
import { DtoPassReward } from '../dto/DtoPassReward';
import { GameMgr } from '../manager/GameMgr';
import { TrackMgr } from '../manager/TrackMgr';
const { ccclass, property, requireComponent } = _decorator;

@ccclass('UI/UIPassReward')
@requireComponent(Widget)
export class UIPassReward extends UIBase {

    @property(ProgressBar)
    progressBar: ProgressBar = null
    @property(Label)
    lbProgress: Label = null
    @property(Label)
    lbTip: Label = null
    @property(Label)
    lbAllGet: Label = null
    @property(Node)
    btnGet: Node = null

    public onOpen(data?: any): void {
        this.updateState()
    }

    public onClose(data?: any): void {

    }

    updateState(): void {
        const canGetReward: boolean = PassRewardMgr.canGetReward()
        const isAllGet: boolean = PassRewardMgr.isAllGet()
        this.btnGet.active = !isAllGet && canGetReward
        this.lbTip.node.active = !isAllGet && !canGetReward
        this.lbAllGet.node.active = isAllGet

        const passRewardData: DtoPassReward = PassRewardMgr.CurData
        const passLevel: number = passRewardData.passLevel
        const curLevel: number = GameMgr.CurLevel - 1
        const needLevel: number = Math.min(curLevel, passLevel)

        this.lbTip.string = `再过${passLevel - needLevel}关可领取奖励`
        this.lbProgress.string = `${needLevel}/${passLevel}`
        this.progressBar.progress = (needLevel) / passLevel
    }

    onBtnCloseClick(): void {
        this.close()
    }

    onBtnGetClick(): void {
        const passLevel: number = PassRewardMgr.CurData.passLevel
        TrackMgr.track('get_pass_reward', { pass_level: passLevel })
        PassRewardMgr.getReward()
        this.updateState()
    }

}


