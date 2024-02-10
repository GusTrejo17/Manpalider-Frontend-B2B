import React, {Component} from 'react';
import {NavBar, Session, ItemsList, ItemDetailsModal, Footer, Slider, CarouselDashboard, Suscription,TopNavBar, CarouselTrademarks} from "../../components";
import {config, DISPATCH_ID, VIEW_NAME, SERVICE_API, ROLES} from "../../libs/utils/Const";
import { ApiClient } from "../../libs/apiClient/ApiClient";
import {connect} from "react-redux";
import './ItemsView.css';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { animateScroll as scroll, scroller } from 'react-scroll';

const apiClient = ApiClient.getInstance();

const responsiveCategories = {
    desktop: {
        breakpoint: { max: 3500, min: 1920 },
        items: 6,
        partialVisibilityGutter: 10 // this is needed to tell the amount of px that should be visible.
      },
      tablet: {
        breakpoint: { max: 1920, min: 1200 },
        items: 4,
        partialVisibilityGutter: 30 // this is needed to tell the amount of px that should be visible.
      },
      tablet2: {
        breakpoint: { max: 1200, min: 768 },
        items: 3,
        partialVisibilityGutter: 30 // this is needed to tell the amount of px that should be visible.
      },
      tablet3: {
        breakpoint: { max: 768, min: 465 },
        items: 1,
        partialVisibilityGutter: 30 // this is needed to tell the amount of px that should be visible.
      },
      mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 1,
        partialVisibilityGutter: 10 // this is needed to tell the amount of px that should be visible.
      } 
}

