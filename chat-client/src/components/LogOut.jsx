import { useState } from 'react';
import { Button, Modal } from 'antd';
import { setLogout } from '../app/slices/userSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const LogOut = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('userData');
    dispatch(setLogout());
    setIsModalOpen(false);
    navigate('/');
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Logout
      </Button>
      <Modal
        title="Confirm Logout"
        open={isModalOpen}
        onOk={handleLogout}
        onCancel={handleCancel}
      >
        <p>Are you sure you want to logout?</p>
      </Modal>
    </>
  );
};

export default LogOut;
