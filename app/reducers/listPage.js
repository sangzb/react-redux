import assign from 'lodash.assign';
const initialState = assign({
  scrollTop: 0,
  questions: [],
  moreLink: '',
  latest: [],
  popular: [],
  quickAnswer: [],
  isLoading: false,
  likeCnt: 0
});

export const listPage = function(state = initialState, action) {
  let nextState = {};
  let quickAnswer = [];
  switch (action.type) {
    case 'SET_MORE_LINK':
      return assign(nextState, state, { moreLink: action.moreLink });
    case 'SET_LISTPAGR_SCROLL':
      return assign(nextState, state, { scrollTop: action.scroll });
    case 'ADD_REQUEST_LIST':
      if (state[action.tabtype].length) {
        action.lists.map(function(v) {
          let tar = state[action.tabtype].filter(function(vv) {
            return vv.discussionID === v.discussionID;
          });
          if (!tar.length) {
            state[[action.tabtype]].push(v);
          }
        });
      }else {
        state[action.tabtype] = action.lists;
      }
      state[action.tabtype].map(function(v, i) {
        if (v.subject && v.subject.length > 40) {
          v.fold = true;
        }
        if (v.content && v.content.length > 105) {
          v.fold = true;
        }
        if (v.pics && v.pics.length > 3) {
          v.fold = true;
        }
      });

      return assign(nextState, state);
    case 'CLEAR_REQUEST_LIST':
      state.latest = [];
      state.popular = [];
      state.quickAnswer = [];
      return assign(nextState, state);
    case 'SET_ANSWER_AMOUNT' :
      state.questions.map(function(v) {
        if (v.discussionID === action.discussionID) {
          v.commentCnt++;
        }
      });
      state.latest.map(function(v) {
        if (v.discussionID === action.discussionID) {
          v.commentCnt++;
        }
      });
      state.popular.map(function(v) {
        if (v.discussionID === action.discussionID) {
          v.commentCnt++;
        }
      });
      return assign(nextState, state);
    case 'REQUEST_QUESTION_LIST_FAVOR':
      return assign(state, { isLoading: true });
    case 'RECIEVE_QUESTION_LIST_FAVOR':
      if (action.data.ilike || action.data.message === '数据获取成功'){
        state = assign({}, state);
        state.message = '数据获取成功';
        state.latest.map(function(v) {
          if (v.discussionID.toString() === action.params.targetID) {
            if (action.data.ilike) {
              v.likeCnt++;
              state.likeCnt++;
              v.ilike = true;
            }else {
              v.likeCnt--;
              state.likeCnt--;
              v.ilike = false;
            }
          }
        });
        state.popular.map(function(v) {
          if (v.discussionID.toString() === action.params.targetID) {
            if (action.data.ilike) {
              v.likeCnt++;
              state.likeCnt++;
              v.ilike = true;
            }else {
              v.likeCnt--;
              state.likeCnt--;
              v.ilike = false;
            }
          }
        });
      }else {
        state.message = '请求错误';
      }
      return assign(nextState, state, { isLoading: false });
    case 'REFRESH_QUICKANSWER_LIST':
      quickAnswer = state.quickAnswer.filter(function(v) {
        return v.discussionID !== action.discussionID;
      });
      state.quickAnswer = quickAnswer;
      return assign(nextState, state);
    default:
      return state;
  }
};
