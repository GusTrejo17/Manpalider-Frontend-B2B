import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from "react-redux";
import {
    NavBarLogo,
    NavBarShoppingCartIcon,
    NavbarSearchIcon,
    NavBarContentSearchItems,
    NavBarButton,
    LoginModal,
    LoginRegisterModal,
    MenuCategories,
    ProfieldModel,
    Quote,
    NewDistributor,
    MenuNavbar,
    CategoriesMenu,
} from "./index";
import { config, ROLES, DISPATCH_ID, SERVICE_RESPONSE, SERVICE_API } from '../libs/utils/Const';
import { Modal } from './index';
import $, { event } from "jquery";
import './navBar.css';
import { ApiClient } from "../libs/apiClient/ApiClient";
import moment from 'moment';
import { SaveCartModal, SideBar } from "../components";
import { animateScroll as scroll, scroller } from 'react-scroll';
import ReactDOM from 'react-dom';
import './MenuNavbar.css';



let modal = new Modal();
let apiClient = ApiClient.getInstance();

class NavBar extends Component {


    constructor(props) {
        super(props);

        this.state = {
            marcas: [],
            aparatos: [],
            refacciones: [],
            fabricantes: [],
            materiales: [],
            seller: JSON.parse(localStorage.getItem(config.general.localStorageNamed + 'PartnerUser')), // Propiedades del vendedor, se visulaizan en el aplication
            vendor: JSON.parse(localStorage.getItem(config.general.localStorageNamed + 'vendor')),
            user: JSON.parse(localStorage.getItem(config.general.localStorageNamed + 'CurrentUser')),
            inputValue: '',
            showOptions: false,
            clickedInside: false,
        };
        this.scrollToBottom = this.scrollToBottom.bind(this);
    }
    //Evento para capturar los valores de los campos
    handelChange = ({ target }) => {
        const { name, value } = target;
        this.setState({
            [name]: value
        });
    };

    scrollToBottom() {
        scroll.scrollToTop({
            duration: 1000,
            delay: 100,
            smooth: 'easeOutQuart',
            isDynamic: true
        })
    }

    async componentDidMount() {
        // this.fillDataSearch();
    }

    toggleMenuUser = () => {
        $("#menu-user-button").click(function () {
            $(".menu-user").toggle();
            $(".menu-user-responsive").focus();
        });
    }

    renderName = () => {
        const { configReducer, sessionReducer: { user } } = this.props;
        const { seller, vendor } = this.state;
        ////console.log("se puede mostar", empID);
        // //console.log("in vendor", vendor);
        if (seller !== null) {
            return (
                <div className='d-flex flex-row mt-2 pr-2'>
                    <img className='iconUser mr-xl-2 mr-md-4' src={config.navBar.avatar} style={{ maxWidth: "30px", cursor: "pointer" }} />
                    <div className='nombre2 d-flex flex-column'>
                        <span className="nombre0" style={{ color: config.navBar.textColor, font: '-webkit-control', fontSize: '11px', }}>{seller.firstName} {seller.lastName} {(seller.firstName != '' && user.CardName) ? ':' : ''}</span>
                        <span className="nombre1" style={{ color: '#8f8f8f', fontSize: 10 }}>{user.CardName}</span>
                    </div>
                </div>
            );
        } else {
            return (
                <span className="" style={{ color: config.navBar.textColor }}>{user.CardName}</span>
            );
        }
    }

    iconUser = (priceList) => {
        let result = '';
        switch (priceList) {
            case 4:
                result = config.Avatar.bronze1;
                break;
            case 5:
                result = config.Avatar.silver1;
                break;
            case 6:
                result = config.Avatar.gold1;
                break;
            case 7:
                result = config.Avatar.platinum1;
                break;
            case 9:
                result = config.Avatar.diamond1;
                break;
            case 13:
                result = config.Avatar.mercado1;
                break;
            default:
                result = config.Avatar.red1;
                break;
        }
        return result
    }

    nivel = (priceList) => {
        let result = '';
        switch (priceList) {
            case 4:
                result = 'Bronze';
                break;
            case 5:
                result = 'Silver';
                break;
            case 6:
                result = 'Gold';
                break;
            case 7:
                result = 'Platinum';
                break;
            case 9:
                result = 'Diamond';
                break;
            case 13:
                result = 'Filial';
                break;
            default:
                result = '';
                break;
        }
        return result
    }

    renderClientOptionFirstNavBar = () => {
        const { configReducer, isShowMarcas } = this.props;
        const { sessionReducer: { user, role } } = this.props;
        const { seller } = this.state;
        return (
            <ul className="navbar-nav miCuenta d-md-flex ml-4" style={{ maxWidth: 200 }}>
                <li className="nav-item">
                    <span className="imgAvatar" style={{ display: "flex", alignItems: "center" }}>
                        {/* <i id="IconUser" className={config.icons.user} aria-hidden="true" style={{ color: config.navBar.iconColor2, fontSize: 25 }} /> */}
                        <img src={this.iconUser(user.listNum)} style={{ color: config.navBar.iconColor2 }} />
                        <a className="nav-link dropdown-toggle" style={{ display: "flex", alignItems: "center" }} type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            {/* <span className="ml-2" style={{widh:150, maxWidth: 200, color: "#0078C0"}}><strong>Bienvenido </strong><br/>{user.CardName}</span> */}
                            <div className="marq" style={{ whiteSpace: "pre-wrap", font: "-webkit-control" }}><span className="">{this.renderName()}</span></div><br />
                            {/* <label className="justify-content-left" ><span className="text-left font-weight-bold">Nivel: {this.nivel(user.listNum)}</span></label> */}
                        </a>
                        {/* <div className="dropdown"> */}
                        {/* CAMBIOS 117-MARINROCKS */}
                        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                            {seller ? seller.U_FMB_Handel_Perfil != '0' && seller.U_FMB_Handel_Perfil != 5 ?
                                <a className="dropdown-item" onClick={() => { configReducer.history.goSelectClient(); }}>Mis clientes</a>
                                : "" : ""
                            }
                            {seller ? seller.U_FMB_Handel_Perfil != '0' && seller.U_FMB_Handel_Perfil != 5 && seller.U_FMB_Handel_Boletin === 1 ?
                                <a className="dropdown-item" style={{ color: "#C55930 !important" }} onClick={() => { configReducer.history.goBoletin(); }}>Ver correos del boletín</a>
                                : "" : ""
                            }
                            {/* {seller ? seller.U_FMB_Handel_Perfil != '0' && seller.U_FMB_Handel_Perfil != 5 ? 
                                <a className="dropdown-item" onClick={() => { configReducer.history.goAnalytics(); }}>Analytics</a>
                                : "" : ""
                            } */}
                            {seller ? seller.U_FMB_Handel_Perfil != '0' && seller.U_FMB_Handel_Perfil != 5 && seller.U_FMB_Bonificaciones === "1" ?
                                <a className="dropdown-item" onClick={() => { configReducer.history.goPromocionales(); }}>Promociones</a>
                                : "" : ""
                            }
                            {/* {Object.entries(user).length !== 0 && } */}
                            {config.modules.subirArchivoExcel && seller ? seller.U_FMB_Handel_Perfil != 5 && Object.entries(user).length !== 0 ?
                                <Link to='/subirArchivo' className="dropdown-item" >Carga Masiva</Link>
                                : "" : ""
                            }
                            {seller ? seller.U_FMB_Handel_Perfil != 5 && Object.entries(user).length !== 0 && user.CardCode !== 'C2029' && user.CardCode !== 'C4192' ?
                                <Link to='/reports' className="dropdown-item" >Mis pedidos y Reportes</Link>
                                : "" : ""
                            }
                            {seller ? seller.U_FMB_Handel_Perfil != '0' && seller.U_FMB_Handel_Perfil != 5 ?
                                <a className="dropdown-item" onClick={() => { configReducer.history.goCardSaveds(); }}>Carritos guardados</a>
                                : "" : ""
                            }
                            {seller ? seller.U_FMB_Handel_Perfil != '0' && seller.U_FMB_Handel_Perfil != 5 ?
                                <a class="dropdown-item" style={{ color: "black", cursor: "pointer" }} onClick={() => { this.handleViews("favorites") }}>Mis Favoritos</a>
                                : "" : ""
                            }
                            {/* <a className="dropdown-item" onClick={() => { configReducer.history.goOrders(); }}>Mis pedidos</a> */}
                            {user.wishlist === 1 &&
                                <a className="dropdown-item" onClick={() => { configReducer.history.goBackOrder(); }}>Lista de deseos</a>}
                            {/* {user.U_FMB_Handel_Admin === '1' &&
                                <a className="dropdown-item" onClick={() => { configReducer.history.goML(); }}>Admin ML</a>} */}
                            {/* {user.banners === "on" && */}
                            {seller ? seller.U_FMB_Banner == 1 ?
                                <Link to='/adminBanners' className="dropdown-item" >Adm. Banners</Link>
                                : "" : ""
                            }
                            {seller ? seller.U_FMB_Banner == 1 ?
                                <Link to='/adminCategorias' className="dropdown-item" >Adm. Categorías</Link>
                                : "" : ""
                            }
                            {/* seller ? seller.U_FMB_AdmBlogNoticia == 1 ? */}
                            {seller ? seller.U_FMB_AdmBlogNoticia == 1 ?
                                <Link to='/admiNewsBlog' className="dropdown-item" >Adm. Blog de noticias</Link>
                                : "" : ""
                            }
                            {seller ? seller.U_FMB_Handel_Perfil === 5
                                ?
                                <a className="dropdown-item" onClick={() => { configReducer.history.goAutorizaciones(); }}>Autorizaciones</a>
                                : "" : ""
                            }
                            {/* {seller ? seller.U_FMB_Handel_Perfil === 5
                                ? 
                                <a className="dropdown-item" onClick={() => {  this.logOut(); }}>Cerrar Sesión</a>
                                : "" : ""
                            } */}

                            {/* goMyProfile es el perfil de Pete, goProfile es de Missa */}
                            {seller ? seller.U_FMB_Handel_Perfil != 5 && Object.entries(user).length !== 0 ?
                                <a className="dropdown-item" onClick={() => { configReducer.history.goProfile(); }}>Mi Perfil</a>
                                : "" : ""
                            }
                            {/* Información de la cuenta */}
                            {isShowMarcas != undefined && !isShowMarcas &&
                                <a className="dropdown-item" onClick={() => { this.openOrder() }}>Información de la cuenta</a>
                            }
                            {/* 117 */}
                            {role != ROLES.PUBLIC ?
                                <button className='btn-closed'>
                                    <a className="closed-item" style={{ color: 'white' }} onClick={() => { this.logOut(); }}>Cerrar Sesión</a>
                                </button> : ""}
                            {/* <Link to='/reports' className="dropdown-item"  style={{ color: config.navBar.textColor }}>Mis reportes</Link> */}
                            {user.banners === "on" &&
                                <Link to='/adminBanners' className="dropdown-item" style={{ color: config.navBar.textColor }}>Adm. Banners</Link>
                            }
                            {user.banners === "on" &&
                                <Link to='/adminCategorias' className="dropdown-item" style={{ color: config.navBar.textColor }}>Adm. Categorías</Link>
                            }
                            {user.U_FMB_Handel_Admin === '1' && config.modules.points &&
                                <a className="dropdown-item" onClick={() => { configReducer.history.goResetPoints(); }}>Periodo de puntos</a>}
                            {/* {user.U_FMB_Handel_Admin === '1' &&
                                <a className="dropdown-item m-item" style={{ color: config.navBar.textColor }} onClick={() => { configReducer.history.goSpecialPrices(); }}>Precios especiales</a>} */}
                            {/* <a className="dropdown-item" onClick={() => { configReducer.history.goProfile(); }}>Mi Perfil</a> */}


                            {/* {seller ? seller.U_FMB_Handel_Perfil != 5 && Object.entries(user).length !== 0 ?
                                <a className="dropdown-item" onClick={() => {  this.logOut(); }}>Cerrar Sesión</a>
                                : "" : ""
                            } */}

                        </div>
                    </span>
                    {/* </div> */}
                </li>
            </ul>
        )
    };

    SaveCart = async (response = null) => {
        const { shoppingCartReducer: { items }, notificationReducer: { showAlert }, itemsReducer: { deleteShoppingCart }, setUser, sessionReducer: { user } } = this.props;

        let creatorUser = JSON.parse(localStorage.getItem(config.general.localStorageNamed + 'PartnerUser'));
        if (response === 2) {
            let data = {
                shoppingCart: items,
                createCard: creatorUser.U_FMB_Handel_Perfil !== '0' ? creatorUser.salesPrson : 'B2B',
            };

            let apiResponse = await apiClient.createSavedCart(data);

            if (apiResponse.status === SERVICE_RESPONSE.SUCCESS) {
                deleteShoppingCart({ item: {}, deleteAll: true });
                localStorage.removeItem(config.general.localStorageNamed + 'CurrentUser');
                setUser({});
                await apiClient.liberarCliente(user.CardCode);
                setTimeout(async () => {
                    this.logOut();
                }, 500);
            }
        } else if (response !== 2 && response !== 4) {
            let data = {
                shoppingCart: items,
                createCard: creatorUser.U_FMB_Handel_Perfil !== '0' ? creatorUser.salesPrson : 'B2B',
            };

            let apiResponse = await apiClient.createSavedCart(data);

            if (apiResponse.status === SERVICE_RESPONSE.SUCCESS) {
                deleteShoppingCart({ item: {}, deleteAll: true });
                localStorage.removeItem(config.general.localStorageNamed + 'CurrentUser');
                setUser({});
                await apiClient.liberarCliente(user.CardCode);
                setTimeout(async () => {
                    this.logOut();
                }, 500);
            }
        }
        else {
            deleteShoppingCart({ item: {}, deleteAll: true });
            localStorage.removeItem(config.general.localStorageNamed + 'CurrentUser');
            setUser({});
            setTimeout(async () => {
                let respuesta = await apiClient.liberarCliente(user.CardCode);
                if (respuesta.status === SERVICE_RESPONSE.SUCCESS) {
                    this.logOut();
                    showAlert({ type: 'success', message: "Aviso: " + respuesta.message })
                } else {
                    showAlert({ type: 'error', message: "Error al liberar el cliente universal." })
                }
            }, 500);
        }
    }

