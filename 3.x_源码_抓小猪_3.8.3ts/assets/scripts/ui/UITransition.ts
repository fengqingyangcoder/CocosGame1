import { Widget, _decorator, Node, tween, v2, v3 } from 'cc';
import { UIBase } from './UIBase';
const { ccclass, property, requireComponent } = _decorator;

@ccclass('UI/UITransition')
@requireComponent(Widget)
export class UITransition extends UIBase {

    public onOpen(data?: unknown): void {
        const pigs: Node[] = this.node.children
        for (let i = 0; i < pigs.length; i++) {
            const pig: Node = pigs[i];
            tween(pig).sequence(
                tween(pig).to(0.2, { angle: 8 }),
                tween(pig).to(0.2, { angle: -8 })
            ).repeatForever().start()
            tween(pig).by(1, { position: v3(-2000, 0, 0) }).start()
        }
        this.scheduleOnce(()=>{
            this.close()
        },1)
    }

    public onClose(data?: unknown): void {

    }

}


