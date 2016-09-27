import './style.scss';
import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

//action
import { uploadAnonymousAvatar, setUserInfo } from '../../actions';

let $ = window.jQuery;
let canSubmit = true;
class AnonymousPost extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  componentWillReceiveProps(nextProps) {
    let isSuccess = nextProps.message === '数据获取成功';
    const { anonymousUserInfo } = this.props;
    if (anonymousUserInfo.isLoading !== nextProps.anonymousUserInfo.isLoading) {
      if (!isSuccess) {
        this.props.loadingInfo({ isLoading: nextProps.anonymousUserInfo.isLoading, message: nextProps.message });
      }else {
        this.props.loadingInfo({ isLoading: nextProps.anonymousUserInfo.isLoading });
      }
    }
  }

  fileChangeFunc() {
    const { dispatch }  = this.props;
    let file = this.refs.uploader;
    if (file.files.length) {
      let data = new FormData();
      data.append('file', file.files[0]);
      dispatch(uploadAnonymousAvatar(data));
    }
  }

  submit() {
    canSubmit = false;
    let that = this;
    const { dispatch, anonymous, userInfo, location }  = this.props;
    let nickname = this.refs.nickname;
    if (!anonymous && userInfo.incognito) {
      setTimeout(function() {
        canSubmit = true;
        //dispatch(refreshUserInfo(response.params));
        that.context.router.goBack();
      }, 500);
    }else {
      if (nickname){
        if (nickname.value === '') {
          this.props.loadingInfo({ isLoading: false, message: '请输入匿名名称' });
          return;
        }
      }
      if (!anonymous){
        this.props.loadingInfo({ isLoading: false, message: '请设置头像' });
        return;
      }

      let param = {
        incognitoName: nickname ? nickname.value : userInfo.incognito.userName,
        incognitoAvatar: (anonymous && anonymous.docUrl) ? anonymous.docUrl : false
      };

      that.props.loadingInfo({ isLoading: true });
      dispatch(setUserInfo(param)).then(function(response) {
        if (response && response.status === 200) {
          that.props.loadingInfo({ isLoading: false, message: '匿名信息修改成功' });
          setTimeout(function() {
            canSubmit = true;
            //dispatch(refreshUserInfo(response.params));
            if (location.query.category){
              that.context.router.push({ pathname: '/form', query: {
                anonymous: 'on',
                type: location.query.category
              }, state: null });
            }else if(location.query.id) {
              that.context.router.push({ pathname: '/form', query: {
                anonymous: 'on',
                id: location.query.id
              }, state: null });
            }else{
              that.context.router.goBack();
            }
          }, 1000);
        }else {
          canSubmit = true;
          that.props.loadingInfo({ isLoading: false, message: '信息修改失败' });
        }
      });
    }
  }

  cancel() {
    let that = this;
    const { location } = this.props;
    setTimeout(function() {
      if (location.query.category){
        that.context.router.push({ pathname: '/form', query: {
          anonymous: 'off',
          type: location.query.category
        }, state: null });
      }else if(location.query.id) {
        that.context.router.push({ pathname: '/form', query: {
          anonymous: 'off',
          id: location.query.id
        }, state: null });
      }else{
        that.context.router.goBack();
      }
    }, 500);
  }
  focus(e) {
    let ele =e.currentTarget;
    ele.placeholder = '';
    $(ele).addClass('deepercolor');
  }
  blur(e) {
    let ele =e.currentTarget;
    ele.placeholder = '输入昵称';
    if (ele.value.length === 0){
      $(ele).removeClass('deepercolor');
    }
  }

  render() {
    const { type, userInfo, anonymous } = this.props;
    let avatar = false;
    let name = false;
    if (anonymous && anonymous.fID) {
      avatar = anonymous.thumb;
    }else if (userInfo && userInfo.incognito && userInfo.incognito.avatar && userInfo.incognito.avatar.length) {
      avatar = userInfo.incognito.avatar;
    }
    if (userInfo && userInfo.incognito && userInfo.incognito.userName && userInfo.incognito.userName.length) {
      name = userInfo.incognito.userName;
    }
    return (
      <div className={'anonymousCon'} style={{ display: type === 'user' ? 'block' : 'none' }}>
        <div className='anonymousForm'>
          <div className='title'>开启匿名后，对方只可见你匿名信息</div>
          <div className='formcontent'>
            <div className='anontmousAvatar' style={
              avatar ? ({ backgroundImage: `url(${avatar})` }) : ({})
            }>
              {
                <i className='refresh'></i>
              }
              <input  type='file' onChange={this.fileChangeFunc.bind(this)} ref='uploader'/>
            </div>
            {
              name ?
                <p className='anonymousName'>{name}</p> :
                <input
                  className='anonymousName'
                  type='text'
                  placeholder='输入昵称'
                  ref='nickname'
                  onFocus={this.focus.bind(this)}
                  onBlur={this.blur.bind(this)} />
            }
          </div>
          <div className='buttonCon'>
            <span className='button submit' onTouchEnd={this.submit.bind(this)}>
              确定
              <i className='split'></i>
            </span>
            <span className='button cancel' onTouchEnd={this.cancel.bind(this)}>取消</span>
          </div>
        </div>

      </div>
    );
  }
}

AnonymousPost.contextTypes = {
  router: React.PropTypes.object.isRequired
};

AnonymousPost.show = function() {
  $('.anonymousCon').show();
};

AnonymousPost.hide = function() {
  $('.anonymousCon').hide();
};


const anonymousAvatarSelector = function(state) {
  return state.userPage;
};

const AnonymousViewSelector = createSelector(
  [anonymousAvatarSelector],
  (anonymousUserInfo) => {
    return {
      anonymousUserInfo
    };
  }
);

export default connect(AnonymousViewSelector)(AnonymousPost);
