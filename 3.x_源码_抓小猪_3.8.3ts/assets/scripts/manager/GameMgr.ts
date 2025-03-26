import { _decorator, Component, instantiate, math, Node, Prefab } from 'cc'
import { EventMgr } from './EventMgr'
import { EventType } from '../enum/EventType'
import { ResMgr } from './ResMgr'
import { Bundle } from '../enum/Bundle'
import { Debug } from '../util/Debug'
import { StorageUtil } from '../util/StorageUtil'
import { TimeMgr } from './TimeMgr'
import { GameMode, ModeName } from '../enum/GameMode'
import { UI } from '../enum/UI'
import { DtoBall } from '../dto/DtoBall'
import { CfgBall } from '../config/cfg_ball'
import { Global } from '../Global'
import { BallType } from '../enum/BallType'
import { ArrayUtil } from '../util/ArrayUtil'
import { GameUtil } from '../util/GameUtil'
import { DtoLevel } from '../dto/DtoLevel'
import { CfgNormalLevel, CfgSuperLevel } from '../config/cfg_level'
import { TrackMgr } from './TrackMgr'
const { ccclass, property } = _decorator

const Tag: string = 'GameMgr'

@ccclass('Manager/GameMgr')
export class GameMgr extends Component {

    private static _node: Node

    private static _pause: boolean = false
    public static get Pause(): boolean {
        return this._pause
    }
    public static set Pause(v: boolean) {
        this._pause = v
        EventMgr.emit(EventType.Pause, v)
    }

    public static stage: Node = null
    public static slotBox: Node = null

    private static curLevel: number = 1
    public static get CurLevel(): number {
        return this.curLevel
    }
    public static set CurLevel(v: number) {
        this.curLevel = Math.max(1, v)
        StorageUtil.setItem('curLevel', this.curLevel)
        EventMgr.emit(EventType.UpdateLevel, this.curLevel)
    }

    private static superLevel: number = 1
    public static get SuperLevel(): number {
        return this.superLevel
    }
    public static set SuperLevel(v: number) {
        this.superLevel = Math.min(v, 2)
        EventMgr.emit(EventType.UpdateLevel, this.superLevel)
    }

    private static mode: GameMode = GameMode.Normal
    public static get Mode(): GameMode {
        return this.mode
    }
    public static set Mode(v: GameMode) {
        this.mode = v;
    }

    public static get GameModeName(): string {
        return ModeName[this.mode]
    }

    public static get GameLevelId(): number {
        switch (this.mode) {
            case GameMode.Normal:
                return this.curLevel
            case GameMode.Super:
                return this.superLevel
        }
    }

    public static get isHardLevel(): boolean {
        return this.curLevel > 1 && this.curLevel % 5 === 0
    }

    public static ballData: DtoBall[] = []
    public static curIdArr: number[] = []

    protected onLoad(): void {
        globalThis.GameMgr = GameMgr
        GameMgr._node = this.node
        GameMgr.curLevel = StorageUtil.getItem('curLevel', 1)
    }

    private static createStage(): void {
        const stagePre: Prefab = ResMgr.getRes(Bundle.Game, 'Stage')
        this.stage = instantiate(stagePre)
        this._node.addChild(this.stage)
    }

    public static async startGame() {
        Global.Is_Test_Level = false
        this.ballData = []
        this.curIdArr = []
        EventMgr.emit(EventType.OpenUI, UI.Transition)
        TrackMgr.track('start_game', { mode: this.GameModeName, level: this.GameLevelId })
        await TimeMgr.delay(0.5)
        if (this.stage) this.stage.destroy()
        await TimeMgr.delay()
        this.createStage()
        Debug.Log(Tag, '游戏开始')
    }

    public static async quitGame() {
        if (!this.stage) return
        this.ballData = []
        this.curIdArr = []
        EventMgr.emit(EventType.OpenUI, UI.Transition)
        await TimeMgr.delay(0.5)
        if (this.stage) this.stage.destroy()
        this.stage = null
        Debug.Log(Tag, '游戏放弃')
    }