    logOut = async () => {
        const { configReducer, setBusiness, setToken, setUser, setRememberUser, setRole, shoppingCartReducer: { getShoppingCart, items }, sessionReducer: { user } } = this.props;
        const { seller, vendor } = this.state;
        ////console.log('logout');
        if (user.CardCode === 'C2029' || user.CardCode === 'C4192') {
            if (items.length >= 1) {
                $('#saveCartModal').modal('show');
                return;
            }
            await apiClient.liberarCliente(user.CardCode);
        }
        // ---------------------------------------------------------------------------------------------
        let today = moment().format('YYYY-MM-DD');
        let time = moment().format('h:mm:ss a');
        let data = [];
        if (seller && seller.U_FMB_Handel_Perfil == 2) {
            data = {
                CardCode: seller.salesPrson,
                CardName: seller.lastName + ' ' + seller.firstName,
                Date: today,
                Time: time,
                TypeUser: 'Vendedor',
                Email: seller.email,
                IP: '192.168.0.139',
                Business: 'Diasa',
                Session: 0
            }
        } else if (seller.U_FMB_Handel_Perfil == 0) {
            data = {
                CardCode: user.CardCode,
                CardName: user.CardName,
                Date: today,
                Time: time,
                TypeUser: 'Cliente',
                Email: user.U_FMB_Handel_Email,
                Business: 'Diasa',
                Session: 0
            }
        }
        // if( Object.keys(data).length > 0){
        //     await apiClient.sendData(data);
        // }


        // ---------------------------------------------------------------------------------------------
        localStorage.removeItem(config.general.localStorageNamed + 'Role');
        localStorage.removeItem(config.general.localStorageNamed + 'Token');
        localStorage.removeItem(config.general.localStorageNamed + 'CurrentUser');
        localStorage.removeItem(config.general.localStorageNamed + 'PartnerUser');
        localStorage.removeItem(config.general.localStorageNamed + 'RememberUser');
        localStorage.removeItem(config.general.localStorageNamed + 'vendor');
        localStorage.clear();
        configReducer.history.goHome();

        setRole(ROLES.PUBLIC);
        setBusiness(config.general.business);
        setToken(undefined);
        setUser({});
        setRememberUser(false);

        setTimeout(async () => {
            await getShoppingCart(true);
        }, 300);
        window.location.reload(true)
    };

    renderPublicOptionFirstNavBar = () => {
        const { configReducer: { history } } = this.props;
        return (
            <ul className="navbar-nav d-none d-md-flex">
                <li className="nav-item" >
                    <a className="nav-link" style={{ color: config.navBar.textColor }}>
                        <h5 className="font-weigth-bold mr-sm-2 miCuenta" style={{ color: '#004b90', fontsize: 10 }} onClick={() => { /*modal.loginModal('show')*/ history.goLogin(); }}><img src={config.navBar.avatar} alt="avatar" style={{ width: "45px", marginRight: 14 }} /> Inicio de sesión</h5>
                    </a>
                </li>
                {/* <li className="nav-item">
                    <a className="nav-link" style={{ color: config.navBar.textColor }}>
                        <span onClick={() => { modal.loginRegisterModal('show') }}>Registrarse</span>
                    </a>
                </li> */}
            </ul>
        )
    };

    renderFirstNavBar = () => {
        const { sessionReducer: { user, role } } = this.props;
        const { seller } = this.state;
        const { sessionReducer, configReducer } = this.props;
        return (
            <div style={{ zIndex: 10, height: 115 }}>
                <div className="row justify-content-end p-2" style={{ backgroundColor: '#1e629b', fontSize: '9pt' }}>
                    {config.pdf.VERCatalogo &&
                        <div className="col-auto">
                            <button type="button" className="btn btn-info">
                                <a href={`${config.BASE_URL}/${SERVICE_API.getPolitics}/${config.pdf.Catalogo}`} target="_blank" >
                                    <span style={{ color: config.footer.textColor }}>Catálogo 2023</span>
                                </a>
                            </button>
                        </div>
                    }
                    <div className="col-auto">
                        <a href="https://wa.me/message/Z5RDIDIEZBJ2I1" target="_blank">
                            <img className="img-fluid" width='19px' src={config.BarraTelefono.Whats} style={{ color: config.footer.iconColor, padding: 1 }}></img>&nbsp;
                            <span style={{ color: "white" }}>(81) 8396 4633</span>
                        </a>
                    </div>
                    <div className="col-auto">
                        <a>
                            <img className="img-fluid" width='19px' src={config.BarraTelefono.IconCel} style={{ color: config.footer.iconColor, padding: 1 }}></img>&nbsp;
                            <span style={{ color: "white" }}>(81) 1253 3080</span>
                        </a>
                    </div>
                    <div className="col-auto">
                        <a onClick={() => { configReducer.history.goSucursales(); }} target="_blank">
                            <img className="img-fluid" width='19px' src={config.BarraTelefono.IconUbicacion} style={{ color: config.footer.iconColor, padding: 1 }}></img>&nbsp;
                        </a>
                    </div>
                </div>
                <nav id="navFirst" className="​navbar navbar-expand-sm primerNav" style={{ border: "none", background: config.navBar.backgroundColor }} >
                    <ul className="navbar-nav elements">
                        <li className="nav-link menu-categories-button text-center" style={{ color: config.navBar.textColor, cursor: "pointer" }}>
                            <img id="buttonMenu" src={config.navBar.menu} className="Img-fluid" style={{ color: config.navBar.iconColor }} />
                            <div className="navbar-brand" >
                                <NavBarLogo />
                            </div>
                        </li>
                        <li className="nav-item searchItems d-md-block d-none" style={{ textAlign: "center", paddingTop: 10 }}>
                            {/* <NavBarContentSearchItems className="nav justify-content-center" icon={config.icons.search} iconColor={config.navBar.iconColor} textColor={config.navBar.backgroundColor} fillDataSearch ={this.fillDataSearch} /> */}
                            <NavBarContentSearchItems className="nav justify-content-center" icon={config.icons.search} iconColor={config.navBar.iconColor} textColor={config.navBar.backgroundColor} fillDataSearch={this.fillDataSearch} />
                        </li>
                        <li className="nav-item text-center d-md-none d-lg-none searchAdvance" >
                            {/* <span className="buttonSearchAdvanced" > <img src={config.navBar.iconSearch} onClick={() => this.fillDataSearch()} className="Img-fluid"/> </span>  */}
                            {/* <span className="d-md-none" ><img src={config.navBar.searchAdvanced} className="Img-fluid" onClick={() => { modal.searchModal('show') }}/></span> */}
                        </li>
                        <li className="shopp nav-item mr-sm-auto d-md-flex row" id="navbarFirst" style={{ marginRight: "5px" }}>
                            <span >
                                <span>{sessionReducer.role === ROLES.PUBLIC ? this.renderPublicOptionFirstNavBar() : this.renderClientOptionFirstNavBar()}</span>
                            </span>
                            <span className="ml-2" style={{ alignSelf: "center" }}>
                                <NavbarSearchIcon
                                    icon={config.icons.search}
                                    iconColor={config.navBar.iconColor}
                                    textColor={config.navBar.textColor}
                                />
                                <NavBarShoppingCartIcon
                                    icon={config.icons.shoppingCart}
                                    iconColor={config.navBar.iconColor2}
                                    textColor={config.navBar.textColor}
                                />
                            </span>
                            {/* {seller ? seller.U_FMB_Handel_Perfil != '0' && seller.U_FMB_Handel_Perfil != 5 ?  */}
                            {sessionReducer.role !== ROLES.PUBLIC ?
                                <span className="ml-2" style={{ alignSelf: "center" }}>
                                    <Quote
                                        icon={config.icons.shoppingCart}
                                        iconColor={config.navBar.iconColor2}
                                        textColor={config.navBar.textColor}
                                    />
                                </span>
                                : ""
                            }
                        </li>
                    </ul>
                </nav>
                {/* <div className="fixed-top navbar navbar-expand-sm navbar-dark" style={{ border: 'none', padding: 0, height: 45, background: config.navBar.backgroundColor, marginTop: 30 }}>
                    <ul className="navbar-nav " style={{ paddingLeft: 16, paddingBottom: 16 }}>
                        <li className="nav-link menu-categories-button" style={{ color: config.navBar.textColor, cursor: "pointer" }}>
                            <i className={config.icons.menu} style={{ color: config.navBar.iconColor, fontsize: 15 }} />
                        </li>
                    </ul>
                    <NavBarLogo />
                    <ul className="navbar-nav  col-md-4 d-sm-block d-none  " style={{ paddingBottom: 5, marginLeft: 230, textAlign: "center" }}>
                        <li>
                            <NavBarContentSearchItems className="nav justify-content-center" icon={config.icons.search} iconColor={config.navBar.iconColor} textColor={config.navBar.backgroundColor} />
                        </li>
                    </ul>
                    <div className="row" >
                        <div className="col-md-12">
                            <button type="button"
                                className="btn btn-primary btn-sm btn-block"
                                style={{ fontsize: 25, background: config.navBar.iconColor, color: "white" }}
                                onClick={() => { modal.searchModal('show') }}>
                                Busqueda avanzada
                            </button>
                        </div>
                    </div>
                    <div className="navbar-nav ml-sm-auto d-md-flex" id="navbarFirst">
                        <span className="mr-2 p-1">
                            <span>{sessionReducer.role === ROLES.PUBLIC ? this.renderPublicOptionFirstNavBar() : this.renderClientOptionFirstNavBar()}</span>
                        </span>
                        <span className="p-1 mr-3">
                            <NavbarSearchIcon
                                icon={config.icons.search}
                                iconColor={config.navBar.iconColor}
                                textColor={config.navBar.textColor}
                            />&nbsp;
                        <NavBarShoppingCartIcon
                                icon={config.icons.shoppingCart}
                                iconColor={config.navBar.iconColor}
                                textColor={config.navBar.textColor}
                            />
                        </span>
                    </div>
                </div> */}
            </div >
        );
    };

    renderPublicOptionMenu = () => {
        const { configReducer: { history } } = this.props;
        return (
            <ul className="navbar-nav mr-auto" >
                <li className="nav-item" >
                    <a className="nav-link" style={{ color: config.navBar.textColor }}>
                        <h5 className="font-weigth-bold" style={{ color: config.navBar.textColor2, width: "auto" }} onClick={() => { /*modal.loginModal('show')*/ history.goLogin(); }}><i className="fas fa-user-circle" /> Inicio de sesión </h5>
                    </a>
                </li>
            </ul>
        )
    };

    searchModal = () => {
        const { marcas, aparatos, refacciones, fabricantes, materiales } = this.state;
        ////console.log('Valor del state', this.state);
        return (
            <div className="modal fade" id="searchModal" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{ border: "none", textAlign: "center" }}>
                <div className="modal-dialog" role="document" style={{ margin: "1.75rem auto" }}>
                    <div className="modal-content">
                        <div className="modal-header" style={{ background: '#0060aa' }}>
                            <h5 className="modal-title " style={{ color: config.navBar.textColor2 }}>Búsqueda</h5>
                            <button type="button" style={{ color: config.navBar.textColor2 }} className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body bg3">
                            <form onSubmit={this.handelSubmit} method="post" encType="text/plain" className="container">
                                <div className="row">
                                    <div className="col-md-12">
                                        <h4>Marca</h4>
                                        <select name="marca" placeholder="Selecciona una marca" className="form-control text-left" onChange={this.handelChange} style={{ textAlign: "center", height: 30, padding: 0 }}>
                                            <option value="">Selecciona una marca</option>
                                            {marcas &&
                                                marcas.map(marca => {
                                                    return <option value={marca.Code} key={marca.Code}>{marca.Name}</option>
                                                })
                                            }
                                        </select>
                                    </div>
                                    <div className="col-md-12">
                                        <h4>Aparato</h4>
                                        <select name="aparato" placeholder="Selecciona un aparato" className="form-control text-left" onChange={this.handelChange} style={{ textAlign: "center", height: 30, padding: 0 }}>
                                            <option value="">Selecciona un aparato</option>
                                            {aparatos &&
                                                aparatos.map(aparato => {
                                                    return <option value={aparato.Code} key={aparato.Code}>{aparato.Name}</option>
                                                })
                                            }
                                        </select>
                                    </div>
                                    <div className="col-md-12">
                                        <h4>Refacción</h4>
                                        <select name="refaccion" placeholder="Selecciona una refaccion" className="form-control text-left" onChange={this.handelChange} style={{ textAlign: "center", height: 30, padding: 0 }}>
                                            <option value="">Selecciona una refacción</option>
                                            {refacciones &&
                                                refacciones.map(refaccion => {
                                                    return <option value={refaccion.Code} key={refaccion.Code}>{refaccion.Name}</option>
                                                })
                                            }
                                        </select>
                                    </div>
                                    {/* <div className="col-md-12">
                                        <h4>Fabricante</h4>
                                        <select name="fabricante" placeholder="Selecciona un fabricante" className="form-control text-left" onChange={this.handelChange} style={{ textAlign: "center", height: 30, padding: 0 }}>
                                            <option value="">Selecciona un fabricante</option>
                                            {fabricantes &&
                                                fabricantes.map(fabricante => {
                                                    return <option value={fabricante.Code} key={fabricante.Code}>{fabricante.Name}</option>
                                                })
                                            }
                                        </select>
                                    </div> */}
                                    <div className="col-md-12">
                                        <h4>Material</h4>
                                        <select name="material" placeholder="Selecciona un material" className="form-control text-left" onChange={this.handelChange} style={{ textAlign: "center", height: 30, padding: 0 }}>
                                            <option value="">Selecciona un material</option>
                                            {materiales &&
                                                materiales.map(material => {
                                                    return <option value={material.Code} key={material.Code}>{material.Name}</option>
                                                })
                                            }
                                        </select>
                                    </div>
                                    {/* <div className="col-md-12">
                                        <h4>Nombre</h4>
                                        <input type="text" className="form-control" placeholder="Nombre(s)" name="nombre" onChange={this.handelChange} />
                                    </div> */}
                                    <div className="row">
                                        <div className="form-group col-md-12">
                                            <input type="submit" value="Buscar" className="btn mb-2 btn-block "
                                                style={{ fontsize: 25, background: '#0060aa', color: "white", marginTop: 15 }} />
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    };

