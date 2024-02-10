import React, {Component} from 'react';
import {Footer, NavBar, Session,BonificacionesModal, NotificationsModal } from "../../components";
import {VIEW_NAME, config, SERVICE_API, DISPATCH_ID, SERVICE_RESPONSE} from "../../libs/utils/Const";
import {connect} from 'react-redux';
import {ApiClient} from "../../libs/apiClient/ApiClient";
import $ from 'jquery';
import moment from "moment";
import { animateScroll as scroll, scroller } from 'react-scroll';


let apiClient = ApiClient.getInstance();

class PromocionalesView extends Component {

    constructor(props) {
        super(props);

        this.state = {
            Promos : [],
            items : [],
            editMode: false,
            itemsSelected : [],
            arrayConditions : [],
            itemsSelectedBonification: [],
            finishItems : [],
            arr : [],
            packagesInfo: [],
            activa: 'Todo',  
            packageListId : 0,  
            globalQuantity : 1,  
            checkAutomatico : false,
            checkSeleccionar : false,   
            buscarLikeCondiotions : '',
            createPromo: {
                id : '',
                Name : '',
                buscarLike : '',
                buscarBoniLike : '',
                buscarLikeTable : '',
                buscarBoniLikeTable : '',
                typeProm : '0',
                typeVol : '0',
                cumulative : 'NO',
                priority : '1',
                chkConditions : '',
                dateInicial : '',
                dateFinal : '',
                obligatory : '',
                typeSelectCond : '',
                code : '',
                promoUniClient : '0',
                typeReward : '',
                typeRewardFin : '',
                typeMonto : '',
                quantityarticulos : '',
                aprobada : '',
                active : '',
                Items: [],
                ItemsBonification: [],
                listNum : '',
                valueSelectCond : '',     
                detalle : false,
                tipoPack : '',
                disparador : '',
                bonificacion : '',
                condicion : '',
                fkRestriccion : '',
            },
            checkboxDataTables: (new Map(): Map<string, boolean>)
            
        };
        this.scrollToBottom = this.scrollToBottom.bind(this)
    };

    async componentDidMount(){
        // enableSpinner(true);
        this.cargarFecha();
        this.cargarDatos();    
        // enableSpinner(false);
        /*if (response.status === SERVICE_RESPONSE.SUCCESS) {
            this.setState({
                orders: response.data,
            });
            $('#tablaBonifi').DataTable({
                "paging": true,
                "info": false,
                "searching": false
            });
        }*/
        this.scrollToBottom()
    };

    scrollToBottom() {
	    scroll.scrollToTop({
	        duration: 1000,
	        delay: 100,
	        smooth: 'easeOutQuart',
	        isDynamic: true
	      })
    }

    async cargarDatos (){
        // let newdatas = await apiClient.getPromo();
        const {activa} = this.state;

        let data ={
            tipo : activa,
        }
        let newdatas = await apiClient.getPromocionales(data);
        
        let user = localStorage.getItem(config.general.localStorageNamed + 'CurrentUser');
        user = JSON.parse(user) || {};  
        this.setState({
            Promos : newdatas.data.list,
            CardName : user.CardName
            //prices : listPrices.data.list
        });
    };

    buscarActiva = (event) => {        
        this.setState({
            activa: event.nativeEvent.target.value,
            checkboxDataTables: (new Map(): Map<string, boolean>),
        })

        setTimeout(() => {
            this.cargarDatos()
        }, 100)
    }; 

    async search(value){
        const {createPromo} = this.state;
        const {enableSpinner} = this.props;    
        
        if(value){
            let item = createPromo.buscarLikeTable || value;

            enableSpinner(true);
            let responseItems = await apiClient.searchItems(item)
            enableSpinner(false);
    
            this.setState({
                items : responseItems.data.list            
            });
        }
    }

    async searchs(value){   
        // if(value){
        //     let item = createPromo.buscarLikeTable || value;

        //     // enableSpinner(true);
        //     // //let responseItems = await apiClient.searchItems(item)
        //     // enableSpinner(false);
    
        //     this.setState({
        //         itemss : item         
        //     });
        // }
        
    }

    async searchBoni(value){
        const {createPromo} = this.state;
        const {enableSpinner} = this.props;

        if(value){
            let item = createPromo.buscarBoniLikeTable || value;
            enableSpinner(true);
            let responseItems = await apiClient.searchItems(item)
            enableSpinner(false);
            this.setState({
                items : responseItems.data.list            
            });
        }
    }
    
    selectItemsBonification = async (valor) => {
        const { itemsSelectedBonification, packagesInfo, packageListId } = this.state
        const {enableSpinner,notificationReducer: {showAlert}} = this.props;

        let bandera = false;
        itemsSelectedBonification.map(arr => {
            if(arr.ItemCode === valor){
                bandera = true;
                showAlert({type: 'warning', message: 'El artículo seleccionado ya ha sido agregado', timeOut: 8000});
                return;
            }
        })

        if(valor && !bandera){
            enableSpinner(true);
            let dataitem = await apiClient.searchItems(valor);
            enableSpinner(false);
            let data =  dataitem.data.list[0];

            itemsSelectedBonification.push(data);
            
            // Rellena arreglos de venta y bonificacion dentro del paquete actual
            packagesInfo.map(pack => {
                if(pack.packageId == packageListId){
                    pack.arrayBonificaciones = itemsSelectedBonification;
                }
            });
        
            this.setState({
                itemsSelectedBonification: itemsSelectedBonification
            });
        }               
    }

    createPromotion = async () => {
        const { createPromo,packagesInfo, arrayConditions,itemsSelected } = this.state
        let chkCon = document.getElementById('chkConditions').checked;
        let active = document.getElementById('chkActive').checked;
        let chkVigencia = document.getElementById('chkVigencia').checked;
        // let chkObligatory = document.getElementById('chkObligatory').checked;
        //let chkAutomatico = document.getElementById('chkAutomatico').checked;
        //let chkSeleccionar = document.getElementById('chkSeleccionar').checked;
        let cumulative = document.getElementById('cumulative').value;
        
        createPromo.typeVol = document.getElementById('typeVol').value;
        createPromo.cumulative = cumulative;
        createPromo.chkConditions = chkCon ? 'SI' : 'NO';
        createPromo.active = active ? 'SI' : 'NO';
        createPromo.chkVigencia = chkVigencia ? 'SI' : 'NO';
        createPromo.typeProm = createPromo.typeProm == '1' ? 'Volumen' : 'Monto';
        // createPromo.obligatory = chkObligatory ? 'SI' : 'NO';
        createPromo.arrayCond = arrayConditions;

        if(createPromo.typeProm === 'Volumen'){
            createPromo.typeMonto = '';
        }
        if(createPromo.typeProm === 'Monto'){
            createPromo.typeVol = '';
        }        
        if(createPromo.chkVigencia === 'NO'){
            createPromo.dateInicial = '';
            createPromo.dateFinal = '';
        }
        //createPromo.bonificacion = chkAutomatico ? 1 : 0;

        let newObject = {};
        let fullData = Object.assign(newObject, createPromo);
        //fullData.packagesInfo = packagesInfo;
        // console.log('con<<<< createPromo',fullData, itemsSelected);
        let responseItems = await apiClient.insertPromo(fullData);
        this.cargarDatos();
    }

