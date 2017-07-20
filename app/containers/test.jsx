import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { createSelector } from 'reselect';
import { testDispatch } from '../actions';

class TestPage extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(testDispatch())
  }

  render() {
    return (
      <div>
        test page
      </div>
    )
  }
}


const tagsSelector = function(state) {
  return state.tagsPage;
};

const ContentPageSelector = createSelector(
  [tagsSelector],
  (tags) => {
    return {
      tags
    };
  }
);

export default connect(ContentPageSelector)(withRouter(TestPage));