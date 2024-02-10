/* eslint-disable react/prop-types */
import { SearchOutlined } from '@ant-design/icons';
import { Input } from 'antd';

function SearchBar(props) {
  const { setSearch } = props;

  // console.log(search);

  return (
    <div
      style={{
        display: 'flex',
        border: '0.5px solid black',
        borderRadius: '5px',
        padding: '3px 10px',
      }}
    >
      <SearchOutlined />
      <Input
        placeholder="Search"
        style={{ border: 'none', outline: 'none' }}
        onInput={(e) => setSearch(e.target.value)}
      ></Input>
    </div>
  );
}

export default SearchBar;
