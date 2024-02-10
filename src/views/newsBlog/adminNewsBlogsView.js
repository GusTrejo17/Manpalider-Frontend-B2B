import React, { Component } from 'react';
import { Footer, NavBar, Session, TopNavBar } from "../../components";
import { DISPATCH_ID, SERVICE_RESPONSE, config, ROLES, VIEW_NAME, SERVICE_API } from '../../libs/utils/Const';
import { ApiClient } from "../../libs/apiClient/ApiClient";
import { connect } from "react-redux";
import $ from 'jquery';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import CKEditor from '@ckeditor/ckeditor5-react';
import DatePicker from '@trendmicro/react-datepicker';
import moment from "moment";
import axios from 'axios';
import Swal from 'sweetalert2';
import { animateScroll as scroll, scroller } from 'react-scroll';

let apiClient = ApiClient.getInstance();

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

class adminNewsBlogsView extends Component {
    constructor(props) {
        super(props);
        const api = config.BASE_URL;
        const assets = config.ASSETS;
        this.state = {
            file: null,
            image: null,
            update: 'not',
            active: 'on',
            Sucursal: 0,
            old_image: '',
            errors: {
                title: '',
                file: '',
            },
            assets: assets,
            intro: '',
            order: [],
            urlapi: api,
            id: '0',
            is_date: 'off',
            valid_from: moment().format('YYYY-MM-DD'),
            valid_to: moment().format('YYYY-MM-DD'),
            seller: JSON.parse(localStorage.getItem(config.general.localStorageNamed + 'PartnerUser')),
        };
        this.fnLoadAllBanners = this.fnLoadAllBanners.bind(this);
        this.scrollToBottom = this.scrollToBottom.bind(this);
    };

