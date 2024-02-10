import React, {Component} from 'react';
import {Footer, NavBar, Session, TopNavBar, Suscription} from "../../components";
import {DISPATCH_ID, SERVICE_RESPONSE, config, ROLES,VIEW_NAME,SERVICE_API} from '../../libs/utils/Const';
import {ApiClient} from "../../libs/apiClient/ApiClient";
import {connect} from "react-redux";
import $ from 'jquery';
import moment from "moment";
import "./NewsBlog.css";
import { animateScroll as scroll, scroller } from 'react-scroll';

let apiClient = ApiClient.getInstance();

class NewsBlogView extends Component {
    constructor(props) {
        super(props);
        const api = config.BASE_URL;
        const assets = config.ASSETS;
        this.state = {
            urlapi: api,
            assets: assets,
            file: null,
            errors: {
                title: '',
                file: '',
            },
            intro: '',
            fechaInicio : moment(new Date()).format('YYYY-MM-DD'),
            fechaFinal : moment(new Date()).format('YYYY-MM-DD'),
            fechaActual : moment(new Date()).format('YYYY-MM-DD'),
            isLoaded: false,
        };
        this.fnLoadAllBanners = this.fnLoadAllBanners.bind(this);
        this.scrollToBottom = this.scrollToBottom.bind(this);
    };

