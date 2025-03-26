import { Bundle } from "../enum/Bundle";
import { ItemType } from "../enum/ItemType";
import { SkillType } from "../enum/SkillType";

export type DtoItem = {
    id: number,
    name: string,
    type: ItemType,
    skillType?: SkillType,
    bundle: Bundle,
    icon: string
}

export const CfgItem: DtoItem[] = [
    {
        id: 0,
        name: '猪猪币',
        type: ItemType.Coin,
        bundle: Bundle.Icon,
        icon: 'item/icon_zzb'
    },
    {
        id: 1,
        name: '冰冻道具',
        type: ItemType.Skill,
        skillType: SkillType.Freeze,
        bundle: Bundle.Icon,
        icon: 'item/icon_bd'
    },
    {
        id: 2,
        name: '消除道具',
        type: ItemType.Skill,
        skillType: SkillType.Erase,
        bundle: Bundle.Icon,
        icon: 'item/icon_pd'
    },
    {
        id: 3,
        name: '移出道具',
        type: ItemType.Skill,
        skillType: SkillType.Move,
        bundle: Bundle.Icon,
        icon: 'item/icon_yc'
    },
    {
        id: 4,
        name: '臭屁猪',
        type: ItemType.Collection,
        bundle: Bundle.Icon,
        icon: 'item/img1_1'
    },
    {
        id: 5,
        name: '健身猪',
        type: ItemType.Collection,
        bundle: Bundle.Icon,
        icon: 'item/img2_1'
    },
    {
        id: 6,
        name: '鼻涕猪',
        type: ItemType.Collection,
        bundle: Bundle.Icon,
        icon: 'item/img3_1'
    },
    {
        id: 7,
        name: '大眼猪',
        type: ItemType.Collection,
        bundle: Bundle.Icon,
        icon: 'item/img4_1'
    },
    {
        id: 8,
        name: '贪睡猪',
        type: ItemType.Collection,
        bundle: Bundle.Icon,
        icon: 'item/img5_1'
    },
    {
        id: 9,
        name: '蛋黄猪',
        type: ItemType.Collection,
        bundle: Bundle.Icon,
        icon: 'item/img6_1'
    },
    {
        id: 10,
        name: '薯条猪',
        type: ItemType.Collection,
        bundle: Bundle.Icon,
        icon: 'item/img7_1'
    },
    {
        id: 11,
        name: '游戏猪',
        type: ItemType.Collection,
        bundle: Bundle.Icon,
        icon: 'item/img8_1'
    },
    {
        id: 12,
        name: '奶茶猪',
        type: ItemType.Collection,
        bundle: Bundle.Icon,
        icon: 'item/img9_1'
    },
    {
        id: 13,
        name: '趴地猪',
        type: ItemType.Collection,
        bundle: Bundle.Icon,
        icon: 'item/img10_1'
    },
    {
        id: 14,
        name: '羊羊猪',
        type: ItemType.Collection,
        bundle: Bundle.Icon,
        icon: 'item/img11_1'
    },
    {
        id: 15,
        name: '滑板猪',
        type: ItemType.Collection,
        bundle: Bundle.Icon,
        icon: 'item/img12_1'
    }
]

