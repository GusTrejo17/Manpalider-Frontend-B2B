import React, {Component} from 'react';
import {Footer, NavBar, Session, Suscription} from "../../components";
import {VIEW_NAME, config} from "../../libs/utils/Const";
import './QuestionView.css';
import questions from './data';
import { animateScroll as scroll, scroller } from 'react-scroll'

class Preguntas extends Component {
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
        return (
            <div className="content-fluid" style={{marginTop: 150,backgroundColor:config.Back.backgroundColor }}>
                <Session history={history} view={VIEW_NAME.QUESTIONS_US_VIEW}/>
                <NavBar/>
                <div className="bannerRedCompensas margenSuperior" style={{backgroundColor:config.Back.backgroundColor }}>
                    <img className="img-fluid"
                        src={config.questions.bannerImage}
                        alt="Segundo NavBar"
                    />
                </div>
                <div className="container pb-4 pt-4">
                    <div className="container">
                        <div className="row">
                            <div className="accordion" id="accordionExample">
                                {questions.map( (pregunta, index) => {
                                    return(
                                        <div className="card">
                                            <div className="card-header" id={`heading${index}`}>
                                                <span className="mb-0">
                                                    <button className="btn btn-link" type="button" data-toggle="collapse" data-target={`#collapse${index}`} aria-expanded="true" aria-controls={`collapse${index}`}>
                                                        <div className="text-justify">
                                                            <p className="m-0">{pregunta.question}</p>
                                                        </div>
                                                    {/* {pregunta.question} */}
                                                    </button>
                                                </span>
                                            </div>
                                            <div id={`collapse${index}`} className="collapse" aria-labelledby={`heading${index}`} data-parent="#accordionExample">
                                                <div className="card-body text-justify">
                                                    <p>{pregunta.answer}</p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
                <Suscription/>
            </div>
        );
    }
}

export default Preguntas;