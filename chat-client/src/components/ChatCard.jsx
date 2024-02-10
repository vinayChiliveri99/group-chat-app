/* eslint-disable react/prop-types */
import { dateFormattter } from './utility/dateFormatter';

const ChatCard = (props) => {
  const { content, username, messageDate } = props;
  return (
    <article
      className="chat-card flow-2"
      style={{
        // backgroundColor: '#3C393F',
        padding: '.4rem',
        borderRadius: '8px',
        border: '0.5px solid black',
      }}
    >
      <div className="flex gap-1">
        <div>
          <div>
            <div>
              <p className="">{username}</p>
              <p style={{ fontSize: '.75rem' }}>
                {dateFormattter(messageDate)}
              </p>
            </div>
            <p>
              {/* Lorem ipsum dolor sit amet consectetur adipisicing elit.
              sequi eum nobis . */}
              {content}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ChatCard;
