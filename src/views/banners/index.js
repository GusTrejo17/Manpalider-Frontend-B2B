import React, {Component} from 'react';
import Swal from 'sweetalert2';
import DatePicker from '@trendmicro/react-datepicker';
import moment from 'moment';
import axios from 'axios';
import $ from 'jquery';
import {connect} from "react-redux";

import {config,DISPATCH_ID} from "../../libs/utils/Const";
import '@trendmicro/react-datepicker/dist/react-datepicker.css';

// Require Editor CSS files.
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import CKEditor from '@ckeditor/ckeditor5-react';
import {Footer, NavBar, Session} from "../../components";
import {VIEW_NAME, SERVICE_RESPONSE, ROLES} from "../../libs/utils/Const";
import {ApiClient} from "../../libs/apiClient/ApiClient";
import './banners.css';
import { animateScroll as scroll, scroller } from 'react-scroll';

const apiClient = ApiClient.getInstance();

ClassicEditor.defaultConfig = {
    toolbar: {
        items: [
            'heading',
            '|',
            'bold',
            'italic',
            '|',
            'bulletedList',
            'numberedList',
            'blockQuote',
            '|',
            'undo',
            'redo'
        ]
    },
    // This value must be kept in sync with the language defined in webpack.config.js.
    language: 'es'
};


class BannerAdminIndex extends Component {
    constructor(props){
        super(props);
        const api = config.BASE_URL;
        const assets = config.ASSETS;
        this.state = {
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
            id: '0',
            banners: [],
            urlapi: api,
            assets: assets
        };
        this.fnLoadAllBanners = this.fnLoadAllBanners.bind(this);
        this.scrollToBottom = this.scrollToBottom.bind(this);
    }
    

    handleCKEditorState = (event,editor) => {
        const data = editor.getData();
        this.setState({
            content: data
        });
        //console.log(data);
    }
    async componentDidMount() {
        this.fnLoadAllBanners();
        this.scrollToBottom();
        /*
        let response = await apiClient.openAdminBanner();
        // console.log("Según los banner",response);
        if (response.status === SERVICE_RESPONSE.SUCCESS) {
            this.setState({
                banners: response.data,
            })
        }else{
            this.setState({
                banners: [{"data":"Not Found!"}],
            })
        }
        */
    }
    componentDidUpdate(prevProps, prevState) {
        //console.log('update', this.state.isLoaded, prevState.isLoaded);
        if (this.state.isLoaded) this.fnLoadAllBanners();
    }

    scrollToBottom() {
	    scroll.scrollToTop({
	        duration: 1000,
	        delay: 100,
	        smooth: 'easeOutQuart',
	        isDynamic: true
	      })
    }

    // function for catch file content.
    fileSelectedHandler = event => {
        const { notificationReducer: {showAlert}} = this.props;
        // console.log(event.target.files[0]);
        let value = event.target.files[0];
        let ext = value.name.lastIndexOf(".");
        let validateExt = value.name.substring(ext, value.name.length);
        let flagValidationExt = validateExt == ".jpg" || validateExt == ".jpeg"|| validateExt == ".png" ? true : false;
        if(flagValidationExt === false){
            showAlert({ type: 'warning', message: 'El archvio debe estar en formato valido .jpg, jpeg, .png ', timeOut: 8000 });
            document.getElementById("file").value= null
            return;
        }
        this.setState({
            file: event.target.files[0],
            image: URL.createObjectURL(event.target.files[0])
        });
    }
    // function for upload file ans send form.
    validateHandler = (event) => {
        const { name, value } = event.target;
        let errors = this.state.errors;
        //console.log('State', this.state);
        switch (name) {
            case 'is_date':
                // console.log('isdate', value);
                break;
            case 'title':
                errors.title = value.length < 5 ? 'Full Name must be 5 characters long!' : '';
                break;
            default:
                break;
        }// end switch
        this.setState({ errors, [name]: value }, () => {
            //console.log(errors)
        });
    }// end function send form
    onEditorStateChange = (content) => {
        this.setState({
            content,
        });
    }
    fnLoadAllBanners = () => {
        //console.log("Entro",this.state.urlapi);
        fetch(`${this.state.urlapi}/admin/getbanners`, { method: 'POST', mode: 'cors', cache: 'default' })
            .then(res => res.json())
            .then(res => {
                let response = res;
                //console.log('ResponseBanner',response);
                this.setState({
                    isLoaded: false,
                    banners: response
                });
            });
        //console.log('Bye')
        window.scrollTo(0, 0);
    }

