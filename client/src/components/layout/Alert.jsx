import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

//destructure alerts from mapStateToProps to be used in component 
const Alert = ({ alerts }) =>
  alerts !== null &&
  alerts.length > 0 &&
  alerts.map(alert => (
    <div key={alert.id} className={`alert alert-${alert.alertType}`}>
      {alert.msg}
    </div>
  ));

Alert.propTypes = {
  alerts: PropTypes.array.isRequired
};

//when you need to consume the state 
//alert state comes from reducer index.js
const mapStateToProps = state => ({
  alerts: state.alert
});

//first arg is actions 
export default connect(mapStateToProps)(Alert);