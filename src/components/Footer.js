import React, { Component } from 'react';
import { config, DISPATCH_ID, SERVICE_API } from '../libs/utils/Const';
import { connect } from "react-redux";
import packageJson from '../../package.json';
import './Footer.css';
global.appVersion = packageJson.version;

class Footer extends Component {
    getYear = () => {
        let today = new Date();
        return today.getFullYear() || '';
    };

    render() {
        const { configReducer: { history } } = this.props;
        return (
            <footer className="page-footer font-small pt-4" style={{ backgroundColor: config.footer.backgroundColor }}>
                {false ?
                    <div className="text-center text-md-left" style={{ marginRight: 20 }}>
                        <div className="row">
                            {/* Logo de FMB */}
                            <div className="col-md-3 text-center p-0">
                                <a href="http://fmbsolutions.mx/" target="_blank">
                                    <img src={config.footer.iconfmb} className="img-fluid" width='180px' style={{ marginRight: '4rem', maxWidth: '80%' }} />
                                </a>
                            </div>
                            <hr className="clearfix w-100 d-md-none" />
                            {/* Información de la empresa */}
                            <div className="col-md-1 p-0">
                                <h5 className="font-weight-bold text-uppercase mb-4" style={{ color: 'white' }}>Empresa</h5>
                                <p>
                                    <a>
                                        <span style={{ color: config.footer.textColor }} onClick={() => history.goAboutUs()}> Nosotros </span>
                                    </a>
                                </p>
                                <p>
                                    <a>
                                        <span style={{ color: config.footer.textColor }} onClick={() => history.goQuestions()}> Preguntas frecuentes</span>
                                    </a>
                                </p>
                                <p>
                                    <a>
                                        <span style={{ color: config.footer.textColor }} onClick={() => history.goContactUs()}> Contacto </span>
                                    </a>
                                </p>
                                {config.modules.BolsaTrabajo &&
                                    <p>
                                        <a>
                                            <span style={{ color: config.footer.textColor }} onClick={() => history.goJob()}> Bolsa de trabajo </span>
                                        </a>
                                    </p>
                                }
                                {config.modules.Devoluciones &&
                                    <p>
                                        <a>
                                            <span style={{ color: config.footer.textColor }} onClick={() => history.goDevolution()}> Devoluciones </span>
                                        </a>
                                    </p>
                                }
                                <p>
                                    <a>
                                        <span style={{ color: config.footer.textColor }} onClick={() => history.goNewsBlog()}> Blog de noticias </span>
                                    </a>
                                </p>
                                <p>
                                    <a>
                                        <span style={{ color: config.footer.textColor }} onClick={() => history.goAboutRedZone()}> Cliente preferente </span>
                                    </a>
                                </p>
                                <p>
                                    <a>
                                        <span style={{ color: config.footer.textColor }} onClick={() => history.goGetPlantilla()}> Descargar plantilla </span>
                                    </a>
                                </p>
                            </div>
                            <hr className="clearfix w-100 d-md-none" />
                            {/* Logo de la empresa */}
                            <div className="col-md-4 text-center p-0">
                                <a href="https://diasa.net/" target="_blank">
                                    <img src={config.footer.icon} className="img-fluid" width='200px' />
                                </a>
                                <p>
                                    {config.footer.socialMedia2.map((red, index) => {
                                        return (red.visibility &&
                                            <a className="btn btn-floating m-1" href={red.linkref} target="_black" key={index}>
                                                <img className="img-fluid" width='30px' src={red.icon} />
                                            </a>
                                        )
                                    })}
                                </p>
                            </div>
                            <hr className="clearfix w-100 d-md-none" />
                            {/* Información legal */}
                            <div className="col-md-2 p-0">
                                <h5 className="font-weight-bold text-uppercase mb-4" style={{ color: 'white' }}>Legales</h5>
                                {config.pdf.VERterminosCondiciones &&
                                    <p>
                                        <a href={`${config.BASE_URL}/${SERVICE_API.getPolitics}/${config.pdf.terminosCondiciones}`} target="_blank" >
                                            <span style={{ color: config.footer.textColor }}>Términos y condiciones </span>
                                        </a>
                                    </p>
                                }
                                {config.pdf.VERpoliticasVentas &&
                                    <p>
                                        <a href={`${config.BASE_URL}/${SERVICE_API.getPolitics}/${config.pdf.politicasEnviosGarantias}`} target="_blank" >
                                            <span style={{ color: config.footer.textColor }}>Políticas de envíos y garantías </span>
                                        </a>
                                    </p>
                                }
                                {config.pdf.VERpoliticasGarantia &&
                                    <p>
                                        <a href={`${config.BASE_URL}/${SERVICE_API.getPolitics}/${config.pdf.politicasGarantia}`} target="_blank" >
                                            <span style={{ color: config.footer.textColor }}> Políticas de garantía </span>
                                        </a>
                                    </p>
                                }
                                {config.pdf.VERpoliticasUsoAvisoPrivacidad &&
                                    <p>
                                        <a onClick={() => history.goPrivacy()}>
                                            <span style={{ color: config.footer.textColor }} > Políticas de uso y aviso de privacidad </span>
                                        </a>
                                    </p>
                                }
                            </div>
                            <hr className="clearfix w-100 d-md-none" />
                            {/* Ubicaccion de la empresa */}
                            <div className="col-md-2 p-0">
                                <h5 className="font-weight-bold text-uppercase mb-4" style={{ color: 'white' }}>Contacto</h5>
                                <p>
                                    <a>
                                        <img className="img-fluid" width='6%' height='6%' src={config.footer.info.hoursIcon} style={{ color: config.footer.iconColor, padding: 1 }}></img>&nbsp;
                                        <span style={{ color: config.footer.textColor }}>{config.footer.info.hours}</span>
                                    </a>
                                </p>
                                <p>
                                    <a>
                                        <img className="img-fluid" width='6%' height='6%' src={config.footer.info.phoneIcon} style={{ color: config.footer.iconColor, padding: 1 }}></img>&nbsp;
                                        <span style={{ color: config.footer.textColor }}>{config.footer.info.phone}</span>
                                    </a>
                                </p>
                                <p>
                                    <a href={"mailto:" + config.footer.info.email}>
                                        <img className="img-fluid" width='6%' height='6%' src={config.footer.info.emailIcon} style={{ color: config.footer.iconColor, padding: 1 }}></img>&nbsp;
                                        <span style={{ color: config.footer.textColor }}>{config.footer.info.email}</span>
                                    </a>
                                </p>
                            </div>
                            <hr className="clearfix w-100 d-md-none" />
                        </div>
                    </div>
                    :
                    <>
                        <div className='row footer-main-container'>
                            <div className='col-3 d-none d-md-block mb-5 text-left' style={{ color: "white" }}>
                                <div className='text-center'>
                                    <img className='mb-4' src={config.footer.icon} style={{ maxWidth: "150px" }} />
                                    <a className='mb-3' href={"mailto:" + config.footer.info.email} style={{ textDecoration: "none", color: 'white' }}>
                                        <img className='mr-1' src={config.footer.info.emailIcon} style={{ maxWidth: "20px" }} />
                                        ventas@diasa.net
                                    </a>
                                    <label>
                                        <img className='mr-1' src={config.footer.info.phoneIcon} style={{ maxWidth: "20px" }} />
                                        (81) 1253 3080
                                    </label>
                                </div>
                                <div className="text-center">
                                    <img className="footer-section fmb-footer-icon" src={config.footer.iconfmb} style={{ maxWidth: "100px" }}/>
                                </div>
                            </div>
                            <div className='col-2 d-none d-md-block mt-4 mb-5' style={{ color: "white" }}>
                                <h3>Empresa</h3><br />
                                <label onClick={() => history.goAboutUs()}>Quienes somos</label><br />
                                <label onClick={() => history.goNewsBlog()}>Blogs y notas</label><br />
                                <label onClick={() => history.goContactUs()}>Contactános</label><br />
                            </div>
                            <div className='col-3 d-none d-md-block mt-4 mb-5' style={{ color: "white" }}>
                                <h3>Podemos ayudarte</h3><br />
                                <label onClick={() => history.goAboutRedZone()}>Cliente preferente</label><br />
                                {/* <label>Academia y tutoriales</label><br/> */}
                                <label onClick={() => history.goReports()}>Mis pedidos</label><br />
                                <label onClick={() => history.goGetPlantilla()}>Pedidos en carga masiva</label><br />
                                <label onClick={() => history.goQuestions()}>Preguntas frecuentes</label><br />
                                {/* <label onClick={() => history.goDevolution()}>Reportar un pedido</label><br /> */}
                                <a href={`${config.BASE_URL}/${SERVICE_API.getPolitics}/${config.pdf.Catalogo}`} style={{ textDecoration: "none", color: 'white' }}>Cátalogo</a><br />
                            </div>
                            <div className='col-3 d-none d-md-block mt-4 mb-5' style={{ color: "white" }}>
                                <h3>Legales</h3><br />
                                <a href={`${config.BASE_URL}/${SERVICE_API.getPolitics}/${config.pdf.terminosCondiciones}`} style={{ textDecoration: "none", color: 'white', marginBottom: "5px" }}>Términos y condiciones</a>
                                {/* <a href={`${config.BASE_URL}/${SERVICE_API.getPolitics}/${config.pdf.politicasEnviosGarantias}`} style={{ textDecoration: "none", color: 'white' }}>Politicas de uso y privacidad</a><br /> */}
                                <div className='d-flex' style={{ alignItems: "flex-end" }}>
                                    {config.footer.socialMedia2.map((red, index) => {
                                        return (red.visibility &&
                                            <a href={red.linkref} key={index} target="_blank" rel='noopener noreferrer'>
                                                <img className='mr-1 ml-1' src={red.icon} style={{ maxWidth: red.size }} />
                                            </a>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className='container'>
                            <div className='row'>
                                <div className='d-md-none d-flex ' style={{ justifyContent: "center", color: "white", fontSize: '12px' }}>
                                <img className="footer-section diasa-footer-icon" src={config.footer.icon} style={{ maxWidth: "130px" }}/>
                                </div>
                            </div>
                            <div id="accordion" className='pl-4 pr-4 pb-5 pt-3 d-md-none' >
                                <div className="card menuFooter" >
                                    <div className="card-header collapsed" style={{ marginLeft: '-1rem' }} id="headingOne" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                    Empresa
                                    </div>
                                    <div style={{ background: "grey", height: "1px", width: '100%' }}></div>
                                    <div id="collapseOne" className="collapse" aria-labelledby="headingOne" data-parent="#accordion">
                                        <div className="card-body">
                                            <label onClick={() => history.goAboutUs()}>Quienes somos</label><br />
                                            <label onClick={() => history.goNewsBlog()}>Blogs y notas</label><br />
                                            <label onClick={() => history.goContactUs()}>Contactános</label><br />
                                        </div>
                                    </div>
                                </div>
                                <div className="card menuFooter">
                                    <div className="card-header collapsed" style={{ marginLeft: '-1rem' }} id="headingTwo" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo" >
                                        Podemos ayudarte
                                    </div>
                                    <div style={{ background: "grey", height: "1px", width: '100%' }}></div>
                                    <div id="collapseTwo" className="collapse" aria-labelledby="headingTwo" data-parent="#accordion">
                                        <div className="card-body">
                                            <label onClick={() => history.goAboutRedZone()}>Quiero ser distribuidor</label><br />
                                            {/* <label>Academia y tutoriales</label><br/> */}
                                            <label onClick={() => history.goReports()}>Mis pedidos</label><br />
                                            <label onClick={() => history.goGetPlantilla()}>Pedidos en carga masiva</label><br />
                                            <label onClick={() => history.goQuestions()}>Preguntas frecuentes</label><br />
                                            {/* <label onClick={() => history.goDevolution()}>Reportar un pedido</label><br /> */}
                                            <a href={`${config.BASE_URL}/${SERVICE_API.getPolitics}/${config.pdf.Catalogo}`} style={{ textDecoration: "none", color: 'white' }}>Catalogo</a><br />
                                        </div>
                                    </div>
                                </div>
                                <div className="card menuFooter">
                                    <div className="card-header collapsed" style={{ marginLeft: '-1rem' }} id="headingThree" data-toggle="collapse" data-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                        Legales
                                    </div>
                                    <div style={{ background: "grey", height: "1px", width: '100%' }}></div>
                                    <div id="collapseThree" className="collapse" aria-labelledby="headingThree" data-parent="#accordion">
                                        <div className="card-body">
                                            <a href={`${config.BASE_URL}/${SERVICE_API.getPolitics}/${config.pdf.terminosCondiciones}`} style={{ textDecoration: "none", color: 'white' }}>Términos y condiciones</a><br />
                                            {/* <a href={`${config.BASE_URL}/${SERVICE_API.getPolitics}/${config.pdf.politicasEnviosGarantias}`} style={{ textDecoration: "none", color: 'white' }}>Politicas de uso y privacidad</a><br /> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='row pl-5 pr-5 pb-5 d-md-none' style={{ color: "white", fontSize: '12px' }}>
                                <div className='d-flex' style={{ alignItems: "flex-end" }}>
                                    {config.footer.socialMedia2.map((red, index) => {
                                        return (red.visibility &&
                                            <a href={red.linkref} key={index}>
                                                <img className='mr-1 ml-1' src={red.icon} style={{ maxWidth: red.size }} />
                                            </a>
                                        )
                                    })}
                                </div>
                            </div>
                            <div className='row pl-4 pr-4 pb-4 pt-1 d-md-none' style={{ color: "white", fontSize: '12px' }}>
                                <div className='col-6 text-left'>
                                    <a href={"mailto:" + config.footer.info.email} style={{ textDecoration: "none", color: 'white' }}>
                                        <img className='mr-1' src={config.footer.info.emailIcon} style={{ maxWidth: "20px" }} />
                                        ventas@diasa.net
                                    </a>
                                </div>
                                <div className='col-6 text-right'>
                                    <label>
                                        <img className='mr-1' src={config.footer.info.phoneIcon} style={{ maxWidth: "20px" }} />
                                        (81) 1253 3080
                                    </label>
                                </div>
                            </div>
                            <div className="d-md-none footer-none">
                            <img  src={config.footer.iconfmb} style={{ maxWidth: "100px" }} />
                            </div>
                        </div>
                    </>
                }
                {/* Inofrmacion de la version */}
                <div className="footer-copyright text-center py-4" style={{fontSize: "12px" }}>
                    <a href="http://fmbsolutions.mx/" target="_blank">
                        <span style={{ color: config.footer.textColor }}>Todos los derechos reservados © {this.getYear()} &middot; Versión &middot; {global.appVersion}</span>
                    </a>
                </div>
            </footer>
            // <div className="footer col-md-12" 
        );
    }
}

const mapStateToProps = store => {
    return {
        itemsReducer: store.ItemsReducer,
        sessionReducer: store.SessionReducer,
        configReducer: store.ConfigReducer
    };
};

const mapDispatchToProps = dispatch => {
    return {
        enableSpinner: value => dispatch({ type: DISPATCH_ID.CONFIG_SET_SPINNER, value }),
        setItemsSearch: value => dispatch({ type: DISPATCH_ID.ITEMS_SET_ITEMS, value }),
        setItemsFilterSearch: value => dispatch({ type: DISPATCH_ID.ITEMS_SAVE_ITEMS_FILTER, value }),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Footer);
