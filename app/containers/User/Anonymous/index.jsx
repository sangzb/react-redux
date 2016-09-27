import '../style.scss';
import React from 'react';
import AnonymousPost from '../../../components/Anonymous';
import ProcessCover from '../../../components/ProcessCover';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { userAuthority } from '../../../utils';
//action
import { getUserInfo } from '../../../actions';
class UserAnonymous extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = { loadingInfo: { isLoading: false }};
  }

  componentWillMount() {
    const { dispatch, user, location } = this.props;
    if (user.isSignedIn) {
      dispatch(getUserInfo());
    }else {
      userAuthority(user, dispatch, location);
    }
  }

  AnonymousLoading(loadingInfo) {
    this.setState({ loadingInfo });
  }

  render() {
    const { userInfo, location } = this.props;
    return (
      <div>
        <AnonymousPost
          type='user'
          location={location}
          loadingInfo={this.AnonymousLoading.bind(this)}
          userInfo={userInfo.userInfo}
          anonymous={userInfo.anonymous}
          show={true}
        />
        <ProcessCover param={this.state.loadingInfo} />
      </div>
    );
  }
}

UserAnonymous.contextTypes = {
  router: React.PropTypes.object.isRequired
};

const userInfoSelector = function(state) {
  return state.userPage;
};
const userSelector = function(state) {
  return state.user;
};
const UserAnonymousSelector = createSelector(
  [userInfoSelector, userSelector],
  (userInfo, user) => {
    return {
      userInfo,
      user
    };
  }
);

export default connect(UserAnonymousSelector)(UserAnonymous);