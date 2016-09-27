import '../style.scss';
import React from 'react';
import { connect } from 'react-redux';
import selector from '../../../selectors/apiSelector.js';
import ProcessCover from '../../../components/ProcessCover/';
import NavigatorBar from '../../../components/NavigatorBar';
//action
import { getHelperRank } from '../../../actions';
class HelperRank extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      error: false,
      loadingType: 'common',
      loadingInfo: {
        isLoading: false
      }
    };
  }

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(getHelperRank());
  }

  componentWillReceiveProps(nextProps) {
    let isSuccess = nextProps.message === '数据获取成功';
    if (this.props.isLoading !== nextProps.isLoading) {
      this.setState({
        loadingInfo: {
          isLoading: nextProps.isLoading
        }
      });
    }
    if (this.props.message !== nextProps.message) {
      if (isSuccess) {
        this.setState({ error : false });
      }else {
        this.setState({ error : true });
      }
    }
  }

  render() {
    let { data, dispatch, location } = this.props;
    return (
      <div className='rankCon'>
        <table className='quickHelpHead'>
          <tr>
            <td className='icon'></td>
            <td>
              <p className='p1'>爸妈营求助达人榜</p>
              <p className='p2'>谢谢这些热情回答的爸妈</p>
            </td>
          </tr>
        </table>
        {
          !this.state.error ? (
            <dl>
              {
                data.users ? data.users.map(function(v, i) {
                  if (i < 10) {
                    let avatar = v.avatar ? v.avatar : require('./Icon-60@3x.png');
                    return (
                      <dd>
                        <span className='avatar' style={{ backgroundImage: 'url(' + avatar + ')'}}></span>
                      <span className='username'>
                        {
                          v.userName
                        }
                      </span>
                      <span className='helpCnt'>
                        {
                          `${v.count} 次帮助`
                        }
                      </span>
                      </dd>
                    );
                  }
                }) : <p className='warnContainer'>{'暂 无 数 据'}</p>
              }
            </dl>
          ) : (
            <p className='warnContainer'>{'暂 无 数 据'}</p>
          )
        }
        <dl>

        </dl>
        <NavigatorBar dispatch={dispatch} location={location} />
        <ProcessCover param={this.state.loadingInfo} />
      </div>
    );
  }
}

HelperRank.contextTypes = {
  router: React.PropTypes.object.isRequired
};

export default connect(selector('helperRank'))(HelperRank);
