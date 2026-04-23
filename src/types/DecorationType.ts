export type DecorationType = {
    id: string;
    name: string;
    description: string;
    image: string;
    price?: number;
    minCount?: number;
    byThePiece?: boolean;
};
export type SelectedDecoration = DecorationType & { count: number };