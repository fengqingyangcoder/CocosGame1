import { Debug } from "../util/Debug";

const Tag: string = 'TrackMgr'

export class TrackMgr {

    public static track(eventId: string, data = {}): void {
        Debug.Log(Tag, `事件名:${eventId},data:${JSON.stringify(data)}`)
    }
}


