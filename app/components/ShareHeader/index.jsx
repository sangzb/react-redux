import './style.scss';
import React from 'react';
import { CookieStore } from '../../utils';

export default class ShareHeader extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    let shareHeader = CookieStore.get('shareHeader');
    if (shareHeader && shareHeader === 'noshow') return null;
    return (
      <div className='headerCon'>
        <table className='shareHeader'>
          <tbody>
          <tr>
            <td className='icon'></td>
            <td >
              <p className='p1'>爸妈营，品质亲子生活</p>
              <p className='p2'>教育 | 生活 | 优品 | 亲子游 | 游学</p>
            </td>
            <td className='btn'>
              <span className='btn'>
                <a href='https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MjM5NjI4MDU4NA==&from=singlemessage&isappinstalled=0#wechat_redirect' target='_blank' >
                  立即查看
                </a>
              </span>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

ShareHeader.contextTypes = {
  router: React.PropTypes.object.isRequired
};