    UpdatePromotion = async () => {
        const {createPromo, arrayConditions} = this.state;
        let chkCon = document.getElementById('chkConditions').checked;
        let active = document.getElementById('chkActive').checked;
        let chkVigencia = document.getElementById('chkVigencia').checked;
        // let chkObligatory = document.getElementById('chkObligatory').checked;
        let cumulative = document.getElementById('cumulative').value;       
        createPromo.typeVol = document.getElementById('typeVol').value;    
        createPromo.cumulative = cumulative;
        createPromo.chkConditions = chkCon ? 'SI' : 'NO';
        createPromo.active = active ? 'SI' : 'NO';
        createPromo.chkVigencia = chkVigencia ? 'SI' : 'NO';
        createPromo.typeProm = createPromo.typeProm == '1' ? 'Volumen' : 'Monto';
        // createPromo.obligatory = chkObligatory ? 'SI' : 'NO';
        createPromo.arrayCond = arrayConditions;

        if(createPromo.typeProm === 'Volumen'){
            createPromo.typeMonto = '';
        }
        if(createPromo.typeProm === 'Monto'){
            createPromo.typeVol = '';
        }        
        if(createPromo.chkVigencia === 'NO'){
            createPromo.dateInicial = '';
            createPromo.dateFinal = '';
        }

        let newObject = {};
        let fullData = Object.assign(newObject, createPromo);
        // console.log('con<<<',fullData);
        let updateProm = await apiClient.updatePromo(fullData);
        $('#CREATE').modal('hide');
        this.cargarDatos();
    }

    Aprobar = async () => {
        const {createPromo,packagesInfo} = this.state;
        let data = {
            id : createPromo.id,
            aprobada : 2
        }

        let updateProm = await apiClient.aprobarPromo(data);
        $('#CREATE').modal('hide');
        this.cargarDatos();
    }

    CheckboxActionsBoni = async (docEntryArray, action = null) => {
        const {enableSpinner, notificationReducer: {showAlert}, view} = this.props;
        
        let responseArray = [];

        for (let document in docEntryArray) {
            enableSpinner(true);

            let message = "";
            if (action == 1) {
                message = "Aprobando";
            }
            showAlert({type: 'info', message: message + ': ' +  docEntryArray[document].nombre, timeOut: 8000});

            let data = {
                id : docEntryArray[document].idRegistro,
                aprobada : 2
            }

            let response = "";

            if (action == 1) {
                response = await apiClient.aprobarPromo(data);
            }

            enableSpinner(false);
            try {
                responseArray.push({
                    docNum: docEntryArray[document].nombre,//response.data ? response.data.DocNum : '',
                    message: response.message ? response.message : '',
                });
            } catch (e) {
                responseArray.push({
                    docNum: '',
                    message: '',
                });
            }
        }
        return responseArray;
    };

    AutorizarMasive = async response => {
        const {enableSpinner, notificationReducer: {showAlert}} = this.props;
        const {Promos,checkboxDataTables} = this.state;

        let docEntryArray = [];
        let responseArray = [];
        for (let [id, value] of checkboxDataTables.entries()) {
            if (value) {
                docEntryArray.push(Promos[id]);
            }
        }
        $('#estasSeguroModal').modal('hide');
        if(docEntryArray.length>0){
            responseArray = await this.CheckboxActionsBoni(docEntryArray,1);
            this.toggleDocumentSelectedAll(false);
            
            
            this.setState({
                checkboxDataTables: (new Map(): Map<string, boolean>),
                responseArray 
            })
            $('#notificationsModal').modal('show');
            this.cargarDatos();

        } else{
            showAlert({type: 'error', timeOut: 8000, message: "Seleccione un documento valido"});
            return;
        }
    }
    
    Rechazar = async () => {
        const {createPromo,packagesInfo} = this.state;
        
        let data = {
            id : createPromo.id,
            aprobada : 1
        }

        let updateProm = await apiClient.aprobarPromo(data);
        $('#CREATE').modal('hide');
        this.cargarDatos();
    }

    Activar = async () => {
        const {createPromo,packagesInfo} = this.state;
        
        let active = document.getElementById('chkActive').checked;
        active = active ? '1' : '0';
        let data = {
            id : createPromo.id,
            activa : active
        }

        await apiClient.activarPromo(data);
        $('#CREATE').modal('hide');
        this.cargarDatos();
    } 

    Details = async (valor) => {
        const {createPromo,itemsSelected} = this.state;
        const {enableSpinner} = this.props;
        enableSpinner(true);
        
        let newdatas = await apiClient.getPromocion(valor);
        ///Tipo promoción
         createPromo.typeProm = newdatas.data[0].fkTipoDisparador;
         document.getElementById('lbltypeVol').style.display = 'block';
         document.getElementById('typeVol').style.display = 'block';

         let tipoVolumen =  newdatas.data[0].fkSubTipo;
        createPromo.typeVol = tipoVolumen === 2 ? '1' : '2';
        document.getElementById('seleccionarArticulos').style.display = 'block';

        createPromo.disparador = newdatas.data[0].disparador;
        createPromo.bonificacion =newdatas.data[0].bonificacion;
        
        ///////////////////BONIFICACION////////////////////////////////
        //let disparador = newdatas.data[0].disparador;
        //let getDisparador = await apiClient.getPromocionDisparador(disparador);
        
        //let bonificacion = newdatas.data[0].bonificacion;
        //let getBonificacion = await apiClient.getPromocionDisparador(bonificacion);

        // getDisparador.data.map(disparador =>{
        //     disparador.bonificacion =[]
        // });

        // getDisparador.data.map(disp =>{
        //     let combo = []
        //     getBonificacion.data.map(bon =>{
                
        //         if(disp.relacion === bon.relacion){
        //             // disp.bonificacion.push([{ItemCode: bon.ItemCode}]) 
        //             combo.push(bon); 
        //         }
        //     })

        //     let items = [];
        //     let registrados = [];
        //     for (let index = 0; index < combo.length; index++) {
        //         const element = combo[index];
        //             let include = registrados.includes(element.indexPack);
        //             if(!include){
        //             let arrayTemp = combo.filter(item => (item.indexPack === element.indexPack));
        //             registrados.push(element.indexPack);
        //             items.push(arrayTemp);
        //             }
        //     }  
        //     disp.bonificacion = items;
        // });
        ///////////////////CONDICIONES////////////////////////////////
        let condicion = newdatas.data[0].fkRestriccion;
        createPromo.condicion = newdatas.data[0].fkCondicion;
        createPromo.fkRestriccion = condicion;
        let getCondicion = await apiClient.getConditions(condicion);

        //let condi = getCondicion.data.list.length > 0 ? true : false
        if(getCondicion.data.list.length > 0){
            document.getElementById('chkConditions').checked = true;
        }else{
            document.getElementById('chkConditions').checked = false;
        }
        createPromo.detalle = true;
        createPromo.tipoPack =  newdatas.data[0].idTipoSeleccion

        createPromo.id = newdatas.data[0].idRegistro;
        createPromo.Name = newdatas.data[0].nombre;
        let acumulativa = newdatas.data[0].acumulable === 1 ? 'SI' : 'NO';
        createPromo.cumulative  = acumulativa;
        createPromo.priority = newdatas.data[0].prioridad;        
        createPromo.dateInicial = newdatas.data[0].desde;
        createPromo.dateFinal = newdatas.data[0].hasta;

        createPromo.active = newdatas.data[0].activa;
        let activa = createPromo.active === 1 ? true : false;
        document.getElementById('chkActive').checked = activa;

        
        createPromo.aprobada = newdatas.data[0].aprobada;
        // document.getElementById('chkAprobada').checked = newdatas.data[0].aprobada === 2 ? true : false;

        createPromo.vigencia = newdatas.data[0].vigencia;
        let vigencia = createPromo.vigencia === 1 ? true : false
        document.getElementById('chkVigencia').checked = vigencia;
        this.ChangeValue();

        let getDisparador = await apiClient.getPromocionDisparador(createPromo.disparador);
        let getBonificacion = await apiClient.getPromocionDisparador(createPromo.bonificacion);

        getDisparador.data.map(disparador =>{
            disparador.bonificacion =[]
        });

        getDisparador.data.map(disp =>{
        let combo = []
        getBonificacion.data.map(bon =>{
            
            if(disp.relacion === bon.relacion){
                combo.push(bon); 
            }
        })

        let items = [];
        let registrados = [];
        for (let index = 0; index < combo.length; index++) {
            const element = combo[index];
                let include = registrados.includes(element.indexPack);
                if(!include){
                let arrayTemp = combo.filter(item => (item.indexPack === element.indexPack));
                registrados.push(element.indexPack);
                items.push(arrayTemp);
                }
        }  
        disp.bonificacion = items;
        });

        if(createPromo.typeVol == 1){
            for (let i = 0; i < getDisparador.data.length; i++) {
                const bon = getDisparador.data[i];
                if(i >= 1){
                    bon.bonificacion = [];
                }                
            }
        }

        createPromo.packagesInfo = getDisparador.data;
        createPromo.checkAutomatico = createPromo.tipoPack;
        
        enableSpinner(false);

        // let combo = [];
        //     let item = {
        //         itemCode : itemSele.ItemCode,
        //         itemName : itemSele.ItemName,
        //         quantity: itemSele.Quantity || 1,
        //         bonificacion: [
        //             combo
        //         ]
        //     };
        this.setState({
            createPromo,
            actualizar : true,
            newprom : false,
            itemsSelected :  getDisparador.data,
            //itemsSelectedBonification : getBonificacion.data,
            arrayConditions : getCondicion.data.list 
        });
        // console.log('con<<',itemsSelected);

        setTimeout(() => {
            $('#CREATE').modal('show');
        }, 150);
        
    }

