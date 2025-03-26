import { Vec3, game, sys } from "cc";
import { qg } from "../Global";
import { CfgBall } from "../config/cfg_ball";
import { DtoBall } from "../dto/DtoBall";
import { BallType } from "../enum/BallType";

export class GameUtil {

    public static getBallsByType(type: BallType): DtoBall[] {
        const balls: DtoBall[] = CfgBall.filter((v) => {
            return v.type == type
        })
        return balls
    }

    public static getNormalBalls(): DtoBall[] {
        const balls: DtoBall[] = CfgBall.filter((v) => {
            return v.type != BallType.Pig
        })
        return balls
    }

    public static isType(ballId: number, type: BallType): boolean {
        const data: DtoBall = CfgBall[ballId]
        if (!data) return false
        return data.type == type
    }

    public static exit(): void {
        switch (sys.platform) {
            case sys.Platform.MOBILE_BROWSER:
            case sys.Platform.DESKTOP_BROWSER:
            case sys.Platform.ANDROID:
                game.end()
                break;
            case sys.Platform.OPPO_MINI_GAME:
                qg.exitApplication({
                    data: '',
                    success: () => {
                        console.log('success')
                    },
                    fail: (res) => {
                        console.error(res)
                    }
                })
                break;
        }
    }

}