    loadBanner = (id = null) => {
        const api = config.BASE_URL;
        var miInit = { method: 'POST', mode: 'cors', cache: 'default' };
        fetch(`${api}/admin/getbanner/${id}`, miInit).then(res => res.json())
            .then((result) => {
                if (result.length > 0) {
                    //console.log('dbData',result[0]);
                    /**/
                    this.setState({
                        title: result[0].title,
                        slug: result[0].slug,
                        url: result[0].url,
                        image: result[0].image,
                        old_image: result[0].image,
                        content: result[0].contents,
                        items: result[0].items,
                        active: result[0].active,
                        id: result[0].id,
                        is_date: result[0].isDate,
                        order_item: result[0].orderBanner,
                        valid_from: moment(result[0].validFrom,'YYYY-MM-DD'),
                        valid_to: moment(result[0].validTo,"YYYY-MM-DD"),
                        sectionBanner:result[0].section
                    });
                    
                }
            })
            .catch(function (error) {
                //console.log(error);
                /* esta línea podría arrojar error, e.g. cuando console = {} */
            });
    }
    saveDataHandler = (event) => {
        window.scrollTo(0, 0);
        event.preventDefault();
        //console.log("SendForm:", this.state);
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
        if (this.state.update === 'yes') { // insert new item
            if (!updateImage) {
                newFileName = this.state.old_image;
            }
            method = 'PUT';
            idBanner = this.state.id;
        }
        let send = true;
        let errors = this.state.errors;
        if (this.state.title.length < 5) {
            errors.title = 'Full Name must be 5 characters long!';
            send = false;
            this.setState({ errors, title: 'Full Name must be 5 characters long!' });
            this.setState({ title: '' });
        }

        // Verificar si la URL ingresada es válida
        if(this.state.url !== ''){
            const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
            const isValid = urlRegex.test(this.state.url);
            if(!isValid){
                const {notificationReducer: {showAlert}}    = this.props
                showAlert({type: 'warning', message: 'La URL es incorrecta', timeOut: 0});        
                return;
            }
        } 
        if (!send) {
            // errors in send form
            Swal.fire(
                'Alerta Error',
                'Campos obligatorios!',
                'error'
            );
        } else {
            // send form to backend
            /**/
            let dataPost = {
                user_id: 0,
                title: this.state.title,
                slug: slug,
                url: this.state.url,
                file: this.state.file,
                image: newFileName,
                content: this.state.content,
                items: this.state.items,
                active: this.state.active === "" ? "on" : this.state.active,
                is_date: this.state.is_date === "" ? "on" : this.state.is_date,
                valid_from: this.state.valid_from,
                valid_to: this.state.valid_to,
                order_item: this.state.order_item,
                id: idBanner,
                section:this.state.sectionBanner
            }
            // update data

            axios({ method: method, url: `${this.state.urlapi}/admin/savebanner`, data: dataPost })
                .then((response) => {
                    //console.log("Response SAVE EDIT:", response);
                    this.setState({
                        isLoaded: true,
                    });
                    Swal.fire(
                        'Alerta',
                        'Formulario fué enviado satisfactoriamente!',
                        'success'
                    );
                })
                .catch((error) => {
                    //console.log(error);
                    Swal.fire(
                        'Alerta Error',
                        error,
                        'error'
                    );
                });
            //console.log("like example",this.state.file);
            if (this.state.file !== null) {
                const dataForm = new FormData();
                dataForm.append('file', this.state.file);
                let oldFileName = this.state.old_image;
                // update file
                this.addFile(newFileName, dataForm);
                // delete file
                if(oldFileName.length>=43)this.deleteFile(oldFileName);
            }
            this.tooglediv();
        }
    }