    hadleChangeBoniTable = key => {
        const {createPromo} = this.state;
        let  value= key.target.value;
        this.searchBoni(value)
        createPromo.buscarBoniLikeTable = value

        this.setState({
            createPromo
        });
    }

    hadleChange = key => {
        const {createPromo} = this.state;
       let  value= key.target.value;
       //this.search(value)
       createPromo.buscarLike = value

        this.setState({
            createPromo
        });
    }

    hadleChangeBoni = key => {
        const {createPromo} = this.state;
        let  value= key.target.value;
        //this.searchBoni(value)
        createPromo.buscarBoniLike = value

        this.setState({
            createPromo
        });
    }

    //--------------------------------------------------
    finishSelection = async () => {
        const { notificationReducer: {showAlert} } = this.props;
        const { packagesInfo, itemsSelected, createPromo, packageListId } = this.state;

        //---- Empiezan validaciones al terminar selección
        // Validacion para no dejar vacios los arreglos de Venta y Bonificacion
        let flag0 = true;
        packagesInfo.map(pack => {
            if(pack.packageId == packageListId){
                if(pack.arrayVentas.length === 0 || pack.arrayBonificaciones.length === 0) {
                    flag0 = false;
                }
            }
        });

        if (flag0 === false){
            showAlert({type: 'warning', message: ' Favor de seleccionar articulos para Ventas y Bonificaciones ', timeOut: 8000});
            return;
        }

        // Validacion para que al crear nuevo paq. si esta en Seleccion NO deba tener menos de dos registros en Bonificaciones
        let flag = true;
        packagesInfo.map(pack => {
            if(pack.packageId == packageListId){
                if(pack.checkSeleccionar == true && pack.arrayBonificaciones.length < 2) {
                    flag = false;
                }
            }
        });

        if (flag === false){
            showAlert({type: 'warning', message: ' El paquete actual se creó en modo selección, favor de insertar al menos dos artículos en bonificaciones  ', timeOut: 8000});
            return;
        }

        // Validacion para que al crear nuevo paq. si está en 'En la Compra de Cualquiera de' no haya menos de dos registros en Ventas
        let flag2 = true;
        packagesInfo.map(pack => {
            if(pack.packageId == packageListId){
                if(pack.type == 1 && pack.arrayVentas.length < 2) {
                    flag2 = false;
                }
            }
        });

        if (flag2 === false){
            showAlert({type: 'warning', message: ' El paquete actual se creó en modo En la Compra de Cualquiera de, favor de insertar al menos dos artículos en ventas  ', timeOut: 8000});
            return;
        }
        //---- Terminan validaciones al terminar selección

        createPromo.Items = itemsSelected;
        this.setState({
            //finishItems : itemsSelected,
            createPromo
        });

        $('#modalSeleccted').modal('hide');
    }

    finishSelectionBoni = async () => {
        const {itemsSelectedBonification,createPromo} = this.state

        createPromo.ItemsBonification = itemsSelectedBonification;
        this.setState({
            createPromo
        });

        $('#modalSelecctedBonificacion').modal('hide');
    }

    deleteItem = indexToDelete => {
        const { itemsSelected, packagesInfo, packageListId } = this.state;

        let newItems = [];
        itemsSelected.map((item, index) => {
            
            if (indexToDelete != index) {
                newItems.push(item);
            }
        });

        // Rellena arreglos de venta y bonificacion dentro del paquete actual
        packagesInfo.map(pack => {
            if(pack.packageId == packageListId){
                pack.arrayVentas = newItems;
            }
        });

        this.setState({
            itemsSelected: newItems
        });
    };

    deleteCondition = indexToDelete => {
        const { arrayConditions,  packageListId } = this.state;
        let newItems = [];
        arrayConditions.map((item, index) => {
            
            if (indexToDelete != index) {
                newItems.push(item);
            }
        });

        this.setState({
            arrayConditions: newItems
        });
    };

    deleteItemBonification = indexToDelete => {
        const { itemsSelectedBonification, packagesInfo, packageListId } = this.state;
        let newItems = [];

        itemsSelectedBonification.map((item, index) => {
            
            if (indexToDelete != index) {
                newItems.push(item);
            }
        });
        // Rellena arreglos de venta y bonificacion dentro del paquete actual
        packagesInfo.map(pack => {
            if(pack.packageId == packageListId){
                pack.arrayBonificaciones = newItems;
            }
        });

        this.setState({
            itemsSelectedBonification: newItems
        });
    };

    cargarFecha(){
        const {createPromo} = this.state;
        var fecha = new Date();
        var mes = fecha.getMonth()+1; 
        var dia = fecha.getDate(); 
        var ano = fecha.getFullYear(); 
        if(dia<10)
          dia='0'+dia; 
        if(mes<10)
          mes='0'+mes 
        document.getElementById('DateInicial').value = ano+"-"+mes+"-"+dia;
        document.getElementById('DateFinal').value = ano+"-"+mes+"-"+dia;

        createPromo.dateInicial = ano+"-"+mes+"-"+dia;
        createPromo.dateFinal = ano+"-"+mes+"-"+dia;

        this.setState({
            createPromo
        });
    }

