
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { createSelector } from 'reselect';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import MaterialUI from '../components/MaterialUI';

class TestPage extends React.Component {
  constructor (props, context) {
    super(props, context);
    this.state = {
      items: []
    };
  }

  render () {
    return (
      <div>
        <MuiThemeProvider>
          <MaterialUI />
        </MuiThemeProvider>
      </div>
    );
  }
}

const tagsSelector = function (state) {
  return state.tagsPage;
};

const ContentPageSelector = createSelector(
  [tagsSelector],
  (tags) => (
    { tags }
  )
);

export default connect(ContentPageSelector)(withRouter(TestPage));
