// Использование:
//   const { controls, servings, isLoading, error } = useConstructorData('biscuit', 'cake');
//   const { controls, servings, isLoading, error } = useConstructorData('cupcakes', 'cupcake');
// ============================================================

import {
    useGetControlsQuery,
    useGetServingsQuery,
    useGetFillingsQuery,
    useGetTemplatesQuery,
    useGetSmudgesQuery,
    useGetShapesQuery,
    useGetColorsQuery,
    useGetGlossQuery,
    useGetDecorationsQuery,
    useGetPriceConfigQuery,
    useGetSettingsQuery,
    ConstructorControlFromServer,
    ServingOptionFromServer,
    FillingFromServer,
    TemplateFromServer,
    SmudgeFromServer,
    ShapeFromServer,
    ColorOptionFromServer,
    GlossOptionFromServer,
    DecorationFromServer,
    PriceConfigFromServer,
    SiteSettings,
} from '../api/constructorApi';

type DessertType = 'cake' | 'cupcake' | 'trifles' | null;

interface UseConstructorDataResult {
    // Контролы (шаги конструктора)
    controls: ConstructorControlFromServer[];
    // Порции/вес
    servings: ServingOptionFromServer[];
    // Начинки (загружаются если есть control 'filling')
    fillings: FillingFromServer[];
    // Шаблоны (загружаются если есть control 'template')
    templates: TemplateFromServer[];
    // Подтёки
    smudges: SmudgeFromServer[];
    // Формы
    shapes: ShapeFromServer[];
    // Цвета
    colors: ColorOptionFromServer[];
    // Глянец
    glossOptions: GlossOptionFromServer[];
    // Декорации по группам
    decorationsMain: DecorationFromServer[];
    decorationsAdditional: DecorationFromServer[];
    decorationsAll: DecorationFromServer[];
    decorationsSmall: DecorationFromServer[];
    // Ценовой конфиг
    priceConfig: PriceConfigFromServer | undefined;
    // Настройки сайта
    settings: SiteSettings | undefined;
    // Состояние загрузки
    isLoading: boolean;
    isError: boolean;
    error: any;
}

/**
 * @param id — subcategoryId для тортов ('biscuit', 'bento', ...) или categoryId для десертов ('cupcakes', 'trifles')
 * @param dessertType — 'cake' | 'cupcake' | 'trifles'
 */
export function useConstructorData(
    id: string | null,
    dessertType: DessertType
): UseConstructorDataResult {
    const isCake = dessertType === 'cake';

    // ─── Контролы ───
    const controlsQuery = useGetControlsQuery(
        isCake ? { subcategoryId: id! } : { categoryId: id! },
        { skip: !id }
    );

    // ─── Порции ───
    const servingsQuery = useGetServingsQuery(
        isCake ? { subcategoryId: id! } : { categoryId: id! },
        { skip: !id }
    );

    // Определяем какие контролы есть, чтобы подгрузить нужные данные
    const controlTypes = (controlsQuery.data || []).map(c => c.controlType);
    const hasFilling = controlTypes.includes('filling');
    const hasTemplate = controlTypes.includes('template');
    const hasSmudges = controlTypes.includes('smudges');
    const hasShape = controlTypes.includes('shape');
    const hasColors = controlTypes.includes('colors');
    const hasGloss = controlTypes.includes('gloss');
    const hasDecorations = controlTypes.includes('decorations');
    const hasStyling = controlTypes.includes('styling');

    // Определяем target для цветов
    const colorTarget = id === 'mousse' ? 'MOUSSE' : 'CAKE';

    // ─── Условные запросы (skip если контрол не нужен) ───

    const fillingsQuery = useGetFillingsQuery(id!, {
        skip: !id || !hasFilling,
    });

    const templatesQuery = useGetTemplatesQuery(undefined, {
        skip: !hasTemplate,
    });

    const smudgesQuery = useGetSmudgesQuery(undefined, {
        skip: !hasSmudges,
    });

    const shapesQuery = useGetShapesQuery(id!, {
        skip: !id || !hasShape,
    });

    const colorsQuery = useGetColorsQuery(colorTarget, {
        skip: !hasColors,
    });

    const glossQuery = useGetGlossQuery(undefined, {
        skip: !hasGloss,
    });

    // Декорации — загружаем нужные группы
    const decorationsMainQuery = useGetDecorationsQuery('main', {
        skip: !hasDecorations,
    });
    const decorationsAdditionalQuery = useGetDecorationsQuery('additional', {
        skip: !hasDecorations,
    });
    const decorationsAllQuery = useGetDecorationsQuery('all', {
        skip: !hasDecorations,
    });
    const decorationsSmallQuery = useGetDecorationsQuery('small', {
        skip: !hasStyling,
    });

    // ─── Ценовой конфиг ───
    // Для тортов key = subcategoryId, для десертов = categoryId
    const priceKey = isCake ? id : id;
    const priceConfigQuery = useGetPriceConfigQuery(priceKey!, {
        skip: !priceKey,
    });

    // ─── Настройки ───
    const settingsQuery = useGetSettingsQuery();

    // ─── Агрегация состояния загрузки ───
    const isLoading =
        controlsQuery.isLoading ||
        servingsQuery.isLoading ||
        (hasFilling && fillingsQuery.isLoading) ||
        (hasTemplate && templatesQuery.isLoading) ||
        (hasSmudges && smudgesQuery.isLoading) ||
        (hasShape && shapesQuery.isLoading) ||
        (hasColors && colorsQuery.isLoading) ||
        (hasGloss && glossQuery.isLoading) ||
        priceConfigQuery.isLoading;

    const isError =
        controlsQuery.isError ||
        servingsQuery.isError ||
        priceConfigQuery.isError;

    const error =
        controlsQuery.error ||
        servingsQuery.error ||
        priceConfigQuery.error;

    return {
        controls: controlsQuery.data || [],
        servings: servingsQuery.data || [],
        fillings: fillingsQuery.data || [],
        templates: templatesQuery.data || [],
        smudges: smudgesQuery.data || [],
        shapes: shapesQuery.data || [],
        colors: colorsQuery.data || [],
        glossOptions: glossQuery.data || [],
        decorationsMain: decorationsMainQuery.data || [],
        decorationsAdditional: decorationsAdditionalQuery.data || [],
        decorationsAll: decorationsAllQuery.data || [],
        decorationsSmall: decorationsSmallQuery.data || [],
        priceConfig: priceConfigQuery.data,
        settings: settingsQuery.data,
        isLoading,
        isError,
        error,
    };
}