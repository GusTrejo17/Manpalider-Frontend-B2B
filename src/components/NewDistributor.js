import React, { Component } from 'react';
import { connect } from "react-redux";
import $ from 'jquery';
import moment from "moment";
import './newDistribuidor.css'
// import { config } from '../libs/utils/Const';
import { ApiClient } from "../libs/apiClient/ApiClient";
import { DISPATCH_ID, SERVICE_RESPONSE, config, ROLES, VIEW_NAME, SERVICE_API } from '../libs/utils/Const';

const apiClient = ApiClient.getInstance();


class NewDistributor extends Component {

    constructor(props) {
        super(props)
        this.state = {
            selected: 1,
            name: '',
            representanteLegal: '',
            phone: '',
            email: '',
            isValidEmail: true,
            // comprobanteDomicilio: null,
            cv: null,
            ine: null,
            fiscalId: null,
            actaConstitutiva: null,
            domicilioFile: null,
            ineFile: null,
            idFiscalFile: null,
            actaConstFile: null

        };
    }



    async submitForm() {
        // console.log('Ricardo 1', this.state.moralForm)
        const { notificationReducer: { showAlert } } = this.props;
        const { moralForm } = this.state;
        moralForm.type = 'Moral';
        let apiResponse = await apiClient.sendDistributorData(moralForm);

        if (apiResponse.status === 1) {
            showAlert(
                {
                    type: 'success',
                    message: apiResponse.message,
                    timeOut: 8000
                }
            );
            // this.clearForm()
            const close = document.getElementById('close-distributor');
            if (close) {
                close.click();
            }
        }
    }

    sendMail = async () => {
        const { enableSpinner, notificationReducer: { showAlert }, sessionReducer } = this.props;
        const { name, representanteLegal, phone, email, cv,domicilioFile,ineFile,idFiscalFile,actaConstFile,selected} = this.state;


        if(representanteLegal === '' || representanteLegal === null){
            return showAlert({ type: 'warning', message: 'Por favor, ingrese un Representante legal', timeOut: 8000 });
        }
        if(phone === '' || phone === null){
            return showAlert({ type: 'warning', message: 'Por favor, ingrese un número de teléfono', timeOut: 8000 });
        }
        if(email === '' || email === null){
            return showAlert({ type: 'warning', message: 'Por favor, ingrese un correo electrónico', timeOut: 8000 });
        }
        if (domicilioFile === null) {
            return showAlert({ type: 'warning', message: 'Por favor, adjunte su comprobante de domicilio', timeOut: 8000 });
        }
        if (ineFile === null) {
            return showAlert({ type: 'warning', message: 'Por favor, adjunte su Identificación oficial', timeOut: 8000 });
        }
        if (idFiscalFile === null) {
            return showAlert({ type: 'warning', message: 'Por favor, adjunte su Identificación Fiscal', timeOut: 8000 });            
        }
        if(selected === 1){
            if (actaConstFile === null) {
                return showAlert({ type: 'warning', message: 'Por favor, adjunte su Identificación Fiscal', timeOut: 8000 });
            }
        }

        let data = {
            representanteLegal,
            phone,
            email,
            domicilioFile: domicilioFile.name,
            idFiscalFile: idFiscalFile.name,
            ineFile: ineFile.name,
            actaConstFile: selected === 1 ? actaConstFile.name : ''
        }

        enableSpinner(true);
        let apiResponse = await apiClient.sendDistributorData(data);
        enableSpinner(false);
        if (apiResponse.status === SERVICE_RESPONSE.SUCCESS) {
            showAlert({ type: 'success', message: apiResponse.message || 'Tus datos se enviaron de forma exitosa. Nos comunicaremos contigo a través del correo ingresado', timeOut: 8000 });
            this.setState({
                name: '',
                representanteLegal: '',
                phone: '',
                email: '',
                // comprobanteDomicilio: null,
                cv: null,
                domicilioFile: null,
                ineFile: null,
                idFiscalFile: null,
                actaConstFile: null
            })
            // this.formComprasFocus.current.click();
            // setTimeout(() => {
            //     this.scrollToBottom();
            // }, 50);
        } else {
            showAlert({ type: 'error', message: apiResponse.message || 'Ocurrió un error al enviar sus datos', timeOut: 8000 });
        }
    }

