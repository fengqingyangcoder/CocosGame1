import { _decorator, Component, director, macro, math, Node, ProgressBar } from 'cc';
import { Bundle } from '../enum/Bundle';
import { ResMgr } from '../manager/ResMgr';
import { Setting } from '../Setting';
import { AdMgr } from '../manager/AdMgr';
import { CollectMgr } from '../manager/CollectMgr';
import { DecMgr } from '../manager/DecMgr';
import { HomeMgr } from '../manager/HomeMgr';
import { ItemMgr } from '../manager/ItemMgr';
import { PassRewardMgr } from '../manager/PassRewardMgr';
import { RankMgr } from '../manager/RankMgr';
const { ccclass, property } = _decorator;

@ccclass('Scene/Load')
export class Load extends Component {

    @property(ProgressBar)
    progressBar: ProgressBar

    private loaded: boolean = false

    async start() {
        this.init()
        await this.loadBundle()
        this.loadRes()
        this.schedule(this.updateProgress, 0.3, macro.REPEAT_FOREVER)
    }

    private init() {
        Setting.init()
        AdMgr.init()
        ItemMgr.init()
        DecMgr.init()
        CollectMgr.init()
        HomeMgr.init()
        PassRewardMgr.init()
        RankMgr.init()
    }

    loadBundle() {
        return Promise.all([
            ResMgr.loadBundle(Bundle.Font),
            ResMgr.loadBundle(Bundle.Game),
            ResMgr.loadBundle(Bundle.UI),
            ResMgr.loadBundle(Bundle.Audio),
            ResMgr.loadBundle(Bundle.Icon),
        ])
    }

    async loadRes() {
        await ResMgr.loadDir(Bundle.Resources)
        await ResMgr.loadDir(Bundle.Icon)
        await ResMgr.loadDir(Bundle.Font)
        await ResMgr.loadDir(Bundle.Audio)
        await ResMgr.loadDir(Bundle.UI)
        await ResMgr.loadDir(Bundle.Game)
        this.loaded = true
    }

    updateProgress(): void {
        let progressAdd: number = math.randomRange(0.1, 0.3)
        this.progressBar.progress = Math.min(this.progressBar.progress + progressAdd, 0.9)
        if (this.loaded) {
            this.progressBar.progress = 1.0
            this.unschedule(this.updateProgress)
            this.scheduleOnce(() => {
                director.loadScene('main')
            }, 0.1)
        }
    }


}