    // Ventas (Enter)
    openItems = async () => {
        const { createPromo, itemsSelected, packagesInfo, packageListId } = this.state;
        const { enableSpinner } = this.props;  

        let searchItem = createPromo.buscarLike;
        
        if(searchItem === ''){
            // Trae toda la lista de articulos y abre el modal
            enableSpinner(true);
            let responseItems = await apiClient.searchItems(searchItem);
            enableSpinner(false);

            this.setState({
                items : responseItems.data.list
            });

            $('#ModalVenta').modal('show');
        } else {
            // Busca solo el Item ingresado
            enableSpinner(true);
            let dataitem = await apiClient.searchItems(searchItem);
            enableSpinner(false);

            let data =  dataitem.data.list[0];
            if(!data){
                enableSpinner(true);
                let responseItems = await apiClient.searchItems();
                enableSpinner(false);

                this.setState({
                    items : responseItems.data.list
                });

                $('#ModalVenta').modal('show');
            } else {
                // console.log('con< data', data);
                itemsSelected.push(data);

                // Rellena arreglos de venta y bonificacion dentro del paquete actual
                packagesInfo.map(pack => {
                    if(pack.packageId == packageListId){
                        pack.arrayVentas = itemsSelected;
                    }
                });

                createPromo.buscarLike = '';
                createPromo.buscarBoniLike = '';

                this.setState({
                    itemsSelected: itemsSelected,
                    createPromo
                });
            }
        }        
    }

    openConditionsClick = async () => {
        const { createPromo, itemsSelected, packagesInfo, packageListId  } = this.state;
        const { enableSpinner } = this.props;  

        let searchItem = createPromo.buscarLike;
        
        if(searchItem === ''){
            // Trae toda la lista de articulos y abre el modal
            enableSpinner(true);
            let responseItems = await apiClient.searchItems(searchItem)
            enableSpinner(false);

            this.setState({
                items : responseItems.data.list
            });

            $('#ModalVenta').modal('show');
        } else {
            // Busca solo el Item ingresado
            enableSpinner(true);
            let dataitem = await apiClient.searchItems(searchItem);
            enableSpinner(false);
            
            
            let data =  dataitem.data.list[0];
            if(!data){
                enableSpinner(true);
                let responseItems = await apiClient.searchItems();
                enableSpinner(false);

                this.setState({
                    items : responseItems.data.list
                });

                $('#ModalVenta').modal('show');
            } else {
                itemsSelected.push(data);

                // Rellena arreglos de venta y bonificacion dentro del paquete actual
                packagesInfo.map(pack => {
                    if(pack.packageId == packageListId){
                        pack.arrayVentas = itemsSelected;
                    }
                });

                createPromo.buscarLike = '';
                createPromo.buscarBoniLike = '';

                this.setState({
                    itemsSelected: itemsSelected,
                    createPromo
                });
            }
        }        
    }

    // Bonificaciones (Enter)
    openItemsBoni = async () => {
        const { createPromo, itemsSelectedBonification, packagesInfo, packageListId } = this.state;
        const { enableSpinner } = this.props;  

        let searchItem = createPromo.buscarBoniLike;

        if(searchItem === ""){
            // Trae toda la lista de articulos y abre el modal
            enableSpinner(true);
            let responseItems = await apiClient.searchItems(searchItem)
            enableSpinner(false);

            this.setState({
                items : responseItems.data.list
            });

            $('#exampleModalBonificacion').modal('show');
        } else {
            enableSpinner(true);
            let dataitem = await apiClient.searchItems(searchItem)
            enableSpinner(false);

            let data =  dataitem.data.list[0]
            if(!data){
                enableSpinner(true);
                let responseItems = await apiClient.searchItems();
                enableSpinner(false);

                this.setState({
                    items : responseItems.data.list
                });

                $('#ModalVenta').modal('show');
            } else {
                itemsSelectedBonification.push(data);

                // Rellena arreglos de venta y bonificacion dentro del paquete actual
                packagesInfo.map(pack => {
                    if(pack.packageId == packageListId){
                        pack.arrayBonificaciones = itemsSelectedBonification;
                    }
                });

                createPromo.buscarLike = '';
                createPromo.buscarBoniLike = '';

                this.setState({
                    itemsSelectedBonification: itemsSelectedBonification,
                    createPromo
                });
            }
        }
    }

    // Bonificaciones (Click Boton)
    openItemsBoniClick = async () => {
        const { createPromo, itemsSelectedBonification, packagesInfo, packageListId } = this.state;
        const { enableSpinner } = this.props;  

        let searchItem = createPromo.buscarBoniLike;

        if(searchItem === ""){
            // Trae toda la lista de articulos y abre el modal
            enableSpinner(true);
            let responseItems = await apiClient.searchItems(searchItem)
            enableSpinner(false);

            this.setState({
                items : responseItems.data.list
            });

            $('#exampleModalBonificacion').modal('show');

        } else {
            enableSpinner(true);
            let dataitem = await apiClient.searchItems(searchItem)
            enableSpinner(false);

            let data =  dataitem.data.list[0]
            if(!data){
                enableSpinner(true);
                let responseItems = await apiClient.searchItems();
                enableSpinner(false);

                this.setState({
                    items : responseItems.data.list
                });

                $('#ModalVenta').modal('show');
            } else {
                itemsSelectedBonification.push(data);

                // Rellena arreglos de venta y bonificacion dentro del paquete actual
                packagesInfo.map(pack => {
                    if(pack.packageId == packageListId){
                        pack.arrayBonificaciones = itemsSelectedBonification;
                    }
                });

                createPromo.buscarLike = '';
                createPromo.buscarBoniLike = '';

                this.setState({
                    itemsSelectedBonification: itemsSelectedBonification,
                    createPromo
                });
            }
        }
    }

    // Validacion de creacion de nuevo paquete (Click Boton) y abre modal de confirmación
    validateCreateNewPackage = async () => {
        const { notificationReducer: {showAlert} } = this.props;
        const { packagesInfo, packageListId } = this.state;

        //---- Empiezan validaciones al crear un nuevo paquete
        // Validacion para no dejar vacios los arreglos de Venta y Bonificacion
        let flag0 = true;
        packagesInfo.map(pack => {
            if(pack.packageId == packageListId){
                if(pack.arrayVentas.length === 0 || pack.arrayBonificaciones.length === 0) {
                    flag0 = false;
                }
            }
        });

        if (flag0 === false){
            showAlert({type: 'warning', message: ' Favor de seleccionar articulos para Ventas y Bonificaciones ', timeOut: 8000});
            return;
        }

        // Validacion para que al crear nuevo paq. si esta en Seleccion NO deba tener menos de dos registros en Bonificaciones
        let flag = true;
        packagesInfo.map(pack => {
            if(pack.packageId == packageListId){
                if(pack.checkSeleccionar == true && pack.arrayBonificaciones.length < 2) {
                    flag = false;
                }
            }
        });

        if (flag === false){
            showAlert({type: 'warning', message: ' El paquete actual se creó en modo selección, favor de insertar al menos dos artículos en bonificaciones  ', timeOut: 8000});
            return;
        }

        // Validacion para que al crear nuevo paq. si está en 'En la Compra de Cualquiera de' no haya menos de dos registros en Ventas
        let flag2 = true;
        packagesInfo.map(pack => {
            if(pack.packageId == packageListId){
                if(pack.type == 1 && pack.arrayVentas.length < 2) {
                    flag2 = false;
                }
            }
        });

        if (flag2 === false){
            showAlert({type: 'warning', message: ' El paquete actual se creó en modo En la Compra de Cualquiera de, favor de insertar al menos dos artículos en ventas  ', timeOut: 8000});
            return;
        }
        //---- Terminan validaciones al crear un nuevo paquete
        
        $('#exampleModalConfirm').modal('show');
    }

