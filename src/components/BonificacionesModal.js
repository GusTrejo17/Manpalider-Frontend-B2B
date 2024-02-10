import React, {Component} from 'react';
import {VIEW_NAME, config, SERVICE_API, DISPATCH_ID, SERVICE_RESPONSE} from "../libs/utils/Const";
import {connect} from 'react-redux';
import {CondicionesModal, SelectOfPromotionsModal, ArticulosVentaModal,CrearPaqueteModal} from "../components";
import $ from 'jquery';
import {ApiClient} from "../libs/apiClient/ApiClient";

let apiClient = ApiClient.getInstance();

class BonificacionesModal extends Component {

    constructor(props) {
        super(props);

        this.state = {
            Promos : [],
            items : [],
            editMode: false,
            arrayConditions : [],
            itemsSelected : [],
            itemsSelectedBonification: [],
            finishItems : [],
            arr : [],
            packagesInfo: null,
            packageListId : 0,  
            globalQuantity : 1,  
            checkAutomatico : false,
            checkSeleccionar : false,   
            buscarLikeCondiotions : '',
            searchItemsValue : '',
            typeItem : '',
            indexItem: null,
            indexBoni: null,
            indexCombo: null,
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
            }
        };
    };

    async componentDidMount(){
        this.cargarDatos();   
        this.cargarFecha();
    };

    async cargarDatos (){
        
        // document.getElementById('chkAutomatico').checked = true;

        //ocultar ESPECIFICAR CONDICIONES
        document.getElementById('EspecificarCondiciones').style.display = 'none';
        // document.getElementById('searchItemBoni').disabled = true;
        // document.getElementById('btnBonification').disabled = true;
        // document.getElementById('txtCode').style.display = 'none';
        // document.getElementById('inpCode').style.display = 'none';

        document.getElementById('txtpromoUniClient').style.display = 'none';
        document.getElementById('inppromoUniClient').style.display = 'none';
        //Ocultar fechas
        document.getElementById('lblDateInicial').style.display = 'none';
        document.getElementById('lblDateFinal').style.display = 'none';
        document.getElementById('DateInicial').style.display = 'none';
        document.getElementById('DateFinal').style.display = 'none';
        //
        document.getElementById('lbltypeVol').style.display = 'none';
        document.getElementById('typeVol').style.display = 'none';
        // OCULTAR SELECCIONAR ARTICULOS
        document.getElementById('seleccionarArticulos').style.display = 'none';

        //Ocultar tipo de regalo financiero
        document.getElementById('lblTypeRewardFin').style.display = 'none';
        document.getElementById('TypeRewardFin').style.display = 'none';
        //OCULTAR DESCUENTO
        document.getElementById('lblDescuento').style.display = 'none';
        document.getElementById('inpDescuento').style.display = 'none';
        //Ocultar select monto
        // document.getElementById('lbltypeMonto').style.display = 'none';
        // document.getElementById('typeMonto').style.display = 'none';
        //ACTIVAR
        document.getElementById('chkActive').checked = true;
        //Articulos bonifiacion
        document.getElementById('seleccionarArticulosBonificacion').style.display = 'none';
        //MONTO
        document.getElementById('lblMon').style.display = 'none';
        document.getElementById('inpMon').style.display = 'none';
        // Lista de precios
        //document.getElementById('lblList').style.display = 'none';
        //document.getElementById('TypeList').style.display = 'none';

        ///////////////////////
        let user = localStorage.getItem(config.general.localStorageNamed + 'CurrentUser');
        user = JSON.parse(user) || {};

        this.setState({
            CardName : user.CardName,
        });
    };

    cargarFecha(){
        const {createPromo} = this.props;
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
    };

    changeName  = async (event) => {
        const {createPromo} = this.props;
        if (event.nativeEvent.data !== '') {
            createPromo.Name = event.nativeEvent.target.value;
        }
        this.setState({
            createPromo
        });
    };

    changeTypeProm(event){
        const {createPromo} = this.props;
        
        createPromo.typeProm = event.nativeEvent.target.value;

        // if(createPromo.typeProm === '3'){
        //     document.getElementById('inpCode').style.display = 'block';
        //     document.getElementById('txtCode').style.display = 'block';
        // }
        if(createPromo.typeProm === '1'){
            document.getElementById('lbltypeVol').style.display = 'block';
            document.getElementById('typeVol').style.display = 'block';

            document.getElementById('typeVol').value = '0';
            //Tipo monto
            // document.getElementById('lbltypeMonto').style.display = 'none';
            // document.getElementById('typeMonto').style.display = 'none';

            document.getElementById('lblMon').style.display = 'none';
            document.getElementById('inpMon').style.display = 'none';

        }
        if(createPromo.typeProm === '2' ){
            // document.getElementById('inpCode').style.display = 'none';
            // document.getElementById('txtCode').style.display = 'none';
            
            // document.getElementById('lbltypeMonto').style.display = 'block';
            // document.getElementById('typeMonto').style.display = 'block';
            // document.getElementById('typeMonto').value = '0';

            document.getElementById('lblMon').style.display = 'block';
            document.getElementById('inpMon').style.display = 'block';
            

            document.getElementById('lbltypeVol').style.display = 'none';
            document.getElementById('typeVol').style.display = 'none';

            document.getElementById('seleccionarArticulos').style.display = 'none';
        }
        if(createPromo.typeProm === '0'){
            document.getElementById('lbltypeVol').style.display = 'none';
            document.getElementById('typeVol').style.display = 'none';

            document.getElementById('typeVol').value = '0';
            //Tipo monto
            // document.getElementById('lbltypeMonto').style.display = 'none';
            // document.getElementById('typeMonto').style.display = 'none';
            // document.getElementById('typeMonto').value = '0';

            document.getElementById('lblMon').style.display = 'none';
            document.getElementById('inpMon').style.display = 'none';

            document.getElementById('seleccionarArticulos').style.display = 'none';

        }

        this.setState({
            createPromo
        });
    };

    changeTypeVol(event){
        const {createPromo} = this.props;
        createPromo.typeVol = event.nativeEvent.target.value;
        
        if(createPromo.typeVol == '0'){
            //document.getElementById('priceList').style.display = 'none';
        }
        if(createPromo.typeVol == '1'){
            document.getElementById('seleccionarArticulos').style.display = 'block';

            //document.getElementById('priceList').style.display = 'block';                       
        }
        if(createPromo.typeVol == '2'){
            document.getElementById('seleccionarArticulos').style.display = 'block';
            
            //document.getElementById('priceList').style.display = 'none';             
        }

        this.setState({
            createPromo
        });
    };

    changeTypeMonto(event){
        const {createPromo} = this.props;
        createPromo.typeMonto = event.nativeEvent.target.value;
        
        // if(createPromo.typeMonto == '0'){
        //     document.getElementById('seleccionarArticulos').style.display = 'none';
        // }
        // if(createPromo.typeMonto == '1' || createPromo.typeMonto == '2'){
        //     document.getElementById('seleccionarArticulos').style.display = 'block';
        // }

        this.setState({
            createPromo
        });
    };

    changeMonto = async (event) => {
        const {createPromo} = this.props;
        if (event.nativeEvent.data !== '') {
            let monto = event.nativeEvent.target.value;
            createPromo.Monto = parseInt(monto);
        }
        this.setState({
            createPromo
        });
    };

    changeAcumulable(event){
        const {createPromo} = this.props;
        createPromo.cumulative = event.nativeEvent.target.value;

        this.setState({
            createPromo
        });
    };

    changePriority(event){
        const {createPromo} = this.props;
        createPromo.priority = event.nativeEvent.target.value;

        this.setState({
            createPromo
        });
    };

    changeDateInicial = event => {
        const {createPromo} = this.props;
        if (event.nativeEvent.data !== '') {
            createPromo.dateInicial = event.nativeEvent.target.value;
        }else{
            createPromo.dateInicial = createPromo.dateInicial;
        }
        this.setState({
            createPromo
        });
    };

    changeDateFinal = event => {
        const {createPromo} = this.props;
        if (event.nativeEvent.data !== '') {
            createPromo.dateFinal = event.nativeEvent.target.value;
        }else{
            createPromo.dateFinal = createPromo.dateFinal;
        }
        this.setState({
            createPromo
        });
    };

    changeTypeRewardFin = event => {
        const {createPromo} = this.props;
        createPromo.typeRewardFin = event.nativeEvent.target.value;

        if(createPromo.typeRewardFin === '0'){
            document.getElementById('lblDescuento').style.display = 'none';
            document.getElementById('inpDescuento').style.display = 'none';  
            
            document.getElementById('lblList').style.display = 'none';
            document.getElementById('TypeList').style.display = 'none'; 
        }
        if(createPromo.typeRewardFin === '1'){
            document.getElementById('lblDescuento').style.display = 'none';
            document.getElementById('inpDescuento').style.display = 'none';  
            
            document.getElementById('lblList').style.display = 'block';
            document.getElementById('TypeList').style.display = 'block'; 
        }if(createPromo.typeRewardFin === '2' || createPromo.typeRewardFin === '3'){
            document.getElementById('lblDescuento').style.display = 'block';
            document.getElementById('inpDescuento').style.display = 'block';   

            document.getElementById('lblList').style.display = 'none';
            document.getElementById('TypeList').style.display = 'none';    
        }

        this.setState({
            createPromo
        });
    };

    changeDescuento  = async (event) => {
        const {createPromo} = this.props;
        if (event.nativeEvent.data !== '') {
            createPromo.descuento = event.nativeEvent.target.value;
        }
        this.setState({
            createPromo
        });
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

    createNewPackage = async (param) => {
        const {createPromo} = this.props;
        createPromo.checkAutomatico = param;
        this.setState({
            packagesInfo: param,
            createPromo
        });
        $('#exampleModalConfirm').modal('hide');
        document.getElementById('CREATE').display = 'none';
        $('#modalSeleccted').modal('show');
    }

    // Ventas (Click Boton)
    openItemsClick = async (type = null, indexItem = null,indexCombo = null, indexBoni = null) => {
        const { createPromo, itemsSelected, packagesInfo, packageListId  } = this.state;
        const { enableSpinner } = this.props;  
        let searchItem = createPromo.buscarLike;
        
        if(searchItem === ''){
            // Trae toda la lista de articulos y abre el modal
            if(type === 1 || type === 3){
                enableSpinner(true);
                let responseItems = await apiClient.searchItems(searchItem)
                enableSpinner(false);

                this.setState({
                    items : responseItems.data.list,
                    typeItem: type,
                    indexItem: indexItem,
                    indexBoni: indexBoni,
                    indexCombo: indexCombo
                });
                $('#ModalVenta').modal('show');
            }else if(type === 2){ 
                for (let i = 0; i < itemsSelected.length; i++) {
                    const item = itemsSelected[i];
                    if( i === indexItem ){
                        item.bonificacion.push([]);
                    }
                }
                createPromo.packagesInfo = itemsSelected
                this.setState({
                    itemsSelected: itemsSelected,
                    createPromo
                });
            }           
        }
        // else {
        //     // Busca solo el Item ingresado
        //     enableSpinner(true);
        //     let dataitem = await apiClient.searchItems(searchItem);
        //     enableSpinner(false);
            
        //     let data =  dataitem.data.list[0];
        //     if(!data){
        //         enableSpinner(true);
        //         let responseItems = await apiClient.searchItems();
        //         enableSpinner(false);

        //         this.setState({
        //             items : responseItems.data.list
        //         });

        //         $('#ModalVenta').modal('show');
        //     } else {
        //         itemsSelected.push(data);

        //         // Rellena arreglos de venta y bonificacion dentro del paquete actual
        //         packagesInfo.map(pack => {
        //             if(pack.packageId == packageListId){
        //                 pack.arrayVentas = itemsSelected;
        //             }
        //         });

        //         createPromo.buscarLike = '';
        //         createPromo.buscarBoniLike = '';

        //         this.setState({
        //             itemsSelected: itemsSelected,
        //             createPromo
        //         });
        //     }
        // }        
    }

    hadleChangeTable = event => {
        const {createPromo} = this.state;
        let  value= event.target.value;
        this.search(value)
        // createPromo.buscarLikeTable = value

        this.setState({
            searchItemsValue: value
        });
    }

    async search(value){
        const {createPromo} = this.state;
        const {enableSpinner} = this.props;    
        
        if(value){
            let item =  value || '';

            enableSpinner(true);
            let responseItems = await apiClient.searchItems(item)
            enableSpinner(false);
    
            this.setState({
                items : responseItems.data.list            
            });
        }
    }

    selectItems = async (itemSele = null) => {
        const { itemsSelected, typeItem, indexItem,indexBoni,indexCombo, createPromo} = this.state;
        let bandera = false;
        itemsSelected.map(arr => {
            if(arr.itemCode === itemSele.ItemCode){
                bandera = true;
            }
        })
        if(typeItem === 1 && !bandera){
            let combo = [];
            let item = {
                itemCode : itemSele.ItemCode,
                itemName : itemSele.ItemName,
                quantity: itemSele.Quantity || 1,
                bonificacion: [
                    combo
                ]
            };
            itemsSelected.push(item);
        }else if(typeItem === 3){
            for (let i = 0; i < itemsSelected.length; i++) {
                const item = itemsSelected[i];
                for (let j = 0; j < item.bonificacion.length; j++) {
                    const bonificacion = item.bonificacion[j];
                    if(i === indexItem &&  j === indexCombo){
                        bonificacion.push(
                            {
                                itemCode : itemSele.ItemCode,
                                itemName : itemSele.ItemName,
                                quantity: itemSele.Quantity || 1,
                            }
                        );
                    }
                }
            }
           
        }
        createPromo.packagesInfo = itemsSelected
        this.setState({
            itemsSelected: itemsSelected,
            createPromo
        });     
       
        // enableSpinner(true);
        // let dataitem = await apiClient.searchItems(item)
        // enableSpinner(false);
        // let data =  dataitem.data.list[0]
        // Rellena arreglos de venta y bonificacion dentro del paquete actual
        // packagesInfo.map(pack => {
        //     if(pack.packageId == packageListId){
        //         pack.arrayVentas = itemsSelected;
        //     }
        // });  
       
    }

    deleteItemsSelected = async (type = null, indexItem = null  ,indexCombo = null, indexBoni = null) => {
        const { itemsSelected, createPromo } = this.state;
        if(type === 1){
            itemsSelected.splice(indexItem,1);
        }else if(type === 2){
            for (let i = 0; i < itemsSelected.length; i++) {
                const item = itemsSelected[i];
                if( i === indexItem ){
                    item.bonificacion.splice(indexCombo,1);
                }
            }
        }else if(type === 3){
            for (let i = 0; i < itemsSelected.length; i++) {
                const item = itemsSelected[i];
                for (let j = 0; j < item.bonificacion.length; j++) {
                    const combo = item.bonificacion[j];
                    if(i === indexItem &&  j === indexCombo){
                        combo.splice(indexBoni,1);
                    }
                }
            }
        }
        createPromo.packagesInfo = itemsSelected

        this.setState({
            itemsSelected: itemsSelected,
            createPromo
       });

       
        // enableSpinner(true);
        // let dataitem = await apiClient.searchItems(item)
        // enableSpinner(false);
        // let data =  dataitem.data.list[0]
        // Rellena arreglos de venta y bonificacion dentro del paquete actual
        // packagesInfo.map(pack => {
        //     if(pack.packageId == packageListId){
        //         pack.arrayVentas = itemsSelected;
        //     }
        // });  
       
    }

    OpenCondiciones = ()=>{
        $('#modalConditions').modal('show');
    }

    OpenItems = async() =>{
        const {createPromo, itemsSelected} = this.props;
        let tipo = createPromo.tipoPack;
        if(createPromo.detalle){

            // let getDisparador = await apiClient.getPromocionDisparador(createPromo.disparador);
            // let getBonificacion = await apiClient.getPromocionDisparador(createPromo.bonificacion);

            // getDisparador.data.map(disparador =>{
            //     disparador.bonificacion =[]
            // });

            // getDisparador.data.map(disp =>{
            // let combo = []
            // getBonificacion.data.map(bon =>{
                
            //     if(disp.relacion === bon.relacion){
            //         combo.push(bon); 
            //     }
            // })

            // let items = [];
            // let registrados = [];
            // for (let index = 0; index < combo.length; index++) {
            //     const element = combo[index];
            //         let include = registrados.includes(element.indexPack);
            //         if(!include){
            //         let arrayTemp = combo.filter(item => (item.indexPack === element.indexPack));
            //         registrados.push(element.indexPack);
            //         items.push(arrayTemp);
            //         }
            // }  
            // disp.bonificacion = items;
            // });

            this.setState({
                itemsSelected
            }); 

            this.createNewPackage(tipo)
        }
        else{
            $('#exampleModalConfirm').modal('show');

            this.setState({
                // validar para que cuando sea una promo nueva no se limpie
                itemsSelected: []
            }); 
        }
        
        //$('#modalSeleccted').modal('show');
    };

    onChangeQuantityVenta = (event, index) => {
        const {itemsSelected, createPromo} = this.state;
        let  value = event.nativeEvent.target.value;
        itemsSelected[index].quantity = value;

        createPromo.packagesInfo = itemsSelected
        this.setState({
            itemsSelected,
            createPromo
        });
        
    };

    onChangeQuantityBonificacion = (event, index, inPack,indBon) => {
        const {itemsSelected, createPromo} = this.state;
        let  value = event.nativeEvent.target.value;
        itemsSelected[index].bonificacion[inPack][indBon].quantity = value;
        // createPromo.packagesInfo[index].bonificacion[inPack][indBon].quantity = value

        // this.searchs(value)
        createPromo.packagesInfo = itemsSelected
        this.setState({
            itemsSelected,
            createPromo
        });
    }

    

    render (){
        const {createPromo,
            CardName,
            actualizar,
            newprom,
            createPromotion,
            UpdatePromotion,
            Activar,
            Aprobar,
            Rechazar,
            buscarLikeCondiotions,
            Cond,arrayConditions,enableGlobalQuantity,globalQuantityValidate,openItemsBoniClick,selectItemsBonification,onChangeGlobalQuantity,changeCondiotions,deleteCondition, duplicate} = this.props;
            const {packagesInfo,items,searchItemsValue,itemsSelected,itemsSelectedBonification} = this.state;
            
        return (
        <div> 
          
            <div className="modal fade bd-example-modal-lg" id="CREATE" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">

                <CondicionesModal
                buscarLikeCondiotions={buscarLikeCondiotions}
                arrayConditions={arrayConditions}
                Cond={Cond}
                createPromo={createPromo}
                changeCondiotions={changeCondiotions}
                deleteCondition={deleteCondition}
                />

                <SelectOfPromotionsModal
                openItemsClick={this.openItemsClick}

                deleteItemsSelected={this.deleteItemsSelected}
                itemsSelected={itemsSelected}
                
                enableGlobalQuantity={enableGlobalQuantity}
                globalQuantityValidate={globalQuantityValidate}

                onChangeGlobalQuantity={onChangeGlobalQuantity}
                onChangeQuantityVenta={this.onChangeQuantityVenta}
                onChangeQuantityBonificacion={this.onChangeQuantityBonificacion}
                packagesInfo = {packagesInfo}

                createPromo={createPromo}
                />

                <ArticulosVentaModal
                searchItemsValue={searchItemsValue}
                items={items}
                selectItems={this.selectItems}
                hadleChangeTable= {this.hadleChangeTable}
                />

                <CrearPaqueteModal
                createNewPackage={this.createNewPackage}
                />
                <div className="modal-dialog modal-lg">
                    <div className="modal-content ">
                        <div className="modal-header text-light" style={{background: '#0060EA', borderRadius: '0' }}>
                                <h5 className="modal-title" id="modal-basic-title ">Bonificaciones</h5>

                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span className="text-white" aria-hidden="true">&times;</span>
                                </button>
                            </div>
                        
                        <div className="modal-body">
                            <div className='form-container' style={{ maxWidth: '600px', margin: '0 auto', padding: '10px', boxSizing: 'border-box' }}>
                        {/* {this.renderEditButton()} */}
                            <form>
                                {/* NOMBRE */}
                                <div className="form-group row" style={{marginBottom: '2px'}}>
                                    <label className="col-sm-5 col-form-label" style={{textAlign: 'right'}} >Nombre</label>
                                    <div className="col-sm-7">
                                    <input type="text" className="form-control" id="txtName" placeholder="Nombre promoción" autoComplete="off" onChange={this.changeName} value={createPromo.Name ? createPromo.Name : ''}/>
                                    </div>
                                </div>
                                {/* TIPO DE PROMOCION */}
                                <div className="form-group row" style={{marginBottom: '2px'}}>
                                    <label for="inputEmail3" className="col-sm-5 col-form-label" style={{textAlign: 'right'}}>Tipo promoción</label>
                                    <div className="col-sm-7">
                                        <select className="form-control" id="typeProm" onChange={event =>this.changeTypeProm(event)} value={createPromo.typeProm || '0'}>
                                            <option value="0">--seleccionar--</option>
                                            <option value="1">Volumen</option>
                                            {/* <option value="2">Monto</option>
                                            <option value="3">Otras</option> */}
                                        </select>
                                    </div>
                                </div>
                               
                                {/* TIPO VOLUMEN */}
                                <div className="form-group row" style={{marginBottom: '2px'}}>
                                    <label for="inputEmail3" className="col-sm-5 col-form-label" id="lbltypeVol" style={{textAlign: 'right'}}>Tipo volumen</label>
                                    <div className="col-sm-7">
                                        <select className="form-control" id="typeVol" onChange={event =>this.changeTypeVol(event)} value={createPromo.typeVol || '0'}>
                                            <option value="0">--seleccionar--</option>
                                            <option value="1">En la compra de cualquiera de</option>
                                            <option value="2">En la compra de</option>
                                            {/* <option value="3">Escala</option> */}
                                        </select>
                                    </div>
                                </div>

                                {/* Cantidad */}
                                <div className="form-group row" style={{marginBottom: '2px'}} >
                                        <label className="col-sm-5 col-form-label" style={{textAlign: 'right'}} id="lblMon" >Cantidad</label>
                                        <div className="col-sm-7">
                                        <input type="text" className="form-control" id="inpMon"  placeholder="Pon aqui el monto" autoComplete="off" onChange={this.changeMonto} value={createPromo.Monto ? createPromo.Monto : ''}/>
                                        </div>
                                    </div>
                                {/* SELECCIONAR ARTICULOS data-toggle="modal" data-target=".exampleModalConfirm"*/}
                                <div className="form-group row" id="seleccionarArticulos" style={{textAlign: 'center',marginBottom: '2px'}}>
                                        <u  onClick={() => this.OpenItems()}>Seleccionar articulos</u>
                                </div>
                                {/* ACUMULABLE */}
                                <div className="form-group row" style={{marginBottom: '2px'}}>
                                    <label for="inputEmail3" className="col-sm-5 col-form-label" style={{textAlign: 'right'}}>Acumulable</label>
                                    <div className="col-sm-7">
                                        <select className="form-control" id="cumulative" onChange={event =>this.changeAcumulable(event)} value={createPromo.cumulative || 'NO'}>
                                            <option value="SI">SI</option>
                                            <option value="NO">NO</option>
                                            {/* <option value="2">No acumulativa con otras</option> */}
                                        </select>
                                    </div>
                                </div>
                                {/* PRIORIDAD */}
                                <div className="form-group row" style={{marginBottom: '2px'}}>
                                    <label for="inputEmail3" className="col-sm-5 col-form-label" style={{textAlign: 'right'}}>Prioridad</label>
                                    <div className="col-sm-7">
                                        <select className="form-control" id="priority" onChange={event =>this.changePriority(event)} value={createPromo.priority || ''}>
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="4">4</option>
                                            <option value="5">5</option>
                                            <option value="6">6</option>
                                            <option value="7">7</option>
                                            <option value="8">8</option>
                                            <option value="9">9</option>
                                            <option value="10">10</option>
                                        </select>
                                    </div>
                                </div>
                                {/* APLICA CONDICIONES */}
                                <div onChange={this.ChangeValue}>
                                    <div className="form-group row" style={{marginBottom: '2px'}}>
                                        <label className="col-sm-5 col-form-label" style={{textAlign: 'right'}}></label>
                                        <div className="col-sm-7">
                                            <input type="checkbox"  id="chkConditions"/>&nbsp;
                                            <label for="chkConditions" className=" col-form-label" style={{textAlign: 'right'}}>Aplica condiciones</label>
                                        </div>
                                    </div>
                                    {/* data-toggle="modal" data-target="#exampleModalConditions" */}
                                    <div className="form-group row" id="EspecificarCondiciones" style={{textAlign: 'center',marginBottom: '2px'}} onClick={ this.OpenCondiciones} >  
                                            <u>Especificar condiciones</u>
                                    </div>
                                    {/* VIGENCIA */}
                                    <div className="form-group row" style={{marginBottom: '2px'}}>
                                        <label className="col-sm-5 col-form-label" style={{textAlign: 'right'}}></label>
                                        <div className="col-sm-7">
                                            <input type="checkbox"  id="chkVigencia" />&nbsp;
                                            <label for="chkVigencia" className=" col-form-label" style={{textAlign: 'right'}}>Vigencia</label>
                                        </div>
                                    </div>
                                </div>
                                {/* VALIDO DESDE  */}
                                <div className="form-group row" style={{marginBottom: '2px'}}>
                                    <label for="inputEmail3" className="col-sm-5 col-form-label" id="lblDateInicial" style={{textAlign: 'right'}}>Valido desde</label>
                                    <div className="col-sm-7">
                                        <input type="date" className="form-control" id="DateInicial" onChange={this.changeDateInicial} value={createPromo.dateInicial ? createPromo.dateInicial : ''}/>  
                                    </div>
                                </div>
                                {/* VALIDO HASTA */}
                                <div className="form-group row" style={{marginBottom: '2px'}}>
                                    <label for="inputEmail3" className="col-sm-5 col-form-label" id="lblDateFinal" style={{textAlign: 'right'}}>Valido hasta</label>
                                    <div className="col-sm-7">
                                        <input type="date" className="form-control" id="DateFinal" onChange={this.changeDateFinal} value={createPromo.dateFinal ? createPromo.dateFinal : ''}/>
                                    </div>
                                </div>
                                {/* OBLIGATORIA */}
                                <div onChange={this.ChangeValueActive}>
                                    
                                    {/* Cantidad */}
                                    <div className="form-group row" style={{marginBottom: '2px'}} >
                                        <label className="col-sm-5 col-form-label" style={{textAlign: 'right'}} id="txtpromoUniClient"  >Cantidad</label>
                                        <div className="col-sm-7">
                                        <input type="text" className="form-control" id="inppromoUniClient"  placeholder="Escribe aqui la cantidad para aplicar promocion por cliente" autoComplete="off" onChange={this.changeUniClient} value={createPromo.promoUniClient ? createPromo.promoUniClient : ''}/>
                                        </div>
                                    </div>
                                    {/* ACTIVA */}
                                    <div className="form-group row" style={{marginBottom: '2px'}}>
                                        <label  className="col-sm-5 col-form-label" style={{textAlign: 'right'}}></label>
                                        {/* disabled={(!editMode) ? true : false}   checked={createPromo.active === 1 ? true : false}*/}
                                        <div className="col-sm-7"> 
                                            <input type="checkbox"  id="chkActive"  />&nbsp;
                                            <label for="chkActive" className=" col-form-label" style={{textAlign: 'right'}} >Activa</label>
                                        </div>
                                    </div>
                                    
                                </div>
                                {/* TIPO DE REGALO FINANCIERO */}
                                <div className="form-group row" style={{marginBottom: '2px'}}>
                                    <label for="inputEmail3" id="lblTypeRewardFin" className="col-sm-5 col-form-label" style={{textAlign: 'right'}}>Tipo de regalo financiero</label>
                                    <div className="col-sm-7">
                                        <select className="form-control" id="TypeRewardFin" onChange={this.changeTypeRewardFin}>
                                            <option value="0">--seleccionar--</option>
                                            <option value="1">Cambio lista de precio</option>
                                            <option value="2">Procentaje de descuento en artículo</option>
                                            <option value="3">Porcentaje de descuento del documento</option>
                                        </select>
                                    </div>
                                </div>
                               
                                {/* DESCUENTO */}
                                <div className="form-group row" style={{marginBottom: '2px'}}>
                                    <label for="inputEmail3" className="col-sm-5 col-form-label" id="lblDescuento" style={{textAlign: 'right'}}>Descuento</label>
                                    <div className="col-sm-7">
                                        <input type="text"  id="inpDescuento"  onChange={this.changeDescuento} value={createPromo.descuento ? createPromo.descuento : ''}/>&nbsp;
                                        <label for="inputEmail3" className=" col-form-label" style={{textAlign: 'left'}}> </label>
                                    </div>
                                </div>
                                {/* SELECCIONAR ARTICULOS BONIFICACION */}
                                <div className="form-group row" id="seleccionarArticulosBonificacion" style={{textAlign: 'center',marginBottom: '2px'}}>
                                        <u data-toggle="modal" data-target=".modalitemsBonificacion" onClick={{/*() => this.search()*/}}>Seleccionar articulos de bonificación</u>
                                </div>
                                
                            </form>
                            </div>
                        </div>
                            
                        <div className="modal-footer justify-content-center">
                            {/* BOTON DUPLICAR =========== createPromo.aprobada != 0 && */}
                            <button type="button" className="btn btn-success float-left" style={{display:actualizar && createPromo.aprobada != 0 ? 'block' : 'none' }} onClick={() => Activar()}>{createPromo.active === 1 ? 'Desactivar' : 'Activar'}</button>
                            <button type="button" className="btn btn-dark float-left" style={{display:actualizar && createPromo.aprobada === 0 ? 'block' : 'none' }} onClick={() => UpdatePromotion()}>Actualizar</button>
                            <button type="button" className="btn btn-dark float-left" style={{display:!newprom ? 'block' : 'none' }} onClick={() => duplicate()}>Duplicar bonificación</button>
                            <button type="button" className="btn btn-success float-left" style={{display:actualizar && createPromo.aprobada === 0 ? 'block' : 'none' }} onClick={() => Aprobar()}>Aprobar</button>
                            <button type="button" className="btn btn-danger float-left" style={{display:actualizar && createPromo.aprobada === 0 ? 'block' : 'none' }} onClick={() => Rechazar()}>Rechazar</button>

                            <button type="button" className="btn btn-success float-right" style={{display:newprom ? 'block' : 'none' }} onClick={() => createPromotion()} data-toggle="modal" data-target=".bd-example-modal-lg">Crear bonificación</button>
                        </div>
                    </div>      {/* <!--/.Content--> <i className="far fa-gem ml-1 text-white"></i>*/}
                </div>
            </div>
        </div>)
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
)(BonificacionesModal)