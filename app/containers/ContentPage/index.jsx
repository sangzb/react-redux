import './style.scss';
import React from 'react';
import truncate from 'lodash/truncate';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { createSelector } from 'reselect';
//component
import UserInfoBar from '../../components/UserInfoBar/';
import ProcessCover from '../../components/ProcessCover/';
import ImagesPanel from '../../components/ImagesPanel/';
import AnswerPanel from '../../components/AnswerPanel/';
import ShareHeader from '../../components/ShareHeader/';

import InfiniteScroll from '../../components/InfiniteScroll';
import LoadingMore from '../../components/LoadingMore';
import HasNoMore from '../../components/HasNoMore';
//action
import {
  getRequestItem,
  requestFavor,
  questionListFavor,
  clearRequestList,
  addMoreLink,
  setCurrentComment,
  getUserInfo
} from '../../actions/';
//utils
import { wechat, timeformat, userAuthority } from '../../utils';
let that = null;
let wx = window.wx;
let showmessage = false;
let shareHandler = null;
class ContentPage extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      loadingInfo: {
        isLoading: false
      },
      loadingType: 'common'
    };
    //初始化更多数据链接
    this.more = '';
  }

  componentWillMount() {
    that = this;
    const { location, dispatch, user, userPage } = this.props;
    if (location.query.discussionID) {
      dispatch(getRequestItem(location.query.discussionID)());
    }else {
      this.context.router.push('/');
    }
    if (user.isSignedIn) {
      if (!userPage.userInfo) {
        dispatch(getUserInfo());
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    const { requestItem, likeCount, location } = this.props;
    if (requestItem.isLoading !== nextProps.requestItem.isLoading) {
      this.setState({
        loadingInfo: {
          isLoading: nextProps.requestItem.isLoading
        }
      });
    }

    if (requestItem.message !== nextProps.requestItem.message) {
      //不能请求到数据则跳转到首页
      if (nextProps.requestItem.message !== '' && nextProps.requestItem.message !== '数据获取成功') {
        //this.context.router.push('/');
      }else {
        this.setState({error: false});
      }
    }

    if (nextProps.likeCount && likeCount !== nextProps.likeCount && showmessage){
      showmessage = false;
      if (likeCount > nextProps.likeCount){
        this.setState({
          loadingInfo: { isLoading: false, message: '取消关注'}
        });
      }else{
        this.setState({
          loadingInfo: { isLoading: false, message: '关注成功'}
        });
      }
    }

    if (requestItem.currentItem !== nextProps.requestItem.currentItem || location.query !== nextProps.location.query) {
      let data = nextProps.requestItem.currentItem;
      //微信分享
      if (data) {
        wechat().then(function() {
          let shareData = {
            title: `【爸妈营求助】${data.subject}`,
            desc: truncate(data.content, { length: 200 }),
            link: encodeURI(`http://www.bamaying.com/wechat/discussion/detail?discussionID=${data.discussionID}`),
            imgUrl: (data.user && data.user.avatar) ? data.user.avatar : 'http://image.bamaying.com/p/assets/image/Icon180.png',
            type: 'link',
            dataUrl: '',
            success: function () {},
            cancel: function () {}
          };
          //微信分享
          if (shareHandler) {
            clearTimeout(shareHandler);
          }
          shareHandler = setTimeout(function() {
            wx.onMenuShareTimeline({
              title: shareData.title,
              link: shareData.link,
              imgUrl: shareData.imgUrl,
              success: shareData.success,
              cancel: shareData.cancel
            });
            wx.onMenuShareAppMessage(shareData);
          }, 500);

        });
      }
    }
  }

  componentDidMount() {
    //修改直接进入后退直接到首页的问题
    if (window.history.length === 1) {
      window.history.pushState(null, 'list detail', window.location.href);
    }
    const { route } = this.props;
    const { router } = this.context;
    router.setRouteLeaveHook(route, function() {
      $('.owl-carousel').empty().remove();
    });
    //返回按钮
    $('.gotoTop').unbind('click').click(function() {
      $(this).hide();
      $(window).scrollTop(0);
    });
  }

  answer(question, reset) {
    const { dispatch, location } = this.props;
    if (reset){
      dispatch(setCurrentComment(null));
    }
    if (location.query.from && (location.query.from === 'groupmessage' || location.query.from === 'timeline' || location.query.from === 'singlemessage')) {
      this.context.router.push({
        pathname: '/detail',
        query: { discussionID: question.discussionID },
        state: null
      });
      window.location.href = ('http://172.19.88.75:2995/wechat/discussion/form?id=' + question.discussionID);
    }else {
      this.context.router.push({
        pathname: '/form',
        query: { id: question.discussionID },
        state: null
      });
    }
  }

  clickFavor(data) {
    const { dispatch, location, user } = this.props;
    if (user.isSignedIn) {
      let type = 'post';
      if (data && data.ilike) {
        type = 'delete';
      }
      showmessage = true;
      //详情页收藏
      dispatch(requestFavor(type)({
        targetType: 'Discussion',
        targetID: data.discussionID.toString()
      }));
      //列表页收藏
      dispatch(questionListFavor(type)({
        targetType: 'Discussion',
        targetID: data.discussionID.toString()
      }));
    }else {
      userAuthority(user, dispatch, location);
    }
  }

  endDispatch(more) {
    if (more && more.length) {
      this.more = `discussion/${more.split('/discussion/')[1]}`;
    }else {
      this.more = 'nomore';
    }
    this.setState({
      loadingType: 'common'
    });
  }

  setLoadingState(isLoading) {
    this.isLoading = isLoading;
  }

  returnIndex() {
    const { dispatch, location } = this.props;
    dispatch(clearRequestList(location.pathname.indexOf('complaint') > 0 ? 'tucao' : 'general'));
    dispatch(addMoreLink(''));
  }

  refreshLoadingPanel(loadingInfo) {
    this.setState({ loadingInfo });
  }

  setCurrentComment(comment, index) {
    const { dispatch } = this.props;
    dispatch(setCurrentComment(comment, index));
  }

  render() {
    let avatar = require('./Icon-60@3x.png');
    const { requestItem, location, user, userPage } = this.props;
    let data = requestItem.currentItem;
    let userAvatar = userPage.userInfo && userPage.userInfo.avatar ? userPage.userInfo.avatar : require('./Icon-60@3x.png');
    let isLoading = requestItem.isLoading;
    let _time = '';
    if (data && data.createdAt){
      _time = timeformat(data.createdAt);
    }
    let anonymous = (data && data.incognito) ? data.incognito : false;
    let content = (data && data.content) ? data.content.split(String.fromCharCode(10)) : [''];
    let isInfiniteLoading = this.isLoading;
    let hasMore = this.more;
    let infiniteEnabled = hasMore === 'nomore' ? 0 : 50;
    let nodata = '暂 无 更 多 回 复';

    return(
      <div className='ContentContainer'>
        {
          location.query.from && (location.query.from === 'groupmessage' || location.query.from === 'timeline' || location.query.from === 'singlemessage') ?
            <ShareHeader /> :
            ''
        }
        <InfiniteScroll
          className='article-list'
          useWindowAsScrollContainer={true}
          infiniteLoadBeginEdgeOffset={ infiniteEnabled }
          isInfiniteLoading={ isInfiniteLoading }
          loadingSpinnerDelegate={<LoadingMore enabled={ !!infiniteEnabled && hasMore !== '' && hasMore !== 'nomore' }></LoadingMore>}
          onInfiniteLoad={ AnswerPanel.loadMore.bind(this, this.more) }>
            {
              this.state.error ?
                <p className='warnContainer'>数据请求失败,请刷新</p> :
                <div className='contentCon' ref='scrollcontainer'>
                  <div id='scroller'>
                    <dl className='listItem'>
                      {
                        data && data.user ?
                          <dd>
                            <UserInfoBar active={true}
                                         avator={(data.user && data.user.avatar) ? data.user.avatar : avatar}
                                         title={(data.user && data.user.userName) ? data.user.userName : '爸妈营用户'}
                                         anonymous={anonymous}
                                         userId={data.user && data.user.userID}
                                         postText={ data.commentCnt + (
                                          data.topic === 'general' ? '帮助' :
                                            data.topic === 'tucao' ? '评论' :
                                              data.topic === 'idle' ? '想要' : '留言'
                                         ) } />
                            <p className='postTitle'>
                              {
                                data.topic && data.subject && data.subject !== 'undefined' ?
                                  <label className={'label_type label_' + data.topic}>
                                    {
                                      data.topic === 'general' ? '求助' :
                                        (
                                          data.topic === 'tucao' ? '吐槽' : (
                                            data.topic === 'idle' ? '闲置' : '交友'
                                          )
                                        )
                                    }
                                  </label> :
                                  ''
                              }
                              <span>
                                {
                                  data.subject && data.subject !== 'undefined' ? data.subject : ''
                                }
                              </span>
                            </p>
                            <div className='postContent'>
                              {
                                content.map(function(v, i){
                                  return (<p key={'p_' + i}>{v}</p>);
                                })
                              }
                            </div>
                            {
                              data.pics && data.pics.length ? <ImagesPanel pics={data.pics} showImage={true} /> : ''
                            }
                            {
                              data.tagList && data.tagList.length ?
                                <p className='tagName'>
                                  {
                                    data.tagList.map(function(v) {
                                      return v.tagValue;
                                    })
                                  }
                                </p> : ''
                            }
                            <section className='bottomInfo'>
                              <span className='datetime'>
                                {_time}
                              </span>
                              <span className={'like ' + ((data && data.ilike) ? 'hilight' : '')}
                                    onClick={this.clickFavor.bind(this, data)}>
                                {data.likeCnt}
                              </span>
                            </section>
                          </dd>
                          : ''
                      }
                    </dl>
                    {
                      data && data.comments ? (
                        (data && data.comments && data.comments.length) ?
                          <p className='answerTip'>
                            { '以下为回复' }
                          </p> :
                          ''
                      ) :
                      isLoading ?
                        <p className='warnContainer'>正在加载</p> :
                        <p className='warnContainer'>原内容已被删除</p>
                    }
                    <AnswerPanel param={data}
                                 user={user}
                                 location={location}
                                 userAuthority={userAuthority}
                                 poster={(data && data.user) ? data.user : false}
                                 endDispatch={this.endDispatch.bind(this)}
                                 setLoadingState={this.setLoadingState.bind(this)}
                                 comment={this.answer.bind(this, data, false)}
                                 setComment={this.setCurrentComment.bind(this)}
                                 loadingInfo={this.refreshLoadingPanel.bind(this)} />
                    {
                      data && data.commentCnt ?
                        <HasNoMore hasMore={ hasMore } infoText={ nodata }></HasNoMore> :
                        ''
                    }
                    </div>
                </div>
            }
        </InfiniteScroll>
        <div className='gotoTop'></div>
        {
          data && data.user ? (
            <div className='buttonArea'>
              <span className='user' style={{ backgroundImage: 'url(' + userAvatar + ')'}}></span>
              <span className='helpBtn' onClick={this.answer.bind(this, data, true)}>
                {
                  data.topic === 'general' ? '我来帮助Ta...' :
                    data.topic === 'tucao' ? '我想评论一下...' :
                      data.topic === 'idle' ? '给Ta留个言...' :
                        '给Ta留个言...'
                }
              </span>
              <span className='homeBtn'>
                <Link className='home' to={{ pathname: '/' }} onTouchStart={this.returnIndex.bind(this)}>
                主页
                </Link>
              </span>
              <span className={'favorBtn ' + ((data && data.ilike) ? 'hilight' : '')} onClick={this.clickFavor.bind(this, data)}>
                关注
              </span>
            </div>
          ) : ('')
        }
        <ProcessCover param={this.state.loadingInfo} />
      </div>
    );
  }
}

ContentPage.contextTypes = {
  router: React.PropTypes.object.isRequired
};

const requestItemSelector = function(state) {
  return state.requestItem;
};
const currentItemSelector = function(state) {
  return state.requestItem.currentItem;
};
const likeCountSelector = function(state) {
  return state.requestItem.likeCount;
};
const userSelector = function(state) {
  return state.user;
};
const userPageSelector = function(state) {
  return state.userPage;
};

const ContentPageSelector = createSelector(
  [requestItemSelector, currentItemSelector, likeCountSelector, userSelector, userPageSelector],
  (requestItem, currentItem, likeCount, user, userPage) => {
    return {
      requestItem,
      currentItem,
      likeCount,
      user,
      userPage
    };
  }
);

export default connect(ContentPageSelector)(ContentPage);
