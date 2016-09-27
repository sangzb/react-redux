import '../style.scss';
import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import NavigatorBar from '../../../components/NavigatorBar';
import { userAuthority } from '../../../utils';
//action
import { getUserInfo } from '../../../actions';
class UserInfo extends React.Component {
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
    //user userAuthority
    const { userInfo, dispatch, user, location } = this.props;
    if (user.isSignedIn) {
      if (!userInfo.userInfo) {
        dispatch(getUserInfo());
      }
    }else {
      userAuthority(user, dispatch, location);
    }
  }

  render() {
    const { dispatch, userInfo } = this.props;
    let avatar = userInfo.userInfo && userInfo.userInfo.avatar ? userInfo.userInfo.avatar : require('./Icon-60@3x.png');
    let userName = userInfo.userInfo && userInfo.userInfo.userName ? userInfo.userInfo.userName : (userInfo.userInfo === null || userInfo.isLoading ? '' : '爸妈营用户');
    let ch = document.documentElement.clientHeight - $('.navigatorBar').outerHeight();
    return (
      <div className='userInfoCon' style={{ minHeight: ch }}>
        <div className='content' style={{ minHeight: ch }}>
          <div className='headPart'>
            <img className='avatar' src={avatar}/>
            <p className='userName'>
              {userName}
            </p>
          </div>
          <dl className='category'>
            <dd>
              <Link to={{ pathname: '/user/question', query: { type: 'question' }, state: {} }}>
                我的求助
              </Link>
            </dd>
            <dd>
              <Link to={{ pathname: '/user/complaint', query: { type: 'question' }, state: {} }}>
                我的吐槽
              </Link>
            </dd>
            <dd>
              <Link to={{ pathname: '/user/idle', query: { type: 'question' }, state: {} }}>
                我的闲置
              </Link>
            </dd>
            <dd>
              <Link to={{ pathname: '/user/friend', query: { type: 'question' }, state: {} }}>
                我的交友
              </Link>
            </dd>
            <dd>
              <Link to={{ pathname: '/user/liked', query: {}, state: {} }}>
                我的关注
              </Link>
            </dd>
            <dd>
              <Link to={{ pathname: '/user/info', query: {}, state: {} }}>
                设置匿名
              </Link>
            </dd>
          </dl>
        </div>
        <NavigatorBar dispatch={dispatch} location={location}/>
      </div>
    );
  }
}

UserInfo.contextTypes = {
  router: React.PropTypes.object.isRequired
};

const userInfoSelector = function(state) {
  return state.userPage;
};
const userSelector = function(state) {
  return state.user;
};

const UserInfoSelector = createSelector(
  [userInfoSelector, userSelector],
  (userInfo, user) => {
    return {
      userInfo,
      user
    };
  }
);

export default connect(UserInfoSelector)(UserInfo);
