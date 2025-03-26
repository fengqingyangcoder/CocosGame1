import { _decorator, Component, Input, input, instantiate, isValid, KeyCode, macro, math, Node, Prefab, Tween, tween, UIOpacity, UITransform, v3, Vec3 } from 'cc';
import { EventMgr } from '../manager/EventMgr';
import { EventType } from '../enum/EventType';
import { InputBlock } from '../misc/InputBlock';
import { UIMgr } from '../manager/UIMgr';
import { UI } from '../enum/UI';
import { BallBox } from './BallBox';
import { ArrayUtil } from '../util/ArrayUtil';
import { GameMgr } from '../manager/GameMgr';
import { FlyBall } from './FlyBall';
import { SlotBall } from './SlotBall';
import { Global } from '../Global';
import { GameMode } from '../enum/GameMode';
import { PREVIEW } from 'cc/env';
import { ResMgr } from '../manager/ResMgr';
import { Bundle } from '../enum/Bundle';
import { AudioMgr } from '../manager/AudioMgr';
import { FailType } from '../enum/FailType';
import { Ball } from './Ball';
import { EffectMgr } from '../manager/EffectMgr';
import { CfgBall } from '../config/cfg_ball';
import { DtoBall } from '../dto/DtoBall';
import { BallType } from '../enum/BallType';
import { CollectMgr } from '../manager/CollectMgr';
import { Shake } from '../misc/Shake';
import { Slot } from './Slot';
import { Debug } from '../util/Debug';
import { GameUtil } from '../util/GameUtil';
const { ccclass, property } = _decorator;

const Tag: string = 'Stage'

@ccclass('Game/Stage')
export class Stage extends Component {

    @property(Prefab)
    flyBallPre: Prefab = null
    @property(Prefab)
    slotBallPre: Prefab = null
    @property(Prefab)
    parMergePre: Prefab = null

    @property(Node)
    slotBox: Node = null
    @property(Node)
    slotBallBox: Node = null
    @property(BallBox)
    ballBox: BallBox = null

    private _uiTrans: UITransform = null

    protected onLoad(): void {
        this._uiTrans = this.getComponent(UITransform)

        GameMgr.slotBox = this.slotBox

        EventMgr.on(EventType.TimeOut, this.onTimeOut, this)
        EventMgr.on(EventType.SelectBall, this.onSelectBall, this)
        EventMgr.on(EventType.UseSkillFreeze, this.onUseSkillFreeze, this)
        EventMgr.on(EventType.UseSkillErase, this.onUseSkillErase, this)
        EventMgr.on(EventType.UseSkillMove, this.onUseSkillMove, this)
        EventMgr.on(EventType.Revive, this.onRevive, this)

        if (PREVIEW) {
            input.on(Input.EventType.KEY_DOWN, (e) => {
                if (e.keyCode === KeyCode.SPACE) {
                    UIMgr.close(UI.Game)
                    switch (GameMgr.Mode) {
                        case GameMode.Normal:
                            this.onNormalModeWin()
                            break
                        case GameMode.Super:
                            this.onSuperModeWin()
                            break
                    }
                }
            }, this)
        }
    }

    protected onDestroy(): void {
        GameMgr.slotBox = null
        this.unscheduleAllCallbacks()
        EventMgr.off(EventType.TimeOut, this.onTimeOut, this)
        EventMgr.off(EventType.SelectBall, this.onSelectBall, this)
        EventMgr.off(EventType.UseSkillFreeze, this.onUseSkillFreeze, this)
        EventMgr.off(EventType.UseSkillErase, this.onUseSkillErase, this)
        EventMgr.off(EventType.UseSkillMove, this.onUseSkillMove, this)
        EventMgr.off(EventType.Revive, this.onRevive, this)
        UIMgr.close(UI.Game)
    }

    protected start(): void {

        GameMgr.initLevelConfig()

        // Global.Ball_Group = 1
        // Global.Level_Time = 6

        const maxGroup: number = Math.min(Global.Ball_Group, Global.Max_Group)
        const ballCnt: number = maxGroup * 3
        const delayTime: number = ballCnt * 0.06

        GameMgr.generateBallData(Global.Ball_Group, Global.Pig_Group, Global.Pair_Group)

        EventMgr.emit(EventType.ReqCreateBall, ballCnt)

        InputBlock.Active = true
        this.scheduleOnce(() => {
            InputBlock.Active = false
            UIMgr.open(UI.Game)
            if (GameMgr.isHardLevel) {
                UIMgr.open(UI.StageTip, '困难关卡')
            }
            EventMgr.emit(EventType.TimeReset)
            this.schedule(this.onCheckWin, 0.5, macro.REPEAT_FOREVER)
        }, delayTime)
    }

