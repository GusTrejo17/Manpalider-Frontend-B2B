import React, {Component} from 'react';
import {Footer, NavBar, Session} from "../../components";
import {VIEW_NAME, config} from "../../libs/utils/Const";
import { animateScroll as scroll, scroller } from 'react-scroll';


class ContactUsView extends Component {

    constructor(props) {
        super(props);

        this.scrollToBottom = this.scrollToBottom.bind(this);
    };


    async componentDidMount(){
        this.scrollToBottom();
    };

    scrollToBottom() {
	    scroll.scrollToTop({
	        duration: 1000,
	        delay: 100,
	        smooth: 'easeOutQuart',
	        isDynamic: true
	      })
    }


    render() {
        const {history} = this.props;
        const { locations } = config.contactUs;
        return (
            <div className="content-fluid" style={{marginTop: 0,backgroundColor:"#FFFFFF"}}>
                <Session history={history} view={VIEW_NAME.CONTACT_US_VIEW}/>
                <NavBar/><br/>
                <div className="container Viewcontact" style={{paddingBottom: 70}}>
                    <div className="jumbotron">
                        <h1 className="text-center titleSpan">Contáctanos</h1>
                    </div>  
                    <div className="row">
                        <div className="col-md-4">
                            <div className="list-group" id="list-tab" role="tablist">
                                {locations.map( (location, index) => {
                                    return  <a style={{fontSize:"1.5rem"}}key={index} className={"list-group-item list-group-item-action " + (!index ? 'active' : '')} id={"list" + index} data-toggle="list" href={"#location" + index}>
                                        { location.name }
                                    </a>
                                })}
                            </div>
                        </div>
                        <div className="col-md-8">
                            <div className="tab-content" id="nav-tabContent">
                                {locations.map( (location, index) => {
                                    return  <div key={index} className={"tab-pane fade" + (!index ? ' show active' : '')} id={"location" + index} role="tabpanel" arial-labelledby={"list" + index}>
                                        <ul className="list-group list-group-flush">
                                            <li className="list-group-item" style={{fontSize:"1.5rem"}}>
                                                <i className={ config.icons.road } style={{color: config.contactUs.iconColor, margin: 5}}> </i>
                                                { location.street }
                                            </li>
                                            <li className="list-group-item" style={{fontSize:"1.5rem"}}>
                                                <i className={ config.icons.city } style={{color: config.contactUs.iconColor, margin: 5}}> </i>
                                                { location.country }
                                            </li>
                                            <li className="list-group-item" style={{fontSize:"1.5rem"}}>
                                                <i className={ config.icons.phone } style={{color: config.contactUs.iconColor, margin: 5}}> </i>
                                                { location.phone }
                                            </li>
                                            <li className="list-group-item" style={{fontSize:"1.5rem"}}>
                                                <a target="_blank" href={ location.whatsappLink }>
                                                    <i className={ config.icons.whatsapp } style={{color: config.contactUs.iconColor, margin: 5}}> </i>
                                                    { location.whatsapp }
                                                </a>
                                            </li>
                                            <li className="list-group-item correo" style={{fontSize:"1.5rem"}}>
                                                <a target="_blank" href={"mailto:" + location.email}>
                                                    <i className={ config.icons.envelope } style={{color: config.contactUs.iconColor, margin: 5}}> </i>
                                                    { location.email }
                                                </a>
                                            </li>
                                            <li className="list-group-item" style={{fontSize:"1.5rem"}}>
                                                <a target="_blank" href={ location.maps }>
                                                    <i className={ config.icons.pin } style={{color: config.contactUs.iconColor, margin: 5}}> </i>
                                                    Ir a Google Maps
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
        );
    }
}

export default ContactUsView;