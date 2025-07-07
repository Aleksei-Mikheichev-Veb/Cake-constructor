export type TemplateType = {
    id: string;
    name:string;
    description:string;
    image:string;
}

export const templates: TemplateType[] = [
    {
        id: 'empty',
        name: 'Без шаблона',
        description: 'Полная свобода творчества: выберите и расположите угощения на торте по своему желанию.',
        image: require('../assets/images/templates/empty.webp'),
    },
    {
        id: 'circle',
        name: 'Оформление по кругу',
        description: 'Украшения равномерно размещаются по окружности торта, создавая гармоничный и элегантный вид.',
        image: require('../assets/images/templates/circle.jpg'),
    },
    {
        id: 'semicircle',
        name: 'Оформление в виде полукруга',
        description: 'Украшения располагаются в форме полукруга на одной стороне торта, добавляя асимметричную изюминку дизайну.',
        image: require('../assets/images/templates/semicircle.jpg'),
    },
    {
        id: 'semicircleWithText',
        name: 'Оформление в виде полукруга с надписями',
        description: 'Украшения в виде полукруга дополняются персонализированной надписью, идеально для праздничных тортов.',
        image: require('../assets/images/templates/semicircleWithText.jpg'),
    },
    {
        id: 'center',
        name: 'Оформление по центру',
        description: 'Угощения концентрируются в центре торта, создавая яркий акцент и богатый выбор.',
        image: require('../assets/images/templates/center.jpg'),
    },
];