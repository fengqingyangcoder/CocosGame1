import { _decorator, Component, Node, Sprite } from 'cc';
import { ResMgr } from '../manager/ResMgr';
import { Bundle } from '../enum/Bundle';
import { DecMgr } from '../manager/DecMgr';
const { ccclass, property } = _decorator;

@ccclass('Misc/Decoration')
export class Decoration extends Component {

    @property
    key: string = ''

    private sp: Sprite

    protected onLoad(): void {
        this.sp = this.getComponent(Sprite)
        this.sp.spriteFrame = ResMgr.getSpriteFrame(Bundle.Game, `${this.key}${DecMgr.CurUseDec}`, 'image/')
    }

}


