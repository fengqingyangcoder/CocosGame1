import { _decorator, Component, instantiate, macro, math, Node, Prefab } from 'cc';
import { Ball } from './Ball';
import { EventMgr } from '../manager/EventMgr';
import { EventType } from '../enum/EventType';
import { Debug } from '../util/Debug';
import { ResMgr } from '../manager/ResMgr';
import { Bundle } from '../enum/Bundle';
import { GameMgr } from '../manager/GameMgr';
import { Global } from '../Global';
import { DtoBall } from '../dto/DtoBall';
import { CfgBall } from '../config/cfg_ball';
const { ccclass, property } = _decorator;

const Tag: string = 'BallBox'

@ccclass('Game/BallBox')
export class BallBox extends Component {

    public get IsEmpty(): boolean {
        return this.node.children.length <= 0
    }

    private waitBalls: DtoBall[] = []

    protected onLoad(): void {
        EventMgr.on(EventType.UseSkillMove, this.onUseSkillMove, this)
        EventMgr.on(EventType.ReqCreateBall, this.onReqCreateBall, this)
        this.schedule(this.tryCreateBall, 0.05, macro.REPEAT_FOREVER)
    }

    protected onDestroy(): void {
        this.unscheduleAllCallbacks()
        EventMgr.off(EventType.UseSkillMove, this.onUseSkillMove, this)
        EventMgr.off(EventType.ReqCreateBall, this.onReqCreateBall, this)
    }

    private tryCreateBall(): void {
        if (this.waitBalls.length <= 0) return
        const ballData: DtoBall = this.waitBalls.shift()
        const ballPre: Prefab = ResMgr.getRes(Bundle.Game, ballData.name, 'ball/')
        const ballNode: Node = instantiate(ballPre)
        ballNode.setPosition(math.randomRangeInt(-250, 250), 1200, 0)
        ballNode.setScale(Global.Ball_Scale, Global.Ball_Scale)
        this.node.addChild(ballNode)
        const ball: Ball = ballNode.getComponent(Ball)
        ball.Data = ballData
    }

    private onReqCreateBall(cnt: number = 1): void {
        if (GameMgr.ballData.length <= 0) {
            // Debug.Warn(Tag, '已经没有球需要创建了')
            return
        }
        cnt = Math.min(GameMgr.ballData.length, cnt)
        Debug.Log(Tag, `创建${cnt}个球`)

        for (let i = 0; i < cnt; i++) {
            if (GameMgr.ballData.length <= 0) break
            const ball: DtoBall = GameMgr.ballData.shift()
            if (!ball) {
                Debug.Warn(Tag, '创建消除物时发生意外错误')
                continue
            }
            this.waitBalls.push(ball)
        }
        Debug.Log(Tag, `剩余${GameMgr.ballData.length}个球`)
    }

    private onUseSkillMove(): void {
        for (let i = 0; i < GameMgr.curIdArr.length; i++) {
            const id: number = GameMgr.curIdArr[i];
            const ball: DtoBall = CfgBall[id]
            this.waitBalls.push(ball)
        }
        GameMgr.curIdArr = []
    }

}
