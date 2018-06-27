// 第三方
import { polyfill } from 'es6-promise';
polyfill();
import Bundle from './containers/Bundle.jsx';
import injectTapEventPlugin from 'react-tap-event-plugin';

// 样式
import './styles';

import React from 'react';
import ReactDom from 'react-dom';
import { Route } from 'react-router';
import { HashRouter, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';

// 全局存储 Redux Store
import store from './store';
// 页面
import IndexPage from './containers/index.jsx';

// 异步引入
import TestPageContainer from 'bundle-loader?lazy&name=app-[List]!./containers/test.jsx';
const TestPage = () => (
  <Bundle load={TestPageContainer}>
    {(TestPage) => <TestPage />}
  </Bundle>
);

const App = (props) => (
  <HashRouter>
    <Switch>
      <Route path='/test' component={TestPage}/>
      <Route path='/' component={IndexPage}/>
    </Switch>
  </HashRouter>
);

// const connectedApp = connect(state => state)(App);

injectTapEventPlugin();

ReactDom.render((
  <Provider store={store}>
    <App />
  </Provider>
), document.getElementById('app'));
