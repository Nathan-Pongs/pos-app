import React, { useState, useEffect } from 'react';
import DefaultLayout from '../components/DefaultLayout';
import { useSelector, useDispatch } from 'react-redux';
import { DeleteOutlined, PlusCircleOutlined, MinusCircleOutlined, PrinterOutlined } from '@ant-design/icons';
import { Button, Table, Modal, Form, Select, Input, message } from 'antd';
import axios from 'axios';

const CartPage = () => {
  const [form] = Form.useForm();
  const [subTotal, setSubTotal] = useState(0);
  const [billPopup, setBillPopup] = useState(false);
  const [billPreview, setBillPreview] = useState(null); // New state for bill preview
  const [showPreviewModal, setShowPreviewModal] = useState(false); // New state for bill preview modal
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

      // Set bill preview data and show modal
      setBillPreview(newBill);
      setShowPreviewModal(true);

      setBillPopup(false); // Close form modal
    } catch (error) {
      message.error('Something went wrong!');
      console.log(error);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Bill</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1, h2 { text-align: center; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .footer { text-align: center; margin-top: 20px; }
          </style>
        </head>
        <body>
          <h1>Invoice</h1>
          <p><strong>Customer Name:</strong> ${billPreview.billCode}</p>
          <p><strong>Customer Name:</strong> ${billPreview.customerName}</p>
          <p><strong>Customer Contact:</strong> ${billPreview.customerContact}</p>
          <p><strong>Date:</strong> ${new Date(billPreview.date).toLocaleString()}</p>
          <h2>Purchased Items:</h2>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              ${billPreview.cartItems.map(item => `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.quantity}</td>
                  <td>$${parseFloat(item.price).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <p><strong>SubTotal:</strong> $${parseFloat(billPreview.subTotal).toFixed(2)}</p>
          <p><strong>Tax:</strong> $${parseFloat(billPreview.tax).toFixed(2)}</p>
          <p><strong>Total Amount:</strong> $${parseFloat(billPreview.totalAmount).toFixed(2)}</p>
          <p><strong>Paid by:</strong> ${billPreview.paymentMode}</p>
          <div class="footer">
            <h2>Thank you!</h2>
            <p>Please visit again!</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  useEffect(() => {
    let temp = 0;
    cartItems.forEach((item) => {
      temp += item.price * item.quantity;
    });
    setSubTotal(temp);
  }, [cartItems]);

  const itemColumns = [
    {
      title: 'Bill Code',
      dataIndex: 'billCode',
    },
    {
      title: 'Product',
      dataIndex: 'name',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      render: (text) => `$${parseFloat(text).toFixed(2)}`,
    },
  ];

  return (
    <DefaultLayout>
      <h2>Cart</h2>
      <Table columns={[
        { title: 'Name', dataIndex: 'name' },
        {
          title: 'Image',
          dataIndex: 'image',
          render: (image, record) => (
            <img src={image} alt={record.name} height="60" width="60" />
          ),
        },
        { title: 'Price', dataIndex: 'price', render: (text) => `$${parseFloat(text).toFixed(2)}` },
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
      ]} dataSource={cartItems} rowKey="_id" bordered />
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
              <Select.Option value="Bank Transfer">Bank Transfer</Select.Option>
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
              GRAND TOTAL : $<b>{(subTotal + (subTotal / 100) * 10).toFixed(2)}</b>
            </h3>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="primary" htmlType="submit">
              Generate bill
            </Button>
          </div>
        </Form>
      </Modal>
      {showPreviewModal && billPreview && (
        <Modal
        visible={showPreviewModal}
        onCancel={() => {
          setShowPreviewModal(false)
        }}
        footer={[
          <Button key="print" icon={<PrinterOutlined />} onClick={handlePrint}>
            Print
          </Button>,
        ]}
      >
        <div className='d-flex flex-column justify-content-center'>
          <h1 style={{textAlign: 'center'}}>Invoice</h1>
          <p><strong>Bill Code:</strong> {billPreview.billCode}</p>
          <p><strong>Customer Name:</strong> {billPreview.customerName}</p>
          <p><strong>Customer Contact:</strong> {billPreview.customerContact}</p>
          <p><strong>Date:</strong> {new Date(billPreview.date).toLocaleString()}</p>
          <h4 style={{textAlign: 'center'}}>Purchased Items:</h4>
          <Table
            columns={itemColumns}
            dataSource={billPreview.cartItems}
            pagination={false}
            rowKey={(item, index) => index}
          />
          <div style={{ marginLeft: '15px' }}>
            <p><strong>SubTotal:</strong> ${parseFloat(billPreview.subTotal).toFixed(2)}</p>
            <p><strong>Tax:</strong> ${parseFloat(billPreview.tax).toFixed(2)}</p>
            <p><strong>Total Amount:</strong> ${parseFloat(billPreview.totalAmount).toFixed(2)}</p>
            <p><strong>Paid by:</strong> {billPreview.paymentMode}</p>
          </div>
        </div>
      </Modal>
      )}
    </DefaultLayout>
  );
};

export default CartPage;