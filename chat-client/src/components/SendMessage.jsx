import { useState } from 'react';
import { Input, Button } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { sendAMessage } from '../Api';

function SendMessage(props) {
  // eslint-disable-next-line react/prop-types
  const { channelId, setChats, chats } = props;
  const [message, setMessage] = useState('');

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSubmit = () => {
    if (message.trim() !== '') {
      console.log('Sending message:', message);
      // Add your logic to send the message
      let values = { content: message, channelId: channelId };
      setMessage(''); // Clear the input field after sending
      // api call to send message
      sendAMessage(values).then((data) => {
        console.log('msg sent successfully', data.chat);
        setChats([...chats, data.chat]);
      });
    }
  };

  // eslint-disable-next-line no-unused-vars
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '10px',
      }}
    >
      <Input
        placeholder="Type your message here"
        value={message}
        onChange={handleMessageChange}
        onPressEnter={handleSubmit}
        style={{ flex: 1, marginRight: 8 }}
      />
      <Button
        type="primary"
        shape="circle"
        icon={<SendOutlined />}
        onClick={handleSubmit}
      />
    </div>
  );
}

export default SendMessage;
