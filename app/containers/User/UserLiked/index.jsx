import '../style.scss';
import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import cloneDeep from 'lodash/cloneDeep';
import assign from 'lodash.assign';
import ProcessCover from '../../../components/ProcessCover';
import NavigatorBar from '../../../components/NavigatorBar';
import InfiniteScroll from '../../../components/InfiniteScroll';
import LoadingMore from '../../../components/LoadingMore';
import HasNoMore from '../../../components/HasNoMore';
import { timeformat, userAuthority } from '../../../utils';
//action
import { getOwnerLikedList, userDeleteFavor, removeUserLikedList } from '../../../actions';
//inner var
let that = null;
let scroll = null;
let clickble = true;
let startTouch = 0;
let moreHandler = null;
let shouldMore = false;
class UserLiked extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      loadingType: 'common',
      loadingInfo: {
        isLoading: false
      }
    };
  }

  componentWillMount() {
    that = this;
    const { dispatch, user, location } = this.props;
    if (user.isSignedIn) {
      dispatch(removeUserLikedList());
      dispatch(getOwnerLikedList()({
        targetType: 'Discussion'
      }));
    }else {
      userAuthority(user, dispatch, location);
    }
  }

  componentWillReceiveProps(nextProps) {
    let isSuccess = nextProps.userLiked.message === '数据获取成功';
    if (this.props.userLiked.isLoading !== nextProps.userLiked.isLoading) {
      let _state = cloneDeep(this.state);
      this.setState(assign(_state, { loadingInfo: { isLoading: nextProps.userLiked.isLoading, message: shouldMore } }));
      shouldMore = false;
    }
    if (this.props.userLiked.message !== nextProps.userLiked.message) {
      if (isSuccess) {
        this.setState({ error: false });
      }else {
        this.setState({ error: true });
      }
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.userLiked.liked !== prevProps.userLiked.liked) {
      setTimeout(function() {
        if (scroll) {
          scroll.refresh();
        }
      }, 1000);
    }
  }

  gotoDetail(id) {
    this.context.router.push({
      pathname: '/detail',
      query: { discussionID: id }
    });
  }

  deleteFavor(id, e) {
    e.stopPropagation();
    e.preventDefault();
    const { dispatch } = this.props;
    dispatch(userDeleteFavor({
      targetType: 'Discussion',
      targetID: id.toString()
    }));
  }

  loadMore(moreLink) {
    const { dispatch } = this.props;
    if (moreHandler) {
      clearTimeout(moreHandler);
    }
    if (moreLink.length && moreLink !== 'nomore') {
      moreHandler = setTimeout(function() {
        shouldMore = true;
        dispatch(getOwnerLikedList(moreLink)());
      }, 500);
    }
  }

  render() {
    const { dispatch, location, userLiked } = this.props;
    let liked = userLiked.liked || [];
    let isInfiniteLoading = userLiked.isLoading;
    let hasMore = userLiked.links && userLiked.links.more ? userLiked.links.more : 'nomore';
    let infiniteEnabled = hasMore === 'nomore' ? 0 : 50;
    let nodata = '暂无更多数据';
    return (
      <div className='userLikedCon'>
        <div className='content' style={{ paddingBottom: 50 }}>
          <InfiniteScroll
            className='article-list'
            useWindowAsScrollContainer={true}
            infiniteLoadBeginEdgeOffset={ infiniteEnabled }
            isInfiniteLoading={ isInfiniteLoading }
            loadingSpinnerDelegate={<LoadingMore enabled={ !!infiniteEnabled && hasMore !== 'nomore' }></LoadingMore>}
            onInfiniteLoad={ this.loadMore.bind(this, hasMore) }>
              {
                this.state.error ? (
                  <p className='warnContainer'>获取求助列表失败,请刷新</p>
                ) : (
                  <dl className='postedList marginTop'>
                    {
                      liked.length ? (
                        liked.map(function (v, i) {
                          return (
                            <dd key={'userliked_' + i} onClick={this.gotoDetail.bind(this, v.discussionID)}>
                              <p className='title'>
                                {
                                  v.subject
                                }
                              </p>
                              <p className='datetime'>
                                <span>
                                  {
                                    timeformat(v.createdAt, true)
                                  }
                                </span>
                                <span className='deletebtn' onClick={this.deleteFavor.bind(this, v.discussionID)}>
                                  删除
                                </span>
                              </p>
                            </dd>
                          );
                        }, this)
                      ) : (
                        userLiked.isLoading ? (
                          <div className='warnContainer'>
                            {' 正 在 加 载 关 注 '}
                          </div>
                        ) : (
                          <div className='warnContainer'>
                            {' 暂 无 关 注 '}
                          </div>
                        )
                      )
                    }
                  </dl>
                )
              }
            <HasNoMore hasMore={ hasMore } infoText={ nodata }></HasNoMore>
          </InfiniteScroll>
        </div>
        <ProcessCover param={this.state.loadingInfo} />
        <NavigatorBar dispatch={dispatch} location={location}/>
      </div>
    );
  }
}

UserLiked.contextTypes = {
  router: React.PropTypes.object.isRequired
};

const userLikedSelector = function(state) {
  return state.userPage;
};
const userSelector = function(state) {
  return state.user;
};

const UserLikedSelector = createSelector(
  [userLikedSelector, userSelector],
  (userLiked, user) => {
    return {
      userLiked,
      user
    };
  }
);

export default connect(UserLikedSelector)(UserLiked);
