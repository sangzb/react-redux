import '../style.scss';
import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import cloneDeep from 'lodash/cloneDeep';
import assign from 'lodash.assign';
import ProcessCover from '../../../components/ProcessCover';
import UserPostedComponent from './Question.jsx';
import UserAnsweredComponent from './Answered.jsx';
import NavigatorBar from '../../../components/NavigatorBar';
import ConfirmPopup from '../../../components/ConfirmPopup';
import InfiniteScroll from '../../../components/InfiniteScroll';
import LoadingMore from '../../../components/LoadingMore';
import HasNoMore from '../../../components/HasNoMore';
import { userAuthority, discussion } from '../../../utils';
//action
import {
  getOwnerRequestLst,
  getOwnerAnsweredList,
  removeUserQuestionList,
  removeUserAnsweredList,
  deleteComment,
  deletePost
} from '../../../actions';
//inner var
let type = 'question';
let category = 'question';
let moreHandler = null;
let shouldMore = false;
class UserPosted extends React.Component {
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
    const { user, dispatch, location } = this.props;
    if (user.isSignedIn) {
      if (location.query.type) {
        type = location.query.type;
      }
      category = discussion(location);
      dispatch(removeUserQuestionList());
      dispatch(removeUserAnsweredList());
      this.getQuestions();
    }else {
      userAuthority(user, dispatch, location);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.isLoading !== nextProps.isLoading) {
      let _state = cloneDeep(this.state);
      this.setState(assign(_state, { loadingInfo: { isLoading: nextProps.isLoading, message: shouldMore } }));
      shouldMore = false;
    }

    if (this.props.location.query.type !== nextProps.location.query.type) {
      type = nextProps.location.query.type ? nextProps.location.query.type : 'question';
      const { dispatch } = this.props;
      ////切换tab
      dispatch(removeUserQuestionList());
      dispatch(removeUserAnsweredList());
      this.getQuestions();
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.userQuestion !== prevProps.userQuestion || this.props.userAnswered !== prevProps.userAnswered) {
      if ($('.userQuestionCon').outerHeight() > document.documentElement.clientHeight) {
        $('.has-no-more').show();
      }
    }
  }

  getQuestions() {
    const { dispatch, location } = this.props;
    let _topic = 'general';
    switch (discussion(location)) {
      case 'complaint':
        _topic = 'tucao';
        break;
      case 'friend':
        _topic = 'friend';
        break;
      case 'idle':
        _topic = 'idle';
        break;
      default:
        _topic = 'general';
    }
    if (type === 'answered') {
      dispatch(getOwnerAnsweredList()({
        topic: _topic,
        limit: 10
      }));
    }else {
      dispatch(getOwnerRequestLst()({
        topic: _topic,
        limit: 10
      }));
    }
  }

  gotoDetail(id) {
    const { location } = this.props;
    this.context.router.push({
      pathname: '/detail',
      query: { discussionID: id }
    });
  }

  deletePost(id, e) {
    const { dispatch } = this.props;
    e.preventDefault();
    e.stopPropagation();
    ConfirmPopup.show(function(){
      dispatch(deletePost(id)({ id }));
    });
  }

  deleteComment(id, e) {
    const { dispatch } = this.props;
    e.preventDefault();
    e.stopPropagation();
    ConfirmPopup.show(function(){
      dispatch(deleteComment(id)({ id }));
    });
  }

  changeTab(type) {
    //重置列表数据
    const { location } = this.props;
    this.context.router.push({
      pathname: `/user/${discussion(location)}`,
      query: { type },
      state: null
    });
  }

  loadMore(moreLink) {
    const { dispatch } = this.props;
    if (moreHandler) {
      clearTimeout(moreHandler);
    }
    if (moreLink.length && moreLink !== 'nomore') {
      moreHandler = setTimeout(function() {
        shouldMore = true;
        if (type === 'answered') {
          dispatch(getOwnerAnsweredList(moreLink)());
        }else {
          dispatch(getOwnerRequestLst(moreLink)());
        }
      }, 1000);
    }
  }

  render() {
    const { dispatch, location, userQuestion, userAnswered, isLoading, links } = this.props;
    let category = discussion(location);
    let type = location.query.type === 'answered' ? 'answered' : 'question';
    let isInfiniteLoading = isLoading;
    let hasMore = links && links.more ? links.more : 'nomore';
    let infiniteEnabled = hasMore === 'nomore' ? 0 : 50;
    let nodata = '暂无更多数据';
    return (
      <div className='userQuestionCon'>
        <div className='content' style={{ paddingBottom: 51 }}>
          <InfiniteScroll
            className='article-list'
            useWindowAsScrollContainer={true}
            infiniteLoadBeginEdgeOffset={ infiniteEnabled }
            isInfiniteLoading={ isInfiniteLoading }
            loadingSpinnerDelegate={<LoadingMore enabled={ !!infiniteEnabled && hasMore !== 'nomore' }></LoadingMore>}
            onInfiniteLoad={ this.loadMore.bind(this, hasMore) }>
              <ul className='userTab' >
                <li className={(type === 'question') ? 'active latest' : 'latest'}
                    onTouchEnd={this.changeTab.bind(this, 'question')} >
                  {
                    category === 'question' ? '求助' : ( category === 'complaint' ? '吐槽' : (category === 'friend' ? '交友' : '闲置') )
                  }
                </li>
                <li className={(type === 'answered') ? 'active popular' : 'popular'}
                    onTouchEnd={this.changeTab.bind(this, 'answered')} >
                  {
                    category === 'question' ? '帮助' : ( category === 'complaint' ? '评论' : (category === 'friend' ? '留言' : '想要') )
                  }
                </li>
              </ul>
              {
                type === 'question' ? (
                  <UserPostedComponent
                    discussions={userQuestion}
                    isLoading={isLoading}
                    category={category}
                    touchend={this.gotoDetail.bind(this)}
                    deletePost={this.deletePost.bind(this)}
                  />
                ) : (
                  <UserAnsweredComponent
                    answers={userAnswered}
                    isLoading={isLoading}
                    category={category}
                    touchend={this.gotoDetail.bind(this)}
                    deleteComment={this.deleteComment.bind(this)}
                  />
                )
              }
            <HasNoMore hasMore={ hasMore } infoText={ nodata }></HasNoMore>
          </InfiniteScroll>
        </div>
        <ConfirmPopup />
        <ProcessCover param={this.state.loadingInfo} />
        <NavigatorBar dispatch={dispatch} location={location}/>
      </div>
    );
  }
}

UserPosted.contextTypes = {
  router: React.PropTypes.object.isRequired
};

const userQuestionSelector = function(state) {
  return state.userPage.discussions;
};
const userAnsweredSelector = function(state) {
  return state.userPage.answered;
};
const userQuestionLinksSelector = function(state) {
  return state.userPage.links;
};
const userQuestionMessageSelector = function(state) {
  return state.userPage.message;
};
const userIsLoadingSelector = function(state) {
  return state.userPage.isLoading;
};
const userSelector = function(state) {
  return state.user;
};

const UserQuestionSelector = createSelector(
  [userQuestionSelector, userAnsweredSelector, userQuestionLinksSelector, userQuestionMessageSelector, userIsLoadingSelector, userSelector],
  (userQuestion, userAnswered, links, message, isLoading, user) => {
    return {
      userQuestion,
      userAnswered,
      links,
      message,
      isLoading,
      user
    };
  }
);

export default connect(UserQuestionSelector)(UserPosted);