    fillDataSearch = async () => {
        const { enableSpinner } = this.props;
        //Busqueda de valores para los desplegables
        enableSpinner(true);
        await apiClient.getFiltros().then(result => {
            this.setState({
                marcas: result.data.marcas || [],
                aparatos: result.data.aparatos || [],
                refacciones: result.data.refacciones || [],
                fabricantes: result.data.fabricantes || [],
                materiales: result.data.materiales || [],
            });
            setTimeout(() => {
                modal.searchModal('show');
            }, 300);

        });
        enableSpinner(false);

    };

    handelSubmit = async (e) => {
        //Prevenimos un recargo de pagina
        e.preventDefault();
        //Definimos las variables que estan en el state
        const { marca, aparato, refaccion, fabricante, material, nombre } = this.state;
        const { enableSpinner, setItemsSearch, configReducer: { history }, setItemsFilterSearch } = this.props;
        //Validamos que los campos esten llenos

        //Preparamos los datos para pasarlos al back
        let busqueda = {
            contenido: {
                marca: marca,
                aparato: aparato,
                refaccion: refaccion,
                fabricante: fabricante,
                material: material,
                nombre: nombre,
            }
        };
        //Hace la petición al back
        enableSpinner(true);
        // console.log("EGO =>",busqueda);
        await apiClient.searchAdvance(busqueda).then(result => {
            // console.log("EGO =>",result);
            modal.searchModal('hide');
            enableSpinner(false);
            setItemsSearch(result.data);
            setItemsFilterSearch(result.data);
            history.goItems();
            return;
        });
        //Validamos la respuesta del Back
    };

    renderClientOptionMenu = () => {
        const { configReducer, sessionReducer: { user }, isShowMarcas } = this.props;
        const { seller } = this.state;

        ////console.log(user);
        return (
            <ul className="navbar-nav mr-auto">
                {/* <li className="nav-item">
                    <a className="nav-link" style={{ color: config.navBar.textColor }}>
                        <i className={config.icons.user} style={{ color: config.navBar.iconColor }} aria-hidden="true" />
                        <strong><span style={{color: config.navBar.textColor2}}>{user.CardName}</span></strong>
                    </a>
                </li> */}
                <li className="nav-item" onClick={() => { configReducer.history.goProfile(); }}>
                    <a className="nav-link" style={{ color: config.navBar.textColor }}>
                        <strong><span style={{ color: config.navBar.textColor2 }}>{user.CardName}</span></strong>
                    </a>
                </li>
                {/* Información de la cuenta */}
                {!isShowMarcas &&
                    <li className="nav-item" onClick={() => this.openOrder()}>
                        <a className="nav-link" style={{ color: config.navBar.textColor2 }}>
                            <span style={{ color: config.navBar.textColor2 }}>Información de la cuenta</span>
                        </a>
                    </li>
                }
                {/* <li className="nav-item" onClick={() => { configReducer.history.goProfile(); }}>
                    <a className="nav-link" style={{ color: config.navBar.textColor }}>
                        <span style={{color: config.navBar.textColor2}}>Nivel: {this.nivel(user.listNum)}</span>
                    </a>
                </li> */}
                <li className="nav-item" onClick={() => { configReducer.history.goProfile(); }}>
                    <a className="nav-link" style={{ color: config.navBar.textColor }}>
                        <span style={{ color: config.navBar.textColor2 }}>Mi Perfil</span>
                    </a>
                </li>
                <li className="nav-item" onClick={() => { this.logOut(); }}>
                    <a className="nav-link" style={{ color: config.navBar.textColor }}>
                        <span style={{ color: config.navBar.textColor2 }}>Cerrar Sesión</span>
                    </a>
                </li>
                {seller ? seller.U_FMB_Handel_Perfil != '0' && seller.U_FMB_Handel_Perfil != 5 ?
                    <li className="nav-item" onClick={() => { configReducer.history.goSelectClient(); }}>
                        <a className="nav-link" style={{ color: config.navBar.textColor }}>
                            <span style={{ color: config.navBar.textColor2 }}>Mis clientes</span>
                        </a>
                    </li>
                    : "" : ""
                }
                {seller ? seller.U_FMB_Handel_Boletin === 1 &&
                    <li className="nav-item" onClick={() => { configReducer.history.goBoletin(); }}>
                        <a className="nav-link" style={{ color: config.navBar.textColor }}>
                            <span style={{ color: config.navBar.textColor2 }}>Ver correos del boletín</span>
                        </a>
                    </li>
                    : ""
                }

                {seller ? seller.U_FMB_Handel_Perfil != '0' && seller.U_FMB_Handel_Perfil != 5 && seller.U_FMB_Bonificaciones === "1" ?
                    <li className="nav-item" onClick={() => { configReducer.history.goPromocionales(); }}>
                        <a className="nav-link" style={{ color: config.navBar.textColor }}>
                            <span style={{ color: config.navBar.textColor2 }}>Promociones</span>
                        </a>
                    </li>
                    : "" : ""
                }

                {config.modules.subirArchivoExcel && seller ? seller.U_FMB_Handel_Perfil != 5 && Object.entries(user).length !== 0 ?
                    <li className="nav-item" onClick={() => { configReducer.history.goSubirArchivo(); }}>
                        <a className="nav-link" style={{ color: config.navBar.textColor }}>
                            <span style={{ color: config.navBar.textColor2 }}>Carga Masiva</span>
                        </a>
                    </li>
                    : "" : ""
                }

                {seller ? seller.U_FMB_Handel_Perfil != 5 && Object.entries(user).length !== 0 && user.CardCode !== 'C2029' && user.CardCode !== 'C4192' ?
                    <li className="nav-item" onClick={() => { configReducer.history.goReports(); }}>
                        <a className="nav-link" style={{ color: config.navBar.textColor }}>
                            <span style={{ color: config.navBar.textColor2 }}>Mis pedidos y Reportes</span>
                        </a>
                    </li>
                    : "" : ""
                }
                {seller ? seller.U_FMB_Handel_Perfil != 5 && Object.entries(user).length !== 0 ?
                    <li className="nav-item" onClick={() => { configReducer.history.goCardSaveds(); }}>
                        <a className="nav-link" style={{ color: config.navBar.textColor }}>
                            <span style={{ color: config.navBar.textColor2 }}>Carritos guardados</span>
                        </a>
                    </li>
                    : "" : ""
                }
                {seller ? seller.U_FMB_Handel_Perfil != 5 && Object.entries(user).length !== 0 ?
                    <li className="nav-item" onClick={() => { configReducer.history.goCardSaveds(); }}>
                        <span class="ml-4 mr-4 d-none d-xl-inline" style={{ color: "white", cursor: "pointer" }} onClick={() => { this.handleViews("favorites") }}>Mis Favoritos</span>
                        <span class="ml-4 mr-4 d-none d-lg-inline d-xl-none" style={{ color: "black", cursor: "pointer" }}>Favoritos</span>
                    </li>
                    : "" : ""
                }
                {/* {user.banners === "on" && */}
                {seller ? seller.U_FMB_Banner == 1 ?
                    <li className="nav-item">
                        <a className="nav-link" style={{ color: config.navBar.textColor2 }}>
                            <span>
                                <Link to='/adminBanners' className="dropdown-item" style={{ color: config.navBar.textColor2 }} >Adm. Banners</Link>
                            </span>
                        </a>
                    </li>
                    : "" : ""
                }
                {seller ? seller.U_FMB_Banner == 1 ?
                    <li className="nav-item">
                        <a className="nav-link" style={{ color: config.navBar.textColor2 }}>
                            <span>
                                <Link to='/adminCategorias' className="dropdown-item" style={{ color: config.navBar.textColor2 }} >Adm. Categorías</Link>
                            </span>
                        </a>
                    </li>
                    : "" : ""
                }
                {/* seller ? seller.U_FMB_AdmBlogNoticia == 1 ? */}
                {seller ? seller.U_FMB_AdmBlogNoticia == 1 ?
                    <li className="nav-item">
                        <a className="nav-link" style={{ color: config.navBar.textColor2 }}>
                            <span>
                                <Link to='/admiNewsBlog' className="dropdown-item" style={{ color: config.navBar.textColor2 }} >Adm. Blog de noticias</Link>
                            </span>
                        </a>
                    </li>
                    : "" : ""
                }

                {seller ? seller.U_FMB_Handel_Perfil === 5
                    ?
                    <li className="nav-item" onClick={() => { configReducer.history.goAutorizaciones(); }}>
                        <a className="nav-link" style={{ color: config.navBar.textColor2 }}>
                            <span style={{ color: config.navBar.textColor2 }}>Autorizaciones</span>

                        </a>
                    </li>
                    : "" : ""
                }

                {/* {seller ? seller.U_FMB_Handel_Perfil != 5 ?
                    <li className="nav-item" onClick={() => { configReducer.history.goProfile(); }}>
                        <a className="nav-link" style={{ color: config.navBar.textColor }}>
                            <span  style={{color: config.navBar.textColor2}}>Mi Perfil</span>
                        </a>
                    </li>
                    : "" : ""
                } */}
            </ul>
        )
    };

    renderSecondNavBar = () => {
        const { configReducer: { history }, sessionReducer: { user }, sessionReducer, isShowMarcas } = this.props;
        return (
            <div style={{ width: "100%", zIndex: 90, background: "transparent" }}>
                <div className="d-block d-lg-none" style={{ width: "100%", height: 30, background: config.navBar.backgroundColor }}>
                    <nav className="navbar navbar-expand-lg navbar-two" style={{ background: config.navBar.iconColor }}>
                        <NavBarButton iconColor={config.navBar.iconColor2} icon={config.icons.user} ruta={this.iconUser(user.listNum)} style={{ fontsize: 25 }} />
                        <div className="collapse navbar-collapse" id="navbarSupportedContent1">
                            {sessionReducer.role === ROLES.PUBLIC ? this.renderPublicOptionMenu() : this.renderClientOptionMenu()}
                            <ul className="navbar-nav mr-auto">
                                <li className="nav-link nav-item text-white" style={{ cursor: "pointer", color: config.navBar.iconColor2 }} onClick={() => this.handleRedPolarZone()}>AUSTROMEX </li>
                                <li className="nav-link nav-item text-white" style={{ cursor: "pointer", color: config.navBar.iconColor2 }} onClick={() => this.handleOutletZone()}>MAKITA</li>
                                <li className="nav-link nav-item text-white" style={{ cursor: "pointer", color: config.navBar.iconColor2 }} onClick={() => this.handleWhiteZone()}>FANDELI</li>
                                <li className="nav-link nav-item text-white" style={{ cursor: "pointer", color: config.navBar.iconColor2 }} onClick={() => this.handleMarvaFour()}>BYP</li>
                                <li className="nav-link nav-item text-white" style={{ cursor: "pointer", color: config.navBar.iconColor2 }} onClick={() => this.handleMarcaFive()}>HENKEL</li>
                                <li className="nav-link nav-item text-white" style={{ cursor: "pointer", color: config.navBar.iconColor2 }} onClick={() => this.openOrder()}>Información de su cuenta</li>


                                {config.modules.redZone &&
                                    <li className="nav-link nav-item text-white" style={{ cursor: "pointer", color: config.navBar.iconColor2 }} onClick={() => history.goRedZone()}>Zona de Recompensas</li>
                                }
                                {config.modules.redAliado &&
                                    <li className="nav-link nav-item text-white" style={{ cursor: "pointer", color: config.navBar.iconColor2 }} onClick={() => history.goRedAliado()}>Red Aliado</li>
                                }
                                {config.aboutUs.active &&
                                    <li className="nav-link nav-item text-white" style={{ cursor: "pointer" }} onClick={() => history.goAboutUs()}>
                                        <span> ¿Quiénes somos?</span>

                                    </li>}
                                {config.contactUs.active &&
                                    <li className="nav-link nav-item text-white" style={{ cursor: "pointer" }} onClick={() => history.goContactUs()}>
                                        <span> Contáctanos </span>
                                    </li>}
                                {config.questions.active &&
                                    <li className="nav-link" style={{ color: config.navBar.textColor, cursor: "pointer" }} onClick={() => history.goQuestions()}>
                                        <span> Preguntas frecuentes </span>
                                    </li>}
                                {config.claim.active &&
                                    <li className="nav-link" style={{ color: config.navBar.textColor, cursor: "pointer" }} onClick={() => history.goClaim()}>
                                        <span>Contáctanos</span>
                                    </li>}
                                {config.termPage.active &&
                                    <li className="nav-link" style={{ color: config.navBar.textColor, cursor: "pointer" }} onClick={() => history.goPolitics()}>
                                        <span> Términos de uso </span>
                                    </li>}

                                {/* <li className="nav-link nav-item text-white" style={{ color: config.navBar.textColor, cursor: "pointer" }} onClick={() => { this.logOut(); }}>
                                        <span>Cerrar Sesión</span>
                                    </li> */}
                            </ul>
                        </div>
                    </nav>
                </div>
                {isShowMarcas == undefined &&
                    <div className="d-12 d-none d-lg-flex" style={{ width: "100%", background: config.navBar.backgroundColor, height: 50 }}>
                        <nav className="navbar navbar-expand-md navbar-light navbar-two" style={{
                            width: "100%",
                            backgroundColor: "#fff"
                        }}>
                            <div className="d-none d-lg-block col-md-12">
                                <ul className="navbar-nav mr-auto justify-content-center menuImages">
                                    <li className="nav-link text-center col-2 imgCaterogies" style={{ color: config.navBar.textColor, cursor: "pointer" }} onClick={() => this.handleRedPolarZone()}>
                                        <img src={config.NavarIconos.iconOne} height='60px' className="Img-fluid"></img>
                                    </li>
                                    <li className="nav-link text-center col-2 imgCaterogies" style={{ color: config.navBar.textColor, cursor: "pointer" }} onClick={() => this.handleWhiteZone()}>
                                        <img src={config.NavarIconos.iconThree} height='60px' className="Img-fluid " ></img>
                                    </li>
                                    <li className="nav-link text-center col-2 imgCaterogies" style={{ color: config.navBar.textColor, cursor: "pointer" }} onClick={() => this.handleOutletZone()}>
                                        <img src={config.NavarIconos.iconTwo} height='60px' className="Img-fluid" ></img>
                                    </li>
                                    <li className="nav-link text-center col-2 imgCaterogies" style={{ color: config.navBar.textColor, cursor: "pointer" }} onClick={() => this.handleMarvaFour()}>
                                        <img src={config.NavarIconos.iconFive} height='60px' className="Img-fluid " ></img>
                                    </li>
                                    <li className="nav-link text-center col-2 imgCaterogies" style={{ color: config.navBar.textColor, cursor: "pointer" }} onClick={() => this.handleMarcaFive()}>
                                        <img src={config.NavarIconos.iconSix} height='60px' className="Img-fluid" ></img>
                                    </li>
                                    {/* Información de la cuenta */}
                                    <li className="nav-link text-center col-2 imgCaterogies" style={{ color: config.navBar.textColor, cursor: "pointer" }} onClick={() => this.openOrder()}>
                                        <img src={config.NavarIconos.iconFour} height='60px' className="Img-fluid" style={{ padding: 10 }} ></img>
                                    </li>
                                    {config.modules.redZone &&
                                        <li className="nav-link text-center col-2 imgCaterogies" style={{ color: config.navBar.textColor, cursor: "pointer" }} onClick={() => history.goRedZone()}>
                                            <img src={config.NavarIconos.iconFour} className="Img-fluid" ></img>
                                        </li>
                                    }
                                    {config.modules.redAliado &&
                                        <li className="nav-link text-center col-2 imgCaterogies" style={{ color: config.navBar.textColor, cursor: "pointer" }} onClick={() => history.goRedAliado()}>
                                            <img src={config.NavarIconos.iconFive} className="Img-fluid" ></img>
                                        </li>
                                    }
                                </ul>
                            </div>
                        </nav>
                    </div>
                }

            </div>
        );
    };

