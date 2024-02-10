import React, {Component} from 'react';
import $ from 'jquery';
import { DISPATCH_ID } from '../libs/utils/Const';
import {connect} from "react-redux";
class SortFilter extends Component {

    constructor(props) {
        super(props);
        this.state = {         
          orden: '', // El estado para almacenar el orden seleccionado
          seSeleccionoOpcion:false
        };
    }


    handleOrdenChange = async (event) => {
        const nuevoOrden = event.target.value;
        const {orden} = this.props
        await orden(nuevoOrden)
        this.setState({ 
            seSeleccionoOpcion: true,
         });
        await this.uniqueFilter()
    };

    uniqueFilter = async () => {
        const {itemsReducer, setItemsFilters, viewOne } = this.props;
        setTimeout(async() => {
            // Ejecutar searchByKey
            if(viewOne && viewOne !== ''){
                await itemsReducer.searchByKey(0, viewOne);
            } else {
                localStorage.getItem('searchFilter')
                ? await itemsReducer.searchByKey(0, localStorage.getItem('searchFilter'), true):
                await itemsReducer.searchByKey()
            }  
        }, 350);        
    };

    // itemsSort = async ()=>{
    //     const {itemsReducer:{sortFilterValue},items,setItemsSearch} = this.props
    //     if(sortFilterValue === 'maxprice'){
    //         items.sort((a, b) => b.PrecioFinal - a.PrecioFinal);
    //     }else if(sortFilterValue === 'minprice'){
    //         items.sort((a, b) => a.PrecioFinal - b.PrecioFinal);
    //     }else if (sortFilterValue === 'masnuevo'){

    //     }
    //     await setItemsSearch(items)
    // }
    

      
    render() {
        const {seSeleccionoOpcion} = this.state
        const {itemsReducer:{sortFilterValue}} = this.props
        return (
            <div>
                <select className='font-weight-bold' style={{border:"none", marginLeft:'14px'}} value={sortFilterValue} onChange={this.handleOrdenChange}>
                    {!seSeleccionoOpcion && <option className='font-weight-bold' value="">Ordenar por:</option>}
                    <option className='font-weight-bold' value="masnuevo">Lo más nuevo</option>
                    <option className='font-weight-bold' value="maxprice">Mayor precio</option>
                    <option className='font-weight-bold' value="minprice">Menor precio</option>
                </select>
            </div>  
        );
    }
}

const mapStateToProps = store => {
    return {
        itemsReducer: store.ItemsReducer,
    };
};
const mapDispatchToProps = dispatch => {
    return {
        setItemsSearch: value => dispatch({type: DISPATCH_ID.ITEMS_SET_ITEMS, value}),
        orden: value => dispatch({type: DISPATCH_ID.ITEMS_SET_SORT_FILTER, value}),
        
    };
};
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(SortFilter);
