import './style.scss';
import React from 'react';
import { Link } from 'react-router';

export default class LinkNavBar extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {};
  }

  render() {
    return (
     <ul className='LinkNav' >
       <li>
         <Link className='quickHelp' to={{ pathname: '/', query: { type: 'quickAnswer' }, state: null }}>
            快速帮助
         </Link>
       </li>

       <li>
         <Link className='superHelper' to={{ pathname: '/user/rank', query: {}, state: null}}>
           帮助达人
         </Link>
       </li>

       <li>
         <a className='knowledge'
            target='_blank'
            href='http://www.bamaying.com/wechat/search/' >
           亲子文库
         </a>
       </li>
       <li>
         <a className='about'
            target='_blank'
            href='https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MjM5NjI4MDU4NA==&from=singlemessage&isappinstalled=0#wechat_redirect' >
           了解爸妈营
         </a>
       </li>
     </ul>
    );
  }
}
