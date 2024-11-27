import React, { useState, useEffect } from 'react';
import DefaultLayout from '../components/DefaultLayout';
import axios from 'axios';
import { Col, Row, Button, Dropdown, Space, Menu } from 'antd';
import ItemList from '../components/ItemList';
import { DownOutlined } from '@ant-design/icons';

const Homepage = () => {
  const [itemsData, setItemsData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('drinks');
  
  const categories = [
    {
      name: 'drinks',
      key: '1',
      imageUrl: 'https://img.icons8.com/?size=100&id=SzMrGuSZ6da8&format=png&color=000000'
    },
    {
      name: 'rice',
      key: '2',
      imageUrl: 'https://cdn-icons-png.flaticon.com/128/4780/4780045.png'
    },
    {
      name: 'noodles',
      key: '3',
      imageUrl: 'https://img.icons8.com/?size=100&id=By3PJyT0V992&format=png&color=000000'
    }
  ];

  useEffect(() => {
    const getAllItems = async () => {
      try {
        const { data } = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/items/get-item`);
        setItemsData(data);
      } catch (error) {
        console.log(error);
      }
    };
    getAllItems();
  }, []);

  const handleMenuClick = (e) => {
    const category = categories.find(cat => cat.key === e.key);
    setSelectedCategory(category.name);
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      {categories.map(category => (
        <Menu.Item key={category.key}>
          <Space>
            <img src={category.imageUrl} alt={category.name} height="20" width="20" />
            {category.name}
          </Space>
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <DefaultLayout>
      <Space wrap style={{marginBottom: '10px'}}>
        <Dropdown overlay={menu}>
          <Button>
            <Space>
              {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} <DownOutlined />
            </Space>
          </Button>
        </Dropdown>
      </Space>
      <Row gutter={[16, 16]}>
        {itemsData
          .filter(item => item.category === selectedCategory)
          .map(item => (
            <Col xs={24} sm={12} md={12} lg={6} key={item.id}>
              <ItemList item={item} />
            </Col>
          ))}
      </Row>
    </DefaultLayout>
  );
};

export default Homepage;