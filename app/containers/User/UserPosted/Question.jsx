import '../style.scss';
import React from 'react';
import { C, timeformat } from '../../../utils';

export default class UserPostedComponent extends React.Component {
  constructor(props, context) {
    super(props, context);
  }


  render() {
    const { discussions, isLoading, touchend, deletePost, category } = this.props;
    return (
      <dl className='postedList'>
        {
          discussions ? (
            discussions.length ? (
              discussions.map(function (v, i) {
                return (
                  <dd key={'userposted_' + i} onClick={touchend.bind(this, v.discussionID)}>
                    <p className='title'>
                      {
                        v.subject
                      }
                    </p>
                    <p className='datetime'>
                      <span>
                        {
                          timeformat(v.createdAt, true)
                        }
                      </span>
                      <span className='deletebtn' onClick={deletePost.bind(this, v.discussionID)}>
                        删除
                      </span>
                    </p>
                  </dd>
                );
              }, this)
            ) : (
              isLoading ? (
                <p className='warnContainer'>
                  {
                    '正 在 加 载 ' + (category === 'question' ? '求 助' : ( category === 'complaint' ? '吐 槽' : (category === 'friend' ? '交 友' : '闲 置') ))
                  }
                </p>
              ) : (
                <p className='warnContainer'>
                  {
                    '你 还 没 有 发 起 ' + (category === 'question' ? '帮 助' : ( category === 'complaint' ? '评 论' : (category === 'friend' ? '交 友' : '闲 置') )) + ' 哦'
                  }
                </p>
              )
            )
          ) : (
            <p className='warnContainer'>
              {
                '获 取 数 据 列 表 失 败'
              }
            </p>
          )
        }
      </dl>
    );
  }
}

UserPostedComponent.contextTypes = {
  router: React.PropTypes.object.isRequired
};