    openOrder = async () => {
        const { enableSpinner, notificationReducer: { showAlert },configReducer:{history} } = this.props;
        const { user } = this.state
        enableSpinner(true);

        if (user !== null) {
           history.goResumenCuenta()
        } else {
            showAlert({ type: 'warning', message: "No hay un cliente seleccionado" })
        }

        enableSpinner(false);
        return;
    };


    handleOutletZone = async () => {
        const { configReducer: { history } } = this.props;
        const { itemsReducer, setIdCategory, setLocation } = this.props;
        setIdCategory(null);
        setLocation('marcaThree');
        await itemsReducer.searchByKey(0, 'marcaThree', true);
    }

    handleWhiteZone = async () => {
        const { configReducer: { history } } = this.props;
        const { itemsReducer, setIdCategory, setLocation } = this.props;
        setIdCategory(null);
        setLocation('marcaTwo');
        await itemsReducer.searchByKey(0, 'marcaTwo', true);
    }

    handleRedPolarZone = async () => {
        const { configReducer: { history } } = this.props;
        const { itemsReducer, setIdCategory, setLocation } = this.props;
        setIdCategory(null);
        setLocation('marcaOne');
        await itemsReducer.searchByKey(0, 'marcaOne', true);
    }


    handleMarvaFour = async () => {
        const { itemsReducer, setIdCategory, setLocation } = this.props;
        setIdCategory(null);
        setLocation('marcaFour');
        await itemsReducer.searchByKey(0, 'marcaFour', true);
    }

    handleMarcaFive = async () => {
        const { itemsReducer, setIdCategory, setLocation } = this.props;
        setIdCategory(null);
        setLocation('marcaFive');
        await itemsReducer.searchByKey(0, 'marcaFive', true);
    }

    refresh = () => {
        const { shoppingCartReducer } = this.props;

        setTimeout(() => {
            if (shoppingCartReducer.items.length === 0) {
                $('.cont-cart').hide();
            } else {
                $('.cont-cart').show();
            }
        }, 50);
    }

    onTextChanged = async (e) => {
        const { setSearch } = this.props;
        let value = e.target.value;
        let inputSearch = document.getElementById("dropdownAutoComplete");
        let arrayValue = value.split("~");
        if (arrayValue.length === 3) {
            value = value.replace(/ ~ /g, ", ");
        }
        setSearch(value)
        inputSearch.value = value;
        this.setState(() => ({ text: value }));
        if (arrayValue.length === 3) {
            setTimeout(() => {
                this.search();
            }, 150)
        }
    }

    clearSeachBar = async (event) => {
        const { setSearch } = this.props;
        setSearch("");
        event.target.value = '';
        this.setState(() => ({ text: '' }));
    }

    handleViews = async (opcion, page = 0) => {
        const { itemsReducer, setIdCategory, setLocation, configReducer: { history } } = this.props;
        setIdCategory(null);
        setLocation(opcion);
        await itemsReducer.searchByKey(0, opcion, true);
        localStorage.setItem('searchFilter',opcion)
    }

    renderSubCategories = (category) => {
        let divSubCategories = document.getElementById('subMenuNivel2');
        let divSubFamilies = document.getElementById('subMenuNivel3');
        // console.log('job category', category)  // Prueba
        if (category.children.length > 0) {


            const listSubCategory = category.children.map((subCategory) =>
                <div>
                    <span
                        className='nav-link'
                        style={{ fontSize: "0.9rem" }}
                        onClick={() => this.subCategorySearch(category.category.code, "productos", subCategory.category.code)}
                        onMouseOver={() => this.renderSubFamilies(subCategory)}
                    >{subCategory.category.name}
                    </span>
                    <div class="dropdown-divider"></div>
                </div>
            );

            //#region 
            ReactDOM.render(
                <span>
                    <span style={{ textAlign: "center", fontSize: "0.9rem" }}><strong>Subcategorias de {category.category.name}</strong></span>
                    <br /><br />
                    <div className='designScroll' style={{ maxHeight: 305 }}>
                        {listSubCategory}
                    </div>
                </span>
                , divSubCategories
            );
            //#endregion
            divSubCategories.style.display = "block";
            divSubFamilies.style.display = "none";
        } else {
            divSubCategories.style.display = "none";
            divSubFamilies.style.display = "none";
        }
    };
    //#endregion ############## FIN REGION ##############

    // ############## REGION RENDER DE SUBFAMILIAS (NIVEL 3) ##############
    renderSubFamilies = (subCategory) => { // cambiar por subCategory
        let divSubFamilies = document.getElementById('subMenuNivel3');
        if (subCategory.children.length > 0) {
            // console.log('job subfamily', subCategory)
            const listSubCategory = subCategory.children.map((subFamily) =>
                <div>
                    <span
                        className='nav-link'
                        style={{ fontSize: "0.9rem" }}
                        onClick={() => this.subCategorySearch(subCategory.category.code, "productos2", subFamily.category.code)}
                    // onMouseOver = {() => this.renderSubFamilies(category)}
                    >{subFamily.category.name}
                    </span>
                    <div class="dropdown-divider"></div>
                </div>
            );

            ReactDOM.render(

                <span>
                    <span style={{ textAlign: "center", fontSize: "0.9rem" }}>Subcategorias de {subCategory.category.name}</span>
                    <br /><br />
                    <div className='designScroll' style={{ maxHeight: 270 }}>
                        {listSubCategory}
                    </div>
                </span>
                , divSubFamilies
            );
            divSubFamilies.style.display = "block";
        } else {
            divSubFamilies.style.display = "none";
        }
    };

    subCategorySearch = (valor, seccion, subCategory = null) => {
        const { setIdCategory, setLocation, itemsReducer: { searchByCategories }, setNextPage } = this.props;
        // console.log('job VALORVALORVALORVALOR', valor)
        setIdCategory(valor);
        setNextPage(0);
        setLocation('menuCategories');
        searchByCategories(valor, 0, seccion, subCategory);
    };
    handleInputChange = (event) => {
        let value = event.target.value;
        // console.log('-------------------------------------------------------------')
        // console.log(value)
        this.setState({ inputValue: value })
        this.setState({ showOptions: value !== "" })

        const { setSearch, itemsReducer } = this.props;
        let inputSearch = document.getElementById("dropdownAutoComplete");

        setSearch(value)
        inputSearch.value = value;
        let predictions = this.predict(value)
        this.setState(() => ({ text: value, predictions }));
        itemsReducer.search = value
    };

    // predict(input) {
    //     const { itemsReducer } = this.props
    //     input = input.toLowerCase();
    //     return itemsReducer.itemsAutoComplete
    //         .filter(record => record.ItemCode.toLowerCase().includes(input) || record.ItemName.toLowerCase().includes(input) || record.Marca.toLowerCase().includes(input))
    //         .slice(0, 15);
    // }
    
    predict(input) {
        const { itemsReducer } = this.props;
        input = input.toLowerCase();
        
        const filteredItems = itemsReducer.itemsAutoComplete.filter(record =>
            record.ItemCode.toLowerCase().includes(input) ||
            record.ItemName.toLowerCase().includes(input) ||
            record.Marca.toLowerCase().includes(input)
        );
    
        const sortedItems = filteredItems.sort((a, b) => {
            // if (a.Marca.toLowerCase().includes(input) && !b.Marca.toLowerCase().includes(input)) {
            //     return -1;
            // }
            // if (!a.Marca.toLowerCase().includes(input) && b.Marca.toLowerCase().includes(input)) {
            //     return 1;
            // }
            const aMarcaIndex = a.Marca.toLowerCase().indexOf(input);
            const bMarcaIndex = b.Marca.toLowerCase().indexOf(input);
            if (aMarcaIndex !== -1 && bMarcaIndex === -1) {
                return -1;
            } else if (aMarcaIndex === -1 && bMarcaIndex !== -1) {
                return 1;
            }
            // Si ambos tienen el SuppCatNum en el input, comparar la posición
            if (aMarcaIndex !== -1 && bMarcaIndex !== -1) {
                return aMarcaIndex - bMarcaIndex;
            }
            if (a.ItemName.toLowerCase().includes(input) && !b.ItemName.toLowerCase().includes(input)) {
                return -1;
            }
            if (!a.ItemName.toLowerCase().includes(input) && b.ItemName.toLowerCase().includes(input)) {
                return 1;
            }
            if (a.ItemCode.toLowerCase() === input && b.ItemCode.toLowerCase() !== input) {
                return -1;
            }
            if (a.ItemCode.toLowerCase() !== input && b.ItemCode.toLowerCase() === input) {
                return 1;
            }    
            return 0;
        });
        return sortedItems.slice(0, 30);
    }

    search = async () => {
        localStorage.removeItem('searchFilter')
        const { itemsReducer, setIdCategory, setLocation, setSearch, orden } = this.props;
        orden('')
        setIdCategory(null);
        setLocation('navBar');

        setSearch(this.state.inputValue)
        await itemsReducer.searchByKey(0, '', true);
        this.scrollToBottom();
        this.setState({ showOptions: false })

    };
    searchByText = (value) => {
        this.setState({ inputValue: value })
        this.setState({ showOptions: false })

        const { setSearch, itemsReducer } = this.props;
        let inputSearch = document.getElementById("dropdownAutoComplete");

        setSearch(value)
        inputSearch.value = value;
        this.setState(() => ({ text: value }));
        itemsReducer.search = value
        this.search()
    };

