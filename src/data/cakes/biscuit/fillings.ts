export type FillingType = {
    name:string;
    description: string[];
    image:string;
    id: string;
}

export const fillings: FillingType[] = [
    {
        name: "Медовик с апельсином",
        description: ['Медовые коржи','Крем-брюле','Апельсиновый соус'],
        image: require("../../../assets/images/fillings/honeyOrange.webp"),
        id: 'honeyOrange',
    },
    {
        name: "Груша фундук шоколад",
        description: ['Шоколадные коржи','Груша в карамели','Нутелла с фундуком'],
        image: require("../../../assets/images/fillings/pearChocolate.webp"),
        id: 'pearChocolate',
    },
    {
        name: "Клубника-кокос",
        description: ['Нежные вафельные коржи','Кокосовый крем','Клубничое кремю'],
        image: require("../../../assets/images/fillings/strawberryСoconut.webp"),
        id: 'strawberryСoconut',
    },
    {
        name: "Шоколад-банан",
        description: ['Шоколадный бисквит', 'Ганаш на темномм шоколаде', 'Банан в карамели'],
        image: require("../../../assets/images/fillings/chocolateBanana.webp"),
        id: 'chocolateBanana',
    },
    {
        name: "Черный лес",
        description: ['Шоколадный бисквит', 'Крем-чиз', 'Вишня'],
        image: require("../../../assets/images/fillings/blackForest.webp"),
        id: 'blackForest',
    },
    {
        name: "Малиновый трюфель",
        description: ['Шоколадный бисквит', 'Ганаш на темномм шоколаде', 'Малиновый соус'],
        image: require("../../../assets/images/fillings/raspberryTruffle.webp"),
        id: 'raspberryTruffle',
    },
    {
        name: "Фисташка-малина",
        description: ['Бисквит с фисташковой пастой', 'Малиновый мусс', 'Малиновое кремю'],
        image: require("../../../assets/images/fillings/pistachioRaspberry.webp"),
        id: 'pistachioRaspberry',
    },
    {
        name: "Морковныйс облепихой",
        description: ['Морковный бисквит с грецким орехом', 'Крем-чиз', 'Кремю из облепихи'],
        image: require("../../../assets/images/fillings/carrotSeaBuckthorn.webp"),
        id: 'carrotSeaBuckthorn',
    },
    {
        name: "Сникерс",
        description: ['Шоколадный бисквит', 'Сливочная карамель', 'Солёный арахис', 'Шоколадный крем'],
        image: require("../../../assets/images/fillings/snickers.webp"),
        id: 'snickers',
    },
    {
        name: "Рафаэлло",
        description: ['Нежные кокосовые коржи', 'Хрустящая вафельная крошка', 'Дробленый миндаль', 'Крем на белом шоколаде'],
        image: require("../../../assets/images/fillings/Raffaello.webp"),
        id: 'Raffaello',
    },
    {
        name: "Чернослив-грецкий орех",
        description: ['Шоколадный бисквит', 'Чернослив и грецкий орех', 'Хрустящий меренговый слой', 'Сливочный крем-чиз'],
        image: require("../../../assets/images/fillings/prunesWalnuts.webp"),
        id: 'prunesWalnuts',
    },
    {
        name: "Клубничный бархат",
        description: ['Бисквит с шоколадным вкусом', 'Сливочный крем', 'Нежный клубничный мусс'],
        image: require("../../../assets/images/fillings/strawberryVelvet.webp"),
        id: 'strawberryVelvet',
    },
    {
        name: "Клубничное наслаждение",
        description: ['Ванильный бисквит', 'Клубничный соус', 'Творожный крем'],
        image: require("../../../assets/images/fillings/strawberryDelight.webp"),
        id: 'strawberryDelight',
    },
    {
        name: "Персик-йогурт",
        description: ['Ванильный бисквит', 'Творожный йогуртовый мусс', 'Персики'],
        image: require("../../../assets/images/fillings/peachYogurt.webp"),
        id: 'peachYogurt',
    },

];