import React, {Component} from 'react';
import {NavBar, Session, ItemsList, ItemDetailsModal, Footer, Slider, CarouselDashboard, Suscription, TopNavBar} from "../../components";
import {config, DISPATCH_ID, VIEW_NAME, SERVICE_API, ROLES} from "../../libs/utils/Const";
import { ApiClient } from "../../libs/apiClient/ApiClient";
import {connect} from "react-redux";
import Carousel from 'react-multi-carousel';
import './ItemsView.css';
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

class ItemsNumberFour extends Component {
    
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
        setLocation('marcaFour');
        searchByCategories(valor, 0,'marcaFour');
    };

    async componentDidMount(){
        // Categorias para mostrar al inicio del modelo    redPolar
        await apiClient.getCategoriesHome('marcaFour').then(result => {
            this.setState({
                categories: result.data || [],
            });
        });
        this.scrollToBottom();
    }
    scrollToBottom() {
	    scroll.scrollToTop({
	        duration: 1000,
	        delay: 100,
	        smooth: 'easeOutQuart',
	        isDynamic: true
	      })
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



    render() {
        const {history,itemsReducer : { itemsFilter, searchItemsFilter, updateFavorite, deleteShoppingCart, openItemDetails }} = this.props;
        const { categories } = this.state;
        // console.log(itemsFilter);
        //imprimir las variabls que recibe el itemList
        return (
            <div className="container-fluid" style={{marginTop: 176,backgroundColor:config.Back.backgroundColor , paddingLeft:0, paddingRight:0}}>
                <Session history={history} view={VIEW_NAME.ITEMS_MARCA_FOUR_VIEW}/>
                <NavBar/>
                {/* Banner */}
                {/* <div className="bannerRedCompensas margenS" style={{backgroundColor:"#EFEFEF"}}>
                    <img id = "scrollDownPlease" className="img-fluid"
                        src={require('../../images/diasa/marcaCuatro/Banner4.jpg')}
                        alt="Segundo NavBar"
                    />
                </div>  */}
                {/* Si es un video */}
                {/* {config.dashboard === 'Video' && <Slider />} */}
                {/* Si es un video */}
                {/* {config.dashboard === 'Carousel' && <CarouselDashboard />} */}
                {/* sección de marcas */}
                <TopNavBar/>
                <br/>
                {/* <div className="row col-lg-12 pt-4 pb-3" style={{ justifyContent: "center", alignItems: "center",marginRight:"auto", marginLeft: "auto"}}>
                    <div className="col-lg-2 col-md-4 col-sm-6 text-center" style={{marginTop: "auto", marginBottom: "auto"}}>
                        <img className="img-fluid"
                            src={require('../../images/diasa/redPolar/icono-09.png')}
                            alt="Segundo NavBar"
                        />
                    </div>
                    <div className="col-lg-2 col-md-4 col-sm-6 text-center" style={{marginTop: "auto", marginBottom: "auto"}}>
                        <img className="img-fluid"
                            src={require('../../images/diasa/redPolar/icono-10.png')}
                            alt="Segundo NavBar"
                        />
                    </div>
                    <div className="col-lg-2 col-md-4 col-sm-6 text-center" style={{marginTop: "auto", marginBottom: "auto"}}>
                        <img className="img-fluid"
                            src={require('../../images/diasa/redPolar/icono-11.png')}
                            alt="Segundo NavBar"
                        />
                    </div>
                    <div className="col-lg-2 col-md-4 col-sm-6 text-center" style={{marginTop: "auto", marginBottom: "auto"}}>
                        <img className="img-fluid"
                            src={require('../../images/diasa/redPolar/icono-12.png')}
                            alt="Segundo NavBar"
                        />
                    </div>
                    <div className="col-lg-2 col-md-4 col-sm-6 text-center" style={{marginTop: "auto", marginBottom: "auto"}}>
                        <img className="img-fluid"
                            src={require('../../images/diasa/redPolar/icono-13.png')}
                            alt="Segundo NavBar"
                        />
                    </div>
                    <div className="col-lg-2 col-md-4 col-sm-6 text-center" style={{marginTop: "auto", marginBottom: "auto"}}>
                        <img className="img-fluid"
                            src={require('../../images/diasa/redPolar/icono-14.png')}
                            alt="Segundo NavBar"
                        />
                    </div>
                </div> */}
                <div className="categoriasPolar">
                    <Carousel  
                        itemClass="carousel-item-padding-40-px" 
                        autoPlay 
                        infinite={true} 
                        draggable={true} 
                        responsive={responsiveCategories} 
                        autoPlaySpeed={5000}>

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
                {/* <div className="marcas text-center" style={{display: "flex",justifyContent: "center", alignItems: "center"}}>
                    <img src={config.trademarks.marcasRegistradas} className="Img-fluid"></img>
                </div> */}
                {/**Comineza funcion */}
                {/* NOTA: No se puede ejecutar el componente porque no se escribe ninguna palabra */}
                <div className="row" style={{margin:0, paddingBottom: 20}}>
                    <div className="col-md-12 col-sm-12" style={{margin:0, minHeight: '70vh'}}>
                        {!!itemsFilter && itemsFilter.length !== 0 ? (
                            <ItemsList
                                items={itemsFilter}
                                updateFavorite={updateFavorite}
                                openDetails={openItemDetails}
                                changeQuantity={this.changeQuantity}
                                deleteShoppingCart={deleteShoppingCart}
                                changeBackOrder={this.changeBackOrder}
                                viewOne={'marcaFour'}
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
        setLocation:  value => dispatch({type: DISPATCH_ID.ITEMS_SET_LOCATION, value}),
        setIdCategory: value => dispatch({type: DISPATCH_ID.ITEMS_SET_IDCATEGORY, value}),
        setNextPage:  value => dispatch({type: DISPATCH_ID.ITEMS_SET_NEXTPAGE, value}),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ItemsNumberFour);