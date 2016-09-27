import './style.scss';
import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
//action
import { getTags, tagChoice, tagPermission } from '../../actions';

//inner var

class TagPage extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      loadingInfo: {
        isLoading: false
      }
    };
  }

  componentWillMount() {
    const { dispatch, permission } = this.props;
    if (permission) {
      dispatch(getTags());
    }else {
      this.context.router.replace('/');
    }
  }

  subTags(tagID) {
    this.context.router.push({
      pathname: '/tags/subtags',
      query: { tagID },
      state: null
    });
  }

  directChoice(tagID) {
    const { dispatch, tags } = this.props;
    let choice = tags.filter(function(v) {
      return v.tagID === tagID;
    });
    dispatch(tagPermission(false));
    dispatch(tagChoice(choice[0]));
    this.context.router.push({ pathname: '/form' , query: { keepPic: 'keeppic' } });
  }

  render() {
    const { tags } = this.props;
    let parentTags = tags.filter(function(v) {
      return v.parentTagID === 0;
    });
    return (
      <div className='tagsCon'>
        <div className='headPart'>
          <p className='title'>
            热门标签
          </p>
          <ul className='popTags'>
            <li className='tagName' onTouchTap={this.directChoice.bind(this, 15)}>
              心理
            </li>

            <li className='tagName' onTouchTap={this.directChoice.bind(this, 76)}>
              健康
            </li>

            <li className='tagName noMargin' onTouchTap={this.directChoice.bind(this, 23)}>
              阅读
            </li>

            <li className='tagName noBottom' onTouchTap={this.directChoice.bind(this, 22)}>
              兴趣
            </li>

            <li className='tagName noBottom' onTouchTap={this.directChoice.bind(this, 70)}>
              夫妻
            </li>

            <li className='tagName noMargin noBottom' onTouchTap={this.directChoice.bind(this, 26)}>
              隔代
            </li>
          </ul>
        </div>

        <p className='choicetitle title'>
          选择标签
        </p>
        <div className='bottomPart'>

          {
            parentTags && parentTags.length ?
              <dl className='choiceCon'>
                {
                  parentTags.map(function(v) {
                    return (
                      <dd
                        className={'tag tagID_' + v.tagID}
                        key={ 'parentTag_' + v.tagID }
                        onTouchTap={this.subTags.bind(this, v.tagID)}
                      >
                        {v.tagName}
                      </dd>
                    );
                  }, this)
                }
              </dl> : ''
          }
        </div>
      </div>
    );
  }
}

TagPage.contextTypes = {
  router: React.PropTypes.object.isRequired
};

const tagsSelector = function(state) {
  return state.tagsPage.tags;
};
const shouldTagSelector = function(state) {
  return state.tagsPage.needTag;
};
const messageSelector = function(state) {
  return state.tagsPage.message;
};
const loadingSelector = function(state) {
  return state.tagsPage.isLoading;
};
const permissionSelector = function(state) {
  return state.tagsPage.permission;
};

const tagsPageSelector = createSelector(
  [tagsSelector, shouldTagSelector, messageSelector, loadingSelector, permissionSelector],
  (tags, shouldTag, message, loading, permission) => {
    return {
      tags,
      shouldTag,
      message,
      loading,
      permission
    };
  }
);

export default connect(tagsPageSelector)(TagPage);