    onUseSkillFreeze(): void {
        const effectFreezePre: Prefab = ResMgr.getRes(Bundle.Game, 'EffectFreeze')
        const effectFreezeNode: Node = instantiate(effectFreezePre)
        this.node.addChild(effectFreezeNode)
    }

    onUseSkillErase(): void {
        const curIdArr: number[] = GameMgr.curIdArr
        const map: Map<number, number[]> = new Map<number, number[]>()
        let removeCnt: number = 0
        //从槽位中筛选出需要凑齐的消除物，最多两组
        for (let i = 0; i < curIdArr.length; i++) {
            const id: number = curIdArr[i];
            if (!map.has(id)) {
                if (map.size >= 2) break
                map.set(id, [i])
                removeCnt++
            } else {
                const idxArr: number[] = map.get(id)
                idxArr.push(i)
                map.set(id, idxArr)
                removeCnt++
            }
        }

        curIdArr.splice(0, removeCnt)

        for (const [k, v] of map) {
            const idxArr: number[] = v
            const arr = []
            //先将筛选出来的消除物移除
            for (let i = 0; i < idxArr.length; i++) {
                const idx: number = idxArr[i];
                const slotBallNode: Node = this.slotBallBox.children[idx]
                const worldPos: Vec3 = slotBallNode.getWorldPosition()
                arr.push({
                    id: k,
                    angle: 0,
                    worldPos: worldPos
                })
                slotBallNode.destroy()
            }

            //再从场上找到相同的消除物凑成3个
            const needCnt: number = 3 - idxArr.length
            const ballData: Ball[] = this.getBallById(k, needCnt)
            //将场上筛选出来的消除物移除
            for (let i = 0; i < ballData.length; i++) {
                const ball: Ball = ballData[i];
                const worldPos: Vec3 = ball.node.getWorldPosition()
                arr.push({
                    id: k,
                    angle: ball.node.angle,
                    worldPos: worldPos
                })
                ball.node.destroy()
            }

            //如果场上没找到相同的消除物凑成3个，那么就从候补数组中找
            if (ballData.length < needCnt) {
                let restNeedCnt: number = needCnt - ballData.length
                Debug.Log(Tag, `从候补数组中找${restNeedCnt}个`)
                const restArr: number[] = []
                for (let i = 0; i < GameMgr.ballData.length; i++) {
                    const ballData: DtoBall = GameMgr.ballData[i];
                    if (ballData.id !== k) continue
                    const worldPos: Vec3 = v3()
                    worldPos.x = this.node.worldPosition.x + math.randomRangeInt(-250, 250)
                    worldPos.y = this.node.worldPosition.y + 1200
                    arr.push({
                        id: k,
                        angle: 0,
                        worldPos: worldPos
                    })
                    restArr.push(i)
                    restNeedCnt--
                    if (restNeedCnt <= 0) break
                }
                for (let i = 0; i < restArr.length; i++) {
                    const idx: number = restArr[i];
                    const removedBall: DtoBall = GameMgr.ballData[idx]
                    Debug.Log(Tag, `从候补中移除了`, removedBall.name)
                }
                GameMgr.ballData = ArrayUtil.removeMultiIdx(GameMgr.ballData, restArr)
            }

            const idArr: number[] = []

            for (let i = 0; i < arr.length; i++) {
                const data = arr[i];
                const id: number = data.id
                const worldPos: Vec3 = data.worldPos
                const angle: number = data.angle
                const flyBallNode: Node = this.createFlyBall(worldPos, angle, CfgBall[id])
                flyBallNode.scale = v3(0.5, 0.5, 1)
                const tw = tween(flyBallNode)
                const targetWorldPos: Vec3 = arr[0].worldPos
                const localPos: Vec3 = this._uiTrans.convertToNodeSpaceAR(targetWorldPos)
                if (!idArr.includes(id)) {
                    idArr.push(id)

                    const isPig: boolean = GameUtil.isType(id, BallType.Pig)
                    if (isPig) {
                        const collectId: number = id - 71
                        CollectMgr.add(collectId)
                        AudioMgr.playSfx('a抓到猪音效')
                    }
                }
                tw.to(0.15, { position: localPos })
                tw.call(() => {
                    flyBallNode.destroy()
                    EffectMgr.create(this.parMergePre, this.node, targetWorldPos)
                })
                tw.start()
            }
        }

        EventMgr.emit(EventType.ReqCreateBall, 6)

        this.scheduleOnce(() => {
            AudioMgr.playSfx('a合并')
            this.afterMerge()
        }, 0.2)

    }

