import { useState } from 'react';
import DisplayChats from './DisplayChats';
import MembersDisplay from './MembersDisplay';
// import SendMessage from './SendMessage';
import ChannelsDisplay from './ChannelsDisplay';
import { useSelector } from 'react-redux';
// import { Button } from 'antd';
// import { useNavigate } from 'react-router-dom';
import StarterPage from './StarterPage';

function WelcomePage() {
  const [sidebar, setSidebar] = useState(true);

  const user = useSelector((state) => state.user.user);
  const userData = JSON.parse(sessionStorage.getItem('userData'));

  // console.log(userData);
  const token = userData.accessToken;

  // const navigate = useNavigate();
  const currentChannelData = useSelector(
    (state) => state.channels.curChannel
  );

  console.log(
    'current channel data from welcome page',
    currentChannelData
  );

  return (
    <>
      {(user || token) && currentChannelData ? (
        sidebar ? (
          <div style={{ display: 'flex' }}>
            <MembersDisplay
              setSidebar={setSidebar}
              sidebar={sidebar}
            />
            <div>
              <DisplayChats currentChannelData={currentChannelData} />
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex' }}>
            <ChannelsDisplay
              setSidebar={setSidebar}
              sidebar={sidebar}
            />
            <div>
              <DisplayChats currentChannelData={currentChannelData} />
            </div>
          </div>
        )
      ) : (
        <>
          <div style={{ display: 'flex' }}>
            <ChannelsDisplay
              setSidebar={setSidebar}
              sidebar={sidebar}
            />
            {/* <DisplayChats />
          <SendMessage /> */}
            <StarterPage />
          </div>
        </>
      )}
    </>
  );
}

export default WelcomePage;
