import React, {Component} from 'react';
import {Session, NavBar, Slider, CarouselDashboard, ItemSlider1,ItemSlider2 } from '../../components';
import {config, VIEW_NAME, DISPATCH_ID} from '../../libs/utils/Const';
import {connect} from "react-redux";
import { animateScroll as scroll } from 'react-scroll'

class DashboardView2 extends Component {
    constructor (props){
        super(props);
        this.scrollToBottom = this.scrollToBottom.bind(this);
        
    }

    scrollToBottom() {
        scroll.scrollToTop({
            duration: 1500,
            delay: 100,
            smooth: 'easeOutQuart',
            isDynamic: true
        })
    }

    async componentDidMount(){
        this.scrollToBottom();
    }

    changeQuantity = (index, item, newQuantity, addItem) => {
        const {itemsReducer : { addShoppingCart, deleteShoppingCart }} = this.props;
        if(addItem){
            addShoppingCart(
                {
                    item,
                    quantity: (newQuantity || '1')
                }
            )
        }else{
            deleteShoppingCart({item, deleteAll: false});
        }
    };

    shouldComponentUpdate(nextProps) {
        if (this.props.itemsReducer.searchByCategoriesHome !== nextProps.itemsReducer.searchByCategoriesHome) {
            return true;
        }else{
            return false;
        }
     
    }

    componentDidUpdate() {
        const {setCategory,itemsReducer} = this.props;
        
        setCategory('241');
        // if(itemsReducer.searchByCategoriesHome){
        //     itemsReducer.searchByCategoriesHome('4');
        // }
        if(itemsReducer.searchByCategoriesHome2){
            itemsReducer.searchByCategoriesHome2('241');
        }
    }

    changeBackOrder = (item, addItem) => {
        const { itemsReducer: { deleteBackOrder, addBackOrder } } = this.props;
        if (addItem) {
            addBackOrder({ item, quantity: 1 })
        } else {
            deleteBackOrder({ item, deleteAll: false });
        }
    };

    render() {
        const {history} = this.props; 
        //console.log('render ', VIEW_NAME.DASHBOARD_VIEW);
        return (
            <div className="content-fluid" style={{marginTop: 66, backgroundColor: "#fff"}}>
                <Session history={history} view={VIEW_NAME.DASHBOARD_VIEW}/>
                <NavBar/>
                {/* Si es un video */}
                {config.dashboard === 'Video' && <Slider/>}
                {/* Si es un video */}
                {config.dashboard === 'Carousel' && <CarouselDashboard section={'Principal'}/>}
                <br/>
                {/* <h2 className="ml-2">Ofertas</h2> */}
                {/* <ItemsSlider changeQuantity= {this.changeQuantity}></ItemsSlider> */}
                <h2 className="ml-2">PROMOCIONES</h2>
                <ItemSlider1 changeQuantity={this.changeQuantity} dashboard={10} changeBackOrder={this.changeBackOrder}/>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <h2 className="ml-2">NUEVOS PRODUCTOS</h2>
                <ItemSlider2 changeQuantity={this.changeQuantity} dashboard={10} changeBackOrder={this.changeBackOrder}/>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
            </div>
        );
    }
}

const mapStateToProps = store => {
    return {
        itemsReducer: store.ItemsReducer
    };
};


const mapDispatchToProps = dispatch => {
    return {
        setCategory: value => dispatch({type: DISPATCH_ID.ITEMS_SET_CATEGORY, value}),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DashboardView2);