import { _decorator, Button, Component, SpriteFrame } from 'cc';
import { Debug } from '../util/Debug';
const { ccclass, property, disallowMultiple, requireComponent } = _decorator;

@ccclass('Ref/RefButton')
@disallowMultiple(true)
@requireComponent(Button)
export class RefButton extends Component {

    private btn: Button

    private curNormalSprite: SpriteFrame
    private curHoverSprite: SpriteFrame
    private curPressedSprite: SpriteFrame
    private curDisabledSprite: SpriteFrame

    private isNormalSpriteChanged: boolean = false
    private isHoverSpriteChanged: boolean = false
    private isPressedSpriteChanged: boolean = false
    private isDisabledSpriteChanged: boolean = false

    protected onLoad(): void {
        this.btn = this.getComponent(Button)
        this.curNormalSprite = this.btn.normalSprite
        this.curHoverSprite = this.btn.hoverSprite
        this.curPressedSprite = this.btn.pressedSprite
        this.curDisabledSprite = this.btn.disabledSprite
    }

    protected update(dt: number): void {
        if (!this.node.isValid) return
        this.updateNormalSpriteFrame()
        this.updateHoverSpriteFrame()
        this.updatePressedSpriteFrame()
        this.updateDisabledSpriteFrame()
    }

    private updateNormalSpriteFrame(): void {
        if (this.curNormalSprite === this.btn.normalSprite) return
        if (this.isNormalSpriteChanged && this.curNormalSprite) this.curNormalSprite.decRef()
        if (this.btn.normalSprite) this.btn.normalSprite.addRef()
        this.curNormalSprite = this.btn.normalSprite
        this.isNormalSpriteChanged = true
        Debug.Log(this.name, `设置normalSprite`)
    }

    private updateHoverSpriteFrame(): void {
        if (this.curHoverSprite === this.btn.hoverSprite) return
        if (this.isHoverSpriteChanged && this.curHoverSprite) this.curHoverSprite.decRef()
        if (this.btn.hoverSprite) this.btn.hoverSprite.addRef()
        this.curHoverSprite = this.btn.hoverSprite
        this.isHoverSpriteChanged = true
        Debug.Log(this.name, `设置hoverSprite`)
    }

    private updatePressedSpriteFrame(): void {
        if (this.curPressedSprite === this.btn.pressedSprite) return
        if (this.isPressedSpriteChanged && this.curPressedSprite) this.curPressedSprite.decRef()
        if (this.btn.pressedSprite) this.btn.pressedSprite.addRef()
        this.curPressedSprite = this.btn.pressedSprite
        this.isPressedSpriteChanged = true
        Debug.Log(this.name, `设置pressedSprite`)
    }

    private updateDisabledSpriteFrame(): void {
        if (this.curDisabledSprite === this.btn.disabledSprite) return
        if (this.isDisabledSpriteChanged && this.curDisabledSprite) this.curDisabledSprite.decRef()
        if (this.btn.disabledSprite) this.btn.disabledSprite.addRef()
        this.curDisabledSprite = this.btn.disabledSprite
        this.isDisabledSpriteChanged = true
        Debug.Log(this.name, `设置disabledSprite`)
    }

    protected onDestroy(): void {
        if (this.isNormalSpriteChanged && this.curNormalSprite) {
            this.curNormalSprite.decRef()
        }
        if (this.isHoverSpriteChanged && this.curHoverSprite) {
            this.curHoverSprite.decRef()
        }
        if (this.isPressedSpriteChanged && this.curPressedSprite) {
            this.curPressedSprite.decRef()
        }
        if (this.isDisabledSpriteChanged && this.curDisabledSprite) {
            this.curDisabledSprite.decRef()
        }
    }

}


