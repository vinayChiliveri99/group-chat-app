import { PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, message } from 'antd';
import { useState } from 'react';
import { addNewChannelApi } from '../Api';
import { useDispatch } from 'react-redux';
import { addNewChannel } from '../app/slices/channelSlice';

function AddNewChannel() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form] = Form.useForm();
  const dispatch = useDispatch();

  // post request to add a new channel.

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
      const response = await addNewChannelApi(values.channel);
      dispatch(addNewChannel(response));
      setIsModalOpen(false);
      form.resetFields();
      await message.success('channel added!');
    } catch (err) {
      await message.error(err.response.data.message);
    }
  };

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleClose = () => {
    form.resetFields();
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    form.resetFields();
  };
  return (
    <>
      <PlusOutlined type="text" onClick={showModal}>
        +
      </PlusOutlined>
      <Modal
        title="Add Channel"
        open={isModalOpen}
        onCancel={handleClose}
        footer={[
          <Button
            key="submit"
            type="primary"
            form="channelForm"
            htmlType="submit"
          >
            Add Channel
          </Button>,
          <Button
            key="cancel"
            type="primary"
            form="channelForm"
            onClick={handleCancel}
          >
            Cancel
          </Button>,
        ]}
      >
        <Form
          {...layout}
          form={form}
          name="channelForm"
          autoComplete="off"
          onFinish={onFinish}
          style={{
            maxWidth: 600,
          }}
          validateMessages={validateMessages}
        >
          <Form.Item
            name={['channel', 'name']}
            label="Name"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input placeholder="Enter Channel Name" />
          </Form.Item>

          <Form.Item
            name={['channel', 'description']}
            label="Description"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input.TextArea placeholder="Enter Channel description" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default AddNewChannel;
