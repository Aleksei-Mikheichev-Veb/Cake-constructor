import {ItemType} from "../../templates";

export const gloss:ItemType[] = [
    {
        id: 'gloss',
        name: 'Глянцевое покрытие',
        description: '«Идеально гладкое зеркальное покрытие с ослепительным глянцем — роскошь и современный шик в каждом отражении',
        image:require('../../../assets/images/gloss/gross.webp')
    },
    {
        id: 'velvet',
        name: 'Велюровое покрытие',
        description: 'Нежное матовое бархатное покрытие — мягкий, тактильный велюр с роскошной текстурой',
        image:require('../../../assets/images/gloss/velvet.webp')
    },
    {
        id: 'glossVelvet',
        name: 'Глянцевое и велюровое',
        description: 'Два покрытия в одном торте: ослепительный глянец + нежный бархат — дерзкий контраст и премиум-эффект',
        image:require('../../../assets/images/gloss/glossVelur.jpg')
    },
]