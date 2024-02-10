import React, { Component } from 'react';
import { Session, NavBar, CarouselDashboard, Slider, Footer, MenuCategories, ItemsList, ItemSlider, ItemSliderResponsive,CategoriesPopular, Suscription, TopNavBar, CarouselTrademarks, ItemSlider1, ItemSlider2, CarouselAdvantages, CarouselPromos} from '../../components';
import { config, VIEW_NAME, SERVICE_API, DISPATCH_ID, ROLES } from '../../libs/utils/Const';
import { connect } from "react-redux";
import { Prueba } from '../../components/MenuCategories';
import { ApiClient } from "../../libs/apiClient/ApiClient";
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import './Categories.css';
import { animateScroll as scroll, scroller } from 'react-scroll';

const apiClient = ApiClient.getInstance();
const responsiveCategories = {

    desktop: {
        breakpoint: { max: 3000, min: 1920 },
        items: 6,
        partialVisibilityGutter: 10 // this is needed to tell the amount of px that should be visible.
    },

    desktop2: {
        breakpoint: { max: 1920, min: 1200 },
        items: 4,
        partialVisibilityGutter: 10 // this is needed to tell the amount of px that should be visible.
    },

    tablet: {
        breakpoint: { max: 1200, min: 992 },
        items: 4,
        partialVisibilityGutter: 10 // this is needed to tell the amount of px that should be visible.
    },

    tablet1: {
        breakpoint: { max: 992, min: 767 },
        items: 3,
        partialVisibilityGutter: 10 // this is needed to tell the amount of px that should be visible.
    },

    tablet2: {
        breakpoint: { max: 767, min: 580 },
        items: 2,
        partialVisibilityGutter: 10 // this is needed to tell the amount of px that should be visible.
    },

    mobile: {
        breakpoint: { max: 579, min: 0 },
        items: 1,
        partialVisibilityGutter: 10 // this is needed to tell the amount of px that should be visible.
    }
}

class DashboardView extends Component {

    constructor(props) {
        super(props);

        this.state = {
            itemsPromociones: [],//CODIGO DEL PRODUCTO EN UN ARREGLO DE DASH
            itemsNuevos: [],
            items: [],
            categories: [],
            banner: [],

        };
        this.scrollToBottom = this.scrollToBottom.bind(this);
    };

    async componentDidMount() {
        const { enableSpinner , setCategoriesBanner} = this.props;
        
        try {
            let categoriesHomeResponse = await apiClient.getCategoriesHome('home');
            let bannerHommeResponse = await apiClient.getBannerHome();
            await this.setState({
                categories: categoriesHomeResponse.data,
                banner:  bannerHommeResponse.data,
            });
            await this.scrollToBottom();
            await apiClient.getCategorias().then(result => {
                if (result.length > 0 ) {
                    setCategoriesBanner(result)
                }
            });
        } catch (error) {
        }
    }

    scrollToBottom() {
        scroll.scrollToTop({
            duration: 1000,
            delay: 100,
            smooth: 'easeOutQuart',
            isDynamic: true
        })
    }

    mostrarCategoria = (valor) => {
        const { setCategory, setIdCategory, setLocation, itemsReducer: { searchByCategories }, setNextPage } = this.props;
        setIdCategory(valor);
        setNextPage(0);
        setLocation('menuCategories');
        searchByCategories(valor);
    };


    changeQuantity = (index, item, newQuantity, addItem) => {
        const { itemsReducer: { addShoppingCart, deleteShoppingCart } } = this.props;
        if (addItem) {
            addShoppingCart({ item, quantity: (newQuantity || '1') })
        } else {
            deleteShoppingCart({ item, deleteAll: false });
        }
    };
    
    changeBackOrder = (item, addItem) => {
        const { itemsReducer: { deleteBackOrder, addBackOrder } } = this.props;
        if (addItem) {
            addBackOrder({ item, quantity: 1 })
        } else {
            deleteBackOrder({ item, deleteAll: false });
        }
    };

    

    redirectPaymentMethod = async () => {
        const { configReducer: { history } } = this.props;
        history.goPaymentMethodView();
    };

    redirectSafeShopping = async () => {
        const { configReducer: { history } } = this.props;
        history.goSafeShopping();
    };