class ItemsRoutletView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            categories: []
        };

        this.scrollToBottom = this.scrollToBottom.bind(this);
    };

    search = '';


    mostrarCategoria = (valor) => {
        //Estamos haciendo uso de props del sistema
        // const { itemsReducer: { searchByCategories } } = this.props;
        // searchByCategories(valor);
        const {setCategory,setIdCategory, setLocation,itemsReducer: {searchByCategories},setNextPage} = this.props;
        setIdCategory(valor);
        setNextPage(0);
        setLocation('marcaThree');
        searchByCategories(valor,0,'marcaThree');
    };

    async componentDidMount(){
        await apiClient.getCategoriesHome('marcaThree').then(result => {
            this.setState({
                categories: result.data || [],
            });
        });
        this.scrollToBottom();
    }

    changeQuantity = (index, item, newQuantity, addItem) => {
        const {itemsReducer : { addShoppingCart, deleteShoppingCart }} = this.props;
        if(addItem){
            addShoppingCart({item, quantity: (newQuantity || '1')})
        }else{
            deleteShoppingCart({item, deleteAll: false});
        }
    };

    changeBackOrder= (item, addItem) => {
        const {itemsReducer : {deleteBackOrder, addBackOrder}} = this.props;
        if(addItem){
            addBackOrder({item, quantity: 1})
        }else{
            deleteBackOrder({item, deleteAll: false});
        }
    };

    scrollToBottom() {
	    scroll.scrollToTop({
	        duration: 1000,
	        delay: 100,
	        smooth: 'easeOutQuart',
	        isDynamic: true
	      })
    }

    render() {
        const {history,itemsReducer : { itemsFilter, searchItemsFilter, updateFavorite, deleteShoppingCart, openItemDetails }} = this.props;
        const { categories } = this.state;
        //imprimir las variabls que recibe el itemList
        return (
            <div className="content-fluid" style={{marginTop: 176,backgroundColor:"#fff", paddingLeft:0, paddingRight:0}}>
                <Session history={history} view={VIEW_NAME.ITEMS_ROUTLET_VIEW}/>
                <NavBar/>
                {/* Banner */}
                {/* <div className="bannerRedCompensas margenS" style={{backgroundColor:config.Back.backgroundColor }}>
                    <img id = "scrollDownPlease" className="img-fluid"
                        src={require('../../images/diasa/ROutlet/Banner3.jpg')}
                        alt="Segundo NavBar"
                    />
                </div> */}
                {/* Si es un video */}
                {/* {config.dashboard === 'Video' && <Slider />} */}
                {/* Si es un video */}
                {/* {config.dashboard === 'Carousel' && <CarouselDashboard />} */}
                <TopNavBar/><br/>
                {/* <CarouselTrademarks/><br/> */}
                {/* <Carousel style={{ justifyContent: "center", alignItems: "center"}} autoPlay infinite={true} draggable partialVisible={true} responsive={responsiveMarcas} autoPlaySpeed={5000} removeArrowOnDeviceType={["desktop","tablet", "mobile"]}>
                    <div className="text-center" style={{marginTop: "auto", marginBottom: "auto"}}>
                        <img className="img-fluid"
                            src={require('../../images/diasa/ROutlet/Outlet-02.png')}
                            alt="Segundo NavBar"
                        />
                    </div>
                    <div className="text-center" style={{marginTop: "auto", marginBottom: "auto"}}>
                        <img className="img-fluid"
                            src={require('../../images/diasa/ROutlet/Outlet-03.png')}
                            alt="Segundo NavBar"
                        />
                    </div>
                    <div className="text-center" style={{marginTop: "auto", marginBottom: "auto"}}>
                        <img className="img-fluid"
                            src={require('../../images/diasa/ROutlet/Outlet-04.png')}
                            alt="Segundo NavBar"
                        />
                    </div>
                    <div className="text-center" style={{marginTop: "auto", marginBottom: "auto"}}>
                        <img className="img-fluid"
                            src={require('../../images/diasa/ROutlet/Outlet-05.png')}
                            alt="Segundo NavBar"
                        />
                    </div>
                    <div className="text-center" style={{marginTop: "auto", marginBottom: "auto"}}>
                        <img className="img-fluid"
                            src={require('../../images/diasa/ROutlet/Outlet-06.png')}
                            alt="Segundo NavBar"
                        />
                    </div>
                    <div className="text-center" style={{marginTop: "auto", marginBottom: "auto"}}>
                        <img className="img-fluid"
                            src={require('../../images/diasa/ROutlet/Outlet-07.png')}
                            alt="Segundo NavBar"
                        />
                    </div>
                    <div className="text-center" style={{marginTop: "auto", marginBottom: "auto"}}>
                        <img className="img-fluid"
                            src={require('../../images/diasa/ROutlet/Outlet-08.png')}
                            alt="Segundo NavBar"
                        />
                    </div>
                    <div className="text-center" style={{marginTop: "auto", marginBottom: "auto"}}>
                        <img className="img-fluid"
                            src={require('../../images/diasa/ROutlet/Outlet-09.png')}
                            alt="Segundo NavBar"
                        />
                    </div>
                    <div className="text-center" style={{marginTop: "auto", marginBottom: "auto"}}>
                        <img className="img-fluid"
                            src={require('../../images/diasa/ROutlet/Outlet-10.png')}
                            alt="Segundo NavBar"
                        />
                    </div>
                    <div className="text-center" style={{marginTop: "auto", marginBottom: "auto"}}>
                        <img className="img-fluid"
                            src={require('../../images/diasa/ROutlet/Outlet-11.png')}
                            alt="Segundo NavBar"
                        />
                    </div>
                </Carousel><br/> */}
                {/* sección de marcas */}
                {/* <TopNavBar/> */}
                {/* <div className="marcas text-center" style={{display: "flex",justifyContent: "center", alignItems: "center"}}>
                    <img src={config.trademarks.marcasRegistradas} className="Img-fluid"></img>
                </div> */}
                {/**Comineza funcion */}
                {/* NOTA: No se puede ejecutar el componente porque no se escribe ninguna palabra */}
                <div className="categoriasPolar">
                    <Carousel  
                        itemClass="carousel-item-padding-40-px alignItem" 
                        autoPlay 
                        infinite={true} 
                        draggable={true} 
                        responsive={responsiveCategories} 
                        autoPlaySpeed={5000}
                        >

                        {categories &&
                            categories.length !== 0 &&
                            categories.map((categoria, index) => {
                                return (
                                    <div style={{ textAlign: "center", margin: 0}} key={index}>
                                        <div className="item card" style={{ width: "280px", height: "310px", background: 'transparent', border: "none"}} onClick={() => this.mostrarCategoria(categoria.idCategory)}>
                                            <div>
                                                <img className="card-img-top" style={{ width: "11rem", height: '210px',cursor: "pointer", background: 'transparent' }} src={categoria.image ? (config.BASE_URL + SERVICE_API.getImageCategories + '/' + categoria.image) : require("../../images/noImage.png")} />
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
                </div><br/><br/>               
                <div className="row" style={{margin:0, paddingBottom: 20}}>
                    <div className="col-md-12 col-sm-12" style={{margin:0, minHeight: '70vh'}}>
                        {itemsFilter.length !== 0 ? (
                            <ItemsList
                                items={itemsFilter}
                                updateFavorite={updateFavorite}
                                openDetails={openItemDetails}
                                changeQuantity={this.changeQuantity}
                                deleteShoppingCart={deleteShoppingCart}
                                changeBackOrder={this.changeBackOrder}
                                viewOne={'marcaThree'}
                            />
                        ) : (
                            <div style={{paddingTop:100, margin:0, textAlign: 'center'}}>No se encontraron productos con su búsqueda: <strong>{searchItemsFilter}</strong>
                                <br/>
                                <br/>
                                <i style={{fontSize: 70}} className={config.icons.search}></i>
                            </div>
                        )}

                    </div>
                </div>
                <Suscription/>
                {/**Aqui termina la funcion  */}
            </div>
        );
    }
}

const mapStateToProps = store => {
    return {
        itemsReducer: store.ItemsReducer,
        configReducer: store.ConfigReducer,
        notificationReducer: store.NotificationReducer,
        sessionReducer: store.SessionReducer,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setItemsSearch: value => dispatch({type: DISPATCH_ID.ITEMS_SET_ITEMS, value}),
        enableSpinner: value => dispatch({type: DISPATCH_ID.CONFIG_SET_SPINNER, value}),
        setItemsFilterSearch: value => dispatch({type: DISPATCH_ID.ITEMS_SAVE_ITEMS_FILTER, value}),
        setLocation:  value => dispatch({type: DISPATCH_ID.ITEMS_SET_LOCATION, value}),
        setTotalRows : value => dispatch({type: DISPATCH_ID.ITEMS_SET_TOTALROWS, value}),
        setIdCategory: value => dispatch({type: DISPATCH_ID.ITEMS_SET_IDCATEGORY, value}),
        setNextPage:  value => dispatch({type: DISPATCH_ID.ITEMS_SET_NEXTPAGE, value}),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ItemsRoutletView);