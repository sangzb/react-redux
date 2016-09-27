import './style.scss';
import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { tagChoice, tagPermission } from '../../actions';

//inner var

class SubTagPage extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      loadingInfo: {
        isLoading: false
      }
    };
  }

  componentWillMount() {
    const { permission } = this.props;
    if (!permission) {
      this.context.router.replace('/')
    }
  }

  tagChoice(obj) {
    const { dispatch } = this.props;
    dispatch(tagChoice(obj));
    dispatch(tagPermission(false));
    this.context.router.push({ pathname: '/form' , query: { keepPic: 'keeppic' } });
  }

  render() {
    const { tags, location } = this.props;
    let subTags = tags.filter(function(v) {
      return v.parentTagID.toString() === location.query.tagID;
    });
    return (
      <div className='tagsCon'>
        <div className='subTagCon'>
          {
            subTags && subTags.length ?
              <dl className='choiceCon'>
                {
                  subTags.map(function(v) {
                    return (
                      <dd
                        style={{paddingLeft: 0}}
                        className={'tag'}
                        key={ 'parentTag_' + v.tagID }
                        onTouchTap={this.tagChoice.bind(this, v)}
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

SubTagPage.contextTypes = {
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

export default connect(tagsPageSelector)(SubTagPage);
