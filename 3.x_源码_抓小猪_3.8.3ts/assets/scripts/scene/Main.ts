import { _decorator, Component } from 'cc';
import { UIMgr } from '../manager/UIMgr';
import { UI } from '../enum/UI';
import { TrackMgr } from '../manager/TrackMgr';
import { StorageUtil } from '../util/StorageUtil';
const { ccclass, property } = _decorator;

@ccclass('Scene/Main')
export class Main extends Component {

    start() {
        UIMgr.open(UI.Main)
        const isNew: boolean = StorageUtil.getItem('isNew', StorageUtil.getItem('curLevel', 1) == 1)
        TrackMgr.track('enter_game', { is_new_player: isNew })
        StorageUtil.setItem('isNew', false)
    }

}

