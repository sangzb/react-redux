import assign from 'lodash.assign';
const initialState = assign({
  isLoading: false,
  data: {},
  message: '',
  metadata: {},
  params: {},
  receivedAt: null,
  type: ''
});

export const requestAnswer = function(state = initialState, action) {
  let nextState = {};
  switch (action.type) {
    case 'REQUEST_GET_REQUEST_ANSWER':
      return assign(nextState, state, { isLoading: true });
    case 'RECIEVE_GET_REQUEST_ANSWER':
      return assign(nextState, state, action, { isLoading: false });
    case 'REQUEST_COMMENT_LIKE':
      return assign(nextState, state, { isLoading: true });
    case 'RECIEVE_COMMENT_LIKE':
      if(action.data && (action.data.ilike || action.data.idislike)){
        state.message = '数据获取成功';
        let aid = action.params.aid;
        let emotionType = action.params.emotionType;
        state.data.comments.map(function(v, i) {
          if(v.answerID === aid || v.commentID === aid) {
            if (emotionType === 1) {
              v.likeCnt += 1;
              v.ilike = true;
              v.idislike = false;
            }else {
              v.dislikeCnt += 1;
              v.idislike = true;
              v.ilike = false;
            }
          }
        });
      }else {
        state.message = action.data.message;
      }
      return assign(nextState, state, { isLoading: false });
    default:
      return state;
  }
};
