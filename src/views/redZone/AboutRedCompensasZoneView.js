import React, {Component} from 'react';
import {Footer, NavBar, Session, Suscription} from "../../components";
import {DISPATCH_ID, SERVICE_RESPONSE, config, ROLES,VIEW_NAME,SERVICE_API} from '../../libs/utils/Const';
import {connect} from 'react-redux';
import {ApiClient} from "../../libs/apiClient/ApiClient";
import { animateScroll as scroll, scroller } from 'react-scroll'
import './RedCompensasZoneView.css';

let apiClient = ApiClient.getInstance();

class AboutRedCompensasZoneView extends Component {
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

    requestCard = async () => {
        const {sessionReducer, enableSpinner, notificationReducer:{showAlert}, configReducer: { history }} = this.props;
        if(sessionReducer.user.CardCode){
            let cardCode = sessionReducer.user.CardCode;

            enableSpinner(true);
            let response = await apiClient.getBusinessPartnerInfo(cardCode);
            enableSpinner(false);

            let businessPartnerInfoResponse = response.data.resultData;
            
            if(businessPartnerInfoResponse.Phone1 == ''){
                showAlert({type: 'warning', message: ' Debes actualizar en tu perfil el número telefónico', timeOut: 8000});  
                return;
            }
            if(businessPartnerInfoResponse.Country == ''){
                showAlert({type: 'warning', message: ' Debes actualizar en tu dirección de envío el campo de País', timeOut: 8000});  
                return;
            }
            if(businessPartnerInfoResponse.State == ''){
                showAlert({type: 'warning', message: ' Debes actualizar en tu dirección de envío el campo del Estado ', timeOut: 8000});  
                return;
            }
            if(businessPartnerInfoResponse.City == ''){
                showAlert({type: 'warning', message: ' Debes actualizar en tu dirección de envío el campo de la ciudad ', timeOut: 8000});  
                return;
            }
            
            let data = {
                CardCode : businessPartnerInfoResponse.CardCode,
                CardName : businessPartnerInfoResponse.CardName, 
                email : businessPartnerInfoResponse.U_FMB_Handel_Email, 
                phone : businessPartnerInfoResponse.Phone1, 
                country : businessPartnerInfoResponse.Country, 
                state : businessPartnerInfoResponse.State, 
                city : businessPartnerInfoResponse.City,
            }

            let response2 = await apiClient.sendRequestCardMail(data);
            if (response2.status === SERVICE_RESPONSE.SUCCESS) {
                if(response2.data.response == "10minutes"){
                    showAlert({type: 'warning', message: response2.message || ' Se envió una solicitud hace menos de 10 minutos ', timeOut: 8000});  
                } else {
                    showAlert({type: 'success', message: ' Solicitud enviada de forma correcta ', timeOut: 8000});  
                }
                
            } else {
                showAlert({type: 'error', message: response2.message || ' Ocurrió un error al enviar tu solicitud :( ', timeOut: 8000});  
            }

        } else {
            showAlert({type: 'warning', message: ' Debes registrarte para poder solicitar una tarjeta de Recompensas ', timeOut: 8000}); 
            history.goLogin();
        }
    }

    render() {
        const {history} = this.props;
        return (
            <div className="content-fluid margenSuperiorMenuCategorias" style={{paddingRight:0, backgroundColor:config.Back.backgroundColor  }}>
                <Session history={history} view={VIEW_NAME.aboutRedView}/>
                <NavBar/>
                <div className="bannerRedCompensas margenS" style={{backgroundColor:config.Back.backgroundColor }}>
                    <img className="img-fluid"
                        src={require('../../images/diasa/bannerPaginas/cliente preferente .png')}
                        alt="Segundo NavBar"
                    />
                </div>

                <div className="container">

                    <div className="descriptionRedZone">
                        <p className="text-justify description2 ">
                        Sabemos lo importante que eres para Diasa por eso en nuestra estrategia comercial integramos a nuestros clientes preferentes que puedan estar con nosotros en nuestro proyecto de expansión nacional. Por lo cual estamos buscamos colaboradores con muchas ganas de integrarse nuestro equipo de ventas para que nos ayuden a crecer en nuevas zonas y mercados ofreciendo todos nuestros productos y servicio, además que contamos con los mejores precios y promociones del mercado.
                        </p>
                        <br/>
                        <p className="text-justify description2 ">
                            Nos puedes contactar al teléfono: <strong>{config.footer.info.phone}</strong> 
                        </p>
                        <p className="description2">
                        WhatsApp: <strong>(81) 83964633 o al correo <a style={{display:"inline-block", textAlign:"center"}} href="ventas@diasa.net">
                           <span>ventas@diasa.net</span></a></strong> 
                        </p>
                        <br/>
                    </div>
                </div>
                <Suscription/>
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
        setItemsSearch: value => dispatch({type: DISPATCH_ID.ITEMS_SET_ITEMS, value}),
        enableSpinner: value => dispatch({type: DISPATCH_ID.CONFIG_SET_SPINNER, value}),
        setItemsFilterSearch: value => dispatch({type: DISPATCH_ID.ITEMS_SAVE_ITEMS_FILTER, value}),
        setLocation:  value => dispatch({type: DISPATCH_ID.ITEMS_SET_LOCATION, value}),
        setTotalRows : value => dispatch({type: DISPATCH_ID.ITEMS_SET_TOTALROWS, value}),
        setIdCategory: value => dispatch({type: DISPATCH_ID.ITEMS_SET_IDCATEGORY, value}),
        setNextPage:  value => dispatch({type: DISPATCH_ID.ITEMS_SET_NEXTPAGE, value}),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(AboutRedCompensasZoneView);