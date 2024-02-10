import React, { Component } from 'react';
import {DISPATCH_ID, SERVICE_RESPONSE, config, ROLES,VIEW_NAME} from '../libs/utils/Const';
import {connect} from 'react-redux';
import {ApiClient} from "../libs/apiClient/ApiClient";
import $ from 'jquery';
import moment from 'moment';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

let apiClient = ApiClient.getInstance();
const responsiveMarcas = {
    desktop: {
      breakpoint: { max: 3000, min: 1500 },
      items: 7,
      partialVisibilityGutter: 0 // this is needed to tell the amount of px that should be visible.
    },
    desktop1: {
        breakpoint: { max: 1500, min: 1024 },
        items: 5,
        partialVisibilityGutter: 0 // this is needed to tell the amount of px that should be visible.
      },
    tablet: {
      breakpoint: { max: 1024, min: 768 },
      items: 4,
      partialVisibilityGutter: 0 // this is needed to tell the amount of px that should be visible.
    },
    tablet1: {
        breakpoint: { max: 768, min: 576 },
        items: 3,
        partialVisibilityGutter: 0 // this is needed to tell the amount of px that should be visible.
      },
    mobile: {
      breakpoint: { max: 576, min: 0 },
      items: 3,
      partialVisibilityGutter: 0 // this is needed to tell the amount of px that should be visible.
    }
  }

class CarouselPromos extends Component {

    render() {
        return (
            <Carousel className="carouselMarcas mt-3" style={{ justifyContent: "center", alignItems: "center"}} autoPlay infinite={true} draggable partialVisible={true} responsive={responsiveMarcas} autoPlaySpeed={5000} removeArrowOnDeviceType={["desktop","tablet", "mobile"]}>   
                <div className="text-center" style={{marginTop: "auto", marginBottom: "auto"}}>
                    <img className="img-fluid m-2" src={config.advantagesScroll.One} alt="Segundo NavBar" style={{maxHeight:"50px"}}/>
                    <label className='d-block' style={{fontSize: "11px"}}>Envíos Nacionales</label>
                </div>
                <div className="text-center" style={{marginTop: "auto", marginBottom: "auto"}}>
                    <img className="img-fluid m-2"src={config.advantagesScroll.Two} alt="Segundo NavBar" style={{maxHeight:"50px"}}/>
                    <label className='d-block' style={{fontSize: "11px"}}>Tiempos de entrega</label>
                </div>
                <div className="text-center" style={{marginTop: "auto", marginBottom: "auto"}}>
                    <img className="img-fluid m-2" src={config.advantagesScroll.Three} alt="Segundo NavBar" style={{maxHeight:"50px"}}/>
                    <label className='d-block' style={{fontSize: "11px"}}>Precios competitivos</label>
                </div>
                <div className="text-center" style={{marginTop: "auto", marginBottom: "auto"}}>
                    <img className="img-fluid m-2" src={config.advantagesScroll.Four} alt="Segundo NavBar" style={{maxHeight:"50px"}}/>
                    <label className='d-block' style={{fontSize: "11px"}}>Opciones de pago</label>
                </div>
                <div className="text-center" style={{marginTop: "auto", marginBottom: "auto"}}>
                    <img className="img-fluid m-2" src={config.advantagesScroll.Five} alt="Segundo NavBar" style={{maxHeight:"50px"}}/>
                    <label className='d-block' style={{fontSize: "11px"}}>Servicio al cliente</label>
                </div> 
            </Carousel>
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
    mapDispatchToProps,
)(CarouselPromos);