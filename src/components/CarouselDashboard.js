import React, {Component} from 'react';
import Async from 'react-async';
import { Link } from "react-router-dom";
import {config} from "../libs/utils/Const";
import Carousel from 'react-bootstrap/Carousel'
import './CarouselDashboard.css';

class CarouselDashboard extends Component {

    constructor(props){
        super(props);
        const api = config.BASE_URL;
        const assets = config.ASSETS;
        this.state = {
            urlapi: api,
            assets: assets,
            banners: []
        };
    }
    
    async componentDidMount(){
        this.cargarDatos(); 
    };
    
    async cargarDatos (){
        fetch(`${this.state.urlapi}/getbanners`, { method: 'GET', mode: 'cors', cache: 'default' })
        .then(res => res.json())
        .then(res => {
            let response = res;

            this.setState({
                banners: response
            });
        });
    };

    // We'll request user data from this API
    loadActiveBanners = () => fetch(`${this.state.urlapi}/admin/getbanners`, { method: 'POST', mode: 'cors', cache: 'default'})
    .then(res => (res.ok ? res : Promise.reject(res)))
    .then(res => res.json());

    renderCarouselImage = (imagePath, index) => {
        return (<div key={index + 'q'} className={"carousel-item" + (!index ? ' active' : '')} style={{backgroundColor: 'rgba(248,249,250,0.6)'}}>
            <img className="img-fluid" src={imagePath} alt="First slide"/>
        </div>);
    };

    renderIndicator = (imagePath, index) => (
        <li key={index + 'w'} data-target="#carouselDashboard" data-slide-to={index}  className={!index ? ' active':''}/>
    );

    render() {
        let images = config.carousel.images;
        const { assets,banners } = this.state;
        const {section} = this.props
        return (
            <div>
            <div className="continer carouselDash" style={{marginTop: 0, paddingTop: "0"}}>
                <div id="carouselExampleCaptions" className="carousel slide carousel-fade" data-ride="carousel">
                <Async promiseFn={this.loadActiveBanners}>
                    <Async.Loading>Cargando...</Async.Loading>
                    <Async.Fulfilled>
                    {/* {data => {
                        return (
                        <ol className="carousel-indicators">
                            {data.map((rows, index) => (
                            <li data-target="#carouselExampleCaptions" data-slide-to={index} className={index === 0 ? 'active' : ''} key={index}></li>
                            ))
                            }
                        </ol>
                        )
                    }} */}
                    </Async.Fulfilled>
                    <Async.Rejected>
                    {error => `Something went wrong: ${error.message}`}
                    </Async.Rejected>
                </Async>
                <Async promiseFn={this.loadActiveBanners}>
                    <Async.Loading>Cargando...</Async.Loading>
                    <Async.Fulfilled>
                    {data => {
                      let filtrado = data.filter(banner => banner.section === section);
                      return (
                        <div className="carousel-inner">
                          {filtrado.map((rows, index) => (
                            <div className={'carousel-item ' + (index === 0 ? 'active' : '')} key={index}>
                              {rows.url !== '' && rows.url !== null ? (
                                <a href={rows.url} target="_blank" rel="noopener noreferrer">
                                  <img src={assets + 'banners/' + rows.image} className="d-block w-100" alt={rows.image} />
                                </a>
                              ) : (
                                <img src={assets + 'banners/' + rows.image} className="d-block w-100" alt={rows.image} />
                              )}
                            </div>
                          ))}
                        </div>
                      );
                    }}

                    </Async.Fulfilled>
                    <Async.Rejected>
                    {error => `Something went wrong: ${error.message}`}
                    </Async.Rejected>
                </Async>
                <a className="carousel-control-prev" href="#carouselExampleCaptions" role="button" data-slide="prev">
                    <span className="carousel-control-prev-ico" aria-hidden="true">
                        <img className='mr-2' src={config.icons.prev} style={{maxWidth: "30px"}}/>
                    </span>
                    <span className="sr-only">Previous</span>
                </a>
                <a className="carousel-control-next" href="#carouselExampleCaptions" role="button" data-slide="next">
                    <span className="carousel-control-next-ico" aria-hidden="true">
                        <img className='mr-2' src={config.icons.next} style={{maxWidth: "30px"}}/>
                    </span>
                    <span className="sr-only">Next</span>
                </a>
                </div>

            </div>
                {/* <div>
                    <Carousel indicators={false}>
                        {banners.map((rows, index) =>(
                            <Carousel.Item interval={4000}>
                                <img className="d-block w-100" src={assets + 'banners/' + rows.image} alt={rows.image}/>                                
                            </Carousel.Item>
                        ))}
                    </Carousel>
                </div> */}
            </div>
        );
    }
}

export default CarouselDashboard;