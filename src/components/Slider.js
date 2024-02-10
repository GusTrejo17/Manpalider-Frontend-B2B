import React, {Component} from 'react';
import {config} from '../libs/utils/Const';
class Slider extends Component {

    render() {
        return (
            <div style={{marginTop: 0}}>
                <section>
                    <div className="overlay-wcs"/>
                    <video playsInline="playsInline" autoPlay="autoplay" muted="muted" loop="loop">
                        <source src={config.slider.videoLocation} type={config.slider.videoFormat}/>
                    </video>
                    <div className="container h-100">
                        <div className="d-flex h-100 text-center align-items-center" style={{opacity: 0.5}}>
                            <div className="w-100 text-white" style={{opacity: 0.85}}>
                                {config.slider.image && <img src={config.slider.image} className="img-fluid" style={{maxWidth:145}} /> }
                                <h4 className="mb-0">{config.slider.videoText}</h4>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        );
    }
}

export default Slider;
