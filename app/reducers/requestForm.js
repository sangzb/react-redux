import assign from 'lodash.assign';
const initialState = assign({
  isLoading: false,
  pics: [],
  data: {},
  message: '数据获取成功',
  metadata: {},
  params: {},
  receivedAt: null,
  type: '',
  isPost: false,
  comment: null,
  history: {
    answer: { id: '', content: '' },
    question: { title: '', content: '' },
    complaint: { title: '', content: '' },
    idle: { title: '', content: '' },
    friend: { title: '', content: '' }
  }
});

export const requestForm = function(state = initialState, action) {
  let nextState = {};
  switch (action.type) {
    case 'REQUEST_QUESTION_CONTENT':
      return assign(nextState, state, { isLoading: true });
    case 'RECIEVE_QUESTION_CONTENT':
      if (action.data.discussionID) {
        action.data.message = '数据获取成功';
      }else {
        action.data.message = '请求失败';
      }
      return assign(nextState, state, action, { message: action.data.message }, { isLoading: false });
    case 'REQUEST_ANSWER_CONTENT':
      return assign(nextState, state, { isLoading: true });
    case 'RECIEVE_ANSWER_CONTENT':
      if (action.data.answerID || action.data.commentID) {
        action.data.message = '数据获取成功';
      }else {
        action.data.message = '请求失败';
      }
      return assign(nextState, state, action, { message: action.data.message }, { isLoading: false });
    case 'ADD_UPDATE_PICTRUE':
      action.data.map(function(v) {
        state.pics.push(v);
      });
      return assign(nextState, state);
    case 'REMOVE_UPDATE_PICTRUE':
      state.pics = state.pics.filter(function(v) {
        return (v.fID !== action.pid);
      });
      return assign(nextState, state);
    case 'REMOVE_ALL_PICTRUE':
      state.pics = [];
      return assign(nextState, state);
    case 'SET_CURRENT_COMMENT':
      state.comment = action.comment;
      return assign(nextState, state);
    case 'FORM_TITLE_HISTORY':
      if (action.param.id) {
        state.history.answer = { id: action.param.id, content: action.param.content };
      }else {
        state.history[action.param.cate].title = action.param.content;
      }
      return assign(nextState, state);
    case 'FORM_CONTENT_HISTORY':
      if (action.param.id) {
        state.history.answer = { id: action.param.id, content: action.param.content };
      }else {
        state.history[action.param.cate].content = action.param.content;
      }
      return assign(nextState, state);
    case 'FORM_RESET_HISTORY':
      if (action.cate === 'answer') {
        state.history.answer = { id: '', content: ''};
      }else {
        state.history[action.cate] = { title: '', content: ''};
      }
      state.pics = [];
      return assign(nextState, state);
    default:
      return state;
  }
};
