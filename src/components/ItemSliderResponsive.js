import React, { Component } from 'react';
import { config, SERVICE_API, VIEW_NAME } from '../libs/utils/Const';
import { ItemDetailsModal } from "./index";
import CurrencyFormat from 'react-currency-format';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ItemSlider from './ItemSlider';
import './ItemSlider.css';

let settings;

class ItemSliderResponsive extends Component {

    changeQuantity = (index, item, event) => {
        const { changeQuantity, notificationReducer: {showAlert} } = this.props;

        let newQuantity = event.nativeEvent.target.value;
        let onHand = item.OnHand;

        // if (newQuantity > onHand) {
        //     if (onHand !== 0 ) {
        //         showAlert({type: 'warning', message: "Se excede el número de articulos disponibles de este producto", timeOut: 2500});
        //     }
        //     newQuantity = onHand;
        // }
        // if(Number(newQuantity) > Number(item.OnHand)) {
        //     if (Number(onHand) !== 0 ) {
        //         showAlert({type: 'warning', message: "No se cuenta con stock disponible, se surtirá el resto en cuanto se tenga el stock.", timeOut: 8000});
        //     }
        // } 

        // if (!newQuantity) {
        //     changeQuantity(index, item, newQuantity, false); //delete
        // } else {
            changeQuantity(index, item, newQuantity, true); // add
        // }
    };

