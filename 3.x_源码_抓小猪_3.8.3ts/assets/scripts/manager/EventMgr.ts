import { _decorator, Component, director, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Manager/EventMgr')
export class EventMgr extends Component {

    private static _node: Node

    protected onLoad(): void {
        EventMgr._node = this.node
        director.addPersistRootNode(this.node)
    }

    public static on(type: string, callback: Function, target?: unknown, useCapture?: any): void {
        this._node.on(type, callback, target, useCapture)
    }

    public static once(type: string, callback: Function, target?: unknown, useCapture?: any): void {
        this._node.once(type, callback, target, useCapture)
    }

    public static emit(type: string, arg0?: any, arg1?: any, arg2?: any, arg3?: any, arg4?: any): void {
        this._node.emit(type, arg0, arg1, arg2, arg3, arg4)
    }

    public static off(type: string, callback?: Function, target?: unknown, useCapture?: any): void {
        this._node.off(type, callback, target, useCapture)
    }

    public static offAll(target: unknown): void {
        this._node.targetOff(target)
    }

    public static has(type: string, callback?: Function, target?: unknown): boolean {
        return this._node.hasEventListener(type, callback, target)
    }

}


