import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import CryptoJS from 'crypto-js'; // Import crypto-js

const Login = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    const { email, password } = values;
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/users/login`, { email, password });
      if (response.data.success) {
        message.success('Login successfully!');

        // Encrypt user data and store it in localStorage
        const encryptedData = CryptoJS.AES.encrypt(JSON.stringify({ email }), 'secret-key').toString();
        localStorage.setItem('user', encryptedData);

        navigate('/');
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      message.error('User is not registered!');
    }
  };

  return (
    <div className='login'>
      <h1>POS APP</h1>
      <h3>Login Page</h3>
      <Form layout="vertical" form={form} onFinish={handleSubmit} className='form'>
        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, message: 'Please enter your email' }, { type: 'email', message: 'Please enter a valid email' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: 'Please enter your password' }]}
        >
          <Input.Password className='input-password' />
        </Form.Item>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <p>Not yet have an account? <Link to="/register">Register Here!</Link></p>
          <Button type="primary" htmlType="submit">
            Login
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default Login;