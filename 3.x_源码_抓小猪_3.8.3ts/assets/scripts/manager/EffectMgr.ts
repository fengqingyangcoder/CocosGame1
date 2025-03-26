import { Prefab, Vec3, Node, instantiate } from "cc";

export class EffectMgr {

    public static create(effectPre: Prefab, parent: Node, worldPos?: Vec3): Node {
        const effectNode: Node = instantiate(effectPre)
        parent.addChild(effectNode)
        worldPos && effectNode.setWorldPosition(worldPos)
        return effectNode

    }

}