    // Creacion de nuevo paquete (Click Boton) y cierra modal de confirmación
    createNewPackage = async (checkType) => {
        const { notificationReducer: {showAlert} } = this.props;
        const { packagesInfo, createPromo } = this.state;
        let checkAutomaticoJs = checkType == 1 ? true : false;
        let checkSeleccionarJs = checkType == 2 ? true : false;
        
        
        let packageIdJs = packagesInfo.length === 0 ? 1 : packagesInfo[packagesInfo.length - 1].packageId + 1;
        let checkName = checkAutomaticoJs === true ? 'Automatico' : 'Selección';
        let packageNameJs = packagesInfo.length === 0 ? 'Paquete ' + packageIdJs + ' ' + checkName : 'Paquete ' + packageIdJs + ' ' + checkName;
        let typeUnicoMixto = createPromo.typeVol == 2 ? 2 : createPromo.typeVol == 1 ? 1 : 0;

        let data = {
            packageId : packageIdJs,
            packageName : packageNameJs,
            checkAutomatico : checkAutomaticoJs,
            checkSeleccionar: checkSeleccionarJs,
            type: typeUnicoMixto,
            globalQuantity : 1,
            arrayVentas : [],
            arrayBonificaciones : []
        }
        packagesInfo.push(data);

        showAlert({type: 'success', message: ' Nuevo paquete agregado ', timeOut: 8000});

        // this.setState({
        //     packagesInfo,
        //     packageListId : packageIdJs,
        //     itemsSelected : [],
        //     itemsSelectedBonification : [],
        //     checkAutomatico : checkAutomaticoJs,
        //     checkSeleccionar : checkSeleccionarJs
        // }); 
        this.setState({
            packagesInfo
        });

        $('#exampleModalConfirm').modal('hide');
        document.getElementById('CREATE').display = 'none';
        $('#modalSeleccted').modal('show');

    }

    // Eliminacion de paquete actual (Click Boton)
    // deleteActualPackage = async () => {
    //     const { notificationReducer: {showAlert} } = this.props;
    //     const { packagesInfo, packageListId, createPromo } = this.state;

    //     let packageIdToDelete = packageListId;
    //     if(packageIdToDelete != '' && packageIdToDelete != 0){
    //         let deleteIndex = -1;

    //         for (let i = 0; i < packagesInfo.length; i++) {
    //             if(packagesInfo[i].packageId == packageIdToDelete){
    //                 deleteIndex = i;
    //             }
    //         }
    //         packagesInfo.splice(deleteIndex, 1);
    
    //         showAlert({type: 'success', message: ' Paquete ' + packageIdToDelete + ' eliminado ', timeOut: 0});
    
    //         createPromo.buscarBoniLike = '';
    //         createPromo.buscarLike = '';
    //         this.setState({
    //             packagesInfo,
    //             packageListId : 0,
    //             createPromo,
    //             checkAutomatico : false,
    //             checkSeleccionar : false,
    //             itemsSelected : [],
    //             itemsSelectedBonification : []
    //         }); 

    //     } else {
    //         showAlert({type: 'warning', message: ' Selecciona un paquete de la lista para eliminar ', timeOut: 2500});
    //     }    
    // }
    
    // Cada que cambiamos un elemento de la lista de paquetes
    onChangeValuePackages  = async (event) => {
        const { notificationReducer: {showAlert} } = this.props;
        const { packagesInfo, packageListId, itemsSelectedBonification } = this.state;   

        //---- Empiezan validaciones al cambiar de paquete en lista
        // Validacion para no dejar vacios los arreglos de Venta y Bonificacion
        let flag0 = true;
        packagesInfo.map(pack => {
            if(pack.packageId == packageListId){
                if(pack.arrayVentas.length === 0 || pack.arrayBonificaciones.length === 0) {
                    flag0 = false;
                }
            }
        });

        if (flag0 === false){
            showAlert({type: 'warning', message: ' Favor de seleccionar articulos para Ventas y Bonificaciones ', timeOut: 8000});
            event.preventDefault();
            return;
        }

        // Validacion para que al crear nuevo paq. si esta en Seleccion NO deba tener menos de dos registros en Bonificaciones
        let flag = true;
        packagesInfo.map(pack => {
            if(pack.packageId == packageListId){
                if(pack.checkSeleccionar == true && pack.arrayBonificaciones.length < 2) {
                    flag = false;
                }
            }
        });

        if (flag === false){
            showAlert({type: 'warning', message: ' El paquete actual se creó en modo selección, favor de insertar al menos dos artículos en bonificaciones  ', timeOut: 8000});
            event.preventDefault();
            return;
        }

        // Validacion para que al crear nuevo paq. si está en 'En la Compra de Cualquiera de' no haya menos de dos registros en Ventas
        let flag2 = true;
        packagesInfo.map(pack => {
            if(pack.packageId == packageListId){
                if(pack.type == 1 && pack.arrayVentas.length < 2) {
                    flag2 = false;
                }
            }
        });

        if (flag2 === false){
            showAlert({type: 'warning', message: ' El paquete actual se creó en modo En la Compra de Cualquiera de, favor de insertar al menos dos artículos en ventas  ', timeOut: 8000});
            event.preventDefault();
            return;
        }
        //---- Terminan validaciones al cambiar de paquete en lista

        let id = event.nativeEvent.target.value;

        if (id != '0') {    
            let readArrayVentasPackage = [];
            let readArrayBonificacionesPackage = [];
            let checkAuto = false;
            let checkSelecc = false;
            // Lee arreglos de venta y bonificacion del nuevo paquete seleccionado en lista
            packagesInfo.map(pack => {
                if(pack.packageId == id){
                    readArrayVentasPackage = pack.arrayVentas;
                    readArrayBonificacionesPackage = pack.arrayBonificaciones;
                    checkAuto = pack.checkAutomatico;
                    checkSelecc = pack.checkSeleccion;
                }
            });

            //-----------------------------------------

            //-------------------------

            this.setState({
                packageListId : id,
                itemsSelected : readArrayVentasPackage,
                itemsSelectedBonification : readArrayBonificacionesPackage,
                checkAutomatico : checkAuto,
                checkSeleccion : checkSelecc
            });

        } else {
            this.setState({
                packageListId : id,
                itemsSelected : [],
                itemsSelectedBonification : []
            });
        }
    };
    
    // Cada que cambiamos una cantidad de un Item de Array Bonificacion
    // onChangeQuantityBonificacion  = async (event, index) => {
    //     const { packagesInfo, packageListId, itemsSelectedBonification } = this.state;
        
    //     // if (event.nativeEvent.data !== '') {
    //     //     itemsSelectedBonification.map((item, indexItem) => {
    //     //         if(indexItem == index){
    //     //             item.Quantity = event.nativeEvent.target.value;
    //     //         }
    //     //     });

    //     //     // Rellena arreglos de venta y bonificacion dentro del paquete actual
    //     //     packagesInfo.map(pack => {
    //     //         if(pack.packageId == packageListId){
    //     //             pack.arrayBonificaciones = itemsSelectedBonification;
    //     //         }
    //     //     });
            
    //     //     this.setState({
    //     //         itemsSelectedBonification
    //     //     });
    //     // }
    // };  

    // Cada que cambiamos una cantidad de un Item de Array Venta
    onChangeQuantityVenta = (event, index) => {
        const {createPromo,itemsSelected} = this.state;
        let  value= event.target.value;
        // itemsSelected[index].quantity = value

        //this.searchs(value)

        this.setState({
            itemsSelected
        });
        
    };

