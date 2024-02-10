import React, { Component, PureComponent } from 'react';
import { config, SERVICE_API, VIEW_NAME, DISPATCH_ID } from '../libs/utils/Const';
import { connect } from "react-redux";
import "./ItemSlider.css";
import 'semantic-ui-css/semantic.min.css'
import "./CategoriesPopular.css"



class CategoriesPopular extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showAll:false,
            // categories: [
            //     { name: "Construcción", id: 1 },
            //     { name: "Cerrajería y Candados", id: 2 },
            //     { name: "Pinturas y Solventes", id: 3 },
            //     { name: "Ferretería", id: 4 },
            //     { name: "Automotriz", id: 5 },
            //     { name: "Material Eléctrico", id: 6 },
            //     { name: "Plomería", id: 7 },
            //     { name: "Productos de Corte", id: 8 },
            //     { name: "Seguridad y Equipamiento", id: 9 },
            //     { name: "Herramientas Eléctricas", id: 10 },
            //     { name: "Adhesivos y Pegamentos", id: 11 },
            //     { name: "Abrasivos", id: 12 },
            // ],
        };
    }

    //Busqueda por categoria
    getCategory = async (category) => {
        const { itemsReducer, setItemsFilters, setSearchCategoryObj, itemsReducer: { searchByCategories, location }, setIdCategory, setLocation, setNextPage } = this.props;
        setIdCategory(category);
        setNextPage(0);
        if (location === 'menuCategories') {
            setItemsFilters({});
        }
        setLocation('menuCategories')
        let search = {
            category: category,
            subC1: '',
            subC2: '',
            subC3: ''
        }
        await setSearchCategoryObj(search);
        searchByCategories(search, 0, '', '');
    }

    render() {
        const { itemsReducer: { categoryBanner } } = this.props
        const { categories, showAll } = this.state;
        return (
            <>
                {/* <div className='popular-categories-main'>
                <div className={`categories-populares`}>
                    {categories.map((category, index) => (
                        <div className={`icons-categories ${showAll ? '' : 'hide-categories'}`} key={category.id}>
                            
                            <img src={config.categoriesICON[`categoriesIcon${index + 1}`]} style={{ maxWidth: '30%' }} />
                            <span className='text-categories'>{category.name}</span>
                        </div>
                    ))}
                </div>
                <span className="show-all-button" onClick={() => this.setState({ showAll: !showAll })}>{showAll ? 'ver menos' : 'ver más'}</span>
            </div> */}
                <div className="popular-categories-main">
                    <div className="categories-populares">
                        {categoryBanner.map((category, index) => (
                            category.active === 'on' && (
                            <div
                                className={`icons-categories ${showAll ? '' : 'hide-categories'}`}
                                key={category.id}
                                onClick={() => this.getCategory(category.category)} //Nombre de la categoria para la busqueda
                            >
                                <img src={config.ASSETS + 'categorias/' + category.image} style={{ maxWidth: '30%' }} alt={category.image} />
                                <span className='text-categories'>{category.category}</span>
                            </div>
                            )
                        ))}
                    </div>
                    <span className="show-all-button" onClick={() => this.setState({ showAll: !showAll })}>
                        {showAll ? 'ver menos' : 'ver más'}
                    </span>
                </div>
            </>
        );
    }
    
    
}

const mapStateToProps = store => {
    return {
        notificationReducer: store.NotificationReducer,
        shoppingCartReducer: store.ShoppingCartReducer,
        itemsReducer: store.ItemsReducer,
        configReducer: store.ConfigReducer,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setShoppingCart: value => dispatch({ type: DISPATCH_ID.SHOPPING_CART_SAVE_CART, value }),
        setItemsFilterSearch: value => dispatch({ type: DISPATCH_ID.ITEMS_SAVE_ITEMS_FILTER, value }),
        setNextPage: value => dispatch({ type: DISPATCH_ID.ITEMS_SET_NEXTPAGE, value }),
        searchByDashOption: value => dispatch({ type: DISPATCH_ID.ITEMS_SET_SEARCH_BY_DASH_OPTION, value }),
        setItemsFilters: value => dispatch({ type: DISPATCH_ID.ITEMS_SET_UNIQUE_FILTER, value }),
        setSearchCategoryObj: value => dispatch({ type: DISPATCH_ID.ITEMS_CATEGORY_SEARCH, value }),
        setIdCategory: value => dispatch({ type: DISPATCH_ID.ITEMS_SET_IDCATEGORY, value }),
        setLocation: value => dispatch({ type: DISPATCH_ID.ITEMS_SET_LOCATION, value }),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(CategoriesPopular);