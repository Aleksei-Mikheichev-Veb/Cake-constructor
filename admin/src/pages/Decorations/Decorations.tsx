// ============================================================
// src/pages/Decorations/Decorations.tsx
// ============================================================

import React, { useState } from 'react';
import {
  Table, Button, Space, Tag, Modal, Form, Input, InputNumber, Select,
  Switch, Upload, message, Popconfirm, Image,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import {
  useGetDecorationsQuery,
  useCreateDecorationMutation,
  useUpdateDecorationMutation,
  useDeleteDecorationMutation,
  useUploadImageMutation,
  Decoration,
} from '../../api/adminApi';

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:4000/api').replace('/api', '');

const groupLabels: Record<string, string> = {
  MAIN: 'Основные',
  ADDITIONAL: 'Дополнительные',
  ALL: 'Все',
  SMALL: 'Маленькие',
};

const groupColors: Record<string, string> = {
  MAIN: 'blue',
  ADDITIONAL: 'green',
  ALL: 'orange',
  SMALL: 'purple',
};

const Decorations: React.FC = () => {
  const { data: decorations = [], isLoading } = useGetDecorationsQuery();
  const [createDecoration] = useCreateDecorationMutation();
  const [updateDecoration] = useUpdateDecorationMutation();
  const [deleteDecoration] = useDeleteDecorationMutation();
  const [uploadImage] = useUploadImageMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Decoration | null>(null);
  const [form] = Form.useForm();
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

  const openCreate = () => {
    setEditing(null);
    setUploadedImageUrl(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const openEdit = (record: Decoration) => {
    setEditing(record);
    setUploadedImageUrl(record.image);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    try {
      const result = await uploadImage(formData).unwrap();
      setUploadedImageUrl(result.url);
      form.setFieldValue('image', result.url);
      message.success('Картинка загружена');
    } catch (e: any) {
      message.error('Ошибка загрузки: ' + (e?.data?.error || 'неизвестно'));
    }
    return false; // блокируем автозагрузку Ant Design
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editing) {
        await updateDecoration({ id: editing.id, data: values }).unwrap();
        message.success('Декорация обновлена');
      } else {
        await createDecoration(values).unwrap();
        message.success('Декорация создана');
      }
      setIsModalOpen(false);
    } catch (e: any) {
      message.error(e?.data?.error || 'Ошибка сохранения');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDecoration({ id }).unwrap();
      message.success('Декорация деактивирована');
    } catch {
      message.error('Ошибка удаления');
    }
  };

  const columns = [
    {
      title: 'Фото',
      dataIndex: 'image',
      width: 80,
      render: (image: string) => (
        <Image
          src={image?.startsWith('/') ? `${API_BASE}${image}` : image}
          width={50}
          height={50}
          style={{ objectFit: 'cover', borderRadius: 4 }}
          fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
        />
      ),
    },
    {
      title: 'Название',
      dataIndex: 'name',
      sorter: (a: Decoration, b: Decoration) => a.name.localeCompare(b.name),
    },
    {
      title: 'Группа',
      dataIndex: 'group',
      width: 150,
      render: (group: string) => <Tag color={groupColors[group]}>{groupLabels[group]}</Tag>,
      filters: Object.entries(groupLabels).map(([k, v]) => ({ text: v, value: k })),
      onFilter: (value: any, record: Decoration) => record.group === value,
    },
    {
      title: 'Цена',
      dataIndex: 'price',
      width: 100,
      render: (price: number) => `${price} ₽`,
      sorter: (a: Decoration, b: Decoration) => a.price - b.price,
    },
    {
      title: 'Поштучно',
      dataIndex: 'byThePiece',
      width: 100,
      render: (v: boolean, r: Decoration) =>
        v ? `Да (от ${r.minCount || 1} шт.)` : 'Нет',
    },
    {
      title: 'Активна',
      dataIndex: 'isActive',
      width: 100,
      render: (v: boolean) => (v ? <Tag color="green">Да</Tag> : <Tag color="red">Нет</Tag>),
    },
    {
      title: 'Действия',
      width: 140,
      render: (_: any, record: Decoration) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => openEdit(record)} />
          <Popconfirm
            title="Удалить декорацию?"
            description="Она будет деактивирована"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <h1 style={{ margin: 0 }}>Декорации</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          Добавить декорацию
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={decorations}
        rowKey="id"
        loading={isLoading}
        pagination={{ pageSize: 20, showSizeChanger: true }}
      />

      <Modal
        title={editing ? 'Редактировать декорацию' : 'Новая декорация'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="Название" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Описание" name="description" rules={[{ required: true }]}>
            <Input.TextArea rows={2} />
          </Form.Item>

          <Form.Item label="Картинка" name="image" rules={[{ required: true }]}>
            <div>
              {uploadedImageUrl && (
                <Image
                  src={uploadedImageUrl.startsWith('/') ? `${API_BASE}${uploadedImageUrl}` : uploadedImageUrl}
                  width={80}
                  height={80}
                  style={{ objectFit: 'cover', borderRadius: 4, marginBottom: 8 }}
                />
              )}
              <Upload beforeUpload={handleUpload} showUploadList={false} accept="image/*">
                <Button icon={<UploadOutlined />}>Загрузить картинку</Button>
              </Upload>
            </div>
          </Form.Item>

          <Form.Item label="Цена (₽)" name="price" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item label="Группа" name="group" rules={[{ required: true }]}>
            <Select
              options={Object.entries(groupLabels).map(([k, v]) => ({ value: k, label: v }))}
            />
          </Form.Item>

          <Form.Item label="Поштучно" name="byThePiece" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item label="Минимум штук (если поштучно)" name="minCount">
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item label="Активна" name="isActive" valuePropName="checked" initialValue={true}>
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Decorations;
