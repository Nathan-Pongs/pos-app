// CartPage.jsx
import React, { useState, useEffect } from 'react';
import DefaultLayout from '../components/DefaultLayout';
import { useSelector, useDispatch } from 'react-redux';
import { DeleteOutlined, PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { Button, Table, Modal, Form, Select, Input, message} from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [subTotal, setSubTotal] = useState(0);
  const [billPopup, setBillPopup] = useState(false);
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.rootReducer?.cartItems || []);
  const date = useSelector((state) => state.rootReducer?.date ? new Date(state.rootReducer.date) : new Date());


  const handleIncrement = (record) => {
    dispatch({
      type: 'UPDATE_CART',
      payload: { ...record, quantity: record.quantity + 1 },
    });
  };

  const handleDecrement = (record) => {
    if (record.quantity > 1) {
      dispatch({
        type: 'UPDATE_CART',
        payload: { ...record, quantity: record.quantity - 1 },
      });
    }
  };

  const handleDelete = (record) => {
    dispatch({
      type: 'REMOVE_FROM_CART',
      payload: record._id,
    });
  };

  const handleSubmit = async (values) => {
    try {
      const tax = parseFloat(((subTotal / 100) * 10).toFixed(2));
      const totalAmount = parseFloat((subTotal + tax).toFixed(2));
  
      const newBill = {
        ...values,
        cartItems,
        date,
        subTotal,
        tax,
        totalAmount,
      };

      const newCustomer = {
        ...values,
        date
      }
  
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/bills/add-bill`, newBill);
      message.success('Bill generated successfully!');

      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/customer/add-customer`, newCustomer);
      
      // Clear cart after successful bill generation
      dispatch({ type: 'CLEAR_CART' });
      
      navigate('/bills');
    } catch (error) {
      message.error('Something went wrong!');
      console.log(error);
    }
  };    

  const columns = [
    { title: 'Name', dataIndex: 'name' },
    {
      title: 'Image',
      dataIndex: 'image',
      render: (image, record) => (
        <img src={image} alt={record.name} height="60" width="60" />
      ),
    },
    { title: 'Price', 
      dataIndex: 'price',
      render: (text) => `$${parseFloat(text).toFixed(2)}`
    },
    {
      title: 'Quantity',
      dataIndex: '_id',
      render: (id, record) => (
        <div>
          <PlusCircleOutlined
            className="mx-3"
            style={{ cursor: 'pointer' }}
            onClick={() => handleIncrement(record)}
          />
          <b>{record.quantity}</b>
          <MinusCircleOutlined
            className="mx-3"
            style={{ cursor: 'pointer' }}
            onClick={() => handleDecrement(record)}
          />
        </div>
      ),
    },
    {
      title: 'Action',
      dataIndex: '_id',
      render: (id, record) => (
        <DeleteOutlined
          style={{ cursor: 'pointer' }}
          onClick={() => handleDelete(record)}
        />
      ),
    },
  ];

  useEffect(() => {
    let temp = 0;
    cartItems.forEach((item) => {
      temp += item.price * item.quantity;
    });
    setSubTotal(temp);
  }, [cartItems]);

  return (
    <DefaultLayout>
      <h2>Cart</h2>
      <Table columns={columns} dataSource={cartItems} rowKey="_id" bordered />
      <div className='d-flex flex-column align-items-start'>
        <h3>SUB TOTAL : $<b>{subTotal.toFixed(2)}</b> /-</h3>
        <Button type='primary' onClick={() => setBillPopup(true)}>Generate Invoice</Button>
      </div>
      <Modal
        title={'Invoice'}
        visible={billPopup}
        onCancel={() => {
          setBillPopup(false)
        }}
        footer={false}
      >
        <Form layout="vertical" form={form} onFinish={handleSubmit}>
          <Form.Item
            name="customerName"
            label="Name"
            rules={[{ required: true, message: 'Please enter the customer name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="customerContact"
            label="Contact Number"
            rules={[{ required: true, message: 'Please enter the contact number' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="paymentMode"
            label="Payment Method"
            rules={[{ required: true, message: 'Please select a payment method' }]}
          >
            <Select>
              <Select.Option value="Cash">Cash</Select.Option>
              <Select.Option value="Advanced Bank of Asia">Advanced Bank of Asia</Select.Option>
              <Select.Option value="ACELEDA">ACLEDA</Select.Option>
              <Select.Option value="Card">Card</Select.Option>
            </Select>
          </Form.Item>
          <div className='bill-it'>
            <h5>
              Sub Total : $<b>{parseFloat(subTotal).toFixed(2)}</b>
            </h5>
            <h4>
              TAX : $<b>{((subTotal / 100) * 10).toFixed(2)}</b>
            </h4>
            <h3>
              GRAND TOTAL : $<b>{(Number(subTotal) + Number((subTotal / 100) * 10)).toFixed(2)}</b>
            </h3>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="primary" htmlType="submit">
              Generate bill
            </Button>
          </div>
        </Form>
      </Modal>
    </DefaultLayout>
  );
};

export default CartPage;
