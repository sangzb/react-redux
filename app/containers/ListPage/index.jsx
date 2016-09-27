import './style.scss';
import React from 'react';
import cloneDeep from 'lodash/cloneDeep';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
//component
import ProcessCover from '../../components/ProcessCover';
import HeadCarousel from '../../components/HeadCarousel';
import QuestionList from '../../components/QuestionList';
import NavigatorBar from '../../components/NavigatorBar';
import LinkNavBar from '../../components/LinkNavBar';
import ShareHeader from '../../components/ShareHeader/';

import InfiniteScroll from '../../components/InfiniteScroll';
import LoadingMore from '../../components/LoadingMore';
import HasNoMore from '../../components/HasNoMore';
//utils
import { wechat, userAuthority, discussion } from '../../utils';
import assign from 'lodash.assign';
//action
import {
  getRequestList,
  getQuickAnsereList,
  setListPageScroll,
  pushRequestList,
  addMoreLink,
  clearRequestList,
  toptop
} from '../../actions/index.js';
//inner var
let category = 'question';
let wx = window.wx;
let $ = window.jQuery;
let that = null;
let moreHandler = null;
let shouldMore = false;
let requery = false;
class ContentPage extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      loadingInfo: {
        isLoading: false
      }
    };
    that = this;
  }

  componentWillMount() {
    const {location, listPage, dispatch } = this.props;
    category = discussion(location);
    console.log('moune')
    dispatch(toptop()).then(function(data){
      console.log(data);
    })
    //获取列表数据
    let type = location.query.type || 'latest';
    let data = listPage && listPage[type] ? listPage[type] : [];
    if (data.length === 0) {
      requery = true;
      $('html, body').animate({ scrollTop: 0 });
      this.dispatchListByType(location.query.type);
    }else {
      requery = false;
      $('body').css('opacity', 0);
    }
  }


  componentWillReceiveProps(nextProps) {
    let isSuccess = (nextProps.requestList.message === '数据获取成功');
    let listSuccess = (nextProps.listPage.message === '数据获取成功');
    if (this.props.requestList.isLoading !== nextProps.requestList.isLoading) {
      let _state = cloneDeep(this.state);
      this.setState(assign(_state, { loadingInfo: { isLoading: nextProps.requestList.isLoading, message: shouldMore } }));
    }

    if (this.props.listPage.isLoading !== nextProps.listPage.isLoading) {
      let _state = cloneDeep(this.state);
      if (listSuccess) {
        this.setState(assign(_state, {loadingInfo: { isLoading: nextProps.listPage.isLoading }}));
      }else {
        this.setState(assign(_state, {loadingInfo: { isLoading: false, message: nextProps.listPage.message }}));
      }
    }

    //求助列表数据错误
    if (this.props.requestList.message !== nextProps.requestList.message) {
      if (isSuccess) {
        this.setState({ error: false });
      }else {
        this.setState({ error: true });
      }
    }

    if (this.props.location.query.type !== nextProps.location.query.type || this.props.location.pathname !== nextProps.location.pathname) {
      ////切换type或category
      //重置列表页
      const { dispatch } = this.props;
      dispatch(clearRequestList(category));
      dispatch(addMoreLink(''));
      dispatch(setListPageScroll(0));
      category = discussion(location);
      this.dispatchListByType(nextProps.location.query.type);
    }

    // 添加新得到的求助帖
    if (this.props.requestList.data !== nextProps.requestList.data) {
      shouldMore = false;
      const { location, dispatch } = this.props;
      //设置更多数据的请求链接
      if (nextProps.listPage.moreLink !== 'nomore') {
        if (nextProps.requestList.data.links && nextProps.requestList.data.links.more) {
          let exist = false;
          nextProps.listPage[location.query.type === 'popular' ? 'popular' : 'latest'].map(function(v){
            if (~nextProps.requestList.data.links.more.indexOf('fromAnchor=' + v.discussionID)) {
              exist = true;
            }
          });
          if (!exist) {
            dispatch(addMoreLink(nextProps.requestList.data.links.more));
          }
        }else {
          dispatch(addMoreLink('nomore'));
        }
      }
      dispatch(pushRequestList(
        cloneDeep(nextProps.requestList.data.discussions ? nextProps.requestList.data.discussions : []),
        (location.query.type ? location.query.type : 'latest')
      ));
    }

    if (this.props.listPage.likeCnt !== nextProps.listPage.likeCnt){
      if (this.props.listPage.likeCnt > nextProps.listPage.likeCnt){
        this.setState({ loadingInfo: { isLoading: false, message: '取消关注' } });
      }else{
        this.setState({ loadingInfo: { isLoading: false, message: '关注成功' } });
      }
    }
  }

  loadMore(moreLink) {
    const { dispatch } = this.props;
    if (moreLink.length && moreLink !== 'nomore') {
      moreHandler = setTimeout(function() {
        shouldMore = true;
        dispatch(getRequestList(moreLink)());
      }, 1000);
    }
  }

  componentDidMount() {
    const { dispatch, route } = this.props;
    const { router } = this.context;
    router.setRouteLeaveHook(route, function() {
      dispatch(setListPageScroll($(window).scrollTop()));
    });
    wechat().then(function() {
      //微信分享
      let shareData = {
        title: '【爸妈营求助】专业育儿问答平台',
        desc: '可以在这里发起求助，解答别人的问题，与妈妈们交流经验，或者是吐槽心情',
        link: encodeURI(location.href),
        imgUrl: 'http://image.bamaying.com/p/assets/image/Icon180.png',
        type: 'link',
        dataUrl: '',
        success: function () {},
        cancel: function () {}
      };
      wx.ready(function () {
        wx.onMenuShareTimeline({
          title: shareData.title,
          link: shareData.link,
          imgUrl: shareData.imgUrl,
          success: shareData.success,
          cancel: shareData.cancel
        });
        wx.onMenuShareAppMessage(shareData);
      });
    });
    //返回按钮
    $('.gotoTop').unbind('click').click(function() {
      $(this).hide();
      $(window).scrollTop(0);
    });
    //详情页返回时是否显示返回顶部按钮
    if (requery === false) {
      const { listPage } = this.props;
      let st = listPage.scrollTop || 0;
      setTimeout(function() {
        $(window).scrollTop(st);
        if (st > 1000) {
          $('.gotoTop').show();
        }
        $('body').css('opacity', 1);
      }, 300);
    }
  }

  dispatchListByType(type) {
    const { dispatch, location } = this.props;
    let _type = type || location.query.type;
    switch (_type) {
      case 'popular':
        dispatch(getRequestList()({
          sort: 'popular',
          limit: 20
        }));
        break;
      case 'quickAnswer':
        dispatch(getQuickAnsereList()({
          limit: 20
        }));
        break;
      default:
        dispatch(getRequestList()({
          sort: 'new',
          limit: 20
        }));
        break;
    }
  }

  changeTab(type) {
    //重置列表数据
    const { location } = this.props;
    let thistype = location.query.type;
    thistype  = thistype || 'latest';
    if (type === thistype) {
      return;
    }else {
      this.context.router.push({
        pathname: category === 'question' ? '/' : ('/' + category),
        query: { type },
        state: null
      });
    }
  }

  gotoDetail(id) {
    if (window.clickable) {
      this.context.router.push({
        pathname: '/detail',
        query: { discussionID: id }
      });
    }
  }

  gotoTop() {
    const { dispatch } = this.props;
    dispatch(setListPageScroll(0));
  }

  setLoadingStatus() {
    this.setState({loadingInfo: {isLoading: true} });
  }

  render() {
    const { location, requestList, listPage, dispatch, user } = this.props;
    let type = location.query.type;
    type = type ? type : 'latest';
    let data = (listPage && listPage[type]) ? listPage[type] : [];
    let nodata = '好 啦，没 有 更 多 了 ';
    let isInfiniteLoading = requestList.isLoading;
    let hasMore = listPage.moreLink;
    let infiniteEnabled = hasMore === 'nomore' ? 0 : 50;
    return(
      <div>
        <div className='listContainer'>
          {
            location.query.from && (location.query.from === 'timeline' || location.query.from === 'singlemessage' || location.query.from === 'groupmessage') ?
              <ShareHeader /> :
              ''
          }
          <InfiniteScroll
            className='article-list'
            useWindowAsScrollContainer={true}
            infiniteLoadBeginEdgeOffset={ infiniteEnabled }
            isInfiniteLoading={ isInfiniteLoading }
            loadingSpinnerDelegate={<LoadingMore enabled={ !!infiniteEnabled && hasMore !== '' && hasMore !== 'nomore' }></LoadingMore>}
            onInfiniteLoad={ this.loadMore.bind(this, hasMore) } >
            {
              type !== 'quickAnswer' ? (
                <ul className='tab' >
                  <li className={(type === 'latest') ? 'active latest' : 'latest'}
                      onTouchStart={ this.changeTab.bind(this, 'latest') }>最新</li>
                  <li className={(type === 'popular') ? 'active popular' : 'popular'}
                      onTouchStart={ this.changeTab.bind(this, 'popular') }>最热</li>
                </ul>
              ) :
                <table className='quickHelpHead'>
                  <tr>
                    <td className='icon'></td>
                    <td>
                      <p className='p1'>求助还没回应</p>
                      <p className='p2'>这些爸妈在等你帮助......</p>
                    </td>
                  </tr>
                </table>
            }
            {
              (category !== 'complaint' && type !== 'quickAnswer') ? <HeadCarousel /> : ''
            }
            {
              (category !== 'complaint' && type !== 'quickAnswer') ? <LinkNavBar /> : ''
            }
            <div className='contentCon'>
              {
                this.state.error ? (
                  <p className='warnContainer'>获取数据列表失败,请刷新</p>
                ) : (
                  <QuestionList
                    data={data}
                    user={user}
                    userAuthority={userAuthority}
                    param={{ type,
                    dispatch,
                    location,
                    isLoading: requestList.isLoading,
                    setLoadingStatus: this.setLoadingStatus.bind(this),
                    gotoDetail: this.gotoDetail.bind(this) }} />
                )
              }
            </div>
            <HasNoMore hasMore={ hasMore } infoText={ nodata }></HasNoMore>
          </InfiniteScroll>
          <div className='gotoTop' onClick={this.gotoTop.bind(this)}></div>
        </div>
        <ProcessCover param={this.state.loadingInfo} />
        <NavigatorBar dispatch={dispatch} location={location} />
      </div>
    );
  }
}

ContentPage.contextTypes = {
  router: React.PropTypes.object.isRequired
};

const requestListSelector = function(state) {
  return state.request;
};
const listPageSelector = function(state) {
  return state.listPage;
};
const userSelector = function(state) {
  return state.user;
};

const ListPageSelector = createSelector(
  [requestListSelector, listPageSelector, userSelector],
  (requestList, listPage, user) => {
    return {
      requestList,
      listPage,
      user
    };
  }
);

export default connect(ListPageSelector)(ContentPage);
