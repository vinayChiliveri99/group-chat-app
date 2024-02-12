import axios from 'axios';

const userData = sessionStorage.getItem('userData');
const ApiToken = userData ? JSON.parse(userData).accessToken : null;

// console.log('token', ApiToken);

const baseURL = 'http://localhost:8080';
const config = {
  headers: {
    'Content-Type': 'application/json',
    'x-access-token': ApiToken,
  },
};

// 1. fetch all channels data

export const fetchChannels = async () => {
  try {
    const response = await axios.get(
      `${baseURL}/api/channels`,
      config
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching channels:', error);
    throw error;
  }
};

// 2. signin

export const signIn = async (values) => {
  try {
    const response = await axios.post(
      `${baseURL}/api/signin`,
      values,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

// 3. signup

export const signUp = async (values) => {
  try {
    const response = await axios.post(
      `${baseURL}/api/signup`,
      values,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response;
  } catch (error) {
    console.error('Error signing up user:', error);
    throw error;
  }
};

// 4. add new channel

export const addNewChannelApi = async (values) => {
  console.log(values);
  try {
    const response = await axios.post(
      `${baseURL}/api/channels`,
      values,
      config
    );
    return response.data;
  } catch (error) {
    console.error('Error adding a new channel:', error);
    throw error;
  }
};

// 5. get details of a channel

export const getChannelDetails = async (values) => {
  try {
    const response = await axios.get(
      `${baseURL}/api/channelDetails`,
      {
        params: values,
        ...config,
      }
    );
    // console.log('Channel details:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching channel details:', error);
    throw error;
  }
};

// 6. get users in a channel using channel id.

export const getMembersInAChannel = async (values) => {
  try {
    const response = await axios.get(
      `${baseURL}/api/channels/members`,
      {
        params: values,
        ...config,
      }
    );
    // console.log('members details:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching channel details:', error);
    throw error;
  }
};

// 7. add a user to the channel.

export const addAUserToChannel = async (values) => {
  console.log(values);
  try {
    const response = await axios.post(
      `${baseURL}/api/channels/addUser`,
      values,
      config
    );
    return response.data;
  } catch (error) {
    console.error('Error adding a new user to channel:', error);
    throw error;
  }
};

// 8. delete a channel.

export const deleteChannel = async (values) => {
  try {
    const response = await axios.delete(`${baseURL}/api/channels`, {
      data: values,
      ...config,
    });
    console.log('deleted channel is', response.data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// 9. get all chats in a channel.

export const getAllChatsInAChannel = async (values) => {
  try {
    const response = await axios.get(`${baseURL}/api/chats`, {
      params: values,
      ...config,
    });
    // console.log('Channel details:', response.data.chats);
    return response.data.chats;
  } catch (error) {
    console.error('Error fetching chats:', error);
    throw error;
  }
};

// 10. add a chat to a channel.

export const sendAMessage = async (values) => {
  // console.log(values);
  try {
    const response = await axios.post(
      `${baseURL}/api/chats`,
      values,
      config
    );
    return response.data;
  } catch (error) {
    console.error('Error adding a new message to channel:', error);
    throw error;
  }
};
