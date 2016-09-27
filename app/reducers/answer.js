import assign from 'lodash.assign';
const initialState = assign({
  isLoading: false,
  currentItem: null,
  data: null,
  message: '',
  metadata: {},
  params: {},
  receivedAt: null,
  type: '',
  state: 0,
  comments: null,
  likeCount: 0
});

export const requestItem = function(state = initialState, action) {
  let nextState = {};
  switch (action.type) {
    case 'REQUEST_GET_REQUEST_BYID':
      return assign(nextState, state, { isLoading: true});
    case 'RECIEVE_GET_REQUEST_BYID':
      return assign(nextState, action, { data: null, currentItem: action.data, isLoading: false });
    case 'REQUEST_QUESTION_FAVOR':
      return assign(nextState, state, { isLoading: true });
    case 'RECIEVE_QUESTION_FAVOR':
      if(action.data.status === 204) {
        state.currentItem.likeCnt = state.currentItem.likeCnt - 1;
        state.likeCount = -1;
        state.currentItem.ilike = false;
      }
      if(action.data.ilike){
        state.currentItem.likeCnt = state.currentItem.likeCnt + 1;
        state.likeCount = 1;
        state.currentItem.ilike = true;
      }
      return assign(nextState, state, { isLoading: false });
    case 'REQUEST_COMMENT_UNLIKE':
      return assign(nextState, state, { isLoading: true });
    case 'RECIEVE_COMMENT_UNLIKE':
      if(action.status === 0) {
        let aid = action.params.aid;
        state.currentItem.comments.map(function(v, i) {
          if(v.answerID === aid) {
            v.dislikeCnt += 1;
            v.idislike = true;
          }
        });
      }
      return assign(nextState, state, action, { isLoading: false });
    default:
      return state;
  }
};
