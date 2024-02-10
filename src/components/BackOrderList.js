import React, {Component} from 'react';
import {config, SERVICE_API} from "../libs/utils/Const";
import CurrencyFormat from 'react-currency-format';

class BackOrderList extends Component {
    render() {
        const {data, deleteItem, sendTo} = this.props;
        return (
            <div>
                {data.map((item, index) => {
                    return (
                        <div key={index} className='text-left card' style={{border: 'none', margin: 5, marginTop: 10, background: 'white'}}>
                            <div className='row' style={{padding: 20, textAlign: 'center'}}>
                                { item.U_FMB_Handel_Promo !== null && item.U_FMB_Handel_Promo !== '' && <div className='col-12' style={{marginBottom: 5, padding: 5, backgroundColor: config.navBar.backgroundColor, color: config.navBar.textColor}}>
                                    Promoción
                                </div>}
                                <div className='col-sm-4' style={{margin: 0}}>
                                    <img className="img-fluid" style={{ backgroundColor: 'white', maxHeight: 130 }}
                                        src={item.PicturName ? (config.BASE_URL + SERVICE_API.getImage + '/' + item.PicturName) : require('../images/noImage.png')}
                                        alt="Imagen del producto"
                                    />
                                </div>
                                <div className='col-sm-8'>
                                    <div className="container p-0">
                                        <div className="row">
                                            <div className="col-12">
                                                <div className='text-left'>
                                                    {item.ItemName}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row font-weight-bold">
                                            <div className="col-3 p-0">
                                                Clave
                                            </div>
                                            <div className="col-3 p-0">
                                                Precio unitario
                                            </div>
                                            <div className="col-3 p-0">
                                                Añadir al carrito
                                            </div>
                                            <div className="col-3 p-0">
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-3 p-0 pt-2 font-italic">
                                                {item.ItemCode}
                                            </div>
                                            <div className="col-3 p-0 pt-2">
                                                <CurrencyFormat 
                                                    value={item.Price} 
                                                    displayType={'text'} 
                                                    thousandSeparator={true} 
                                                    fixedDecimalScale={true} 
                                                    decimalScale={2} 
                                                    prefix={'$ '}
                                                    suffix={config.general.currency}>
                                                    
                                                </CurrencyFormat>
                                                {item.currency+" más I.V.A."}
                                            </div>
                                            <div className="col-3 p-0">
                                                {(!!item.OnHand) && <div className='row text-center' style={{margin: 0, padding: 0}}>
                                                    <div className='col-2' style={{color: config.navBar.backgroundColor, fontSize: 30, padding: 0}}>
                                                        {item.quantity && <i className={config.icons.shoppingCart} style={{cursor: 'pointer'}} onClick={() => sendTo(item)}/>}
                                                    </div>
                                                </div>}
                                            </div>
                                            <div className="col-3 p-0" style={{color: 'red', fontSize: 25, padding: 0}}>
                                                {item.quantity && <i className="fa fa-trash" style={{cursor: 'pointer'}} onClick={() => deleteItem({item, deleteAll: false})}/>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        );
    }
}

export default BackOrderList;