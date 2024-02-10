import React, {Component} from 'react';
import {Footer, NavBar, Session} from "../../components";
import {DISPATCH_ID, SERVICE_RESPONSE, config, ROLES,VIEW_NAME,SERVICE_API} from '../../libs/utils/Const';
import {ApiClient} from "../../libs/apiClient/ApiClient";
import { connect } from "react-redux";
import {scroller } from 'react-scroll';
import DocViewer from "react-doc-viewer";

let apiClient = ApiClient.getInstance();

const EMAIL_FORMAT_REGEX = /^([A-Za-z0-9_\-\.+])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

class JobView extends Component {

    constructor(props){
        super(props);
        this.state = {
            formStatus: false,
            typeForm: '',
            jobType: '',
            education: 'Secundaria',
            address: '',
            postalCode: '',
            phone: '',
            mail: '',
            lastName: '',
            name: '',
            cv: null,
            imagePreview: null,
            imagePreviewType: '',
            jobTypesInfo: []
        }
        this.scrollToBottom = this.scrollToBottom.bind(this);
        this.formFocus = React.createRef();
        this.formComprasFocus = React.createRef();
    }

    scrollToBottom() {
        scroller.scrollTo('scrollDownPlease', {
            duration: 1500,
            delay: 0,
            smooth: 'easeOutQuart',
            offset: 140,
            isDynamic: true
          })
    }

    // PropTypes.shape({
    //     scale: 1, // Thumbnail scale, ranges from 1 to 5
    // })

    async componentDidMount() {
        setTimeout(() => {
            this.scrollToBottom();
        }, 50);   
        await this.jobTypes();
    }

    jobTypes = async () => {
        const {sessionReducer, enableSpinner, notificationReducer:{showAlert}} = this.props;

        enableSpinner(true);
        let response = await apiClient.getJobTypes();
        enableSpinner(false);
        if (response.status === SERVICE_RESPONSE.SUCCESS) {
            this.setState({
                jobTypesInfo : response.data,
            });
        } else {
            showAlert({type: 'warning', message: response.message || ' No existen ofertas de empleo ', timeOut: 8000});                
        }
    }

    openForm = (type) => {
        this.setState({
            formStatus: true,
            typeForm: type,
            jobType: type
        })
        setTimeout(() => {
            this.formFocus.current.click();
        }, 250);
        setTimeout(() => {
            this.scrollToBottom();
        }, 50);        
    }

    closeForm = (type) => {
        const { typeForm } = this.state;
        if(typeForm !== type){
            this.setState({
                formStatus: false,
                typeForm: type
            })
            setTimeout(() => {
                this.scrollToBottom();
            }, 50);   
        }        
    }

    onChangeName = (value) => {
        this.setState({
            name: value,
        })
    }

    onChangeLastName = (value) => {
        this.setState({
            lastName: value,
        })
    }

    onChangeMail = (value) => {
        this.setState({
            mail: value,
        })
    }

    onChangePhone = (value) => {
        this.setState({
            phone: value,
        })
    }

    onChangePostalCode = (value) => {
        this.setState({
            postalCode: value,
        })
    }

    onChangeJobType = (value) => {
        this.setState({
            jobType: value,
        })
    }

    onChangeSchoolType = (value) => {
        this.setState({
            education: value,
        })
    }

    onChangeAddress = (value) => {
        this.setState({
            address: value,
        })
    }

    onChangeCV = (value) => {
        const { notificationReducer: {showAlert} } = this.props;

        if(value.size > 3000000){
            showAlert({ type: 'warning', message: 'El archivo no puede pesar más de 3MB', timeOut: 8000 });
            return;
        }

        let ext = value.name.lastIndexOf(".");
        let validateExt = value.name.substring(ext, value.name.length);
        let flagValidationExt = validateExt == ".docx" || validateExt == ".pdf" || validateExt == ".jpg" || validateExt == ".jpeg" 
                                || validateExt == ".png" || validateExt == ".doc" ? true : false;
        if(flagValidationExt === false){
            showAlert({ type: 'warning', message: 'El CV debe estar en formato word, PDF o imagen', timeOut: 8000 });
            return;
        }
        
        this.setState({
            cv: value,
            imagePreview: URL.createObjectURL(value),
            imagePreviewType: validateExt == ".png" || validateExt == ".jpg" || validateExt == ".jpeg" ? "image" : validateExt == ".docx" || validateExt == ".doc" ? "word" : validateExt == ".pdf" ? "pdf" : ""
        })

        showAlert({ type: 'success', message: 'Archivo adjuntado con éxito', timeOut: 8000 });
    }