    public static initLevelConfig(): void {
        let levelIdx: number = 0
        let levelData: DtoLevel = null

        if (Global.Is_Test_Level) {
            switch (this.Mode) {
                case GameMode.Normal:
                    levelIdx = this.CurLevel - 1
                    Global.Ball_Scale = Math.max(1 - levelIdx * Global.Ball_Shrink_Scale, Global.Min_Ball_Scale)
                    if (Global.Ball_Scale <= 0.65) {
                        Global.Max_Group = 40
                    } else {
                        Global.Max_Group = Math.min(15 + levelIdx, 40)
                    }
                    break;
                case GameMode.Super:
                    levelIdx = this.SuperLevel - 1

                    Global.Ball_Scale = [1, Global.Min_Ball_Scale][levelIdx]
                    Global.Max_Group = [20, 40][levelIdx]
                    break
            }
        } else {
            switch (this.Mode) {
                case GameMode.Normal:
                    levelIdx = this.CurLevel > 70 ? math.randomRangeInt(50, 70) : this.CurLevel - 1
                    levelData = CfgNormalLevel[levelIdx]

                    Global.Ball_Group = levelData.group
                    Global.Pig_Group = levelData.pigGroup
                    Global.Pair_Group = levelData.pairGroup
                    Global.Level_Time = levelData.time

                    Global.Ball_Scale = Math.max(1 - levelIdx * Global.Ball_Shrink_Scale, Global.Min_Ball_Scale)
                    Global.Max_Group = Global.Ball_Scale <= 0.65 ? 40 : Math.min(15 + levelIdx, 40)
                    break;
                case GameMode.Super:
                    levelIdx = this.SuperLevel - 1
                    levelData = CfgSuperLevel[levelIdx]

                    Global.Ball_Group = levelData.group
                    Global.Pig_Group = 0
                    Global.Pair_Group = levelData.pairGroup
                    Global.Level_Time = levelData.time

                    Global.Ball_Scale = [1, Global.Min_Ball_Scale][levelIdx]
                    Global.Max_Group = [20, 40][levelIdx]
                    break;
            }
        }
    }

    public static generateBallData(group: number, pigGroup: number, pairGroup: number): void {
        let balls: DtoBall[] = []
        switch (this.Mode) {
            case GameMode.Normal:
                if (this.CurLevel === 1) {
                    balls = GameUtil.getNormalBalls()
                    const normalGroup: number = group - pigGroup
                    //先将创建普通组
                    for (let i = 0; i < normalGroup; i++) {
                        const data: DtoBall = ArrayUtil.pickItem(balls)
                        this.ballData.push(data, data, data)
                    }
                    //筛选出可创建的猪
                    let pigBalls: DtoBall[] = GameUtil.getBallsByType(BallType.Pig)
                    pigBalls = pigBalls.splice(0, 1)
                    const pigBall: DtoBall = ArrayUtil.pickItem(pigBalls)
                    //再创建猪组
                    this.ballData.push(pigBall, pigBall, pigBall)
                    ArrayUtil.shuffle(this.ballData)
                    this.printBallData()
                }
                else if (this.isHardLevel) {
                    this.generatePigLevelGroup(group, pigGroup, pairGroup)
                } else {
                    this.generateNoPigLevelGroup(group, pigGroup, pairGroup)
                }
                break;
            case GameMode.Super:
                this.generateNoPigLevelGroup(group, pigGroup, pairGroup)
                break;
        }
        Debug.Log(Tag, `当前关卡总共${group}组球`)
    }

