export type DecorationType = {
    id: string;
    name: string;
    description: string;
    image: string;
    price?: number;
    minCount?:number;
    byThePiece?:boolean;
};
export type SelectedDecoration = DecorationType & {count: number};
export const decorationsMain: DecorationType[] = [
    {
        id: 'strawberry',
        name: 'Клубника',
        description: 'Свежие ягоды клубники для яркого и сочного украшения',
        image: require('../assets/images/decorations/strawberry.webp'),
        price: 400, // Цена за 1 ягоду
    },
    {
        id: 'blueberry',
        name: 'Голубика',
        description: 'Свежая голубика для нежного и элегантного декора',
        image: require('../assets/images/decorations/blueberry.webp'),
        price: 300, // Цена за 1 ягоду
    },
    {
        id: 'raspberry',
        name: 'Малина',
        description: 'Свежая малина для насыщенного вкуса и цвета',
        image: require('../assets/images/decorations/raspberry.webp'),
        price: 400, // Цена за 1 ягоду
    },
    {
        id: 'berry_assortment',
        name: 'Ассорти ягод',
        description: 'Микс из клубники, малины, ежевики, голубики и черешни для яркого украшения',
        image: require('../assets/images/decorations/berry_assortment.webp'),
        price: 450, // Цена за порцию (например, 5 ягод)
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
        name: 'Печенье oreo',
        description: 'Классическое печенье Oreo для хрустящего и стильного украшения',
        image: require('../assets/images/decorations/oreo.webp'),
        price: 40, // Цена за 1 печенье
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
        price: 80, // Цена за 1 зефир
        minCount:6,
        byThePiece:true
    },
];