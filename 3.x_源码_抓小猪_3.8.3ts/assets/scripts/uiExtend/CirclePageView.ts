import { _decorator, Component, Node, PageView, Vec2 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UIExtend/CirclePageView')
export class CirclePageView extends PageView {

    @property
    circle:boolean = true

    protected _autoScrollToPage (): void {
        const bounceBackStarted = this._startBounceBackIfNeeded();
        if (!this.circle && bounceBackStarted) {
            const bounceBackAmount = this._getHowMuchOutOfBoundary();
            this._clampDelta(bounceBackAmount);
            if (bounceBackAmount.x > 0 || bounceBackAmount.y < 0) {
                this._curPageIdx = this._pages.length === 0 ? 0 : this._pages.length - 1;
            }
            if (bounceBackAmount.x < 0 || bounceBackAmount.y > 0) {
                this._curPageIdx = 0;
            }

            if (this.indicator) {
                this.indicator._changedState();
            }
        } else {
            const moveOffset = new Vec2();
            Vec2.subtract(moveOffset, this._touchBeganPosition, this._touchEndPosition);
            const index = this._curPageIdx;
            const nextIndex = index + this._getDragDirection(moveOffset);
            const timeInSecond = this.pageTurningSpeed * Math.abs(index - nextIndex);

            if(this.circle){
                if(nextIndex === -1){
                    this.scrollToPage(this._pages.length - 1,timeInSecond)
                    return
                }else if(nextIndex === this._pages.length){
                    this.scrollToPage(0,timeInSecond)
                    return
                }
            }

            if (nextIndex < this._pages.length) {
                if (this._isScrollable(moveOffset, index, nextIndex)) {
                    this.scrollToPage(nextIndex, timeInSecond);
                    return;
                } else {
                    const touchMoveVelocity = this._calculateTouchMoveVelocity();
                    if (this._isQuicklyScrollable(touchMoveVelocity)) {
                        this.scrollToPage(nextIndex, timeInSecond);
                        return;
                    }
                }
            }
            this.scrollToPage(index, timeInSecond);
        }
    }
}


