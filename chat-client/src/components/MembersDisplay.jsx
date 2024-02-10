/* eslint-disable react/prop-types */
import { useDispatch, useSelector } from 'react-redux';
import './WelcomeStyles.css';
import { LeftOutlined, UserOutlined } from '@ant-design/icons';
import LogOut from './LogOut';
import { getMembersInAChannel } from '../Api';
import { allMembersInChannel } from '../app/slices/channelSlice';
import { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import AddUserToChannel from './AddUserToChannel';
import { Avatar } from 'antd';

function MembersDisplay(props) {
  const { sidebar, setSidebar } = props;
  const dispatch = useDispatch();

  const userData = JSON.parse(localStorage.getItem('userData'));
  const userName = userData.username;
  // const userId = userData.id;
  // {userId === currentChannelData.groupAdmin
  //   ? '(Admin)'
  //   : ''}

  const currentChannelData = useSelector(
    (state) => state.channels.curChannel
  );

  useEffect(() => {
    if (currentChannelData) {
      let values = { channelId: currentChannelData.id };
      getMembersInAChannel(values)
        .then((data) => {
          console.log('members in channel details are', data);
          dispatch(allMembersInChannel(data));
        })
        .catch((error) => {
          console.error('Error fetching members:', error);
        });
    }
  }, [currentChannelData, dispatch]);

  const members = useSelector(
    (state) => state.channels.members.members
  );

  // console.log('members data to map', members);

  // const handleAddUser = () => {
  //   console.log('new user clicked');
  // };

  return (
    <div id="membersDisplay">
      <div id="leftarrow-block">
        <p>
          <span id="arrow" onClick={() => setSidebar(!sidebar)}>
            <LeftOutlined />
          </span>
          All Channels
        </p>
      </div>
      <div>
        <h4>{currentChannelData?.name}</h4>
        <p>{currentChannelData?.description}</p>
      </div>
      <div>
        <h5
          style={{ display: 'flex', justifyContent: 'space-between' }}
        >
          MEMBERS{' '}
          <span>
            <AddUserToChannel channelId={currentChannelData.id} />
          </span>
        </h5>
        {/* should map over the members and need to display them */}
        <div id="individual-members">
          {members && members.length > 0 ? (
            members.map((member) => <p key={uuidv4()}>{member} </p>)
          ) : (
            <p>No members found</p>
          )}
        </div>
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

export default MembersDisplay;
