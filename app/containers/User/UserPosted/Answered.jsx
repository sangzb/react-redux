import '../style.scss';
import React from 'react';
import { C, timeformat } from '../../../utils';

export default class UserAnsweredComponent extends React.Component {
  constructor(props, context) {
    super(props, context);
  }
  
  render() {
    const { answers, isLoading, touchend, deleteComment, category } = this.props;
    return (
      <dl className='postedList'>
        {
          answers ? (
            answers.length ? (
              answers.map(function (v, i) {
                let qid = v.target ? v.target.split(':')[1] : null;
                return (
                  <dd key={'useranswered_' + i} onClick={touchend.bind(this, qid)}>
                    <p className='title'>
                      {
                        (typeof v.content).toLocaleLowerCase() === 'string' ? v.content : v.content.text
                      }
                    </p>
                    <p className='summary'>
                      {
                        category === 'question' ?
                          <span className='label label_help'>求助</span> :
                          category === 'complaint' ? <span className='label label_tucao'>吐槽</span> :
                            category === 'friend' ? <span className='label label_friend'>交友</span> :
                              <span className='label label_idle'>闲置</span>
                      }
                      <span className='question'>
                        {
                          v.targetSummary
                        }
                      </span>
                    </p>
                    <p className='datetime'>
                      <span>
                        {
                          timeformat(v.createdAt)
                        }
                      </span>
                      <span className='deletebtn' onClick={deleteComment.bind(this, v.commentID)}>
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
                    '正 在 加 载 ' + (category === 'question' ? '帮 助' : ( category === 'complaint' ? '评 论' : (category === 'friend' ? '留 言' : '想 要') ))
                  }
                </p>
              ) : (
                <p className='warnContainer'>
                  {
                    category === 'complaint' ? '你 还 没 有 评 论 哦' :
                      category === 'idle' ? ' 你 还 没 有 想 要 的 哦' :
                        category === 'friend' ? '你 还 没 有 留 言 哦' : '你 还 没 有 提 供 帮 助 哦'
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

UserAnsweredComponent.contextTypes = {
  router: React.PropTypes.object.isRequired
};