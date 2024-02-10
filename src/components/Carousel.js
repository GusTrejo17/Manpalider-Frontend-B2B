import React, {Component} from 'react';
import {config} from "../libs/utils/Const";
import $ from 'jquery';
// import ReactImageMagnify from 'react-image-magnify';

class Carousel extends Component {

    renderCarouselImage = (imagePath, index) => {
        const {itemCode} = this.props;
        return (
            <div key={index + 'q'} className={"carousel-item" + (index === 0 ? ' active' : '')} style={{backgroundColor: "rgba(248,249,250,0.6)"}} id={index + 'Image' + itemCode}>
                <img className="img-fluid" src={imagePath} alt="First slide"/>
            </div>
        );
    };

    renderIndicator = (imagePath, index) => {
        const {itemCode} = this.props;        
        return <li key={index + imagePath + 'w'} data-target={"#carouselDetails" + itemCode} data-slide-to={index} className={index === 0 ? ' active': ' '} id={index + itemCode}/>
        
    };

    resetCarousel = () => {
        const {images, itemCode} = this.props;
        try {
            var newItem = itemCode;
            newItem = newItem.toString().replace("/","-");
            setTimeout(() => {
                images.map( (image,index) => {
                    $('#' + index + newItem).removeClass('active');
                    $('#' + index + 'Image' + newItem).removeClass('active');
                });
    
                $('#0' + newItem).addClass('active');
                $('#0Image' + newItem).addClass('active');
            }, 10); 
        } catch (error) {
            
        }
        
    };

    render() {
        const {images, itemCode} = this.props;
        return (
            <div>
                <div className="row" style={{margin: 0, padding: 0}}>
                    <div className="col-12 carrouselImages" style={{margin: 0, padding: 0}}>
                        <div id={"carouselDetails" + itemCode} className="carousel slide" data-ride="carousel" style={{textAlign: "center"}}>
                            <ol className="carousel-indicators">
                                {images.map((imagePath, index) => {
                                    if (imagePath) return this.renderIndicator(imagePath, index)
                                })}
                            </ol>
                            <div className="carousel-inner" style={{margin: "20px auto", width: "80%"}}>
                                {images.map((imagePath, index) => {
                                    if (imagePath.path) return this.renderCarouselImage(imagePath.path, index)
                                })}
                            </div>
                            {images.length !== 1 &&
                            <a className="carousel-control-prev" href={"#carouselDetails" + encodeURIComponent(itemCode)} role="button" data-slide="prev">
                                <i className={config.icons.arrowLeft} style={{fontSize: 50, color: config.navBar.backgroundColor}}/>
                                <span className="sr-only">Previous</span>
                            </a>}
                            {images.length !== 1 &&
                            <a className="carousel-control-next" href={"#carouselDetails" + encodeURIComponent(itemCode)} role="button" data-slide="next" style={{}}>
                                <i className={config.icons.arrowRight} style={{fontSize: 50, color: config.navBar.backgroundColor}}/>
                                <span className="sr-only">Next</span>
                            </a>}
                        </div>
                    </div>
                </div>
                {/* <ReactImageMagnify {...{
                  smallImage: {
                    alt: 'Wristwatch by Ted Baker London',
                    isFluidWidth: true,
                    src: 'https://bytelesen.com/wp-content/uploads/logitech-g-703-lightspeed-kabellose-gaming-maus-1.jpg',
                  },
                  largeImage: {
                    src: 'https://bytelesen.com/wp-content/uploads/logitech-g-703-lightspeed-kabellose-gaming-maus-1.jpg',
                    width: 1800,
                    height: 900
                  }
                }} /> */}
                {this.resetCarousel()}
            </div>
        );
    }
}

export default Carousel;