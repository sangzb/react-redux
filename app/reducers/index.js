import { combineReducers } from 'redux';
import apiReducer from './apiReducer';
import { user } from './user';
import { request } from './request';
import { fileUpload } from './fileupload';
import { requestItem } from './answer';
import { requestForm } from './requestForm';
import { requestAnswer } from './requestAnswer';
import { listPage } from './listPage';
import { userPage } from './userPage';
import { helperRank } from './helperRank';
import { tagsPage } from './tags';
const rootReducer = combineReducers({
  user,
  request,
  listPage,
  fileUpload,
  requestItem,
  requestForm,
  requestAnswer,
  userPage,
  helperRank,
  tagsPage
  // dashboard: apiReducer({ state: 'FETCH_DASHBOARD_INFO', initialState: { data: {} } }),
  // apps: apiReducer({ state: 'FETCH_APPS' })
});

export default rootReducer;
