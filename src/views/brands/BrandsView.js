import React, { Component } from 'react';
import { DISPATCH_ID, SERVICE_RESPONSE, config, ROLES, VIEW_NAME, SERVICE_API } from '../../libs/utils/Const';
import { connect } from 'react-redux';
import { ApiClient } from "../../libs/apiClient/ApiClient";
import $ from 'jquery';
import moment from 'moment';
import './brands.css'
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { NavBar, Session } from "../../components";

let apiClient = ApiClient.getInstance();


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
class Brands extends Component {
    constructor(props) {
        super(props);

        this.state = {
            categories: [],
        };
    }

    async componentDidMount() {
        const { enableSpinner } = this.props;
        
        try {
            let categoriesHomeResponse = await apiClient.getCategoriesHome('home');
            // let bannerHommeResponse = await apiClient.getBannerHome();
            await this.setState({
                categories: categoriesHomeResponse.data,
                // banner:  bannerHommeResponse.data,
            });
            await this.scrollToBottom();
        } catch (error) {
        }
    }
    // mostrarCategoria = (valor) => {
    //     const { setCategory, setIdCategory, setLocation, itemsReducer: { searchByCategories }, setNextPage } = this.props;
    //     setIdCategory(valor);
    //     setNextPage(0);
    //     setLocation('menuCategories');
    //     searchByCategories(valor);
    // };
    mostrarCategoria = async (valor) => {
        const { setItemsFilters,setIdCategory, setLocation, itemsReducer: { searchByCategories,searchCategoryObj }, setNextPage,setSearchCategoryObj } = this.props;
        setIdCategory(valor);
        setNextPage(0);
        setItemsFilters({ property: 'brand', value: '', value2:'' });
        setLocation('searchBrands')
        let search = {
           category:valor,
           subC1: '',
           subC2: '',
           subC3: '',
        }
        await setSearchCategoryObj(search)
        searchByCategories(search, 0, '', '');
     };
    render() {
        const { history } = this.props;
        const { categories } = this.state
        const half = Math.floor(categories.length / 2)
        const categories1 = categories.slice(0, half)
        const categories2 = categories.slice(half)
        return (
            <>
                <Session history={history} view={'marcas'} />
                <NavBar isShowMarcas={false} />

                <div style={{ marginTop: '180px'}}>
                    <div className="refacciones">
                        <Carousel infinite={true} draggable={true} responsive={responsiveCategories} autoPlaySpeed={2500} removeArrowOnDeviceType={["tablet", "mobile", "tablet1", "tablet2"]}>
                            {categories1 &&
                                categories1.length !== 0 &&
                                categories1.map((categoria, index) => {
                                    return (
                                        <div style={{ alignItems: 'center', textAlign: "center", display: 'flex', justifyContent: 'center', margin: 0 }} key={index}>
                                            <div className="item carousel-DashBoard-img" style={{ wordWrap: "break-word", width: "13rem", height: "fit-content", background: 'transparent', border: "none" }} onClick={() => this.mostrarCategoria(categoria.itemCode)} >
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
                        <Carousel infinite={true} draggable={true} responsive={responsiveCategories} autoPlaySpeed={2500} removeArrowOnDeviceType={["tablet", "mobile", "tablet1", "tablet2"]}>
                            {categories2 &&
                                categories2.length !== 0 &&
                                categories2.map((categoria, index) => {
                                    return (
                                        <div style={{ alignItems: 'center', textAlign: "center", display: 'flex', justifyContent: 'center', margin: 0 }} key={index}>
                                            <div className="item carousel-DashBoard-img" style={{ wordWrap: "break-word", width: "13rem", height: "fit-content", background: 'transparent', border: "none" }} onClick={() => this.mostrarCategoria(categoria.itemCode)} >
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
                    </div>
                </div >
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
        setIdCategory: value => dispatch({ type: DISPATCH_ID.ITEMS_SET_IDCATEGORY, value }), 
        setNextPage: value => dispatch({ type: DISPATCH_ID.ITEMS_SET_NEXTPAGE, value }),
        setLocation: value => dispatch({ type: DISPATCH_ID.ITEMS_SET_LOCATION, value }),
        setItemsFilters: value => dispatch({type: DISPATCH_ID.ITEMS_SET_UNIQUE_FILTER, value}), 
        setSearchCategoryObj: value => dispatch({ type: DISPATCH_ID.ITEMS_CATEGORY_SEARCH, value }),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Brands);