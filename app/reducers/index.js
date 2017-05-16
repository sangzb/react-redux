import { combineReducers } from 'redux';
import apiReducer from './apiReducer';

const rootReducer = combineReducers({
  // dashboard: apiReducer({ state: 'FETCH_DASHBOARD_INFO', initialState: { data: {} } }),
  // apps: apiReducer({ state: 'FETCH_APPS' })
});

export default rootReducer;
