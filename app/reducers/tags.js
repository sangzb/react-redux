import assign from 'lodash.assign';
const initialState = assign({
  metadata: null,
  tags: []
});

export const tagsPage = function(state = initialState, action) {
  let nextState = {};
  switch (action.type) {
    case 'TEST_DISPATCH':
      state.tags = [1 ,2 ,3, 4, 5];
      return Object.assign(nextState, state);
    default:
      return state;
  }
};