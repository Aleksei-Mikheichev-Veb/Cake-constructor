// ============================================================
// server/prisma/seed.ts — Заполнение базы реальными данными
// ============================================================
// Запуск: cd D:\React\cakes\cakes\server
//         npx prisma db seed
// ============================================================

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Начинаем заполнение базы данных...\n');

  // ─── 1. АДМИН ───
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.adminUser.upsert({
    where: { email: 'admin@cakes.ru' },
    update: {},
    create: { email: 'admin@cakes.ru', password: hashedPassword, name: 'Главный кондитер', role: 'OWNER' },
  });
  console.log('✅ Админ создан');

  // ─── 2. КАТЕГОРИИ ───
  const categoriesData = [
    { id: 'cakes', name: 'Торты', description: 'Различные виды тортов', image: 'cakes.webp', hasSubcategories: true, sortOrder: 0 },
    { id: 'cupcakes', name: 'Капкейки', description: 'Маленькие кексы с кремом', image: 'cupcakes.webp', imageName: 'Капкейк', hasSubcategories: false, sortOrder: 1 },
    { id: 'trifles', name: 'Трайфлы', description: 'Слоеные десерты в стаканах', image: 'trifles.webp', imageName: 'Трайфл', hasSubcategories: false, sortOrder: 2 },
    { id: 'marshmallow', name: 'Зефир', description: 'Воздушные зефирные лакомства', image: 'marshmallow.webp', imageName: 'Зефир', hasSubcategories: false, sortOrder: 3 },
  ];
  for (const cat of categoriesData) {
    await prisma.category.upsert({ where: { id: cat.id }, update: cat, create: cat });
  }
  console.log('✅ Категории созданы');

  // ─── 3. ПОДКАТЕГОРИИ ───
  const subcategoriesData = [
    { id: '3d', name: '3D торты', description: '3D торты — настоящие произведения искусства...', image: '3d.webp', imageName: '3D торт', categoryId: 'cakes', sortOrder: 0 },
    { id: 'biscuit', name: 'Бисквитные торты', description: 'Бисквитные торты — классика кондитерского искусства...', image: 'biscuit.webp', imageName: 'Бисквитный торт', categoryId: 'cakes', sortOrder: 1 },
    { id: 'bento', name: 'Бенто торты', description: 'Бенто торты — компактные десерты...', image: 'bento.webp', imageName: 'Бенто торт', categoryId: 'cakes', sortOrder: 2 },
    { id: 'mousse', name: 'Муссовые торты', description: 'Муссовые торты — воздушные десерты...', image: 'mousse.webp', imageName: 'Муссовый торт', categoryId: 'cakes', sortOrder: 3 },
    { id: 'kids', name: 'Детские торты', description: 'Детские торты созданы, чтобы порадовать малышей...', image: 'children.webp', imageName: 'Детский торт', categoryId: 'cakes', sortOrder: 4 },
    { id: 'tiered', name: 'Ярусные торты', description: 'Ярусные торты — идеальный выбор для свадеб...', image: 'tiered.webp', imageName: 'Ярусный торт', categoryId: 'cakes', sortOrder: 5 },
  ];
  for (const sub of subcategoriesData) {
    await prisma.subcategory.upsert({ where: { id: sub.id }, update: sub, create: sub });
  }
  console.log('✅ Подкатегории созданы');

  // ─── 4. НАЧИНКИ ───
  const biscuitFillings = [
    { id: 'honeyOrange', name: 'Медовик с апельсином', description: 'Медовые коржи, Крем-брюле, Апельсиновый соус', image: '/images/fillings/biscuit/honeyOrange.webp' },
    { id: 'pearChocolate', name: 'Груша фундук шоколад', description: 'Шоколадные коржи, Груша в карамели, Нутелла с фундуком', image: '/images/fillings/biscuit/pearChocolate.webp' },
    { id: 'strawberryCoconut', name: 'Клубника-кокос', description: 'Вафельные коржи, Кокосовый крем, Клубничное кремю', image: '/images/fillings/biscuit/strawberryCoconut.webp' },
    { id: 'chocolateBanana', name: 'Шоколад-банан', description: 'Шоколадный бисквит, Ганаш, Банан в карамели', image: '/images/fillings/biscuit/chocolateBanana.webp' },
    { id: 'blackForest', name: 'Черный лес', description: 'Шоколадный бисквит, Крем-чиз, Вишня', image: '/images/fillings/biscuit/blackForest.webp' },
    { id: 'raspberryTruffle', name: 'Малиновый трюфель', description: 'Шоколадный бисквит, Ганаш, Малиновый соус', image: '/images/fillings/biscuit/raspberryTruffle.webp' },
    { id: 'pistachioRaspberry', name: 'Фисташка-малина', description: 'Бисквит с фисташкой, Малиновый мусс, Малиновое кремю', image: '/images/fillings/biscuit/pistachioRaspberry.webp' },
    { id: 'carrotSeaBuckthorn', name: 'Морковный с облепихой', description: 'Морковный бисквит, Крем-чиз, Кремю из облепихи', image: '/images/fillings/biscuit/carrotSeaBuckthorn.webp' },
    { id: 'snickers', name: 'Сникерс', description: 'Шоколадный бисквит, Карамель, Арахис, Шоколадный крем', image: '/images/fillings/biscuit/snickers.webp' },
    { id: 'Raffaello', name: 'Рафаэлло', description: 'Кокосовые коржи, Вафельная крошка, Миндаль, Крем на белом шоколаде', image: '/images/fillings/biscuit/Raffaello.webp' },
    { id: 'prunesWalnuts', name: 'Чернослив-грецкий орех', description: 'Шоколадный бисквит, Чернослив, Орех, Меренга, Крем-чиз', image: '/images/fillings/biscuit/prunesWalnuts.webp' },
    { id: 'strawberryVelvet', name: 'Клубничный бархат', description: 'Бисквит, Сливочный крем, Клубничный мусс', image: '/images/fillings/biscuit/strawberryVelvet.webp' },
    { id: 'strawberryDelight', name: 'Клубничное наслаждение', description: 'Ванильный бисквит, Клубничный соус, Творожный крем', image: '/images/fillings/biscuit/strawberryDelight.webp' },
    { id: 'peachYogurt', name: 'Персик-йогурт', description: 'Ванильный бисквит, Йогуртовый мусс, Персики', image: '/images/fillings/biscuit/peachYogurt.webp' },
  ];
  const bentoFillings = [
    { id: 'bento_vanillaStrawberry', name: 'Ваниль-клубника', description: 'Медовые коржи, Крем-брюле, Апельсиновый соус', image: '/images/fillings/bento/strawberry.webp' },
    { id: 'bento_strawberryIcecream', name: 'Клубничное мороженое', description: 'Шоколадные коржи, Груша в карамели, Нутелла с фундуком', image: '/images/fillings/bento/raspberry.webp' },
    { id: 'bento_milka', name: 'Милка', description: 'Вафельные коржи, Кокосовый крем, Клубничное кремю', image: '/images/fillings/bento/milka.webp' },
    { id: 'bento_redVelvet', name: 'Красный бархат', description: 'Шоколадный бисквит, Ганаш, Банан в карамели', image: '/images/fillings/bento/vanil.webp' },
  ];
  const mousseFillings = [
    { id: 'mousse_vanilla', name: 'Ваниль', description: 'Медовые коржи, Крем-брюле, Апельсиновый соус', image: '/images/fillings/bento/strawberry.webp' },
    { id: 'mousse_icecream', name: 'Мороженое', description: 'Шоколадные коржи, Груша в карамели, Нутелла', image: '/images/fillings/bento/raspberry.webp' },
    { id: 'mousse_milka', name: 'Милка', description: 'Вафельные коржи, Кокосовый крем, Клубничное кремю', image: '/images/fillings/bento/milka.webp' },
    { id: 'mousse_velvet', name: 'Бархат', description: 'Шоколадный бисквит, Ганаш, Банан в карамели', image: '/images/fillings/bento/vanil.webp' },
  ];
  const trifleFillings = [
    { id: 'trifle_vanilla', name: 'Ванильный', description: '', image: '/images/fillings/bento/strawberry.webp' },
    { id: 'trifle_chocolate', name: 'Шоколадный', description: '', image: '/images/fillings/bento/raspberry.webp' },
    { id: 'trifle_redVelvet', name: 'Красный бархат', description: '', image: '/images/fillings/bento/milka.webp' },
  ];

  const allFillings = [...biscuitFillings, ...bentoFillings, ...mousseFillings, ...trifleFillings];
  for (const f of allFillings) {
    await prisma.filling.upsert({ where: { id: f.id }, update: f, create: f });
  }

  // Привязки
  for (const sub of ['biscuit', 'kids', '3d', 'tiered']) {
    for (const [i, f] of biscuitFillings.entries()) {
      await prisma.subcategoryFilling.upsert({
        where: { subcategoryId_fillingId: { subcategoryId: sub, fillingId: f.id } },
        update: { sortOrder: i }, create: { subcategoryId: sub, fillingId: f.id, sortOrder: i },
      });
    }
  }
  for (const [i, f] of bentoFillings.entries()) {
    await prisma.subcategoryFilling.upsert({
      where: { subcategoryId_fillingId: { subcategoryId: 'bento', fillingId: f.id } },
      update: { sortOrder: i }, create: { subcategoryId: 'bento', fillingId: f.id, sortOrder: i },
    });
  }
  for (const [i, f] of mousseFillings.entries()) {
    await prisma.subcategoryFilling.upsert({
      where: { subcategoryId_fillingId: { subcategoryId: 'mousse', fillingId: f.id } },
      update: { sortOrder: i }, create: { subcategoryId: 'mousse', fillingId: f.id, sortOrder: i },
    });
  }
  console.log('✅ Начинки созданы и привязаны');

  // ─── 5. ДЕКОРАЦИИ ───
  const D = [
    { id: 'main_strawberry', name: 'Клубника', description: 'Свежие ягоды клубники', image: '/images/decorations/strawberry.webp', price: 400, group: 'MAIN' as const, sortOrder: 0 },
    { id: 'main_blueberry', name: 'Голубика', description: 'Свежая голубика', image: '/images/decorations/blueberry.webp', price: 300, group: 'MAIN' as const, sortOrder: 1 },
    { id: 'main_raspberry', name: 'Малина', description: 'Свежая малина', image: '/images/decorations/raspberry.webp', price: 400, group: 'MAIN' as const, sortOrder: 2 },
    { id: 'main_berry_mix', name: 'Ассорти ягод', description: 'Микс из ягод', image: '/images/decorations/berry_assortment.webp', price: 450, group: 'MAIN' as const, sortOrder: 3 },
    { id: 'main_macarons', name: 'Макаронс', description: 'Макаронс разных вкусов', image: '/images/decorations/macarons.webp', price: 100, group: 'MAIN' as const, byThePiece: true, minCount: 6, sortOrder: 4 },
    { id: 'main_oreo', name: 'Печенье Oreo', description: 'Печенье Oreo', image: '/images/decorations/oreo.webp', price: 40, group: 'MAIN' as const, byThePiece: true, minCount: 6, sortOrder: 5 },
    { id: 'main_raffaello', name: 'Raffaello', description: 'Конфеты Raffaello', image: '/images/decorations/raffaello.webp', price: 60, group: 'MAIN' as const, byThePiece: true, minCount: 5, sortOrder: 6 },
    { id: 'main_marshmallow', name: 'Зефир', description: 'Зефир ручной работы', image: '/images/decorations/marshmallow.webp', price: 80, group: 'MAIN' as const, byThePiece: true, minCount: 6, sortOrder: 7 },
    { id: 'add_gingerbread', name: 'Пряник', description: 'Пряник с рисунком', image: '/images/decorations/gingerbread.webp', price: 150, group: 'ADDITIONAL' as const, byThePiece: true, sortOrder: 0 },
    { id: 'add_choco_numbers', name: 'Шоколадные цифры', description: 'Объёмные цифры из шоколада', image: '/images/decorations/chocolate_numbers.webp', price: 100, group: 'ADDITIONAL' as const, sortOrder: 1 },
    { id: 'add_choco_letters', name: 'Шоколадные буквы', description: 'Фразы из шоколадных букв', image: '/images/decorations/chocolate_letters.webp', price: 30, group: 'ADDITIONAL' as const, sortOrder: 2 },
    { id: 'add_lollipops', name: 'Леденцы', description: 'Леденцы на палочке', image: '/images/decorations/lollipops.webp', price: 80, group: 'ADDITIONAL' as const, byThePiece: true, minCount: 3, sortOrder: 3 },
    { id: 'add_kinder', name: 'Kinder Bueno', description: 'Батончики Kinder Bueno', image: '/images/decorations/kinder_bueno.webp', price: 70, group: 'ADDITIONAL' as const, byThePiece: true, sortOrder: 4 },
    { id: 'add_chocopie', name: 'Choco Pie', description: 'Choco Pie', image: '/images/decorations/choco_pie.webp', price: 60, group: 'ADDITIONAL' as const, byThePiece: true, sortOrder: 5 },
    { id: 'add_meringue', name: 'Меренга на палочке', description: 'Хрустящая меренга', image: '/images/decorations/meringue_stick.webp', price: 100, group: 'ADDITIONAL' as const, byThePiece: true, sortOrder: 6 },
    { id: 'add_cakepops', name: 'Кейк-попс', description: 'Мини-тортики на палочке', image: '/images/decorations/cake_pops.webp', price: 150, group: 'ADDITIONAL' as const, byThePiece: true, minCount: 5, sortOrder: 7 },
    { id: 'add_chocofig', name: 'Фигурки из шоколада', description: 'Шоколадные фигурки', image: '/images/decorations/chocolate_figures.webp', price: 300, group: 'ADDITIONAL' as const, byThePiece: true, sortOrder: 8 },
    { id: 'all_strawberry', name: 'Клубника', description: 'Свежие ягоды клубники', image: '/images/decorations/strawberry.webp', price: 50, group: 'ALL' as const, sortOrder: 0 },
    { id: 'all_blueberry', name: 'Голубика', description: 'Свежая голубика', image: '/images/decorations/blueberry.webp', price: 30, group: 'ALL' as const, sortOrder: 1 },
    { id: 'all_raspberry', name: 'Малина', description: 'Свежая малина', image: '/images/decorations/raspberry.webp', price: 40, group: 'ALL' as const, sortOrder: 2 },
    { id: 'all_berry_mix', name: 'Ассорти ягод', description: 'Микс из ягод', image: '/images/decorations/berry_assortment.webp', price: 250, group: 'ALL' as const, sortOrder: 3 },
    { id: 'all_macarons', name: 'Макаронс', description: 'Макаронс', image: '/images/decorations/macarons.webp', price: 100, group: 'ALL' as const, byThePiece: true, minCount: 6, sortOrder: 4 },
    { id: 'all_oreo', name: 'Печенье Oreo', description: 'Печенье Oreo', image: '/images/decorations/oreo.webp', price: 40, group: 'ALL' as const, byThePiece: true, minCount: 6, sortOrder: 5 },
    { id: 'all_raffaello', name: 'Raffaello', description: 'Конфеты Raffaello', image: '/images/decorations/raffaello.webp', price: 60, group: 'ALL' as const, byThePiece: true, minCount: 5, sortOrder: 6 },
    { id: 'all_marshmallow', name: 'Зефир', description: 'Зефир ручной работы', image: '/images/decorations/marshmallow.webp', price: 80, group: 'ALL' as const, byThePiece: true, minCount: 6, sortOrder: 7 },
    { id: 'all_gingerbread', name: 'Пряник', description: 'Пряник с рисунком', image: '/images/decorations/gingerbread.webp', price: 150, group: 'ALL' as const, byThePiece: true, sortOrder: 8 },
    { id: 'all_choco_num', name: 'Шоколадные цифры', description: 'Цифры из шоколада', image: '/images/decorations/chocolate_numbers.webp', price: 100, group: 'ALL' as const, sortOrder: 9 },
    { id: 'all_choco_let', name: 'Шоколадные буквы', description: 'Буквы из шоколада', image: '/images/decorations/chocolate_letters.webp', price: 30, group: 'ALL' as const, sortOrder: 10 },
    { id: 'all_lollipops', name: 'Леденцы', description: 'Леденцы на палочке', image: '/images/decorations/lollipops.webp', price: 80, group: 'ALL' as const, byThePiece: true, minCount: 3, sortOrder: 11 },
    { id: 'all_kinder', name: 'Kinder Bueno', description: 'Батончики', image: '/images/decorations/kinder_bueno.webp', price: 70, group: 'ALL' as const, byThePiece: true, sortOrder: 12 },
    { id: 'all_chocopie', name: 'Choco Pie', description: 'Choco Pie', image: '/images/decorations/choco_pie.webp', price: 60, group: 'ALL' as const, byThePiece: true, sortOrder: 13 },
    { id: 'all_meringue', name: 'Меренга на палочке', description: 'Меренга', image: '/images/decorations/meringue_stick.webp', price: 100, group: 'ALL' as const, byThePiece: true, sortOrder: 14 },
    { id: 'all_cakepops', name: 'Кейк-попс', description: 'Мини-тортики', image: '/images/decorations/cake_pops.webp', price: 150, group: 'ALL' as const, byThePiece: true, minCount: 5, sortOrder: 15 },
    { id: 'all_chocofig', name: 'Фигурки из шоколада', description: 'Фигурки', image: '/images/decorations/chocolate_figures.webp', price: 300, group: 'ALL' as const, byThePiece: true, sortOrder: 16 },
    { id: 'small_blueberry', name: 'Голубика', description: '', image: '/images/decorations/blueberry.webp', price: 0, group: 'SMALL' as const, sortOrder: 0 },
    { id: 'small_raspberry', name: 'Малина', description: '', image: '/images/decorations/raspberry.webp', price: 0, group: 'SMALL' as const, sortOrder: 1 },
    { id: 'small_strawberry', name: 'Клубника (половинка)', description: '', image: '/images/decorations/strawberry.webp', price: 0, group: 'SMALL' as const, sortOrder: 2 },
    { id: 'small_oreo', name: 'Печенье Oreo', description: '', image: '/images/decorations/oreo.webp', price: 0, group: 'SMALL' as const, sortOrder: 3 },
    { id: 'small_pistash', name: 'Фисташка', description: '', image: '/images/decorations/pistash.webp', price: 0, group: 'SMALL' as const, sortOrder: 4 },
    { id: 'small_mint', name: 'Листик мяты', description: '', image: '/images/decorations/mint.png', price: 0, group: 'SMALL' as const, sortOrder: 5 },
  ];
  for (const d of D) { await prisma.decoration.upsert({ where: { id: d.id }, update: d, create: d }); }
  console.log('✅ Декорации созданы');

  // ─── 6. ПОРЦИИ ───
  await prisma.servingOption.deleteMany({});
  const biscServings = [
    { portions: 8, weightMin: 1.6, weightMax: 1.8, height: 15, diameter: 14, label: '8-9 порций, 1.6-1.8 кг' },
    { portions: 10, weightMin: 2.0, weightMax: 2.5, height: 15, diameter: 16, label: '10-12 порций, 2-2.5 кг' },
    { portions: 12, weightMin: 2.5, weightMax: 3.0, height: 15, diameter: 18, label: '12-14 порций, 2.5-3 кг' },
    { portions: 15, weightMin: 3.0, weightMax: 3.5, height: 15, diameter: 20, label: '15-17 порций, 3-3.5 кг' },
    { portions: 18, weightMin: 3.5, weightMax: 4.0, height: 15, diameter: 24, label: '18-20 порций, 3.5-4 кг' },
  ];
  for (const sub of ['biscuit', 'kids', 'tiered']) {
    for (const [i, s] of biscServings.entries()) { await prisma.servingOption.create({ data: { ...s, subcategoryId: sub, sortOrder: i } }); }
  }
  for (const [i, s] of biscServings.entries()) { await prisma.servingOption.create({ data: { ...s, subcategoryId: '3d', sortOrder: i } }); }
  for (const [i, s] of [
    { weightMin: 0.5, weightMax: 0.5, height: 10, diameter: 12, label: '0.5 кг' },
    { weightMin: 1.0, weightMax: 1.0, height: 10, diameter: 16, label: '1 кг' },
  ].entries()) { await prisma.servingOption.create({ data: { ...s, subcategoryId: 'bento', sortOrder: i } }); }
  for (const [i, s] of [
    { weightMin: 1.0, weightMax: 1.0, height: 10, diameter: 16, label: '≈ 1 кг' },
    { weightMin: 1.5, weightMax: 1.5, height: 12, diameter: 18, label: '≈ 1.5 кг' },
    { weightMin: 2.0, weightMax: 2.0, height: 12, diameter: 20, label: '≈ 2 кг' },
  ].entries()) { await prisma.servingOption.create({ data: { ...s, subcategoryId: 'mousse', sortOrder: i } }); }
  for (const [i, q] of [6, 9, 12].entries()) { await prisma.servingOption.create({ data: { quantity: q, label: `${q} шт, 200 гр`, categoryId: 'cupcakes', sortOrder: i } }); }
  for (const [i, q] of [6, 9, 12].entries()) { await prisma.servingOption.create({ data: { quantity: q, label: `${q} шт, 200 гр`, categoryId: 'trifles', sortOrder: i } }); }
  console.log('✅ Порции созданы');

  // ─── 7. ШАБЛОНЫ ───
  const T = [
    { id: 'empty', name: 'Без оформления украшениями', description: 'Полная свобода творчества', image: '/images/templates/empty.webp', sortOrder: 0 },
    { id: 'circle', name: 'Оформление по кругу', description: 'Украшения по окружности', image: '/images/templates/circle.jpg', sortOrder: 1 },
    { id: 'semicircle', name: 'Полукруг', description: 'Украшения в форме полукруга', image: '/images/templates/semicircle.jpg', sortOrder: 2 },
    { id: 'semicircleWithText', name: 'Полукруг с надписями', description: 'Полукруг с персонализированной надписью', image: '/images/templates/semicircleWithText.jpg', sortOrder: 3 },
    { id: 'center', name: 'Оформление по центру', description: 'Угощения в центре торта', image: '/images/templates/center.jpg', sortOrder: 4 },
  ];
  for (const t of T) { await prisma.template.upsert({ where: { id: t.id }, update: t, create: t }); }
  console.log('✅ Шаблоны созданы');

  // ─── 8. ФОРМЫ ───
  await prisma.subcategoryShape.deleteMany({});
  await prisma.shape.deleteMany({});
  const shapes = [
    { id: 'heart_bento', name: 'В форме сердца', description: 'Бенто-тортик в форме сердца', image: '/images/shape/heartBento.jpg', subs: ['bento'] },
    { id: 'circle_bento', name: 'Круглый', description: 'Компактный круглый бенто-торт', image: '/images/shape/bento.webp', subs: ['bento'] },
    { id: 'heart_mousse', name: 'В форме сердца', description: 'Муссовый торт-сердце', image: '/images/shape/heartMousse.jpg', subs: ['mousse'] },
    { id: 'ellipse_mousse', name: 'В форме эллипса', description: 'Муссовый торт овальной формы', image: '/images/shape/mousse.webp', subs: ['mousse'] },
    { id: 'straight_mousse', name: 'С прямыми стенками', description: 'Муссовый торт с ровными стенками', image: '/images/shape/straightMousse.webp', subs: ['mousse'] },
    { id: 'circle_tiered', name: 'Круглая форма', description: 'Классический ярусный торт', image: '/images/shape/tiered.webp', subs: ['tiered'] },
    { id: 'square_tiered', name: 'Квадратная форма', description: 'Ярусный торт квадратной формы', image: '/images/shape/squareTiered.png', subs: ['tiered'] },
  ];
  for (const [i, s] of shapes.entries()) {
    const { subs, ...data } = s;
    const shape = await prisma.shape.create({ data: { ...data, sortOrder: i } });
    for (const [j, subId] of subs.entries()) { await prisma.subcategoryShape.create({ data: { subcategoryId: subId, shapeId: shape.id, sortOrder: j } }); }
  }
  console.log('✅ Формы созданы');

  // ─── 9. ЦВЕТА ───
  const colors = [
    { id: 'cake_color1', name: 'Один цвет', description: 'Торт покрыт одним цветом', image: '/images/color/biscuit/oneColor.webp', target: 'CAKE' as const, sortOrder: 0 },
    { id: 'cake_color2', name: '2-3 цвета', description: 'Комбинация 2-3 цветов', image: '/images/color/biscuit/multiColor.jpg', target: 'CAKE' as const, sortOrder: 1 },
    { id: 'cake_space', name: 'Стиль космоса', description: 'Галактический стиль', image: '/images/color/biscuit/space2.jpg', target: 'CAKE' as const, sortOrder: 2 },
    { id: 'cake_color4', name: 'С мазками', description: 'Основной цвет с мазками второго', image: '/images/color/biscuit/brushstrokeEffect.jpg', target: 'CAKE' as const, sortOrder: 3 },
    { id: 'cake_color5', name: 'С бортиком', description: 'Основной цвет с бортиком', image: '/images/color/biscuit/cakeRim.jpg', target: 'CAKE' as const, sortOrder: 4 },
    { id: 'mousse_color1', name: 'Один цвет', description: 'Торт покрыт одним цветом', image: '/images/color/mousse/mousse.webp', target: 'MOUSSE' as const, sortOrder: 0 },
    { id: 'mousse_color2', name: '2-3 цвета', description: 'Комбинация 2-3 цветов', image: '/images/color/mousse/twoColors.jpg', target: 'MOUSSE' as const, sortOrder: 1 },
    { id: 'mousse_space', name: 'Стиль космоса', description: 'Галактический стиль', image: '/images/color/mousse/space.webp', target: 'MOUSSE' as const, sortOrder: 2 },
    { id: 'mousse_color4', name: 'Авторские решения', description: 'Нестандартные оттенки и контрасты', image: '/images/color/mousse/notStandart.webp', target: 'MOUSSE' as const, sortOrder: 3 },
  ];
  for (const c of colors) { await prisma.colorOption.upsert({ where: { id: c.id }, update: c, create: c }); }
  console.log('✅ Цвета созданы');

  // ─── 10. ПОДТЁКИ ───
  const smudges = [
    { id: 'empty', name: 'Без подтёков', description: 'Без подтёков и заливки', image: '/images/smudges/empty.webp', sortOrder: 0 },
    { id: 'half_drips', name: 'Подтёки на половину', description: 'Подтёки на половине круга', image: '/images/smudges/halfCircleSmudges.jpeg', sortOrder: 1 },
    { id: 'drips_only', name: 'Только подтёки', description: 'Подтёки по всему кругу', image: '/images/smudges/circleSmudges.jpg', sortOrder: 2 },
    { id: 'halfFull', name: 'Полузалитая', description: 'Залита наполовину с подтёками', image: '/images/smudges/halfFullSmudges.png', sortOrder: 3 },
    { id: 'full', name: 'Полная', description: 'Полностью залита с подтёками', image: '/images/smudges/fullSmudges.jpg', sortOrder: 4 },
  ];
  for (const s of smudges) { await prisma.smudge.upsert({ where: { id: s.id }, update: s, create: s }); }
  console.log('✅ Подтёки созданы');

  // ─── 11. ГЛЯНЕЦ ───
  const gloss = [
    { id: 'gloss', name: 'Глянцевое покрытие', description: 'Зеркальное покрытие с глянцем', image: '/images/gloss/gross.webp', sortOrder: 0 },
    { id: 'velvet', name: 'Велюровое покрытие', description: 'Матовое бархатное покрытие', image: '/images/gloss/velvet.webp', sortOrder: 1 },
    { id: 'glossVelvet', name: 'Глянцевое и велюровое', description: 'Два покрытия: глянец + бархат', image: '/images/gloss/glossVelur.jpg', sortOrder: 2 },
  ];
  for (const g of gloss) { await prisma.glossOption.upsert({ where: { id: g.id }, update: g, create: g }); }
  console.log('✅ Глянец создан');

  // ─── 12. ЦЕНЫ (из dessertPriceConfig.ts) ───
  const prices = [
    { subcategoryId: 'biscuit', pricePerKg: 2000 },
    { subcategoryId: 'kids', pricePerKg: 2000 },
    { subcategoryId: 'tiered', pricePerKg: 2400 },
    { subcategoryId: '3d', pricePerKg: 2400 },
    { subcategoryId: 'bento', fixedPrices: { '0.5': 1400, '1': 2200 } },
    { subcategoryId: 'mousse', pricePerKg: 2200 },
    { categoryId: 'cupcakes', fixedPricesByQuantity: { '6': 1400, '9': 2100, '12': 2800 } },
    { categoryId: 'trifles', fixedPricesByQuantity: { '6': 1900, '9': 2800, '12': 3700 } },
  ];
  for (const pc of prices) {
    const where = pc.subcategoryId ? { subcategoryId: pc.subcategoryId } : { categoryId: pc.categoryId! };
    await prisma.priceConfig.upsert({
      where, update: pc,
      create: { ...pc, photoPrintPrice: 650, chocolateLetterPrice: 150, chocolateNumberPrice: 200 },
    });
  }
  console.log('✅ Цены созданы');

  // ─── 13. КОНТРОЛЫ КОНСТРУКТОРА ───
  await prisma.constructorControl.deleteMany({});
  const ctrlMap: Record<string, Array<{ controlType: string; title?: string; settings?: any }>> = {
    biscuit: [
      { controlType: 'weight', title: 'Выберите количество порций' },
      { controlType: 'filling', title: 'Выберите начинку' },
      { controlType: 'template', title: 'Способ оформления украшениями', settings: { isTemplate: true } },
      { controlType: 'colors', title: 'Цвет торта', settings: { isColor: true } },
      { controlType: 'smudges', title: 'Выберите оформление подтёками' },
      { controlType: 'decorations', settings: { decorationsMode: 'split' } },
      { controlType: 'photoPrint' }, { controlType: 'creamText' }, { controlType: 'reference' },
    ],
    bento: [
      { controlType: 'weight', title: 'Выберите количество порций' },
      { controlType: 'filling', title: 'Выберите начинку' },
      { controlType: 'shape', title: 'Выберите форму' },
      { controlType: 'colors', title: 'Цвет торта', settings: { isColor: true } },
      { controlType: 'smudges', title: 'Выберите оформление подтёками' },
      { controlType: 'decorations', settings: { decorationsMode: 'all' } },
      { controlType: 'photoPrint' }, { controlType: 'creamText' }, { controlType: 'reference' },
    ],
    kids: [
      { controlType: 'weight', title: 'Выберите количество порций' },
      { controlType: 'filling', title: 'Выберите начинку' },
      { controlType: 'template', title: 'Способ оформления украшениями', settings: { isTemplate: true } },
      { controlType: 'colors', title: 'Цвет торта', settings: { isColor: true } },
      { controlType: 'smudges', title: 'Выберите оформление подтёками' },
      { controlType: 'decorations', settings: { decorationsMode: 'split' } },
      { controlType: 'photoPrint' }, { controlType: 'creamText' }, { controlType: 'reference' },
    ],
    mousse: [
      { controlType: 'weight', title: 'Выберите количество порций' },
      { controlType: 'filling', title: 'Выберите начинку' },
      { controlType: 'shape', title: 'Выберите форму' },
      { controlType: 'gloss', title: 'Тип поверхности торта' },
      { controlType: 'colors', title: 'Цвет торта', settings: { isColor: true } },
      { controlType: 'smudges', title: 'Выберите оформление подтёками' },
      { controlType: 'decorations', settings: { decorationsMode: 'all' } },
      { controlType: 'photoPrint' }, { controlType: 'creamText' }, { controlType: 'reference' },
    ],
    tiered: [
      { controlType: 'tiered', title: 'Выберите начинку' },
      { controlType: 'colors', title: 'Цвет торта', settings: { isColor: true } },
      { controlType: 'template', title: 'Способ оформления украшениями', settings: { isTemplate: true } },
      { controlType: 'shape', title: 'Выберите форму' },
      { controlType: 'smudges', title: 'Выберите оформление подтёками' },
      { controlType: 'decorations', settings: { decorationsMode: 'split' } },
      { controlType: 'photoPrint' }, { controlType: 'creamText' }, { controlType: 'reference' },
    ],
    '3d': [
      { controlType: 'weight', title: 'Выберите количество порций' },
      { controlType: 'filling', title: 'Выберите начинку' },
      { controlType: 'reference' },
    ],
  };
  for (const [subId, ctrls] of Object.entries(ctrlMap)) {
    for (const [i, c] of ctrls.entries()) {
      await prisma.constructorControl.create({
        data: { subcategoryId: subId, controlType: c.controlType, title: c.title || null, sortOrder: i, settings: c.settings || null },
      });
    }
  }
  const dessertCtrls: Record<string, Array<{ controlType: string; title?: string }>> = {
    cupcakes: [{ controlType: 'portions', title: 'Выберите количество' }, { controlType: 'styling' }, { controlType: 'reference' }],
    trifles: [{ controlType: 'portions', title: 'Выберите количество' }, { controlType: 'styling' }, { controlType: 'reference' }],
  };
  for (const [catId, ctrls] of Object.entries(dessertCtrls)) {
    for (const [i, c] of ctrls.entries()) {
      await prisma.constructorControl.create({
        data: { categoryId: catId, controlType: c.controlType, title: c.title || null, sortOrder: i },
      });
    }
  }
  console.log('✅ Контролы созданы');

  // ─── 14. НАСТРОЙКИ ───
  const settings = [
    { key: 'maxMainDecorations', value: '3', description: 'Максимум основных декораций' },
    { key: 'maxReferenceImages', value: '3', description: 'Максимум фото-референсов' },
    { key: 'maxStylingDecorations', value: '5', description: 'Максимум декораций в стилизации' },
    { key: 'tieredMinPortions', value: '10', description: 'Минимум порций для ярусного' },
    { key: 'tieredMaxPortions', value: '84', description: 'Максимум порций для ярусного' },
    { key: 'tieredMaxLayers', value: '4', description: 'Максимум ярусов' },
  ];
  for (const s of settings) { await prisma.siteSetting.upsert({ where: { key: s.key }, update: s, create: s }); }
  console.log('✅ Настройки созданы');

  console.log('\n🎂 База данных полностью заполнена!');
}

main()
  .catch((e) => { console.error('❌ Ошибка:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });