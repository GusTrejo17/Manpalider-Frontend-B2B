import React, { Component } from 'react';
import { Footer, NavBar, Session, TopNavBar } from "../../components";
import { DISPATCH_ID, SERVICE_RESPONSE, config, ROLES, VIEW_NAME, SERVICE_API } from '../../libs/utils/Const';
import { ApiClient } from "../../libs/apiClient/ApiClient";
import { connect } from "react-redux";
import $ from 'jquery';
import moment from "moment";
import { Redirect } from 'react-router';
import { animateScroll as scroll, scroller } from 'react-scroll'
import '../dashboard/Categories.css';
import './ProfileView.css';
import axios from 'axios';
import Swal from 'sweetalert2';

let apiClient = ApiClient.getInstance();

class ProfileView extends Component {
    constructor(props) {
        super(props);
        const assets = config.ASSETS;
        const api = config.BASE_URL;
        this.state = {
            editModePersonalInfoZone: false,
            editModeAccountInfoZone: false,
            typeVisibility: true,
            typeVisibilitynew: true,
            typeVisibilityrepeat: true,
            typeVisibilityCard: true,
            name: '',
            email: '',
            RFC: '',
            phone1: '',
            phone2: '',
            user: '',
            oldPass: '',
            newPass1: '',
            newPass2: '',
            card: '',
            cardStatus: '',
            password: '',
            profileImage: '',
            arrayImages: '',
            update: 'not',
            showForm: false,
            assets: assets,
            title: '',
            file: null,
            old_image: '',
            urlapi: api,
            active: 'on',
            errors: {
                title: '',
                file: '',
            },
            imageName: '',
            imageProfileFile: null
        };

        this.scrollToBottom = this.scrollToBottom.bind(this);
    };

    //IMAGE LOGIC

    // function for catch file content.
    fileSelectedHandler = event => {
        const { notificationReducer: { showAlert } } = this.props;
        let value = event.target.files[0];
        let fileName = value.name;
        this.setState({ title: fileName });
        let ext = value.name.lastIndexOf(".");
        let validateExt = value.name.substring(ext, value.name.length);
        let flagValidationExt = validateExt == ".jpg" || validateExt == ".jpeg" || validateExt == ".png" ? true : false;
        if (flagValidationExt === false) {
            showAlert({ type: 'warning', message: 'El archivo debe estar en un formato valido. Ejemplo: .jpg, jpeg o .png ', timeOut: 8000 });
            document.getElementById("imageProfileFile").value = null
            this.setState({
                file: null,
                newFileName: null,
                title: ''
            });
            return;
        }
        this.setState({
            file: event.target.files[0],
            image: URL.createObjectURL(event.target.files[0])
        });
    }


    renderImage() {
        const { file, image, update, assets } = this.state;
        let urlImge = "";
        if (update === 'not') {
            urlImge = image;
        } else {
            if (image !== null) urlImge = assets + 'imageprofile/' + image;
        }
        if (file !== null) {
            return (
                <div className='text-center py-4'>
                    <span>Previsualización de la nueva imagen de perfil</span><br></br>
                    <img src={image} className="img-fluid my-3" alt={image} style={{ objectFit: 'cover', maxWidth: '150px', maxHeight: '150px', height: '100%', width: '100%', borderRadius: "10px" }} />
                </div>
            );
        } else {
            return (
                <div className='text-center py-4'>
                    <span>Por favor ingresa una imagen de perfil</span>
                </div>
            );
        }
    }

    string_to_slug(str) {
        str = str.replace(/^\s+|\s+$/g, ''); // trim
        str = str.toLowerCase();
        // remove accents, swap ñ for n, etc
        var from = "àáãäâèéëêìíïîòóöôùúüûñç·/_,:;";
        var to = "aaaaaeeeeiiiioooouuuunc------";
        for (var i = 0, l = from.length; i < l; i++) {
            str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
        }
        str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
            .replace(/\s+/g, '_') // collapse whitespace and replace by -
            .replace(/-+/g, '_'); // collapse dashes
        return str;
    }

