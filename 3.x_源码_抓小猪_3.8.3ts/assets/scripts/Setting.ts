import { PhysicsSystem2D, EPhysics2DDrawFlags } from "cc"
import { StorageUtil } from "./util/StorageUtil"

export class Setting {

    private static vibrateEnabled: boolean = true
    public static get VibrateEnabled(): boolean {
        return this.vibrateEnabled
    }
    public static set VibrateEnabled(v: boolean) {
        this.vibrateEnabled = v
        StorageUtil.setItem('vibrateEnabled', v)
    }

    private static sfxEnabled: boolean = true
    public static get SfxEnabled(): boolean {
        return this.sfxEnabled
    }
    public static set SfxEnabled(v: boolean) {
        this.sfxEnabled = v
        StorageUtil.setItem('sfxEnabled', v)
    }

    private static bgmEnabled: boolean = true
    public static get BgmEnabled(): boolean {
        return this.bgmEnabled
    }
    public static set BgmEnabled(v: boolean) {
        this.bgmEnabled = v
        StorageUtil.setItem('bgmEnabled', v)
    }

    public static init(): void {
        // macro.CLEANUP_IMAGE_CACHE = false

        // let dynamicAtlasManager = DynamicAtlasManager.instance
        // dynamicAtlasManager.enabled = true
        // dynamicAtlasManager.maxFrameSize = 1024

        let physicsSystem = PhysicsSystem2D.instance
        physicsSystem.enable = true
        physicsSystem.fixedTimeStep = 1 / 60
        physicsSystem.velocityIterations = 6
        physicsSystem.positionIterations = 6
        // physicsSystem.debugDrawFlags = EPhysics2DDrawFlags.Shape

        this.sfxEnabled = StorageUtil.getItem('sfxEnabled', true)
        this.bgmEnabled = StorageUtil.getItem('bgmEnabled', true)
        this.vibrateEnabled = StorageUtil.getItem('vibrateEnabled', true)

    }

}

globalThis.Setting = Setting