    async submitForm2() {
        // console.log('Ricardo 2', this.state.fisicaForm)
        const { notificationReducer: { showAlert } } = this.props;
        const { fisicaForm } = this.state;
        fisicaForm.type = 'Fisica';

        // const formData = new FormData();
        // for (const key in fisicaForm) {
        //     formData.append(key, fisicaForm[key]);
        // }
        // formData.append('comprobanteDomicilio', fisicaForm.comprobanteDomicilio);
        // formData.append('ine', fisicaForm.ine);
        // formData.append('fiscalId', fisicaForm.fiscalId);

        let apiResponse = await apiClient.sendDistributorData(fisicaForm);
        if (apiResponse.status === 1) {
            showAlert(
                {
                    type: 'success',
                    message: apiResponse.message,
                    timeOut: 8000
                }
            );
            // this.clearForm()
            const close = document.getElementById('close-distributor');
            if (close) {
                close.click();
            }
        }
    }

    validate() {
        const { notificationReducer: { showAlert } } = this.props
        const { moralForm } = this.state

        const alerts = ['Representante legal', 'Telefono', 'Correo electrónico', 'Comprobante de domicilio', 'Identificación Oficial', 'Cédula de Identificación Fiscal', 'Acta Constitutiva']
        let index = 0
        for (const key in moralForm) {
            if (moralForm[key] === "" || moralForm[key] === null) {
                showAlert({ type: 'warning', message: `El campo ${alerts[index]} está vació, por favor ingrese ${index === 4 || index === 5 || index === 6 ? 'una' : 'un'} ${alerts[index]}`, timeOut: 8000 });
                return false
            }
            index += 1
        }

        if (!(/^([A-Za-z0-9_\-.+])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/).test(moralForm.email)) {
            showAlert({ type: 'warning', message: 'El email no es valido', timeOut: 8000 });
            return false
        }
        return true
    }

    handleFileInputClick() {
        // Lógica que deseas ejecutar cuando se haga clic en el área
        // en blanco del div 'prueba'
    }

    onChangeName = (value) => {
        this.setState({
            name: value,
        })
    }

    onChangeRepresentante = (value) => {
        this.setState({ representanteLegal: value })
    }

    onChangePhone = (value) => {
        this.setState({ phone: value })
    }

    onChangeEmail = (value) => {
        this.setState({ email: value }, () => {
            this.validateEmail();
        });
    }

    validateEmail = () => {
        const { email } = this.state;
        const isValid = /\S+@\S+\.\S+/.test(email);
        this.setState({ isValidEmail: isValid });
    }

    onChangeCV = async (value,type,id) => {
        const { notificationReducer: { showAlert },enableSpinner } = this.props;
        if(!value){
            return
        }

        if (value.size > 3000000) {
            showAlert({ type: 'warning', message: 'El archivo no puede pesar más de 3MB', timeOut: 8000 });
            return;
        }
        

        let ext = value.name.lastIndexOf(".");
        let validateExt = value.name.substring(ext, value.name.length);
        let flagValidationExt = validateExt === ".docx" || validateExt === ".pdf" || validateExt === ".jpg" || validateExt === ".jpeg"
            || validateExt === ".png" || validateExt === ".doc" ? true : false;
        if (flagValidationExt === false) {
            showAlert({ type: 'warning', message: 'El archivo debe estar en formato word, PDF o imagen', timeOut: 8000 });
            document.getElementById(id).value= null
            return;
        }
        
        let fileN = document.getElementById(id)
        let formData = new FormData();     
        formData.append("id", 2);
        formData.append("archivo", fileN.files[0]);
        enableSpinner(true);
        let saveFileResponse = await apiClient.SaveFileOV(formData);
        if(saveFileResponse.status === 0){
            showAlert({ type: 'error', message: saveFileResponse.message });
            document.getElementById(id).value= null
            enableSpinner(false);
            return;
        }else{
            showAlert({ type: 'success', message: 'Archivo adjuntado con éxito', timeOut: 8000 });
            if(type === 'domicilio'){
                this.setState({
                    domicilioFile:value
                })
            }else if(type === 'ine'){
                this.setState({
                    ineFile: value
                })
            }else if(type === 'idFiscal'){
                this.setState({
                    idFiscalFile: value
                })
            }else if(type === 'actaConst'){
                this.setState({
                    actaConstFile: value
                })
            }
        }
        enableSpinner(false);
        
        // this.setState({
        //     cv: value,
        //     imagePreview: URL.createObjectURL(value),
        //     imagePreviewType: validateExt == ".png" || validateExt == ".jpg" || validateExt == ".jpeg" ? "image" : validateExt == ".docx" || validateExt == ".doc" ? "word" : validateExt == ".pdf" ? "pdf" : ""
        // })

    }

