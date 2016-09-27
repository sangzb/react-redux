import assign from 'lodash.assign';
const initialState = assign({
  data: {},
  status: 0,
  message: ''
});

export const helperRank = function(state = initialState, action) {
  let nextState = {};
  switch (action.type) {
    case 'REQUEST_HELPER_RANK_LIST':
      return  assign(nextState, state, { isLoading: true });
    case 'RECIEVE_HELPER_RANK_LIST':
      return  assign(nextState, state, action, { isLoading: false });
    default:
      return state;
  }
};