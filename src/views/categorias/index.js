import React, { Component } from 'react';
import Swal from 'sweetalert2';
import DatePicker from '@trendmicro/react-datepicker';
import moment from 'moment';
import axios from 'axios';
import $ from 'jquery';
import { connect } from "react-redux";

import { config, DISPATCH_ID } from "../../libs/utils/Const";
import '@trendmicro/react-datepicker/dist/react-datepicker.css';

// Require Editor CSS files.
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { NavBar, Session } from "../../components";
import { VIEW_NAME } from "../../libs/utils/Const";
import { ApiClient } from "../../libs/apiClient/ApiClient";
import './categorias.css';
import { animateScroll as scroll } from 'react-scroll';

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

class CategoriaAdminIndex extends Component {
    constructor(props) {
        super(props);
        const api = config.BASE_URL;
        const assets = config.ASSETS;
        this.state = {
            user_id: '0',
            title: '',
            slug: '',
            file: null,
            image: null,
            active: 'on',
            old_image: '',
            categoria: '- Ninguna Categoria -',
            is_date: 'off',
            order_Banner: '',
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
            assets: assets,
            categories: [],
            orders: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20']
        };
        this.fnLoadAllBanners = this.fnLoadAllBanners.bind(this);
        this.scrollToBottom = this.scrollToBottom.bind(this);
    }

    handleCKEditorState = (event, editor) => {
        const data = editor.getData();
        this.setState({
            content: data
        });
    }

    async componentDidMount() {
        this.fnLoadAllBanners();
        this.scrollToBottom();

        //Obtener el listado de las categorias para la busqueda al dar click sobre la imagen
        let response = await apiClient.getAllCategories();
        if (response && response.recordset && response.recordset.length > 0) {
            this.setState({
                categories: response.recordset
            });
        }

    }

