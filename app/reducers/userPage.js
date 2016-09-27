import assign from 'lodash.assign';
import cloneDeep from 'lodash/cloneDeep';
const initialState = assign({
  userInfo: null,
  anonymous: null,
  discussions: [],
  discussions_complaint: [],
  liked: [],
  liked_complaint: [],
  answered: [],
  answered_complaint: [],
  message: '',
  hasMore: false,
  links: null,
  status: 0,
  isLoading: false,
  receivedAt: Date.now()
});

export const userPage = function(state = initialState, action) {
  let nextState = {};
  let discussions = [];
  let liked = [];
  let answered = [];
  switch (action.type) {
    case 'REQUEST_GET_USERINFO':
      return assign(nextState, state, { isLoading: true });
    case 'RECIEVE_GET_USERINFO':
      if (action.data.id) {
        state.userInfo = action.data;
        state.message = '数据获取成功';
      }else {
        state.message = action.data.message;
      }
      return assign(nextState, state, { isLoading: false });
    case 'REFRESH_USER_INFO':
      state.userInfo.incognito = state.userInfo.incognito || {};
      state.userInfo.incognito.userName = action.incognito.incognitoName;
      if (action.incognito.incognitoAvatar) {
        state.userInfo.incognito.avatar = action.incognito.incognitoAvatar;
      }
      return (nextState, state);
    case 'REQUEST_GET_OWNER_REQUEST_LIST':
      return  assign(nextState, state, { isLoading: true });
    case 'REQUEST_GET_OWNER_LIKED_LIST':
      return  assign(nextState, state, { isLoading: true });
    case 'REQUEST_GET_OWNER_ANSWERED_LIST':
      return  assign(nextState, state, { isLoading: true });
    case 'REQUEST_USER_DELETE_FAVOR':
      return  assign(nextState, state, { isLoading: true });
    case 'REQUEST_UPLOAD_ANONYMOUS_AVATAR':
      return assign(nextState, state, { isLoading: true });
    case 'REMOVE_USER_QUESTIONS_LIST':
      return assign(nextState, state, { discussions: [], discussions_complaint: [] });
    case 'RECIEVE_GET_OWNER_REQUEST_LIST':
      if (action.data.discussions) {
        discussions = cloneDeep(state.discussions);
        state.discussions = discussions.concat(action.data.discussions);
        state.links = action.data.links;
        state.message = '数据获取成功';
      }else {
        state.message = action.data.message;
      }
      return assign(nextState, state, { isLoading: false });
    case 'REMOVE_USER_LIKED_LIST':
      return assign(nextState, state, { liked: [], liked_complaint: [] });
    case 'RECIEVE_GET_OWNER_LIKED_LIST':
      liked = cloneDeep(state.liked);
      return assign(nextState, state, action, {
        liked: liked.concat((action.data && action.data.discussions) ? action.data.discussions : []),
        hasMore: (action.data && action.data.hasMore) ? action.data.hasMore : false,
        links: (action.data && action.data.links) ? action.data.links : null,
        isLoading: false });
    case 'RECIEVE_USER_DELETE_FAVOR':
      if (action.data && action.data.status === 204) {
        liked = state.liked.filter(function(v, i) {
          return v.discussionID.toString() !== action.params.targetID;
        });
      }
      return assign(nextState, state, { liked, isLoading: false });
    case 'REMOVE_USER_ANSWERED_LIST':
      return assign(nextState, state, { answered: [], answered_complaint: [] });
    case 'RECIEVE_GET_OWNER_ANSWERED_LIST':
      if (action.data.comments) {
        answered = cloneDeep(state.answered);
        state.answered = answered.concat(action.data.comments);
        state.links = action.data.links;
        state.message = '数据获取成功';
      }else {
        state.message = action.data.message;
      }
      return assign(nextState, state, { isLoading: false });
    case 'RECIEVE_UPLOAD_ANONYMOUS_AVATAR':
      if (action.data.fID) {
        state.anonymous = action.data;
        state.message = '数据获取成功';
      }else {
        state.message = action.data.message;
      }
      return assign(nextState, state, { isLoading: false });
    case 'REQUEST_DELETE_USER_DISCUSSION':
      return assign(nextState, state, { isLoading: true });
    case 'RECIEVE_DELETE_USER_DISCUSSION':
      if (action.data && action.status === 204) {
        discussions = state.discussions.filter(function(v) {
          "use strict";
          return v.discussionID !== action.params.id;
        });
        return assign(nextState, state, { discussions }, { isLoading: false });
      }else {
        return assign(nextState, state, { isLoading: false, message: '请求错误' });
      }
    case 'REQUEST_DELETE_UESR_COMMENT':
      return assign(nextState, state, { isLoading: true });
    case 'RECIEVE_DELETE_UESR_COMMENT':
      if (action.data && action.status === 204) {
        answered = state.answered.filter(function(v) {
          "use strict";
          return v.commentID !== action.params.id;
        });
        return assign(nextState, state, { answered }, { isLoading: false });
      }else {
        return assign(nextState, state, { isLoading: false, message: '请求错误' });
      }
    case 'SET_USERID':
      state.userInfo = action.userInfo;
      return assign(nextState, state);
    default:
      return state;
  }
};