    sendJobMail = async () => {
        const { enableSpinner, notificationReducer: {showAlert}, sessionReducer } = this.props;
        const { formStatus, typeForm, jobType, education, address, postalCode, phone, mail, lastName, cv, name } = this.state;

        if(jobType == '' || education == '' || address == '' || postalCode == '' || phone == '' || mail == '' || lastName == '' || name == ''){
            showAlert({ type: 'warning', message: 'Por favor, rellene todos los datos del formulario', timeOut: 8000 });
            return;
        }
        if(!mail.includes("@")){
            showAlert({ type: 'warning', message: 'Por favor, ingrese un correo válido', timeOut: 8000 });
            return;
        }

        if(cv === null){
            showAlert({ type: 'warning', message: 'Por favor, adjunte su CV', timeOut: 8000 });
            return;
        }

        const formData = new FormData();         
        formData.append("file", cv);
        formData.append("jobType", jobType);
        formData.append("education", education);
        formData.append("address", address);
        formData.append("postalCode", postalCode);
        formData.append("phone", phone);
        formData.append("mail", mail);
        formData.append("lastName", lastName);
        formData.append("cv", cv.name);
        formData.append("name", name);

        enableSpinner(true);
        let apiResponse = await apiClient.sendJobMail(formData);
        enableSpinner(false);

        if (apiResponse.status === SERVICE_RESPONSE.SUCCESS) {
            showAlert({ type: 'success', message: 'Tus datos se enviaron de forma exitosa. Nos comunicaremos contigo a través del correo ingresado', timeOut: 8000 });
            this.setState({
                formStatus: false,
                typeForm: '',
                jobType: '',
                education: '',
                address: '',
                postalCode: '',
                phone: '',
                mail: '',
                lastName: '',
                name: '',
                cv: null
            })
            this.formComprasFocus.current.click();
            setTimeout(() => {
                this.scrollToBottom();
            }, 50);   
        } else {
            showAlert({ type: 'error', message: apiResponse.message || 'Ocurrió un error al enviar sus datos', timeOut: 8000 });
        }
    }

