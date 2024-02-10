import React, {Component} from 'react';
import {Footer, NavBar, Session} from "../../components";
import {VIEW_NAME, SERVICE_RESPONSE} from "../../libs/utils/Const";
import {ApiClient} from "../../libs/apiClient/ApiClient";
import { connect } from "react-redux";
import { animateScroll as scroll, scroller } from 'react-scroll'

let apiClient = ApiClient.getInstance();

const EMAIL_FORMAT_REGEX = /^([A-Za-z0-9_\-\.+])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

class AccountDataView extends Component {
    constructor(props){
        super(props);
        this.scrollToBottom = this.scrollToBottom.bind(this);
    }

    scrollToBottom() {
        scroll.scrollToTop({
            duration: 1500,
            delay: 100,
            smooth: 'easeOutQuart',
            isDynamic: true
          })
    }

    componentDidMount(){
        this.scrollToBottom();
    }

    render() {
        const {history} = this.props;
        // console.log('Valor del state', this.state);
        return (
            <div className="content-fluid" style={{marginTop: 150,backgroundColor:'#FFFFFF' }}>
                <Session history={history} view={VIEW_NAME.ACCOUNT_DATA_VIEW}/>
                <NavBar/>
                <div className="container" style={{paddingTop: 60, paddingBottom: 20}}>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="jumbotron">
                                <h1 className="display-4 text-center">Agregar un Domicilio</h1>
                            </div>
                        </div>    
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = store => {
    return {
        notificationReducer: store.NotificationReducer,
        configReducer: store.ConfigReducer
    };
};

export default connect(
    mapStateToProps
)(AccountDataView);