import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Misc/Rotate')
export class Rotate extends Component {

    @property
    rotate_speed: number = 10

    update(deltaTime: number) {
        this.node.angle += this.rotate_speed * deltaTime
    }
}


