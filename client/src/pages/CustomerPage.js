import {React, useState, useEffect} from 'react';
import DefaultLayout from '../components/DefaultLayout';
import axios from 'axios';
import { Table, message, Modal } from 'antd';
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
const {confirm} = Modal;

function CustomerPage() {
    const [itemsData, setItemsData] = useState([]);
    const getAllItems = async () => {
        try {
          const { data } = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/customer/get-customer`);
          setItemsData(data);
          console.log(data);
        } catch (error) {
          console.log(error);
          message.error('Failed to fetch items');
        }
    };
    useEffect(() => {
        getAllItems();
    }, [])

    const handleDelete = async (id) => {
      try {
        await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/customer/delete-customer/${id}`);
        message.success('Customer deleted successfully!');
        getAllItems();
      } catch (error) {
        message.error('Failed to delete the customer');
        console.log(error);
      }
    };

    const showDeleteConfirm = (id) => {
      confirm({
        title: 'Are you sure you want to delete this customer?',
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

    const columns = [
        {
          title: 'Customer ID',
          dataIndex: 'customerID'
        },
        {
            title: 'Customer Name',
            dataIndex: 'customerName'
        },
        {
            title: 'Contact',
            dataIndex: 'customerContact'
        },
        {
            title: 'Check In Date',
            dataIndex: 'date',
            render: (text) => {
                const localDate = new Date(text).toLocaleString();
                return localDate;
            }
        },
        {
          title: 'Action',
          dataIndex: '_id',
          render: (id) => (
            <div>
              <DeleteOutlined 
                style={{ cursor: 'pointer' }}
                onClick={() => showDeleteConfirm(id)}
              />
            </div>
          )
        },
    ]
  return (
    <DefaultLayout>
        <h1>Customer Page</h1>
        <Table
        columns={columns}
        rowKey="_id"
        dataSource={itemsData}
        bordered
        pagination={true}
      />
    </DefaultLayout>
  )
}

export default CustomerPage