    render() {
        const { items, changeBackOrder, updateFavorite, deleteShoppingCart, openDetails } = this.props;
        let h1=items.length;

        if (h1 >=4){
            settings = {
                dots: true,
                horizontal: true,
                infinite: true,
                speed: 500,
                slidesToShow: 1,
                slidesToScroll: 1,

            };

        }else{
         
            settings = {
                dots: true,
                horizontal: true,
                infinite: true,
                speed: 500,
                slidesToShow: 1,
                slidesToScroll: 1
            };

        }
        return (
            <div>
                {/* <ItemDetailsModal view={VIEW_NAME.ITEMS_VIEW} /> */}
                < Slider {...settings}>
                    {items && items.map((item, index) => {

                        item.ItemName = item.ItemName || '';

                        return (
                            <div className="imageCard" style={{ position: 'relative', textAlign: 'center' }} key={item.ItemCode + item.ItemName + item.Price}>
                                <div className="item card" style={{ }}>
                                    <div >
                                        <div 
                                            className="titleCard"
                                            style={{
                                                display: (item.U_FMB_Handel_Promo !== null && item.U_FMB_Handel_Promo !== '' ? 'none' : 'table'),
                                                position: 'absolute',
                                                borderBottomRightRadius: 25,
                                                color: 'white',
                                                // width: '15rem',
                                        }}>
                                            <h4>Promoción</h4>
                                        </div>
                                        <img
                                            onClick={() => openDetails(item)}
                                            className="card-img-top"
                                            style={{
                                                // width: '15rem',
                                                // height: '15rem',
                                                backgroundColor: 'white',
                                                cursor: 'pointer'
                                            }}
                                            src={item.PicturName ? (config.BASE_URL + SERVICE_API.getImage + '/' + item.PicturName) : require('../images/noImage.png')}
                                            alt=""
                                        />
                                        <div className="card-body" style={{ margin: 0, padding: 0, color: config.itemsList.textColor }}>
                                            <div className="overflow-auto">
                                                <p className="card-title font-weight-bold text-left" style={{ margin: 0, padding: 0, fontSize: 14, height: '3rem' }}>
                                                    {/*item.ItemName.length > 43 ? item.ItemName.substring(0, 42 ) + "..." : item.ItemName*/}
                                                    {item.FrgnName}
                                                </p>
                                            </div>
                                            <div className='row'>
                                                <div className='col-12' style={{ padding: 8 }}>
                                                    <h6 className="card-subtitle text-left" style={{ fontSize: 12, marginLeft: 3 }}>{item.ItemCode}</h6>
                                                    <h6 className="card-subtitle font-weight-bold text-left" style={{ fontSize: 16, margin: 2, color: config.itemsList.textPrice }}>
                                                        {item.U_web === 0 || item.U_web === null
                                                            ? "Solicite su cotización"
                                                            : <CurrencyFormat
                                                                value={item.Price}
                                                                displayType={'text'}
                                                                thousandSeparator={true}
                                                                fixedDecimalScale={true}
                                                                decimalScale={2}
                                                                prefix={'$ '}>
                                                            </CurrencyFormat>
                                                        }
                                                        {item.U_web === 1 &&
                                                            " " + item.currency
                                                        }
                                                    </h6>
                                                </div>
                                                <div className='col-3' style={{ padding: 0, margin: 0, }}>
                                                    <div onClick={() => updateFavorite(item)} style={{ padding: 0 }}>
                                                        {/*<i
                                                        className={config.icons.favorite}
                                                        aria-hidden="true"
                                                        style={{
                                                            cursor: 'pointer',
                                                            padding: 0,
                                                            margin: 0,
                                                            marginTop: 9,
                                                            fontSize: 30,
                                                            zIndex: 10,
                                                            color: item.favorite ? config.itemsList.iconColor : 'rgba(124, 124, 125, 0.5)',
                                                        }}
                                                    />*/}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-footer">
                                        <div className='row text-center' style={{ margin: 0, padding: 0 }}>
                                            {item.U_web === 0 || item.U_web === null
                                                ? <div className='col-12' style={{ padding: 0 }}>
                                                    <label style={{ textAlign: 'center', fontSize: 16 }}>Llámenos o envíe un correo</label>
                                                </div>
                                                : <div className='col-10' style={{ padding: 0 }}>
                                                    <input
                                                        disabled={!(!!item.OnHand)}
                                                        id={'input-quantity-' + item.ItemCode + index}
                                                        type="number"
                                                        min="1"
                                                        value={item.quantity ? Number(item.quantity) : ''}
                                                        className="form-control"
                                                        name={'quantity' + item.ItemCode}
                                                        placeholder="Cantidad"
                                                        style={{ textAlign: 'center', marginTop: 1, height: 30 }}
                                                        onChange={(event) => { this.changeQuantity(index, item, event) }}
                                                    //onKeyDown={event => event.keyCode == 13 && this.addShoppingCart(item, 'input-quantity-' + item.ItemCode + index)}
                                                    />
                                                </div>
                                            }
                                            {item.U_web === 1 &&
                                                <div className='col-2' style={{ color: 'red', fontSize: 20, padding: 0 }}>
                                                    {item.quantity && <i className={config.icons.trash} style={{ cursor: 'pointer' }} onClick={() => deleteShoppingCart({ item, deleteAll: false })} />}
                                                </div>
                                            }
                                        </div>
                                        <div className='row text-center' style={{ margin: 0, padding: 0 }}>
                                            {item.U_web === 0 || item.U_web === null
                                                ? item.wishlist === 1 &&
                                                <div className='col-12' style={{ padding: 0 }}>
                                                    <label style={{ textAlign: 'center', fontSize: 16 }}>para cotización</label>
                                                </div>
                                                : item.wishlist === 1 &&
                                                <div className='col-10'>
                                                    <label style={{ textAlign: 'center', marginTop: 12, fontSize: 14 }}>Lista de deseos</label>
                                                </div>
                                            }
                                            {item.U_web === 1 &&
                                                item.wishlist === 1 &&
                                                <div className='col-2' style={{ color: config.navBar.backgroundColor, fontSize: 20, padding: 0 }}>
                                                    {item.backOrder
                                                        ? <i className={config.icons.backOrderFalse} style={{ cursor: 'pointer', marginLeft: 7, marginTop: 15 }} onClick={() => changeBackOrder(item, false)} />
                                                        : <i className={config.icons.backOrderTrue} style={{ cursor: 'pointer', marginLeft: 7, marginTop: 15 }} onClick={() => changeBackOrder(item, true)} />
                                                    }
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </ Slider>
            </div>
        );
    }
}

export default ItemSliderResponsive;
