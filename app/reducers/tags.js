import assign from 'lodash.assign';
import cloneDeep from 'lodash/cloneDeep';
const initialState = assign({
  tags: [],
  choice: [],
  permission: false,
  message: '',
  status: 0,
  isLoading: false,
  receivedAt: Date.now()
});

export const tagsPage = function(state = initialState, action) {
  let nextState = {};
  switch (action.type) {
    case 'REQUEST_GET_TAGS':
      return assign(nextState, state, { isLoading: true });
    case 'RECIEVE_GET_TAGS':
      if (action.data && action.data.all) {
        state.tags = action.data.all;
        state.message = action.data.message;
      }else {
        state.tags = [];
        state.message = '请求失败';
      }
      return assign(nextState, state, { isLoading: false });

    case 'TAG_PERMISSION':
      return assign(nextState, state, { permission: action.permission });
    case 'TAG_CHOICE':
      state.choice = [];
      state.choice.push(action.tag);
      return assign(nextState, state);
    case 'REMOVE_TAG_CHOICE':
      state.choice = [];
      return assign(nextState, state);
    default:
      return state || initialState;
  }
};