    tooglediv = () => {
        document.getElementById("imageProfileFile").value = null
        window.scrollTo(0, 0);
        $('.hides').toggle('normal'); //slow, normal or fast animation
        this.setState({
            title: '',
            slug: '',
            url: '',
            file: null,
            image: null,
            content: '',
            items: '',
            active: 'on',
            old_image: '',
            is_date: 'off',
            order_item: '0',
            update: 'not',
            valid_from: moment().format('YYYY-MM-DD'),
            valid_to: moment().format('YYYY-MM-DD'),
            errors: {
                title: '',
                file: '',
            },
            isLoaded: false,
            sectionBanner: 'Terciaria',
            showForm: !this.state.showForm,
        });
    }

    saveDataHandler = (event) => {
        window.scrollTo(0, 0);
        event.preventDefault();
        let file = this.state.file;
        let fileSplit = '';
        let newFileName = '';
        let slug = this.string_to_slug(this.state.title);
        let updateImage = false;
        let method = 'POST';
        let idBanner = 0;
        if (file !== null) {
            fileSplit = file.name.split('.');
            newFileName = slug + '.' + fileSplit[1];
            updateImage = true;
        }
        if (this.state.update === 'yes') { 
            if (!updateImage) {
                newFileName = this.state.old_image;
            }
            method = 'PUT';
            idBanner = this.state.id;
        }
        let send = true;
        let errors = this.state.errors;
        if (this.state.title.length <= 0) {
            errors.title = 'El nombre del archivo no puede ir vacio!';
            send = false;
            this.setState({ errors, title: 'El nombre del archivo no puede ir vacio!' });
            this.setState({ title: '' });
        }
        if (!send) {
            Swal.fire(
                'Alerta Error',
                'Se necesita seleccionar un archivo de imagen de perfil!',
                'error'
            );
            document.getElementById("imageProfileFile").value = null
            this.setState({
                file: null
            });
            return;
        } else {

            if (this.state.file !== null) {
                const dataForm = new FormData();
                dataForm.append('file', this.state.file);
                let oldFileName = this.state.old_image;
                // update file
                this.addFile(newFileName, dataForm);
                document.getElementById("imageProfileFile").value = null
                // delete file
                if (oldFileName.length >= 43) this.deleteFile(oldFileName);
            }
            this.tooglediv();
        }
    }