    onChangeQuantityBonificacion = (event, index, inPack,indBon) => {
        const {createPromo} = this.state;
        let  value= event.target.value;

        createPromo.packagesInfo[index].bonificacion[inPack][indBon].quantity = value

        this.searchs(value)

        this.setState({
            createPromo
        });
    }
    
    // Cada que cambiamos una cantidad de un Item
    onChangeGlobalQuantity  = async (event) => {
        const { packagesInfo, packageListId } = this.state;
        
        // if (event.nativeEvent.data !== '') {
        //     let value = event.nativeEvent.target.value;

        //     let data = {
        //         globalQuantity : value
        //     }

        //     // Agregar Cantidad Global al Paquete
        //     packagesInfo.map((pack) => {
        //         if(pack.packageId == packageListId){
        //             pack.globalQuantity = value;
        //         }
        //     });

        //     this.setState({
        //         globalQuantity : value
        //     });
        // }
    };  

    onChangeValue(event) {
        let chkAutomatico = document.getElementById('chkAutomatico').checked;
        let chkSeleccionar = document.getElementById('chkSeleccionar').checked;

        // if(chkUnico && chkAutomatico){
        //     document.getElementById('searchItemBoni').disabled = true;
        //     document.getElementById('btnBonification').disabled = true;
        // }
        // if(chkUnico && chkSeleccionar){
        //     document.getElementById('searchItemBoni').disabled = false;
        //     document.getElementById('btnBonification').disabled = false;
        // }

        // if(chkMixto && chkAutomatico){
        //     document.getElementById('searchItemBoni').disabled = true;
        //     document.getElementById('btnBonification').disabled = true;
        // }
        // if(chkMixto && chkSeleccionar){
        //     document.getElementById('searchItemBoni').disabled = false;
        //     document.getElementById('btnBonification').disabled = false;
        // }
    }

    ChangeValueActive(event){
        // let chkObligatory = document.getElementById('chkObligatory').checked;
        //let chkClient = document.getElementById('chkClient').checked;
        let chkActive = document.getElementById('chkActive').checked;
        // if(chkClient){
        //     document.getElementById('txtpromoUniClient').style.display = 'block';
        //     document.getElementById('inppromoUniClient').style.display = 'block';
        // }else{
            document.getElementById('txtpromoUniClient').style.display = 'none';
            document.getElementById('inppromoUniClient').style.display = 'none';
        // }
    }
    //Cambio condicion 
    async changeTypeSelectCond(event){
        const {createPromo, buscarLikeCondiotions} = this.state;
        let condicion = document.getElementById('typeselectCond').value; //event.nativeEvent.target.value || 
        createPromo.typeSelectCond = condicion;
        let data = {
            condicion : condicion,
            value : buscarLikeCondiotions 
        }

        let datos = [];
            let conditions = await apiClient.searchConditions(data)
            datos = conditions.data.list;
        
        this.setState({
            createPromo,
            Cond: datos
        });
    }

    changeCode = async (event) => {
        const {createPromo} = this.state;
        if (event.nativeEvent.data !== '') {
            createPromo.code = event.nativeEvent.target.value;
        }
        this.setState({
            createPromo
        });
    };

    changeUniClient = async (event) => {
        const {createPromo} = this.state;
        if (event.nativeEvent.data !== '') {
            createPromo.promoUniClient = event.nativeEvent.target.value;
        }
        this.setState({
            createPromo
        });
    };

    changeCond = async (event) => {
        const {createPromo} = this.state;
        if (event.nativeEvent.data !== '') {
            createPromo.valueSelectCond = event.nativeEvent.target.value;
        }
        this.setState({
            createPromo
        });
    };

    changeTypeReward = event => {
        const {createPromo} = this.state
        createPromo.typeReward = event.nativeEvent.target.value;

        if(createPromo.typeReward === '2'){
            document.getElementById('lblTypeRewardFin').style.display = 'block';
            document.getElementById('TypeRewardFin').style.display = 'block';
            document.getElementById('TypeRewardFin').value = '0';

            document.getElementById('seleccionarArticulosBonificacion').style.display = 'none';

        }if(createPromo.typeReward === '1'){
            
            document.getElementById('seleccionarArticulosBonificacion').style.display = 'block';
            document.getElementById('lblTypeRewardFin').style.display = 'none';
            document.getElementById('TypeRewardFin').style.display = 'none';
            document.getElementById('lblDescuento').style.display = 'none';
            document.getElementById('inpDescuento').style.display = 'none';

        }if(createPromo.typeReward === '0'){
            document.getElementById('lblTypeRewardFin').style.display = 'none';
            document.getElementById('TypeRewardFin').style.display = 'none';

            document.getElementById('lblDescuento').style.display = 'none';
            document.getElementById('inpDescuento').style.display = 'none';

            document.getElementById('seleccionarArticulosBonificacion').style.display = 'none';
        }

        this.setState({
            createPromo
        });
    };

    changeQuantity = (event) => {
        const {createPromo} = this.state;

        let newQuantity = event.nativeEvent.target.value;
        createPromo.quantityarticulos = newQuantity;
    };

    changeQuantityBoni = (event) => {
        const {createPromo} = this.state;

        let newQuantity = event.nativeEvent.target.value;
        createPromo.quantitybonifi = newQuantity;
    };

    ChangeValue(event) {
        let chkConditions = document.getElementById('chkConditions').checked;
        let chkVigencia = document.getElementById('chkVigencia').checked;

        if(chkConditions){
            document.getElementById('EspecificarCondiciones').style.display = 'block';
        }
        if(!chkConditions){
            document.getElementById('EspecificarCondiciones').style.display = 'none';
        }
        if(chkVigencia){
            document.getElementById('lblDateInicial').style.display = 'block';
            document.getElementById('lblDateFinal').style.display = 'block';
            document.getElementById('DateInicial').style.display = 'block';
            document.getElementById('DateFinal').style.display = 'block';
        }
        if(!chkVigencia){
            document.getElementById('lblDateInicial').style.display = 'none';
            document.getElementById('lblDateFinal').style.display = 'none';
            document.getElementById('DateInicial').style.display = 'none';
            document.getElementById('DateFinal').style.display = 'none';
        }
    };

    clean = event => {
        const {createPromo} = this.state;
        //createPromo = '';
        createPromo.detalle = false;
        document.getElementById('chkConditions').checked = false;
        document.getElementById('chkVigencia').checked = false;
        createPromo.packagesInfo = '';
        this.ChangeValue();
        createPromo.Name = '';
        createPromo.cumulative = 'SI';
        createPromo.priority = 1;
        createPromo.typeProm = '0'
        document.getElementById('lbltypeVol').style.display = 'none';
        document.getElementById('typeVol').style.display = 'none';
        createPromo.typeVol = '0'
        createPromo.typeSelectCond = '0'
        document.getElementById('seleccionarArticulos').style.display = 'none';
        // document.getElementById('chkAprobada').checked = false;
        this.cargarFecha();
        
        //this.cargarFecha();
        this.setState({
            createPromo,
            newprom : true,
            actualizar : false,
            itemsSelected : [],
            itemsSelectedBonification : [],
            arrayConditions : [],
            buscarLikeCondiotions : '',
            Cond : []
        });

        $('#CREATE').modal('show');
    };

    changerPriceList = (event) => {
        const {createPromo} = this.state;
        let noList=event.nativeEvent.target.value;
        noList = parseInt(noList)
        //noList = noList+1;

        createPromo.listNum = noList;

        this.setState({
            createPromo
        });                
    };

