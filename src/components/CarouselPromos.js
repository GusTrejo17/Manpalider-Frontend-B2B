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
      items: 2,
      partialVisibilityGutter: 0 // this is needed to tell the amount of px that should be visible.
    },
    desktop1: {
        breakpoint: { max: 1500, min: 1024 },
        items: 2,
        partialVisibilityGutter: 0 // this is needed to tell the amount of px that should be visible.
      },
    tablet: {
      breakpoint: { max: 1024, min: 768 },
      items: 1,
      partialVisibilityGutter: 0 // this is needed to tell the amount of px that should be visible.
    },
    tablet1: {
        breakpoint: { max: 768, min: 576 },
        items: 1,
        partialVisibilityGutter: 0 // this is needed to tell the amount of px that should be visible.
      },
    mobile: {
      breakpoint: { max: 576, min: 0 },
      items: 1,
      partialVisibilityGutter: 0 // this is needed to tell the amount of px that should be visible.
    }
  }

  class CarouselPromos extends Component {

    constructor(props) {
        super(props);
        const api = config.BASE_URL;
        const assets = config.ASSETS;
        this.state = {
            urlapi: api,
            banners: [],
            assets:assets,
        };
        
    }
    componentDidMount= async () => {
        await fetch(`${this.state.urlapi}/getbanners`, { method: 'GET', mode: 'cors', cache: 'default' })
        .then(res => res.json())
        .then(res => {
            let response = res;

            this.setState({
                banners: response
            });
        });
      }
    render() {
        const{ banners,assets} = this.state
        const section = 'Secundaria'
        {/*let filtrado = banners.filter(banner => banner.section === section && banner.url !== '' && banner.url !== null )*/}
        let filtrado = banners.filter(banner => banner.section === section)       
        return (
            <div>
                <Carousel
                    responsive={responsiveMarcas}
                    infinite={true}
                    autoPlay={true}
                    autoPlaySpeed={3000}
                    // slidesToSlide={2}
                    arrows={false}
                    
                    containerClass="carousel-container"
                >
                    {filtrado.map((item,index) => (                      
                    <div key={index} style={{margin: '2%'}}>
                         <a href={item.url === '' ? '#' : item.url} target={item.url === '' ? '' : '_blank'} rel="noopener noreferrer">
                            <img src={assets + 'banners/' + item.image} alt={`Imagen ${item.id}`} style={{objectFit: 'cover',maxHeight:'350px',height: '100%',width: '100%'}} />
                         </a>
                    </div>
                    ))}
                </Carousel>
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
    mapDispatchToProps,
)(CarouselPromos);