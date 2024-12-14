import React, { useEffect, useState } from 'react';
import DefaultLayout from '../components/DefaultLayout';
import axios from 'axios';
import { Card, Row, Col } from 'antd'; // Ant Design components
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'; // Recharts
import { FileTextOutlined, UserOutlined, AppstoreOutlined, TeamOutlined } from '@ant-design/icons';

function DashboardPage() {
  const [bills, setBills] = useState(0);
  const [customers, setCustomer] = useState(0);
  const [items, setItems] = useState(0);
  const [users, setUsers] = useState(0);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/bills/bill-count`).then(res => setBills(res.data.count)).catch(err => console.log(err));
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/customer/customer-count`).then(res => setCustomer(res.data.count)).catch(err => console.log(err));
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/items/item-count`).then(res => setItems(res.data.count)).catch(err => console.log(err));
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/users/user-count`).then(res => setUsers(res.data.count)).catch(err => console.log(err));
  }, []);

  // Prepare data for the bar chart
  const data = [
    { name: 'Bill', count: bills },
    { name: 'Customer', count: customers },
    { name: 'Item', count: items },
    { name: 'User', count: users },
  ];

  return (
    <DefaultLayout>
      <div style={{ padding: '20px' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Dashboard</h1>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Card
              style={{ borderRadius: '10px', textAlign: 'center' }}
              bordered={true}
            >
              <FileTextOutlined style={{ fontSize: '48px', color: '#007bff' }} />
              <h2>{bills}</h2>
              <h4>Bills</h4>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card
              style={{ borderRadius: '10px', textAlign: 'center' }}
              bordered={true}
            >
              <UserOutlined style={{ fontSize: '48px', color: '#28a745' }} />
              <h2>{customers}</h2>
              <h4>Customers</h4>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card
              style={{ borderRadius: '10px', textAlign: 'center' }}
              bordered={true}
            >
              <AppstoreOutlined style={{ fontSize: '48px', color: '#ffc107' }} />
              <h2>{items}</h2>
              <h4>Items</h4>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card
              style={{ borderRadius: '10px', textAlign: 'center' }}
              bordered={true}
            >
              <TeamOutlined style={{ fontSize: '48px', color: '#dc3545' }} />
              <h2>{users}</h2>
              <h4>Users</h4>
            </Card>
          </Col>
        </Row>

        {/* Bar Chart Section */}
        <div style={{ marginTop: '40px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Data Overview</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 20,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </DefaultLayout>
  );
}

export default DashboardPage;