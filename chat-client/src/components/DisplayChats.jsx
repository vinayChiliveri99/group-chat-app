/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { getAllChatsInAChannel, sendAMessage } from '../Api';
import ChatCard from './ChatCard';
import SendMessage from './SendMessage';
import ScrollableFeed from 'react-scrollable-feed';
import io from 'socket.io-client';

const ENDPOINT = 'http://localhost:8080';
let socket;
const userData = JSON.parse(localStorage.getItem('userData'));

function DisplayChats({ currentChannelData }) {
  const [message, setMessage] = useState('');
  const [chats, setChats] = useState([]);
  const [selectedChatCompare, setSelectedChatCompare] =
    useState(null);

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit('setup', userData);
    socket.on('connection', () => {
      console.log('Connected to socket');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    socket.on('message received', (newMessageReceived) => {
      // Check if the received message belongs to the currently selected chat
      if (
        currentChannelData &&
        newMessageReceived.chat &&
        currentChannelData.id === newMessageReceived.chat.channelId
      ) {
        setChats((prevChats) => [
          ...prevChats,
          newMessageReceived.chat,
        ]);
      }
    });

    return () => {
      socket.off('message received');
    };
  }, [currentChannelData, selectedChatCompare]);

  useEffect(() => {
    if (currentChannelData && currentChannelData.id) {
      socket.emit('join chat', currentChannelData.id);
      setSelectedChatCompare(currentChannelData);
      getAllChatsInAChannel({
        channelId: currentChannelData.id,
      }).then((data) => {
        setChats(data);
      });
    }
  }, [currentChannelData]);

  const handleSubmit = () => {
    if (message.trim() !== '') {
      console.log('Sending message:', message);
      let values = {
        content: message,
        channelId: currentChannelData.id,
      };
      setMessage('');
      sendAMessage(values).then((data) => {
        socket.emit('new message', data);
        setChats([...chats, data.chat]);
      });
    }
  };

  return (
    <div>
      <div
        style={{
          height: '80vh',
          width: '70vw',
          overflowY: 'scroll',
          border: '1px solid black',
          margin: '15px',
          padding: '10px',
        }}
      >
        <h4 style={{ position: 'relative' }}>
          {currentChannelData.name}
        </h4>
        <ScrollableFeed>
          {chats.map((ele) => {
            return (
              <ChatCard
                key={ele.id}
                content={ele.content}
                username={ele.User.username}
                messageDate={ele.createdAt}
              />
            );
          })}
        </ScrollableFeed>
      </div>
      <SendMessage
        setMessage={setMessage}
        message={message}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}

export default DisplayChats;
