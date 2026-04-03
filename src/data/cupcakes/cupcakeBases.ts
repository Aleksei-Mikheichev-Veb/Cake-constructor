import {ItemType} from "../templates";

export const cupcakeBases: ItemType[] = [
    {
        id: 'vanilla',
        name: 'Ванильный',
        description: 'Нежный ванильный бисквит',
        image: require('./../../assets/images/fillings/cupcake/vanilaBasesFilling.jpg'),
    },
    {
        id: 'chocolate',
        name: 'Шоколадный',
        description: 'Насыщенный шоколадный бисквит',
        image: require('./../../assets/images/fillings/cupcake/chocolateBasesFilling.webp'),
    },
    {
        id: 'red_velvet',
        name: 'Красный бархат',
        description: 'Бисквит «Красный бархат» с лёгким шоколадным вкусом',
        image: require('./../../assets/images/fillings/cupcake/redVelvetBasesFilling.jpg'),
    },
];
