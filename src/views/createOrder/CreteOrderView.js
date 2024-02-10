import React, {Component} from 'react';
import {NavBar, Session, Footer} from "../../components";
import {config, DISPATCH_ID, VIEW_NAME} from "../../libs/utils/Const";
import {connect} from "react-redux";
import './CreateOrder.css';
import { animateScroll as scroll, scroller } from 'react-scroll';

class CreteOrderView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            docNum: '',
        };

        this.scrollToBottom = this.scrollToBottom.bind(this);
    };
    
    componentDidMount() {
        const {history} = this.props;
        let data = localStorage.getItem(config.general.localStorageNamed + 'createOrder');
        if (!data || data === 'null' || data === undefined) {
            history.push('/')
        }

        this.setState({
            docNum: data
        })
        this.scrollToBottom();
    }

    componentWillUnmount() {
        localStorage.setItem(config.general.localStorageNamed + 'createOrder', null);
    }

    scrollToBottom() {
	    scroll.scrollToTop({
	        duration: 1000,
	        delay: 100,
	        smooth: 'easeOutQuart',
	        isDynamic: true
	      })
    }
    render() {
        const {history} = this.props;
        const {docNum} = this.state;
        let flag = false;
        if(docNum ==='undefined'){
            flag = true;
        }
        return (
            <div className="content-fluid" style={{marginTop: 60,backgroundColor:"#FFFFFF", paddingLeft:0, paddingRight:0}}>
                <Session history={history} view={VIEW_NAME.CREATE_ORDER_VIEW}/>
                <NavBar isShowMarcas={false}/>
                <div className="container" style={{paddingBottom: 40,margin: 'auto', minHeight: '70vh', paddingTop: 80}}>
                    <div className="row justify-content-md-center">
                        <div className="col-md-12 text-center pagoRealizado">
                            {!flag ?
                                <p >
                                <i className="fas fa-check-circle" style={{marginRight:10, color :'green'}}></i>
                                    {/* <span>Se créo correctamente el documento con el No. <strong>{docNum}</strong></span> */}
                                    <span>{docNum}</span>
                                </p>
                                :
                                <p>
                                <i className="fas fa-check-circle" style={{marginRight:10, color :'green'}}></i>
                                <span>Tu pedido se ha guardado en preliminar, para pedirlo debes de entrar en la sección de mis reportes / guardados / detalle y podrás imprimirlo o hacer el pedido.</span>
                                </p>
                            }
                            
                        </div>
                        <div className="col-md-12 text-center">
                            <button 
                            className="btn btn-lg btn-block"
                            onClick={() => history.push('/')}
                            style={{
                                backgroundColor: 'rgb(0, 96, 234)',
                                color: config.navBar.iconModal,
                                fontWeight: "bold",}}
                            >
                                Seguir comprando
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


const mapStateToProps = store => {
    return {
        sessionReducer: store.SessionReducer,
        configReducer: store.ConfigReducer,
        notificationReducer: store.NotificationReducer,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        enableSpinner: value => dispatch({type: DISPATCH_ID.CONFIG_SET_SPINNER, value}),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CreteOrderView);