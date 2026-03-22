import {ItemType} from "../../templates";

export const colors: ItemType[] = [
    {
        id: 'color1',
        name: 'Один цвет',
        image: require('../../../assets/images/color/biscuit/oneColor.webp'),
        description: 'Торт покрыт одним равномерным цветом.',
    },
    {
        id: 'color2',
        name: '2-3 цвета',
        image: require('../../../assets/images/color/biscuit/multiColor.jpg'),
        description: 'Комбинация 2-3 цветов для яркого дизайна.',
    },
    {
        id: 'color3',
        name: 'Стиль космоса',
        image: require('../../../assets/images/color/biscuit/space2.jpg'),
        description: 'Галактический стиль с темными тонами и яркими акцентами.',
    },
    {
        id: 'color4',
        name: 'Основной цвет с мазками',
        image: require('../../../assets/images/color/biscuit/brushstrokeEffect.jpg'),
        description: 'Один основной цвет с мазками второго цвета снизу.',
    },
    {
        id: 'color5',
        name: 'Основной цвет с бортиком',
        image: require('../../../assets/images/color/biscuit/cakeRim.jpg'),
        description: 'Один основной цвет с объемным бортиком другого цвета.',
    },
];