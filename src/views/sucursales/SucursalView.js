import React, {Component} from 'react';
import {Footer, NavBar, Session, TopNavBar} from "../../components";
import {DISPATCH_ID, SERVICE_RESPONSE, config, ROLES,VIEW_NAME,SERVICE_API} from '../../libs/utils/Const';
import {ApiClient} from "../../libs/apiClient/ApiClient";
import {connect} from "react-redux";
import $ from 'jquery';
import moment from "moment";
import { animateScroll as scroll, scroller } from 'react-scroll';

let apiClient = ApiClient.getInstance();

class SucursalView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Sucursal : 0
        };
        this.scrollToBottom = this.scrollToBottom.bind(this);
    };
    
    async componentDidMount(){
        this.scrollToBottom();
    };

    scrollToBottom() {
	    scroll.scrollToTop({
	        duration: 1000,
	        delay: 100,
	        smooth: 'easeOutQuart',
	        isDynamic: true
	      })
    }

    localidad = (event, option) => {
        if (option == 1) {
            this.setState({
                groupCodeValue: event.nativeEvent.target.value,
            })
        }

        setTimeout(() => {
            // this.searchDocuments()
        }, 100)
    };

    sucursal = (event, option) => {
        if (option == 1) {
            this.setState({
                Sucursal: parseInt(event.nativeEvent.target.value),
            })
        }

        setTimeout(() => {
            // this.searchDocuments()
        }, 100)
    };

    direccion = (dir)=>{
        let result = '';
        switch (dir) {
            case 0:
                result = 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d898.7739232982553!2d-100.3704424!3d25.7012555!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x866297fe437952c3%3A0xfd14d1c2d299aea2!2sDIASA%20Distribuidora%20Industrial%20De%20Abrasivos!5e0!3m2!1ses-419!2smx!4v1677523243651!5m2!1ses-419!2smx';               
                break;
            case 1:
                result = 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14381.635076656456!2d-100.4689978!3d25.6908866!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x8448d8e338de2df8!2sDistribuidora%20Industrial%20De%20Abrasivos%20Sa%20De%20Cv!5e0!3m2!1ses-419!2smx!4v1628018925982!5m2!1ses-419!2smx';
                break;
            default:
                result = 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d898.7739232982553!2d-100.3704424!3d25.7012555!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x866297fe437952c3%3A0xfd14d1c2d299aea2!2sDIASA%20Distribuidora%20Industrial%20De%20Abrasivos!5e0!3m2!1ses-419!2smx!4v1677523243651!5m2!1ses-419!2smx';             
                break;
        }
        return result
    }
    
    render() {
        const { history, sessionReducer } = this.props;
        const { Sucursal } = this.state;
        
        return (
            <div className="content-fluid none-scroll" style={{marginTop: 150,backgroundColor:config.Back.backgroundColor }}>
                <Session history={history} view={VIEW_NAME.SUCURSALES_VIEW}/>
                <NavBar/>
                <div className="bannerRedCompensas margenS" style={{backgroundColor:config.Back.backgroundColor}}>
                    <img id = "scrollDownPlease" className="img-fluid"
                        // src={require('../../images/diasa/sucursales/sucursales-01.png')}
                        src={require('../../images/sucursales/sucursales-01.jpg')}
                        alt="Segundo NavBar"
                    />
                </div>  
                {/* <div className="row mb-md-3 mt-md-3 justify-content-center">
                    <div className="col-md-8">
                        <div className="row justify-content-start">
                            <div className="col-md-4">
                                <h3 className = "font-weight-bold">Sucursales</h3>
                            </div>
                        </div>
                    </div>
                </div> */}

                <div className="row justify-content-center">
                    <div className="col-md-10">
                        <div className="borderRadius">                        
                            <div className="card">
                                <ul className="list-group list-group-flush">
                                    <li className="liTransition bg-white  list-group-item" >                                 
                                        {/* <select name="select" className="btn-outline-secondary" id="selectDocTypeDocumentSearch"
                                            style={{color: "#000", borderRadius: 4, backgroundColor: "transparent", height: 40}}
                                            onChange={(event) => this.localidad(event, 1)}>
                                            <option value="---">Seleccione su localidad</option>
                                            <option value="1">Hey</option>
                                            {groupCodes.map(group => {
                                                return (<option value={group.GroupCode}>{group.GroupName}</option>)
                                            })}
                                        </select>
                                        &nbsp;&nbsp; */}
                                        <select name="select" className="btn-outline-secondary" id="selectDocTypeDocumentSearch"
                                            style={{color: "#000", borderRadius: 4, backgroundColor: "transparent", height: 40}}
                                            onChange={(event) => this.sucursal(event, 1)}>
                                            <option value="0">Oficina principal</option>
                                            <option value="1">Distribuidora industrial de abrasivos S.A. de C.V.</option>
                                        </select>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-10">
                        {/* <img id = "scrollDownPlease" className="img-fluid" style={{display:Sucursal === 0 ? 'block' : 'none' }}
                            src={require('../../images/diasa/sucursales/sucursales-02.png')} alt="Segundo NavBar"/> */}
                            {/* style={{display:Sucursal === 0 ? 'none' : 'block' }} */}
                        <div >
                        <iframe src={this.direccion(Sucursal)} width="100%" height="400" style={{border:0}} allowfullscreen="" loading="lazy"></iframe>
                        </div>
                    </div>
                    <div className="col-md-10 mt-3">
                        <div className="row">
                            {config.dataSucursal.map( (sucur, index) =>{
                                return(
                                    <div className="col-sm-4" key={index}>
                                        <div className="card mb-3" style={{background: 'transparent', border: 'none'}}>
                                            <div className="row no-gutters">
                                                <div className="col-md-4 text-center">
                                                    <img id = "scrollDownPlease" className="img-fluid" src={sucur.imagen} alt="Segundo NavBar"/>
                                                </div>
                                                <div className="col-md-8 align-self-end">
                                                    <div className="card-body text-center" style={{fontFamily: 'Poppins'}}>
                                                        <h5 className="card-title "><strong>{sucur.name}</strong></h5>
                                                        <span className="card-text">{sucur.address}</span><br/>
                                                        <span className="card-text">C.P. {sucur.zipcode}</span><br/>
                                                        <span className="card-text">{sucur.block}</span><br/>
                                                        {sucur.phones.map((phone,index) => {
                                                            return (
                                                                <span className="card-text">Tel. <strong>{phone}</strong><br/></span>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
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
        itemsReducer: store.ItemsReducer,
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
)(SucursalView);

