import {FillingType} from "../biscuit/fillings";

export const fillingsBento: FillingType[] = [
    {
        name: "Ваниль-клубника",
        description: ['Медовые коржи','Крем-брюле','Апельсиновый соус'],
        image: require("../../../assets/images/fillings/bento/strawberry.webp"),
        id: 'honeyOrange',
    },
    {
        name: "Клубничное мороженое",
        description: ['Шоколадные коржи','Груша в карамели','Нутелла с фундуком'],
        image: require("../../../assets/images/fillings/bento/raspberry.webp"),
        id: 'pearChocolate',
    },
    {
        name: "Милка",
        description: ['Нежные вафельные коржи','Кокосовый крем','Клубничое кремю'],
        image: require("../../../assets/images/fillings/bento/milka.webp"),
        id: 'strawberryСoconut',
    },
    {
        name: "Красный бархат",
        description: ['Шоколадный бисквит', 'Ганаш на темномм шоколаде', 'Банан в карамели'],
        image: require("../../../assets/images/fillings/bento/vanil.webp"),
        id: 'chocolateBanana',
    },
];