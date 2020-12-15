import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux';
const Alert = ({alerts}) => 
alerts!==null && alerts.map(alert=>(
<div key={alert.id} className={`alert alert-${alert.alertType}`}>
{alert.msg}
</div>
));

Alert.propTypes = {
alert:PropTypes.array.isRequired
}

const mapstatetoprops=state=>({
    alerts:state.alert
});
export default connect(mapstatetoprops)(Alert)