    render() {
        const { seller, predictions } = this.state;
        const { isShowMarcas,  itemsReducer, shoppingCartReducer, configReducer: { history, }, sessionReducer: { user, role }, sessionReducer, configReducer,itemsReducer:{categories}  } = this.props;
        // let suggestions = itemsReducer.itemsAutoComplete;
        const idCategoryFilter = [
            {
                Code: "01",
                Name: "CLEVELAND",
                subCategory: [
                    {
                        SubCatCode: "1003",
                        SubCatName: "HERRAMIENTAS MANUAL",
                        subFamily: [
                        ]
                    },
                ]
            },
            {
                Code: "02",
                Name: "AUSTROMEX",
                subCategory: [
                    {
                        SubCatCode: "0201",
                        SubCatName: "ABRASIVOS SOLIDOS",
                        subFamily: [

                        ]
                    },
                    {
                        SubCatCode: "0201",
                        SubCatName: "RUEDAS ABRASIVAS",
                        subFamily: [

                        ]
                    },
                ]
            },
            {
                Code: "03",
                Name: "MAKITA",
                subCategory: [
                    {
                        SubCatCode: "1003",
                        SubCatName: "HERRAMIENTAS",
                        subFamily: [

                        ]
                    },
                    {
                        SubCatCode: "1003",
                        SubCatName: "HERRAMIENTAS ELECTRICAS",
                        subFamily: [

                        ]
                    }
                ]
            },
            {
                Code: "01",
                Name: "FANDELI",
                subCategory: [
                    {
                        SubCatCode: "1003",
                        SubCatName: "PRODUCTOS DE LIJA",
                        subFamily: [

                        ]
                    },
                    {
                        SubCatCode: "1003",
                        SubCatName: "DISCO DE LIJA",
                        subFamily: [

                        ]
                    }
                ]
            },
        ]
        // let filteredOptions = suggestions.filter((item) => {
        //     return (item.ItemCode == this.state.inputValue) ? item.ItemCode == this.state.inputValue :
        //         item.ItemName.toLowerCase().includes(this.state.inputValue.toLowerCase())
        // })
        return (
            <div>
                {false ?
                    <>
                        <MenuCategories />
                        {/* <LoginRegisterModal /> */}
                        {/* <LoginModal /> */}
                        <ProfieldModel />
                        <SaveCartModal
                            SaveCart={this.SaveCart}
                            empleado={seller ? seller.U_FMB_Handel_Perfil : ''}
                        />
                        {this.searchModal()}
                        <div className="fixed-top" style={{ background: config.navBar.backgroundColor, zIndex: 1020 }}>
                            {this.renderFirstNavBar()}
                            {this.renderSecondNavBar()}
                        </div>
                    </>
                    :
                    <>
                        <MenuCategories />
                        {/* <LoginRegisterModal /> */}
                        {/* <LoginModal /> */}
                        <ProfieldModel />
                        <SaveCartModal
                            SaveCart={this.SaveCart}
                            empleado={seller ? seller.U_FMB_Handel_Perfil : ''}
                        />
                        {this.searchModal()}
                        <div className="fixed-top navbar-main-container" style={{ background: config.navBar.backgroundColor, zIndex: 1020, paddingRight: "0px !important" }}>
                            <div className='row align-items-center d-lg-none navbar-header-container'>
                                {sessionReducer.role === ROLES.PUBLIC ?
                                    <>
                                        <div className='col-3'>
                                            <img className='mt-4 ml-3 pr-3' src={config.navBar.blackMenuBurger} style={{ width: "40px", cursor: "pointer" }} data-target='#offCanvasCategories' onClick={''} data-toggle='modal' />
                                            <img className='mt-4 ml-3' src={config.navBar.menu} style={{ maxWidth: "25px", cursor: "pointer" }} data-toggle="modal" data-target="#offcanvasLeft" />
                                        </div>
                                    </>
                                    :
                                    <>
                                        {/* Content for roles other than public */}
                                        {seller && seller.U_FMB_Handel_Perfil !== 5 &&
                                            <div className='col-3'>
                                                <img className='mt-4 ml-3 pr-3' src={config.navBar.blackMenuBurger} style={{ width: "40px", cursor: "pointer" }} data-target='#offCanvasCategories' onClick={''} data-toggle='modal' />
                                                <img className='mt-4 ml-3' src={config.navBar.menu} style={{ maxWidth: "25px", cursor: "pointer" }} data-toggle="modal" data-target="#offcanvasLeft" />
                                            </div>
                                        }
                                    </>
                                }

                                <div className='col-4 d-flex justify-content-center'>
                                    <img className='mt-2' src={config.icons.diasaIcon} style={{ maxWidth: "110px", cursor: "pointer" }} onClick={() => history.goHome()} />
                                </div>
                                <div className='col-5 text-right'>
                                    <div className='d-inline-block mt-2'>
                                        <img className='mr-2' src={config.navBar.avatar} style={{ maxWidth: "30px", cursor: "pointer" }} data-toggle={sessionReducer.role === ROLES.PUBLIC ? "" : "modal"} data-target="#offcanvasRight" onClick={() => sessionReducer.role === ROLES.PUBLIC ? history.goLogin() : ""} />
                                    </div>
                                    {sessionReducer.role === ROLES.PUBLIC ?
                                        <>
                                            {/* Code to be executed if sessionReducer.role is equal to ROLES.PUBLIC */}
                                        </>
                                        :
                                        <>
                                            {/* Content for roles other than public */}
                                            {seller && seller.U_FMB_Handel_Perfil !== 5 &&
                                                <div className='d-inline-block mt-2' style={{ width: '33px', cursor: "pointer" }} onClick={() => history.goQuote()}>
                                                    <img className='mr-2' src={config.navBar.iconoCodigo} style={{ maxWidth: "30px" }} onClick={""} />
                                                </div>
                                            }
                                        </>
                                    }


                                    {sessionReducer.role === ROLES.PUBLIC ?
                                        <>
                                            <div className='d-inline-block mt-2 navbar-tool' style={{ position: 'relative' }}>
                                                <span class="cart-navbar-label">{shoppingCartReducer.items.length}</span>{this.refresh()}
                                                <img className='ml-2 mr-2' src={config.navBar.carrito} style={{ maxWidth: "35px", cursor: "pointer" }} onClick={() => history.goShoppingCart()} />
                                            </div>
                                        </>
                                        :
                                        <>
                                            {/* Content for roles other than public */}
                                            {seller && seller.U_FMB_Handel_Perfil !== 5 &&
                                                <div className='d-inline-block mt-2 navbar-tool' style={{ position: 'relative' }}>
                                                    <span class="cart-navbar-label">{shoppingCartReducer.items.length}</span>{this.refresh()}
                                                    <img className='ml-2 mr-2' src={config.navBar.carrito} style={{ maxWidth: "35px", cursor: "pointer" }} onClick={() => history.goShoppingCart()} />
                                                </div>
                                            }
                                        </>
                                    }

                                </div>
                            </div>
                            <div className='row'>
                                <div className='col-lg-2 d-none d-lg-flex justify-content-center align-items-left'>
                                    {sessionReducer.role === ROLES.PUBLIC ?(
                                         <img className='mt-2 mb-2' src={config.icons.diasaIcon} style={{ maxWidth: "190px", cursor: "pointer" }} onClick={() => history.goHome()} />
                                    ):
                                    seller && seller.U_FMB_Handel_Perfil !== 5 ? (

                                        <img className='mt-2 mb-2' src={config.icons.diasaIcon} style={{ maxWidth: "190px", cursor: "pointer" }} onClick={() => history.goHome()} />
                                    ) : 
                                        <img className='mt-2 mb-2' src={config.icons.diasaIcon} style={{ maxWidth: "190px" }} />
                                    }
                                </div>
                                {sessionReducer.role === ROLES.PUBLIC ?
                                    <>
                                        <div className='col-12 col-lg-4 d-flex justify-content-center align-items-center px-md-5 search-container'>
                                            <div className="input-group p-3 " style={{ borderRadius: "20px" }}>
                                                <input
                                                    onBlur={() => this.setState({ showOptions: false })}
                                                    style={{
                                                        background: "white",
                                                        borderTopLeftRadius: "20px",
                                                        borderBottomLeftRadius: "20px",
                                                        borderRight: "none",
                                                        outline: "none",
                                                        fontSize: "1rem",
                                                    }}
                                                    type="text"
                                                    className="form-control form-control-lg text-left font-weight-normal no-outline"
                                                    id="dropdownAutoComplete"
                                                    name="password"
                                                    placeholder="Hola, ¿cuál es el articulo que buscas?"
                                                    autoComplete={'off'}
                                                    onKeyDown={event => {
                                                        event.keyCode === 13 && this.search()
                                                    }}
                                                    value={this.state.inputValue}
                                                    onChange={this.handleInputChange}
                                                    list={itemsReducer.search.length > 2 && "suggestionList"}
                                                />

                                                {this.state.showOptions && predictions.length > 0 && (
                                                    <div className="custom-options" id="suggestionList">
                                                        <ul className="custom-options2">
                                                            {predictions && predictions.length > 0 && predictions.map((item) => {
                                                                // console.log('job', item)
                                                                return (
                                                                    <li
                                                                        className='datalist-item'
                                                                        onMouseDown={() => {
                                                                            this.searchByText(item.Marca + ', ' + item.ItemName)
                                                                            this.search()
                                                                        }}
                                                                    >
                                                                        <span>{item.Marca}</span>
                                                                        <span>{item.Linea ? item.Linea : ''}</span>
                                                                        <span>{item.ItemName.slice(0, 30)}</span>
                                                                        <span>{item.ItemCode}</span>
                                                                    </li>
                                                                )
                                                            }
                                                            )}
                                                        </ul>
                                                    </div>
                                                )}

                                                <div className="input-group-prepend">
                                                    <span className="input-group-text input-group-text-search pt-0 pb-0" style={{ background: "white", borderTopRightRadius: "20px", borderBottomRightRadius: "20px", borderLeft: "none", cursor: "pointer" }} onClick={this.search}>
                                                        <div style={{ borderRadius: "20px", width: "55px", height: "28px", background: "#FF9C00" }}>
                                                            <i class="fa fa-search p-2" style={{ fontSize: "18px", color: "white" }} aria-hidden="true" />
                                                        </div>
                                                    </span>
                                                </div>
                                            </div>
                                            <div className='menu-search-navbar justify-content-end align-items-center' style={{ width: '30px' }} data-target='#offcanvasBlack' onClick={''} data-toggle='modal'>
                                                <img src={config.navBar.blackBarIcon} style={{ maxWidth: "40px", cursor: "pointer" }} />
                                            </div>
                                        </div>
                                    </>
                                    :
                                    <>
                                        {/* Content for roles other than public */}
                                        {seller && seller.U_FMB_Handel_Perfil !== 5 &&
                                            <div className='col-12 col-lg-4 d-flex justify-content-center align-items-center px-md-5 search-container'>
                                                <div className="input-group p-3 " style={{ borderRadius: "20px" }}>
                                                    <input
                                                        onBlur={() => this.setState({ showOptions: false })}
                                                        style={{
                                                            background: "white",
                                                            borderTopLeftRadius: "20px",
                                                            borderBottomLeftRadius: "20px",
                                                            borderRight: "none",
                                                            outline: "none",
                                                            fontSize: "1rem",
                                                        }}
                                                        type="text"
                                                        className="form-control form-control-lg text-left font-weight-normal no-outline"
                                                        id="dropdownAutoComplete"
                                                        name="password"
                                                        placeholder="Hola, ¿cuál es el articulo que buscas?"
                                                        autoComplete={'off'}
                                                        onKeyDown={event => {
                                                            event.keyCode === 13 && this.search()
                                                        }}
                                                        value={this.state.inputValue}
                                                        onChange={this.handleInputChange}
                                                        list={itemsReducer.search.length > 2 && "suggestionList"}
                                                    />

                                                    {this.state.showOptions && predictions.length > 0 && (
                                                        <div className="custom-options" id="suggestionList">
                                                            <ul className="custom-options2">
                                                                {predictions && predictions.length > 0 && predictions.map((item) => {
                                                                    // console.log('job', item)
                                                                    return (
                                                                        <li
                                                                            className='datalist-item'
                                                                            onMouseDown={() => {
                                                                                this.searchByText(item.Marca + ', ' + item.ItemName)
                                                                                this.search()
                                                                            }}
                                                                        >
                                                                            <span>{item.Marca}</span>
                                                                            <span>{item.Linea ? item.Linea : ''}</span>
                                                                            <span>{item.ItemName}</span>
                                                                            <span>{item.ItemCode}</span>
                                                                        </li>
                                                                    )
                                                                }
                                                                )}
                                                            </ul>
                                                        </div>
                                                    )}

                                                    <div className="input-group-prepend">
                                                        <span className="input-group-text input-group-text-search pt-0 pb-0" style={{ background: "white", borderTopRightRadius: "20px", borderBottomRightRadius: "20px", borderLeft: "none", cursor: "pointer" }} onClick={this.search}>
                                                            <div style={{ borderRadius: "20px", width: "55px", height: "28px", background: "rgb(0, 96, 234)" }}>
                                                                <i class="fa fa-search p-2" style={{ fontSize: "18px", color: "white" }} aria-hidden="true" />
                                                            </div>
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className='menu-search-navbar justify-content-end align-items-center' style={{ width: '30px' }} data-target='#offcanvasBlack' onClick={''} data-toggle='modal'>
                                                    <img src={config.navBar.blackBarIcon} style={{ maxWidth: "40px", cursor: "pointer" }} />
                                                </div>
                                            </div>
                                        }
                                    </>
                                }

                                <div className='d-flex justify-content-between' style={{ marginTop: "15px", fontSize: "1rem" }}>
                                    <div data-toggle={sessionReducer.role === ROLES.PUBLIC ? "" : "dropdown"} onClick={() => sessionReducer.role === ROLES.PUBLIC ? history.goLogin() : ""}>

                                        {sessionReducer.role === ROLES.PUBLIC ?
                                            <>
                                                <img className='mr-xl-2 d-none d-xl-inline mr-md-4' src={config.navBar.avatar} style={{ maxWidth: "30px", cursor: "pointer" }} />
                                                <span className="mr-4 d-none d-xl-inline" style={{ color: "white", cursor: "pointer" }}>Inicio de sesión</span>
                                            </>
                                            :
                                            <>
                                                <div className="d-none d-md-block">
                                                    {this.renderName()}
                                                </div>

                                            </>

                                        }
                                    </div>
                                    <div className="dropdown-menu mt-4 menu-drop" aria-labelledby="dropdownMenuButton" style={{ borderRadius: '12px' }} >
                                        {/* <div className="dropdown-item item-menu menu-data">
                                            {seller && seller.firstName && seller.firstName != '' &&
                                                <>
                                                    <strong style={{ color: '#8f8f8f' }}>Vendedor: {seller.firstName} {seller.lastName} </strong>
                                                    <br />
                                                </>
                                            }
                                            <strong> {user.CardName}</strong>
                                        </div> */}
                                        {/* goMyProfile es el perfil de Pete, goProfile es de Missa */}
                                        {seller ? seller.U_FMB_Handel_Perfil != 5 && Object.entries(user).length !== 0 ?
                                            <a className="dropdown-item" onClick={() => { configReducer.history.goProfile(); }}> Mi Perfil</a>
                                            : "" : ""
                                        }
                                        {seller ? seller.U_FMB_Handel_Perfil != '0' && seller.U_FMB_Handel_Perfil != 5 ?
                                            <a className="dropdown-item" onClick={() => history.goSelectClient()}>Mis clientes</a>
                                            : "" : ""
                                        }
                                        {seller ? seller.U_FMB_Handel_Perfil != '0' && seller.U_FMB_Handel_Perfil != 5 && seller.U_FMB_Handel_Boletin === 1 ?
                                            <a className="dropdown-item" style={{ color: "#C55930 !important" }} onClick={() => { configReducer.history.goBoletin(); }}>Ver correos del boletín</a>
                                            : "" : ""
                                        }
                                        {/* {seller ? seller.U_FMB_Handel_Perfil != '0' && seller.U_FMB_Handel_Perfil != 5 ? 
                                            <a className="dropdown-item" onClick={() => { configReducer.history.goAnalytics(); }}>Analytics</a>
                                            : "" : ""
                                        } */}
                                        {seller ? seller.U_FMB_Handel_Perfil != '0' && seller.U_FMB_Handel_Perfil != 5 && seller.U_FMB_Bonificaciones === "1" ?
                                            <a className="dropdown-item" onClick={() => { configReducer.history.goPromocionales(); }}>Promociones</a>
                                            : "" : ""
                                        }
                                        {/* {Object.entries(user).length !== 0 && } */}
                                        {config.modules.subirArchivoExcel && seller ? seller.U_FMB_Handel_Perfil != 5 && Object.entries(user).length !== 0 ?
                                            <Link to='/subirArchivo' className="dropdown-item" >Carga Masiva</Link>
                                            : "" : ""
                                        }
                                        {seller ? seller.U_FMB_Handel_Perfil != 5 && Object.entries(user).length !== 0 && user.CardCode !== 'C2029' && user.CardCode !== 'C4192' ?
                                            <Link to='/reports' className="dropdown-item" >Mis Pedidos y Reportes</Link>
                                            : "" : ""
                                        }
                                        {seller ? seller.U_FMB_Handel_Perfil != '0' && seller.U_FMB_Handel_Perfil != 5 ?
                                            <a className="dropdown-item" onClick={() => { configReducer.history.goCardSaveds(); }}>Carritos guardados</a>
                                            : "" : ""
                                        }
                                        {seller ? seller.U_FMB_Handel_Perfil != '0' && seller.U_FMB_Handel_Perfil != 5 ?
                                            <a class="dropdown-item" style={{ color: "black", cursor: "pointer" }} onClick={() => { this.handleViews("favorites") }}>Mis Favoritos</a>
                                            : "" : ""
                                        }
                                        {/* <a className="dropdown-item" onClick={() => { configReducer.history.goOrders(); }}>Mis pedidos</a> */}
                                        {user.wishlist === 1 &&
                                            <a className="dropdown-item" onClick={() => { configReducer.history.goBackOrder(); }}>Lista de deseos</a>}
                                        {/* {user.U_FMB_Handel_Admin === '1' &&
                                            <a className="dropdown-item" onClick={() => { configReducer.history.goML(); }}>Admin ML</a>} */}
                                        {/* {user.banners === "on" && */}
                                        {seller ? seller.U_FMB_Banner == 1 ?
                                            <Link to='/adminBanners' className="dropdown-item" >Adm. Banners</Link>
                                            : "" : ""
                                        }
                                        {seller ? seller.U_FMB_Banner == 1 ?
                                            <Link to='/adminCategorias' className="dropdown-item" >Adm. Categorías</Link>
                                            : "" : ""
                                        }
                                        {/* seller ? seller.U_FMB_AdmBlogNoticia == 1 ? */}
                                        {seller ? seller.U_FMB_AdmBlogNoticia == 1 ?
                                            <Link to='/admiNewsBlog' className="dropdown-item" >Adm. Blog de noticias</Link>
                                            : "" : ""
                                        }
                                        {seller ? seller.U_FMB_Handel_Perfil === 5
                                            ?
                                            <a className="dropdown-item" onClick={() => { configReducer.history.goAutorizaciones(); }}>Autorizaciones</a>
                                            : "" : ""
                                        }
                                        {/* {seller ? seller.U_FMB_Handel_Perfil === 5
                                            ? 
                                            <a className="dropdown-item" onClick={() => {  this.logOut(); }}>Cerrar Sesión</a>
                                            : "" : ""
                                        } */}


                                        {/* Información de la cuenta */}
                                        {isShowMarcas != undefined && !isShowMarcas &&
                                            <a className="dropdown-item" onClick={() => { this.openOrder() }}>Información de la cuenta</a>
                                        }
                                        {/* 117 */}

                                        {/* <Link to='/reports' className="dropdown-item"  style={{ color: config.navBar.textColor }}>Mis reportes</Link> */}
                                        {user.banners === "on" &&
                                            <Link to='/adminBanners' className="dropdown-item" style={{ color: config.navBar.textColor }}>Adm. Banners</Link>
                                        }
                                        {user.banners === "on" &&
                                            <Link to='/adminCategorias' className="dropdown-item" style={{ color: config.navBar.textColor }}>Adm. Categorías</Link>
                                        }
                                        {user.U_FMB_Handel_Admin === '1' && config.modules.points &&
                                            <a className="dropdown-item" onClick={() => { configReducer.history.goResetPoints(); }}>Periodo de puntos</a>}
                                        {/* {user.U_FMB_Handel_Admin === '1' &&
                                            <a className="dropdown-item m-item" style={{ color: config.navBar.textColor }} onClick={() => { configReducer.history.goSpecialPrices(); }}>Precios especiales</a>} */}
                                        {/* <a className="dropdown-item" onClick={() => { configReducer.history.goProfile(); }}>Mi Perfil</a> */}


                                        {/* {seller ? seller.U_FMB_Handel_Perfil != 5 && Object.entries(user).length !== 0 ?
                                            <a className="dropdown-item" onClick={() => {  this.logOut(); }}>Cerrar Sesión</a>
                                            : "" : ""
                                        } */}

                                        {role != ROLES.PUBLIC ?
                                            <button className='btn-closed'>
                                                <a className="closed-item" style={{ color: 'white' }} onClick={() => { this.logOut(); }}>Cerrar Sesión</a>
                                            </button> : ""}
                                    </div>
                                    <div className='' onClick={() => history.goQuote()}>

                                        {sessionReducer.role === ROLES.PUBLIC ?
                                            <>
                                                {/* Content for public role (empty fragment) */}
                                            </>
                                            :
                                            <>
                                                {/* Content for roles other than public */}
                                                {seller && seller.U_FMB_Handel_Perfil !== 5 &&
                                                    <div className='d-flex flex-row mt-2 pr-2'>
                                                        <img className='iconCodigo mr-xl-2 mr-md-4' src={config.navBar.iconoCodigo} style={{ maxWidth: "25px", cursor: "pointer" }} />
                                                        <span className="nombre6 mr-4 d-none d-xl-inline" style={{ color: "black", cursor: "pointer" }}>Código</span>
                                                    </div>
                                                }
                                            </>
                                            

                                        }
                                    </div>
                                    {seller ? seller.U_FMB_Handel_Perfil !== 5 ?
                                        <div className={`d-${window.innerWidth <= 991 ? 'none' : 'flex-row mt-2 pr-2 pl-2'}`}>
                                            <span className='nombre3' style={{ color: "black", cursor: "pointer" }} onClick={() => history.goReports()}>Mis Pedidos</span>
                                        </div>
                                        : '' : ''}

                                    {sessionReducer.role === ROLES.PUBLIC ?
                                        <>
                                            <div className={`d-${window.innerWidth <= 991 ? 'none' : 'flex'}`}>
                                                <div className='position-relative'>
                                                    <span className="nombre4 position-absolute top-0 start-0 w-1 h-1 badge badge-dark shopping-cart-badge rounded-circle" style={{ left: '20px' }} >{shoppingCartReducer.items.length}</span>
                                                    {this.refresh()}
                                                    <img className='nombre5' src={config.navBar.carrito} style={{ maxWidth: "35px", cursor: "pointer" }} onClick={() => history.goShoppingCart()} />
                                                </div>
                                            </div>
                                        </>
                                        :
                                        <>
                                            {/* Content for roles other than public */}
                                            {seller && seller.U_FMB_Handel_Perfil !== 5 &&

                                                <div className={`d-${window.innerWidth <= 991 ? 'none' : 'flex'}`}>
                                                    <div className='position-relative'>
                                                        <span className="nombre4 position-absolute top-0 start-0 w-1 h-1 badge badge-dark shopping-cart-badge rounded-circle" style={{ left: '20px' }} >{shoppingCartReducer.items.length}</span>
                                                        {this.refresh()}
                                                        <img className='nombre5' src={config.navBar.carrito} style={{ maxWidth: "35px", cursor: "pointer" }} onClick={() => history.goShoppingCart()} />
                                                    </div>
                                                </div>
                                            }
                                        </>
                                    }

                                </div>
                            </div>
                            <div className='row  d-none d-lg-flex' style={{ height: "44px", fontSize: "1rem" }}>
                                <div className='col-12 d-lg-flex justify-content-center align-items-center' style={{ background: "#FF9C00", color: "white", }}>
                                    {sessionReducer.role === ROLES.PUBLIC ?
                                        <>
                                            <div className='d-inline-block'>
                                                {/* <img className='mr-4' alt='icono_categorias' src={config.navBar.menu} style={{ maxWidth: "20px", cursor: "pointer" }} /> */}
                                                <span className="" class="ml-4 mr-4" style={{ color: "white", cursor: "pointer" }} data-toggle="dropdown" >Categorías</span>
                                                <div className="dropdown-menu dropdown-menu_category m-drop" aria-labelledby="navbarDropdown">
                                                    {categories.length > 0 && <MenuNavbar />}
                                                </div>
                                            </div>
                                        </>
                                        :
                                        <>
                                            {/* Content for roles other than public */}
                                            {seller && seller.U_FMB_Handel_Perfil !== 5 &&
                                                <div className='d-inline-block'>
                                                    {/* <img className='mr-4' alt='icono_categorias' src={config.navBar.menu} style={{ maxWidth: "20px", cursor: "pointer" }} /> */}
                                                    <span className="" class="ml-4 mr-4" style={{ color: "white", cursor: "pointer" }} data-toggle="dropdown" >Categorías</span>
                                                    <div className="dropdown-menu dropdown-menu_category m-drop" aria-labelledby="navbarDropdown">
                                                        {categories.length > 0 && <MenuNavbar />}
                                                    </div>
                                                </div>
                                            }
                                        </>
                                    }
                                    {sessionReducer.role === ROLES.PUBLIC ?
                                        <>
                                            <div className='d-inline-block' >
                                                <span class="mr-4 d-none d-xl-inline" style={{ color: "white", cursor: "pointer" }} onMouseDown={() => history.goBrands()} >Marcas</span>
                                                <div className="dropdown-menu dropdown-menu_category" aria-labelledby="navbarDropdown" style={{ maxHeight: 365, width: "min-content", borderRadius: "10px", marginTop: "10px", boxShadow: " 0px 2px 10px rgba(49, 40, 40, 0.5)" }}>
                                                    {itemsReducer.tags.length > 0 &&
                                                        <div style={{ display: "flex" }}>
                                                            <div id="Drop-Familia" className='col-4' style={{ minWidth: 248 }}>
                                                                {/* <span style={{ textAlign: "center" }}><strong>CATEGORIAS</strong></span>
                                                    <br /><br /> */}
                                                                <div className='designScroll' style={{ maxHeight: 305, cursor: "pointer" }}>
                                                                    {itemsReducer.tags.length > 0 && itemsReducer.tags.map(category => {
                                                                        return (
                                                                            <div>
                                                                                <span
                                                                                    className='nav-link' /* Apply the nav-link class here */
                                                                                    style={{ fontSize: "0.9rem" }}
                                                                                    onClick={() => this.subCategorySearch(category.category.code, "productos")}
                                                                                    onMouseOver={() => this.renderSubCategories(category)}
                                                                                >{category.category.name}
                                                                                </span>
                                                                                <div class="dropdown-divider"></div>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </div>
                                                            <div id='subMenuNivel2' className='col-4' style={{ minWidth: 248, display: 'none', cursor: "pointer" }}>
                                                            </div>
                                                            <div id='subMenuNivel3' className='col-4' style={{ minWidth: 248, display: 'none', cursor: "pointer" }}>
                                                            </div>
                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                        </>
                                        :
                                        <>
                                            {/* Content for roles other than public */}
                                            {seller && seller.U_FMB_Handel_Perfil !== 5 &&
                                                <div className='d-inline-block' >
                                                    <span class="mr-4 d-none d-xl-inline" style={{ color: "white", cursor: "pointer" }} onMouseDown={() => history.goBrands()} >Marcas</span>
                                                    <div className="dropdown-menu dropdown-menu_category" aria-labelledby="navbarDropdown" style={{ maxHeight: 365, width: "min-content", borderRadius: "10px", marginTop: "10px", boxShadow: " 0px 2px 10px rgba(49, 40, 40, 0.5)" }}>
                                                        {itemsReducer.tags.length > 0 &&
                                                            <div style={{ display: "flex" }}>
                                                                <div id="Drop-Familia" className='col-4' style={{ minWidth: 248 }}>
                                                                    {/* <span style={{ textAlign: "center" }}><strong>CATEGORIAS</strong></span>
                                                    <br /><br /> */}
                                                                    <div className='designScroll' style={{ maxHeight: 305, cursor: "pointer" }}>
                                                                        {itemsReducer.tags.length > 0 && itemsReducer.tags.map(category => {
                                                                            return (
                                                                                <div>
                                                                                    <span
                                                                                        className='nav-link' /* Apply the nav-link class here */
                                                                                        style={{ fontSize: "0.9rem" }}
                                                                                        onClick={() => this.subCategorySearch(category.category.code, "productos")}
                                                                                        onMouseOver={() => this.renderSubCategories(category)}
                                                                                    >{category.category.name}
                                                                                    </span>
                                                                                    <div class="dropdown-divider"></div>
                                                                                </div>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                </div>
                                                                <div id='subMenuNivel2' className='col-4' style={{ minWidth: 248, display: 'none', cursor: "pointer" }}>
                                                                </div>
                                                                <div id='subMenuNivel3' className='col-4' style={{ minWidth: 248, display: 'none', cursor: "pointer" }}>
                                                                </div>
                                                            </div>
                                                        }
                                                    </div>
                                                </div>
                                            }
                                        </>
                                    }


                                    {sessionReducer.role === ROLES.PUBLIC ?
                                        <>
                                            <div className='d-inline-block'>
                                                <span class="ml-4 mr-4" style={{ color: "white", cursor: "pointer" }} onClick={() => { this.handleViews("promocion") }}>Promociones</span>
                                            </div>
                                        </>
                                        :
                                        <>
                                            {/* Content for roles other than public */}
                                            {seller && seller.U_FMB_Handel_Perfil !== 5 &&
                                                <div className='d-inline-block'>
                                                    <span class="ml-4 mr-4" style={{ color: "white", cursor: "pointer" }} onClick={() => { this.handleViews("promocion") }}>Promociones</span>
                                                </div>
                                            }
                                        </>
                                    }

                                    {sessionReducer.role === ROLES.PUBLIC ?
                                        <>
                                            <div className='d-inline-block'>
                                                <span class="ml-4 mr-4" style={{ color: "white", cursor: "pointer" }} onClick={() => { this.handleViews("masvendidos") }}>Más vendidos</span>
                                            </div>
                                        </>
                                        :
                                        <>
                                            {/* Content for roles other than public */}
                                            {seller && seller.U_FMB_Handel_Perfil !== 5 &&
                                                <div className='d-inline-block'>
                                                    <span class="ml-4 mr-4" style={{ color: "white", cursor: "pointer" }} onClick={() => { this.handleViews("masvendidos") }}>Más vendidos</span>
                                                </div>
                                            }
                                        </>
                                    }

                                    {sessionReducer.role === ROLES.PUBLIC ?
                                        <>
                                            <div className='d-inline-block'>
                                                <span class="ml-4 mr-4" style={{ color: "white", cursor: "pointer" }} onClick={() => { this.handleViews("nuevosproductos") }}>Nuevos</span>
                                            </div>
                                        </>
                                        :
                                        <>
                                            {/* Content for roles other than public */}
                                            {seller && seller.U_FMB_Handel_Perfil !== 5 &&
                                                <div className='d-inline-block'>
                                                    <span class="ml-4 mr-4" style={{ color: "white", cursor: "pointer" }} onClick={() => { this.handleViews("nuevosproductos") }}>Nuevos</span>
                                                </div>
                                            }
                                        </>
                                    }
                                    {sessionReducer.role === ROLES.PUBLIC ?
                                        <>
                                            <div className='d-inline-block'>
                                                <span class="ml-4 mr-4" style={{ color: "white", cursor: "pointer" }} onClick={() => { this.handleViews("lastProducts") }}>Últimas piezas</span>
                                            </div>
                                        </>
                                        :
                                        <>
                                            {/* Content for roles other than public */}
                                            {seller && seller.U_FMB_Handel_Perfil !== 5 &&
                                                <div className='d-inline-block'>
                                                    <span class="ml-4 mr-4" style={{ color: "white", cursor: "pointer" }} onClick={() => { this.handleViews("lastProducts") }}>Últimas piezas</span>
                                                </div>
                                            }
                                        </>
                                    }
                                    {sessionReducer.role === ROLES.PUBLIC ?
                                        <>
                                            <div className='d-inline-block'>
                                                <span class="ml-4 mr-4 d-none d-xl-inline" style={{ color: "white", cursor: "pointer" }} onClick={() => { this.handleViews("favorites") }}>Mis Favoritos</span>
                                                <span class="ml-4 mr-4 d-none d-lg-inline d-xl-none" style={{ color: "white", cursor: "pointer" }}>Favoritos</span>
                                            </div>
                                        </>
                                        :
                                        <>
                                            {/* Content for roles other than public */}
                                            {seller && seller.U_FMB_Handel_Perfil !== 5 &&
                                                <div className='d-inline-block'>
                                                    <span class="ml-4 mr-4 d-none d-xl-inline" style={{ color: "white", cursor: "pointer" }} onClick={() => { this.handleViews("favorites") }}>Mis Favoritos</span>
                                                    <span class="ml-4 mr-4 d-none d-lg-inline d-xl-none" style={{ color: "white", cursor: "pointer" }}>Favoritos</span>
                                                </div>
                                            }
                                        </>
                                    }
                                    {sessionReducer.role === ROLES.PUBLIC ?
                                        <>
                                            <div className='d-inline-block'>
                                                <span class="ml-4 mr-4 d-none d-xl-inline" style={{ color: "white", cursor: "pointer" }} onClick={() => { this.openOrder() }}>Resumen de cuenta</span>
                                                <span class="ml-4 mr-4 d-none d-lg-inline d-xl-none" style={{ color: "white", cursor: "pointer" }} onClick={() => { this.openOrder() }}>Resumen</span>
                                                {/* <a className="dropdown-item" onClick={() => { this.openOrder() }}>Información de la cuenta</a> */}
                                            </div>
                                        </>
                                        :
                                        <>
                                            {/* Content for roles other than public */}
                                            {seller && seller.U_FMB_Handel_Perfil !== 5 &&
                                                <div className='d-inline-block'>
                                                    <span class="ml-4 mr-4 d-none d-xl-inline" style={{ color: "white", cursor: "pointer" }} onClick={() => { this.openOrder() }}>Resumen de cuenta</span>
                                                    <span class="ml-4 mr-4 d-none d-lg-inline d-xl-none" style={{ color: "white", cursor: "pointer" }} onClick={() => { this.openOrder() }}>Resumen</span>
                                                    {/* <a className="dropdown-item" onClick={() => { this.openOrder() }}>Información de la cuenta</a> */}
                                                </div>
                                            }
                                        </>
                                    }
                                    {sessionReducer.role === ROLES.PUBLIC ?
                                        <>
                                            <div className='d-inline-block'>
                                                <span class="ml-4 d-none d-xl-inline" style={{ color: "white", cursor: "pointer" }} data-toggle="modal" data-target="#newDistributorModal">Quiero ser distribuidor</span>
                                                <span class="ml-4 d-none d-lg-inline d-xl-none" style={{ color: "white", cursor: "pointer" }} data-toggle="modal" data-target="#newDistributorModal">Ser distribuidor</span>
                                            </div>
                                        </>
                                        :
                                        <>
                                            {/* Content for roles other than public */}
                                            {seller && seller.U_FMB_Handel_Perfil !== 5 &&
                                                <div className='d-inline-block'>
                                                    <span class="ml-4 d-none d-xl-inline" style={{ color: "white", cursor: "pointer" }} data-toggle="modal" data-target="#newDistributorModal">Quiero ser distribuidor</span>
                                                    <span class="ml-4 d-none d-lg-inline d-xl-none" style={{ color: "white", cursor: "pointer" }} data-toggle="modal" data-target="#newDistributorModal">Ser distribuidor</span>
                                                </div>
                                            }
                                        </>
                                    }

                                </div>
                            </div>
                            <div class={"modal top fade"} id={"offcanvasRight"} tabindex="-1" role="dialog" aria-labelledby="offcanvas" data-backdrop={"false"}>

                                <div class="modal-dialog" role="document" style={{ position: "fixed", margin: "auto", maxWidth: "", height: "100%", right: 0, marginRight: "0px", marginTop: "130px" }}>
                                    <div class="modal-content" style={{ overflowY: "auto", paddingRight: "0px", borderRadius: '30px', margin: 'auto' }}>
                                        {/* <div id="navContact" class="row justify-content-end p-2" style={{backgroundColor: "rgb(49, 33, 100)", fontSize: "1.2rem"}}></div> */}
                                        <div class="modal-header-closed">
                                            <button type="button" class="close rounded-button" data-dismiss="modal" aria-label="Close">
                                                <span aria-hidden="true">×</span>
                                            </button>
                                        </div>
                                        <div className='ml-2 mb-2-responsive'>
                                            {seller && seller.firstName && seller.firstName != '' ?
                                                <>
                                                    <strong style={{ color: '#8f8f8f' }}>Vendedor: {seller.firstName} {seller.lastName} </strong>
                                                    <br />
                                                </>
                                                : ""
                                            }
                                            <strong> {user.CardName}</strong>
                                        </div>
                                        <div>
                                            <div className='scro-responsive'>
                                                {/* goMyProfile es el perfil de Pete, goProfile es de Missa */}
                                                {seller ? seller.U_FMB_Handel_Perfil != 5 && Object.entries(user).length !== 0 ?
                                                    <a className="dropdown-item mt-4" onClick={() => { configReducer.history.goProfile(); }}> Mi Perfil</a>
                                                    : "" : ""
                                                }
                                                {seller ? seller.U_FMB_Handel_Perfil != '0' && seller.U_FMB_Handel_Perfil != 5 ?
                                                    <a className="dropdown-item" onClick={() => history.goSelectClient()}>Mis clientes</a>
                                                    : "" : ""
                                                }
                                                {seller ? seller.U_FMB_Handel_Perfil != '0' && seller.U_FMB_Handel_Perfil != 5 && seller.U_FMB_Handel_Boletin === 1 ?
                                                    <a className="dropdown-item" style={{ color: "#C55930 !important" }} onClick={() => { configReducer.history.goBoletin(); }}>Ver correos del boletín</a>
                                                    : "" : ""
                                                }
                                                {/* {seller ? seller.U_FMB_Handel_Perfil != '0' && seller.U_FMB_Handel_Perfil != 5 ? 
                                            <a className="dropdown-item" onClick={() => { configReducer.history.goAnalytics(); }}>Analytics</a>
                                            : "" : ""
                                        } */}
                                                {seller ? seller.U_FMB_Handel_Perfil != '0' && seller.U_FMB_Handel_Perfil != 5 && seller.U_FMB_Bonificaciones === "1" ?
                                                    <a className="dropdown-item" onClick={() => { configReducer.history.goPromocionales(); }}>Promociones</a>
                                                    : "" : ""
                                                }
                                                {/* {Object.entries(user).length !== 0 && } */}
                                                {config.modules.subirArchivoExcel && seller ? seller.U_FMB_Handel_Perfil != 5 && Object.entries(user).length !== 0 ?
                                                    <Link to='/subirArchivo' className="dropdown-item" >Carga Masiva</Link>
                                                    : "" : ""
                                                }
                                                {seller ? seller.U_FMB_Handel_Perfil != 5 && Object.entries(user).length !== 0 && user.CardCode !== 'C2029' && user.CardCode !== 'C4192' ?
                                                    <Link to='/reports' className="dropdown-item" >Mis Pedidos y Reportes</Link>
                                                    : "" : ""
                                                }
                                                {seller ? seller.U_FMB_Handel_Perfil != '0' && seller.U_FMB_Handel_Perfil != 5 ?
                                                    <a className="dropdown-item" onClick={() => { configReducer.history.goCardSaveds(); }}>Carritos guardados</a>
                                                    : "" : ""
                                                }
                                                {seller ? seller.U_FMB_Handel_Perfil != '0' && seller.U_FMB_Handel_Perfil != 5 ?
                                                    <a class="dropdown-item" style={{ color: "black", cursor: "pointer" }} onClick={() => { this.handleViews("favorites") }}>Mis Favoritos</a>
                                                    : "" : ""
                                                }

                                                {/* <a className="dropdown-item" onClick={() => { configReducer.history.goOrders(); }}>Mis pedidos</a> */}
                                                {user.wishlist === 1 &&
                                                    <a className="dropdown-item" onClick={() => { configReducer.history.goBackOrder(); }}>Lista de deseos</a>}
                                                {/* {user.U_FMB_Handel_Admin === '1' &&
                                            <a className="dropdown-item" onClick={() => { configReducer.history.goML(); }}>Admin ML</a>} */}
                                                {/* {user.banners === "on" && */}
                                                {seller ? seller.U_FMB_Banner == 1 ?
                                                    <Link to='/adminBanners' className="dropdown-item" >Adm. Banners</Link>
                                                    : "" : ""
                                                }
                                                {seller ? seller.U_FMB_Banner == 1 ?
                                                    <Link to='/adminCategorias' className="dropdown-item" >Adm. Categorías</Link>
                                                    : "" : ""
                                                }
                                                {/* seller ? seller.U_FMB_AdmBlogNoticia == 1 ? */}
                                                {seller ? seller.U_FMB_AdmBlogNoticia == 1 ?
                                                    <Link to='/admiNewsBlog' className="dropdown-item" >Adm. Blog de noticias</Link>
                                                    : "" : ""
                                                }
                                                {seller ? seller.U_FMB_Handel_Perfil === 5
                                                    ?
                                                    <a className="dropdown-item" onClick={() => { configReducer.history.goAutorizaciones(); }}>Autorizaciones</a>
                                                    : "" : ""
                                                }
                                                {/* {seller ? seller.U_FMB_Handel_Perfil === 5
                                            ? 
                                            <a className="dropdown-item" onClick={() => {  this.logOut(); }}>Cerrar Sesión</a>
                                            : "" : ""
                                        } */}


                                                {/* Información de la cuenta */}
                                                {isShowMarcas != undefined && !isShowMarcas &&
                                                    <a className="dropdown-item" onClick={() => { this.openOrder() }}>Información de la cuenta</a>
                                                }
                                                {/* 117 */}

                                                {/* <Link to='/reports' className="dropdown-item"  style={{ color: config.navBar.textColor }}>Mis reportes</Link> */}
                                                {user.banners === "on" &&
                                                    <Link to='/adminBanners' className="dropdown-item" style={{ color: config.navBar.textColor }}>Adm. Banners</Link>
                                                }
                                                {user.banners === "on" &&
                                                    <Link to='/adminCategorias' className="dropdown-item" style={{ color: config.navBar.textColor }}>Adm. Categorías</Link>
                                                }
                                                {user.U_FMB_Handel_Admin === '1' && config.modules.points &&
                                                    <a className="dropdown-item" onClick={() => { configReducer.history.goResetPoints(); }}>Periodo de puntos</a>}
                                                {/* {user.U_FMB_Handel_Admin === '1' &&
                                            <a className="dropdown-item m-item" style={{ color: config.navBar.textColor }} onClick={() => { configReducer.history.goSpecialPrices(); }}>Precios especiales</a>} */}
                                                {/* <a className="dropdown-item" onClick={() => { configReducer.history.goProfile(); }}>Mi Perfil</a> */}


                                                {/* {seller ? seller.U_FMB_Handel_Perfil != 5 && Object.entries(user).length !== 0 ?
                                            <a className="dropdown-item" onClick={() => {  this.logOut(); }}>Cerrar Sesión</a>
                                            : "" : ""
                                        } */}

                                                {role != ROLES.PUBLIC ?
                                                    <button className='btn-closed'>
                                                        <a className="closed-item" style={{ color: 'white' }} onClick={() => { this.logOut(); }}>Cerrar Sesión</a>
                                                    </button> : ""}




                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class={"modal left fade"} id={"offcanvasLeft"} tabindex="-1" role="dialog" aria-labelledby="offcanvas" data-backdrop={"false"}>
                                <div class="modal-dialog" role="document" style={{ position: "fixed", margin: "auto", maxWidth: "", height: "100%", right: 0, marginRight: "0px", marginTop: "130px" }}>
                                    <div class="modal-content" style={{ overflowY: "auto", paddingRight: "0px", borderRadius: '30px', margin: 'auto' }}>
                                        {/* <div id="navContact" class="row justify-content-end p-2" style={{backgroundColor: "rgb(49, 33, 100)", fontSize: "1.2rem"}}></div> */}
                                        <div class="modal-header-closed">
                                            <button type="button" class="close rounded-button" data-dismiss="modal" aria-label="Close">
                                                <span aria-hidden="true">×</span>
                                            </button>
                                            <div className='ml-2 mb-2-responsive'>
                                            </div>
                                        </div>
                                        <div>
                                            <div className='scro-responsive'>
                                                {idCategoryFilter.length > 0 &&
                                                    <div style={{ display: "flex" }}>
                                                        <div id="Drop-Familia" className='col-4' style={{ minWidth: 248 }}>
                                                            {/* <span style={{ textAlign: "center" }}><strong>CATEGORIAS</strong></span>
                                                        <br /><br /> */}
                                                            <div className='designScroll' style={{ maxHeight: 305 }}>
                                                                {idCategoryFilter.length > 0 && idCategoryFilter.map(category => {
                                                                    return (
                                                                        <div>
                                                                            <span
                                                                                className='nav-link'
                                                                                style={{ fontSize: "0.9rem" }}
                                                                            // onClick={() => this.subCategorySearch(category.Code, "productos")}
                                                                            // onMouseOver={() => this.renderSubCategories(category)}
                                                                            >{category.Name}
                                                                            </span>
                                                                            <div class="dropdown-divider"></div>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                        <div id='subMenuNivel2' className='col-4' style={{ minWidth: 248, display: 'none' }}>
                                                        </div>
                                                        <div id='subMenuNivel3' className='col-4' style={{ minWidth: 248, display: 'none' }}>
                                                        </div>
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class={"modal top fade"} id={"offcanvasRight"} tabindex="-1" role="dialog" aria-labelledby="offcanvas" data-backdrop={"false"}>
                                <div class="modal-dialog" role="document" style={{ position: "fixed", margin: "auto", maxWidth: "", height: "100%", right: 0, marginRight: "0px", boxShadow: "0 3px 6px 1px var(--ck-color-shadow-drop-active)", marginTop: "130px", width: "100%" }}>
                                    <div class="modal-content" style={{ height: "45%", overflowY: "auto", paddingRight: "15px !important", borderRadius: 0, }}>
                                        {/* <div id="navContact" class="row justify-content-end p-2" style={{backgroundColor: "rgb(49, 33, 100)", fontSize: "1.2rem"}}></div> */}
                                        <div class="modal-header" style={{ borderBottom: "none" }}>
                                            <div className='ml-2 mb-2'>
                                                {seller && seller.firstName && seller.firstName != '' ?
                                                    <>
                                                        <strong style={{ color: '#8f8f8f' }}>Vendedor: {seller.firstName} {seller.lastName} </strong>
                                                        <br />
                                                    </>
                                                    : ""
                                                }
                                                <strong> {user.CardName}</strong>
                                            </div>
                                            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                                        </div>
                                        <div>
                                            <div className='scro-responsive scroll-responsiv'>
                                                {/* goMyProfile es el perfil de Pete, goProfile es de Missa */}
                                                {seller ? seller.U_FMB_Handel_Perfil != 5 && Object.entries(user).length !== 0 ?
                                                    <a className="dropdown-item mt-4" onClick={() => { configReducer.history.goProfile(); }}> Mi Perfil</a>
                                                    : "" : ""
                                                }
                                                {seller ? seller.U_FMB_Handel_Perfil != '0' && seller.U_FMB_Handel_Perfil != 5 ?
                                                    <a className="dropdown-item" onClick={() => history.goSelectClient()}>Mis clientes</a>
                                                    : "" : ""
                                                }
                                                {seller ? seller.U_FMB_Handel_Perfil != '0' && seller.U_FMB_Handel_Perfil != 5 && seller.U_FMB_Handel_Boletin === 1 ?
                                                    <a className="dropdown-item" style={{ color: "#C55930 !important" }} onClick={() => { configReducer.history.goBoletin(); }}>Ver correos del boletín</a>
                                                    : "" : ""
                                                }
                                                {/* {seller ? seller.U_FMB_Handel_Perfil != '0' && seller.U_FMB_Handel_Perfil != 5 ? 
                                            <a className="dropdown-item" onClick={() => { configReducer.history.goAnalytics(); }}>Analytics</a>
                                            : "" : ""
                                        } */}
                                                {seller ? seller.U_FMB_Handel_Perfil != '0' && seller.U_FMB_Handel_Perfil != 5 && seller.U_FMB_Bonificaciones === "1" ?
                                                    <a className="dropdown-item" onClick={() => { configReducer.history.goPromocionales(); }}>Promociones</a>
                                                    : "" : ""
                                                }
                                                {/* {Object.entries(user).length !== 0 && } */}
                                                {config.modules.subirArchivoExcel && seller ? seller.U_FMB_Handel_Perfil != 5 && Object.entries(user).length !== 0 ?
                                                    <Link to='/subirArchivo' className="dropdown-item" >Carga Masiva</Link>
                                                    : "" : ""
                                                }
                                                {seller ? seller.U_FMB_Handel_Perfil != 5 && Object.entries(user).length !== 0 && user.CardCode !== 'C2029' && user.CardCode !== 'C4192' ?
                                                    <Link to='/reports' className="dropdown-item" >Mis Pedidos y Reportes</Link>
                                                    : "" : ""
                                                }
                                                {seller ? seller.U_FMB_Handel_Perfil != '0' && seller.U_FMB_Handel_Perfil != 5 ?
                                                    <a className="dropdown-item" onClick={() => { configReducer.history.goCardSaveds(); }}>Carritos guardados</a>
                                                    : "" : ""
                                                }
                                                {seller ? seller.U_FMB_Handel_Perfil != '0' && seller.U_FMB_Handel_Perfil != 5 ?
                                                    <a class="dropdown-item" style={{ color: "black", cursor: "pointer" }} onClick={() => { this.handleViews("favorites") }}>Mis Favoritos</a>
                                                    : "" : ""
                                                }

                                                {/* <a className="dropdown-item" onClick={() => { configReducer.history.goOrders(); }}>Mis pedidos</a> */}
                                                {user.wishlist === 1 &&
                                                    <a className="dropdown-item" onClick={() => { configReducer.history.goBackOrder(); }}>Lista de deseos</a>}
                                                {/* {user.U_FMB_Handel_Admin === '1' &&
                                            <a className="dropdown-item" onClick={() => { configReducer.history.goML(); }}>Admin ML</a>} */}
                                                {/* {user.banners === "on" && */}
                                                {seller ? seller.U_FMB_Banner == 1 ?
                                                    <Link to='/adminBanners' className="dropdown-item" >Adm. Banners</Link>
                                                    : "" : ""
                                                }
                                                {seller ? seller.U_FMB_Banner == 1 ?
                                                    <Link to='/adminCategorias' className="dropdown-item" >Adm. Categorías</Link>
                                                    : "" : ""
                                                }
                                                {/* seller ? seller.U_FMB_AdmBlogNoticia == 1 ? */}
                                                {seller ? seller.U_FMB_AdmBlogNoticia == 1 ?
                                                    <Link to='/admiNewsBlog' className="dropdown-item" >Adm. Blog de noticias</Link>
                                                    : "" : ""
                                                }
                                                {seller ? seller.U_FMB_Handel_Perfil === 5
                                                    ?
                                                    <a className="dropdown-item" onClick={() => { configReducer.history.goAutorizaciones(); }}>Autorizaciones</a>
                                                    : "" : ""
                                                }
                                                {/* {seller ? seller.U_FMB_Handel_Perfil === 5
                                            ? 
                                            <a className="dropdown-item" onClick={() => {  this.logOut(); }}>Cerrar Sesión</a>
                                            : "" : ""
                                        } */}


                                                {/* Información de la cuenta */}
                                                {isShowMarcas != undefined && !isShowMarcas &&
                                                    <a className="dropdown-item" onClick={() => { this.openOrder() }}>Información de la cuenta</a>
                                                }
                                                {/* 117 */}

                                                {/* <Link to='/reports' className="dropdown-item"  style={{ color: config.navBar.textColor }}>Mis reportes</Link> */}
                                                {user.banners === "on" &&
                                                    <Link to='/adminBanners' className="dropdown-item" style={{ color: config.navBar.textColor }}>Adm. Banners</Link>
                                                }
                                                {user.banners === "on" &&
                                                    <Link to='/adminCategorias' className="dropdown-item" style={{ color: config.navBar.textColor }}>Adm. Categorías</Link>
                                                }
                                                {user.U_FMB_Handel_Admin === '1' && config.modules.points &&
                                                    <a className="dropdown-item" onClick={() => { configReducer.history.goResetPoints(); }}>Periodo de puntos</a>}
                                                {/* {user.U_FMB_Handel_Admin === '1' &&
                                            <a className="dropdown-item m-item" style={{ color: config.navBar.textColor }} onClick={() => { configReducer.history.goSpecialPrices(); }}>Precios especiales</a>} */}
                                                {/* <a className="dropdown-item" onClick={() => { configReducer.history.goProfile(); }}>Mi Perfil</a> */}


                                                {/* {seller ? seller.U_FMB_Handel_Perfil != 5 && Object.entries(user).length !== 0 ?
                                            <a className="dropdown-item" onClick={() => {  this.logOut(); }}>Cerrar Sesión</a>
                                            : "" : ""
                                        } */}
                                                <div class="dropdown-divider"></div>
                                                {role != ROLES.PUBLIC ? <a className="dropdown-item" onClick={() => { this.logOut(); }}>Cerrar Sesión</a> : ""}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* <SideBar
                                title={""} 
                                modalType={" right fade"}
                                id={"offcanvasRight"}
                                backdrop={"false"}
                                marginTop={"130px"}
                                width={"100%"}
                                maxWidth={""}
                                marginRight={"0px"}
                            /> */}
                            {/* <SideBar
                                title={""} 
                                modalType={" left fade"}
                                id={"offcanvasLeft"}
                                backdrop={"false"}
                                marginTop={"130px"}
                                width={"100%"}
                                maxWidth={""}
                                marginRight={"0px"}
                            /> */}

                            <div class={"modal top fade"} id={"offcanvasBlack"} tabindex="-1" role="dialog" aria-labelledby="offcanvas" data-backdrop={"false"}>
                                <div class="modal-dialog black-bar-responsive" role="document" style={{ position: "fixed", margin: "auto", maxWidth: "", height: "100%", right: 0, marginRight: "0px", boxShadow: "0 3px 6px 1px var(--ck-color-shadow-drop-active)", marginTop: "130px", width: "100%" }}>
                                    <div class="modal-content" style={{ height: "100%", overflowY: "auto", paddingRight: "15px", borderRadius: 0, }}>
                                        <div class="modal-header-close black-bar-header">
                                            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                                        </div>
                                        <div class="black-bar-responsive-list">
                                            <span data-dismiss="modal" onClick={() => { history.goBrands("marcas") }}>Marcas</span>
                                            <span data-dismiss="modal" onClick={() => { this.handleViews("promocion") }}>Promociones</span>
                                            <span data-dismiss="modal" onClick={() => { this.handleViews("masvendidos") }}>Más vendidos</span>
                                            <span data-dismiss="modal" onClick={() => { this.handleViews("nuevosproductos") }}>Nuevos</span>
                                            <span data-dismiss="modal" onClick={() => { this.handleViews("lastProducts") }}>Últimas piezas</span>
                                            <span data-dismiss="modal" onClick={() => { this.handleViews("favorites") }}>Mis favoritos</span>
                                            <span data-dismiss="modal" onClick={() => { this.openOrder() }}>Resumen de cuenta</span>
                                            <span data-dismiss="modal" data-toggle="modal" data-target="#newDistributorModal">Quiero ser distribuidor</span>
                                        </div>

                                    </div>
                                </div>
                            </div>
                            <CategoriesMenu />
                        </div>
                        <NewDistributor />
                    </>
                }
            </div>
        );
    }
}

const mapStateToProps = store => {
    return {
        itemsReducer: store.ItemsReducer,
        sessionReducer: store.SessionReducer,
        configReducer: store.ConfigReducer,
        shoppingCartReducer: store.ShoppingCartReducer,
        notificationReducer: store.NotificationReducer,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        enableSpinner: value => dispatch({ type: DISPATCH_ID.CONFIG_SET_SPINNER, value }),
        setItemsSearch: value => dispatch({ type: DISPATCH_ID.ITEMS_SET_ITEMS, value }),
        setItemsFilterSearch: value => dispatch({ type: DISPATCH_ID.ITEMS_SAVE_ITEMS_FILTER, value }),
        setSearch: value => dispatch({ type: DISPATCH_ID.ITEMS_SET_SEARCH, value }),
        setRole: value => dispatch({ type: DISPATCH_ID.SESSION_SET_ROLE, value }),
        addNotificationReference: value => dispatch({ type: DISPATCH_ID.NOTIFICATION_SET_ALERT_REFERENCE, value }),
        setBusiness: value => dispatch({ type: DISPATCH_ID.SESSION_SET_BUSINESS_ID, value }),
        setToken: value => dispatch({ type: DISPATCH_ID.SESSION_SET_TOKEN, value }),
        setUser: value => dispatch({ type: DISPATCH_ID.SESSION_SET_USER, value }),
        setRememberUser: value => dispatch({ type: DISPATCH_ID.SESSION_SET_REMEMBER_USER, value }),
        setLogOutReference: value => dispatch({ type: DISPATCH_ID.CONFIG_SET_LOG_OUT_REFERENCE, value }),
        setIdCategory: value => dispatch({ type: DISPATCH_ID.ITEMS_SET_IDCATEGORY, value }),
        setNextPage: value => dispatch({ type: DISPATCH_ID.ITEMS_SET_NEXTPAGE, value }),
        setLocation: value => dispatch({ type: DISPATCH_ID.ITEMS_SET_LOCATION, value }),
        orden: value => dispatch({ type: DISPATCH_ID.ITEMS_SET_SORT_FILTER, value }),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(NavBar);
