import React, {Component} from 'react';
import $ from 'jquery';
import {config, DISPATCH_ID} from "../libs/utils/Const";
import {connect} from "react-redux";
import './MenuCategorias.css';

class MenuCategories extends Component {

    state = {
        platforms: [],
        action: 'initial',
    };

    componentDidMount() {
        this.initial();
    }

    initial = () => {
        const internalThis = this;
        $(document).ready(function () {
            $(".menu-categories-button").click(function () {
                internalThis.setFirstCategories();
                $("#menuCategories").toggleClass('open-menu-categories');
            });
            $("#menuCategories").click(e => {
                if (e.target.id !== 'menuCategories') return;
                $("#menuCategories").toggleClass('open-menu-categories');
            });

        });
    };

    setFirstCategories = () => {
        const {itemsReducer: {tags}} = this.props;

        let platform = this.setPlatform(tags, 0);

        this.setState({
            platforms: [{platform}],
            action: 'initial'
        })

    };

    getChildren = (father) => {
        const {platforms} = this.state;
        if(!father.children.length) return;
        let platform = this.setPlatform(father.children, platforms.length);
        platforms.push({platform});
        this.setState({
            platforms: platforms,
            action: 'push',
        })

    };

    goBack = () => {
        const {platforms} = this.state;
        this.setState({
            action: 'pop',
        })
    };

    hover = name => {
        $('.platforms li:hover').css({"background-color": config.navBar.menuCategoriesBackgroundHover, color: config.navBar.textColor2});
    };

    leaveHover = name => {
        $('.platforms li').css({"background-color": 'transparent', color: config.navBar.textColorCategorie});
    };

    setPlatform = (tags, index) => {

        return <div key={index} className={'platforms platform-effect'} id={'platform' + index} style={{transform: 'translate3d( -' + ((index === 0 || index === 1) ? 0 : index - 1) + '00%,0,0)'}}>
            <div className='row align-items-center justify-content-center' id='menuTitle' onClick={index === 0 
                ? () => {} 
                : () => this.goBack(index)}
                style={{
                    color: config.navBar.textColorCategorie,
                    borderBottom: '.5px solid ' + config.navBar.iconColor,
                    cursor: (index === 0 ? '' : 'pointer'),
                    margin: 0,
                    padding: 0,
                    paddingTop: 5,
                    paddingBottom: 5
                }}>

                <div className='col-4 text-left' style={{fontSize: 25, margin: 0, padding: 0}}>
                    {index === 0 
                        ? <i className="fas"/> 
                        : <i className={config.icons.arrowLeft} style={{margin: 0, padding: 0, marginLeft: 10}}/>
                    }
                </div>

                <div className='col-4 text-center' style={{}}>
                    {index === 0 ? 'PRODUCTOS' : 'REGRESAR'}
                </div>

                <div className='col-4'>
                </div>

            </div>
            <div className="menu-burger" /*style={{height: '40vw', maxHeight: '48vw', overflow: 'auto'}}*/ >
                <ul style={{overflowY: 'auto', height: '50%'}}>
                    {tags.map((tag, index) => {
                        return <li key={tag.category.code + tag.category.name + index} id={tag.category.code + tag.category.name + index} className='row justify-content-center'
                                   style={{
                                       margin: 0,
                                       padding: 0,
                                       paddingTop: 3,
                                       paddingBottom: 3,
                                       color: config.navBar.textColorCategorie,
                                       fontSize: 16,
                                       cursor: 'pointer'
                                   }} onMouseOver={() => this.hover(tag.category.code + tag.category.name + index)}
                                   onMouseLeave={() => this.leaveHover(tag.category.code + tag.category.name + index)}
                                   onClick={tag.category.enabled ? () => this.search(tag.category) : () => this.getChildren(tag)}>
                            <div className='col-10 text-left' style={{
                                paddingLeft: 10,
                                textOverflow: 'ellipsis',
                                overflow: 'hidden',
                                whiteSpace: 'nowrap'
                            }}>
                                {tag.category.name}
                            </div>
                            <div className='col-2 text-right' style={{}}>
                                {tag.category.enabled ? <i style={{fontSize: "1.3rem"}} className={config.icons.search}/> : <i className={config.icons.arrowRight}/>}
                            </div>
                        </li>
                    })}
                </ul>
            </div>
        </div>;
    };

    search = category => {
        const {setCategory,setIdCategory, setLocation,itemsReducer: {searchByCategories},setNextPage} = this.props;
        setCategory(category.name);
        setIdCategory(category.search);
        setNextPage(0);
        setLocation('menuCategories');
        searchByCategories(category.search);
    };

    getPlatforms = () => {
        const {action, platforms} = this.state;
        return platforms.map(platform => {
            return platform.platform
        });
    };

    addClass = () => {
        const {platforms, action} = this.state;


        if (action === 'stop') return;

        setTimeout(() => {
            if (action === 'initial') {
                $('#platform0').css('transform', 'translate3d(0%,0,0)');
            }

            if (action === 'push') {
                platforms.map((platform, index) => {
                    let newTranslate = index;
                    if (index !== platforms.length - 1) {
                        newTranslate = index + 1;
                    }
                    $('#platform' + index).css('transform', 'translate3d( -' + (newTranslate) + '00%,0,0)');
                });
            }

            if (action === 'pop') {
                platforms.map((platform, index) => {
                    let newTranslate = 0;
                    if (index === platforms.length - 2) {
                        $('#platform' + index).css('transform', 'translate3d(-' + (index) + '00%,0,0)');
                    }
                    if (index === platforms.length - 1) {
                        $('#platform' + index).css('transform', 'translate3d(-' + (index - 1) + '00%,0,0)');
                    }

                });

                setTimeout(() => {
                    platforms.pop();
                    this.setState({
                        platforms,
                        action: 'stop',
                    })
                }, 500)

            }
        }, 10)
    };

    render() {
        const {platforms} = this.state;
        return (
            <div className="menu-categories" id='menuCategories' style={{position: 'fixed'}}>
                <nav className="menu-sub-categories" style={{background: config.navBar.menuCategoriesBackground, overflow: 'hidden', display: 'inline-flex'}}>
                    {this.getPlatforms()}
                </nav>
                {this.addClass()}
            </div>
        );
    }
}

 const mapStateToProps = store => {
    return {itemsReducer: store.ItemsReducer};
}; 

const mapDispatchToProps = dispatch => {
    return {
        setCategory: value => dispatch({type: DISPATCH_ID.ITEMS_SET_CATEGORY, value}),
        setIdCategory: value => dispatch({type: DISPATCH_ID.ITEMS_SET_IDCATEGORY, value}),
        setNextPage:  value => dispatch({type: DISPATCH_ID.ITEMS_SET_NEXTPAGE, value}),
        setLocation:  value => dispatch({type: DISPATCH_ID.ITEMS_SET_LOCATION, value}),
    };    
};

function Prueba(valor){
    //console.log(`Hola el valor es: ${valor} ojala funcione`)
}

 export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MenuCategories);
export {Prueba}
 