    VerMas = (name) => {
        let result = '';
        switch (name) {
            case 'Asesoria':
                result = (this.redirectgoAsesoria);
                break;
            case 'RedZone':
                result = (this.redirectAboutRedZone);
                break;
            case 'BlogNoticias':
                result = (this.redirectNewsBlog);
                break;
            case 'Nosotros':
                result = (this.redirectAboutUs);
                break;
            default:
                result = (this.redirectgoHome);
                break;
        }
        return result
    }

    redirectgoAsesoria = async () => {
        const { configReducer: { history } } = this.props;
        history.goAsesoria();
    };

    redirectAboutRedZone = async () => {
        const { configReducer: { history } } = this.props;
        history.goAboutRedZone();
    };

    redirectNewsBlog = async () => {
        const { configReducer: { history } } = this.props;
        history.goNewsBlog();
    };

    redirectAboutUs = async () => {
        const { configReducer: { history } } = this.props;
        history.goAboutUs();
    };


    render() {
        const { history, itemsReducer: { updateFavorite, deleteShoppingCart, openItemDetails, items1, items2 } } = this.props;
        const { categories, items, banner, itemsPromociones, itemsNuevos } = this.state;
        return (
            <>
            {false?
                <div className="container-fluid" style={{ marginTop: 150, backgroundColor: "#fff", paddingLeft: 0, paddingRight: 0 }}>
                    <Session history={history} view={VIEW_NAME.DASHBOARD_VIEW} />
                    <NavBar/>
                    <div className="overflow-auto">
                        {/* Si es un video */}
                        {config.dashboard === 'Video' && <Slider />}
                        {/* Si es un video */}
                        {config.dashboard === 'Carousel' && <CarouselDashboard section={'Principal'} />}
                        <TopNavBar />
                        <br></br>
                        <div className="container" style={{ marginTop: "0.5rem" }}>
                            <div class="row">
                                <div class="col-sm">
                                    <img className="img-fluid " src={config.gif.gif} alt="loading..." />
                                </div>
                            </div>
                        </div>
                        <div className="col-md-12">
                            <p><br></br></p>
                            {/* <p className="titulodeSeccionRefacciones">Productos</p> */}
                        </div>
                        {/* <div className="refacciones">
                            <Carousel autoPlay infinite={true} draggable={true} responsive={responsiveCategories} autoPlaySpeed={2500} removeArrowOnDeviceType={["tablet", "mobile", "tablet1", "tablet2"]}>
                                {categories &&
                                    categories.length !== 0 &&
                                    categories.map((categoria, index) => {
                                        return (
                                            <div style={{ alignItems: 'center', textAlign: "center", display: 'flex', justifyContent: 'center', margin: 0 }} key={index}>
                                                <div className="item carousel-DashBoard-img" style={{ wordWrap: "break-word", width: "13rem", height: "fit-content", background: 'transparent', border: "none" }} onClick={() => this.mostrarCategoria(categoria.idCategory)} >
                                                    <div>
                                                        <img className="card-img-top img-fluid" style={{ width: "100%", height: "250px", cursor: "pointer", background: 'transparent', borderRadius: ".8rem", marginBottom: ".5rem" }} src={categoria.image ? (config.BASE_URL + SERVICE_API.getImageCategories + '/' + categoria.image) : require("../../images/noImage.png")} />
                                                    </div>
                                                    <div className="card-body" style={{ margin: 0, padding: 0, color: config.itemsList.textColor2 }}>
                                                        <div className="overflow-auto">
                                                            <p className="card-title font-weight-bold text-center" style={{ margin: 0, padding: 0, fontSize: 16, height: '3rem', color: "#0078C0" }}>
                                                                {categoria.itemCode}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                }
                            </Carousel>
                        </div><br></br> */}
                        {/* <div className="text-justify col-md-12">
                        <p><br></br></p>
                        <p className="titulodeSeccionPromoRed" style={{marginTop:"39px", marginBottom:"-66px"}}>Promociones</p>
                        </div> */}
                        <div style={{ padding: 15 }}>
                            <div className="PromoRedSlider" style={{ paddingTop: 10, margin: 0, justifyContent: "center", alignItems: "center" }}>
                                {items1 &&
                                    items1.length !== 0 ? (
                                    <ItemSlider1 changeQuantity={this.changeQuantity} dashboard={10} changeBackOrder={this.changeBackOrder} />
                                ) : (
                                    <div style={{ paddingTop: 100, margin: 0, textAlign: "center" }}>No hay artículos disponibles de momento:
                                        <br />
                                        <br />
                                        <i style={{ fontSize: 70 }} className={config.icons.search}></i>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="text-justify col-md-12">
                            <p><br></br></p>
                            {/* <p className="titulodeSeccionDescubre">Descubre</p> */}
                        </div>
                        <div style={{ paddingTop: 30 }}>
                            <div className="cardsDescubre col-lg-12 row" style={{ color: "white" }}>
                                {banner.length !== 0 &&
                                    banner.map((ban, index) => {
                                        return (
                                            ban.active === "on" &&
                                            <div className="col-lg-6 col-md-6 pb-2" key={index}>
                                                <div className="ConoceTarjeta card img-fluid" style={{ border: 'none', background: "transparent" }}>
                                                    <img
                                                        className="card-img-top"
                                                        src={ban.image ? (config.BASE_URL + SERVICE_API.getImageCategories + '/' + ban.image) : require('../../images/noImage.png')}
                                                        alt="Card image"
                                                        style={{ width: "100%" }}></img>
                                                    <div className="card-img-overlay">
                                                        <a onClick={this.VerMas(ban.Name)} className="btn text-white"
                                                            style={{ background: "#0076bb", marginTop: "25%", marginLeft: 30 }}>
                                                            {'Ver más'}
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                        <div className="text-justify col-md-12">
                            <p><br></br></p>
                        </div>
                        <div style={{ padding: 15 }}>
                            <div style={{ paddingTop: 30, margin: 0, justifyContent: "center", alignItems: "center" }}>
                                {items2 &&
                                    items2.length !== 0 ? (
                                    <ItemSlider2 changeQuantity={this.changeQuantity} dashboard={10} changeBackOrder={this.changeBackOrder} />
                                ) : (
                                    <div style={{ paddingTop: 100, margin: 0, textAlign: "center" }}>No hay artículos disponibles de momento:
                                        <br />
                                        <br />
                                        <i style={{ fontSize: 70 }} className={config.icons.search}></i>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="envios col-lg-12 row mt-4 text-center pt-4 pb-4">
                            <div className="pagosTarjeta col-lg-4 col-md-4">
                                <img src={config.trademarks.pagoTarjeta}></img>
                                <h5 className="mt-2 font-weight-bold">Paga con tarjeta de crédito o débito</h5>
                                <p >Realizar tus pagos de manera segura <br /> en nuestra plataforma.</p><br />
                                <a className="font-weight-bold" onClick={this.redirectPaymentMethod}>¿Cómo pagar con E-HANDEL?</a>
                            </div>
                            <div className="enviosRepublica col-lg-4 col-md-4">
                                <img src={config.trademarks.enviosRepublica}></img>
                                <h5 className="mt-2 font-weight-bold">Envíos a toda la República Mexicana</h5>
                                <p >No importa en qué parte de México estés, <br /> nosotros te lo enviamos.</p><br />
                            </div>
                            <div className="comprasSeguras col-lg-4 col-md-4">
                                <img src={config.trademarks.comprasSeguras}></img>
                                <h5 className="mt-2 font-weight-bold">Compras seguras</h5>
                                <p >Realizar tus pagos de manera segura <br /> en nuestra plataforma.</p><br />
                                <a className="font-weight-bold" onClick={this.redirectSafeShopping}>Conoce más sobre nuestros métodos de pagos</a>
                            </div>
                        </div>

                        {/* sección de marcas */}
                        <div className=" text-center">
                            <CarouselTrademarks />
                        </div>
                        <div className='col-md-12 popular-categories-section'>
                                <p className="tituloCategorias">Categorias más populares</p>
                                <div style={{padding: 15}}>
                                <div style={{ paddingTop: 30, margin: 0, justifyContent: "center", alignItems: "center" }}>
                                <CategoriesPopular/>
                                </div>
                                </div>
                            </div>
                        <Suscription />
                    </div >
                    <Footer />
                </div >
            :
                <div className="container-fluid" style={{ marginTop: 130, backgroundColor: "#fff", paddingLeft: 0, paddingRight: 0 }}>
                    <Session history={history} view={VIEW_NAME.DASHBOARD_VIEW} />
                    <NavBar/>
                    <div className="overflow-auto"> 
                        {/* Banners */}
                        {config.dashboard === 'Carousel' &&
                            <CarouselDashboard section={'Principal'}/>
                        }
                        {/* Ventajas  */}
                        <div className='col-xl-11 ml-xl-auto mr-xl-auto' >
                            <CarouselAdvantages 
                                redirectPaymentMethod={this.redirectPaymentMethod}
                                redirectSafeShopping={this.redirectSafeShopping}
                            />                       
                            <br></br>
                            <CarouselPromos/>
                            <br></br>

                            <div className="col-md-12 ml-4">
                                <p><br></br></p>
                                <p className="tituloMejores" style={{fontSize: "28px"}} >¡Las mejores ofertas y promociones para ti!</p>
                            </div>
                            <div style={{ padding: 15 }}>
                                <div className="PromoRedSlider" style={{ paddingTop: 10, margin: 0, justifyContent: "center", alignItems: "center" }}>
                                    {items1 &&
                                        items1.length !== 0 ? (
                                        <ItemSlider1 changeQuantity={this.changeQuantity} dashboard={10} changeBackOrder={this.changeBackOrder} />
                                    ) : (
                                        <div style={{ paddingTop: 100, margin: 0, textAlign: "center" }}>No hay artículos disponibles de momento:
                                            <br />
                                            <br />
                                            <i style={{ fontSize: 70 }} className={config.icons.search}></i>
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            <div className="col-md-12 ml-4" >
                                <p><br></br></p>
                                <p className="tituloPopulares" style={{fontSize: "28px"}} >Productos más populares</p>
                                
                            </div>
                            <div style={{ padding: 15 }}>
                                <div style={{ paddingTop: 30, margin: 0, justifyContent: "center", alignItems: "center" }}>
                                    {items2 &&
                                        items2.length !== 0 ? (
                                        <ItemSlider2 changeQuantity={this.changeQuantity} dashboard={10} changeBackOrder={this.changeBackOrder} />
                                    ) : (
                                        <div style={{ paddingTop: 100, margin: 0, textAlign: "center" }}>No hay artículos disponibles de momento:
                                            <br />
                                            <br />
                                            <i style={{ fontSize: 70 }} className={config.icons.search}></i>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="col-md-12">
                                <p><br></br></p>
                                {/* <p className="titulodeSeccionDescubre">Descubre</p> */}
                            </div>
                        </div>
                            
                        {/* sección de marcas
                        <div className=" text-center">
                            <CarouselTrademarks />

                        </div> */}
                        <div className='col-md-12 popular-categories-section' style={{marginBottom:'3rem'}}>
                                <p className="tituloCategorias" style={{fontSize: "28px"}} >Categorias más populares</p>
                                <div style={{padding: 15}}>
                                <div style={{ paddingTop: 30, margin: 0, justifyContent: "center", alignItems: "center" }}>
                                <CategoriesPopular/>
                                </div>
                            </div>
                            </div>
                            {/* sección de marcas */}
                            <div className=" text-center">
                                <CarouselTrademarks />
                            </div>
                        <Suscription />
                    </div >
                    <Footer />
                </div >
            }
            </>
        );
    }
}

const mapStateToProps = store => {
    return {
        itemsReducer: store.ItemsReducer,
        sessionReducer: store.SessionReducer,
        configReducer: store.ConfigReducer,
        notificationReducer: store.NotificationReducer,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        enableSpinner: value => dispatch({ type: DISPATCH_ID.CONFIG_SET_SPINNER, value }),
        setItemsSearch: value => dispatch({ type: DISPATCH_ID.ITEMS_SET_ITEMS, value }),
        setItemsFilterSearch: value => dispatch({ type: DISPATCH_ID.ITEMS_SAVE_ITEMS_FILTER, value }),
        setTotalRows: value => dispatch({ type: DISPATCH_ID.ITEMS_SET_TOTALROWS, value }),
        setItemsCategories: value => dispatch({ type: DISPATCH_ID.ITEMS_SET_CATEGORIES, value }),
        setLocation: value => dispatch({ type: DISPATCH_ID.ITEMS_SET_LOCATION, value }),
        setDashboard: value => dispatch({ type: DISPATCH_ID.ITEMS_SET_DASH, value }),
        searchByDashOption: value => dispatch({ type: DISPATCH_ID.ITEMS_SET_SEARCH_BY_DASH_OPTION, value }),
        setCategory: value => dispatch({ type: DISPATCH_ID.ITEMS_SET_CATEGORY, value }),
        setIdCategory: value => dispatch({ type: DISPATCH_ID.ITEMS_SET_IDCATEGORY, value }),
        setNextPage: value => dispatch({ type: DISPATCH_ID.ITEMS_SET_NEXTPAGE, value }),
        setCategoriesBanner: value => dispatch({ type: DISPATCH_ID.ITEMS_SET_CATEGORIES_BANNER, value }),
    };
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DashboardView);