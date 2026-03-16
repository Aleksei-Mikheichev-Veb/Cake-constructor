import {ItemType} from "../../templates";

export const shapeMousse:ItemType[] = [
    {
        id: 'heart',
        name: 'В форме сердца',
        description: 'Романтичный муссовый торт в форме сердца — идеальный подарок для влюблённых и особенных дат',
        image:require('../../../assets/images/shape/heartMousse.jpg')
    },
    {
        id: 'ellipse',
        name: 'В форме элипса',
        description: 'Элегантный муссовый торт овальной формы — утончённый и современный вариант для стильного праздника',
        image:require('../../../assets/images/shape/mousse.webp')
    },
    {
        id: 'straight',
        name: 'С прямыми стенками',
        description: 'Муссовый торт с идеально ровными вертикальными стенками — минимализм и чёткая геометрия в каждом кусочке',
        image:require('../../../assets/images/shape/straightMousse.webp')
    }
]