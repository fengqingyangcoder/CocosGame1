import { _decorator, Component, Sprite, SpriteAtlas, SpriteFrame } from 'cc';
import { Debug } from '../util/Debug';
const { ccclass,requireComponent,disallowMultiple } = _decorator;

@ccclass('Ref/RefSprite')
@disallowMultiple(true)
@requireComponent(Sprite)
export class RefSprite extends Component {

    private sp:Sprite

    private curSpriteFrame:SpriteFrame
    private curSpriteAtlas:SpriteAtlas

    private isSpriteFrameChanged:boolean = false
    private isSpriteAtlasChanged:boolean = false

    protected onLoad(): void {
        this.sp = this.getComponent(Sprite)
        this.curSpriteFrame = this.sp.spriteFrame
        this.curSpriteAtlas = this.sp.spriteAtlas
    }

    protected update(dt: number): void {
        if(!this.node.isValid) return
        this.updateSpriteAtlas()
        this.updateSpriteFrame()
    }

    private updateSpriteFrame():void{
        if(this.curSpriteFrame === this.sp.spriteFrame) return
        if(this.isSpriteFrameChanged && this.curSpriteFrame) this.curSpriteFrame.decRef()
        if(this.sp.spriteFrame) this.sp.spriteFrame.addRef()
        this.curSpriteFrame = this.sp.spriteFrame
        this.isSpriteFrameChanged = true
    }

    private updateSpriteAtlas():void{
        if(this.curSpriteAtlas === this.sp.spriteAtlas) return
        if(this.isSpriteAtlasChanged && this.curSpriteAtlas) this.curSpriteAtlas.decRef()
        if(this.sp.spriteAtlas) this.sp.spriteAtlas.addRef()
        this.curSpriteAtlas = this.sp.spriteAtlas
        this.isSpriteAtlasChanged = true
    }

    protected onDestroy(): void {
        if(this.isSpriteAtlasChanged && this.curSpriteAtlas) {
            this.curSpriteAtlas.decRef()
        }
        if(this.isSpriteFrameChanged && this.curSpriteFrame) {
            this.curSpriteFrame.decRef()
            // Debug.Log(this.name,`${this.curSpriteFrame.name}当前De引用数为:${this.curSpriteFrame.refCount}`)
        }
    }

}


