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
      items: 1,
      partialVisibilityGutter: 0 // this is needed to tell the amount of px that should be visible.
    }
  }

class CarouselTrademarks extends Component {

    render() {
        return (
            <Carousel className="carouselMarcas" style={{ justifyContent: "center", alignItems: "center"}} autoPlay infinite={true} draggable partialVisible={true} responsive={responsiveMarcas} autoPlaySpeed={5000} removeArrowOnDeviceType={["desktop","tablet", "mobile"]}>   
                <div className="text-center" style={{marginTop: "auto", marginBottom: "auto"}}>
                    <img className="img-fluid"
                        src={config.marcasScroll.One}
                        alt="Segundo NavBar"
                    />
                </div>
                <div className="text-center" style={{marginTop: "auto", marginBottom: "auto"}}>
                    <img className="img-fluid"
                        src={config.marcasScroll.Two}
                        alt="Segundo NavBar"
                    />
                </div>
                <div className="text-center" style={{marginTop: "auto", marginBottom: "auto"}}>
                    <img className="img-fluid"
                        src={config.marcasScroll.Three}
                        alt="Segundo NavBar"
                    />
                </div>
                <div className="text-center" style={{marginTop: "auto", marginBottom: "auto"}}>
                    <img className="img-fluid"
                        src={config.marcasScroll.Four}
                        alt="Segundo NavBar"
                    />
                </div>
                <div className="text-center" style={{marginTop: "auto", marginBottom: "auto"}}>
                    <img className="img-fluid"
                        src={config.marcasScroll.Five}
                        alt="Segundo NavBar"
                    />
                </div>
                <div className="text-center" style={{marginTop: "auto", marginBottom: "auto"}}>
                    <img className="img-fluid"
                        src={config.marcasScroll.Six}
                        alt="Segundo NavBar"
                    />
                </div>
                <div className="text-center" style={{marginTop: "auto", marginBottom: "auto"}}>
                    <img className="img-fluid"
                        src={config.marcasScroll.Seven}
                        alt="Segundo NavBar"
                    />
                </div>
                <div className="text-center" style={{marginTop: "auto", marginBottom: "auto"}}>
                    <img className="img-fluid"
                        src={config.marcasScroll.Eight}
                        alt="Segundo NavBar"
                    />
                </div>
                <div className="text-center" style={{marginTop: "auto", marginBottom: "auto"}}>
                    <img className="img-fluid"
                        src={config.marcasScroll.Nine}
                        alt="Segundo NavBar"
                    />
                </div>
                <div className="text-center" style={{marginTop: "auto", marginBottom: "auto"}}>
                    <img className="img-fluid"
                        src={config.marcasScroll.Ten}
                        alt="Segundo NavBar"
                    />
                </div>
                <div className="text-center" style={{marginTop: "auto", marginBottom: "auto"}}>
                    <img className="img-fluid"
                        src={config.marcasScroll.Eleven}
                        alt="Segundo NavBar"
                    />
                </div>
                <div className="text-center" style={{marginTop: "auto", marginBottom: "auto"}}>
                    <img className="img-fluid"
                        src={config.marcasScroll.Twelve}
                        alt="Segundo NavBar"
                    />
                </div>
                <div className="text-center" style={{marginTop: "auto", marginBottom: "auto"}}>
                    <img className="img-fluid"
                        src={config.marcasScroll.Thirteen}
                        alt="Segundo NavBar"
                    />
                </div>
                <div className="text-center" style={{marginTop: "auto", marginBottom: "auto"}}>
                    <img className="img-fluid"
                        src={config.marcasScroll.Fourteen}
                        alt="Segundo NavBar"
                    />
                </div>
                <div className="text-center" style={{marginTop: "auto", marginBottom: "auto"}}>
                    <img className="img-fluid"
                        src={config.marcasScroll.Fifteen}
                        alt="Segundo NavBar"
                    />
                </div>
                {/* <div className="text-center" style={{marginTop: "auto", marginBottom: "auto"}}>
                    <img className="img-fluid"
                        src={config.marcasScroll.Sixteen}
                        alt="Segundo NavBar"
                    />
                </div> */}
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
)(CarouselTrademarks);