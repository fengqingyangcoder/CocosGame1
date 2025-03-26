import { _decorator, Component, director } from 'cc'
const { ccclass, property } = _decorator

const Max_Timer_Cnt: number = 10000

/**
 * 时间管理
 */
@ccclass('Manager/TimeMgr')
export class TimeMgr extends Component {

    private static _inst: TimeMgr = null

    /**计时器字典 */
    private static _timerMap: Map<number, any> = new Map<number, any>()

    /**计时器下一个分配id */
    private static nextId: number = 0

    protected onLoad(): void {
        TimeMgr._inst = this
        director.addPersistRootNode(this.node)
    }

    public static async delay(time: number = 0): Promise<void> {
        return new Promise<void>((resolve, reject) => { this._inst.scheduleOnce(() => { resolve() }, time) })
    }

    /**
     * 设置一个计时器
     * @param callback 计时器回调 使用格式 function.bind(this)
     * @param interval 间隔时间
     * @param repeat 回调次数
     * @returns 返回计时器id
     */
    public static setTimer(callback: Function, interval: number, repeat: number = 1): number {
        let curCount = 0
        let id = this.nextId++
        if (id > Max_Timer_Cnt) id = 0
        const timerCallback = () => {
            callback && callback()
            ++curCount >= repeat && this.clearTimer(id)
        }
        this._timerMap.set(id, timerCallback)
        this._inst.schedule(timerCallback, interval, repeat)
        return id
    }

    /**
     * 清除一个计时器
     * @param timerId 计时器id 
     */
    public static clearTimer(timerId: number): void {
        if (this._timerMap.has(timerId)) {
            this._inst.unschedule(this._timerMap.get(timerId))
            this._timerMap.delete(timerId)
        }
    }
}

