import './style.scss';
import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import NavigatorBar from '../../components/NavigatorBar';
//inner var

let $ = window.jQuery;
let goForm = true;
class PostDiscussionPage extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  componentDidMount() {
    let cw = document.documentElement.clientWidth;
    $('.postDiscussion .postItem').height(330 * 0.7 * 0.48 * cw / 265);
    let con = $('.postCon');
    con.css('marginTop', -(con.outerHeight()/2));
  }

  postDiscussion(type) {
    let that = this;
    if (goForm) {
      let query = { type };
      if (type === 'complaint') {
        query.anonymous = 'on';
      }
      goForm = false;
      setTimeout(function() {
        goForm = true;
        that.context.router.push({ pathname: '/form', query, state: null });
      }, 200);
    }
  }

  render() {
    const { dispatch, location } = this.props;
    return (
      <div className='postDiscussion' style={{ minHeight: document.documentElement.clientHeight - 51 }}>
        <ul className='postCon'>
          <li className='postItem question left' onTouchEnd={this.postDiscussion.bind(this, 'question')}>
            <p className='icon icon_question'></p>
            <p className='hr'>求助</p>
            <p className='text'>育儿、生活<br/>有问题问我</p>
          </li>

          <li className='postItem complaint right' onTouchEnd={this.postDiscussion.bind(this, 'complaint')}>
            <p className='icon icon_complaint'></p>
            <p className='hr'>吐槽</p>
            <p className='text'>不吐不快<br/>聊聊身边事</p>
          </li>

          <li className='postItem idle left' onTouchEnd={this.postDiscussion.bind(this, 'idle')}>
            <p className='icon icon_idle'></p>
            <p className='hr'>闲置</p>
            <p className='text'>这里转让<br/>闲置的物品</p>
          </li>

          <li className='postItem friend right' onTouchEnd={this.postDiscussion.bind(this, 'friend')}>
            <p className='icon icon_friend'></p>
            <p className='hr'>交友</p>
            <p className='text'>单身爸妈<br/>寻找有缘的Ta</p>
          </li>
        </ul>
        <NavigatorBar dispatch={dispatch} location={location} />
      </div>
    );
  }
}

PostDiscussionPage.contextTypes = {
  router: React.PropTypes.object.isRequired
};

const listPageSelector = function(state) {
  return state.listPage;
};
const ListPageSelector = createSelector(
  [listPageSelector],
  (listPage) => {
    return {
      listPage
    };
  }
);

export default connect(ListPageSelector)(PostDiscussionPage);
