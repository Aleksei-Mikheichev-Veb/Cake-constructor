// ============================================================
// src/pages/Settings/Settings.tsx — Настройки сайта / брендинг
// ============================================================
// SiteSetting — плоская таблица key→value, поэтому сохраняем не одним
// PUT, а по одному запросу на изменённый ключ (их немного, это ок).

import React, { useEffect, useState } from 'react';
import { Form, Input, Button, message, Image, Upload, Collapse, InputNumber, Spin } from 'antd';
import { UploadOutlined, SaveOutlined } from '@ant-design/icons';
import {
  useGetSiteSettingsQuery,
  useUpdateSiteSettingMutation,
  useUploadImageMutation,
} from '../../api/adminApi';

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:4000/api').replace('/api', '');

const NUMERIC_KEYS = [
  'maxMainDecorations', 'maxReferenceImages', 'maxStylingDecorations',
  'tieredMinPortions', 'tieredMaxPortions', 'tieredMaxLayers',
];

const Settings: React.FC = () => {
  const { data: settings, isLoading } = useGetSiteSettingsQuery();
  const [updateSetting, { isLoading: isSaving }] = useUpdateSiteSettingMutation();
  const [uploadImage] = useUploadImageMutation();
  const [form] = Form.useForm();
  const [chefPhoto, setChefPhoto] = useState<string>('');

  useEffect(() => {
    if (!settings) return;
    form.setFieldsValue(settings);
    setChefPhoto(settings.chefPhoto || '');
  }, [settings, form]);

  const handlePhotoUpload = async (file: File) => {
    try {
      const result = await uploadImage({ file, folder: 'branding' }).unwrap();
      setChefPhoto(result.url);
      form.setFieldValue('chefPhoto', result.url);
      message.success('Фото загружено');
    } catch {
      message.error('Ошибка загрузки фото');
    }
    return false;
  };

  const handleSubmit = async (values: Record<string, string | number>) => {
    try {
      const entries = Object.entries(values).filter(([, v]) => v !== undefined && v !== null);
      await Promise.all(
        entries.map(([key, value]) => updateSetting({ key, value: String(value) }).unwrap())
      );
      message.success('Настройки сохранены');
    } catch (e: any) {
      message.error(e?.data?.error || 'Ошибка сохранения настроек');
    }
  };

  if (isLoading || !settings) {
    return <Spin />;
  }

  return (
    <div style={{ maxWidth: 640 }}>
      <h1 style={{ marginTop: 0 }}>Настройки сайта</h1>

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <h3>Бренд</h3>
        <Form.Item label="Название кондитерской" name="siteName" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Заголовок на главной" name="heroTitle">
          <Input />
        </Form.Item>
        <Form.Item label="Подзаголовок" name="heroSubtitle">
          <Input />
        </Form.Item>
        <Form.Item label="Маленькая подпись под заголовком" name="heroTagline">
          <Input />
        </Form.Item>
        <Form.Item label="Подпись в футере" name="footerTagline">
          <Input />
        </Form.Item>

        <h3>О кондитере</h3>
        <Form.Item label="Имя кондитера" name="chefName" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Фото кондитера" name="chefPhoto">
          <div>
            {chefPhoto && (
              <Image
                src={chefPhoto.startsWith('/') ? `${API_BASE}${chefPhoto}` : chefPhoto}
                width={100}
                height={100}
                style={{ objectFit: 'cover', borderRadius: 8, marginBottom: 8, display: 'block' }}
              />
            )}
            <Upload beforeUpload={handlePhotoUpload} showUploadList={false} accept="image/*">
              <Button icon={<UploadOutlined />}>Загрузить фото</Button>
            </Upload>
          </div>
        </Form.Item>

        <Form.Item label="Абзац 1" name="chefDescription1">
          <Input.TextArea rows={2} />
        </Form.Item>
        <Form.Item label="Абзац 2" name="chefDescription2">
          <Input.TextArea rows={2} />
        </Form.Item>
        <Form.Item label="Абзац 3" name="chefDescription3">
          <Input.TextArea rows={2} />
        </Form.Item>

        <h3>Контакты</h3>
        <Form.Item label="Телефон" name="phone">
          <Input />
        </Form.Item>
        <Form.Item label="Email" name="email">
          <Input />
        </Form.Item>
        <Form.Item label="Адрес / город" name="address">
          <Input />
        </Form.Item>
        <Form.Item label="Ссылка ВКонтакте" name="vkUrl">
          <Input placeholder="https://vk.com/..." />
        </Form.Item>
        <Form.Item label="Ссылка Telegram" name="tgUrl">
          <Input placeholder="https://t.me/..." />
        </Form.Item>
        <Form.Item label="Ссылка Одноклассники" name="okUrl">
          <Input placeholder="https://ok.ru/..." />
        </Form.Item>

        <Collapse
          style={{ marginBottom: 24 }}
          items={[
            {
              key: 'limits',
              label: 'Технические лимиты конструктора',
              children: (
                <>
                  <Form.Item label="Макс. основных декораций" name="maxMainDecorations">
                    <InputNumber style={{ width: '100%' }} min={0} />
                  </Form.Item>
                  <Form.Item label="Макс. референс-фото от клиента" name="maxReferenceImages">
                    <InputNumber style={{ width: '100%' }} min={0} />
                  </Form.Item>
                  <Form.Item label="Макс. декораций в оформлении" name="maxStylingDecorations">
                    <InputNumber style={{ width: '100%' }} min={0} />
                  </Form.Item>
                  <Form.Item label="Ярусный торт: мин. порций" name="tieredMinPortions">
                    <InputNumber style={{ width: '100%' }} min={0} />
                  </Form.Item>
                  <Form.Item label="Ярусный торт: макс. порций" name="tieredMaxPortions">
                    <InputNumber style={{ width: '100%' }} min={0} />
                  </Form.Item>
                  <Form.Item label="Ярусный торт: макс. ярусов" name="tieredMaxLayers">
                    <InputNumber style={{ width: '100%' }} min={0} />
                  </Form.Item>
                </>
              ),
            },
          ]}
        />

        <Button type="primary" icon={<SaveOutlined />} htmlType="submit" loading={isSaving}>
          Сохранить
        </Button>
      </Form>
    </div>
  );
};

export default Settings;
