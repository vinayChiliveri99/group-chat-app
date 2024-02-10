/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { getAllChatsInAChannel } from '../Api';
import ChatCard from './ChatCard';
import SendMessage from './SendMessage';
import ScrollableFeed from 'react-scrollable-feed';

// import Seperator from './Seperator';

function DisplayChats(props) {
  const { currentChannelData } = props;
  const [chats, setChats] = useState([]);

  // fetch chats from current channel and display them
  useEffect(() => {
    const values = { channelId: currentChannelData.id };
    getAllChatsInAChannel(values).then((data) => {
      // data.map((ele) => console.log(ele));
      setChats(data);
    });
  }, [currentChannelData.id]);

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
          // backgroundColor: 'rgb(37,35, 41)',
          // color: 'white',
          // color: 'rgb(130,130,130)',
        }}
      >
        <h4 style={{ position: 'relative' }}>
          {currentChannelData.name}
        </h4>
        {/* <Seperator /> */}

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
        channelId={currentChannelData.id}
        setChats={setChats}
        chats={chats}
      />
    </div>
  );
}

export default DisplayChats;
