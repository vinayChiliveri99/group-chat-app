/* eslint-disable react/prop-types */
import { dateFormattter } from './utility/dateFormatter';

const Seperator = ({ chatDate }) => {
  return (
    <div
      style={{
        margin: '0 auto',
        // color: '#828282',
        display: 'flex',
        gap: '1rem',
        alignItems: 'center',
        flexFlow: '1',
      }}
    >
      <hr style={{ flex: '1' }} />
      <p>{dateFormattter(chatDate)}</p>
      <hr style={{ flex: '1' }} />
    </div>
  );
};

export default Seperator;
