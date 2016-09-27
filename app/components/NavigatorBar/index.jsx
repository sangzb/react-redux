import './style.scss';
import React from 'react';
import { C } from '../../utils';

//action
import { clearRequestList, addMoreLink, setListPageScroll, getRequestList } from '../../actions';
//let headers = C('apiHeader');
let $ = window.jQuery;
export default class NavigatorBar extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {};
  }

  quickPost() {
    this.context.router.push({ pathname: '/post', query: {}, state: null });
  }


  linkPage(category, e) {
    const { dispatch } = this.props;
    if (!$(e.currentTarget).hasClass('active')) {
      //重置列表页
      dispatch(clearRequestList(category));
      dispatch(addMoreLink(''));
      dispatch(setListPageScroll(0));
      switch (category) {
        case 'user':
          this.context.router.push({ pathname: '/user', query: {}, state: null });
          break;
        default:
          this.context.router.push({ pathname: '/', query: { type: 'latest' }, state: null });
          break;
      }
    }else {
      if ($(e.currentTarget).index() === 2) {
        this.context.router.push({ pathname: '/user', query: {}, state: null });
      }
    }
  }

  render() {
    const { location } = this.props;
    return(
      <ul className='navigatorBar'>
        <li onClick={this.linkPage.bind(this, 'question')}
            className={ 'help ' + (location.pathname === '/' && location.query.type !== 'quickAnswer' ? 'active' : '')} >
            求助
        </li>
        <li className='post'>
          <span onClick={this.quickPost.bind(this)}></span>
        </li>
        <li onClick={this.linkPage.bind(this, 'user')}
            className = { 'user ' + (~location.pathname.indexOf('/user') ? 'active' : '')} >
            我的
        </li>
      </ul>
    );
  }
}

NavigatorBar.contextTypes = {
  router: React.PropTypes.object.isRequired
};