import assign from 'lodash.assign';
const initialState = assign({
  data: {},
  isLoading: false,
  message: '',
  metadata: {},
  receivedAt: Date.now(),
  status: 0
});

export const fileUpload = function(state = initialState, action) {
  let nextState = {};
  switch (action.type) {
    case 'REQUEST_FILE_UPLOAD':
      return assign(nextState, state, { isLoading: true });
    case 'RECIEVE_FILE_UPLOAD':
      if (action.data && action.data.fID) {
        return assign(nextState, state, action, { isLoading: false });
      }else {
        return assign(nextState, state, action, { message: '请求错误', isLoading: false });
      }
    default:
      return state;
  }
};
