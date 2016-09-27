import assign from 'lodash.assign';
import { C } from '../utils';

// 提取 ID
function extractIds(items) {
  items = Array.isArray(items) ? items : [items];
  return items.map(function(item) {
    return item.id;
  });
}

// 只合并新元素
function smartConcat(ids, source, target, overwrite) {
  if (overwrite) return target;
  if (Array.isArray(source)) {
    var data = [].concat(source);
    var rest = [];
    var restIds = [];
    target.map(function(item) {
      if (!~ids.indexOf(item.id)) return data.push(item);
      rest.push(item);
      restIds.push(item.id);
    });

    return data.map(function(item) {
      var index = restIds.indexOf(item.id);
      if (~index) {
        return rest[index];
      } else {
        return item;
      }
    });
  } else {
    return target;
  }
}

export default function(apiConfig = {}) {
  const initialState = assign({
    isLoading: C('NO'),
    ids: [],
    data: [],
    hasMore: true,
    message: '',
    params: {},
    metadata: {}
  }, apiConfig.initialState);

  return function(state, action) {
    let overwrite;
    let currentPage;
    let data;
    let hasMore;

    switch (action.type) {
      case C(`REQUEST_${apiConfig.state}`):
        return assign({}, state, { isLoading: C('YES') });
      case C(`RECIEVE_${apiConfig.state}`): {
        overwrite = (action.params || {})._overwrite;
        currentPage = (action.metadata || {}).page || 1;
        data = smartConcat(
          state.ids,
          state.data,
          action.data,
          overwrite !== undefined ? overwrite : currentPage === 1
        );

        hasMore = function() {
          let newFetchedData = action.data || [];
          if (currentPage <= 1) {
            return true;
          } else {
            if (Array.isArray(newFetchedData)) {
              if (overwrite) {
                return true;
              } else {
                return !!newFetchedData.length && data.length !== state.data.length;
              }
            } else {
              return false;
            }
          }
        };

        return assign({}, state, {
          isLoading: C('NO'),
          data: data,
          hasMore: hasMore(),
          message: action.message,
          ids: extractIds(data),
          metadata: action.metadata,
          params: action.params
        });
      }
      default:
        return state || initialState;
    }
  };
}