    render() {
        const  { history } = this.props;
        const { jobTypesInfo, formStatus, typeForm, jobType, education, address, postalCode, phone, mail, lastName, cv, name, imagePreview, imagePreviewType } = this.state;

        return (
            <div className="content-fluid none-scroll" style={{marginTop: 150,backgroundColor:config.Back.backgroundColor }}>
                <Session history={history} view={VIEW_NAME.JOB_VIEW}/>
                <NavBar/>
                <div className="bannerRedCompensas margenS" style={{backgroundColor:config.Back.backgroundColor }}>
                    {/* <nav id="navFirst" className="​navbar navbar-expand-sm text-center" style={{ border: "none", background: config.navBar.backgroundColor }} > */}
                        <img id = "scrollDownPlease" className="img-fluid"
                            src={require('../../images/diasa/bolsaTrabajo/icon-01.png')}
                            alt="Segundo NavBar"
                        />
                    {/* </nav> */}
                </div>
                <div className=" mt-md-0 pb-4" style = {{backgroundColor: '#eeeeee'}}>   
                        <div className="row justify-content-center">
                            {/* Columna de menú */}
                            <div className="MenuEstadoDeCuenta col-lg-3 p-md-2 m-md-2" style = {{backgroundColor: '#E2E2E2'}}>
                                <div className="list-group" role="tablist" >
                                    {jobTypesInfo && jobTypesInfo.length > 0 && jobTypesInfo.map((job, index) => {
                                        return (
                                            <a ref={index === 0 ? this.formComprasFocus : ''} onClick = {() => this.closeForm(job.Name)} 
                                                className={"list-group-item list-group-item-action " + (!index ? 'active' : '')} 
                                                id={"list-"+job.Name.replace(/ /g,'')+"-list"} data-toggle="list" href={"#list-"+job.Name.replace(/ /g,'')}
                                                role="tab" aria-controls="home" style={{background: "#e9ecef"}}
                                                >
                                                    <h5>{job.Name}</h5>
                                            </a>
                                        )
                                    })}
                                    
                                    {jobTypesInfo && jobTypesInfo.length > 0 && formStatus === true && 
                                        <a ref={this.formFocus} onClick = {() => this.closeForm(typeForm)}
                                            className="list-group-item list-group-item-action-1"
                                            id="list-form-list" data-toggle="list"
                                            href="#list-form" role="tab"
                                            aria-controls="profile">
                                                <h5 className = "font*weight-bold">Formulario laboral</h5>
                                        </a>
                                    }                                    
                                </div>
                            </div>
                            <br/>
                            <br/>
                            {/* Columna de tablas de info. */}
                            <div className="col-lg-8">
                                <div className="tab-content">
                                    {jobTypesInfo && jobTypesInfo.length > 0 && jobTypesInfo.map((job, index) => {
                                        return (
                                            <div key={index} className={"tab-pane fade" + (!index ? ' show active' : '')} 
                                                id={"list-"+job.Name.replace(/ /g,'')} 
                                                role="tabpanel" 
                                                aria-labelledby={"list-"+job.Name.replace(/ /g,'')}>
                                                <h2 className = "text-right mt-md-2 mb-md-2 font-weight-bold" style = {{color:'#AFAFAF'}}>Estamos buscando tu talento</h2>
                                                <h5 className = "text-left font-weight-bold mb-md-4" style={{color: "#0078C0"}}>{'< Bolsa de Trabajo'}</h5>
                                                <div className="DetallesEstadoDeCuenta">
                                                    <div className="card rounded-lg text-left mb-md-4">
                                                        <div className="card-body" style = {{backgroundColor: '#efefef'}}>
                                                            <div className="card border-light text-left mb-md-3">
                                                                <div className="card-body bg-white">
                                                                <img
                                                                    className="img-fluid"
                                                                    style={{
                                                                        // width: "255px",
                                                                        // height: "640px",
                                                                        backgroundColor: "white",
                                                                        cursor: "pointer",
                                                                        marginRight: "auto",
                                                                        marginLeft: "auto",
                                                                    }}
                                                                    src={job.U_FileName ? (config.BASE_URL + SERVICE_API.getImage + '/' + job.U_FileName) : require('../../images/noImage.png')}
                                                                    alt=""
                                                                />
                                                                    {/* <strong><h1>{job.Name}</h1></strong><br/><br/>
                                                                    <p>
                                                                        <h3 className="font-weight-bold"><i>Únete a nuestro equipo en el área de "{job.Name}"</i></h3><br/><br/>
                                                                        <ul>
                                                                            <li>Contacto a proveedores y mejora de calidad para el área de producción</li>
                                                                        </ul>
                                                                    </p><br/>
                                                                    <p>
                                                                        <h3>Requisitos:</h3>
                                                                        <ul>
                                                                            <li>Escolaridad: Bachillerato</li>
                                                                        </ul>
                                                                    </p><br/>
                                                                    <p>Horario de L-V de 8:40 a 6:30 // Prestaciones de Ley</p><br/><br/> */}
                                                                    <p>
                                                                        <iframe src={job.U_Maps.toString()} width="100%" height="400" style={{border:0}} allowfullscreen="" loading="lazy"></iframe>
                                                                    </p><br/>
                                                                    <p className="text-center">
                                                                        <button className="btn btn-lg text-white" type="button" style={{background: "#0078C0", borderRadius: "20px", padding: 10}} 
                                                                        onClick = {() => this.openForm(job.Name)}>Postularse</button>
                                                                    </p><br/><br/>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>                                            
                                                </div>
                                            </div>
                                        )
                                    })}
                                    {/* Sección de Formulario */}
                                    <div className="tab-pane fade" id="list-form" role="tabpanel" aria-labelledby="list-form-list">
                                    <h2 className = "text-right mt-md-2 mb-md-2 font-weight-bold" style = {{color:'#AFAFAF'}}>Formulario de oportunidad laboral</h2>
                                        <h5 className = "text-left font-weight-bold mb-md-4" style={{color: "#0078C0"}}>{'< Formulario de oportunidad laboral'}</h5>
                                        <div className="DetallesEstadoDeCuenta">
                                            <div className="card rounded-lg text-center mb-md-4">
                                                <div className="card-body" style = {{backgroundColor: '#efefef'}}>
                                                    <div className="card border-light text-center mb-md-3">
                                                        <div className="card-body bg-white">
                                                        {formStatus === true &&
                                                                <>
                                                                <div className="row mt-md-5 mb-md-5">
                                                                    <div className="col-md-12">
                                                                        <h2 className="text-center font-weight-bold">DATOS PARA OFERTA LABORAL: {jobType.toUpperCase()}</h2>
                                                                    </div>    
                                                                </div>
                                                                <div className="row justify-content-start mb-md-4">
                                                                    <div className="form-group col-md-5">
                                                                        <label className = "text-left">Nombre</label>
                                                                        <input type="text" style = {{borderRadius: 12}} className="form-control form-control-lg" placeholder="Nombre(s)" value = {name || ''} onChange={(event) => {this.onChangeName(event.target.value)}}/>
                                                                    </div>
                                                                    <div className="form-group col-md-6">
                                                                        <label className = "text-left">Apellidos</label>
                                                                        <input type="text" style = {{borderRadius: 12}} className="form-control form-control-lg" placeholder="Apellidos" value = {lastName || ''} onChange={(event) => {this.onChangeLastName(event.target.value)}}/>
                                                                    </div>
                                                                </div> 
                                                                <div className="row justify-content-start mb-md-4">
                                                                    <div className="form-group col-md-5">
                                                                        <label className = "text-left">Correo electrónico</label>
                                                                        <input type="email" style = {{borderRadius: 12}} className="form-control form-control-lg" placeholder="E-mail" value = {mail || ''} onChange={(event) => {this.onChangeMail(event.target.value)}}/>
                                                                    </div>
                                                                    <div className="form-group col-md-3">
                                                                        <label className = "text-left">Número de teléfono</label>
                                                                        <input type="number" style = {{borderRadius: 12}} className="form-control form-control-lg" placeholder="Teléfono" value = {phone || ''} onChange={(event) => {this.onChangePhone(event.target.value)}}/>
                                                                    </div>
                                                                    <div className="form-group col-md-3">
                                                                        <label className = "text-left">Código Postal</label>
                                                                        <input type="text" style = {{borderRadius: 12}} className="form-control form-control-lg" placeholder="Código postal" value = {postalCode || ''} onChange={(event) => {this.onChangePostalCode(event.target.value)}}/>
                                                                    </div>
                                                                </div>
                                                                <div className="row justify-content-start mb-md-4">
                                                                    <div className="form-group col-md-11">
                                                                        <label className = "text-left">Dirección</label>
                                                                        <input type="email" style = {{borderRadius: 12}} className="form-control form-control-lg" placeholder="Dirección" value = {address || ''} onChange={(event) => {this.onChangeAddress(event.target.value)}}/>
                                                                    </div>
                                                                </div>
                                                                <div className="row justify-content-start mb-md-4">
                                                                    <div className="form-group col-md-4">
                                                                        <label className = "text-left">Puesto de interés</label>
                                                                        <select id="jobType" name="jobType" style = {{borderRadius: 12}} 
                                                                                placeholder="Puesto de trabajo" value={jobType} className="form-control form-control-lg text-left"
                                                                                onChange={(event) => this.onChangeJobType(event.target.value)}>
                                                                            {jobTypesInfo && jobTypesInfo.length > 0 && jobTypesInfo.map((job, index) => {
                                                                                return (
                                                                                    <option key={index} value={job.Name}>{job.Name}</option>
                                                                                )
                                                                            })}
                                                                        </select>
                                                                    </div>
                                                                    <div className="form-group col-md-4">
                                                                        <label className = "text-left">Nivel de estudios</label>
                                                                        <select id="schoolType" name="schoolType" style = {{borderRadius: 12}} 
                                                                                placeholder="Nivel de estudios" value={education} className="form-control form-control-lg text-left"
                                                                                onChange={(event) => this.onChangeSchoolType(event.target.value)}>
                                                                            <option selected value='Secundaria'>Secundaria</option>
                                                                            <option value='Bachillerato'>Bachillerato</option>
                                                                            <option value='Preparatoria'>Preparatoria</option>
                                                                            <option value='Técnico'>Técnico</option>
                                                                            <option value='Licenciatura'>Licenciatura</option>
                                                                            <option value='Maestría'>Maestría</option>
                                                                            <option value='Doctorado'>Doctorado</option>
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                                <div className="row justify-content-center mb-md-4">
                                                                    <div className="col-md-7 text-center">
                                                                        <div className="row justify-content-center">
                                                                            <div className="col-md-6 text-center">
                                                                                <label for = "customFile" className = "text-center justify-content-center">Adjuntar currículum vitae 
                                                                                    <img className="img-fluid w-25"
                                                                                        src={require('../../images/diasa/bolsaTrabajo/AgregarImagen.png')}
                                                                                        alt="ImgCV"
                                                                                    />
                                                                                </label>
                                                                                <input type="file" style = {{display: 'none'}} id="customFile" className="form-control form-control-lg" placeholder="CV" onChange={(event) => {this.onChangeCV(event.target.files[0])}}/>
                                                                            </div>
                                                                            <div className="col-md-6 text-center align-middle">
                                                                                {imagePreview !== null && imagePreviewType === 'image' && <img className="img-fluid img-responsive w-50 align-middle" src={imagePreview}/>}
                                                                                {imagePreview !== null && imagePreviewType === 'word' && <i className={config.icons.word + " align-middle"} style={{ color: "#2a5599", paddingRight: 5 }}></i>}
                                                                                {imagePreview !== null && imagePreviewType === 'pdf' && <i className={config.icons.datasheet + " align-middle"} style={{ color: "red", paddingRight: 5 }}></i>}
                                                                                {imagePreview !== null && <label className = "text-center text-success font-weight-bold align-middle">Archivo cargado: "{cv.name}"</label>}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="row justify-content-center mb-md-4">
                                                                    <div className="col-md-5">
                                                                        <button className="btn btn-lg col-md-4 text-white" type="button" style={{background: "#0078C0", borderRadius: "20px", padding: 10}} onClick = {this.sendJobMail}>Enviar</button>
                                                                    </div>
                                                                </div>
                                                                </>
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
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
)(JobView);