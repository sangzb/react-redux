// 第三方
import 'jquery';
import { connect } from 'react-redux';
import { polyfill } from 'es6-promise';
polyfill();

// 样式
import './styles';

import React from 'react';
import ReactDom from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { Provider } from 'react-redux';

// 全局存储 Redux Store
import store from './store';

import { fetchMyInfo } from './actions';

// 辅助方法
import { wechat } from './utils';
import injectTapEventPlugin from 'react-tap-event-plugin';
// 组件
import 'owl.carousel/dist/owl.carousel';
// 页面
import ListPage from './containers/ListPage';
import Content from './containers/ContentPage';
import PostForm from './containers/PostForm';
import { UserInfo, UserPosted, UserLiked, UserAnonymous, HelperRank } from './containers/User';
import TagPage from './containers/TagPage';
import SubTagPage from './containers/TagPage/subTags';
import PostDiscussionPage from './containers/PostDiscussion';

window.clickable = true;
class App extends React.Component {
  componentWillMount() {
    let  self = this;

    let { dispatch, user } = self.props;
    if (user.isSignedIn) {
      dispatch(fetchMyInfo());
    }
  }

  componentDidMount() {
    wechat();
    injectTapEventPlugin();

    $('body').unbind('touchmove').unbind('touchend').bind('touchmove', function() {
      window.clickable = false;
      if ($(window).scrollTop() > 1000) {
        $('.gotoTop').show();
      }else {
        $('.gotoTop').hide();
      }
    }).bind('touchend', function() {
      window.clickable = true;
    });
  }

  render() {
    return (
      <div>
        { this.props.children }
      </div>
    );
  }
}

const connectedApp = connect(state => state)(App);

ReactDom.render((
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path='/' component={connectedApp}>
        <IndexRoute component={ListPage} />
      </Route>
    </Router>
  </Provider>
), document.getElementById('app'));
