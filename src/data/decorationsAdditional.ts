import {DecorationType} from "./decorationsMain";

export const decorationsAdditional: DecorationType[] = [
    {
        id: 'gingerbread',
        name: 'Пряник',
        description: 'Пряник в форме цифры, животного, цветка или другой формы с нанесением рисунка по вашему выбору',
        image: require('../assets/images/decorations/gingerbread.webp'),
        price: 150, // Цена за 1 пряник
    },
    {
        id: 'chocolate_numbers',
        name: 'Шоколадные цифры',
        description: 'Объёмные цифры из белого, молочного или тёмного шоколада для украшения торта',
        image: require('../assets/images/decorations/chocolate_numbers.webp'),
        price: 200, // Цена за 1 цифру
    },
    {
        id: 'chocolate_letters',
        name: 'Шоколадные буквы',
        description: 'Слова или фразы из объёмных шоколадных букв (цена за букву)',
        image: require('../assets/images/decorations/chocolate_letters.webp'),
        price: 50, // Цена за 1 букву
    },
    {
        id: 'lollipops',
        name: 'Леденцы',
        description: 'Леденцы на палочка в форме круга, сердца, звездочки и другие',
        image: require('../assets/images/decorations/lollipops.webp'),
        price: 80, // Цена за 1 букву
        minCount:3
    },

    {
        id: 'kinder_bueno',
        name: 'Kinder Bueno',
        description: 'Батончики Kinder Bueno для современного и вкусного декора',
        image: require('../assets/images/decorations/kinder_bueno.webp'),
        price: 70, // Цена за 1 батончик
    },
    {
        id: 'choco_pie',
        name: 'Choco Pie',
        description: 'Choco Pie для оригинального и сладкого украшения торта',
        image: require('../assets/images/decorations/choco_pie.webp'),
        price: 60, // Цена за 1 штуку
    },
    {
        id: 'meringue_stick',
        name: 'Меренга на палочке',
        description: 'Хрустящая меренга на палочке, украшенная цветной глазурью или посыпкой',
        image: require('../assets/images/decorations/meringue_stick.webp'),
        price: 100, // Цена за 1 штуку
    },
    {
        id: 'cake_pops',
        name: 'Кейк-попс',
        description: 'Мини-тортики на палочке, покрытые шоколадом и декорированные по вашему вкусу',
        image: require('../assets/images/decorations/cake_pops.webp'),
        price: 150, // Цена за 1 штуку
        minCount:5,
    },
    {
        id: 'chocolate_figures',
        name: 'Фигурки из шоколада',
        description: 'Шоколадные фигурки (животные, цветы, персонажи) для уникального декора',
        image: require('../assets/images/decorations/chocolate_figures.webp'),
        price: 300, // Цена за 1 фигурку
    },
];