    onChangeIne = (value) => {
        const { notificationReducer: { showAlert } } = this.props;

        if (value.size > 3000000) {
            showAlert({ type: 'warning', message: 'El archivo no puede pesar más de 3MB', timeOut: 8000 });
            return;
        }

        let ext = value.name.lastIndexOf(".");
        let validateExt = value.name.substring(ext, value.name.length);
        let flagValidationExt = validateExt == ".docx" || validateExt == ".pdf" || validateExt == ".jpg" || validateExt == ".jpeg"
            || validateExt == ".png" || validateExt == ".doc" ? true : false;
        if (flagValidationExt === false) {
            showAlert({ type: 'warning', message: 'El CV debe estar en formato word, PDF o imagen', timeOut: 8000 });
            return;
        }

        this.setState({
            ine: value,
            // imagePreview: URL.createObjectURL(value),
            // imagePreviewType: validateExt == ".png" || validateExt == ".jpg" || validateExt == ".jpeg" ? "image" : validateExt == ".docx" || validateExt == ".doc" ? "word" : validateExt == ".pdf" ? "pdf" : ""
        })

        showAlert({ type: 'success', message: 'Archivo adjuntado con éxito', timeOut: 8000 });
    }

    onChangeFiscalId = (value) => {
        const { notificationReducer: { showAlert } } = this.props;

        if (value.size > 3000000) {
            showAlert({ type: 'warning', message: 'El archivo no puede pesar más de 3MB', timeOut: 8000 });
            return;
        }

        let ext = value.name.lastIndexOf(".");
        let validateExt = value.name.substring(ext, value.name.length);
        let flagValidationExt = validateExt == ".docx" || validateExt == ".pdf" || validateExt == ".jpg" || validateExt == ".jpeg"
            || validateExt == ".png" || validateExt == ".doc" ? true : false;
        if (flagValidationExt === false) {
            showAlert({ type: 'warning', message: 'El CV debe estar en formato word, PDF o imagen', timeOut: 8000 });
            return;
        }

        this.setState({
            fiscalId: value,
            // imagePreview: URL.createObjectURL(value),
            // imagePreviewType: validateExt == ".png" || validateExt == ".jpg" || validateExt == ".jpeg" ? "image" : validateExt == ".docx" || validateExt == ".doc" ? "word" : validateExt == ".pdf" ? "pdf" : ""
        })

        showAlert({ type: 'success', message: 'Archivo adjuntado con éxito', timeOut: 8000 });
    }
    
    onChangeActaConstitutiva = (value) => {
        const { notificationReducer: { showAlert } } = this.props;

        if (value.size > 3000000) {
            showAlert({ type: 'warning', message: 'El archivo no puede pesar más de 3MB', timeOut: 8000 });
            return;
        }

        let ext = value.name.lastIndexOf(".");
        let validateExt = value.name.substring(ext, value.name.length);
        let flagValidationExt = validateExt == ".docx" || validateExt == ".pdf" || validateExt == ".jpg" || validateExt == ".jpeg"
            || validateExt == ".png" || validateExt == ".doc" ? true : false;
        if (flagValidationExt === false) {
            showAlert({ type: 'warning', message: 'El CV debe estar en formato word, PDF o imagen', timeOut: 8000 });
            return;
        }

        this.setState({
            actaConstitutiva: value,
            // imagePreview: URL.createObjectURL(value),
            // imagePreviewType: validateExt == ".png" || validateExt == ".jpg" || validateExt == ".jpeg" ? "image" : validateExt == ".docx" || validateExt == ".doc" ? "word" : validateExt == ".pdf" ? "pdf" : ""
        })

        showAlert({ type: 'success', message: 'Archivo adjuntado con éxito', timeOut: 8000 });
    }

