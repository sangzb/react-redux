import React from 'react';
import { connect } from 'react-redux';
import selector from '../../selectors/apiSelector.js';
import UserInfoBar from '../../components/UserInfoBar/index.jsx';
import ImagesPanel from '../../components/ImagesPanel/index.jsx';
import cloneDeep from 'lodash/cloneDeep';
import { C } from '../../utils';
//utils
import { l, timeformat } from '../../utils';

import { getRequestAnswers, commentLike } from '../../actions/index.js';
//let headers = C('apiHeader');
let hasNewData = false;
let moreLink = '';
let that = null;
let answerHandler = null;
class RequestAnswer extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = { answers: [] };
    that = this;
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.param !== nextProps.param) {
      if (nextProps.param && nextProps.param.discussionID){
        const { dispatch, param } = nextProps;
        hasNewData = true;
        let url = 'discussion/' + param.discussionID + '/comments';
        dispatch(getRequestAnswers(url)());
      }else {
        this.setState({ answers: null });
      }
    }
    if(this.props.data !== nextProps.data) {
      if(nextProps.data && nextProps.data.hasMore) {
        moreLink = nextProps.data.links.more;
      }else {
        moreLink = '';
      }
      let answers = cloneDeep(this.state.answers);
      if (hasNewData) {
        hasNewData = false;
        answers = answers.concat((nextProps.data.comments || []));
        nextProps.endDispatch(moreLink);
      }
      this.setState({ answers });
    }

    if (this.props.isLoading !== nextProps.isLoading){
        this.props.setLoadingState(nextProps.isLoading);
        if (nextProps.message !== '数据获取成功') {
          this.props.loadingInfo({ isLoading: false, message: nextProps.message });
        }else {
          this.props.loadingInfo({ isLoading: false });
        }
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.data !== prevProps.data) {
      if ($('.ContentContainer').outerHeight() > document.documentElement.clientHeight) {
        if (answerHandler) {
          clearTimeout(answerHandler);
        }
        answerHandler = setTimeout(function() {
          $('.has-no-more').show();
        }, 500);
      }
    }
  }

  zan(obj, status) {
    const { dispatch, loadingInfo, location, user, userAuthority } = this.props;
    if (user.isSignedIn) {
      loadingInfo({ isLoading: true });
      dispatch(commentLike({
        targetType: 'Comment',
        targetID: obj.commentID.toString(),
        aid: obj.commentID,
        emotionType: status ? 1 : -1
      }));
    }else {
      userAuthority(user, dispatch, location);
    }
  }

  commentEvent(comment , index) {
    comment.rank = index;
    this.props.setComment.bind(this, comment)();
    this.props.comment();
  }

  render() {
    const { data, poster, param } = this.props;
    let avatar = require('./Icon-60@3x.png');
    let total = data.total || (data.comments && data.comments.length) || 0;
    let userId = null;
    let userName = null;
    if (poster && poster.userID){
      userId = poster.userID;
    }
    if (poster && poster.userName){
      userName = poster.userName;
    }
    return(
      <div>
        {
          (this.state.answers && this.state.answers.length) ? (
            <dl className='answerList'>
              {
                this.state.answers.map(function(v, i) {
                  let content = v.content || '';
                  if ((typeof v.content).toLocaleLowerCase() === 'string') {
                    content = content.split(String.fromCharCode(10));
                  }else {
                    if (content.text) {
                      content = content.text.split(String.fromCharCode(10));
                    }
                  }
                  let _time = timeformat((v.priority ? v.updateAt : v.createdAt));
                  return (
                    <dd key={'answer_' + i}>
                      <UserInfoBar active={v.active}
                                   avator={ (v.user && v.user.avatar) ? (v.user.avatar) : (avatar) }
                                   title={ (v.user && v.user.userName) ? (v.user.userName) : ('爸妈营用户')}
                                   anonymous={v.incognito}
                                   userId={v.user && v.user.userID}
                                   poster={v.user.userID === userId && v.user.userName === userName}
                                   postText={ (total - i) + ' 楼' } disabled={ (v.active ? false : true) }/>
                      {
                        v.active ? (
                          <div className='answerContent'>
                            {
                              content.map(function(v, i) {
                                return (<p key={'p_' + i}>{v}</p>);
                              })
                            }
                          </div>
                        ) : (
                          <p className='answerDelete'>
                            { '此条回复已被删除' }
                          </p>
                        )
                      }
                      {
                        v.active && v.content.user ? (
                          this.state.answers[isNaN(total - v.content.rank) ? 0 : (total - v.content.rank)] &&
                          this.state.answers[isNaN(total - v.content.rank) ? 0 : (total - v.content.rank)].active ?
                            <div className='quoteCon'>
                              <p className='innercon'>
                                <span className='avatar' style={{ backgroundImage: 'url('+ (v.content.user.avatar ? v.content.user.avatar : avatar) +')' }}></span>
                                <span className='name'>{v.content.user.userName}</span>
                                <span className='rank'>{v.content.rank + '楼'}</span>
                                {
                                  v.content && v.content.originText ?
                                    v.content.originText :
                                    ''
                                }
                              </p>

                            </div> :
                            <div className='quoteCon'>
                              {
                                '该引用内容已被原作者删除'
                              }
                            </div>
                        ) : ''
                      }
                      {
                        v.pics && v.pics.length ? <ImagesPanel pics={ v.pics } showImage={true} /> : ''
                      }
                      <section className='answerSection'>
                          <span className='datetime'>
                            { _time }
                          </span>

                          <span className={'down ' + (v.idislike ? 'hilight' : '')} onClick={
                            (v.idislike || v.ilike || v.active === false) ? (function() {}) : (this.zan.bind(this, v, false)) }>
                            {
                              v.dislikeCnt
                            }
                          </span>
                          <span className={'up ' + (v.ilike ? 'hilight' : '')} onClick={
                            (v.idislike || v.ilike || v.active === false) ? (function() {}) : (this.zan.bind(this, v, true)) }>
                            {
                              v.likeCnt
                            }
                          </span>
                          {
                            v.active === false ?
                              <span className='response' ></span> :
                              <span className='response' onClick={this.commentEvent.bind(this, v, (total - i))} ></span>
                          }
                      </section>
                    </dd>
                  );
                }, this)
              }
            </dl>
          ) : (
            param ? (
              param.topic === 'tucao' ?
                <p className='warnContainer'>一起吐吐槽，整个人都清爽了</p> :
                param.topic === 'idle' ?
                  <p className='warnContainer'>有兴趣，给我留言</p> :
                  param.topic === 'friend' ?
                    <p className='warnContainer'>给Ta一些鼓励吧</p> :
                    <p className='warnContainer'>帮助别人是一种快乐</p>
            ) :
              ''
          )
        }
      </div>
    );
  }
}
RequestAnswer.contextTypes = {
  router: React.PropTypes.object.isRequired
};
RequestAnswer.loadMore = function(url) {
  if (url.length > 0 && url !== 'nomore') {
    const { dispatch } = that.props;
    hasNewData = true;
    setTimeout(function() {
      dispatch(getRequestAnswers(url)());
    }, 1000);
  }
};
export default connect(selector('requestAnswer'))(RequestAnswer);

