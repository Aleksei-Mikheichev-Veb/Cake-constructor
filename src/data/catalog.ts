type Subcategory = {
  id: string;
  name: string;
  imageName: string;
  tooltip: string;
  description: string;
  image: string;
};

type CategoryWithSubs = {
  id: string;
  name: string;
  hasSubcategories: true;
  subcategories: Subcategory[];
};

type CategorySingle = {
  id: string;
  name: string;
  hasSubcategories: false;
  product: Subcategory;
};

export type Category = CategoryWithSubs | CategorySingle;
export const catalog : Record<string, Category> = {
  cakes: {
    id: 'cakes',
    name: 'Торты',
    hasSubcategories: true,

    subcategories: [
      {
        id: '3d',
        name: '3D торты',
        imageName: '3D торт',
        tooltip: 'Объемные торты любых форм',
        description:
          '3D торты — это настоящие произведения искусства...',
        image: '3d.webp',
      },
      {
        id: 'biscuit',
        name: 'Бисквитные торты',
        imageName: 'Бисквитный торт',
        tooltip: 'Классические бисквитные торты',
        description:
          'Бисквитные торты — это классика кондитерского искусства...',
        image: 'biscuit.webp',
      },
      {
        id: 'bento',
        name: 'Бенто торты',
        imageName: 'Бенто торт',
        tooltip: 'Маленькие тортики',
        description:
          'Бенто торты — компактные десерты...',
        image: 'bento.webp',
      },
      {
        id: 'mousse',
        name: 'Муссовые торты',
        imageName: 'Муссовый торт',
        tooltip: 'Легкие торты с муссом',
        description:
          'Муссовые торты — это воздушные десерты...',
        image: 'mousse.webp',
      },
      {
        id: 'kids',
        name: 'Детские торты',
        imageName: 'Детский торт',
        tooltip: 'Торты для самых маленьких',
        description:
          'Детские торты созданы, чтобы порадовать малышей...',
        image: 'children.webp',
      },
      {
        id: 'tiered',
        name: 'Ярусные торты',
        imageName: 'Ярусный торт',
        tooltip: 'Многоярусные торты',
        description:
          'Ярусные торты — идеальный выбор для свадеб...',
        image: 'tiered.webp',
      },
    ],
  },

  cupcakes: {
    id: 'cupcakes',
    name: 'Капкейки',
    hasSubcategories: false,

    product: {
      id: 'cupcakes',
      name: 'Капкейки',
      imageName: 'Капкейк',
      tooltip: 'Капкейки с разными вкусами',
      description:
        'Классические капкейки с кремом и декором...',
      image: 'cupcakes.webp',
    },
  },

  trifles: {
    id: 'trifles',
    name: 'Трайфлы',
    hasSubcategories: false,

    product: {
      id: 'trifles',
      name: 'Трайфлы',
      imageName: 'Трайфл',
      tooltip: 'Трайфлы в стаканчиках',
      description:
        'Нежные трайфлы в индивидуальной упаковке...',
      image: 'trifles.webp',
    },
  },

  marshmallow: {
    id: 'marshmallow',
    name: 'Зефир',
    hasSubcategories: false,

    product: {
      id: 'marshmallow',
      name: 'Зефир',
      imageName: 'Зефир',
      tooltip: 'Воздушные зефирные лакомства',
      description:
        'Воздушный зефир с разными вкусами...',
      image: 'marshmallow.webp',
    },
  },
};