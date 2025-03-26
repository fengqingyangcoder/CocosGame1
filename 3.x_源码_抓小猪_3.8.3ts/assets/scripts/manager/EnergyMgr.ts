import { _decorator, Component, math, Node } from 'cc';
import { StorageUtil } from '../util/StorageUtil';
import { Global } from '../Global';
import { TimeUtil } from '../util/TimeUtil';
import { EventMgr } from './EventMgr';
import { EventType } from '../enum/EventType';
const { ccclass, property } = _decorator;

const Engergy_Recover_Time: number = 300000

@ccclass('Manager/EnergyMgr')
export class EnergyMgr extends Component {

    private static _node: Node

    public static get Enabled(): boolean {
        return this._node.active
    }
    public static set Enabled(v: boolean) {
        this._node.active = v
    }

    private static _curEngery: number = 10
    public static get CurEnergy(): number {
        return this._curEngery
    }
    public static set CurEnergy(v: number) {
        let preEnergy: number = this._curEngery
        this._curEngery = v
        if (this._curEngery < 0) this._curEngery = 0
        if (this._curEngery > preEnergy) this.LastRecoverTime = -1
        EventMgr.emit(EventType.UpdateEnergy)
        StorageUtil.setItem('curEnergy', this._curEngery)
    }

    private static _maxEngergy: number = 10
    public static get MaxEnergy(): number {
        return this._maxEngergy
    }
    public static set MaxEnergy(v: number) {
        this._maxEngergy = v
        EventMgr.emit(EventType.UpdateEnergy)
        StorageUtil.setItem('maxEnergy', this._maxEngergy)
    }

    private static _lastRecoverTime: number = -1
    private static set LastRecoverTime(v: number) {
        this._lastRecoverTime = v
        StorageUtil.setItem('lastRecoverTime', this._lastRecoverTime)
    }

    protected onLoad(): void {
        if (window) window['EnergyMgr'] = EnergyMgr
        EnergyMgr._node = this.node
        EnergyMgr.init()
    }

    private static init(): void {
        this.MaxEnergy = StorageUtil.getItem('maxEnergy', Global.Default_Max_Energy)
        this.CurEnergy = StorageUtil.getItem('curEnergy', Global.Default_Max_Energy)
        this.LastRecoverTime = StorageUtil.getItem('lastRecoverTime', -1)
    }

    protected update(dt: number): void {
        EnergyMgr.Enabled && EnergyMgr.updateEnergy(dt)
    }

    private static updateEnergy(dt: number): void {
        if (this._curEngery >= this._maxEngergy) {
            return
        }
        let curTimeStamp: number = TimeUtil.getCurrTimeStamp()
        if (this._lastRecoverTime === -1) this.LastRecoverTime = curTimeStamp
        let timeOffset: number = curTimeStamp - this._lastRecoverTime
        if (timeOffset >= Engergy_Recover_Time) {
            let recoverCnt: number = Math.floor(timeOffset / Engergy_Recover_Time)
            this.CurEnergy = Math.min(this._curEngery + recoverCnt, this._maxEngergy)
        }
    }

    public static get isEmpty(): boolean {
        if (!this.Enabled) return false
        return this._curEngery <= 0
    }

}


