import React, { Component } from 'react';
import { NavBar, Session } from "../../components";
import { DISPATCH_ID, SERVICE_API, SERVICE_RESPONSE, VIEW_NAME, config } from "../../libs/utils/Const";
import { connect } from "react-redux";
import $ from 'jquery';
import { ApiClient } from "../../libs/apiClient/ApiClient";
import CurrencyFormat from 'react-currency-format';
import { ItemDetailsModal } from "../../components/index";
import { Modal } from '../../components/index';
import { animateScroll as scroll, scroller } from 'react-scroll';

require('datatables.net-bs4');

const apiClient = ApiClient.getInstance();
let tabla;
let modal = new Modal();
class MercadoLibreView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            buscarItem: '',
            resultItems: [],
            isRadioSelected: true,
            resultPublished: []
        };

    }
    async componentDidMount() {
        const { enableSpinner } = this.props;
        let accessToken = '';
        await apiClient.getTokenML().then(result => {
            // console.log("RESULT => ", result);
            accessToken = result.data.access_token
        })
        localStorage.setItem('AccessTokenML', accessToken);

    }
    async search() {
        const { notificationReducer: { showAlert }, enableSpinner } = this.props;
        let itemSearch = document.getElementById('buscarArticulo');
        itemSearch = itemSearch.value;
        // console.log("Buscar como", itemSearch);
        let data = {
            item: itemSearch
        }
        enableSpinner(true);
        await apiClient.searchItemsML(data).then(result => {
            // console.log("encontro esto ", result);
            this.setState({
                resultItems: result.data
            });
            $('#tablaItems').DataTable({
                "paging": false,
                "info": false,
                "searching": false,
                "retrieve": true,
                "language": {
                    "lengthMenu": "Registros por página  _MENU_ ",
                    "zeroRecords": "No se encontraron registros",
                    "info": "Mostrando página _PAGE_ de _PAGES_",
                    "infoEmpty": "No existen registros",
                    "infoFiltered": "(filtrado de _MAX_ entradas)",
                    "loadingRecords": "Buscando...",
                    "processing": "Procesando...",
                    "search": "Buscar:",
                    "paginate": {
                        "first": "Primero",
                        "last": "Último",
                        "next": "Siguiente",
                        "previous": "Anterior"
                    }
                }
            });
        });
        enableSpinner(false);
    };

    async searchPublishedItems() {
        await apiClient.searchPublishedItemsML().then(result => {
            // console.log("encontro esto ", result);
            this.setState({
                resultItems: result.data
            });
            $('#tablaItems').DataTable({
                "paging": false,
                "info": false,
                "searching": false,
                "retrieve": true,
                "language": {
                    "lengthMenu": "Mostrar _MENU_ registros por página",
                    "zeroRecords": "No se encontraron registros",
                    "info": "Mostrando página _PAGE_ de _PAGES_",
                    "infoEmpty": "No existen registros",
                    "infoFiltered": "(filtrado de _MAX_ entradas)",
                    "loadingRecords": "Buscando...",
                    "processing": "Procesando...",
                    "search": "Buscar:",
                    "paginate": {
                        "first": "Primero",
                        "last": "Último",
                        "next": "Siguiente",
                        "previous": "Anterior"
                    }
                }
            });
        });
    };

    async updatePublishedItems() {
        const { notificationReducer: { showAlert }, enableSpinner } = this.props;
        enableSpinner(true);
        await apiClient.searchPublishedItemsML().then(result => {
            // console.log("encontro esto 2 ", result);
            this.setState({
                resultPublished: result.data
            });
        });
        const { resultPublished } = this.state;
        // console.log("Se actulaizaran", resultPublished);
        resultPublished.map(async (item, index) => {
            let data = {
                idPublic: item.U_FMB_Handel_CodeML,
                title: item.ItemName,
                price: item.Price
            }

            await apiClient.UpdateItemListML(data).then(result => {
                // console.log("Se actualizo", result);
                if (result.data.id) {
                    showAlert({ type: 'success', message: 'Articulos actualizados satisfactoriamente ', timeOut: 0 });

                } else {
                    showAlert({ type: 'error', message: result.data.cause[0].message });
                    // console.log("Error => ", result.data.cause[0].message)
                }
            });
        });
        enableSpinner(false);
    };

    handelChange = ({ target }) => {
        const { name, value } = target;
        this.setState({
            [name]: value,
            isRadioSelected: false
        });
    };

    changeHandler = () => {
        this.setState({ isRadioSelected: false });
    };

    publicationType = () => {
        const { marcas, aparatos, refacciones, fabricantes } = this.state;
        //console.log('Valor del state', this.state);
        // console.log("INDEX => ", index)
        return (
            <div className="modal fade" id="publicationType" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{ border: "none", textAlign: 'center' }}>
                <div className="modal-dialog" role="document" style={{ margin: '1.75rem auto' }}>
                    <div className="modal-content">
                        <div className="modal-header" style={{ background: config.navBar.backgroundColor }}>
                            <h5 className="modal-title " style={{ color: config.navBar.textColor }}>Detalle de Publicación</h5>
                            <button type="button" style={{ color: config.navBar.textColor }} className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body bg3">
                            <div className="container">
                                <div className="col-md-12">
                                    <h4>Lista de Precios </h4>
                                    <div className="row">
                                        <div className="custom-control custom-radio" style={{ paddingRight: 20 }}>
                                            <input type="radio" className="custom-control-input" id="L1" name="priceList" value='ListaPrecios' onChange={this.handelChange} />
                                            <label className="custom-control-label" for="L1">Lista Uno</label>
                                        </div>

                                        <div className="custom-control custom-radio" style={{ paddingRight: 20 }}>
                                            <input type="radio" className="custom-control-input" id="L2" name="priceList" />
                                            <label className="custom-control-label" for="L2">
                                                <input type="text" placeholder="Precio a Mano" disabled={this.state.isRadioSelected} name="priceList" value={this.value} onChange={this.handelChange} onblur="document.getElementById('L2').value=this.value" />
                                            </label>

                                        </div>
                                    </div>

                                </div>

                                <div className="col-md-12">
                                    <h4>Tipo de envio</h4>
                                    <div className="row">
                                        <div className="custom-control custom-radio" style={{ paddingRight: 20 }}>
                                            <input type="radio" className="custom-control-input" id="Free" name="shipmentType" value="true" onChange={this.handelChange} />
                                            <label className="custom-control-label" for="Free">Envio gratis </label>
                                        </div>

                                        <div className="custom-control custom-radio" style={{ paddingRight: 20 }}>
                                            <input type="radio" className="custom-control-input" id="EnvioconCosto" name="shipmentType" value="false" onChange={this.handelChange} />
                                            <label className="custom-control-label" for="EnvioconCosto">Envio con costo </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <h4>Tipo de Publicación </h4>
                                    <div className="row">
                                        <div className="custom-control custom-radio" style={{ paddingRight: 20 }}>
                                            <input type="radio" className="custom-control-input" id="PT" name="publicationType" value='gold_pro' onChange={this.handelChange} />
                                            <label className="custom-control-label" for="PT">Premium</label>
                                        </div>

                                        <div className="custom-control custom-radio" style={{ paddingRight: 20 }}>
                                            <input type="radio" className="custom-control-input" id="PT2" name="publicationType" value="bronze" onChange={this.handelChange} />
                                            <label className="custom-control-label" for="PT2">Bronce </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="form-group col-md-12">
                                        <input type="submit" value="Publicar" className="btn btn-primary mb-2 btn-block" onClick={() => { this.publicar() }}
                                            style={{ fontsize: 25, background: config.navBar.iconColor, color: 'white', marginTop: 15 }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    };

    updateML = () => {
        const { marcas, aparatos, refacciones, fabricantes } = this.state;
        //console.log('Valor del state', this.state);
        // console.log("INDEX => ", index)
        return (
            <div className="modal fade" id="updateML" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{ border: "none", textAlign: 'center' }}>
                <div className="modal-dialog" role="document" style={{ margin: '1.75rem auto' }}>
                    <div className="modal-content">
                        <div className="modal-header" style={{ background: config.navBar.backgroundColor }}>
                            <h5 className="modal-title " style={{ color: config.navBar.textColor }}>Campos a actualizar</h5>
                            <button type="button" style={{ color: config.navBar.textColor }} className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body bg3">
                            <div className="container">
                                <div className="col-md-12">
                                    <h4>Nombre del articulo </h4>
                                    <div className="row">
                                        <div className="custom-control custom-radio" style={{ paddingRight: 20 }}>
                                            <input type="radio" className="custom-control-input" id="name" name="productName" />
                                            <label className="custom-control-label" for="name">
                                                <input type="text" placeholder="Ingrese nuevo nombre" disabled={this.state.isRadioSelected} name="name" value={this.value} onChange={this.handelChange} onblur="document.getElementById('name').value=this.value" />
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-12">
                                    <h4>Precio del articulo </h4>
                                    <div className="row">
                                        <div className="custom-control custom-radio" style={{ paddingRight: 20 }}>
                                            <input type="radio" className="custom-control-input" id="price" name="productPrice" />
                                            <label className="custom-control-label" for="price">
                                                <input type="text" placeholder="Ingrese nuevo precio" disabled={this.state.isRadioSelected} name="price" value={this.value} onChange={this.handelChange} onblur="document.getElementById('price').value=this.value" />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <h4>Tipo de envio</h4>
                                    <div className="row">
                                        <div className="custom-control custom-radio" style={{ paddingRight: 20 }}>
                                            <input type="radio" className="custom-control-input" id="Free2" name="shipmentType2" value="true" onChange={this.handelChange} />
                                            <label className="custom-control-label" for="Free2">Envio gratis </label>
                                        </div>

                                        <div className="custom-control custom-radio" style={{ paddingRight: 20 }}>
                                            <input type="radio" className="custom-control-input" id="EnvioconCosto2" name="shipmentType2" value="false" onChange={this.handelChange} />
                                            <label className="custom-control-label" for="EnvioconCosto2">Envio con costo </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="form-group col-md-12">
                                        <input type="submit" value="Actualizar producto" className="btn btn-primary mb-2 btn-block" onClick={() => { this.updateSingleItemML() }}
                                            style={{ fontsize: 25, background: config.navBar.iconColor, color: 'white', marginTop: 15 }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    };

    async updateSingleItemML() {
        const { notificationReducer: { showAlert }, enableSpinner } = this.props;
        const { resultItems, name, price, shipmentType2 } = this.state;
        let index = localStorage.getItem("INDEX")
        let id;
        let item = resultItems[index];
        let typeML = item.U_FMB_Handel_TypeML;
        // console.log("Name => ", name);
        // console.log("Price => ", price);
        // console.log("PublicationType ", shipmentType2)
        // console.log("Desde actualizar", item.U_FMB_Handel_CodeML);
        let premium = '';
        let clasica = '';
        let comision = '';
        let envio = '';
        //despues el await y dentro del awaitt se llenan las varibles
        await apiClient.DarValor().then(result => {
            let info = result.data;
            // console.log("INFO AWAIT => ", info)
            premium = result.data[0].Valor;
            clasica = result.data[1].Valor;
            comision = result.data[2].Valor;
            envio = result.data[3].Valor;

            // console.log("Premium => ", premium, "Clasica => ", clasica, "Comision => ", comision, "Envio => ", envio);

        })

        let precio = price

        if (typeML == "gold_pro") {
            precio = precio * premium;
            // console.log("PRECIO CON PREMIUM => ", precio);
            if (shipmentType2 == "true") {
                precio = precio + envio
                // console.log("PRECIO CON PREMIUM Y ENVIO GRATIS => ", precio);
                if (precio < 299.99) {
                    precio = precio + (comision * premium);
                    // console.log("PRECIO FINAL PREMIUM => ", precio)
                } else {
                    precio = precio;
                    // console.log("PRECIO SUPERIOR A 299 CON PREMIUM => ", precio)
                }
            } else if (shipmentType2 == "false") {
                precio = precio
                // console.log("PREMIUM CON COSTO DE ENVIO => ", precio)
                if (precio < 299.99) {
                    precio = precio + (comision * premium);
                    // console.log("PRECIO FINAL PREMIUM => ", precio)
                } else {
                    precio = precio;
                    // console.log("PRECIO SUPERIOR A 299 CON PREMIUM => ", precio)
                }
            }
        } else if (typeML == "bronze") {
            precio = precio * clasica;
            // console.log("PRECIO CON CLASICA => ", precio);
            if (shipmentType2 == "true") {
                precio = precio + envio;
                // console.log("PRECIO CLASICA CON ENVIO GRAIIS => ", precio)
                if (precio < 299.99) {
                    precio = precio + (comision * clasica)
                    // console.log("PRECIO FINAL CLASICA => ", precio)
                } else {
                    precio = precio;
                    // console.log("PRECIO SUPERIOR A 299 CON CLASICO => ", precio);
                }
            } else if (shipmentType2 == "false") {
                precio = precio;
                // console.log("PRECIO CLASICA CON ENVIO CON COST => ", precio)
                if (precio < 299.99) {
                    precio = precio + (comision * clasica)
                    // console.log("PRECIO FINAL CLASICA => ", precio)
                } else {
                    precio = precio;
                    // console.log("PRECIO SUPERIOR A 299 CON CLASICO => ", precio);
                }
            }
        }
        // console.log("PRECIO FINAL DE LOS FINALES => ", precio)
        precio = precio.toFixed(0);
        //reasignamos el precio
        let data = {
            item: item,
            name: name,
            price: precio,
            shipmentType2: shipmentType2
        }

        // console.log("PRUBA DATA", data.item.U_FMB_Handel_CodeML);
        // console.log("PRUBA DATA", data.name);

        // console.log("PRUBA DATA", data.price);
        // console.log("PRUBA DATA", data.shipmentType2);

        enableSpinner(true);

        await apiClient.UpdateSingleItemML(data).then(resul => {
            // console.log("Regreso de actualizacion", resul);
            if (resul.data.id) {
                showAlert({ type: 'success', message: 'Articulo actualizado', timeOut: 0 });
                // console.log("ID => ", resul.data.id)
                id = resul.data.id;

            } else {
                showAlert({ type: 'error', message: resul.data.cause[0].message });
                // console.log("Error => ", resul.data.cause[0].message)
                id = 0;
            }
        });
        // modal.updateML('hide');
        // if (id !== 0) {
        //     let data = {
        //         codeML: id,
        //         ItemCode: item.ItemCode
        //     }
        //     await apiClient.UpdateItemML(data).then(result => {
        //         if (result.status === 1) {
        //             showAlert({ type: 'success', message: 'Se actualzo el articulo' + result.data.ItemCode, timeOut: 0 });
        //         } else {
        //             showAlert({ type: 'error', message: result.data.message });
        //         }

        //     });
        //     this.search();

        // }
        enableSpinner(false);
    };

    async publicar() {
        const { notificationReducer: { showAlert }, enableSpinner } = this.props;
        const { resultItems, shipmentType, publicationType, priceList } = this.state;
        let index = localStorage.getItem("INDEX")
        let id;
        let item = resultItems[index];

        // console.log("Publication type => ", publicationType);
        // console.log("Shipment type => ", shipmentType);
        // console.log("ListPrice => ", priceList)
        // console.log("Desde publicar", item);

        let description = ``;
        let variable1 = ``;
        let variable2 = ``;
        //PONER la ruta de de la consulta de los costos, definir variable apra cada una 
        //Primero van las vriables
        let premium = '';
        let clasica = '';
        let comision = '';
        let envio = '';
        //despues el await y dentro del awaitt se llenan las varibles
        await apiClient.DarValor().then(result => {
            let info = result.data;
            // console.log("INFO AWAIT => ", info)
            premium = result.data[0].Valor;
            clasica = result.data[1].Valor;
            comision = result.data[2].Valor;
            envio = result.data[3].Valor;

            // console.log("Premium => ", premium, "Clasica => ", clasica, "Comision => ", comision, "Envio => ", envio);

        })


        await apiClient.PostearItem().then(resul => {
            let info = resul.data;
            info.map((resul, index) => {
                // console.log("INFO =>", resul.U_FMB_Handel_Lugar);
                if (resul.U_FMB_Handel_Lugar === '2') {
                    variable1 = `${variable1}
        ${resul.U_FMB_Handel_TextoML}`;
                }
                if (resul.U_FMB_Handel_Lugar === '4') {
                    variable2 = `${variable2}
        ${resul.U_FMB_Handel_TextoML}`;
                }
            });
        })
        //resultItems[index].UserText= description;
        // console.log("ITEM => ", item);
        let Fname = item.U_Nombre_Ecommerce || '';
        let name = item.ItemName || 'No hay información disponible';
        let code = item.ItemCode || 'No hay información disponible';
        let marca = item.U_FMB_Handel_Marca || 'No hay información disponible';
        let fabricante = item.U_FMB_Handel_Fabrica || 'No hay información disponible';
        let aparatos = item.U_FMB_Handel_Apara || 'No existen aparatos compatibles con este articulo';
        let modelo = item.U_Modelo || 'No existen aparatos compatibles con este articulo';
        description = `${variable1}
    
        ${Fname}
        Descripción: ${name}
        Código: ${code}
        Marca: ${marca}
        Fabricante: ${fabricante}
        Aparatos y/o equipos compatibles: ${aparatos}
        ${variable2}
        ${modelo}`;
        item.UserText = description;
        //  variable1 + resultItems[index].UserText + variable2;


        //cambiar el precio al item seguna el resultado de la formula</div>/
        //aqui va la formula
        let precio;
        if (priceList == "ListaPrecios") {
            precio = item.Price;
        } else {
            precio = priceList
        }
        // console.log("PRECIO => ", precio);
        if (publicationType == "gold_pro") {
            precio = precio * premium;
            // console.log("PRECIO CON PREMIUM => ", precio);
            if (shipmentType == "true") {
                precio = precio + envio
                // console.log("PRECIO CON PREMIUM Y ENVIO GRATIS => ", precio);
                if (precio < 299.99) {
                    precio = precio + (comision * premium);
                    // console.log("PRECIO FINAL PREMIUM => ", precio)
                } else {
                    precio = precio;
                    // console.log("PRECIO SUPERIOR A 299 CON PREMIUM => ", precio)
                }
            } else if (shipmentType == "false") {
                precio = precio
                // console.log("PREMIUM CON COSTO DE ENVIO => ", precio)
                if (precio < 299.99) {
                    precio = precio + (comision * premium);
                    // console.log("PRECIO FINAL PREMIUM => ", precio)
                } else {
                    precio = precio;
                    // console.log("PRECIO SUPERIOR A 299 CON PREMIUM => ", precio)
                }
            }
        } else if (publicationType == "bronze") {
            precio = precio * clasica;
            // console.log("PRECIO CON CLASICA => ", precio);
            if (shipmentType == "true") {
                precio = precio + envio;
                // console.log("PRECIO CLASICA CON ENVIO GRAIIS => ", precio)
                if (precio < 299.99) {
                    precio = precio + (comision * clasica)
                    // console.log("PRECIO FINAL CLASICA => ", precio)
                } else {
                    precio = precio;
                    // console.log("PRECIO SUPERIOR A 299 CON CLASICO => ", precio);
                }
            } else if (shipmentType == "false") {
                precio = precio;
                // console.log("PRECIO CLASICA CON ENVIO CON COST => ", precio)
                if (precio < 299.99) {
                    precio = precio + (comision * clasica)
                    // console.log("PRECIO FINAL CLASICA => ", precio)
                } else {
                    precio = precio;
                    // console.log("PRECIO SUPERIOR A 299 CON CLASICO => ", precio);
                }
            }
        }
        // console.log("PRECIO FINAL DE LOS FINALES => ", precio)
        item.Price = precio.toFixed(0);
        //reasignamos el precio
        let data = {
            item: item,
            publicationType: publicationType,
            shipmentType: shipmentType
        }
        enableSpinner(true);

        await apiClient.PostItemML(data).then(resul => {
            // console.log("Regreso de publicación", resul);
            if (resul.data.id) {
                showAlert({ type: 'success', message: 'Articulo publicado con el ID: ' + resul.data.id, timeOut: 0 });
                // console.log("ID => ", resul.data.id)
                id = resul.data.id;

            } else {
                showAlert({ type: 'error', message: resul.data.cause[0].message });
                // console.log("Error => ", resul.data.cause[0].message)
                id = 0;
            }
        });
        modal.publicationType('hide');
        if (id !== 0) {
            let data = {
                codeML: id,
                ItemCode: item.ItemCode,
                typeML: publicationType
            }

            // console.log("TYPE ML => ", data.typeML);
            await apiClient.UpdateItemML(data).then(result => {
                if (result.status === 1) {
                    showAlert({ type: 'success', message: 'Se actualzo el articulo' + result.data.ItemCode, timeOut: 0 });
                } else {
                    showAlert({ type: 'error', message: result.data.message });
                }

            });
            this.search();

        }
        enableSpinner(false);
    };

    render() {
        const { history, itemsReducer: { openItemDetails } } = this.props;
        const { resultItems } = this.state

        return (
            <div className="content-fluid" style={{ marginTop: 150, backgroundColor: "#EFEFEF" }}>
                <Session history={history} view={VIEW_NAME.MERCADO_LIBRE_VIEW} />
                <NavBar />
                {/* <ItemDetailsModal view={VIEW_NAME.ITEMS_VIEW} /> */}
                {this.publicationType()}
                {this.updateML()}
                <div className="container" style={{ paddingTop: 30, paddingBottom: 20 }}>
                    <div className="row">
                        <div className="col">
                            <div className="jumbotron">
                                <h1 className="display-4 text-center">Mercado libre</h1>

                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <h3>Buscar artículo</h3>
                        </div>
                        <div className="col-md-8 pb-2">
                            <input
                                id="buscarArticulo"
                                type="text"
                                className="form-control"
                                placeholder="Ingrese el código o nombre del articulo"
                                name="buscarItem"
                                value={this.state.buscarItem}
                                onChange={this.handelChange}
                                onKeyDown={event => event.keyCode === 13 && this.search()}
                            />
                        </div>
                        <div className="col-md-4">
                            <button
                                className="btn btn-success btn-block"
                                type="button"
                                onClick={() => this.search()}
                            >
                                <strong>Buscar</strong>
                            </button>
                        </div>
                    </div>

                    <div className="row pt-4 pb-2">
                        <div className="col-md-12">
                            <h3>Actualizar lista de articulos</h3>
                        </div>

                        <div className="col-md-4 pb-2">
                            <button
                                className="btn btn-success btn-block"
                                type="button"
                                onClick={() => this.searchPublishedItems()}
                            >
                                <strong>Ver lista de articulos</strong>
                            </button>
                        </div>

                        <div className="col-md-4 pb-2">
                            <button
                                className="btn btn-success btn-block"
                                type="button"
                                onClick={() => this.updatePublishedItems()}
                            >
                                <strong>Actualizar lista</strong>
                            </button>
                        </div>

                        {/* <div className="col-md-4">
                            <button
                                className="btn btn-success btn-block"
                                type="button"
                                onClick={() => this.updateML()}
                            >
                                <strong>Actualizar individual</strong>
                            </button>
                        </div> */}
                    </div><br/>

                    <div className="row">
                        <h3>Articulo(s)</h3>
                        <div className="col-md-12 pt-2 table-responsive">
                            <table id="tablaItems" className="table table-striped">
                                <thead style={{textAlign: "-webkit-center"}}>
                                    <tr style={{ backgroundColor: config.shoppingList.summaryList, color: "white" }}>
                                        <th scope="col" style={{ color: "white" }} >Código de artículo</th>
                                        <th scope="col" style={{ color: "white" }}>Nombre</th>
                                        <th scope="col" style={{ color: "white" }}>Precio</th>
                                        <th scope="col" style={{ color: "white" }}>Stock</th>
                                        <th scope="col" style={{ color: "white" }}>Categoria</th>
                                        <th scope="col" style={{ color: "white" }}>Estado</th>
                                        <th scope="col" style={{ color: "white" }}>Id publicación</th>
                                        <th scope="col"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {resultItems.map((item, index) => {
                                        return (<tr key={index}>
                                            <th scope="row">{item.ItemCode}</th>
                                            <td>{item.U_Nombre_Ecommerce}</td>
                                            <td>
                                                <CurrencyFormat
                                                    value={item.Price}
                                                    displayType={'text'}
                                                    thousandSeparator={true}
                                                    fixedDecimalScale={true}
                                                    decimalScale={2}
                                                    prefix={'$ '}
                                                    suffix={config.general.currency}>
                                                </CurrencyFormat>
                                            </td>
                                            <td>{item.OnHandPrincipal}</td>
                                            <td>
                                                {item.U_FMB_Handel_CatML !== null
                                                    ? <strong>{item.U_FMB_Handel_CatML}</strong>
                                                    : <strong>Sin Categoria</strong>}
                                            </td>
                                            <td>
                                                {item.U_FMB_Handel_MLstus === '1'
                                                    ? <button
                                                        className="btn btn-success btn-block"
                                                        type="button"
                                                        onClick={() => {
                                                            index = localStorage.setItem("INDEX", index);
                                                            modal.updateML('show')
                                                        }}>
                                                        <strong>Actualizar</strong>
                                                    </button>
                                                    : <strong>Sin publicar</strong>}
                                            </td>
                                            <td>
                                                {item.U_FMB_Handel_MLstus !== '1'
                                                    ? <button
                                                        className="btn btn-success btn-block"
                                                        type="button"
                                                        onClick={() => {
                                                            index = localStorage.setItem("INDEX", index);
                                                            modal.publicationType('show')
                                                        }}
                                                    >
                                                        <strong>Publicar</strong>
                                                    </button>
                                                    : <strong>{item.U_FMB_Handel_CodeML}</strong>
                                                }
                                            </td>
                                            <td>
                                                <button
                                                    className="btn btn-success btn-block"
                                                    type="button"
                                                    onClick={() => openItemDetails(item)}
                                                >
                                                    <strong>Detalles</strong>
                                                </button>
                                            </td>
                                        </tr>)
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

        );
    }
}

const mapStateToProps = store => {
    return {
        sessionReducer: store.SessionReducer,
        configReducer: store.ConfigReducer,
        notificationReducer: store.NotificationReducer,
        itemsReducer: store.ItemsReducer,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        enableSpinner: value => dispatch({ type: DISPATCH_ID.CONFIG_SET_SPINNER, value }),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MercadoLibreView);