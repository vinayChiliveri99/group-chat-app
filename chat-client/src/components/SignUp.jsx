import { useNavigate } from 'react-router-dom';
import { Button, Form, Input, Space, message } from 'antd';
import { signUp } from '../Api';

function SignUp() {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values) => {
    try {
      await messageApi.loading('Signup in progress..');

      await signUp(values);

      // Show success message and navigate after signup is finished
      await message.success('Signup finished!');
      navigate('/');
    } catch (error) {
      // console.error('Error during signup:', error);
      await message.error(error.response.data.message);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className="signin-container">
      <h2>Group-Chat-Application</h2>
      <h4>Create Account</h4>
      <Form
        name="basic"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        style={{
          maxWidth: 600,
        }}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[
            {
              required: true,
              message: 'Please input your username!',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              message: 'Please input your email!',
              type: 'email',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            },
            {
              min: 8,
              message: 'Password must be at least 8 characters',
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
          style={{ display: 'flex', justifyContent: 'center' }}
        >
          <Space>
            {contextHolder}
            <Button type="primary" htmlType="submit">
              Sign Up
            </Button>
          </Space>
        </Form.Item>
        <p>
          Already have Account? <a href="/">{`\u00a0`}Go to Login</a>
        </p>
      </Form>
    </div>
  );
}

export default SignUp;
