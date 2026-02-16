import {DecorationType} from "./decorationsMain";

export const decorationsAll: DecorationType[] = [
    {
        id: 'strawberry',
        name: 'Клубника',
        description: 'Свежие ягоды клубники для яркого и сочного украшения',
        image: require('../assets/images/decorations/strawberry.webp'),
        price: 50, // Цена за 1 ягоду
    },
    {
        id: 'blueberry',
        name: 'Голубика',
        description: 'Свежая голубика для нежного и элегантного декора',
        image: require('../assets/images/decorations/blueberry.webp'),
        price: 30, // Цена за 1 ягоду
    },
    {
        id: 'raspberry',
        name: 'Малина',
        description: 'Свежая малина для насыщенного вкуса и цвета',
        image: require('../assets/images/decorations/raspberry.webp'),
        price: 40, // Цена за 1 ягоду
    },
    {
        id: 'berry_assortment',
        name: 'Ассорти ягод',
        description: 'Микс из клубники, малины, ежевики, голубики и черешни для яркого украшения',
        image: require('../assets/images/decorations/berry_assortment.webp'),
        price: 250, // Цена за порцию (например, 5 ягод)
    },
    {
        id: 'macarons',
        name: 'Макаронс',
        description: 'Нежные макаронс разных вкусов и цветов для изысканного декора',
        image: require('../assets/images/decorations/macarons.webp'),
        price: 100, // Цена за 1 макарон
        minCount:6,
        byThePiece:true
    },
    {
        id: 'oreo',
        name: 'Печенье Oreo',
        description: 'Классическое печенье Oreo для хрустящего и стильного украшения',
        image: require('../assets/images/decorations/oreo.webp'),
        price: 40,
        minCount:6,
        byThePiece:true
    },
    {
        id: 'raffaello',
        name: 'Raffaello',
        description: 'Конфеты Raffaello для утончённого и сладкого декора',
        image: require('../assets/images/decorations/raffaello.webp'),
        price: 60, // Цена за 1 конфету
        minCount:5,
        byThePiece:true
    },
    {
        id: 'marshmallow',
        name: 'Зефир',
        description: 'Нежный зефир ручной работы для воздушного украшения',
        image: require('../assets/images/decorations/marshmallow.webp'),
        price: 80,
        minCount:6,
        byThePiece:true
    },
    {
        id: 'gingerbread',
        name: 'Пряник',
        description: 'Пряник в форме цифры, животного, цветка или другой формы с нанесением рисунка по вашему выбору',
        image: require('../assets/images/decorations/gingerbread.webp'),
        price: 150,
        byThePiece:true
    },
    {
        id: 'chocolate_numbers',
        name: 'Шоколадные цифры',
        description: 'Объёмные цифры из белого, молочного или тёмного шоколада для украшения торта',
        image: require('../assets/images/decorations/chocolate_numbers.webp'),
        price: 200,
        byThePiece:true,
    },
    {
        id: 'chocolate_letters',
        name: 'Шоколадные буквы',
        description: 'Слова или фразы из объёмных шоколадных букв (цена за букву)',
        image: require('../assets/images/decorations/chocolate_letters.webp'),
        price: 50,
        byThePiece:true,
    },
    {
        id: 'lollipops',
        name: 'Леденцы',
        description: 'Леденцы на палочка в форме круга, сердца, звездочки и другие',
        image: require('../assets/images/decorations/lollipops.webp'),
        price: 80,
        byThePiece:true,
        minCount:3
    },

    {
        id: 'kinder_bueno',
        name: 'Kinder Bueno',
        description: 'Батончики Kinder Bueno для современного и вкусного декора',
        image: require('../assets/images/decorations/kinder_bueno.webp'),
        price: 70,
        byThePiece:true,
    },
    {
        id: 'choco_pie',
        name: 'Choco Pie',
        description: 'Choco Pie для оригинального и сладкого украшения торта',
        image: require('../assets/images/decorations/choco_pie.webp'),
        price: 60,
        byThePiece:true,
    },
    {
        id: 'meringue_stick',
        name: 'Меренга на палочке',
        description: 'Хрустящая меренга на палочке, украшенная цветной глазурью или посыпкой',
        image: require('../assets/images/decorations/meringue_stick.webp'),
        price: 100,
        byThePiece:true,
    },
    {
        id: 'cake_pops',
        name: 'Кейк-попс',
        description: 'Мини-тортики на палочке, покрытые шоколадом и декорированные по вашему вкусу',
        image: require('../assets/images/decorations/cake_pops.webp'),
        price: 150,
        minCount:5,
        byThePiece:true,
    },
    {
        id: 'chocolate_figures',
        name: 'Фигурки из шоколада',
        description: 'Шоколадные фигурки (животные, цветы, персонажи) для уникального декора',
        image: require('../assets/images/decorations/chocolate_figures.webp'),
        price: 300,
        byThePiece:true,
    },
];