    editData = (id) => {
        window.scrollTo(0, 0);
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
            update: 'yes',
            valid_from: moment().format('YYYY-MM-DD'),
            valid_to: moment().format('YYYY-MM-DD'),
            errors: {
                title: '',
                file: '',
            },
            isLoaded: false,
            sectionBanner:''
        });
        $('.hides').show('slow');
        this.loadBanner(id);
    }

    addFile = (newFileName, dataForm) => {
        // add - update file
        axios.post(`${this.state.urlapi}/uploadfile/banners/${newFileName}`, dataForm)
            .then((response) => {
                //console.log("ResponseFile:", response);
            })
            .catch((error) => {
                //console.log("ErrorFile:", error);
            });
    }
    deleteFile = (oldFileName) => {
        // delete file
        axios.post(`${this.state.urlapi}/deletefile/banners/${oldFileName}`)
            .then((response) => {
                //console.log("ResponseFile:", response);
            })
            .catch((error) => {
                //console.log("ErrorFile:", error);
            });
    }
    deleteData = (id, image) => {
        window.scrollTo(0, 0);
        Swal.fire({
            title: 'Eliminar',
            text: "¿Estas seguro de eliminar el registro?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.value) {
                axios({ method: "DELETE", url: `${this.state.urlapi}/admin/deletebanner/${id}` })
                    .then((response) => {
                        //console.log("Response:", response);
                        this.setState({
                            isLoaded: true,
                        });
                    })
                    .catch((error) => {
                        //console.log(error);
                    });
                this.deleteFile(image);
            }
        });
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
        window.scrollTo(0, 0);
        $('.hides').toggle();
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
            sectionBanner: 'Principal'
        });
    }
    renderImage() {
        const { file, image, update, assets } = this.state;
        let urlImge = "";
        if (update === 'not') {
            urlImge = image;
        } else {
            if (image !== null) urlImge = assets + 'banners/' + image;
        }
        if (file !== null) {
            return (
                <div className='text-center'>
                    <img src={image} className="img-fluid my-3" alt={image} />
                </div>
            );
        } else {
            return (
                <div className='text-center'>
                    <img src={urlImge} className="img-fluid my-3" alt={image} />
                </div>
            );
        }
    }
    sectionBan= event => {
        this.setState({
            sectionBanner: event.target.value
        })
    }

    render() {
        const {history} = this.props;
        const {sessionReducer} = this.props;
        const bannerShow = this.state;
        const { update, banners, url, content, items, is_date, valid_from, valid_to, assets,sectionBanner } = this.state;
        const orders = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'];
        
        return (
            <div className="content-fluid" style={{marginTop: 150,backgroundColor:"#FFF"}}>
                <Session history={history} view={VIEW_NAME.CONTACT_US_VIEW}/>
                <NavBar/>
                <div className="container pb-4" style={{paddingTop: 60}}>
                    <div className="row">
                        <div className="col">
                            <div className="jumbotron">
                                <h1 className="display-4 text-center" style={{fontWeight:"bolder",fontSize:"2.5rem",textAlign:"center", color:"black"}}>Listado de banners</h1>
                            </div>
                        </div>    
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <button className="btn btn-outline-secondary" onClick={this.tooglediv}>+ Agregar un banner</button>
                            <input type="hidden" name="update" id="update" value={update} />
                        </div>
                    </div>
                    <div className="row mt-2">
                        <div className="col-md-12">
                            <header className="container hides">
                                <div className="form-group">
                                    <fieldset>
                                        <label className="control-label" htmlFor="title">Título:</label>
                                        <input className="form-control" id="title" name="title" type="text" placeholder="Título para el banner" value={this.state.title} onChange={this.validateHandler} noValidate />
                                        <small className="text-danger">{this.state.errors.title}</small>
                                    </fieldset>
                                </div>
                                <div className="form-group">
                                    <fieldset>
                                        <label className="control-label" htmlFor="is_date">Sección:</label>
                                        <select name="is_date" id="is_date" className="form-control" onChange={this.sectionBan} value={sectionBanner}>
                                            <option value="Principal">Principal</option>
                                            <option value="Secundaria">Secundaria</option>
                                        </select>
                                    </fieldset>
                                </div>
                                <div className="form-group">
                                    <fieldset>
                                        <label className="control-label" htmlFor="url">URL Redirect:</label>
                                        <input className="form-control" id="url" type="url" name="url" placeholder="URL redirección" value={url} onChange={this.validateHandler} />
                                    </fieldset>
                                </div>
                                <div className="form-group">
                                    <fieldset>
                                        <label className="control-label" htmlFor="file">Imagen:</label>
                                        <input className="form-control" name="file" type="file" id="file" onChange={this.fileSelectedHandler} />
                                        <small className="text-danger">{this.state.errors.file}</small>
                                        {this.renderImage()}
                                    </fieldset>
                                </div>
                                <div className="form-group">
                                    <fieldset>
                                        <label className="control-label" htmlFor="content">Contenido:</label>
                                        <CKEditor
                                            editor={ClassicEditor}
                                            data={content}
                                            onInit={editor=>{ }}
                                            onChange={this.handleCKEditorState}
                                        />
                                    </fieldset>
                                </div>
                                <div className="form-group" >
                                    <fieldset style={{display: 'none'}}>
                                        <label className="control-label" htmlFor="items">Productos:</label>
                                        <textarea className="form-control" style={{display: 'none'}} name="items" id="items" placeholder="Listado de articulos separados con ;" value={items} onChange={this.validateHandler} disabled></textarea>
                                        <small className="text-muted">Separar articulos con ";" ejemplo CA0001;CA0002;CA0003 </small>
                                    </fieldset>
                                </div>
                                <div className='container'>
                                <div className="form-group">
                                    <fieldset>
                                        <label className="control-label" htmlFor="is_date">Activar Vigencia:</label>
                                        <select name="is_date" id="is_date" className="form-control" onChange={this.validateHandler} value={is_date}>
                                            <option value="on">SI</option>
                                            <option value="off">NO</option>
                                        </select>
                                    </fieldset>
                                </div>
                                </div>
                                <div className="container">
                                    <div className="row">
                                        <div className="col-md-6" style={{ marginBottom: '100px' }}>
                                            <div className="form-group-calendario">
                                            <div className="form-group-titulo">
                                                <label htmlFor="is_date" style={{ marginBottom: 0 }}>De:</label>
                                                <DatePicker
                                                    date={valid_from}
                                                    onSelect={(date) => {
                                                        this.setState({ valid_from: date });
                                                    }}
                                                />
                                            </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6" style={{ marginBottom: '100px' }}>
                                            <div className="form-group-calendario">
                                                <div className="form-group-titulo">
                                                <label htmlFor="is_date" style={{ marginBottom: 0 }}>Hasta:</label>
                                                <DatePicker
                                                    date={valid_to}
                                                    onSelect={(date) => {
                                                        this.setState({ valid_to: date });
                                                    }}
                                                />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="container">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label className="control-label" htmlFor="active">Activo:</label>
                                                <select name="active" id="active" className="form-control" onChange={this.validateHandler} value={this.state.active}>
                                                    <option value="on">SI</option>
                                                    <option value="off">NO</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label className="control-label" htmlFor="order_item">Orden:</label>
                                                <select name="order_item" id="order_item" className="form-control" onChange={this.validateHandler} value={this.state.order_item}>
                                                    {orders.map((ord, index) => (
                                                        <option value={ord} key={index}>{ord}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="container">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="form-group">
                                                <fieldset>
                                                    <label className="control-label"> </label>
                                                    <button style={{ borderRadius: 10, background: "#0060EA" }} className="btn btn-block text-white" onClick={this.saveDataHandler} >Guardar</button>
                                                    <button style={{ borderRadius: 10 }} className="btn btn-danger btn-block" onClick={this.tooglediv} >Cancelar</button>
                                                </fieldset>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* <div className="container">
                                    <div className="row">
                                        <div className="col-md-6" style={{ marginBottom: '15px' }}>
                                            <div className="form-group">
                                                <label htmlFor="is_date">De:</label>
                                                <DatePicker
                                                    date={valid_from}
                                                    onSelect={(date) => {
                                                        this.setState({ valid_from: date });
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6" style={{ marginBottom: '15px' }}>
                                            <div className="form-group">
                                                <label htmlFor="is_date">Hasta:</label>
                                                <DatePicker
                                                    date={valid_to}
                                                    onSelect={(date) => {
                                                        this.setState({ valid_to: date });
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div> */}
                                {/* <div  className="container">
                                <div className="form-group">
                                    <fieldset>
                                        <label className="control-label" htmlFor="active">Activo:</label>
                                        <select name="active" id="active" className="form-control" onChange={this.validateHandler} value={this.state.active}>
                                            <option value="on">SI</option>
                                            <option value="off">NO</option>
                                        </select>
                                    </fieldset>
                                </div>
                                </div> */}
                                {/* <div  className="container">
                                <div className="form-group">
                                    <fieldset>
                                        <label className="control-label" htmlFor="order_item">Orden:</label>
                                        <select name="order_item" id="order_item" className="form-control" onChange={this.validateHandler} value={this.state.order_item}>
                                            {orders.map((ord, index) => (
                                                <option value={ord} key={index}>{ord}</option>
                                            ))}
                                        </select>
                                    </fieldset>
                                </div>
                                </div> */}
                                {/* <div className="form-group">
                                    <fieldset>
                                        <label className="control-label"> </label>
                                        <button style={{borderRadius:10, background: "#0060EA"}} className="btn btn-block text-white" onClick={this.saveDataHandler} >Guardar</button>
                                        <button style={{borderRadius:10}} className="btn btn-danger btn-block" onClick={this.tooglediv} >Cancelar</button>
                                    </fieldset>
                                </div> */}
                            </header>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <hr></hr>
                            <h4 className="text-center">{banners.length} registro(s) encontrados</h4>
                            <hr></hr>
                        </div>
                    </div>
                    <div className="row" style={{ paddingLeft: 10, paddingRight: 10 }}>
                        <div className="table-responsive" style={{ height: 400, maxHeight: 400, overflow: 'auto' }}>
                            <table className="table table-hover scrolltable">
                                <thead className="text-white" style={{ textAlign: "-webkit-center" }}>
                                    <tr>
                                        <th scope="col">ID</th>
                                        <th scope="col">Título</th>
                                        <th scope="col">Imagen</th>
                                        <th scope="col">Vigente</th>
                                        <th scope="col">Activo</th>
                                        <th scope="col">Orden</th>
                                        <th scope="col">Editar</th>
                                        <th scope="col">Eliminar</th>
                                    </tr>
                                </thead>
                                <tbody style={{ textAlign: "-webkit-center" }}>
                                    {banners.map((row) => {
                                        return (<tr key={row.id}>
                                            <th scope="row">{row.id}</th>
                                            <td>{row.title}</td>
                                            <td>
                                                <a>{row.image}</a>
                                            </td>
                                            <td>{row.isDate === "on" ? moment(row.validFrom).utc().format('YYYY-MM-DD') + ' to ' + moment(row.validTo).utc().format('YYYY-MM-DD') : 'NA'}</td>
                                            <td>{row.active === 'on' ? 'Activo' : 'In-Activo'}</td>
                                            <td className="text-center">
                                                <span className="badge badge-primary">{row.orderBanner}</span></td>
                                            <td>
                                                <button className="btn btn-block text-white" onClick={e => this.editData(row.id)} style={{ borderRadius: 10, background: "#86C03F" }}>Editar</button>
                                            </td>
                                            <td>
                                                <button className="btn btn-danger btn-block" onClick={e => this.deleteData(row.id, row.file)} style={{ borderRadius: 10 }}>Eliminar</button>
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
    };
};

const mapDispatchToProps = dispatch => {
    return {
        enableSpinner: value => dispatch({ type: DISPATCH_ID.CONFIG_SET_SPINNER, value }),
        setAddresses: value => dispatch({ type: DISPATCH_ID.SESSION_SET_ADDRESSES, value }),
    };
};
// export default BannerAdminIndex;

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(BannerAdminIndex);