    private static generatePigLevelGroup(group: number, pigGroup: number, pairGroup: number): void {
        const typeArr: BallType[] = [BallType.Red, BallType.Yellow, BallType.Blue]
        const type: BallType = ArrayUtil.pickItem(typeArr)
        const balls: DtoBall[] = GameUtil.getBallsByType(type)

        const normalGroup: number = group - pigGroup

        const pairBallArr: DtoBall[] = []
        const messBallArr: DtoBall[] = []
        //先将创建普通组
        for (let i = 0; i < normalGroup; i++) {
            const data: DtoBall = ArrayUtil.pickItem(balls)
            if (i < pairGroup) {
                pairBallArr.push(data, data, data)
            } else {
                messBallArr.push(data, data, data)
            }
        }

        //筛选出可创建的猪
        let pigBalls: DtoBall[] = GameUtil.getBallsByType(BallType.Pig)
        const range: number = 1 + Math.floor(this.CurLevel / 5)
        pigBalls = pigBalls.splice(0, range)

        //再创建猪组
        for (let i = 0; i < pigGroup; i++) {
            const pigBall: DtoBall = ArrayUtil.pickItem(pigBalls)
            messBallArr.push(pigBall, pigBall, pigBall)
        }

        ArrayUtil.shuffle(messBallArr)

        //合并两个临时组
        for (let i = 0; i < group; i++) {
            if (i % 2 === 0) {
                if (pairBallArr.length > 0) {
                    const arr: DtoBall[] = pairBallArr.splice(0, 3)
                    this.ballData.push(...arr)
                } else if (messBallArr.length > 0) {
                    const arr: DtoBall[] = messBallArr.splice(0, 3)
                    this.ballData.push(...arr)
                }
            } else {
                if (messBallArr.length > 0) {
                    const arr: DtoBall[] = messBallArr.splice(0, 3)
                    this.ballData.push(...arr)
                } else if (pairBallArr.length > 0) {
                    const arr: DtoBall[] = pairBallArr.splice(0, 3)
                    this.ballData.push(...arr)
                }
            }
        }

        this.printBallData()
    }

    private static generateNoPigLevelGroup(group: number, pigGroup: number, pairGroup: number): void {
        const balls: DtoBall[] = GameUtil.getNormalBalls()

        const normalGroup: number = group - pigGroup

        const pairBallArr: DtoBall[] = []
        const messBallArr: DtoBall[] = []

        //先创建普通组
        for (let i = 0; i < normalGroup; i++) {
            const data: DtoBall = ArrayUtil.pickItem(balls)
            if (i < pairGroup) {
                pairBallArr.push(data, data, data)
            } else {
                messBallArr.push(data, data, data)
            }
        }

        ArrayUtil.shuffle(messBallArr)

        //合并两个临时组
        for (let i = 0; i < group; i++) {
            if (i % 2 === 0) {
                if (pairBallArr.length > 0) {
                    const arr: DtoBall[] = pairBallArr.splice(0, 3)
                    this.ballData.push(...arr)
                } else if (messBallArr.length > 0) {
                    const arr: DtoBall[] = messBallArr.splice(0, 3)
                    this.ballData.push(...arr)
                }
            } else {
                if (messBallArr.length > 0) {
                    const arr: DtoBall[] = messBallArr.splice(0, 3)
                    this.ballData.push(...arr)
                } else if (pairBallArr.length > 0) {
                    const arr: DtoBall[] = pairBallArr.splice(0, 3)
                    this.ballData.push(...arr)
                }
            }
        }

        this.printBallData()
    }

    private static printBallData(): void {
        const map: Map<string, number> = new Map<string, number>()
        for (let i = 0; i < this.ballData.length; i++) {
            const ballData: DtoBall = this.ballData[i]
            const ballName: string = ballData.name
            if (!map.has(ballName)) map.set(ballName, 0)
            const curCnt: number = map.get(ballName)
            map.set(ballName, curCnt + 1)
        }
        console.log(`总共${this.ballData.length}个球`)
        console.log(map)
    }

    public static printCurIdArr(): void {
        for (let i = 0; i < this.curIdArr.length; i++) {
            const id: number = this.curIdArr[i];
            const ballData: DtoBall = CfgBall[id]
            console.log(ballData)
        }
    }

}

globalThis.GameMgr = GameMgr

