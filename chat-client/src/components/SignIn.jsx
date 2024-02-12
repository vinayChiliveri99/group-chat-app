import { useNavigate } from 'react-router-dom';
import { Button, Form, Input, Space, message } from 'antd';
import { setLogin } from '../app/slices/userSlice';
import { useDispatch } from 'react-redux';
import { signIn } from '../Api';

function SignIn() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      const response = await signIn(values);

      sessionStorage.setItem(
        'userData',
        JSON.stringify(response.data)
      );
      // setting the user state in redux store.
      dispatch(setLogin(response.data.username));

      // console.log('after login in response', response.data);
      form.resetFields();
      form.setFieldsValue({
        username: '',
        password: '',
      });

      navigate('/welcome');
    } catch (error) {
      // console.log('from signin', error);
      form.setFieldsValue({
        username: '',
        password: '',
      });
      await message.error(error.response.data.message);
      form.resetFields();
    }
  };

  const onFinishFailed = (errorInfo) => {
    form.setFieldsValue({
      username: '',
      password: '',
    });
    console.log('Failed:', errorInfo);
    form.resetFields();
  };

  return (
    <div className="signin-container">
      <h2 id="group-heading">Group-Chat-Application</h2>
      <h4 id="login">Login</h4>
      <Form
        name="basic"
        form={form}
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
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: 'Please input your password!',
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
            <Button type="primary" htmlType="submit">
              Login
            </Button>

            <Button
              type="primary"
              onClick={() => navigate('/signup')}
            >
              Create Account
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
}
export default SignIn;
