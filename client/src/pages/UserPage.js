import React, { useState, useEffect } from 'react';
import DefaultLayout from '../components/DefaultLayout';
import axios from 'axios';
import { Table, message, Modal } from 'antd';
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
const { confirm } = Modal;

function UserPage() {
    const [userData, setUserData] = useState([]);

    const getUsers = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/users/get-users`);
            setUserData(data);
            console.log(data);
        } catch (error) {
            console.log(error);
            message.error('Failed to fetch users');
        }
    };

    useEffect(() => {
        getUsers();
    }, []);

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/users/delete-user/${id}`);
            message.success(response.data.message);
            getUsers();  // Refresh the list
        } catch (error) {
            console.error('Failed to delete the user:', error);
            message.error(error.response?.data?.message || 'Failed to delete the user');
        }
    };      

    const showDeleteConfirm = (id) => {
        confirm({
            title: 'Are you sure you want to delete this user?',
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
            title: 'User ID',
            dataIndex: 'index',  // Changed to use the index position
            key: 'userId',
            render: (_, __, index) => index + 1  // Render function to display sequential numbering
        },
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username'
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email'
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <DeleteOutlined 
                    style={{ cursor: 'pointer', color: 'red' }}
                    onClick={() => showDeleteConfirm(record._id)}
                />
            )
        },
    ];

    return (
        <DefaultLayout>
            <h1>User Management</h1>
            <Table
                columns={columns}
                rowKey="_id"
                dataSource={userData}
                bordered
                pagination={true}
            />
        </DefaultLayout>
    );
}

export default UserPage;