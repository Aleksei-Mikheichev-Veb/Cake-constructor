export const LAYERS_RANGES = [
    { layers: 1, min: 10, max: 19, height: 'Высота ~ 20 cм'},
    { layers: 2, min: 20, max: 34, height: 'Высота ~ 40 cм'},
    { layers: 3, min: 35, max: 64, height: 'Высота ~ 60 cм'},
    { layers: 4, min: 65, max: 84, height: 'Высота ~ 80 cм'},
];

export const getMinPortionsForLayers = (layers: number): number => {
    return LAYERS_RANGES.find(r => r.layers === layers)?.min ?? 10;
};

export const getLayersForPortions = (portions: number): number => {
    for (const range of LAYERS_RANGES) {
        if (portions >= range.min && portions <= range.max) return range.layers;
    }
    return portions >= 65 ? 4 : 1;
};
