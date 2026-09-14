// ============================================================
// src/pages/Cupcakes/Cupcakes.tsx — Основы и начинки капкейков
// ============================================================
// Обе сущности (CupcakeBase, CupcakeFilling) имеют одинаковую форму
// (name, description, image, isActive), поэтому обёрнуты в один
// переиспользуемый компонент-таблицу и показаны вкладками.

import React, { useState } from 'react';
import {
  Table, Button, Space, Tag, Modal, Form, Input, Switch,
  Upload, message, Popconfirm, Image, Tabs,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import {
  useGetCupcakeBasesQuery,
  useCreateCupcakeBaseMutation,
  useUpdateCupcakeBaseMutation,
  useDeleteCupcakeBaseMutation,
  useGetCupcakeFillingsQuery,
  useCreateCupcakeFillingMutation,
  useUpdateCupcakeFillingMutation,
  useDeleteCupcakeFillingMutation,
  useUploadImageMutation,
  SimpleCatalogItem,
} from '../../api/adminApi';

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:4000/api').replace('/api', '');

export type CatalogHooks = {
  useGet: typeof useGetCupcakeBasesQuery;
  useCreate: typeof useCreateCupcakeBaseMutation;
  useUpdate: typeof useUpdateCupcakeBaseMutation;
  useDelete: typeof useDeleteCupcakeBaseMutation;
};

export const SimpleCatalogTable: React.FC<{
  hooks: CatalogHooks; addLabel: string; entityLabel: string; folder: string;
}> = ({
  hooks, addLabel, entityLabel, folder,
}) => {
  const { data: items = [], isLoading } = hooks.useGet();
  const [createItem] = hooks.useCreate();
  const [updateItem] = hooks.useUpdate();
  const [deleteItem] = hooks.useDelete();
  const [uploadImage] = useUploadImageMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<SimpleCatalogItem | null>(null);
  const [form] = Form.useForm();
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

  const openCreate = () => {
    setEditing(null);
    setUploadedImageUrl(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const openEdit = (record: SimpleCatalogItem) => {
    setEditing(record);
    setUploadedImageUrl(record.image);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleUpload = async (file: File) => {
    try {
      const result = await uploadImage({ file, folder }).unwrap();
      setUploadedImageUrl(result.url);
      form.setFieldValue('image', result.url);
      message.success('Картинка загружена');
    } catch {
      message.error('Ошибка загрузки');
    }
    return false;
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editing) {
        await updateItem({ id: editing.id, data: values }).unwrap();
        message.success(`${entityLabel} обновлена`);
      } else {
        await createItem(values).unwrap();
        message.success(`${entityLabel} создана`);
      }
      setIsModalOpen(false);
    } catch (e: any) {
      message.error(e?.data?.error || 'Ошибка сохранения');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteItem(id).unwrap();
      message.success(`${entityLabel} деактивирована`);
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
      sorter: (a: SimpleCatalogItem, b: SimpleCatalogItem) => a.name.localeCompare(b.name),
    },
    { title: 'Описание', dataIndex: 'description', render: (d: string | null) => d || '—' },
    {
      title: 'Активна',
      dataIndex: 'isActive',
      width: 100,
      render: (v: boolean) => (v ? <Tag color="green">Да</Tag> : <Tag color="red">Нет</Tag>),
    },
    {
      title: 'Действия',
      width: 140,
      render: (_: any, record: SimpleCatalogItem) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => openEdit(record)} />
          <Popconfirm title={`Удалить «${record.name}»?`} onConfirm={() => handleDelete(record.id)}>
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          {addLabel}
        </Button>
      </div>

      <Table columns={columns} dataSource={items} rowKey="id" loading={isLoading} pagination={{ pageSize: 20 }} />

      <Modal
        title={editing ? `Редактировать: ${entityLabel.toLowerCase()}` : `Новая позиция: ${entityLabel.toLowerCase()}`}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="Название" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Описание" name="description">
            <Input.TextArea rows={2} />
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

const Cupcakes: React.FC = () => (
  <div>
    <h1 style={{ marginTop: 0 }}>Капкейки</h1>
    <Tabs
      items={[
        {
          key: 'bases',
          label: 'Основы',
          children: (
            <SimpleCatalogTable
              hooks={{
                useGet: useGetCupcakeBasesQuery,
                useCreate: useCreateCupcakeBaseMutation,
                useUpdate: useUpdateCupcakeBaseMutation,
                useDelete: useDeleteCupcakeBaseMutation,
              }}
              addLabel="Добавить основу"
              entityLabel="Основа"
              folder="cupcake-bases"
            />
          ),
        },
        {
          key: 'fillings',
          label: 'Начинки',
          children: (
            <SimpleCatalogTable
              hooks={{
                useGet: useGetCupcakeFillingsQuery,
                useCreate: useCreateCupcakeFillingMutation,
                useUpdate: useUpdateCupcakeFillingMutation,
                useDelete: useDeleteCupcakeFillingMutation,
              }}
              addLabel="Добавить начинку"
              entityLabel="Начинка"
              folder="cupcake-fillings"
            />
          ),
        },
      ]}
    />
  </div>
);

export default Cupcakes;
