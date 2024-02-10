import React, { Component } from 'react';

import { config, SERVICE_API, VIEW_NAME, DISPATCH_ID } from "../libs/utils/Const";
import { connect } from "react-redux";
import '../index.css';
import 'semantic-ui-css/semantic.min.css'
import { Header, Button, Popup, Label  } from 'semantic-ui-react'




function Promociones  (props)  {
    let itemsNotificacion = props.itemsNotificacion;
    var x = window.matchMedia("(max-width: 600px)")
    return (
        <Popup trigger={<Label style ={{color: '#f44336', backgroundColor: 'white', fontSize: 'small', display:!x.matches ? 'block' : 'none', fontSize: 12}}>VER PROMOCIONES</Label >} flowing hoverable position='left center'>
            <Popup.Header> <div className="card-header text-white" style={{backgroundColor: '#005da8'}}>PROMOCIONES</div></Popup.Header>
             <Popup.Content>    
                <div className="card-body text-dark"  >
                    {!!itemsNotificacion && itemsNotificacion.map((items, index) => { 
                        let notificacion =  items.bonificacion;
                        return (
                            <div>
                                <div>
                                    <div >
                                        <strong>{ items.tipoVenta === 1 ? `En la compra de ${items.itemQuantity} piezas ${items.bonificacion.length > 0 ? items.bonificacion[0][0].idTipoSeleccion === 1 ?  'te bonificamos': 'selecciona la bonificación' : '' } `: items.tipoVenta === 2 ? `En la compra total de ${items.itemQuantity} piezas ${items.bonificacion.length > 0 ? items.bonificacion[0][0].idTipoSeleccion === 1 ? 'te bonificamos': 'selecciona la bonificación' : '' }` : '' }</strong> 
                                    </div>
                                <div>
                                </div>
                                    {notificacion.map((items)=>{
                                             return( 
                                                <div  style={{border: '2px solid #000',borderRadius: '10px', padding : '10px'}}>
                                                {items.map((item, index)=>{
                                                let imagesArray = item.U_Handel_ImagesArray || '';
                                                imagesArray = imagesArray.split('|');
                                                let imagenShow = imagesArray[0] ? (config.BASE_URL + SERVICE_API.getImage + '/' + imagesArray[0]) : require('../images/noImage.png');
                                                return (
                                                    <div className="col-sm-12 row" style={{margin: '10px'}}>
                                                        <div className='col-sm-2' style={{ margin: 0 }} >
                                                            <img
                                                                className="img-fluid "
                                                                style={{
                                                                    backgroundColor: 'white',
                                                                    maxHeight: 30,
                                                                }}
                                                                src={imagenShow}
                                                                alt=""
                                                            />                               
                                                        </div>
                                                        <div className="col-10" style={{ }}>
                                                            <div className='text-left'>
                                                                {item.ItemName}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                             </div>
                                        )
                                        
                                        
                                    })}
                                </div>
                            </div>
                        )
                    })}
                </div>
                 
            </Popup.Content>
        </Popup>
    )
}


// export default Promociones;

const mapStateToProps = store => {
    return {
        itemsReducer: store.ItemsReducer,
        shoppingCartReducer: store.ShoppingCartReducer
    };
};

const mapDispatchToProps = dispatch => {
    return {
        enableSpinner: value => dispatch({type: DISPATCH_ID.CONFIG_SET_SPINNER, value}),
        setShoppingCart: value => dispatch({ type: DISPATCH_ID.SHOPPING_CART_SAVE_CART, value }),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Promociones);