import { Widget, _decorator, Node, Sprite, Label } from 'cc';
import { UIBase } from './UIBase';
import { ResMgr } from '../manager/ResMgr';
import { DtoItem } from '../config/CfgItem';
const { ccclass, property, requireComponent } = _decorator;

@ccclass('UI/UICollectInfo')
@requireComponent(Widget)
export class UICollectInfo extends UIBase {

    @property(Sprite)
    icon: Sprite = null

    @property(Label)
    lbName: Label = null

    public onOpen(data?: DtoItem): void {
        this.icon.spriteFrame = ResMgr.getSpriteFrame(data.bundle, data.icon)
        this.lbName.string = data.name
    }

    public onClose(data?: any): void {

    }

    onBtnCloseClick(): void {
        this.close()
    }

}


