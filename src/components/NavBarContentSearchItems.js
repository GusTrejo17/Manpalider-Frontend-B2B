import React, { Component,useEffect,useRef } from 'react';
import { config, DISPATCH_ID } from '../libs/utils/Const';
import { connect } from "react-redux";
import { Modal } from './index';
import './NavBarContentSearchItems.css';
import { Link } from 'react-router-dom';
import { ApiClient } from '../libs/apiClient/ApiClient';
import { animateScroll as scroll, scroller } from 'react-scroll';
import './navBar.css'
let modal = new Modal();
const apiClient = ApiClient.getInstance();
class NavBarContentSearchItems extends Component {
    constructor(props) {
        super(props);
        this.state = {
            suggestions: [],
            text: '',
            inputValue: '',
            showOptions: false
        }
        this.scrollToBottom = this.scrollToBottom.bind(this);
    }
    

    scrollToBottom() {
        scroll.scrollToTop({
            duration: 1000,
            delay: 100,
            smooth: 'easeOutQuart',
            isDynamic: true
        })
    }

    search = async () => {
        const { itemsReducer, setIdCategory, setLocation, setSearch, orden } = this.props;
        orden('')
        setIdCategory(null);
        setLocation('navBar');
        await itemsReducer.searchByKey(0, '', true);
        // setSearch("");
        this.scrollToBottom();
    };


    searchModal = () => {
        const { marcas, aparatos, refacciones, fabricantes } = this.state;

        return (
            <div className="modal fade" id="searchModal" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{ border: "none", textAlign: "center" }}>
                <div className="modal-dialog" role="document" style={{ margin: "1.75rem auto" }}>
                    <div className="modal-content">
                        <div className="modal-header" style={{ background: config.navBar.iconColor }}>
                            <h5 className="modal-title " style={{ color: config.navBar.textColor2 }}>Búsqueda</h5>
                            <button type="button" style={{ color: config.navBar.textColor2 }} className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body bg3">
                            <form onSubmit={this.handelSubmit} method="post" encType="text/plain" className="container input-navBar-container">
                                <div className="row">
                                    <div className="col-md-12">
                                        <h4>Marca</h4>
                                        <select name="marca" placeholder="Selecciona una marca" className="form-control text-left" onChange={this.handelChange} style={{ textAlign: "center", height: 30, padding: 0 }}>
                                            <option value="">Selecciona una marca</option>
                                            {marcas &&
                                                marcas.map(marca => {
                                                    return <option value={marca.Code} key={marca.Code}>{marca.Name}</option>
                                                })
                                            }
                                        </select>
                                    </div>
                                    <div className="col-md-12">
                                        <h4>Aparato</h4>
                                        <select name="aparato" placeholder="Selecciona un aparato" className="form-control text-left" onChange={this.handelChange} style={{ textAlign: "center", height: 30, padding: 0 }}>
                                            <option value="">Selecciona un aparato</option>
                                            {aparatos &&
                                                aparatos.map(aparato => {
                                                    return <option value={aparato.Code} key={aparato.Code}>{aparato.Name}</option>
                                                })
                                            }
                                        </select>
                                    </div>
                                    <div className="col-md-12">
                                        <h4>Refacción</h4>
                                        <select name="refaccion" placeholder="Selecciona una refaccion" className="form-control text-left" onChange={this.handelChange} style={{ textAlign: "center", height: 30, padding: 0 }}>
                                            <option value="">Selecciona una refacción</option>
                                            {refacciones &&
                                                refacciones.map(refaccion => {
                                                    return <option value={refaccion.Code} key={refaccion.Code}>{refaccion.Name}</option>
                                                })
                                            }
                                        </select>
                                    </div>
                                    <div className="col-md-12">
                                        <h4>Fabricante</h4>
                                        <select name="fabricante" placeholder="Selecciona un fabricante" className="form-control text-left" onChange={this.handelChange} style={{ textAlign: "center", height: 30, padding: 0 }}>
                                            <option value="">Selecciona un fabricante</option>
                                            {fabricantes &&
                                                fabricantes.map(fabricante => {
                                                    return <option value={fabricante.Code} key={fabricante.Code}>{fabricante.Name}</option>
                                                })
                                            }
                                        </select>
                                    </div>
                                    <div className="col-md-12">
                                        <h4>Nombre</h4>
                                        <input type="text" className="form-control" placeholder="Nombre(s)" name="nombre" onChange={this.handelChange} />
                                    </div>
                                    <div className="row">
                                        <div className="form-group col-md-12">
                                            <input type="submit" value="Buscar" className="btn btn-primary mb-2 btn-block "
                                                style={{ fontsize: 25, background: config.navBar.iconColor, color: "white", marginTop: 15 }} />
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    };

