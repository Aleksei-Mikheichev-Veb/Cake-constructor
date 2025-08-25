import {ItemType} from "./templates";

export const smudges: ItemType[] = [
    {
        id: 'empty',
        name: 'Без подтеков и заливки',
        description: 'Без подтеков и заливки',
        image: require('../assets/images/smudges/empty.webp'),
    },
    {
        id: 'half_drips_only',
        name: 'Подтеки на половину',
        description: 'Верхняя часть торта не залита глазурью, подтеки присутствуют на половине круга.',
        image: require('../assets/images/smudges/halfCircleSmudges.jpeg'),
    },
    {
        id: 'drips_only',
        name: 'Только подтеки',
        description: 'Верхняя часть торта не залита глазурью, подтеки присутствуют по всему кругу.',
        image: require('../assets/images/smudges/circleSmudges.jpg'),
    },
    {
        id: 'halfFullSmudges',
        name: 'Полузалитая с подтеками',
        description: 'Верхняя часть торта залита глазурью наполовину, подтеки присутствуют на половине круга.',
        image: require('../assets/images/smudges/halfFullSmudges.png'),
    },
    {
        id: 'full',
        name: 'Полная',
        description: 'Верхняя часть торта залита глазурью, по всему кругу присутствуют подтеки.',
        image: require('../assets/images/smudges/fullSmudges.jpg'),
    },
];