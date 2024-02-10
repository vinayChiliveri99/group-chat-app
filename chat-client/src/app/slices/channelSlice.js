import { createSlice } from '@reduxjs/toolkit';

const channelSlice = createSlice({
  name: 'channels',
  initialState: {
    data: [],
    errorMessage: null,
    isLoading: true,
    curChannel: '',
    members: [],
  },
  reducers: {
    setAllChannels: (state, action) => {
      state.data = action.payload;
    },
    addNewChannel: (state, action) => {
      state.data = [...state.data, action.payload];
    },
    setErrorMessage: (state, action) => {
      state.errorMessage = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    currentChannel: (state, action) => {
      state.curChannel = action.payload;
    },
    allMembersInChannel: (state, action) => {
      state.members = action.payload;
    },
    addNewMemberToChannel: (state, action) => {
      //   state.members = [...state.members, action.payload.username];
      //   console.log(state.members);
      const { username } = action.payload;
      state.members.members.push(username);
    },
  },
});

export const {
  setAllChannels,
  addNewChannel,
  setErrorMessage,
  setLoading,
  currentChannel,
  allMembersInChannel,
  addNewMemberToChannel,
} = channelSlice.actions;
export default channelSlice.reducer;
