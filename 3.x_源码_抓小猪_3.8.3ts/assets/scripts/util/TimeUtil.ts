export class TimeUtil {
    /**
     * 获取当前时间戳
     * @returns 
    */
    public static getCurrTimeStamp(): number {
        return Date.now()
    }

    public static getHours(): number {
        return new Date().getHours()
    }

    /**
     * 获取当前时间对象
     * @returns 
     */
    public static getCurrTimeDate(): Date {
        return new Date(this.getCurrTimeStamp())
    }

    /**
     * 获取星期几  1 - 7
     * @returns 
     */
    public static getCurWeekDay(): number {
        let day = this.getCurrTimeDate().getDay()
        return day == 0 ? 7 : day
    }

    /**
     * 是否为同一天
     * @param timestemp 与当前时间对比的时间戳
     * @returns 
     */
    public static isSameDay(timestemp: number): boolean {
        let tempDate = new Date(timestemp)
        let curDate = this.getCurrTimeDate()
        return tempDate.getFullYear() == curDate.getFullYear() && tempDate.getMonth() == curDate.getMonth() && tempDate.getDate() == curDate.getDate()
    }

    /**
     * 是否为同一周
     * @param timestamp 与当前时间对比的时间戳
     */
    public static isSameWeek(timestamp: number): boolean {
        let currTime = this.getCurrTimeStamp()
        let currWeek = this.getCurWeekDay()
        let date = new Date(timestamp)
        let strDate = date.toLocaleDateString()
        for (let i = 1; i <= 7; i++) {
            if (strDate == new Date(currTime + (i - currWeek) * 24 * 3600 * 1000).toLocaleDateString()) {
                return true
            }
        }
        return false
    }
    /**
     * 获取指定时间戳
     * @param time  格式为:YYYY/MM/DD HH:MM:SS  例如 2021/5/31 18:53
     * @returns 
     */
    public static getAssignTimestamp(time: string): number {
        time = time.replace(/-/g, '/')
        let date = new Date(time)
        let sTime = date.getTime()
        return sTime
    }

    /**
     * 时间格式化 时:分:秒
     * @param millisecond 毫秒
     * @returns 
     */
    public static formatTime_HHMMSS(millisecond: number): string {
        let second = millisecond / 1000
        let hour = (Array(2).join('0') + Math.floor(second / 3600)).slice(-2)
        let min = (Array(2).join('0') + Math.floor((second % 3600) / 60)).slice(-2)
        let sec = (Array(2).join('0') + Math.floor(second) % 60).slice(-2)
        if (hour == "00") {
            return min + ":" + sec
        } else {
            return hour + ":" + min + ":" + sec
        }
    }

    /**
     * 时间格式化 10天1小时20分50秒
     * @param millisecond 毫秒
     * @returns 
     */
    public static formatTime_DDHHMMSS(millisecond: number): string {
        let dval = millisecond / 1000
        let ss = dval % 60
        dval = Math.floor(dval / 60)
        let mm = dval % 60
        dval = Math.floor(dval / 60)
        let hh = dval % 24
        dval = Math.floor(dval / 24)
        let dd = dval

        let ret = ""
        if (dd > 0) {
            ret = dd + "天"
            if (hh > 0) {
                ret += hh + "小时"
            }
        } else {
            if (hh > 0) {
                ret += hh + "小时"
            }
            if (mm > 0) {
                ret += mm + "分"
            } else if (hh > 0) {
                ret += "零"
            }
            if (ss > 0) {
                ret += Math.floor(ss) + "秒"
            }
        }
        return ret
    }

    public static isWithinTimeRange(time: number, startHour: number, endHour: number): boolean {
        // 将时间戳转换为日期对象
        const date = new Date(time);
        // 获取日期对象的小时数
        const hour = date.getHours();

        // 如果结束时间小于起始时间，表示时段跨越了午夜
        const isCrossingMidnight = endHour < startHour;

        // 计算实际的起始和结束小时，如果跨越了午夜，则结束时间需要加上24小时
        const effectiveStartHour = isCrossingMidnight ? startHour : startHour;
        const effectiveEndHour = isCrossingMidnight ? (endHour + 24) : endHour;

        // 判断时间戳是否在指定时段内
        return hour >= effectiveStartHour && hour < effectiveEndHour;
    }

    public static getTodayTimestampAtHour(hour: number, minute: number = 0): number {
        // 获取当前日期对象
        const today = new Date();
        // 设置时间为当天的指定小时和分钟
        today.setHours(hour, minute, 0, 0); // 设置秒和毫秒为0
        // 返回时间戳
        return today.getTime();
    }
}
globalThis.TimeUtil = TimeUtil


