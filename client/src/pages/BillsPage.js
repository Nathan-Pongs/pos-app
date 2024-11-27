import { React, useState, useEffect } from 'react';
import DefaultLayout from '../components/DefaultLayout';
import { EyeOutlined, DeleteOutlined, PrinterOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Table, message, Modal, Button } from 'antd';
import axios from 'axios';

const { confirm } = Modal;

const BillsPage = () => {
  const [itemsData, setItemsData] = useState([]);
  const [popupModal, setPopupModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);

  // Fetch all items
  const getAllItems = async () => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/bills/get-bill`);
      setItemsData(data);
      console.log(data);
    } catch (error) {
      console.log(error);
      message.error('Failed to fetch items');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/bills/delete-bill/${id}`);
      message.success('Bill deleted successfully!');
      getAllItems();
    } catch (error) {
      message.error('Failed to delete the bill');
      console.log(error);
    }
  };

  const showDeleteConfirm = (id) => {
    confirm({
      title: 'Are you sure you want to delete this bill?',
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

  // Fetch items on component mount
  useEffect(() => {
    getAllItems();
  }, []);

  const handleView = (bill) => {
    setSelectedBill(bill);
    setPopupModal(true);
  };

  // Function to print the bill
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
            .footer {display: flex; flex-direction: column; justify-content: center; align-items: center}
          </style>
        </head>
        <body>
          <h1>Invoice</h1>
          <p><strong>Bill Code:</strong> ${selectedBill.billCode}</p>
          <p><strong>Customer Name:</strong> ${selectedBill.customerName}</p>
          <p><strong>Customer Contact:</strong> ${selectedBill.customerContact}</p>
          <p><strong>Date:</strong> ${new Date(selectedBill.date).toLocaleString()}</p>
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
              ${selectedBill.cartItems.map(item => `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.quantity}</td>
                  <td>$${parseFloat(item.price).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div>
            <p><strong>SubTotal:</strong> $${parseFloat(selectedBill.subTotal).toFixed(2)}</p>
            <p><strong>Tax:</strong> $${parseFloat(selectedBill.tax).toFixed(2)}</p>
            <p><strong>Total Amount:</strong> $${parseFloat(selectedBill.totalAmount).toFixed(2)}</p>
            <p><strong>Paid by:</strong> ${selectedBill.paymentMode}</p>
          </div>
          <div class="footer">
              <h2>Thank you!</h2>
              <p>Comeback again!</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const columns = [
    {
      title: 'Bill Code',
      dataIndex: 'billCode',
    },
    {
      title: 'Customer Name',
      dataIndex: 'customerName',
    },
    {
      title: 'Customer Contact',
      dataIndex: 'customerContact',
    },
    {
      title: 'SubTotal',
      dataIndex: 'subTotal',
      render: (text) => `$${parseFloat(text).toFixed(2)}`,
    },
    {
      title: 'Tax',
      dataIndex: 'tax',
      render: (text) => `$${parseFloat(text).toFixed(2)}`,
    },
    {
      title: 'Total amount',
      dataIndex: 'totalAmount',
      render: (text) => `$${parseFloat(text).toFixed(2)}`,
    },
    {
      title: 'Payment method',
      dataIndex: 'paymentMode',
    },
    {
      title: 'Action',
      dataIndex: '_id',
      render: (id, record) => (
        <div>
          <EyeOutlined
            style={{ cursor: 'pointer', marginRight: 10 }}
            onClick={() => handleView(record)}
          />
          <DeleteOutlined
            style={{ cursor: 'pointer' }}
            onClick={() => showDeleteConfirm(id)}
          />
        </div>
      ),
    },
  ];

  // Define columns for purchased items table
  const itemColumns = [
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
      <h1>Bill Page</h1>
      <Table
        columns={columns}
        rowKey="_id"
        dataSource={itemsData}
        bordered
        pagination={true}
      />
      {popupModal && selectedBill && (
        <Modal
          visible={popupModal}
          onCancel={() => {
            setPopupModal(false);
          }}
          footer={[
            <Button key="print" icon={<PrinterOutlined />} onClick={handlePrint}>
              Print
            </Button>,
          ]}
        >
          <div className='d-flex flex-column justify-content-center'>
            <h1 style={{textAlign: 'center'}}>Invoice</h1>
            <p><strong>Bill Code:</strong> {selectedBill.billCode}</p>
            <p><strong>Customer Name:</strong> {selectedBill.customerName}</p>
            <p><strong>Customer Contact:</strong> {selectedBill.customerContact}</p>
            <p><strong>Date:</strong> {new Date(selectedBill.date).toLocaleString()}</p>
            <h4 style={{textAlign: 'center'}}>Purchased Items:</h4>
            <Table
              columns={itemColumns}
              dataSource={selectedBill.cartItems}
              pagination={false}
              rowKey={(item, index) => index}
            />
            <div style={{ marginLeft: '15px' }}>
              <p><strong>SubTotal:</strong> ${parseFloat(selectedBill.subTotal).toFixed(2)}</p>
              <p><strong>Tax:</strong> ${parseFloat(selectedBill.tax).toFixed(2)}</p>
              <p><strong>Total Amount:</strong> ${parseFloat(selectedBill.totalAmount).toFixed(2)}</p>
              <p><strong>Paid by:</strong> {selectedBill.paymentMode}</p>
            </div>
          </div>
        </Modal>
      )}
    </DefaultLayout>
  );
};

export default BillsPage;
