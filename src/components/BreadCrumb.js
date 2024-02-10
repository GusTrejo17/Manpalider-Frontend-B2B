import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import $ from 'jquery';

class BreadCrumb extends Component {
    constructor(props){
        super(props);
        this.state = {
            categoriesData : [],
        };
    }
    
    
    orderByTimes = ()=>{
        const {data}=this.props;
        let array = data || [];
        let piv = {};
        for (let k = 1; k < array.length; k++) {
            for (let i = 0; i < (array.length - k); i++) {
                if (array[i] > array[i + 1]) {
                    piv = array[i];
                    array[i] = array[i + 1];
                    array[i + 1] = piv;
                }
            }
        } 
        array.sort(((a, b) => b.times - a.times))
        
        return array;
        
    }
    render() {
        let categoriesData = this.orderByTimes();
        let split = categoriesData[0] ? categoriesData[0].categoryName.split(',') : [];
        if(!split[1]){$('.subItemBread').hide();}//si no llegan subitems oculta los elementos
        return (
            <nav aria-label="breadcrumb" >
                <ol className="breadcrumb" style={{fontSize: "21px", backgroundColor:"#d2d2d200", borderBottom: "2px solid #d2d2d2"}}>
                    <Link to="/items" className="breadcrumb-item text-dark"><strong>{split[0] || ''}</strong></Link>
                    <Link to={'#'} className= "breadcrumb-item text-muted subItemBread" aria-current="page">{split[1]}</Link>                    
                </ol>
            </nav>
        );
    }
}

export default BreadCrumb;