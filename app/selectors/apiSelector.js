import { createSelector } from 'reselect';

export default function(selector) {
  const paramsSelector = state => state[selector].params;
  const dataSelector = state => state[selector].data;
  const metadataSelector = state => state[selector].metadata;
  const hasMoreSelector = state => state[selector].hasMore;
  const isLoadingSelector = state => state[selector].isLoading;
  const messageSelector = state => state[selector].message;

  return createSelector(
    paramsSelector,
    dataSelector,
    metadataSelector,
    hasMoreSelector,
    isLoadingSelector,
    messageSelector,
    (params, data, metadata, hasMore, isLoading, message) => {
      return {
        params,
        data,
        metadata,
        hasMore,
        isLoading,
        message
      };
    }
  );
}
