import './style.scss';
import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import truncate from 'lodash/truncate';
//utils
import { wechat, owlAdapter, userAuthority } from '../../utils';
import iScroll from 'iscroll';
//component
import ProcessCover from '../../components/ProcessCover';
import SwitchButton from '../../components/SwitchButton';
import ShareHeader from '../../components/ShareHeader/';
//action
import {
  getRequestItem,
  addUpdatePicutre,
  removeUpdatePicutre,
  uploadFile,
  postAnswerContent,
  postRequestContent,
  clearPicutre,
  setAnswerAmount,
  getUserInfo,
  clearRequestList,
  addMoreLink,
  setListPageScroll,
  titleHistory,
  contentHistory,
  resetHistory,
  refreshQucickAnswerList,
  tagPermission,
  removeTagChoice
} from '../../actions/index';
let canSubmit = true;
let wx = window.wx;
let that = null;
//发帖/回复类型
let formType = 0;
let scrollOption = {
  shrinkScrollbars: 'clip',
  mouseWheel: true,
  click: true
};
class PostForm extends React.Component {
  constructor(props, context) {
    super(props, context);
    let type = props.location.query.type || 'question';
    this.state = { pics: [], loadingInfo: { isLoading: false }, ss: false, type };
    this.removePics = this.removePics.bind(this);
    this.fileChangeFunc = this.fileChangeFunc.bind(this);
    that = this;
  }

