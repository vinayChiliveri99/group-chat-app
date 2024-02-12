/* eslint-disable react/prop-types */
import { Input, Button } from 'antd';
import { SendOutlined } from '@ant-design/icons';

function SendMessage(props) {
  const { handleSubmit, setMessage, message } = props;

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
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