    onTextChanged = async (e) => {
        const { setSearch } = this.props;
        let value = e.target.value;
        let inputSearch = document.getElementById("dropdownAutoComplete");
        let arrayValue = value.split("~");
        if (arrayValue.length === 3) {
            value = value.replace(/ ~ /g, ", ");
        }

        setSearch(value)
        inputSearch.value = value;
        this.setState(() => ({ text: value }));
        if (arrayValue.length === 3) {
            setTimeout(() => {
                this.search();
            }, 150)
        }
    }
    handleInputChange = (event) => {
        const value = event.target.value;
        this.setState({ inputValue: value })
        this.setState({ showOptions: value !== "" })
    };
    clearSeachBar = async (event) => {
        const { setSearch } = this.props;
        setSearch("");
        event.target.value = '';
        this.setState(() => ({ text: '' }));
    }

    render() {
       
        const { itemsReducer, setSearch, icon, iconColor, textColor, iconColor3, fillDataSearch } = this.props;
        const { text } = this.state;
        let suggestions = itemsReducer.itemsAutoComplete;
        let filteredOptions = suggestions.filter(item => item.ItemName.toLowerCase().includes(this.state.inputValue.toLowerCase()))
        return (
            <div className="input-group input-search-items pr-4">
                <div className='search-input-container'>
                    <input
                        id="dropdownAutoComplete"
                        className="form-control text-left"
                        name="password"
                        placeholder=""
                        autoComplete={'off'}
                        style={{ borderRight: "transparent", height: "50px" }}
                        onKeyDown={event => event.keyCode === 13 && this.search()}
                        value={this.state.inputValue}
                        onClick={(event) => { this.clearSeachBar(event) }}
                        onChange={this.handleInputChange}
                        type="text"
                        list={itemsReducer.search.length > 1 && "suggestionList"} />
                    {this.state.showOptions && (<ul className="custom-options" id="suggestionList">
                        {filteredOptions && filteredOptions.length > 0 && filteredOptions.map((item) => {
                            //Cambiamos el orden de la busqueda para que buscara y apareciera primero por codigo de fabricante (Ulises,Pedro,Marin)
                            return (
                                <li className='datalist-item' onClick={()=>{
                                    this.setState({inputValue:item.ItemName})
                                    this.setState({ showOptions: false })
                                }
                                    }>
                                    <span>{item.Marca}</span>
                                    <span>{item.Linea ? item.Linea : ''}</span>
                                    <span>{item.ItemName}</span>
                                    <span>{item.ItemCode}</span>
                                </li>)
                        }
                        )}
                    </ul>)}
                </div>
                <button className="btn buttonIconSearch" type="button" style={{ borderColor: "#ced4da", color: "#666666", borderLeft: "transparent", color: "#ced4da" }} onClick={this.search}>
                    <i
                        class="fa fa-search p-2"
                        style={{ fontSize: "18px", color: "white" }}
                        aria-hidden="true"
                    />
                </button>
                {/* <button className="btn buttonAvanzada" type="button" style={{borderColor: "#ced4da",color: "#666666", borderLeft: "transparent", color: "#ced4da"}} onClick={fillDataSearch}>                        
                    Avanzada
                </button> */}
                {/* <div className="input-group-prepend" onClick={this.search} style={{marginLeft: 5}}>
                    <span
                        className="input-group-text"
                        style={{
                            textAlign: 'center',
                            height: 30,
                            cursor: 'pointer',
                            border: 'none',
                            background: 'none',
                            paddingLeft: 1,
                            paddingRight: 1
                        }}>
                        <i
                            className={icon}
                            style={{marginLeft: 5, cursor: 'pointer', color: iconColor}}
                            aria-hidden="true"
                        />
                    </span>
                </div> */}
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
        setSearch: value => dispatch({ type: DISPATCH_ID.ITEMS_SET_SEARCH, value }),
        setIdCategory: value => dispatch({ type: DISPATCH_ID.ITEMS_SET_IDCATEGORY, value }),
        setNextPage: value => dispatch({ type: DISPATCH_ID.ITEMS_SET_NEXTPAGE, value }),
        setLocation: value => dispatch({ type: DISPATCH_ID.ITEMS_SET_LOCATION, value }),
        orden: value => dispatch({ type: DISPATCH_ID.ITEMS_SET_SORT_FILTER, value }),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(NavBarContentSearchItems)