    changerPrice = (event) => {
        const {createPromo} = this.state;
        let noList=event.nativeEvent.target.value;
        noList = parseInt(noList)
        //noList = noList+1;

        createPromo.listNumber = noList;

        this.setState({
            createPromo
        });                
    };

    editMode = () => {
        this.setState({
            editMode: !this.state.editMode,
        });
    };

    renderEditButton = () => {
        const {action} = this.props;
        const {editMode, actualizar, newprom} = this.state;
        if (!editMode && actualizar && !newprom) {
            return (
                <button
                    type="button"
                    style={{backgroundColor: 'transparent', color: '#000'}}
                    className="btn"
                    onClick={this.editMode}>
                    <i className="fas fa-edit  fa-lg"/>
                    Editar
                </button>
            );
        }
    };

    changeAcumulable(event){
        const {createPromo} = this.state;
        createPromo.cumulative = event.nativeEvent.target.value;

        this.setState({
            createPromo
        });
    };

    toggleDocumentSelected = (id) => {
        this.setState(state => {
            const checkboxDataTables = new Map(state.checkboxDataTables);
            checkboxDataTables.set(id, !checkboxDataTables.get(id)); // toggle
            return {checkboxDataTables};
        });
    };

    toggleDocumentSelectedAll = (action) => {
        const {Promos} = this.state;
        let newCheckbox = (new Map(): Map<string, boolean>);
        Promos.map((prom, index) => {
            if (prom.aprobada != 1 && prom.aprobada != 2) {
                newCheckbox.set(index, action)
            }
        });
        this.setState({
            checkboxDataTables: newCheckbox
        });
    };

    refreshCreatePromo = createPromo => {
        // console.log('con< createPromo',createPromo);
        this.setState({
            createPromo,
            newprom : true,
            actualizar : false,
        })
    };

    duplicate = async event => {
        const {createPromo} = this.state;
        
        createPromo.Name = '';
        // document.getElementById('chkAprobada').checked = false;

        this.refreshCreatePromo(createPromo);
    };

