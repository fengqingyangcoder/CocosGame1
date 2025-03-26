import { Widget, _decorator, Node } from 'cc';
import { UIBase } from './UIBase';
import { SkillType } from '../enum/SkillType';
import { SkillMgr } from '../manager/SkillMgr';
import { GameMgr } from '../manager/GameMgr';
import { UI } from '../enum/UI';
import { AdMgr } from '../manager/AdMgr';
import { InputBlock } from '../misc/InputBlock';
import { TrackMgr } from '../manager/TrackMgr';
const { ccclass, property, requireComponent } = _decorator;

@ccclass('UI/UIGetSkill')
@requireComponent(Widget)
export class UIGetSkill extends UIBase {

    @property([Node])
    contents: Node[] = []

    private skill: SkillType = null

    public onOpen(data?: unknown): void {
        GameMgr.Pause = true
        this.skill = data as SkillType

        for (let i = 0; i < this.contents.length; i++) {
            const content: Node = this.contents[i];
            content.active = this.skill === i
        }
    }

    public onClose(data?: unknown): void {
        GameMgr.Pause = false
    }

    onBtnGetClick(): void {
        const onSucc = (count?: number) => {
            TrackMgr.track('get_skill', { skill_name: SkillMgr.getSkillName(this.skill) })
            SkillMgr.addSkill(this.skill)
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
    }

}