    onRevive(failType: FailType): void {
        if (failType !== FailType.SlotFull) return
        EventMgr.emit(EventType.UseSkillMove)
    }

    getBallById(id: number, cnt: number = 1): Ball[] {
        const balls: Ball[] = this.getComponentsInChildren(Ball)
        const ballCnt: number = balls.length
        const res: Ball[] = []
        let curCnt: number = 0
        for (let i = 0; i < ballCnt; i++) {
            const ball: Ball = balls[i];
            if (curCnt === cnt) break
            if (ball.Data.id !== id) continue
            res.push(ball)
            curCnt++
        }
        return res
    }

    onUseSkillMove(): void {
        AudioMgr.playSfx('a移出道具')
        this.slotBallBox.destroyAllChildren()
    }

    onTimeOut(): void {
        if (this.ballBox.IsEmpty) return
        UIMgr.open(UI.Revive, FailType.TimeOut)
    }

    onSelectBall(worldPos: Vec3, angle: number, data: DtoBall) {
        const id: number = data.id
        const lastIdx: number = GameMgr.curIdArr.lastIndexOf(id)
        if (lastIdx === -1) {
            GameMgr.curIdArr.push(id)
        } else {
            GameMgr.curIdArr = [...GameMgr.curIdArr.slice(0, lastIdx), id, ...GameMgr.curIdArr.slice(lastIdx)]
        }
        const curIdx: number = GameMgr.curIdArr.lastIndexOf(id)

        const flyBallNode: Node = this.createFlyBall(worldPos, angle, data)
        const slots: Slot[] = this.slotBox.getComponentsInChildren(Slot)
        const slot: Slot = slots[curIdx]
        const slotWorldPos: Vec3 = slot.orgWorldPos

        const dis: number = Vec3.distance(flyBallNode.worldPosition, slotWorldPos)
        const duration: number = math.clamp(dis / 2000, 0.1, 0.2)

        const slotBall: Node = this.addSlotBall(curIdx, slotWorldPos, data)
        const slotBallUIOpacity: UIOpacity = slotBall.addComponent(UIOpacity)

        slotBallUIOpacity.opacity = 0
        slot.shake(duration)

        this.flyBallToSlot(flyBallNode, duration, slotWorldPos).then(() => {
            if (isValid(slotBall)) {
                slotBallUIOpacity.opacity = 255
                this.scheduleOnce(this.doMerge)
            } else {
                Debug.Log(Tag, '忽略合并')
            }
        })
    }

    private doMerge(): void {
        this.mergeBall()
        this.afterMerge()
    }

    private createFlyBall(worldPos: Vec3, angle: number, data: DtoBall): Node {
        const flyBallNode: Node = instantiate(this.flyBallPre)
        const pos: Vec3 = this._uiTrans.convertToNodeSpaceAR(worldPos)
        flyBallNode.setPosition(pos)
        flyBallNode.setScale(Global.Ball_Scale, Global.Ball_Scale)
        flyBallNode.angle = angle
        this.node.addChild(flyBallNode)
        const flyBall: FlyBall = flyBallNode.getComponent(FlyBall)
        flyBall.Data = data
        return flyBallNode
    }

    private flyBallToSlot(flyBallNode: Node, duration: number, worldPos: Vec3) {
        return new Promise<void>((resolve, reject) => {
            const tw: Tween<Node> = tween(flyBallNode)
            tw.to(duration, { worldPosition: worldPos, angle: 0, scale: v3(0.5, 0.5, 1.0) })
            tw.by(0.1, { position: v3(0, -10, 0) })
            tw.by(0.1, { position: v3(0, 10, 0) })
            tw.call(() => {
                this.scheduleOnce(() => {
                    flyBallNode.destroy()
                })
                resolve()
            })
            tw.start()
        })
    }