    render() {
        const {history} = this.props;
        const {Promos,items ,itemsSelected,itemsSelectedBonification,createPromo, prices,Cond, packagesInfo, packageListId, globalQuantity, checkAutomatico, 
            checkSeleccionar,buscarLikeCondiotions, arrayConditions,actualizar,newprom,editMode,CardName,checkboxDataTables,responseArray } = this.state;
        // Valida que exista algun paquete antes de agregar articulos
        let disableSearches = packageListId == 0 ? true : false;
        // En la compra de cualquiera de -> 1
        let enableGlobalQuantity = createPromo.typeVol == 1 ? true : false;
        // Si el paquete tiene cantidad global
        let globalQuantityValidate = globalQuantity;
        // packagesInfo.map((pack ) => {
        //     if(pack.packageId == packageListId){
        //         globalQuantityValidate = pack.globalQuantity;
        //     }
        // });
        // Valida que exista un paquete para pintar checkAuto y checkSelecc
        // let enableCheck = packagesInfo.length !== 0 ? 'visible' : 'hidden';
        // Título de modal
        let typeUnicoMixto = createPromo.typeVol == 2 ? 'EN LA COMPRA DE' : createPromo.typeVol == 1 ? 'EN LA COMPRA DE CUALQUIERA DE' : '';

        let checkbox = {
            data: checkboxDataTables,
            selectOne: this.toggleDocumentSelected,
            selectAll: this.toggleDocumentSelectedAll,
        }        

        return (
            <div className="content-fluid" style={{marginTop: 200}}>
                <Session history={history} view={VIEW_NAME.PROMO_VIEW}/>
                <NavBar/>
                <BonificacionesModal 
                createPromo={createPromo}
                CardName={CardName}
                actualizar={actualizar}
                newprom={newprom}
                buscarLikeCondiotions={buscarLikeCondiotions}
                Cond={Cond}
                arrayConditions={arrayConditions}
                // openItemsClick={this.openItemsClick}
                openItemsBoniClick={this.openItemsBoniClick}
                items={items}
                itemsSelected={itemsSelected}
                itemsSelectedBonification={itemsSelectedBonification}
                selectItemsBonification={this.selectItemsBonification}
                enableGlobalQuantity={enableGlobalQuantity}
                globalQuantityValidate={globalQuantityValidate}
                // createNewPackage={this.createNewPackage}
                selectItems={this.selectItems}
                deleteCondition={this.deleteCondition}
                onChangeGlobalQuantity={this.onChangeGlobalQuantity}
                onChangeQuantityVenta={this.onChangeQuantityVenta}
                onChangeQuantityBonificacion={this.onChangeQuantityBonificacion}
                createPromotion = {this.createPromotion}
                UpdatePromotion = {this.UpdatePromotion}
                Activar = {this.Activar}
                Aprobar = {this.Aprobar}
                Rechazar = {this.Rechazar}
                duplicate = {this.duplicate}
                />
                <NotificationsModal
                responseArray ={responseArray}
                ></NotificationsModal>

                <div className="container mb-4" style={{paddingTop: 0}}>
                    <div className="row">
                        <div className="col">
                            <div  style={{paddingTop:'10px', paddingBottom:'10px'}}>
                                <h1 className="display-6 text-center jumbotron" style={{fontWeight:"bolder",fontSize:"2.5rem",textAlign:"center", color:"black"}}>Promociones</h1>
                            </div>
                        </div>    
                    </div>
                    <div className="row">
                        <div className="col-md-9 col-sm-12">
                        <div className="float-right">
                    {CardName === "Jesús Chuquilin" ? <button type="button" className="btn btn-primary "  onClick={this.AutorizarMasive}>Aprobación masiva</button>: '' } &nbsp;&nbsp; 
                        <button type="button" className="btn btn-success " data-toggle="modal" data-target=".bd-example-modal-lg" onClick={this.clean} style={{marginBottom:"0.4rem"}}>Nueva promoción</button>

                    </div>
                    
                    <br/>

                        </div>
                        <div className="col-md-3 col-sm-12">
                            <select id="Selectactiva" className="form-control btn-outline-secondary"
                                    style={{backgroundColor: 'transparent', borderColor: '#ced4da', color: '#000'}}
                                    onChange={(event) => this.buscarActiva(event)}>
                                <option value='Todo'>--Seleccionar--</option>
                                <option value='Activa'>Activas</option>
                                <option value='Inactiva'>Inactiva</option>
                                {/* <option value='Pendientes'>Pendientes</option> */}
                                {/* <option value='Rechazada'>Rechazada</option> */}
                                {/* <option value='Aprobadas'>Aprobada</option> */}
                            </select>                            
                        </div>
                    </div>
                    <br></br>

                    <div className="table-responsive" style={{marginBottom: 0, height: 400, maxHeight: 400, overflow: 'auto'}}> 
                        <table className="table table-hover scrolltable">
                            <thead style={{textAlign: "-webkit-center"}}>
                                <tr className="text-light text-center" style={{background: '#2d75bd', borderRadius: '0'}} >
                                <th scope="col">#</th>
                                {CardName === "Jesús Chuquilin" ? <th className="sticky-column" >
                                    <input type="checkbox" style={{minWidth: '100%'}} id="cbox2" value="second_checkbox"
                                        onChange={(event) => checkbox.selectAll(event.target.checked)}/>
                                </th> : '' }
                                <th scope="col">Nombre</th>
                                {/* <th scope="col">Vigencia</th> */}
                                <th scope="col">Valida desde</th>
                                <th scope="col">Valida hasta</th>
                                <th scope="col">Prioridad</th>
                                <th scope="col">Acumulativa</th>
                                {/* <th scope="col">Obligatoria</th> */}
                                <th scope="col">Activa</th>
                                {/* <th scope="col">Aprobada</th> */}
                                <th scope="col"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {Promos.map((prom, index ) => {
                                // if((index + 1) <= 20){
                                    return(
                                        <tr className="text-center" >
                                            <th scope="row">{index+1}</th>
                                            {CardName === "Jesús Chuquilin" ?<td className="text-center">
                                                <input type="checkbox" style={{minWidth: '100%'}} id="cbox2" disabled={prom.aprobada === 1 ? true : prom.aprobada === 2 ? true : false } checked={!!checkbox.data.get(index)} onChange={() => checkbox.selectOne(index)}/>
                                            </td> : '' }
                                            <td>{prom.nombre}</td>
                                            {/* <td>{prom.vigencia === 1 ? 'SI' : 'NO'}</td> */}
                                            <td>{prom.desde === 'null' ? '---' : prom.desde}</td>
                                            <td>{prom.hasta === 'null' ? '---' : prom.hasta}</td>
                                            <td>{prom.prioridad}</td>
                                            <td>{prom.acumulable === 1 ? 'SI' : 'NO'}</td>
                                            {/* <td>{prom.obligatoria === 1 ? 'SI' : 'NO'}</td> */}
                                            <td>{prom.activa === 1 ? 'SI' : 'NO'}</td>
                                            {/* <td>{prom.aprobada === 1 ? 'NO' : prom.aprobada === 2 ? 'SI' : 'Pendiente'}</td> */}
                                            <td>
                                                <button
                                                    className="btn btn-sm"
                                                    type="button"
                                                    //data-toggle="modal" data-target=".bd-example-modal-lg"
                                                    style={{ backgroundColor: '#0060EA', color: config.navBar.iconModal }}
                                                    onClick={() => this.Details(prom.idRegistro)}> 
                                                   seleccionar
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                /*}*/
                                })}
                            </tbody>
                        </table>
                    </div>
                    <br></br>
                    {/* style={{display:Tipo === 'W' ? 'block' : 'none' }} data-toggle="modal" data-target=".estasSeguro" */}
                    
                </div>
                            
                            {/*--------------- MODAL AGREGAR ARTICULOS BONIFICACION ---------------*/}
                    {/* <div className="modal fade modalitemsBonificacion" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" id="modalSelecctedBonificacions"
                        aria-hidden="true">
                        <div className="modal-dialog modal-lg">
                            <div className="modal-content" style={{position:'center'}}>
                            <div className="modal-content">
                                <div className="modal-header text-light" style={{background: '#2d75bd', borderRadius: '0' }}>
                                    <h5 className="modal-title" id="modal-basic-title ">Agregar artículos bonificación</h5>

                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true" className="white-text">&times;</span>
                                    </button>
                                </div>

                                <div className="modal-body">

                                    <div className="form-group row" style={{marginBottom: '2px'}}>
                                        <label for="inputEmail3" className="col-sm-6 col-form-label" style={{textAlign: 'right'}} >Cantidad para bonificación</label>
                                        <div className="col-sm-6">
                                        <input type="text" className="form-control" id="QuantityItemsBoni" onChange={this.changeQuantityBoni} autoComplete="off" placeholder="Cantidad"/>
                                        </div>                                        
                                    </div>

                                    <div className="form-group row" style={{marginBottom: '2px'}} onChange={this.onChangeValue}>
                                        <legend className="col-form-label col-sm-4 pt-0">Bonificación</legend>
                                            <div className="col-sm-4">
                                                <div className="form-check"> 
                                                    <input type="radio" className="form-check-input" id="chkAutomatico" name="materialExampleRadioss" style ={{width:'15px', height:'15px'}} />
                                                    &nbsp;
                                                    <label className="form-check-label" for="chkAutomatico"><h6>Automatico</h6></label>
                                                </div>
                                                <div className="form-check">
                                                <input type="radio" className="form-check-input" id="chkSeleccionar" name="materialExampleRadioss" style ={{width:'15px', height:'15px'}}/>
                                                    &nbsp;
                                                    <label className="form-check-label" for="chkSeleccionar"><h6>Seleccionar</h6></label>
                                                </div>
                                            </div>
                                    </div>
                                    &nbsp;

                                    <div className="form-group row" style={{marginBottom: '2px'}}>
                                        <div className="col-md-12">
                                            <div className="form-group row">
                                                <div className="col-md-4">
                                                    <h4>Bonificación</h4>
                                                </div>
                                                <div className="col-md-7">
                                                    <input
                                                        id="searchItemBoni"
                                                        type="search"
                                                        className="form-control"
                                                        autoComplete="off"
                                                        placeholder="Buscar artículo"
                                                        onKeyPress={(ev) => {                           
                                                            if (ev.key === 'Enter') {
                                                                this.openItemsBoni();
                                                            }}}
                                                        value={createPromo.buscarBoniLike ? createPromo.buscarBoniLike : '' } onChange={this.hadleChangeBoni}
                                                        />
                                                </div>
                                                <div className="col-md-1">
                                                    <button type="button" id="btnBonification"
                                                    style={{
                                                        backgroundColor: 'transparent',
                                                        padding: 5,
                                                        color: 'green',
                                                        paddingTop: 2,
                                                        paddingBottom: 2,
                                                    }}
                                                    className="btn" data-toggle="modal" data-target="#exampleModalBonificacion"> 
                                                    
                                                        <i className="fa fa-plus-circle" aria-hidden="true" size="10"/>
                                                    </button>
                                                </div>
                                            </div>
                                            <div style={{marginBottom: 0, height: 290, maxHeight: 290, overflow: 'auto'}}> 
                                                <table className="table">
                                                    <thead>
                                                        <tr className="text-light bg-primary" >
                                                        <th scope="col">#</th>
                                                        <th scope="col">Artículo</th>
                                                        <th scope="col">Descripción</th>
                                                        <th scope="col"></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {itemsSelectedBonification.length !== 0 && itemsSelectedBonification.map((item, index ) => {
                                                            return(
                                                                <tr>
                                                            <th scope="row">{index+1}</th>
                                                            <td>{item.ItemCode}</td>
                                                            <td>{item.ItemName}</td>

                                                            <td
                                                    className="sticky-columns"
                                                    style={{
                                                        backgroundColor: item.LineStatus ? 'rgb(210,210,210)' : '#FFF',
                                                        textAlign: 'center'
                                                    }}>
                                                
                                                        <button
                                                            type="button"
                                                            style={{
                                                                backgroundColor: 'transparent',
                                                                padding: 5,
                                                                color: '#c42222',
                                                                paddingTop: 2,
                                                                paddingBottom: 2,
                                                            }}
                                                            className="btn"
                                                            onClick={() => this.deleteItemBonification(index)}>
                                                            <i className="fas fa-trash-alt" aria-hidden="true" size="10"/>
                                                        </button>
                                                    
                                                </td>
                                                            </tr>
                                                            )
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                    
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-success float-right"  onClick={() => this.finishSelectionBoni()}>Terminar selección</button>
                                </div>
                            </div>
                            </div>
                        </div>
                    </div> */}

                </div>
            
        );
    }
}

const mapStateToProps = store => {
    return {
        sessionReducer: store.SessionReducer,
        configReducer: store.ConfigReducer,
        notificationReducer: store.NotificationReducer,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        enableSpinner: value => dispatch({type: DISPATCH_ID.CONFIG_SET_SPINNER, value}),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PromocionalesView);



//export default PromocionalesView;//