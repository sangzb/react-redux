import assign from 'lodash.assign';
const initialState = assign({
  isLoading: false,
  data: {},
  hasMore: false,
  message: '',
  metadata: {},
  params: {},
  receivedAt: null,
  type: '',
  state: 0
});

export const request = function(state = initialState, action) {
  let nextState = {};
  switch (action.type) {
    case 'REQUEST_GET_REQUEST_LIST':
    case 'REQUEST_GET_OTHERS_REQUEST_LIST':
    case 'REQUEST_GET_QUICKANSWER_LIST':
      return assign(nextState, state, { isLoading: true });
    case 'RECIEVE_GET_REQUEST_LIST':
    case 'RECIEVE_GET_OTHERS_REQUEST_LIST':
    case 'RECIEVE_GET_QUICKANSWER_LIST':
      return assign(nextState, action, { hasMore: action.data.hasMore, isLoading: false });
    default:
      return state;
  }
};
