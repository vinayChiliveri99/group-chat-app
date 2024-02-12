/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import AddNewChannel from './AddNewChannel';
import SearchBar from './SearchBar';
import './WelcomeStyles.css';
import { useDispatch, useSelector } from 'react-redux';
import {
  DeleteOutlined,
  LeftOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  deleteChannel,
  fetchChannels,
  getChannelDetails,
} from '../Api';
import {
  currentChannel,
  setAllChannels,
} from '../app/slices/channelSlice';
import { Avatar, message } from 'antd';
import LogOut from './LogOut';

function ChannelsDisplay(props) {
  const { sidebar, setSidebar } = props;
  const [search, setSearch] = useState('');

  const dispatch = useDispatch();

  const userData = JSON.parse(sessionStorage.getItem('userData'));
  const userName = userData.username;

  useEffect(() => {
    fetchChannels().then((data) => {
      // setChannels(data);
      dispatch(setAllChannels(data));
    });
  }, [dispatch]);

  const channels = useSelector((state) => state.channels.data);

  let filteredData = null;

  const handleChannelNavigation = (ele) => {
    // console.log('navigate to', ele);
    // dispatch(currentChannel(ele));
    let values = { id: ele.id };
    getChannelDetails(values).then((data) => {
      // console.log('current channel details are', data);
      dispatch(currentChannel(data));
    });
    setSidebar(!sidebar);
  };

  const handleDeleteChannel = (ele) => {
    let values = { channelId: ele.id };

    // can move the rendering to welcome group, if user deletes the channel, in which he is now

    deleteChannel(values)
      .then((data) => {
        // console.log('channel deleted', data);
        const xyz = channels.filter((ele) => ele.id !== data.id);
        dispatch(setAllChannels(xyz));
        message.success(
          `${data.name} channel deleted successfully!!`
        );
      })
      .catch((err) => {
        message.error(err.response.data.message);
      });
  };

  if (channels) {
    filteredData = channels;
  }

  filteredData = channels.filter((ele) =>
    ele.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div id="channelsDisplay">
      <div id="leftarrow-block">
        <p>
          <span id="arrow" onClick={() => setSidebar(!sidebar)}>
            <LeftOutlined />
          </span>
          Channels
          <span id="plus-sign">
            <AddNewChannel />
          </span>
        </p>
      </div>
      <SearchBar search={search} setSearch={setSearch} />

      <div style={{ height: '70vh', overflowY: 'scroll' }}>
        {filteredData ? (
          filteredData.map((ele) => {
            return (
              <p
                key={ele.id}
                style={{
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <span onClick={() => handleChannelNavigation(ele)}>
                  {ele.name.toUpperCase()}
                </span>
                <span>
                  <DeleteOutlined
                    onClick={() => handleDeleteChannel(ele)}
                  />
                </span>
              </p>
            );
          })
        ) : (
          <></>
        )}
      </div>

      <div id="current-user">
        <p
          style={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <span>
            <Avatar
              style={{
                backgroundColor: '#87d068',
              }}
              icon={<UserOutlined />}
            />
            <span style={{ marginLeft: '10px' }}>{userName}</span>
          </span>
          <span>
            <LogOut />
          </span>
        </p>
      </div>
    </div>
  );
}

export default ChannelsDisplay;
