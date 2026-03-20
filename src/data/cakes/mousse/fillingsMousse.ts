import {FillingType} from "../biscuit/fillings";

export const fillingsMousse: FillingType[] = [
    {
        name: "Ваниль",
        description: ['Медовые коржи','Крем-брюле','Апельсиновый соус'],
        image: require("../../../assets/images/fillings/bento/strawberry.webp"),
        id: 'honeyOrange',
    },
    {
        name: "Мороженое",
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
        name: "Бархат",
        description: ['Шоколадный бисквит', 'Ганаш на темномм шоколаде', 'Банан в карамели'],
        image: require("../../../assets/images/fillings/bento/vanil.webp"),
        id: 'chocolateBanana',
    },
];