    private addSlotBall(curIdx: number, worldPos: Vec3, data: DtoBall): Node {
        const slotBallNode: Node = instantiate(this.slotBallPre)
        this.slotBallBox.addChild(slotBallNode)
        slotBallNode.setSiblingIndex(curIdx)
        slotBallNode.setWorldPosition(worldPos)
        const slotBall: SlotBall = slotBallNode.getComponent(SlotBall)
        slotBall.Data = data
        if (GameUtil.isType(data.id, BallType.Pig)) {
            slotBallNode.addComponent(Shake)
        }
        return slotBallNode
    }

    private mergeBall(): void {
        const removeInfo = ArrayUtil.removeSame(GameMgr.curIdArr, 3)
        const removeIdxArr: number[][] = removeInfo.removeIdxArr
        GameMgr.curIdArr = removeInfo.arr
        const removeCnt: number = removeIdxArr.length
        if (removeCnt <= 0) return

        for (let i = 0; i < removeIdxArr.length; i++) {
            const idxArr: number[] = removeIdxArr[i];

            const targetWorldPos: Vec3 = this.slotBallBox.children[idxArr[1]].getWorldPosition()
            let id: number = 0

            const slotBallArr: Node[] = []

            for (let j = 0; j < idxArr.length; j++) {
                const idx: number = idxArr[j];
                const slotBallNode: Node = this.slotBallBox.children[idx]
                const slotBall: SlotBall = slotBallNode.getComponent(SlotBall)
                const slotBallWorldPos: Vec3 = slotBallNode.getWorldPosition()
                const slotBallAngle: number = slotBallNode.angle
                slotBallArr.push(slotBallNode)

                id = slotBall.Data.id

                const flyBallNode: Node = this.createFlyBall(slotBallWorldPos, slotBallAngle, slotBall.Data)
                flyBallNode.scale = v3(0.5, 0.5, 1)

                const tw = tween(flyBallNode)
                const localPos: Vec3 = this._uiTrans.convertToNodeSpaceAR(targetWorldPos)
                tw.to(0.3, { position: localPos }, { easing: 'sineOut' })
                tw.call(() => {
                    flyBallNode.destroy()
                })
                tw.start()
            }

            slotBallArr.forEach((v) => {
                v.destroy()
            })

            const isPig: boolean = GameUtil.isType(id, BallType.Pig)

            if (isPig) {
                const collectId: number = id - 71
                CollectMgr.add(collectId)
                AudioMgr.playSfx('a抓到猪音效')
            }

            this.scheduleOnce(() => {
                AudioMgr.playSfx('a合并')
                EffectMgr.create(this.parMergePre, this.node, targetWorldPos)
            }, 0.28)
            EventMgr.emit(EventType.ReqCreateBall, 3)
        }

    }

    private onCheckWin(): void {
        if (GameMgr.Pause) return
        if (this.ballBox.IsEmpty) {
            this.unschedule(this.onCheckWin)
            switch (GameMgr.Mode) {
                case GameMode.Normal:
                    this.onNormalModeWin()
                    break
                case GameMode.Super:
                    this.onSuperModeWin()
                    break
            }
        }
    }

    private afterMerge(): void {
        const curIdLen: number = GameMgr.curIdArr.length
        switch (curIdLen) {
            case 6:
                UIMgr.open(UI.Toast, '仅剩一个空位')
                break;
            case 7:
                UIMgr.open(UI.Revive, FailType.SlotFull)
                break;
        }
    }

    public onNormalModeWin(): void {
        GameMgr.Pause = true
        InputBlock.setActive(0.5)
        this.scheduleOnce(() => {
            UIMgr.open(UI.Win)
        }, 0.5)
    }

    public onSuperModeWin(): void {
        GameMgr.Pause = true
        InputBlock.setActive(0.5)
        this.scheduleOnce(() => {
            switch (GameMgr.SuperLevel) {
                case 1:
                    UIMgr.open(UI.StageTip, '难度飙升')
                    this.scheduleOnce(() => {
                        GameMgr.SuperLevel++
                        GameMgr.startGame()
                    }, 2)
                    break;
                case 2:
                    UIMgr.open(UI.SuperWin)
                    break;
            }
        }, 0.5)
    }

}

