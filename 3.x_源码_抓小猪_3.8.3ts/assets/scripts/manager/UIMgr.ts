import { _decorator, Component, instantiate, isValid, Node, Prefab } from 'cc'
import { Debug } from '../util/Debug'
import { UIType } from '../enum/UIType'
import { EventMgr } from './EventMgr'
import { EventType } from '../enum/EventType'
import { ResMgr } from './ResMgr'
import { UIBase } from '../ui/UIBase'
import { UI } from '../enum/UI'
const { ccclass, property } = _decorator

const Tag: string = 'UIMgr'

type UIRegistInfo = {
    ref: boolean
}

@ccclass('Manager/UIMgr')
export class UIMgr extends Component {

    private static _inst: UIMgr = null
    private static _node: Node = null

    @property(Node)
    private popUpMask: Node = null

    private static _openedUI: Object = {}

    private static _popUpStack: string[] = []

    private static _toast: Node = null

    private static readonly _register: { [key: string]: UIRegistInfo } = {}

    protected onLoad(): void {
        globalThis.UIMgr = UIMgr
        UIMgr._inst = this
        UIMgr._node = this.node
        UIMgr.init()
        UIMgr.regist()
    }

    private static init(): void {
        EventMgr.on(EventType.OpenUI, this.open, this)
        EventMgr.on(EventType.CloseUI, this.close, this)
    }

    public static async open(uiName: string, data?: unknown, uiType?: UIType) {
        if (this.isOpened(uiName)) {
            Debug.Warn(Tag, `${uiName}已经打开`)
            return
        }
        let isUILoaded: boolean = ResMgr.isLoaded("ui", uiName)
        if (!isUILoaded) {
            await ResMgr.loadRes("ui", uiName)
        }
        let uiPrefab: Prefab = ResMgr.getRes("ui", uiName)
        if (!uiPrefab) {
            Debug.Error(Tag, `${uiName}不存在`)
            return
        }

        const registInfo: UIRegistInfo = this._register[uiName]
        registInfo?.ref && uiPrefab.addRef()

        let uiNode: Node = instantiate(uiPrefab)
        let ui: UIBase = uiNode.getComponent(UIBase)
        Debug.Log(Tag, `打开${uiName}`)
        if (!uiType) uiType = ui.uiType
        let uiParent: Node = this._node.children[uiType]
        uiParent.addChild(uiNode)
        ui.onOpen(data)

        if (uiType === UIType.PopUp) {
            let idx: number = uiNode.getSiblingIndex()
            this._inst.popUpMask.active = true
            this._inst.popUpMask.setSiblingIndex(idx - 1)
            this._popUpStack.push(uiName)
        }
        if (uiType === UIType.Toast) {
            isValid(this._toast) && this._toast.destroy()
            this._toast = uiNode
        } else {
            this._openedUI[uiName] = ui
        }
    }

    public static close(uiName: string, data?: unknown): void {
        if (!this.isOpened(uiName)) return

        const registInfo: UIRegistInfo = this._register[uiName]
        if (registInfo?.ref) {
            let uiPrefab: Prefab = ResMgr.getRes("ui", uiName)
            uiPrefab.decRef()
            if (uiPrefab.refCount <= 0) {
                Debug.Log(Tag, `卸载${uiName}`)
            }
        }
        let ui: UIBase = this._openedUI[uiName]
        Debug.Log(Tag, `关闭${uiName}`)
        let uiType: UIType = ui.uiType
        if (uiType === UIType.PopUp) {
            let idx: number = this._popUpStack.indexOf(uiName)
            this._popUpStack.splice(idx, 1)
            if (this._popUpStack.length <= 0) {
                this._inst.popUpMask.active = false
            } else {
                let topWindowName: string = this._popUpStack[this._popUpStack.length - 1]
                let topWindow: UIBase = this._openedUI[topWindowName]
                let topWindowIdx: number = topWindow.node.getSiblingIndex()
                this._inst.popUpMask.setSiblingIndex(Math.max(0, topWindowIdx))
            }
        }
        ui.onClose(data)
        delete this._openedUI[uiName]
        ui.node.destroy()
    }

    public static get(uiName: string): UIBase {
        return this._openedUI[uiName]
    }

    public static isOpened(uiName: string): boolean {
        return this._openedUI.hasOwnProperty(uiName)
    }

    public static regist(): void {
        this._register[UI.Main] = {
            ref: false
        }
        this._register[UI.Pause] = {
            ref: false
        }
        this._register[UI.Rank] = {
            ref: false
        }
    }

}

