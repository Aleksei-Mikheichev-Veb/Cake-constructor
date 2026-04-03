import {ItemType} from "../templates";

export const cupcakeFillings: ItemType[] = [
    {
        id: 'strawberry',
        name: 'Клубника',
        description: 'Начинка из свежей клубники',
        image: require('./../../assets/images/fillings/cupcake/strawberryFilling.jpg'),
    },
    {
        id: 'raspberry',
        name: 'Малина',
        description: 'Начинка из свежей малины',
        image: require('./../../assets/images/fillings/cupcake/raspberryFilling.jpeg'),
    },
    {
        id: 'blueberry',
        name: 'Черника',
        description: 'Начинка из черники',
        image: require('./../../assets/images/fillings/cupcake/blueberryFilling.webp'),
    },
    {
        id: 'cherry',
        name: 'Вишня',
        description: 'Начинка из вишни',
        image: require('./../../assets/images/fillings/cupcake/cherryFilling.webp'),
    },
    {
        id: 'caramel',
        name: 'Карамель',
        description: 'Карамельная начинка',
        image: require('./../../assets/images/fillings/cupcake/caramelFilling.webp'),
    },
    {
        id: 'chocolate',
        name: 'Шоколад',
        description: 'Шоколадная начинка',
        image: require('./../../assets/images/fillings/cupcake/chocolateFilling.jpg'),
    },
];