    componentDidUpdate(prevProps, prevState) {
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

    // Validar archivo seleccionado
    fileSelectedHandler = event => {
        const { notificationReducer: { showAlert } } = this.props;
        let value = event.target.files[0];

        if (!value) {
            this.setState({
                file: null,
                image: null,
            });
            this.setState({ errors: { ...this.state.errors, file: '' } });
            return;
        }

        let ext = value.name.lastIndexOf(".");
        let validateExt = value.name.substring(ext, value.name.length);
        let flagValidationExt = validateExt == ".jpg" || validateExt == ".jpeg" || validateExt == ".png" ? true : false;
        if (flagValidationExt === false) {
            showAlert({ type: 'warning', message: 'El archivo debe estar en formato valido .jpg, jpeg, .png ', timeOut: 8000 });
            document.getElementById("file").value = null
            this.setState({
                file: null,
                image: null
            });
            return;
        }
        this.setState({ errors: { ...this.state.errors, file: '' } });
        this.setState({
            file: event.target.files[0],
            image: URL.createObjectURL(event.target.files[0])
        });
    }

    validateHandler = (event) => {
        const { name, value } = event.target;
        let errors = this.state.errors;
        switch (name) {
            case 'is_date':
                break;
            case 'title':
                errors.title = value.length < 5 ? 'El titulo debe de contener al menos 5 caracteres' : '';
                break;
            default:
                break;
        }
        this.setState({ errors, [name]: value }, () => {

        });
    }

    onEditorStateChange = (content) => {
        this.setState({
            content,
        });
    }

    //Obtener todos los registros
    fnLoadAllBanners = () => {
        fetch(`${this.state.urlapi}/admin/getcategorias`, { method: 'POST', mode: 'cors', cache: 'default' })
            .then(res => res.json())
            .then(res => {
                let response = res;
                this.setState({
                    isLoaded: false,
                    banners: response
                });
            });
        window.scrollTo(0, 0);
    }

    //Obtener la información de un registro para mostrarla en el formulario
    loadBanner = (id = null) => {
        const api = config.BASE_URL;
        var miInit = { method: 'POST', mode: 'cors', cache: 'default' };
        fetch(`${api}/admin/getcategoria/${id}`, miInit).then(res => res.json())
            .then((result) => {
                if (result.length > 0) {
                    //Obtener datos de la tabla 
                    this.setState({
                        id: result[0].id,
                        user_id: result[0].userid,
                        slug: result[0].slug,
                        title: result[0].title,
                        image: result[0].image,
                        is_date: result[0].isDate,
                        valid_from: moment(result[0].validFrom, 'YYYY-MM-DD'),
                        valid_to: moment(result[0].validTo, "YYYY-MM-DD"),
                        order_Banner: result[0].orderBanner,
                        active: result[0].active,
                        createdAt: result[0].createdAt,
                        updatedAt: result[0].updatedAt,
                        categoria: result[0].category,
                    });
                }
            })
            .catch(function (error) {

            });
    }

    //Guardar archivo
    saveDataHandler = (event) => {
        const { notificationReducer: { showAlert } } = this.props;
        window.scrollTo(0, 0);
        event.preventDefault();
        let file = this.state.file;
        let fileSplit = '';
        let newFileName = '';
        //El string_to_slug hace que se cambie el nombre del archivo
        let slug = this.string_to_slug(this.state.title);
        let updateImage = false;
        let method = 'POST';
        let idBanner = 0;

        if (file) {
            fileSplit = file.name ? file.name.split('.') : '';
            if (fileSplit) {
                //Guardar Imagen con el nombre aplicado el slug
                //newFileName = slug + '.' + fileSplit[fileSplit.length - 1];
                //Guardar Imagen con el nombre del titulo
                newFileName = this.state.title + '.' + fileSplit[fileSplit.length - 1];
                updateImage = true;
            }
        }

        if (this.state.update === 'yes') { // cambiar a metodo actualizar
            if (!updateImage) {
                newFileName = this.state.old_image;
            }
            method = 'PUT';
            idBanner = this.state.id;
        }

        let send = true;
        let errors = this.state.errors;

        //Validar titulo
        if (this.state.title.length < 5) {
            errors.title = 'El titulo debe de contener al menos 5 caracteres';
            send = false;
            this.setState({ errors, title: 'Full Name must be 5 characters long!' });
            this.setState({ title: '' });
        }

        //Validar  archivo de imagen
        if (this.state.file === null) {
            const errors = this.state.errors;
            errors.file = 'Se necesita ingresar un archivo de imagen';
            send = false;
            this.setState({ errors });
            Swal.fire(
                'Alerta',
                'Campos obligatorios!',
                'error'
            );
            return;
        }

        //Validar categoría
        if (this.state.categoria === '' || this.state.categoria === '- Ninguna Categoria -') {
            const errors = this.state.errors;
            send = false;
            showAlert({ type: 'warning', message: 'Favor de seleccionar una categoría', timeOut: 8000 });
            this.setState({ categoria: '- Ninguna Categoria -' });
            return;
        }

        if (!send) {
            // errors in send form
            Swal.fire(
                'Alerta',
                'Campos obligatorios!',
                'error'
            );
        } else {
            // send form to backend
            let dataPost = {
                user_id: 0,
                slug: slug,
                title: this.state.title,
                image: newFileName,
                is_date: this.state.is_date === "" ? "on" : this.state.is_date,
                valid_from: this.state.valid_from,
                valid_to: this.state.valid_to,
                order_Banner: this.state.order_Banner,
                active: this.state.active === "" ? "on" : this.state.active,
                createdAt: method === 'POST' ? moment().format('YYYY-MM-DD') : this.state.createdAt,
                updatedAt: moment().format('YYYY-MM-DD'),
                category: this.state.categoria,
                id: idBanner || 0
            }
            
            //Agregar o actualizar registro de la tabla
            axios({ method: method, url: `${this.state.urlapi}/admin/savecategoria`, data: dataPost })
                .then((response) => {
                    this.setState({
                        isLoaded: true,
                    });
                    Swal.fire(
                        'Alerta',
                        'El formulario fué enviado satisfactoriamente',
                        'success'
                    );
                })
                .catch((error) => {
                    Swal.fire(
                        'Alerta Error' +
                        error,
                        'error'
                    );
                });

            if (this.state.file !== null) {
                const dataForm = new FormData();
                dataForm.append('file', this.state.file);
                let oldFileName = this.state.old_image;
                // actualizar archivo en la carpeta
                this.addFile(newFileName, dataForm);
                // eliminar archivo de la carpeta
                //if (oldFileName.length >= 43) this.deleteFile(oldFileName);
            }
            this.tooglediv();
        }
    }

    editData = (id) => {
        window.scrollTo(0, 0);
        this.setState({
            title: '',
            slug: '',
            file: null,
            image: null,
            active: 'on',
            old_image: '',
            is_date: 'off',
            categoria: '',
            order_Banner: '0',
            update: 'yes',
            valid_from: moment().format('YYYY-MM-DD'),
            valid_to: moment().format('YYYY-MM-DD'),
            errors: {
                title: '',
                file: '',
            },
            isLoaded: false
        });
        $('.hides').show('slow');
        this.loadBanner(id);
    }

    // agregar-actualizar archivo de imagen de la carpeta
    addFile = (newFileName, dataForm) => {
        axios.post(`${this.state.urlapi}/uploadfile/categorias/${newFileName}`, dataForm)
            .then((response) => {

            })
            .catch((error) => {

            });
    }

    // eliminar archivo de imagen de la carpeta
    deleteFile = (oldFileName) => {
        axios.post(`${this.state.urlapi}/deletefile/categorias/${oldFileName}`)
            .then((response) => {

            })
            .catch((error) => {

            });
    }

    //Eliminar un registro de la tabla
    deleteData = (id, image) => {
        window.scrollTo(0, 0);
        Swal.fire({
            title: 'Eliminar',
            text: "¿Estas seguro de eliminar el registro?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, estoy de acuerdo',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.value) {
                axios({ method: "DELETE", url: `${this.state.urlapi}/admin/deletecategoria/${id}` })
                    .then((response) => {
                        this.setState({
                            isLoaded: true,
                        });
                    })
                    .catch((error) => {

                    });
                //Eliminar archivo de imagen de la carpeta
                //this.deleteFile(image);
            }
        });
    }