    async componentDidMount() {
        this.fnLoadAllBanners();
        this.scrollToBottom();
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
            intro: '',
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
            isLoaded: false
        });
    }

    localidad = (event, option) => {
        if (option == 1) {
            this.setState({
                groupCodeValue: event.nativeEvent.target.value,
            })
        }

        setTimeout(() => {
            // this.searchDocuments()
        }, 100)
    };

    sucursal = (event, option) => {
        if (option == 1) {
            this.setState({
                Sucursal: parseInt(event.nativeEvent.target.value),
            })
        }

        setTimeout(() => {
            // this.searchDocuments()
        }, 100)
    };

    Create = async response => {
        const { enableSpinner, notificationReducer: { showAlert } } = this.props;
        const { DocEntry, usuario, U_CurrStep, tipo } = this.state;

        enableSpinner(true);

        let data = {
            DocEntry: DocEntry,
            Usuario: usuario,
            WstCode: U_CurrStep,
            tipo: tipo
        };
        let apiResponse = await apiClient.createAutorization(data);
        if (apiResponse.status === SERVICE_RESPONSE.SUCCESS) {
            enableSpinner(false);
            if (apiResponse.message === 'Documento autorizado para su creación') {
                showAlert({ type: 'success', message: apiResponse.message });
            } else {
                showAlert({ type: 'warning', message: apiResponse.message })
            }

            $('#saveModal').modal('hide');
            this.table.destroy();
            this.cargarDatos();
            return;
        }

        showAlert({ type: 'error', message: "Aviso: " + apiResponse.message });
        enableSpinner(false)
    };

    fileSelectedHandler = event => {
        // console.log(event.target.files[0]);
        this.setState({
            file: event.target.files[0],
            image: URL.createObjectURL(event.target.files[0])
        });
    }

    saveDataHandler = (event) => {
        const { sessionReducer: { user } } = this.props;
        const { seller } = this.state;
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
                user_id: user ? user.CardName : '', //seller ? seller.lastName + ' ' + seller.firstName : '',
                title: this.state.title,
                slug: slug,
                url: this.state.url,
                file: this.state.file,
                image: newFileName,
                intro: this.state.intro,
                content: this.state.content,
                items: this.state.items,
                active: this.state.active === "" ? "on" : this.state.active,
                is_date: this.state.is_date === "" ? "on" : this.state.is_date,
                valid_from: this.state.valid_from,
                valid_to: this.state.valid_to,
                order_item: this.state.order_item,
                id: idBanner,
            }
            // update data         
            axios({ method: method, url: `${this.state.urlapi}/admin/saveNews`, data: dataPost })
                .then((response) => {
                    //console.log("Response SAVE EDIT:", response);
                    this.setState({
                        isLoaded: true,
                    });
                    Swal.fire(
                        'Alerta',
                        'Noticia guardada satisfactoriamente!',
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
                if (oldFileName.length >= 43) this.deleteFile(oldFileName);
            }
            this.tooglediv();
        }
    }

    deleteFile = (oldFileName) => {
        // delete file
        axios.post(`${this.state.urlapi}/deletefile/newsBlog/${oldFileName}`)
            .then((response) => {
                //console.log("ResponseFile:", response);
            })
            .catch((error) => {
                //console.log("ErrorFile:", error);
            });
    }

    addFile = (newFileName, dataForm) => {
        // add - update file
        axios.post(`${this.state.urlapi}/uploadfile/newsBlog/${newFileName}`, dataForm)
            .then((response) => {
                //console.log("ResponseFile:", response);
            })
            .catch((error) => {
                //console.log("ErrorFile:", error);
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

    renderImage() {
        const { file, image, update, assets } = this.state;
        let urlImge = "";
        if (update === 'not') {
            urlImge = image;
        } else {
            if (image !== null) urlImge = assets + 'newsBlog/' + image;
        }
        if (file !== null) {
            return (
                <div className='text-center'>
                    <img src={image} className="img-fluid my-3" style={{ width: '300px', height: '225px' }} alt={image} />
                </div>
            );
        } else {
            return (
                <div className='text-center'>
                    <img src={urlImge} className="img-fluid my-3" style={{ width: '300px', height: '225px' }} alt={image} />
                </div>
            );
        }
    }

    handleCKEditorState = (event, editor) => {
        const data = editor.getData();
        this.setState({
            intro: data
        });
        //console.log(data);
    }

    handleCKEditorState1 = (event, editor) => {
        const data = editor.getData();
        this.setState({
            content: data
        });
        //console.log(data);
    }

    validateHandler = (event) => {
        const { name, value } = event.target;
        let errors = this.state.errors;
        switch (name) {
            case 'is_date':
                break;
            case 'title':
                errors.title = value.length < 5 ? 'Full Name must be 5 characters long!' : '';
                break;
            default:
                break;
        }
        this.setState({ errors, [name]: value }, () => {
            //console.log(errors)
        });
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

    fnLoadAllBanners = () => {
        //console.log("Entro",this.state.urlapi);
        fetch(`${this.state.urlapi}/admin/getNewsBlog`, { method: 'POST', mode: 'cors', cache: 'default' })
            .then(res => res.json())
            .then(res => {
                let response = res;
                this.setState({
                    isLoaded: false,
                    banners: response
                });
            });
        //console.log('Bye')
        window.scrollTo(0, 0);
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
            isLoaded: false
        });
        $('.hides').show('slow');
        this.loadBanner(id);
    }

    loadBanner = (id = null) => {
        const api = config.BASE_URL;
        var miInit = { method: 'POST', mode: 'cors', cache: 'default' };
        fetch(`${api}/admin/getNewsBlog/${id}`, miInit).then(res => res.json())
            .then((result) => {
                if (result.length > 0) {
                    //console.log('dbData',result[0]);
                    /**/
                    this.setState({
                        user_id: result[0].creator,
                        title: result[0].title,
                        // slug: result[0].slug,
                        // url: result[0].url,
                        image: result[0].image,
                        old_image: result[0].image,
                        // items: result[0].items,
                        intro: result[0].introduction,
                        content: result[0].new,
                        active: result[0].active,
                        id: result[0].id,
                        is_date: result[0].isDate,
                        // order_item: result[0].orderBanner,
                        valid_from: moment(result[0].date, 'YYYY-MM-DD'),
                        valid_to: moment(result[0].hasta, "YYYY-MM-DD"),
                    });

                }
            })
            .catch(function (error) {
                // console.log('Error:',error);
            });
    }

    deleteData = (id, image) => {
        window.scrollTo(0, 0);
        Swal.fire({
            title: 'Eliminar',
            text: "¿Estas seguro de eliminar la noticia?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, Eliminar!'
        }).then((result) => {
            if (result.value) {
                axios({ method: "DELETE", url: `${this.state.urlapi}/admin/deleteNews/${id}` })
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

    render() {
        const { configReducer: { history }, sessionReducer } = this.props;
        const { update, banners, url, intro, content, items, is_date, valid_from, valid_to, assets, order } = this.state;
        return (
            <div className="content-fluid none-scroll" style={{ marginTop: 150, backgroundColor: "#FFF" }}>
                {/* <Session history={history} view={VIEW_NAME.ITEMS_POLAR_VIEW}/> */}
                <NavBar />
                <div className="bannerRedCompensas margenS" style={{ backgroundColor: "#FFF" }}>
                    <img id="scrollDownPlease" className="img-fluid"
                    // alt="Segundo NavBar"
                    />
                </div>
                <div className="row mb-md-3 mt-md-3 justify-content-center">
                    <div className="col-md-10">
                        <div className="row ">
                            <div className="col-md-6">
                                <h3 className="font-weight-bold" style={{ fontWeight: "bolder", fontSize: "2.5rem", color: "black" }}>Noticias</h3>
                            </div>
                            <div className="col-md-6 justify-content-end" style={{ display: 'flex' }}>
                                <button className="btn btn-block text-white" onClick={this.tooglediv} style={{ borderRadius: 10, background: "#86C03F", width: 200, }}><i class="fa fa-plus-circle" aria-hidden="true"></i>&nbsp;Agregar noticia</button>
                            </div>
                        </div>
                    </div>
                    {/* <div className="col-md-8">
                        <div className="row justify-content-start">
                            <div className="col-md-4">
                            <button className="btn btn-block text-white" onClick={this.tooglediv} style={{borderRadius:10, background: "#86C03F"}}><i class="fa fa-plus-circle" aria-hidden="true"></i>&nbsp;Agregar noticia</button> 
                            </div>
                        </div>
                    </div> */}
                </div>

                <div className="row">
                    <div className="col-md-12">
                        {/* <button className="btn btn-outline-secondary" onClick={this.tooglediv}>+ Agregar un banner</button> */}
                        <input type="hidden" name="update" id="update" value={update} />
                    </div>
                </div>
                <div className="row mt-2">
                    <div className="col-md-12">
                        <header className="container hides">
                            <div className="form-group">
                                <fieldset>
                                    <label className="control-label" htmlFor="file">Imagen:</label>
                                    {this.renderImage()}
                                    <input className="form-control" name="file" type="file" id="file" onChange={this.fileSelectedHandler} />
                                    <small className="text-danger">{this.state.errors.file}</small>
                                </fieldset>
                            </div>
                            <div className="form-group">
                                <fieldset>
                                    <label className="control-label" htmlFor="title">Título:</label>
                                    <input className="form-control" id="title" name="title" type="text" placeholder="título" value={this.state.title} onChange={this.validateHandler} noValidate />
                                    <small className="text-danger">{this.state.errors.title}</small>
                                </fieldset>
                            </div>
                            <div className="form-group">
                                <fieldset>
                                    <label className="control-label" htmlFor="content">Introducción:</label>
                                    <CKEditor
                                        editor={ClassicEditor}
                                        data={intro}
                                        onInit={editor => { }}
                                        onChange={this.handleCKEditorState}
                                    />
                                </fieldset>
                            </div>
                            <div className="form-group">
                                <fieldset>
                                    <label className="control-label" htmlFor="content">Noticia:</label>
                                    <CKEditor
                                        editor={ClassicEditor}
                                        data={content}
                                        onInit={editor => { }}
                                        onChange={this.handleCKEditorState1}
                                    />
                                </fieldset>
                            </div>
                            <div className="container">
                                <div className="row">
                                    <div className="col-md-6">
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
                                        </div>
                                        </div>
                            {/* <div className="form-group">
                                <fieldset>
                                    <label className="control-label" htmlFor="active">Activo:</label>
                                    <select name="active" id="active" className="form-control" onChange={this.validateHandler} value={this.state.active}>
                                        <option value="on">SI</option>
                                        <option value="off">NO</option>
                                    </select>
                                </fieldset>
                            </div> */}
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
                            {/* <div className="form-group">
                                <fieldset>
                                    <label className="control-label"> </label>
                                    <button style={{ borderRadius: 10, background: "#0060EA" }} className="btn btn-block text-white" onClick={this.saveDataHandler} >Guardar</button>
                                    <button style={{ borderRadius: 10 }} className="btn btn-danger btn-block" onClick={this.tooglediv} >Cancelar</button>
                                </fieldset>
                            </div> */}
                        </header>
                    </div>
                </div>

                <div className="row justify-content-center">
                    <div className="col-md-10">
                        <h3><i class="fa fa-bullhorn" aria-hidden="true"></i>&nbsp;Lista de noticias</h3>
                    </div>

                    <div className="col-md-10 table-responsive" style={{/*marginBottom: 0, height: 370, maxHeight: 370, width:470, maxWidth:470,overflow: 'auto'*/ }}>
                        <table className="table table-striped scroll" >
                            <thead style={{ textAlign: "-webkit-center" }}>
                                <tr className="text-light" style={{ backgroundColor: '#0060EA', color: "white" }} >
                                    {/* <th scope="col">#</th> */}
                                    <th scope="col" style={{ width: '30%' }} className="align-middle text-center" >Título</th>
                                    <th scope="col" className="align-middle ">autor</th>
                                    <th scope="col" className="align-middle ">Fecha de creación</th>
                                    <th scope="col" className="align-middle text-center">Editar</th>
                                    <th scope="col" className="align-middle text-center">Eliminar</th>
                                </tr>
                            </thead>
                            <tbody style={{ textAlign: "-webkit-center" }}>
                                {!!banners && banners.map((blog, index) => {
                                    return (
                                        <tr key={index}>
                                            <td style={{ width: '30%' }} className="align-middle" >{blog.title}</td>
                                            <td className="align-middle ">{blog.creator}</td>
                                            <td className="align-middle ">{moment(blog.date).utc().format('YYYY-MM-DD')}</td>
                                            {/* <td className="align-middle text-center">
                                            <button
                                                className="btn btn-sm"
                                                type="button"
                                                style={{ backgroundColor: config.navBar.iconBackground, color: config.navBar.iconModal, marginLeft: '10px', marginRight: '10px' }}
                                                // onClick={() => selectItemsBonification(item.ItemCode)}
                                                > 
                                                <i className="fa fa-pencil"></i> Editar
                                            </button>
                                        </td>*/}

                                            <td>
                                                <button className="btn btn-block text-white" onClick={e => this.editData(blog.id)} style={{ borderRadius: 10, background: "#86C03F" }}>
                                                    <i className="fa fa-pencil"></i> Editar</button>
                                            </td>
                                            <td>
                                                <button className="btn btn-danger btn-block" onClick={e => this.deleteData(blog.id, blog.file)} style={{ borderRadius: 10 }}>
                                                    <i class="fa fa-trash" aria-hidden="true"></i> Eliminar</button>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
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
)(adminNewsBlogsView);

