// ============================================================
// src/pages/Prices/Prices.tsx
// ============================================================
// Управление ценовыми конфигами:
//   - Цена за кг (для тортов)
//   - Фиксированные цены (для бенто)
//   - Цены по количеству (для капкейков/трайфлов)
//   - Стоимость фотопечати
//   - Стоимость шоколадных букв/цифр
// ============================================================

import React, { useState } from 'react';
import { Table, Button, Modal, Form, InputNumber, message, Card } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import {
  useGetPriceConfigsQuery,
  useUpdatePriceConfigMutation,
  PriceConfig,
} from '../../api/adminApi';

const Prices: React.FC = () => {
  const { data: configs = [], isLoading } = useGetPriceConfigsQuery();
  const [updatePriceConfig] = useUpdatePriceConfigMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<PriceConfig | null>(null);
  const [form] = Form.useForm();

  const openEdit = (record: PriceConfig) => {
    setEditing(record);
    form.setFieldsValue({
      pricePerKg: record.pricePerKg,
      photoPrintPrice: record.photoPrintPrice,
      chocolateLetterPrice: record.chocolateLetterPrice,
      chocolateNumberPrice: record.chocolateNumberPrice,
      // fixedPrices и fixedPricesByQuantity — это JSON-объекты, показываем ключи-значения
      ...flattenPrices(record.fixedPrices, 'fixed_'),
      ...flattenPrices(record.fixedPricesByQuantity, 'qty_'),
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (values: any) => {
    if (!editing) return;

    // Собираем fixedPrices и fixedPricesByQuantity обратно из flat-формы
    const fixedPrices = unflattenPrices(values, 'fixed_');
    const fixedPricesByQuantity = unflattenPrices(values, 'qty_');

    const data: Partial<PriceConfig> = {
      pricePerKg: values.pricePerKg ?? null,
      photoPrintPrice: values.photoPrintPrice,
      chocolateLetterPrice: values.chocolateLetterPrice,
      chocolateNumberPrice: values.chocolateNumberPrice,
      fixedPrices: Object.keys(fixedPrices).length ? fixedPrices : null,
      fixedPricesByQuantity: Object.keys(fixedPricesByQuantity).length ? fixedPricesByQuantity : null,
    };

    try {
      await updatePriceConfig({ id: editing.id, data }).unwrap();
      message.success('Цены обновлены');
      setIsModalOpen(false);
    } catch (e: any) {
      message.error(e?.data?.error || 'Ошибка сохранения');
    }
  };

  const columns = [
    {
      title: 'Категория',
      render: (_: any, r: PriceConfig) =>
        r.subcategory?.name || r.category?.name || r.subcategoryId || r.categoryId,
    },
    {
      title: 'Цена за кг',
      dataIndex: 'pricePerKg',
      render: (v: number | null) => (v ? `${v} ₽/кг` : '—'),
    },
    {
      title: 'Фикс. цены (по весу)',
      dataIndex: 'fixedPrices',
      render: (p: Record<string, number> | null) =>
        p ? Object.entries(p).map(([k, v]) => `${k} кг: ${v} ₽`).join(' · ') : '—',
    },
    {
      title: 'Цены по количеству',
      dataIndex: 'fixedPricesByQuantity',
      render: (p: Record<string, number> | null) =>
        p ? Object.entries(p).map(([k, v]) => `${k} шт: ${v} ₽`).join(' · ') : '—',
    },
    {
      title: 'Фотопечать',
      dataIndex: 'photoPrintPrice',
      render: (v: number) => `${v} ₽`,
    },
    {
      title: 'Буква / Цифра',
      render: (_: any, r: PriceConfig) => `${r.chocolateLetterPrice} / ${r.chocolateNumberPrice} ₽`,
    },
    {
      title: 'Действия',
      width: 100,
      render: (_: any, record: PriceConfig) => (
        <Button icon={<EditOutlined />} onClick={() => openEdit(record)} />
      ),
    },
  ];

  const currentFixedPrices = editing?.fixedPrices;
  const currentQtyPrices = editing?.fixedPricesByQuantity;

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ margin: 0 }}>Ценовые конфиги</h1>
        <p style={{ color: '#888' }}>
          Цены применяются автоматически при расчёте заказа в конструкторе
        </p>
      </div>

      <Table
        columns={columns}
        dataSource={configs}
        rowKey="id"
        loading={isLoading}
        pagination={false}
      />

      <Modal
        title={`Редактировать цены — ${editing?.subcategory?.name || editing?.category?.name || ''}`}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        width={700}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Card size="small" title="Базовая цена" style={{ marginBottom: 16 }}>
            {editing?.pricePerKg !== null && (
              <Form.Item label="Цена за кг (₽)" name="pricePerKg">
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            )}

            {currentFixedPrices && (
              <div>
                <div style={{ fontWeight: 500, marginBottom: 8 }}>
                  Фиксированные цены по весу (кг → ₽):
                </div>
                {Object.keys(currentFixedPrices).map((key) => (
                  <Form.Item key={key} label={`${key} кг`} name={`fixed_${key}`}>
                    <InputNumber min={0} style={{ width: '100%' }} />
                  </Form.Item>
                ))}
              </div>
            )}

            {currentQtyPrices && (
              <div>
                <div style={{ fontWeight: 500, marginBottom: 8 }}>
                  Цены по количеству штук:
                </div>
                {Object.keys(currentQtyPrices).map((key) => (
                  <Form.Item key={key} label={`${key} шт`} name={`qty_${key}`}>
                    <InputNumber min={0} style={{ width: '100%' }} />
                  </Form.Item>
                ))}
              </div>
            )}
          </Card>

          <Card size="small" title="Дополнительные услуги">
            <Form.Item label="Фотопечать (₽)" name="photoPrintPrice">
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item label="Шоколадная буква (₽)" name="chocolateLetterPrice">
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item label="Шоколадная цифра (₽)" name="chocolateNumberPrice">
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Card>
        </Form>
      </Modal>
    </div>
  );
};

// ─── Helpers для преобразования JSON-объектов в плоские поля формы ───

function flattenPrices(
  prices: Record<string, number> | null,
  prefix: string
): Record<string, number> {
  if (!prices) return {};
  const result: Record<string, number> = {};
  Object.entries(prices).forEach(([k, v]) => {
    result[`${prefix}${k}`] = v;
  });
  return result;
}

function unflattenPrices(values: any, prefix: string): Record<string, number> {
  const result: Record<string, number> = {};
  Object.keys(values).forEach((k) => {
    if (k.startsWith(prefix) && values[k] != null) {
      const origKey = k.slice(prefix.length);
      result[origKey] = Number(values[k]);
    }
  });
  return result;
}

export default Prices;
