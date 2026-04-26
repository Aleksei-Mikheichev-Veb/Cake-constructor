export interface OrderDecoration {
    id: string;
    name: string;
    price: number;
    count: number;
}

export interface OrderTiers {
    layers: number;
    portions: number;
    weight: number;
    layerFillings: Array<{ id: string; name: string } | null>;
}

export interface OrderChocolateText {
    letters?: string;
    numbers?: string;
}

export interface OrderStylingGroup {
    topColor: string | null;       // название цвета шапки
    decorations: string[];         // названия декораций
}

export interface OrderData {
    dessertType: 'cake' | 'trifles' | 'cupcake';
    subcategory?: string | null;

    // Порции / вес (торты)
    servingLabel?: string | null;    // "10-12 порций, 2-2.5 кг"

    // Количество (капкейки/трайфлы)
    quantityLabel?: string | null;   // "6 шт, 200 гр"

    // Начинка (торты)
    filling?: string | null;

    // Оформление (торты)
    template?: string | null;
    colorsTemplate?: string | null;
    colors?: string[];
    smudges?: string | null;
    shape?: string | null;
    gloss?: string | null;

    // Декорации (торты)
    mainDecorations: OrderDecoration[];
    additionalDecorations: OrderDecoration[];

    // Надписи
    creamText?: string;
    creamTextColor?: string | null;
    chocolateText?: OrderChocolateText | null;

    // Фотопечать
    hasPhotoPrint: boolean;

    // Ярусный торт
    tiers?: OrderTiers | null;

    // Капкейки — вкус и начинка
    cupcakeBase?: string | null;
    cupcakeFilling?: string | null;

    // Оформление десертов (капкейки/трайфлы)
    stylingGroups?: OrderStylingGroup[] | null;

    // Цена
    totalPrice: number;


    // Комментарий и референсы
    orderComment?: string;
    hasReferenceImages: boolean;
    referenceImageCount: number;

    // Клиент
    clientName: string;
    clientPhone: string;
    clientContact?: string;
    desiredDate?: string;
}

export interface OrderResponse {
    success: boolean;
    orderId: string;
    vkRedirect: string | null;
    message?: string;
}