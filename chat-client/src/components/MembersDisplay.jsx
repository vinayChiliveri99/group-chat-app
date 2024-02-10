/* eslint-disable react/prop-types */
// import { useDispatch, useSelector } from 'react-redux';
// import './WelcomeStyles.css';
// import { LeftOutlined } from '@ant-design/icons';
// import LogOut from './LogOut';
// import { getMembersInAChannel } from '../Api';
// import { allMembersInChannel } from '../app/slices/channelSlice';
// import { useEffect } from 'react';

// function MembersDisplay(props) {
//   // eslint-disable-next-line react/prop-types
//   const { sidebar, setSidebar } = props;
//   const dispatch = useDispatch();

//   const userData = JSON.parse(localStorage.getItem('userData'));
//   const userName = userData.username;

//   const currentChannelData = useSelector(
//     (state) => state.channels.curChannel
//   );

//   useEffect(() => {
//     if (currentChannelData) {
//       let values = { channelId: currentChannelData.id };
//       getMembersInAChannel(values).then((data) => {
//         console.log('members in channel details are', data);
//         dispatch(allMembersInChannel(data));
//       });
//     }
//   }, [currentChannelData, dispatch]);

//   // console.log('data from mem display', currentChannelData.id);

//   const members = useSelector(
//     (state) => state.channels.members
//   ).members;

//   return (
//     <div id="membersDisplay">
//       <div id="leftarrow-block">
//         <p>
//           <span id="arrow" onClick={() => setSidebar(!sidebar)}>
//             <LeftOutlined />
//           </span>
//           All Channels
//         </p>
//       </div>
//       <div>
//         <h4>{currentChannelData.name}</h4>
//         <p>{currentChannelData.description}</p>
//       </div>
//       <div>
//         <h5>MEMBERS</h5>
//         {/* should map over the members and need to display them */}
//         <div id="individual-members">
//           <li>user 1</li>
//           <li>user 2</li>
//           <li>user 3</li>
//           <li>user 4</li>
//         </div>
//       </div>

//       <div id="current-user">
//         <p>
//           {userName}
//           <span id="down-arrow">
//             {/* need to add a modal here */}

//             <LogOut />
//           </span>
//         </p>
//       </div>
//     </div>
//   );
// }

// export default MembersDisplay;

import { useDispatch, useSelector } from 'react-redux';
import './WelcomeStyles.css';
import { LeftOutlined } from '@ant-design/icons';
import LogOut from './LogOut';
import { getMembersInAChannel } from '../Api';
import { allMembersInChannel } from '../app/slices/channelSlice';
import { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
// import { Button } from 'antd';
import AddUserToChannel from './AddUserToChannel';

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
        <p>
          {userName}
          <span id="down-arrow">
            {/* need to add a modal here */}
            <LogOut />
          </span>
        </p>
      </div>
    </div>
  );
}

export default MembersDisplay;
