import React, { useState, useEffect } from 'react';
import DefaultLayout from '../components/DefaultLayout';
import { Table, Button, Modal, Form, Input, Select, message } from 'antd';
import axios from 'axios';
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const { confirm } = Modal;

const ItemPage = () => {
  const [itemsData, setItemsData] = useState([]);
  const [popupModal, setPopupModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form] = Form.useForm();

  // Fetch all items
  const getAllItems = async () => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/items/get-item`);
      setItemsData(data);
    } catch (error) {
      console.log(error);
      message.error('Failed to fetch items');
    }
  };

  // Fetch items on component mount
  useEffect(() => {
    getAllItems();
  }, []);

  // Handle form submit (adding/editing item)
  const handleSubmit = async (values) => {
    try {
      if (isEdit) {
        await axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/items/update-item/${editingItem._id}`, values);
        message.success('Item updated successfully!');
      } else {
        await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/items/add-item`, values);
        message.success('Item added successfully!');
      }
      getAllItems();
      setPopupModal(false);
      form.resetFields();
      setIsEdit(false);
      setEditingItem(null);
    } catch (error) {
      message.error('Something went wrong!');
      console.log(error);
    }
  };

  // Handle delete function
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/items/delete-item/${id}`);
      message.success('Item deleted successfully!');
      getAllItems();
    } catch (error) {
      message.error('Failed to delete the item');
      console.log(error);
    }
  };

  // Show delete confirmation modal
  const showDeleteConfirm = (id) => {
    confirm({
      title: 'Are you sure you want to delete this item?',
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        handleDelete(id);
      },
    });
  };

  // Handle edit function
  const handleEdit = (item) => {
    setIsEdit(true);
    setEditingItem(item);
    form.setFieldsValue(item);
    setPopupModal(true);
  };

  // Table columns definition with sorting
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name), // Enable sorting by name
    },
    {
      title: 'Image',
      dataIndex: 'image',
      render: (image, record) => (
        <img src={image} alt={record.name} height="60" width="60" />
      ),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      sorter: (a, b) => a.price - b.price,
      render: (text) => `$${parseFloat(text).toFixed(2)}`,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      sorter: (a, b) => a.category.localeCompare(b.category), // Enable sorting by category
    },
    {
      title: 'Action',
      dataIndex: '_id',
      render: (id, record) => (
        <div>
          <EditOutlined
            style={{ cursor: 'pointer', marginRight: 10 }}
            onClick={() => handleEdit(record)}
          />
          <DeleteOutlined
            style={{ cursor: 'pointer' }}
            onClick={() => showDeleteConfirm(id)}
          />
        </div>
      ),
    },
  ];

  return (
    <DefaultLayout>
      <h1>Items</h1>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
        <Button type="primary" onClick={() => setPopupModal(true)}>
          Add Item
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={itemsData}
        rowKey="_id"
        bordered
        pagination={true} // Optional: remove pagination if you want to view all rows
      />

      <Modal
        title={isEdit ? 'Edit Item' : 'Add new item'}
        visible={popupModal}
        onCancel={() => {
          setPopupModal(false);
          setIsEdit(false);
          setEditingItem(null);
          form.resetFields();
        }}
        footer={null}
      >
        <Form layout="vertical" form={form} onFinish={handleSubmit}>
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please enter the item name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true, message: 'Please enter the price' }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: 'Please select a category' }]}
          >
            <Select>
              <Select.Option value="drinks">Drinks</Select.Option>
              <Select.Option value="rice">Rice</Select.Option>
              <Select.Option value="noodles">Noodles</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="image"
            label="Image URL"
            rules={[{ required: true, message: 'Please enter the image URL' }]}
          >
            <Input />
          </Form.Item>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </div>
        </Form>
      </Modal>
    </DefaultLayout>
  );
};

export default ItemPage;