    string_to_slug(str) {
        str = str.replace(/^\s+|\s+$/g, '');
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

    //Animación de mostrar u ocultar formulario
    tooglediv = () => {
        window.scrollTo(0, 0);
        $('.hides').toggle('fast'); //Animacion->> slow, normal, fast
        document.getElementById("file").value = null;
        this.setState({
            title: '',
            slug: '',
            file: null,
            image: null,
            active: 'on',
            old_image: '',
            is_date: 'off',
            categoria: '- Ninguna Categoria -',
            order_Banner: '1',
            update: 'not',
            valid_from: moment().format('YYYY-MM-DD'),
            valid_to: moment().format('YYYY-MM-DD'),
            errors: {
                title: '',
                file: '',
            },
            isLoaded: false
        });
    }

    //Mostrar imagen cuando se ingresa o al recuperarla al editar
    renderImage() {
        const { file, image, update, assets } = this.state;
        let urlImge = "";

        if (update === 'not') {
            urlImge = image;
        } else {
            if (image !== null) urlImge = assets + 'categorias/' + image;
        }
        if (file !== null) {
            return (
                <div className='text-center'>
                    <img src={image} className="img-fluid my-3" alt={image} style={{ maxHeight: "100px", maxWidth: "100px", width: "100%", height: "100%" }} />
                </div>
            );
        } else {
            return (
                <div className='text-center'>
                    {urlImge &&
                        <img src={urlImge} className="img-fluid my-3" alt={image} style={{ maxHeight: "100px", maxWidth: "100px", width: "100%", height: "100%" }} />
                    }
                    <br></br>
                </div>
            );
        }
    }

    // sectionBan = event => {
    //     this.setState({
    //         sectionBanner: event.target.value
    //     })
    // }

    render() {
        const { history } = this.props;
        const { update, banners, is_date, valid_from, valid_to, categories, orders } = this.state;

        return (
            <div className="content-fluid" style={{ marginTop: 150, backgroundColor: "#FFF" }}>
                <Session history={history} view={VIEW_NAME.CONTACT_US_VIEW} />
                <NavBar />
                <div className="container pb-4" style={{ paddingTop: 60 }}>
                    <div className="row">
                        <div className="col">
                            <div className="jumbotron">
                                <h1 className="text-center" style={{ fontWeight: "bolder", fontSize: "2.5rem", textAlign: "center", color: "black" }}>Listado de Categorías</h1>
                            </div>
                        </div>
                    </div>
                    {banners.length < 12 ? (
                        <div className="row">
                            <div className="col-md-12">
                                <button className="btn btn-outline-secondary" onClick={this.tooglediv}>+ Agregar una categoría</button>
                                <input type="hidden" name="update" id="update" value={update} />
                            </div>
                        </div>
                    ) : (
                        <span style={{ color: 'red' }}>Solo disponible para 12 categorías</span>
                    )}
                    <div className="row mt-2">
                        <div className="col-md-12">
                            <header className="container hides">
                                <fieldset>
                                    <label className="control-label" htmlFor="title">Título:</label>
                                    <input className="form-control" id="title" name="title" type="text" placeholder="Título para la categoría" value={this.state.title} onChange={this.validateHandler} noValidate />
                                    <small className="text-danger">{this.state.errors.title}</small>
                                </fieldset>
                                {/* <div className="form-group">
                                    <fieldset>
                                        <label className="control-label" htmlFor="is_date">Sección:</label>
                                        <select name="is_date" id="is_date" className="form-control" onChange={this.sectionBan} value={sectionBanner}>
                                            <option value="Principal">Principal</option>
                                            <option value="Secundaria">Secundaria</option>
                                        </select>
                                    </fieldset>
                                </div> */}
                                {/* <div className="form-group">
                                    <fieldset>
                                        <label className="control-label" htmlFor="url">URL Redirect:</label>
                                        <input className="form-control" id="url" type="url" name="url" placeholder="URL redirección" value={url} onChange={this.validateHandler} />
                                    </fieldset>
                                </div> */}
                                <br></br>
                                <fieldset>
                                    <label className="control-label" htmlFor="file">Imagen:</label>
                                    <input className="form-control" name="file" type="file" id="file" onChange={this.fileSelectedHandler} />
                                    <small className="text-danger">{this.state.errors.file}</small>
                                    {this.renderImage()}
                                </fieldset>
                                {/* <div className="form-group">
                                    <fieldset>
                                        <label className="control-label" htmlFor="content">Contenido:</label>
                                        <CKEditor
                                            editor={ClassicEditor}
                                            data={content}
                                            onInit={editor=>{ }}
                                            onChange={this.handleCKEditorState}
                                        />
                                    </fieldset>
                                </div> */}
                                {/* <div className="form-group" >
                                    <fieldset style={{display: 'none'}}>
                                        <label className="control-label" htmlFor="items">Productos:</label>
                                        <textarea className="form-control" style={{display: 'none'}} name="items" id="items" placeholder="Listado de articulos separados con ;" value={items} onChange={this.validateHandler} disabled></textarea>
                                        <small className="text-muted">Separar articulos con ";" ejemplo CA0001;CA0002;CA0003 </small>
                                    </fieldset>
                                </div> */}
                                <fieldset>
                                    <label className="control-label" htmlFor="categoria">
                                        Categoría:
                                    </label>
                                    <select name="categoria" id="categoria" className="form-control" onChange={this.validateHandler} value={this.state.categoria}>
                                        <option value="">- Ninguna Categoría -</option>
                                        {categories.map((categoria, index) => (
                                            <option key={index} value={categoria.category}>
                                                {categoria.category}
                                            </option>
                                        ))}
                                    </select>
                                </fieldset>
                                <br></br>
                                <fieldset>
                                    <label className="control-label" htmlFor="is_date">Activar Vigencia:</label>
                                    <select name="is_date" id="is_date" className="form-control" onChange={this.validateHandler} value={is_date}>
                                        <option value="on">SI</option>
                                        <option value="off">NO</option>
                                    </select>
                                </fieldset>
                                <div className="row">
                                    <div className="col-md-6 text-center">
                                        <div className="row mt-4">
                                            <label htmlFor="is_date">De:</label>
                                        </div>
                                        <div className="row">
                                            <DatePicker
                                                date={valid_from}
                                                onSelect={(date) => {
                                                    this.setState({ valid_from: date });
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6 text-center">
                                        <div className="row mt-4">
                                            <label htmlFor="is_date" >Hasta:</label>
                                        </div>
                                        <div className="row">
                                            <DatePicker
                                                date={valid_to}
                                                onSelect={(date) => {
                                                    this.setState({ valid_to: date });
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6 mt-4">
                                        <label className="control-label font-weight-bold" htmlFor="active">Activo:</label>
                                        {/* <select name="active" id="active" className="form-control" onChange={this.validateHandler} value={this.state.active}> */}
                                        <select name="active" id="active" className="form-control" disabled={true} value="on">
                                            <option value="on">SI</option>
                                            <option value="off">NO</option>
                                        </select>
                                    </div>
                                    <div className="col-md-6 mt-4">
                                        <label className="control-label font-weight-bold" htmlFor="order_Banner">Orden:</label>
                                        <select name="order_Banner" id="order_Banner" className="form-control" onChange={this.validateHandler} value={this.state.order_Banner}>
                                            {orders.map((ord, index) => (
                                                <option value={ord} key={index}>{ord}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="container">
                                    <div className="row">
                                        <div className="col-md-12 p-0 m-0">
                                            <fieldset>
                                                <label className="control-label"> </label>
                                                <button style={{ borderRadius: 10, background: "#0060EA" }} className="btn btn-block text-white" onClick={this.saveDataHandler} >Guardar</button>
                                                <button style={{ borderRadius: 10 }} className="btn btn-danger btn-block" onClick={this.tooglediv} >Cancelar</button>
                                            </fieldset>
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
                                        <label className="control-label" htmlFor="order_Banner">Orden:</label>
                                        <select name="order_Banner" id="order_Banner" className="form-control" onChange={this.validateHandler} value={this.state.order_Banner}>
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
                                        <th scope="col">Categoría</th>
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
                                            <td>{row.category}</td>
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

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CategoriaAdminIndex);