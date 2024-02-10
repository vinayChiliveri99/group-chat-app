// import { PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, message } from 'antd';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addNewMemberToChannel } from '../app/slices/channelSlice';
import { addAUserToChannel } from '../Api';

function AddUserToChannel(props) {
  // eslint-disable-next-line react/prop-types
  const { channelId } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const layout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 16,
    },
  };

  const validateMessages = {
    required: '${label} is required!',
  };

  const onFinish = async (values) => {
    try {
      const { username } = values;
      await addAUserToChannel({ username, channelId });
      dispatch(addNewMemberToChannel({ username, channelId }));
      setIsModalOpen(false);
      form.resetFields();
      message.success('User added to the channel!');
    } catch (error) {
      message.error(error.response.data.message);
      console.error(error);
    }
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleClose = () => {
    form.resetFields();
    setIsModalOpen(false);
  };

  return (
    <>
      <Button onClick={showModal}>Add User</Button>
      <Modal
        title="Add User"
        open={isModalOpen}
        onCancel={handleClose}
        footer={null}
      >
        <Form
          {...layout}
          form={form}
          name="channelForm"
          onFinish={onFinish}
          initialValues={{ channelId }} // Set the initial value for channelId
          validateMessages={validateMessages}
        >
          <Form.Item
            name="username"
            label="Username"
            rules={[
              {
                required: true,
                message: 'Please input the username!',
              },
            ]}
          >
            <Input placeholder="Enter Username" />
          </Form.Item>
          <Form.Item name="channelId" style={{ display: 'none' }}>
            <Input type="hidden" />
          </Form.Item>
          <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
            <Button type="primary" htmlType="submit">
              Add User
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default AddUserToChannel;
