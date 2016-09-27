import './style.scss';
import React from 'react';
import UserInfoBar from '../../components/UserInfoBar';
import ImagesPanel from '../../components/ImagesPanel';
//utils
import { timeformat } from '../../utils';
//action
import { questionListFavor } from '../../actions';
let avatar = require('./Icon-60@3x.png');
let $ = window.jQuery;
let showDetailHandler = null;
let startTouch = 0;
let clickble = true;
export default class QuestionList extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = { };
  }

  clickFavor(qid, ifavorite, e) {
    e.stopPropagation();
    e.preventDefault();
    const { user, userAuthority } = this.props;
    const { dispatch, location } = this.props.param;
    if (user.isSignedIn) {
      let type = 'post';
      if (ifavorite) {
        type = 'delete';
      }
      this.props.param.setLoadingStatus();
      dispatch(questionListFavor(type)({
        targetType: 'Discussion',
        targetID: qid.toString()
      }));
    }else {
      userAuthority(user, dispatch, location);
    }
  }

  componentDidUpdate() {
    $('.listItem .postContent').each(function(i, v) {
      let tar = $(v);
      let content = tar.html();
      content = content.split(String.fromCharCode(10)).join('<br />');
      tar.html(content);
    });
  }

  render() {
    const { data, param } = this.props;
    let location = param.location;
    return(
      <dl className='listItem'>
        {
          data.length ? (
            data.map(function(v, i) {
              let _time = timeformat((v.priority ? v.updateAt : v.createdAt));
              let _topic = '帮助';
              switch (v.topic) {
                case 'tucao':
                  _topic = '评论';
                  break;
                case 'idle':
                  _topic = '想要';
                  break;
                case 'friend':
                  _topic = '留言';
                  break;
                default:
                  _topic = '帮助';
                  break;
              }

              if (v){
                return (
                  <dd className={ (v.fold && !v.showDetail) ? 'summaryContent' : ''}
                      key={ 'listitem_' + i }
                      onClick={param.gotoDetail.bind(this, v.discussionID)}>
                    <UserInfoBar active={true}
                                 avator={ (v.user && v.user.avatar) ? v.user.avatar : avatar }
                                 title={ (v.user && v.user.userName) ? v.user.userName : '爸妈营用户' }
                                 anonymous={v.incognito}
                                 userId={v.user && v.user.userID}
                                 postText={ v.commentCnt + ' ' +  _topic } />
                    <p className='postTitle'>
                      {
                        v.topic && v.subject && v.subject !== 'undefined' ?
                          <label className={'label_type label_' + v.topic}>
                            {
                              v.topic === 'general' ? '求助' :
                                (
                                  v.topic === 'tucao' ? '吐槽' : (
                                    v.topic === 'idle' ? '闲置' : '交友'
                                  )
                                )
                            }
                          </label> :
                          ''
                      }
                      <span>
                        {v.subject && v.subject !== 'undefined' ? v.subject : ''}
                      </span>
                    </p>
                    <p className='postContent'>
                      {

                        (v.fold && !v.showDetail) ? (
                          v.content && v.content.length > 0 ? (
                            v.content.length < 105 ? v.content : (v.content.substr(0, 105) + '......')
                        ) : '') : (v.content)
                      }
                    </p>
                    {
                      v.fold ? (
                        <p className='showDetail'>查看全文</p>
                      ) : ''
                    }

                    {
                      (v.pics && v.pics.length) ? (
                        <ImagesPanel pics={ v.pics } limit={3} />
                      ) :('')
                    }
                    <section className={'bottomInfo ' + (v.fold && !v.showDetail ? '' : 'paddingbottom')}>
                      <span className='datetime'>
                        {
                          _time
                        }
                      </span>
                      <span className={'like ' + ((v && v.ilike) ? 'hilight' : '')}
                            onTouchTap={this.clickFavor.bind(this, v.discussionID, v.ilike)}>
                        {v.likeCnt}
                      </span>
                    </section>
                  </dd>
                );
              }else {
                return ('');
              }
            }, this)
          ) : (
            param.isLoading ?
              <p className='warnContainer'>
                {
                  `正 在 加 载 ${location.pathname.indexOf('complaint') > 0 ? '吐 槽' : '求 助'}`
                }
              </p> :
              <p className='warnContainer'>
                {
                  `没有${location.pathname.indexOf('complaint') > 0 ? '吐 槽' : '求 助'}`
                }
                </p>
          )
        }
      </dl>
    );
  }
}

QuestionList.contextTypes = {
  router: React.PropTypes.object.isRequired
};
