import { React} from 'react';
import { Form, Input, Button, message } from 'antd';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    try {
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/users/register`, values);
      message.success('User added successfully!');
      form.resetFields();
    } catch (error) {
      message.error('Something went wrong!');
      console.log(error);
    }
  };

  return (
    <>
      <div className='register'>
        <h1>POS APP</h1>
        <h3>Register Page</h3>
        <Form layout="vertical" form={form} onFinish={handleSubmit} className='form'>
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: 'Please enter your username' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email' },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: 'Please enter your password' }]}
          >
            <Input.Password className='input-password'/>
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="Confirm Password"
            rules={[
              { required: true, message: 'Please confirm your password' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The two passwords do not match!'));
                },
              }),
            ]}
          >
            <Input.Password className='input-password'/>
          </Form.Item>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <p>Already registered? <Link to="/login">Login Here!</Link></p>
            <Button type="primary" htmlType="submit">
              Register
            </Button>
          </div>
        </Form>
      </div>
    </>
  );
};

export default Register;
