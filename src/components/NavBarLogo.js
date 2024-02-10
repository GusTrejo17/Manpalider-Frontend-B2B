import React, {Component} from 'react';
import {config} from '../libs/utils/Const.js';
import {connect} from "react-redux";
import { Link } from 'react-router-dom';

class NavBarLogo extends Component {
    render() {
        const {configReducer: {history}} = this.props;
        //console.log('render NavBarLogo');
        return (
            <p style={{marginLeft:1, marginRight: 1, paddingLeft:1, paddingRight: 1}} onClick={() => {history.goHome()}}>
                <img src={config.navBar.icon} alt={'logo-empresa'} style={{marginLeft:1, marginRight: 1, paddingLeft:1, paddingRight: 1}}/>
            </p>
        );
    }
}


const mapStateToProps = store => {
    return {configReducer: store.ConfigReducer};
};

const mapDispatchToProps = dispatch => {
    return {};
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(NavBarLogo);
