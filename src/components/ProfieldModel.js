import React, {Component} from 'react';
import {config, SERVICE_API,DISPATCH_ID,SERVICE_RESPONSE} from "../libs/utils/Const";
import {ApiClient} from "../libs/apiClient/ApiClient";
import $ from 'jquery';
import {connect} from 'react-redux';
import CurrencyFormat from 'react-currency-format';

let apiClient = ApiClient.getInstance();

class ProfieldModel extends Component {
    state = {
        infoSN: [],
    }

    async componentDidMount () {
        // Información del modal
        await apiClient.getDataProfiel().then( (response) => {
            if (response.status === SERVICE_RESPONSE.SUCCESS) {
                this.setState({
                    infoSN: response.data,
                });
            };
        });
    }

    render() {
        const {infoSN} = this.state;
        return (
            <div className="modal fade" id="dataProfiel" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{border: "none", textAlign: 'center'}}>
                <div className="modal-dialog modal-lg" role="document" style={{margin: '1.75rem auto'}}>
                    <div className="modal-content" style={{borderRadius: "10px"}}>
                        <div className="modal-header d-flex" style={{alignContent: "flex-end", flexWrap: "wrap", background: config.navBar.backgroundColor, borderTopLeftRadius: "10px", borderTopRightRadius: "10px", height:"50px"}}>
                            <h5 className="ml-4" style={{color: "white", fontSize: "23px"}}>Detalle de la cuenta</h5>
                            <button type="button" style={{color: config.navBar.textColor}} className="close" data-dismiss="modal" aria-label="Close">
                                <span className='mr-2 mt-2' aria-hidden="true" style={{color:'white'}}>&times;</span>
                            </button>
                        </div>
                        <div className="modal-body bg3">
                            {infoSN && infoSN.body && infoSN.body.map(item => {
                                return <div className="container" key={item}>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <h5>Número del cliente</h5>
                                            <label style={{color:config.navBar.backgroundColor}}>{item.CardCode}</label>
                                        </div>
                                        <div className="col-md-6">
                                            <h5>Nombre</h5>
                                            <label style={{color:config.navBar.backgroundColor}}>{item.CardName}</label>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <h5>Correo</h5>
                                            <label style={{color:'red'}}>{'angel.beltran@diasa.net'}</label>
                                        </div>
                                        <div className="col-md-6">
                                            <h5>Télefono</h5>
                                            <label style={{color:'red'}}>{'1234567890'}</label>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <h5>Dirección Fiscal</h5>
                                            <label style={{color:'red'}}>{'Av. tal calle aquella 112'}</label>
                                        </div>
                                        <div className="col-md-6">
                                            <h5>CIF</h5>
                                            <label style={{color:'red'}}>{'019892'}</label>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <h5>Antigüedad</h5>
                                            <label style={{color:'red'}}>{'2 años'}</label>
                                        </div>
                                        <div className="col-md-6">
                                            <h5>Condiciones de pago</h5>
                                            <label style={{color:config.navBar.backgroundColor}}>{item.CondicionPago}</label>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6">
                                            <h5>Documentos vencidos</h5>
                                            <label style={{color:config.navBar.backgroundColor}}>{item.DocsVencidos || 0}</label>
                                        </div>
                                        
                                        <div className="col-md-6">
                                            <h5>Límite de crédito</h5>
                                            <label style={{color:config.navBar.backgroundColor}}>
                                                <CurrencyFormat 
                                                    value={item.LimiteCredito || 0} 
                                                    displayType={'text'} 
                                                    thousandSeparator={true} 
                                                    fixedDecimalScale={true} 
                                                    decimalScale={2} 
                                                    prefix={'$ '}
                                                    suffix={config.general.currency}
                                                    >
                                                </CurrencyFormat>
                                            </label>
                                        </div>
                                    </div>
                                    <div className="row">
                                        
                                        <div className="col-md-6">
                                            <h5>Total vencidos</h5>
                                            <label style={{color:config.navBar.backgroundColor}}>
                                                <CurrencyFormat 
                                                    value={item.MontoVencido || 0} 
                                                    displayType={'text'} 
                                                    thousandSeparator={true} 
                                                    fixedDecimalScale={true} 
                                                    decimalScale={2} 
                                                    prefix={'$ '}
                                                    suffix={config.general.currency}
                                                    >
                                                </CurrencyFormat>
                                            </label>
                                        </div>
                                        <div className="col-md-6">
                                            <h5>Crédito disponible</h5>
                                            <label style={{color:config.navBar.backgroundColor}}>
                                                <CurrencyFormat 
                                                    value={item.Disponible} 
                                                    displayType={'text'} 
                                                    thousandSeparator={true} 
                                                    fixedDecimalScale={true} 
                                                    decimalScale={2} 
                                                    prefix={'$ '}
                                                    suffix={config.general.currency}
                                                    >
                                                </CurrencyFormat>
                                            </label>
                                        </div>
                                    </div>
                                    <div className="row">
                                        
                                        <div className="col-md-6">
                                            {/* <h5>Total vencidos</h5>
                                            <label>
                                                <CurrencyFormat 
                                                    value={item.MontoVencido} 
                                                    displayType={'text'} 
                                                    thousandSeparator={true} 
                                                    fixedDecimalScale={true} 
                                                    decimalScale={2} 
                                                    prefix={'$ '}
                                                    suffix={config.general.currency}
                                                    >
                                                </CurrencyFormat>
                                            </label> */}
                                        </div>
                                    </div>
                                </div>
                            })}
                        </div>
                        <div className="modal-footer"  style={{ borderBottomLeftRadius: "10px", borderBottomRightRadius: "10px"}}>
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = store => {
    return {
        itemsReducer: store.ItemsReducer,
        notificationReducer: store.NotificationReducer,
        configReducer: store.ConfigReducer,
        shoppingCartReducer: store.ShoppingCartReducer
    };
}

const mapDispatchToProps = dispatch => {
    return {
        enableSpinner: value => dispatch({type: DISPATCH_ID.CONFIG_SET_SPINNER, value}),
        setItemDetailsSearch: value => dispatch({type: DISPATCH_ID.ITEMS_SET_ITEM_DETAILS, value}),
        setItemsSearch: value => dispatch({type: DISPATCH_ID.ITEMS_SET_ITEMS, value}),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(ProfieldModel);
