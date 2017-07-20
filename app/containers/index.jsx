import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { createSelector } from 'reselect';

class IndexPage extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  componentWillMount() {
    console.log('--index page---');
    console.log(this.props)
  }

  render() {
    return (
      <div>index pavge</div>
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
export default connect(ContentPageSelector)(withRouter(IndexPage));