    //Agregar imagen a la carpeta de diasa
    addFile = (newFileName, dataForm) => {
        //Agregar imagen a la carpeta
        axios.post(`${this.state.urlapi}/uploadfile/imageprofile/${newFileName}`, dataForm)
            .then((response) => {
                this.setState({
                    isLoaded: true,
                });

                //Actualizar el campo de sap de foto de perfil por la imagen agregada
                this.setState({
                    imageProfileFile: newFileName
                })
                this.sendImageProfile();

            })
            .catch((error) => {
                //console.log(error);
                Swal.fire(
                    'Alerta Error',
                    'Error: ' + error,
                    'error'
                );
            });

    }
    deleteFile = (imageName) => {
        window.scrollTo(0, 0);
        Swal.fire({
            title: 'Eliminar',
            text: "¿Está seguro de eliminar la imagen de perfil?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminalo',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.value) {
                //Borrar imagen de la carpeta
                axios.post(`${this.state.urlapi}/deletefile/imageprofile/${imageName}`)
                    .then((response) => {

                        //Actualizar el campo de sap de foto de perfil a vacio 
                        this.setState({
                            imageProfileFile: ''
                        })
                        this.sendImageProfile();

                        document.getElementById("imageProfileFile").value = null
                        this.setState({
                            file: null
                        });
                        this.tooglediv();
                    })
                    .catch((error) => {

                    });
            }
        });
    }

    sectionBan = event => {
        this.setState({
            sectionBanner: "Terciaria"
        })
    }

    //Actualizar o eliminar valor en sap para la imagen del perfil
    sendImageProfile = async () => {
        const { enableSpinner, notificationReducer: { showAlert }, configReducer } = this.props;
        const { imageProfileFile } = this.state;
        //const formData = new FormData();
        //formData.append("imageProfileFile", imageProfileFile.name);
        const data = {imageProfileFile: imageProfileFile}
        enableSpinner(true);
        let apiResponse = await apiClient.sendImageProfile(data);
        enableSpinner(false);
        if (apiResponse.status === SERVICE_RESPONSE.SUCCESS) {
            configReducer.history.goProfile();
            window.location.reload(true);
            showAlert({ type: 'success', message: apiResponse.message || 'Tu petición se realizó de manera exitosa', timeOut: 8000 });
            this.setState({
                imageProfileFile: null,
                file: null
            })
        } else {
            showAlert({ type: 'error', message: apiResponse.message || 'Ocurrió un error con su petición, vuelva a intentar', timeOut: 8000 });
        }
    }
    //END IMAGE LOGIC

    saveImages = () => {
        // Logic to
    }

    scrollToBottom() {
        scroll.scrollToTop({
            duration: 1500,
            delay: 100,
            smooth: 'easeOutQuart',
            isDynamic: true
        })
    }

    toggleEditMode = () => {
        this.setState(prevState => ({
            editModeAccountInfoZone: !prevState.editModeAccountInfoZone
        }));
    }

    handleDelete = () => {
        // Lógica para eliminar la información...
    };

    handleImageSelection = (event) => {
        const selectedImages = event.target.files;
        this.setState({ selectedImages });
    };


    async componentDidMount() {
        await this.accountBusinessPartnerInfo();
        this.scrollToBottom();
    };

    accountBusinessPartnerInfo = async () => {
        const { sessionReducer, enableSpinner, notificationReducer: { showAlert } } = this.props;

        if (sessionReducer.user.CardCode) {
            let cardCode = sessionReducer.user.CardCode;
            enableSpinner(true);
            let response = await apiClient.getBusinessPartnerInfo(cardCode);
            enableSpinner(false);
            this.setState({
                user: response.data.resultData.U_FMB_Handel_Email,
                password: response.data.resultData.U_FMB_Handel_Pass,
                name: response.data.resultData.CardName,
                email: response.data.resultData.U_FMB_Handel_Email,
                RFC: response.data.resultData.LicTradNum,
                phone1: response.data.resultData.Phone1,
                phone2: response.data.resultData.Phone2,
                cardStatus: response.data.resultData.U_FMB_Handel_CardAct,
                card: response.data.resultData.U_FMB_Handel_RedCard,
                oldPass: response.data.resultData.U_FMB_Handel_Pass,
                newPass1: '',
                newPass2: '',
                editModePersonalInfoZone: false,
                editModeAccountInfoZone: false,
                imageName: response.data.resultData.U_FMB_Image_Profile
            });
        }
    }

    handleImageUpload = (event) => {
        const file = event.target.files[0]; // Obtener el archivo subido
        const reader = new FileReader();
        reader.onload = (e) => {
            this.setState({
                profileImage: e.target.result, // Almacenar la imagen como base64 en el estado
            });
        };
        reader.readAsDataURL(file); // Leer el archivo como base64
    };

    // deleteIamge(imageIndex) {
    //     const { arrayImages } = this.state;
    //     arrayImages.splice(imageIndex, 1);
    //     this.setState({
    //         arrayImages
    //     });
    // }



    updatePartnerInfo = async response => {
        const { enableSpinner, notificationReducer: { showAlert }, sessionReducer } = this.props;
        const { oldPass, newPass1, newPass2, name, email, RFC, phone1, phone2, user, editModePersonalInfoZone, editModeAccountInfoZone } = this.state;

        if (editModePersonalInfoZone === true) {
            if (name == '' || email == '' || RFC == '' || phone1 == '') {
                showAlert({ type: 'warning', message: 'Por favor, rellene todos los datos de la sección "Datos personales"', timeOut: 8000 });
                return;
            }
            if (RFC.length < 12 || RFC.length > 14) {
                showAlert({ type: 'warning', message: 'El RFC debe contener 12/13 caracteres ', timeOut: 8000 });
                return;
            }
        } else {
            // if(oldPass == ''){
            //     showAlert({ type: 'warning', message: 'Por favor, escriba su contraseña actual', timeOut: 2500 });
            //     return;
            // }
            if (newPass1 == '') {
                showAlert({ type: 'warning', message: 'Por favor, escriba su nueva contraseña', timeOut: 8000 });
                return;
            }
            if (newPass2 == '') {
                showAlert({ type: 'warning', message: 'Por favor, confirme su nueva contraseña', timeOut: 8000 });
                return;
            }
            if (newPass1 != newPass2) {
                showAlert({ type: 'warning', message: 'La contraseña y su confirmación no coinciden', timeOut: 8000 });
                return;
            }
        }

        let data = {
            name: name,
            email: email,
            RFC: RFC,
            phone1: phone1,
            phone2: phone2,
            user: sessionReducer.user.CardCode,
            oldPass: oldPass,
            newPass1: newPass1,
        }

        enableSpinner(true);
        let apiResponse = await apiClient.updatePartner(data);
        enableSpinner(false);

        if (apiResponse.status === SERVICE_RESPONSE.SUCCESS) {
            showAlert({ type: 'success', message: 'Tus datos se actualizaron de forma exitosa', timeOut: 8000 });
            await this.accountBusinessPartnerInfo();
            this.scrollToBottom();
        } else {
            showAlert({ type: 'error', message: apiResponse.message || 'Ocurrió un error al actualizar sus datos', timeOut: 8000 });
        }
    }

    eyeVisibility = (type) => {
        const { typeVisibility, typeVisibilitynew, typeVisibilityrepeat, typeVisibilityCard } = this.state;
        switch (type) {
            case 'typeVisibility':
                this.setState({
                    typeVisibility: !typeVisibility
                })
                break;
            case 'typeVisibilitynew':
                this.setState({
                    typeVisibilitynew: !typeVisibilitynew
                })
                break;
            case 'typeVisibilityrepeat':
                this.setState({
                    typeVisibilityrepeat: !typeVisibilityrepeat
                })
                break;
            case 'typeVisibilityCard':
                this.setState({
                    typeVisibilityCard: !typeVisibilityCard
                })
                break;
            default:
                break;
        }
    }


    onChangeZone = async (value) => {
        if (value === 'editModePersonalInfoZone') {
            await this.accountBusinessPartnerInfo();
            this.setState({
                editModePersonalInfoZone: true,
                editModeAccountInfoZone: false,
            })
        } else {
            await this.accountBusinessPartnerInfo();
            this.setState({
                editModePersonalInfoZone: false,
                editModeAccountInfoZone: true,
            })
        }
    }

    onCancelZone = async () => {
        await this.accountBusinessPartnerInfo();
        this.setState({
            editModePersonalInfoZone: false,
            editModeAccountInfoZone: false,
        })
    }

    onChangeName = (value) => {
        this.setState({
            name: value
        })
    }

    onChangeEMail = (value) => {
        this.setState({
            email: value
        })
    }

    onChangeRFC = (value) => {
        this.setState({
            RFC: value
        })
    }

    onChangePhone1 = (value) => {
        this.setState({
            phone1: value
        })
    }

    onChangePhone2 = (value) => {
        this.setState({
            phone2: value
        })
    }

    onChangeUser = (value) => {
        this.setState({
            user: value
        })
    }

    onChangeOldPass = (value) => {
        this.setState({
            oldPass: value
        })
    }

    onChangeNewPass1 = (value) => {
        this.setState({
            newPass1: value
        })
    }

    onChangeNewPass2 = (value) => {
        this.setState({
            newPass2: value
        })
    }

    onChangeCard = (value) => {
        this.setState({
            card: value
        })
    }

    iconUser = (priceList) => {
        let result = '';
        switch (priceList) {
            case 4:
                result = config.Avatar.bronze2;
                break;
            case 5:
                result = config.Avatar.silver2;
                break;
            case 6:
                result = config.Avatar.gold2;
                break;
            case 7:
                result = config.Avatar.platinum2;
                break;
            case 9:
                result = config.Avatar.diamond2;
                break;
            case 13:
                result = config.Avatar.mercado2;
                break;
            default:
                result = config.Avatar.red2;
                break;
        }
        return result
    }

    render() {
        const { configReducer: { history }, sessionReducer } = this.props;
        const { typeVisibility, typeVisibilitynew, typeVisibilityrepeat, typeVisibilityCard, name, email, RFC, phone1, phone2, user,
            oldPass, newPass1, newPass2, card, editModePersonalInfoZone, editModeAccountInfoZone, password, profileImage, imageName, imageProfileFile, update, showForm, assets } = this.state;
        
        //Obtener la imagen de perfil
        const urlImge = imageName ? assets + 'imageprofile/' + imageName : require('../../images/noImage.png');
        if (!sessionReducer || !history) {
            return <Redirect to="/" />;
        } else {
            return (
                <div className="content-fluid none-scroll">
                    {/* <Session history={history} view={VIEW_NAME.PROFILE_VIEW}/> */}
                    <NavBar />
                    <div className="margenSuperiorViewProfile">
                        <TopNavBar />
                    </div>
                    <div className='row mt-5 pt-5 mt-sm-5 pt-sm-5 mt-md-3 pt-md-3 mt-lg-2 pt-lg-2 mt-xl- pt-xl-0 justify-content-center'>
                        <img src={urlImge} class="card-img-top" alt={imageName} style={{ background: "white", maxWidth: "150px", maxHeight: "150px", width: "100%", height: "100%", borderRadius: "10px",marginTop:'6rem' }} />
                    </div>

                    <h1 className="text-center mt-2">MIS DATOS</h1>
                    <div className="row mb-md-3 mt-md-3 justify-content-center">
                        <div className="col-md-8">
                            {/* Mostrar la imagen de perfil cargada */}
                                    {/* {profileImage && (
                                        <img
                                            src={profileImage}
                                            alt="Perfil"
                                            style={{ maxWidth: '180px', maxHeight: '180px' }}
                                        />
                                    )} */}
                                    {/* {this.state.editModeAccountInfoZone && (
                                        <div className='row col-12 photos' style={{ alignItems: 'center' }}>
                                            <p className='col-10' style={{ fontSize: 15 }}>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    style={{ marginTop: '20px' }}
                                                    onChange={this.handleImageUpload}
                                                />
                                            </p>
                                        </div>
                                    )} */}

                                    {/* <button
                                        onClick={this.toggleEditMode}
                                        className="btn btn-lg mt-md-2"
                                        style={{
                                            backgroundColor: '#0060EA',
                                            color: 'white',
                                            borderRadius: '10px',
                                            padding: '7px',
                                        }}
                                    >
                                        {this.state.editModeAccountInfoZone === false ? 'Editar' : 'Guardar'}
                                    </button> */}
                                {/*BOTONTES QUE YA ESTABAN ANTES DE LO NUEVO*/}
                                {/*<div className='row pt-3'>
                                                {this.state.editModeAccountInfoZone === true && (
                                                    <button

                                                        onClick={this.handleDelete}
                                                        className="btn btn-lg mt-md-2 ml-5"
                                                        style={{
                                                            backgroundColor: '#0060EA',
                                                            color: 'white',
                                                            borderRadius: '10px',
                                                            padding: '8px',
                                                        }}
                                                    >
                                                        Eliminar
                                                    </button>
                                                )}
                                            </div>*/}
                                {/*FIN DE BOTONTES QUE YA ESTABAN ANTES DE LO NUEVO*/}
                            <button className="btn btn-outline-secondary" onClick={this.tooglediv}>
                                {showForm ? "- Cancelar" : "+ Editar imagen de perfil"}
                            </button>
                        </div>
                    </div>
                    <div className={`hides ${showForm ? "" : "hides"}`}>
                        <div className="justify-content-center">
                            <div className="row mb-md-3 mt-md-3 justify-content-center">
                                <div className="col-md-8 pt-4">
                                    <fieldset>
                                        <b>Imagen de perfil</b>
                                        {/* <input className="form-control" name="file" type="file" id="imageProfileFile" onChange={event => { this.fileSelectedHandler(event); this.onChangeImgProfile(event.target.files[0], 'imageProfile', 'imageProfileFile'); }}/> */}
                                        <input className="form-control" name="file" type="file" id="imageProfileFile" onChange={this.fileSelectedHandler} />
                                        {this.renderImage()}
                                        <div className='text-center'>
                                            <fieldset>
                                                <label className="control-label"> </label>
                                                <button style={{ borderRadius: 10, background: "#0060EA" }} className="btn btn-primary text-white" onClick={(this.saveDataHandler)} >Guardar</button>
                                                <button className="btn btn-danger ml-5" style={{ borderRadius: 10 }} onClick={() => this.deleteFile(this.state.imageName ? this.state.imageName : '')} >Eliminar</button>
                                            </fieldset>
                                        </div>
                                    </fieldset>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row mb-md-3 mt-md-3 justify-content-center">
                        <div className="col-md-8">
                            <div className="row justify-content-start">
                                <div className="col-md-4">
                                    <h3 className="font-weight-bold">Datos Personales</h3>

                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row justify-content-center">
                        <div className="col-md-8">
                            <div className="borderRadius">
                                <div className="card">
                                    <ul className="list-group list-group-flush">
                                        <li className="liTransition bg-white  list-group-item" >
                                            <label htmlFor="name" className="form__labelProfile font-weight-bold description">Nombre de usuario</label>
                                            <input
                                                type="text"
                                                className="form-control form-control-lg profileForm form__inputProfile description"
                                                data-placement="right"
                                                title="Nombre de usuario"
                                                name="name"
                                                placeholder="Nombre de usuario"
                                                autoComplete={'name'}
                                                value={name || ''}
                                                id="name"
                                                disabled={editModePersonalInfoZone === false ? true : false}
                                                onChange={(event) => this.onChangeName(event.target.value)}
                                            />
                                            {/* <label htmlFor="name" className="form__labelProfile">Nombre de usuario</label>   */}
                                        </li>
                                        {/* <li className="liTransition bg-white list-group-item" style={{maxHeight: "70px"}}>
                                            <input
                                                type="text"
                                                className="form-control form-control-lg profileForm form__inputProfile"
                                                name="email"
                                                placeholder="E-mail"
                                                autoComplete={'e-mail'}
                                                value={email || ''}
                                                id="email"
                                                onChange={(event) => this.onChangeEMail(event.target.value)}
                                            />
                                        </li> */}
                                        <li className="liTransition bg-white list-group-item">
                                            <label htmlFor="rfc" className="form__labelProfile font-weight-bold description">RFC</label>
                                            <input
                                                type="text"
                                                className="form-control form-control-lg profileForm form__inputProfile description"
                                                name="RFC"
                                                placeholder="RFC"
                                                autoComplete={'RFC'}
                                                value={RFC || ''}
                                                id="RFC"
                                                disabled={editModePersonalInfoZone === false ? true : false}
                                                onChange={(event) => this.onChangeRFC(event.target.value)}
                                            />
                                            {/* <label htmlFor="rfc" className="form__labelProfile">RFC</label> */}
                                        </li>
                                        <li className="liTransition bg-white list-group-item">
                                            <label htmlFor="phone1" className="form__labelProfile font-weight-bold description">Teléfono</label>
                                            <input
                                                type="text"
                                                className="form-control form-control-lg profileForm form__inputProfile description"
                                                name="phone1"
                                                placeholder="Teléfono"
                                                autoComplete={'phone1'}
                                                value={phone1 || ''}
                                                id="phone1"
                                                disabled={editModePersonalInfoZone === false ? true : false}
                                                onChange={(event) => this.onChangePhone1(event.target.value)}
                                            />
                                            {/* <label htmlFor="phone1" className="form__labelProfile font-weight-bold">Teléfono</label> */}
                                        </li>
                                        <li className="liTransition bg-white list-group-item">
                                            <label htmlFor="phone2" className="form__labelProfile font-weight-bold description">Teléfono alternativo</label>
                                            <input
                                                type="text"
                                                className="form-control form-control-lg profileForm form__inputProfile description"
                                                name="phone2"
                                                placeholder="Teléfono alternativo"
                                                autoComplete={'phone2'}
                                                value={phone2 || ''}
                                                id="phone1"
                                                disabled={editModePersonalInfoZone === false ? true : false}
                                                onChange={(event) => this.onChangePhone2(event.target.value)}
                                            />
                                            {/* <label htmlFor="phone2" className="form__labelProfile font-weight-bold">Teléfono alternativo</label> */}
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row justify-content-center">
                        <div className="col-md-8">
                            <div className="row justify-content-end">
                                <div className="col-md-2 text-right">
                                    <button
                                        onClick={editModePersonalInfoZone === false ? () => this.onChangeZone('editModePersonalInfoZone') : this.updatePartnerInfo}
                                        className="btn btn-primary btn-lg mt-2 mb-2 btnProfile" style={{backgroundColor:'rgb(0, 96, 234)', borderColor:'rgb(0, 96, 234)'}}>
                                        {editModePersonalInfoZone === false ? 'Editar' : 'Actualizar'}
                                    </button>
                                </div>
                                {editModePersonalInfoZone === true && 
                                    <div className="col-md-2 text-right">
                                        <button
                                            onClick={this.onCancelZone}
                                            className="btn  btn-lg mt-md-2 btnProfile"
                                            style={{backgroundColor:'rgb(0, 96, 234)', borderColor:'rgb(0, 96, 234)', color:'white'}}>
                                            Cancelar
                                        </button>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="row mb-md-3 mt-md-3 justify-content-center">
                        <div className="col-md-8">
                            <div className="row justify-content-start">
                                <div className="col-md-4">
                                    <h3 className="font-weight-bold description">Datos de cuenta</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row justify-content-center">
                        <div className="col-md-8">
                            <div className="borderRadius">
                                <div className="card">
                                    <ul className="list-group list-group-flush">
                                        <li className="liTransition bg-white list-group-item">
                                            <label htmlFor="user" className="form__labelProfile font-weight-bold">Cuenta de usuario</label>
                                            <input
                                                type="text"
                                                className="form-control form-control-lg profileForm form__inputProfile"
                                                name="user"
                                                placeholder="Cuenta de usuario"
                                                autoComplete={'user'}
                                                value={user || ''}
                                                id="user"
                                                disabled={true}
                                                onChange={(event) => this.onChangeUser(event.target.value)}
                                            />
                                            {/* <label htmlFor="user" className="form__labelProfile font-weight-bold">Cuenta de usuario</label> */}
                                        </li>
                                        <li className="liTransitionIcon bg-white list-group-item">
                                            <label htmlFor="currentPassword" className="form__labelProfile font-weight-bold">Contraseña actual</label>
                                            <div className="input-group" >   
                                                <div className="input-group-prepend bg-white mr-md-3">
                                                    <span className="input-group-text"
                                                        onClick={() => this.eyeVisibility('typeVisibility')}><i aria-hidden="true" className={typeVisibility === false ? 'fa fa-eye' : 'fa fa-eye-slash'} /></span>                                                </div>                                     
                                                <input
                                                    type={typeVisibility === false ? 'text' : 'password'}
                                                    className="form-control form-control-lg profileForm form__inputProfile"
                                                    name="currentPassword"
                                                    placeholder="Contraseña actual"
                                                    autoComplete={'off'}
                                                    value={typeVisibility === true ? '*****' : (password || oldPass || '')}
                                                    id="currentPassword"
                                                    disabled={editModeAccountInfoZone === false ? true : false}
                                                    onChange={(event) => this.onChangeOldPass(event.target.value)}
                                                />
                                                {/* <label htmlFor="currentPassword" className="form__labelProfile ">Contraseña actual</label> */}
                                            </div>
                                        </li>
                                        {editModeAccountInfoZone === true &&
                                            <>
                                                <li className="liTransitionIcon bg-white list-group-item">
                                                    <label htmlFor="newPassword1" className="form__labelProfile font-weight-bold">Nueva contraseña</label>
                                                    <div className="input-group" >
                                                        <div className="input-group-prepend bg-white mr-md-3">
                                                            <span className="input-group-text"
                                                                onClick={() => this.eyeVisibility('typeVisibilitynew')}><i aria-hidden="true" className={typeVisibilitynew === false ? 'fa fa-eye' : 'fa fa-eye-slash'} /></span>
                                                        </div>
                                                        <input
                                                            type={typeVisibilitynew === false ? 'text' : 'password'}
                                                            className="form-control form-control-lg profileForm form__inputProfile"
                                                            name="newPassword1"
                                                            placeholder="Nueva contraseña"
                                                            autoComplete={'off'}
                                                            value={newPass1 || ''}
                                                            id="newPassword1"
                                                            disabled={editModeAccountInfoZone === false ? true : false}
                                                            onChange={(event) => this.onChangeNewPass1(event.target.value)}
                                                        />
                                                        {/* <label htmlFor="newPassword1" className="form__labelProfile font-weight-bold">Nueva contraseña</label> */}
                                                    </div>
                                                </li>
                                                <li className="liTransitionIcon bg-white list-group-item">
                                                    <label htmlFor="newPassword2" className="form__labelProfile font-weight-bold">Confirmación de contraseña</label>
                                                    <div className="input-group" >
                                                        <div className="input-group-prepend bg-white mr-md-3">
                                                            <span className="input-group-text"
                                                                onClick={() => this.eyeVisibility('typeVisibilityrepeat')}><i aria-hidden="true" className={typeVisibilityrepeat === false ? 'fa fa-eye' : 'fa fa-eye-slash'} /></span>
                                                        </div>
                                                        <input
                                                            type={typeVisibilityrepeat === false ? 'text' : 'password'}
                                                            className="form-control form-control-lg profileForm form__inputProfile"
                                                            name="newPassword2"
                                                            placeholder="Vuelva a confirmar su contraseña"
                                                            autoComplete={'off'}
                                                            value={newPass2 || ''}
                                                            id="newPassword2"
                                                            disabled={editModeAccountInfoZone === false ? true : false}
                                                            onChange={(event) => this.onChangeNewPass2(event.target.value)}
                                                        />
                                                        {/* <label htmlFor="newPassword2" className="form__labelProfile font-weight-bold">Confirmación de contraseña</label> */}
                                                    </div>
                                                </li>
                                            </>
                                        }
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row justify-content-center">
                        <div className="col-md-8">
                            <div className="row justify-content-end">
                                <div className="col-md-2 text-right">
                                    <button
                                        onClick={editModeAccountInfoZone === false ? () => this.onChangeZone('editModeAccountInfoZone') : this.updatePartnerInfo}
                                        className="btn btn-primary btn-lg mt-2 mb-2 btnProfile" style={{backgroundColor:'rgb(0, 96, 234)', borderColor:'rgb(0, 96, 234)'}}>
                                        {editModeAccountInfoZone === false ? 'Editar' : 'Actualizar'}
                                    </button>
                                </div>
                                {editModeAccountInfoZone === true && 
                                    <div className="col-md-2 text-right">
                                        <button
                                            onClick={this.onCancelZone}
                                            className="btn btn-lg mt-2 mb-2 btnProfile"
                                            style={{backgroundColor:'rgb(0, 96, 234)',borderColor:'rgb(0, 96, 234)', color:'white'}}>
                                            Cancelar
                                        </button>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                    {config.modules.redAliado &&
                        <div className="row mb-md-3 mt-md-4 justify-content-center">
                            <div className="col-md-8">
                                <div className="row justify-content-start">
                                    <div className="col-md-4">
                                        <h3 className="font-weight-bold">Tarjeta Recompensas</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                    {config.modules.redAliado &&
                        <div className="row justify-content-center">
                            <div className="col-md-8">
                                <div className="borderRadius">
                                    <div className="card">
                                        <ul className="list-group list-group-flush">
                                            <li className="liTransitionIcon bg-white list-group-item" >
                                                <label htmlFor="card" className="form__labelProfile font-weight-bold">No. de tarjeta de Recompensas </label>
                                                {card !== '' ?
                                                    <div className="input-group" >
                                                        <div className="input-group-prepend bg-white mr-md-3">
                                                            <span className="input-group-text"
                                                                onClick={() => this.eyeVisibility('typeVisibilityCard')}><i aria-hidden="true" className={typeVisibilityCard === false ? 'fa fa-eye' : 'fa fa-eye-slash'} /></span>
                                                        </div>
                                                        <input
                                                            type={typeVisibilityCard === false ? 'text' : 'password'}
                                                            className="form-control form-control-lg profileForm form__inputProfile"
                                                            name="card"
                                                            placeholder="Tarjeta de Recompensas"
                                                            autoComplete={'off'}
                                                            value={card || ''}
                                                            disabled={true}
                                                            id="card"
                                                        />
                                                        {/* <label htmlFor="card" className="form__labelProfile font-weight-bold">No. de tarjeta de RedCompensa</label> */}

                                                    </div> :
                                                    ' No posee una tarjeta de Recompensas'
                                                }
                                            </li>
                                            {card !== '' &&
                                                <li className="liTransition bg-white list-group-item" >
                                                    <label htmlFor="cardStatus" className="form__labelProfile font-weight-bold">Status de tarjeta</label>
                                                    <input
                                                        type='text'
                                                        className="form-control form-control-lg profileForm form__inputProfile"
                                                        name="cardStatus"
                                                        placeholder="Estatus de tarjeta"
                                                        autoComplete={'off'}
                                                        disabled={true}
                                                        value={card === 0 ? 'Inactiva' : 'Activa'}
                                                        id="cardStatus"
                                                    />
                                                    {/* <label htmlFor="cardStatus" className="form__labelProfile font-weight-bold">Status de tarjeta</label> */}
                                                </li>
                                            }
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                    <div className="row justify-content-center py-4">
                        <div className="col-md-8">
                            <div className="row justify-content-start">
                                <div className="col-md-4">
                                    <button
                                        className="btn btn-lg text-white"
                                        type="button"
                                        style={{ background: "#0060EA", borderRadius: "10px", padding: 7 }}
                                        onClick={() => history.goEditAddress()}>
                                        Apartado de direcciones
                                    </button>
                                    {/* <a className = "mt-md-5"><h3 className = "font-weight-bold" onClick={() => history.goEditAddress()}>Apartado de direcciones</h3></a> */}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            );
        }
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
)(ProfileView);