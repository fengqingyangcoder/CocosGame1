import { _decorator, Component, Sprite, SpriteFrame } from 'cc';
import { Bundle } from '../enum/Bundle';
import { ResMgr } from '../manager/ResMgr';
import { DtoBall } from '../dto/DtoBall';
const { ccclass, property } = _decorator;

@ccclass('ScriptBase/BallBase')
export class BallBase extends Component {

    @property(Sprite)
    private sp: Sprite = null

    protected _data: DtoBall = null
    public get Data(): DtoBall {
        return this._data
    }
    public set Data(v: DtoBall) {
        this._data = v;
        const res: string = `ball/${v.name}/spriteFrame`
        const isLoaded: boolean = ResMgr.isLoaded(Bundle.Icon, res)
        if (isLoaded) {
            this.sp.spriteFrame = ResMgr.getRes(Bundle.Icon, res)
        } else {
            ResMgr.loadRes<SpriteFrame>(Bundle.Icon, res).then((spf: SpriteFrame) => {
                this.sp.spriteFrame = spf
            })
        }
    }

}