    renderForm() {
        const { representanteLegal, phone, email, isValidEmail, cv,selected,domicilioFile,ineFile,idFiscalFile,actaConstFile } = this.state
        return (
            <div className="distribuidor-form">
                <div className='form moral'>
                    <div className='form-group'>
                        <label>Representante legal</label>
                        <input
                            type="text"
                            className="bd-s-g"
                            placeholder=""
                            aria-label="representanteLegal"
                            aria-describedby="basic-addon1"
                            value={representanteLegal}
                            onChange={(event) => {
                                if ((/^[A-Za-z ]+$/).test(event.target.value) || event.target.value === '') {
                                    this.onChangeRepresentante(event.target.value);
                                }
                            }}
                        />
                    </div>
                    <div className='form-group'>
                        <label>Télefono / Celular</label>
                        <input
                            type='text'
                            className="bd-s-g"
                            placeholder=""
                            aria-label="phone"
                            aria-describedby="basic-addon1"
                            value={phone}
                            onChange={(event) => {
                                const phoneNumber = event.target.value.replace(/\D/g, ''); // Elimina caracteres no numéricos
                                if (phoneNumber.length <= 10) {
                                    this.onChangePhone(phoneNumber);
                                }
                            }}
                        />
                    </div>
                    <div className='form-group'>
                        <label>Correo electrónico</label>
                        <input
                            type='text'
                            className={`bd-s-g ${isValidEmail ? '' : 'invalid'}`}
                            placeholder=""
                            aria-label="email"
                            aria-describedby="basic-addon1"
                            value={email}
                            onChange={(event) => this.onChangeEmail(event.target.value)}
                        />
                        {!isValidEmail && <p className="error-text">Por favor, introduce un correo electrónico válido.</p>}
                    </div>
                    <div className="form-group">
                        <label>Comprobante de domicilio</label>
                        <div className="prueba">
                            {/* Display the selected file name here */}
                            <span className="file-name">{domicilioFile ? domicilioFile.name : ''}</span>
                            <input
                                type="file"
                                id='domicilioFile'
                                enctype="multipart/form-data"
                                placeholder="Comprobante de Domicilio "
                                className="bd-ds-g form-control-file"
                                // accept=".pdf"
                                onChange={(event) => { this.onChangeCV(event.target.files[0], 'domicilio', 'domicilioFile') }}
                            />
                        </div>
                        <span>*Hasta 3 meses de antigüedad</span>
                    </div>

                    <div className='form-group'>
                        <label>Identificación Oficial (INE)</label>
                        <div className='prueba'>
                            {/* Display the selected file name here */}
                            <span className="file-name">{ineFile ? ineFile.name : ''}</span>
                            <input
                                type="file"
                                id='ineFile'
                                enctype="multipart/form-data"
                                placeholder="Comprobante de Domicilio "
                                className="bd-ds-g form-control-file"
                                // accept=".pdf"
                                onChange={(event) => { this.onChangeCV(event.target.files[0], 'ine', 'ineFile') }}
                            />
                        </div>
                        <span>*Por ambos lados</span>
                    </div>

                    <div className='form-group'>
                        <label>Cédula de Identificación Fiscal</label>
                        <div className='prueba'>
                            {/* Display the selected file name here */}
                            <span className="file-name">{idFiscalFile ? idFiscalFile.name : ''}</span>
                            <input
                                type="file"
                                id='idFiscalFile'
                                enctype="multipart/form-data"
                                placeholder="Comprobante de Domicilio "
                                className="bd-ds-g form-control-file"
                                onChange={(event) => { this.onChangeCV(event.target.files[0], 'idFiscal', 'idFiscalFile') }}
                            />
                        </div>
                        {/* Include additional information here */}
                        <span>*Actualizada</span>
                    </div>
                    {selected === 1 ? (
                        <div className='form-group'>
                            <label>Acta Constitutiva</label>
                            <div className='prueba'>
                                {/* Use a label element and htmlFor to associate it with the file input */}
                                <span className="file-name">{actaConstFile ? actaConstFile.name : ''} </span>
                                <input
                                    type="file"
                                    id='actaConst'
                                    enctype="multipart/form-data"
                                    placeholder="Comprobante de Domicilio "
                                    className="bd-ds-g form-control-file"
                                    // accept=".pdf"
                                    onChange={(event) => { this.onChangeCV(event.target.files[0], 'actaConst', 'actaConst') }}
                                />
                            </div>
                            <span>*Hasta 3 meses de antigüedad</span>
                        </div>
                    ) : null}

                </div>
                <span>Tu acceso llegará por correo electrónico dentro de las siguientes 48 horas.</span>
                <div className="form-buttons" style={{marginLeft:'50px'}}>
                    <button type="button" onClick={() => this.sendMail()}>Enviar información</button>
                </div>
            </div>
        )
    }

