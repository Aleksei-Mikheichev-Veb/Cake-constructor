// ============================================================
// src/pages/Fillings/Fillings.tsx
// ============================================================

import React, { useState } from 'react';
import {
  Table, Button, Space, Tag, Modal, Form, Input, Switch,
  Upload, message, Popconfirm, Image,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import {
  useGetFillingsQuery,
  useCreateFillingMutation,
  useUpdateFillingMutation,
  useDeleteFillingMutation,
  useUploadImageMutation,
  Filling,
} from '../../api/adminApi';

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:4000/api').replace('/api', '');

const Fillings: React.FC = () => {
  const { data: fillings = [], isLoading } = useGetFillingsQuery();
  const [createFilling] = useCreateFillingMutation();
  const [updateFilling] = useUpdateFillingMutation();
  const [deleteFilling] = useDeleteFillingMutation();
  const [uploadImage] = useUploadImageMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Filling | null>(null);
  const [form] = Form.useForm();
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

  const openCreate = () => {
    setEditing(null);
    setUploadedImageUrl(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const openEdit = (record: Filling) => {
    setEditing(record);
    setUploadedImageUrl(record.image);

    // description может быть массивом или строкой — нормализуем в строку для textarea
    const descStr = Array.isArray(record.description)
      ? record.description.join(', ')
      : record.description || '';

    form.setFieldsValue({
      ...record,
      description: descStr,
    });
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
      message.error('Ошибка загрузки');
    }
    return false;
  };

  const handleSubmit = async (values: any) => {
    // description: строка "A, B, C" → массив ['A','B','C']
    const description = values.description
      ? values.description.split(',').map((s: string) => s.trim()).filter(Boolean)
      : [];

    const payload = { ...values, description };

    try {
      if (editing) {
        await updateFilling({ id: editing.id, data: payload }).unwrap();
        message.success('Начинка обновлена');
      } else {
        await createFilling(payload).unwrap();
        message.success('Начинка создана');
      }
      setIsModalOpen(false);
    } catch (e: any) {
      message.error(e?.data?.error || 'Ошибка сохранения');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteFilling(id).unwrap();
      message.success('Начинка деактивирована');
    } catch {
      message.error('Ошибка удаления');
    }
  };

  const columns = [
    {
      title: 'Фото',
      dataIndex: 'image',
      width: 80,
      render: (image: string | null) =>
        image ? (
          <Image
            src={image.startsWith('/') ? `${API_BASE}${image}` : image}
            width={50}
            height={50}
            style={{ objectFit: 'cover', borderRadius: 4 }}
          />
        ) : '—',
    },
    {
      title: 'Название',
      dataIndex: 'name',
      sorter: (a: Filling, b: Filling) => a.name.localeCompare(b.name),
    },
    {
      title: 'Состав',
      dataIndex: 'description',
      render: (d: string[] | string | null) => {
        if (Array.isArray(d)) return d.join(', ');
        return d || '—';
      },
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
      render: (_: any, record: Filling) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => openEdit(record)} />
          <Popconfirm
            title="Удалить начинку?"
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
        <h1 style={{ margin: 0 }}>Начинки</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          Добавить начинку
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={fillings}
        rowKey="id"
        loading={isLoading}
        pagination={{ pageSize: 20 }}
      />

      <Modal
        title={editing ? 'Редактировать начинку' : 'Новая начинка'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="Название" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item
            label="Состав (слои через запятую)"
            name="description"
            help="Например: Шоколадный бисквит, Ганаш, Малиновое кремю"
          >
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item label="Картинка" name="image">
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

          <Form.Item label="Активна" name="isActive" valuePropName="checked" initialValue={true}>
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Fillings;