  componentWillMount() {
    //user userAuthority
    const { dispatch, location, user } = this.props;
    let shareData = {
      title: '发一个爸妈营求助帖',
      desc: '发一个爸妈营求助帖',
      link: encodeURI(window.location.href),
      imgUrl: 'http://image.bamaying.com/p/assets/image/Icon180.png',
      type: 'link',
      dataUrl: '',
      success: function () {},
      cancel: function () {}
    };
    dispatch(clearPicutre());
    if (user.isSignedIn) {
      if (location.query.id) {
        //获取帖子数据,微信分享
        dispatch(getRequestItem(location.query.id)()).then(function(data) {
          wechat().then(function() {
            shareData.title = data.subject;
            shareData.desc = data.content;
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
        });
        formType = 1;
      }else {
        wechat().then(function() {
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
      }
      dispatch(getUserInfo());
    }else {
      userAuthority(user, dispatch, location);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { uploadFiles, requsetForm, currentItem } = this.props;
    let imageSuccess = nextProps.uploadFiles.message === '数据获取成功';
    let formSuccess = nextProps.requsetForm.message === '数据获取成功';
    if (uploadFiles.isLoading !== nextProps.uploadFiles.isLoading) {
      this.setState({ loadingInfo: { isLoading: nextProps.uploadFiles.isLoading } });
    }
    if (requsetForm.isLoading !== nextProps.requsetForm.isLoading) {
      this.setState({ loadingInfo: { isLoading: nextProps.requsetForm.isLoading } });
    }
    if (currentItem !== nextProps.currentItem) {
      formType = nextProps.currentItem;
    }
    //上传图片成功后刷新显示
    if (imageSuccess && uploadFiles.data !== nextProps.uploadFiles.data) {
      const { dispatch } = this.props;
      if (nextProps.uploadFiles.data && nextProps.uploadFiles.data.fID) {
        this.files.push(nextProps.uploadFiles.data);
        this.fileIndex = this.fileIndex + 1;
        let file = this.refs.uploader;
        if (file.files.length > this.fileIndex) {
          let data = new FormData();
          data.append('file', file.files[this.fileIndex]);
          dispatch(uploadFile(data));
        }else {
          dispatch(addUpdatePicutre(this.files));
          this.fileIndex = 0;
        }
      }
    }
    //上传图片错误
    if (!imageSuccess) {
      this.setState({
        loadingInfo: {
          isLoading: false,
          message: nextProps.uploadFiles.message
        }
      });
    }

    //提交表单后跳转到前一个界面
    if (formSuccess && (requsetForm.data !== nextProps.requsetForm.data)) {
      const { location, dispatch } = this.props;
      if (this.props.location.query.id) {
        that.setState({ loadingInfo: { isLoading: false, message: '回复成功', fresh: true } });
        setTimeout(function() {
          canSubmit = true;
          //重置记录
          dispatch(resetHistory('answer'));
          //更新回答次数
          that.props.dispatch(setAnswerAmount(that.props.currentItem.discussionID));
          //刷新0回复列表
          that.props.dispatch(refreshQucickAnswerList(that.props.currentItem.discussionID));
          that.context.router.goBack();
        }, 500);
      }else {
        this.setState({ loadingInfo: { isLoading: false, message: '发布成功', fresh: true } });
        let category = location.query.type === 'complaint' ? 'complaint' : '';
        let cate = location.query.type || 'question';
        //重置列表页
        dispatch(clearRequestList(category));
        dispatch(addMoreLink(''));
        dispatch(setListPageScroll(0));
        dispatch(resetHistory(cate));
        dispatch(removeTagChoice());
        setTimeout(function() {
          canSubmit = true;
          that.context.router.push({
            pathname: `/`,
            query: { type: 'latest' } ,
            state: null
          });
        }, 500);
      }
    }

    //提交表单错误
    if (!formSuccess) {
      this.setState({
        loadingInfo: {
          isLoading: false,
          message: nextProps.requsetForm.message
        }
      });
      canSubmit = true;
    }

    //获得更新信息
    if (this.props.userInfo !== nextProps.userInfo){
      const { userInfo, location } = this.props;
      let anony = location.query.anonymous;
      if (!anony){
        anony = 'off';
      }
      if (location.query.id) {
        this.switchStatus(false);
      }else{
        if (userInfo.userInfo){
          if (anony === 'on'){
            this.switchStatus(true);
          }else{
            this.switchStatus(false);
          }
        }
      }
    }
  }

  componentDidMount() {
    const { location, requsetForm } = this.props;
    if (location.query.id) {
      this.refs.contentElement.focus();

    }else {
      this.refs.titleElement.focus();
    }
    //填充记录
    if (location.query.id) {
      if (location.query.id.toString() === requsetForm.history.answer.id.toString()) {
        $('form textarea').val(requsetForm.history.answer.content);
      }
    }else {
      let cate = location.query.type || 'question';
      //title
      $('form textarea').val(requsetForm.history[cate].content);
      //content
      $('.headPart input[type=text]').val(requsetForm.history[cate].title);
    }

    if (!location.query.id) {
      if (location.query.title) {
        this.refs.titleElement.value = decodeURIComponent(location.query.title ? location.query.title : '');
      }
    }
  }

  removePics(pid, e) {
    this.stopEvent(e);
    const { dispatch } = this.props;
    if (pid) {
      dispatch(removeUpdatePicutre(pid));
    }
  }

  submit() {
    let title = this.refs.titleElement;
    let content = this.refs.contentElement;
    let { location, dispatch, requsetForm, comment, tags, currentItem } = this.props;

    if (!location.query.id) {
      if (title.value.length < 6) {
        this.setState({
          loadingInfo: {
            isLoading: false,
            message: '标题文字必须大于6个字'
          }
        });
        return;
      }
    }

    let _con = content.value;
    while(_con[_con.length-1] === String.fromCharCode(10) || _con[_con.length-1] === String.fromCharCode(32)) {
      _con = _con.substring(0, _con.length - 1);
    }
    if (_con.length < 2) {
      this.setState({
        loadingInfo: {
          isLoading: false,
          message: '内容文字太短啦'
        }
      });
      return false;
    }

    let _topic = 'general';
    switch (this.state.type) {
      case 'complaint':
        _topic = 'tucao';
        break;
      case 'idle':
        _topic = 'idle';
        break;
      case 'friend':
        _topic = 'friend';
        break;
      default:
        _topic = 'general';
    }

    let postData = {
      subject: title.value,
      content: _con,
      pics: requsetForm.pics,
      incognito: this.state.ss,
      topic: _topic,
      tags: []
    };

    if (_topic === 'general' && !location.query.id) {
      if (tags && tags.choice && tags.choice.length) {
        tags.choice.map(function(v){
          postData.tags.push(v.tagID);
        });
      }else {
        this.setState({
          loadingInfo: {
            isLoading: false,
            message: '请选择分类'
          }
        });
        return false;
      }
    }

    if (canSubmit) {
      canSubmit = false;
      if (location.query.id) {
        if (comment){
          postData.contentType = 'json';
          postData.content = {
            text: _con,
            user: comment.user,
            originText: (typeof comment.content).toLocaleLowerCase() === 'string' ? comment.content : comment.content.text,
            rank: comment.rank
          };
        }
        dispatch(postAnswerContent(currentItem.discussionID)(postData));
      }else {
        dispatch(postRequestContent(postData));
      }
    }
  }

  fileChangeFunc () {
    const { dispatch }  = this.props;
    this.fileIndex = 0;
    this.files = [];
    let file = this.refs.uploader;
    if (file.files.length && file.files.length < (10 - this.props.requsetForm.pics.length)) {
      let data = new FormData();
      data.append('file', file.files[0]);
      this.setState({
        loadingInfo: {
          isLoading: false,
          message: null
        }
      });
      dispatch(uploadFile(data));
    }else {
      this.setState({
        loadingInfo: {
          isLoading: false,
          message: '最多上传9张图片'
        }
      });
    }
  }

  ShowAnonymousForm() {
    const { location } = this.props;
    let query = { category: this.state.type };
    if (location.query.id) {
      query = { id :location.query.id};
    }
    this.context.router.push({
      pathname: '/user/info',
      query,
      state: null
    });
  }

  switchStatus(status) {
    const { userInfo } = this.props;
    let incognito = (userInfo.userInfo && userInfo.userInfo.incognito) ? true : false;
    if (status){
      if (!incognito){
        this.ShowAnonymousForm();
      }
    }
    this.setState({ ss: status });
  }

  showPhotos() {
    const { requsetForm } = this.props;
    let pics = requsetForm ? requsetForm.pics : [];
    if (pics.length) {
      let imgcon = $('<div id="ImagePanel" class="owl-carousel owl-theme"></div>').unbind('click').click(
        function() {
          $(this).empty().remove();
        }
      );
      imgcon.appendTo($('body'));
      //if (this.props.showImage) {
      let height = document.documentElement.clientHeight;
      let width = document.documentElement.clientWidth;
      pics.map(function(v) {
        $('<div class=\'item\' style="height: '+ height +'px;width:' + width + 'px"><img src=\' '+ v.thumb +' \' /></div>').appendTo(imgcon);
      });
      owlAdapter({}, imgcon).carousel();
      $('.item img', imgcon).load(function() {
        if (this.height/this.width > height/width) {
          new iScroll(this.parentNode, scrollOption);
        }else {
          this.parentNode.style.display = 'table-cell';
        }
        this.style.opacity = 1;
      });
      //}
    }
  }

  stopEvent(e) {
    e.stopPropagation();
  }

  changeType() {
    let target = $(this.refs.selectType);
    switch ($('option:selected',target).val()) {
      case '1':
        this.setState({ type: 'complaint' });
        break;
      case '2':
        this.setState({ type: 'idle' });
        break;
      case '3':
        this.setState({ type: 'friend' });
        break;
      default:
        this.setState({ type: 'question' });
        break;
    }
  }

  titleChange(e) {
    let content = e.currentTarget.value;
    const { dispatch, location } = this.props;
    let param = { content };
    if (location.query.id) {
      param.id = location.query.id;
    }else {
      param.cate = location.query.type || 'question';
    }
    dispatch(titleHistory(param));
  }

  contentChange(e) {
    let content = e.currentTarget.value;
    const { dispatch, location } = this.props;
    let param = { content };
    if (location.query.id) {
      param.id = location.query.id;
    }else {
      param.cate = location.query.type || 'question';
    }
    dispatch(contentHistory(param));
  }

  tagChoice() {
    const { dispatch } = this.props;
    dispatch(tagPermission(true));
    this.context.router.push({ pathname: '/tags' });
  }

  render() {
    const { requsetForm, location, userInfo, comment, tags, currentItem } = this.props;
    let pics = requsetForm ? requsetForm.pics : [];
    let placeholder = '';
    let label = '帮助';
    if (location.query.id && currentItem && currentItem.subject) {
      switch (currentItem.topic) {
        case 'tucao':
          placeholder = '一起吐吐槽，整个人都清爽了';
          label = '吐槽';
          break;
        case 'idle':
          placeholder = '有兴趣，给楼主留言';
          label = '闲置';
          break;
        case 'friend':
          placeholder = '给Ta一些鼓励吧';
          label = '交友';
          break;
        default:
          placeholder = '快来，楼主在等你帮助';
          label = '帮助';
          break;
      }
    }else {
      switch (this.state.type) {
        case 'complaint':
          placeholder = '一起吐吐槽，整个人都清爽了';
          label = '吐槽';
          break;
        case 'idle':
          placeholder = '介绍下物品，让新主人快快带回家';
          label = '闲置';
          break;
        case 'friend':
          placeholder = '聊聊自己，聊聊Ta';
          label = '交友';
          break;
        default:
          placeholder = '详细地描述下问题,会得到更准确的帮助';
          break;
      }
    }

    return(
      <div className='formContainer'>
        {
          location.query.from && (location.query.from === 'timeline' || location.query.from === 'singlemessage') ?
            <ShareHeader /> :
            ''
        }
        <form>
          <div className={'headPart ' + (location.query.id ? 'answer' : '')}>
            {
              location.query.id ? '' : <select ref='selectType' onChange={this.changeType.bind(this)}>
                <option value='0' selected={this.state.type === 'question'}>求助</option>
                <option value='1' selected={this.state.type === 'complaint'}>吐槽</option>
                <option value='2' selected={this.state.type === 'idle'}>闲置</option>
                <option value='3' selected={this.state.type === 'friend'}>交友</option>
              </select>
            }
            {
              location.query.id && currentItem ?
                <input type='text'
                       placeholder={currentItem.subject ? currentItem.subject : ('')}
                       readOnly={true} ref='titleElement'/> :
                  <input type='text' placeholder='输入标题' ref='titleElement' onChange={this.titleChange.bind(this)}/>
            }
            <span onClick={this.submit.bind(this)}>
              发布
            </span>
          </div>

          <div className='bodyPart'>
            <textarea placeholder={placeholder} ref='contentElement' onChange={this.contentChange.bind(this)} >
            </textarea>
            {
              location.query.id && comment ? (
                <p className='quote'>
                  {`"引用了${comment.user.userName}的${label}"`}
                </p>
              ) : ''
            }
            <div className='uploadcon' onClick={this.showPhotos.bind(this)}>
              {
                pics ? pics.map(function(v, i) {
                  let imgStyle = { backgroundImage: 'url(' + v.thumb + ')', backgroundSize: 'cover' };
                  let imgconStyle = { backgroundSize: '20%' };
                  return (
                    <i key={ 'upload_image_' + i } className={'item ' + (((i + 1) % 3) ? ('') : ('nomargin'))} style={imgconStyle} >
                      <i className='imagecon' style={imgStyle}></i>
                      <i className='close' onClick={this.removePics.bind(this, v.fID)} ></i>
                    </i>
                  );
                }, this) : ''
              }
              {
                pics ?
                  pics.length > 8 ?
                    '' :
                    <i className={'item addcon ' + ((pics.length === 2 || pics.length === 5 || pics.length === 8) ? 'nomargin' : '') }>
                      <input type='file' multiple='multiple' onChange={this.fileChangeFunc} ref='uploader' onClick={this.stopEvent} />
                    </i>
                  :
                  <i className={'item addcon'}>
                    <input type='file' multiple='multiple' onChange={this.fileChangeFunc} ref='uploader' onClick={this.stopEvent}/>
                  </i>
              }

            </div>
            {
              !location.query.id ?
                <div className={'tagBar ' + (this.state.type !== 'question' ? 'hide' : '')}
                     onTouchEnd={this.tagChoice.bind(this)}>
                  选择分类
                  <span className='tags'>
                    {
                      tags && tags.choice ?
                        tags.choice.map(function(v) {
                          return v.tagName;
                        }) : ''
                    }
                  </span>
                </div> :
                ''
            }
            <div className='switchBtnCon'>
              <span>匿名{ location.query.id ? '回复' : '发布' }</span>
              <SwitchButton
                anonymous={this.ShowAnonymousForm.bind(this)}
                userInfo={userInfo.userInfo}
                status={this.state.ss}
                setStatus={this.switchStatus.bind(this)}
              />
            </div>

          </div>
        </form>
        <ProcessCover param={this.state.loadingInfo} />
      </div>
    );
  }
}

PostForm.contextTypes = {
  router: React.PropTypes.object.isRequired
};

const requsetFormSelector = function(state) {
  return state.requestForm;
};

const uploadFileSelector = function(state) {
  return state.fileUpload;
};

const currentItemSelector = function(state) {
  return state.requestItem.currentItem;
};

const userInfoSelector = function(state) {
  return state.userPage;
};

const formCommentSelector = function(state) {
  return state.requestForm.comment;
};

const userSelector = function(state) {
  return state.user;
};

const tagsSelector = function(state) {
  return state.tagsPage;
};

const ContentPageSelector = createSelector(
  [requsetFormSelector, uploadFileSelector, currentItemSelector, userInfoSelector, formCommentSelector, userSelector, tagsSelector],
  (requsetForm, uploadFiles, currentItem, userInfo, comment, user, tags) => {
    return {
      requsetForm,
      uploadFiles,
      currentItem,
      userInfo,
      comment,
      user,
      tags
    };
  }
);

export default connect(ContentPageSelector)(PostForm);