    async componentDidMount() {
        this.fnLoadAllBanners();
        this.scrollToBottom();
        
    }
    scrollToBottom() {
	    scroll.scrollToTop({
	        duration: 1000,
	        delay: 100,
	        smooth: 'easeOutQuart',
	        isDynamic: true
	      })
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.state.isLoaded) this.fnLoadAllBanners();
    }

    fnLoadAllBanners = () => {
        const { fechaInicio, fechaFinal } = this.state;
        // loadActiveBanners = () => fetch(`${this.state.urlapi}/getbanners`, { method: 'GET', mode: 'cors', cache: 'default' })
        fetch(`${this.state.urlapi}/getNewsBlog/${fechaInicio}/${fechaFinal}`, { method: 'GET', mode: 'cors', cache: 'default' })
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
                    {/* style={{width:'600px', height:'450px'}} */}
                    <img src={image} className="img-fluid my-3"  alt={image} />
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

    openDetails = (id = null) => {
        const api = config.BASE_URL;
        var miInit = { method: 'POST', mode: 'cors', cache: 'default' };
        fetch(`${api}/admin/getNewsBlog/${id}`, miInit).then(res => res.json())
            .then((result) => {
                if (result.length > 0) {
                    this.setState({
                        user_id: result[0].creator, 
                        title: result[0].title,
                        image: result[0].image,
                        intro: result[0].introduction,
                        content: result[0].new,
                        active: result[0].active,
                        valid_from: moment(result[0].date,'YYYY-MM-DD'),
                    });
                    
                    setTimeout(() => {
                        $('#datilsNewsBlog').modal('show');
                    }, 1000)
                }
            })
            .catch(function (error) {
                // console.log('Error:',error);
            });
    }

    handleInputDateInicio = event =>{
        let fechaInicio = event.nativeEvent.target.value;
        this.setState({
            isLoaded: true,
            fechaInicio
        });
    }

    handleInputDateFinal = event =>{
        let fechaFinal = event.nativeEvent.target.value;
        this.setState({
            isLoaded: true,
            fechaFinal
        });
    }
    
    render() {
        const { history, sessionReducer } = this.props;
        const { banners, assets, title, intro, content, fechaActual, fechaInicio, fechaFinal } = this.state;
        return (
            <div className="content-fluid none-scroll" style={{marginTop: 150}}>
                <Session history={history} view={VIEW_NAME.NEW_BLOG_VIEW}/>
                <NavBar/>
                <div className="bannerRedCompensas margenS">
                    <img id = "scrollDownPlease" className="img-fluid"
                        src={require('../../images/diasa/bannerPaginas/BLOG DE NOTICIAS.png')}
                        alt="Segundo NavBar"
                    />
                </div>  
                <div className="row mb-md-3 mt-md-3 justify-content-center">
                    <div className="col-md-8">
                        <div className="row justify-content-start">
                            <div className="col-md-12 col-sm-9">
                                <h2 className = "font-weight-bold titleSpan" style={{color: "#666666"}}>Sección de noticias</h2>
                            </div>
                            <div className="row col-md-4 col-sm-4">
                                {/* <h4 className="pr-2">Desde:</h4>
                                <input 
                                    id="fechaInicio"
                                    type="date" 
                                    className="form-control col-md-6" 
                                    name="fechauno" 
                                    max={fechaActual}
                                    value = {fechaInicio}
                                    onChange = {(event) => this.handleInputDateInicio(event)}/> */}
                            </div>
                            <div className="row col-md-4 col-sm-4">
                                {/* <h4 className="pr-2">Hasta:</h4>
                                <input 
                                    id="FechaFin"
                                    type="date" 
                                    className="form-control col-md-6" 
                                    name="fechados" 
                                    max={fechaActual}
                                    value = {fechaFinal}
                                    onChange = {(event) => this.handleInputDateFinal(event)}/> */}
                            </div>
                            
                        </div>
                    </div>
                </div>

                <div className="row justify-content-center">
                    <div className="col-md-10 mt-3">
                        <div className="row">
                            {!!banners && banners.map( (blog, index) =>{
                                return(
                                    <div className="cardNewsBlog col-sm-4" key={index}>
                                        <div className="card mb-4" style={{borderRadius: '10px', height: '600px', backgroundColor:"#FFFFFF", marginLeft: 'auto', marginRight: 'auto'}}>
                                            {/* <div className="row no-gutters">        require('../../images/diasa/blogNoticias/imagen-01.png') */}
                                                <img style={{height: '300px'}} id = "scrollDownPlease" className="card-img-top img-fluid" src={assets + 'newsBlog/' + blog.image} alt="Segundo NavBar"/>
                                                <div className="card-body text-center" style={{fontFamily: 'Poppins', height: '400px'}}>
                                                    <p className="col-12 row" style={{fontSize: 20, color: "#666666", paddingRight: 0}}>
                                                        <span className="col-6 text-left">NOTICIAS</span>
                                                        <span className="col-6 text-right">{moment(blog.date).utc().format('YYYY-MM-DD')}</span>
                                                    </p>
                                                    <h5 className="card-title font-weight-bold text-left" style={{fontSize: 28, color: "#666666"}}><strong>{blog.title}</strong></h5>
                                                    {/* <span className="card-text">{sucur.address}</span><br/>
                                                    <span className="card-text">C.P. {sucur.zipcode}</span><br/>
                                                    <span className="card-text">{sucur.block}</span><br/> */}
                                                    {/* {sucur.phones.map((phone,index) => {
                                                        return (
                                                            <span className="card-text">Tel. <strong>{phone}</strong><br/></span>
                                                        );
                                                    })} */}
                                                </div>
                                                <div className="buttonNewsBlog card-footer text-left">
                                                    <button className="btn" type="button" onClick={e => this.openDetails(blog.id)} ><i className={config.icons.suscription}/></button>
                                                </div>                                               
                                            {/* </div> */}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    <div class="modal fade bd-example-modal-xl" id="datilsNewsBlog" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
                        <div class="modal-dialog modal-xl">
                            <div className="modal-content">
                                <div className="modal-header text-light" style={{background: '#0060EA', borderRadius: '0' }}>
                                    <h4 s className="modal-title" id="modal-basic-title ">{title}</h4>

                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                        <span className="text-white" aria-hidden="true">&times;</span>
                                    </button>
                                </div>

                                <div className="modal-body">
                                    {this.renderImage()}   
                                    {/* <div>{title}</div>  */}
                                    <h5 className="modal-title tituloNewsBlogModal" dangerouslySetInnerHTML={{ __html: intro }} style={{fontSize:'1.5rem'}}></h5>
                                    <p style={{fontSize:'1.5rem'}} dangerouslySetInnerHTML={{ __html: content }}></p>
                                </div>
                            
                                <div className="modal-footer justify-content-right">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Suscription/>
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
        enableSpinner: value => dispatch({type: DISPATCH_ID.CONFIG_SET_SPINNER, value}),
    };
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(NewsBlogView);