    // fisicaForm() {
    //     const { name, phone, email, cv } = this.state
    //     return (
    //         <div className="distribuidor-form">
    //             <div className='form moral'>
    //                 <div className='form-group'>
    //                     <label>Representante legal</label>
    //                     <input
    //                         type="text"
    //                         className="bd-s-g"
    //                         placeholder=""
    //                         aria-label="representanteLegal"
    //                         aria-describedby="basic-addon1"
    //                         value={name}
    //                         onChange={(event) => ((/^[A-Z a-z ]+$/).test(event.target.value) || event.target.value == '') && this.onChangeName(event.target.value)}
    //                     />
    //                 </div>
    //                 <div className='form-group'>
    //                     <label>Télefono / Celular</label>
    //                     <input
    //                         type='text'
    //                         className="bd-s-g"
    //                         placeholder=""
    //                         aria-label="phone"
    //                         aria-describedby="basic-addon1"
    //                         value={phone}
    //                         onChange={(event) => ((/^[0-9]+$/).test(event.target.value) || event.target.value == '') && this.onChangePhone(event.target.value)}
    //                     />
    //                 </div>
    //                 <div className='form-group'>
    //                     <label>Correo electrónico</label>
    //                     <input
    //                         type='text'
    //                         className="bd-s-g"
    //                         placeholder=""
    //                         aria-label="email"
    //                         aria-describedby="basic-addon1"
    //                         value={email}
    //                         onChange={(event) => this.onChangeEmail(event.target.value)}
    //                     />
    //                 </div>
    //                 <div className="form-group">
    //                     <label>Comprobante de domicilio</label>
    //                     <div className="prueba">
    //                         <input
    //                             type="file"
    //                             className="bd-ds-g"
    //                             placeholder=""
    //                             aria-label="comprobanteDomicilio"
    //                             aria-describedby="basic-addon1"
    //                             // accept=".pdf"
    //                         />
    //                         <span onChange={(event) => { this.onChangeCV(event.target.files[0]) }}>{cv?.name}</span>
    //                     </div>
    //                     <span>*Hasta 3 meses de antigüedad</span>
    //                 </div>
    //                 <div className='form-group'>
    //                     <label>Identificación Oficial (INE)</label>
    //                     <div className='prueba'>
    //                         <input
    //                             type='file'
    //                             className="bd-ds-g"
    //                             placeholder=""
    //                             aria-label="ine"
    //                             aria-describedby="basic-addon1"
    //                             // accept=".pdf"
    //                         />
    //                         <span onClick={(event) => { this.onChangeIne(event.target.files[0]) }}> </span>
    //                     </div>
    //                     <span>*Por ambos lados</span>
    //                 </div>
    //                 <div className='form-group'>
    //                     <label>Cédula de Identificación Fiscal</label>
    //                     <div className='prueba'>
    //                      {/* Use a label element and htmlFor to associate it with the file input */}
    //                     <span className="file-name">Archivo seleccionado: </span>
    //                         <input
    //                             type='file'
    //                             className="bd-ds-g"
    //                             placeholder=""
    //                             aria-label="fiscalId"
    //                             aria-describedby="basic-addon1"
    //                             onChange={(event) => { this.onChangeFiscalId(event.target.files[0]) }}
    //                         />
    //                     </div>
    //                     <span>*Actualizada</span>
    //                 </div>
    //             </div>
    //             <span>Tu acceso llegará por correo electrónico dentro de las siguientes 48 horas.</span>
    //             <div className="form-buttons">
    //                 <button type="button" data-dismiss="modal" onClick={() => this.submitForm2()}>Enviar información</button>
    //             </div>
    //         </div>
    //     )
    // }

    render() {
        const { requestQuotation, onChangeRequestQuotation } = this.props
        const { selected } = this.state
        return (
            <div className="modal fade p-4 overflow-auto" id="newDistributorModal" role="dialog" aria-labelledby="quotationModalLabel" aria-hidden="true" tabindex="-1">
                <div className="modal-dialog modal-lg " role="document" style={{ borderRadius: '2rem' }}>
                        <div className='modal-content modal-container'>
                        <button type="button" className="close-button" data-dismiss="modal" aria-label="Close" id='close-distributor'>
                            <span aria-hidden="true">&times;</span>
                        </button>
                        <h2>¿Quieres ser distribuidor?</h2>
                        <br></br>
                        <span>Para crear tu cuenta te pediremos algunos datos.</span>
                        <br></br>
                        <span>Solo te tomará unos minutos</span>
                        <br></br>
                        <div className='image-selector'>
                            <img src={config.Avatar.moral} className={selected === 1 && 'selected'} onClick={() => this.setState({ selected: 1 })} />
                            <img src={config.Avatar.fisca} className={selected === 2 && 'selected'} onClick={() => this.setState({ selected: 2 })} />
                        </div>
                        <div className="modal-body ml-auto mr-auto ">
                            <div className={'form-main modal-scroll' }>
                                {this.renderForm()}
                            </div>
                            {/* <div className={selected === 1 ? 'hide' : 'form-main modal-scroll'}>
                                {this.fisicaForm()}
                            </div> */}
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
)(NewDistributor);
