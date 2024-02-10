import React, {Component} from 'react';
import {Footer, NavBar, Session, DocumentModel} from "../../components";
//import {VIEW_NAME, config} from "../../libs/utils/Const";
import {DISPATCH_ID, SERVICE_API, SERVICE_RESPONSE, VIEW_NAME, config} from "../../libs/utils/Const";
import {ApiClient} from "../../libs/apiClient/ApiClient";
import {connect} from "react-redux";
import {CSVLink, CSVDownload} from "react-csv";
import * as XLSX from 'xlsx';
import $ from 'jquery';
import { animateScroll as scroll, scroller } from 'react-scroll';

let apiClient = ApiClient.getInstance();

class SubirArchivo extends Component {

    constructor(props) {
        super(props);

        this.state = {
            Codigo : '',
            Nombre : '',
            Correo : '',
            Password : '',
            Promos : [],
            items : [],
            itemsSelected : [],
            itemsSelectedBonification: [],
            finishItems : [],
            arr : [],
            createPromo: {
                Name : '',
                buscarLike : '',
                buscarBoniLike : '',
            },
            SuppCatNumRepeat:[]
        };
        this.scrollToBottom = this.scrollToBottom.bind(this);
    };

    async componentDidMount(){
        this.cargarDatos();

        this.handleInputChange = this.handleInputChange.bind(this)
        this.scrollToBottom();
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

        let user = localStorage.getItem(config.general.localStorageNamed + 'CurrentUser');
        user = JSON.parse(user) || {};
        this.setState({   
            Codigo: user.CardCode,
            Password: user.U_FMB_Handel_Pass || '',
            Nombre : user.CardName  || '',
            Correo : user.U_FMB_Handel_Email  || '' 
        });
    };

    async handleInputChange (event) {
        const {enableSpinner, notificationReducer: {showAlert}} = this.props;
        const target = event.target
        const value = target.type === 'checkbox' ? target.checked : target.value
        const name = target.name
        const info = event.target.files[0] || null;
        const this2 = this
        this.setState({
            [name]: value
        })
        let hojas = []
        if(info){
            let ext = info.name.lastIndexOf(".");
            let validateExt = info.name.substring(ext, info.name.length);
            let flagValidationExt = validateExt == ".xlsx" || validateExt == ".xml" || validateExt == ".csv" ? true : false;
            if(flagValidationExt === false){
                showAlert({ type: 'warning', message: 'El archvio debe estar en formato Excel', timeOut: 8000 });
                document.getElementById("file").value= null
                return;
            }
        }
        if (name === 'file') {
            let reader = new FileReader()
            
            reader.readAsArrayBuffer(target.files[0])
            reader.onloadend = (e) => {
                var data = new Uint8Array(e.target.result);
                var workbook = XLSX.read(data, {type: 'array'});
                workbook.SheetNames.forEach(function(sheetName) {
                    // Here is your object
                    var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                    hojas.push({
                        data: XL_row_object,
                        sheetName
                    })
                });
                this2.setState({
                    selectedFileDocument: target.files[0],
                    hojas
                });
                if(hojas[0]){
                    this.openDetail(hojas[0]);
                }
            }
        }
    };
    validateSalesMultiplier = (order = undefined) => {
        const  { notificationReducer: {showAlert} } = this.props;
        let adjustMultiplier = false;
        if (!order) return;
        for (let i = 0; i < order.length; i++) {
            const item = order[i];
            if(item.SalesMultiplier && parseInt(item.SalesMultiplier) !== 0) {
                if(parseInt(item.quantity) % parseInt(item.SalesMultiplier) !== 0){
                    adjustMultiplier = true; break;
                }
            }
        }
        if(adjustMultiplier){
            showAlert({type: 'warning', message: 'Atención: Tus artículos señalados se ajustarán a nuestros múltiplos de venta', timeOut: 3000});
        }
    }

    openDetail = async docEntry => {
        const {enableSpinner, notificationReducer: {showAlert}} = this.props;
        enableSpinner(true);
        let response = await apiClient.getDataExcel(docEntry);
        enableSpinner(false);

        if (response.status === SERVICE_RESPONSE.SUCCESS) {
            const SuppCatNumRepeat = {}
            response.data.body.forEach(itm => {
            const element = itm.SuppCatNum;
            SuppCatNumRepeat[element] = (SuppCatNumRepeat[element] || 0) + 1;
            });
            for (const prop in SuppCatNumRepeat) {
                if (SuppCatNumRepeat[prop] > 1) {
                    showAlert({type: 'warning', message: "Aviso: El código de fabricante "+ prop + " se encontró más de una vez."})
                }
            }
            this.setState({
                items: response.data,
            });
            $('#docuementModal').modal('show');
            $("#file").val(null);
            this.validateSalesMultiplier(response?.data?.body ?? []);
            return;
        }
        //setTimeout(()=> {
        showAlert({type: 'error', message: "Aviso: "+response.message})
        //},50);
    };

    render() {
        const {history} = this.props;
        const {order,items,dataCsv} = this.state;
        return (
            <div className="content-fluid" style={{marginTop: 66}}>
                <Session history={history} view={VIEW_NAME.PROFILE_VIEW}/>
                <NavBar/>
                <DocumentModel order={items}/>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <div className="container mb-4" style={{paddingTop: 60}}>
                    <div className="row">
                        <div className="col">
                            <div className="jumbotron">
                                <h1 className="text-center"  style={{fontWeight:"bolder",fontSize:"2.5rem", color:"black"}} >Carga Masiva "desde un Excel"</h1>
                            </div>
                        </div>    
                    </div>
                </div>
                <div class="container" style={{paddingBottom: 160}}>
                    <div class="row">
                        <div class="col-sm">
                        </div>
                        <div class="col-sm-6">
                            {/* <h2 className="align-middle text-center">Subir desde un excel</h2> */}
                            <input style={{fontSize:"1.5rem"}} type="file" name="file" id="file" onChange={this.handleInputChange}  placeholder="Archivo de excel" className="form-control-file" ></input>
                        </div>
                        <div class="col-sm">
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
)(SubirArchivo);
