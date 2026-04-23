import { OrderData } from '../types/order';

const dessertTypeNames: Record<string, string> = {
  cake: 'Торт',
  trifles: 'Трайфлы',
  cupcake: 'Капкейки',
};

const subcategoryNames: Record<string, string> = {
  biscuit: 'Бисквитный',
  bento: 'Бенто',
  mousse: 'Муссовый',
  kids: 'Детский',
  tiered: 'Ярусный',
  '3d': '3D-торт',
};

export function formatOrder(order: OrderData, format: 'vk' | 'tg' = 'vk'): string {
  const b = (text: string) => (format === 'tg' ? `<b>${text}</b>` : text);
  const nl = '\n';
  const divider = '———————————';

  const parts: string[] = [];

  // === Заголовок ===
  parts.push(`🎂 ${b('НОВЫЙ ЗАКАЗ')}`);
  parts.push(divider);

  // === Тип десерта ===
  const dessertName = dessertTypeNames[order.dessertType] || order.dessertType;
  let typeLine = `📋 ${b('Тип:')} ${dessertName}`;
  if (order.subcategory) {
    typeLine += ` → ${subcategoryNames[order.subcategory] || order.subcategory}`;
  }
  parts.push(typeLine);

  // === Порции / вес (обычные торты) ===
  if (order.servingLabel) {
    parts.push(`⚖️ ${b('Порции:')} ${order.servingLabel}`);
  }

  // === Количество (капкейки/трайфлы) ===
  if (order.quantityLabel) {
    parts.push(`🔢 ${b('Количество:')} ${order.quantityLabel}`);
  }

  // === Ярусный торт ===
  if (order.tiers) {
    parts.push('');
    parts.push(`🏰 ${b('Ярусный торт:')}`);
    parts.push(`   Ярусов: ${order.tiers.layers}`);
    parts.push(`   Порций: ${order.tiers.portions}`);
    parts.push(`   Вес: ~${order.tiers.weight} кг`);
    order.tiers.layerFillings.forEach((f, i) => {
      const fillingName = f ? f.name : 'Не выбрана';
      parts.push(`   Ярус ${i + 1}: ${fillingName}`);
    });
  }

  // === Начинка (обычные торты) ===
  if (order.filling) {
    parts.push(`🍰 ${b('Начинка:')} ${order.filling}`);
  }

  // === Капкейки: вкус кекса и начинка ===
  if (order.cupcakeBase) {
    parts.push(`🧁 ${b('Вкус кекса:')} ${order.cupcakeBase}`);
  }
  if (order.cupcakeFilling) {
    parts.push(`🫐 ${b('Начинка капкейка:')} ${order.cupcakeFilling}`);
  }

  // === Форма ===
  if (order.shape) {
    parts.push(`📐 ${b('Форма:')} ${order.shape}`);
  }

  // === Глянец/велюр ===
  if (order.gloss) {
    parts.push(`✨ ${b('Поверхность:')} ${order.gloss}`);
  }

  // === Шаблон оформления ===
  if (order.template) {
    parts.push(`🎨 ${b('Шаблон:')} ${order.template}`);
  }

  // === Цвет ===
  if (order.colorsTemplate) {
    parts.push(`🎨 ${b('Цветовая схема:')} ${order.colorsTemplate}`);
  }
  if (order.colors && order.colors.length > 0) {
    parts.push(`🎨 ${b('Цвета:')} ${order.colors.join(', ')}`);
  }

  // === Подтёки ===
  if (order.smudges) {
    parts.push(`💧 ${b('Подтёки:')} ${order.smudges}`);
  }

  // === Декорации (торты) ===
  const allDecorations = [...order.mainDecorations, ...order.additionalDecorations];
  if (allDecorations.length > 0) {
    parts.push('');
    parts.push(`🌸 ${b('Декорации:')}`);
    allDecorations.forEach((d) => {
      const countStr = d.count > 1 ? ` × ${d.count}` : '';
      parts.push(`  • ${d.name}${countStr} — ${d.price * d.count} ₽`);
    });
  }

  // === Оформление десертов (капкейки/трайфлы) ===
  if (order.stylingGroups && order.stylingGroups.length > 0) {
    parts.push('');
    parts.push(`🎀 ${b('Оформление десертов:')}`);
    order.stylingGroups.forEach((group, i) => {
      const groupLabel = order.stylingGroups!.length > 1 ? `Группа ${i + 1}` : 'Оформление';
      parts.push(`  ${b(groupLabel)}:`);
      if (group.topColor) {
        parts.push(`    Шапка: ${group.topColor}`);
      }
      if (group.decorations.length > 0) {
        parts.push(`    Декор: ${group.decorations.join(', ')}`);
      }
    });
  }

  // === Надписи ===
  if (order.creamText) {
    parts.push(`✍️ ${b('Надпись кремом:')} "${order.creamText}"`);
    if (order.creamTextColor) {
      parts.push(`   Цвет: ${order.creamTextColor}`);
    }
  }

  if (order.chocolateText) {
    if (order.chocolateText.letters) {
      parts.push(`🍫 ${b('Шоколадные буквы:')} ${order.chocolateText.letters}`);
    }
    if (order.chocolateText.numbers) {
      parts.push(`🍫 ${b('Шоколадные цифры:')} ${order.chocolateText.numbers}`);
    }
  }

  // === Фотопечать ===
  if (order.hasPhotoPrint) {
    parts.push(`🖼 ${b('Фотопечать:')} Да (+650 ₽)`);
  }

  // === Референсы ===
  if (order.hasReferenceImages) {
    parts.push(`📎 ${b('Референсы:')} ${order.referenceImageCount} фото (клиент отправит лично)`);
  }

  parts.push('');
  parts.push(divider);

  // === Цена ===
  parts.push(`💰 ${b('Итого:')} ${order.totalPrice.toLocaleString('ru-RU')} ₽`);

  parts.push(divider);

  // === Клиент ===
  parts.push(`👤 ${b('Клиент:')} ${order.clientName}`);
  parts.push(`📞 ${b('Телефон:')} ${order.clientPhone}`);
  if (order.clientContact) {
    parts.push(`💬 ${b('Связь:')} ${order.clientContact}`);
  }
  if (order.desiredDate) {
    parts.push(`📅 ${b('Желаемая дата:')} ${order.desiredDate}`);
  }

  // === Комментарий ===
  if (order.orderComment) {
    parts.push('');
    parts.push(`💬 ${b('Комментарий:')}`);
    parts.push(order.orderComment);
  }

  return parts.join(nl);
}