import React, {Component} from 'react';
import {Footer, NavBar, Session, Suscription} from "../../components";
import {VIEW_NAME, config} from "../../libs/utils/Const";
import './AboutUsView.css';
import { animateScroll as scroll, scroller } from 'react-scroll'

class AboutUsView extends Component {
    constructor(props){
        super(props);
        this.scrollToBottom = this.scrollToBottom.bind(this);
    }

    scrollToBottom() {
        scroll.scrollToTop({
            duration: 1500,
            delay: 100,
            smooth: 'easeOutQuart',
            isDynamic: true
          })
    }

    componentDidMount(){
        this.scrollToBottom();
    }

    render() {
        const {history} = this.props;
        const {mission, images, description, vision, values} = config.aboutUs;
        return (
            <div className="content-fluid margenSuperiorMenuCategorias" style={{paddingRight:0, backgroundColor:config.Back.backgroundColor }}>
                <Session history={history} view={VIEW_NAME.ABOUT_US_VIEW}/>
                <NavBar/>
                <div className="bannerRedCompensas margenS" style={{backgroundColor:"#fff"}}>
                    <img className="img-fluid"
                        src={require('../../images/diasa/bannerPaginas/nosotros.jpg')}
                        alt="Segundo NavBar"
                    />
                </div>
                <div className="container">
                    <div className="row title"> 
                        <span className="col-auto text-left titleSpan">Historia</span>
                    </div>
                    <div className="row title">
                        
                        <hr className="col-auto"/>
                    </div>
                    <div className="description">
                        <p className="text-justify ">{description}</p>
                    </div><br/>
                    <div className="description2">
                        <p><span>Visión:</span> {vision}</p>
                        <p><span>Misión:</span> {mission}</p>
                    </div>
                    <br></br>
                    {/* <div id="carouselExampleControls" class="carousel slide" data-ride="carousel">
                        <div class="carousel-inner">
                            <div class="carousel-item active" style={{textAlign:'center'}}>
                                <iframe width="560" height="315" src="https://www.youtube.com/embed/1I9mPGD4Z8M" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen alt="First slide"/>
                            </div>
                            <div class="carousel-item" style={{textAlign:'center'}}>
                                <iframe width="560" height="315" src="https://www.youtube.com/embed/m3aXXXudD0I" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen alt="Second slide"/>
                            </div>
                            <div class="carousel-item" style={{textAlign:'center'}}>
                                <iframe width="560" height="315" src="https://www.youtube.com/embed/ZyeMKvKLz3I" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen alt="Third slide"/>
                            </div>
                        </div>
                        <a class="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
                            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span class="sr-only">Previous</span>
                        </a>
                        <a class="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
                            <span class="carousel-control-next-icon" aria-hidden="true"></span>
                            <span class="sr-only">Next</span>
                        </a>
                    </div> */}
                    {/* <div className="bannerRedCompensas margenS" style={{backgroundColor:"#EFEFEF"}}> */}
                        {/* <h1 className="text-center"> <strong>Valores</strong> </h1> */}
                        {/* <img className="img-fluid"
                            src={require('../../images/diasa/quienesSomos/presencia-1.png')}
                            alt="Segundo NavBar"
                        /> */}
                    {/* </div> */}
                    <br/><br/>
                    {/* <div className="row">
                        <div className="col-sm-4">
                            <div className="list-group" id="list-tab" role="tablist" >
                                {!!mission && <a className="list-group-item list-group-item-action-1 active"
                                id="list-home-list" data-toggle="list" href="#list-home"
                                role="tab" aria-controls="home">
                                    Misión
                                </a>}
                                { !!vision && <a className="list-group-item list-group-item-action-1"
                                id="list-profile-list" data-toggle="list"
                                href="#list-profile" role="tab"
                                aria-controls="profile">
                                    Visión
                                </a>}
                                { !!values.length && <a className="list-group-item list-group-item-action-1"
                                id="list-messages-list" data-toggle="list"
                                href="#list-messages" role="tab"
                                aria-controls="messages">
                                Valores
                                </a>}
                            </div>
                        </div>
                        <div className="col-sm-8">
                            <div className="tab-content" id="todo-rojo" >
                                { !!mission && <div className="tab-pane fade show active text-justify" id="list-home" role="tabpanel" aria-labelledby="list-home-list" >
                                    {mission}
                                </div>}
                                { !!vision && <div className="tab-pane fade text-justify" id="list-profile" role="tabpanel" aria-labelledby="list-profile-list">
                                    {vision}
                                </div>}
                                { !!values.length && <div className="tab-pane fade" id="list-messages" role="tabpanel" aria-labelledby="list-messages-list">
                                    <ul className="list-group list-group-flush">
                                        {values.map( value => {
                                            return  <li key={value.title} className="list-group-item">{value.title}</li>
                                        } )}
                                    </ul>
                                </div>}
                            </div>
                        </div>
                    </div> */}
                </div>
                <Suscription/>
            </div>
        );
    }
}

export default AboutUsView;