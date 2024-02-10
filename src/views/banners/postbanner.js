import React from 'react';
import Async from 'react-async';
import { useParams } from 'react-router-dom';
import {config, VIEW_NAME} from "../../libs/utils/Const";
import {Session, NavBar, Slider, CarouselDashboard, Footer} from '../../components';

function  Post(props) {
    const { id, slug } = useParams();
    const api = config.BASE_URL;
    const assets = config.ASSETS;
    let items = [];
    const loadActiveBanners = () => fetch(`${api}/admin/getbanner/${id}`, { method: 'POST', mode: 'cors', cache: 'default' })
        .then(res => (res.ok ? res : Promise.reject(res)))
        .then(res => res.json());
    const renderItems = (items) => {
        if (items.length > 0) {
            return (
                <div className="container-fluid" style={{backgroundColor:"#fff"}}>
                    <hr />
                    <h3>Productos relacionados con la publicación</h3>
                    <div className="row">
                        {items.map((row) => (
                            <div key={row} className="col-md-4">
                                <div className="card mb-4 shadow-sm">
                                    <svg className="bd-placeholder-img card-img-top" width="100%" height="225" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: Thumbnail">
                                        <title>Placeholder</title>
                                        <rect width="100%" height="100%" fill="#55595c"></rect>
                                        <text x="50%" y="50%" fill="#eceeef" dy=".3em">Thumbnail</text>
                                    </svg>
                                    <div className="card-body">
                                        <p>{row}</p>
                                        <p className="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div className="btn-group">
                                                <button type="button" className="btn btn-sm btn-outline-secondary">View</button>
                                                <button type="button" className="btn btn-sm btn-outline-secondary">Edit</button>
                                            </div>
                                            <small className="text-muted">9 mins</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )
        }
    }
    //console.log('params', id, slug);
    const {history} = props;
    return (
        <div className="content-fluid" style={{marginTop: 66}}>
            <Session history={history} view={VIEW_NAME.ABOUT_US_VIEW}/>
            <NavBar/>
            <Async promiseFn={loadActiveBanners}>
                <Async.Loading>Cargando...</Async.Loading>
                <Async.Fulfilled>
                    {data => {
                        //console.log("Data",data[0]);
                        let itemsdb = null;
                        if(data[0].items.length>=3){
                            itemsdb = data[0].items.split(';');
                            items.push(itemsdb); 
                        }
                        return (
                            <div className="container">
                                {data.map((rows, index) =>
                                    (
                                        <div className="container">
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <div className="carousel-inner">
                                                        <div className={'carousel-item ' + (index === 0 ? 'active' : '')} key={index}>
                                                            <img src={assets + 'banners/' + rows.image} className="d-block w-100" alt={rows.image} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <h2 className="mt-3">{rows.title}</h2>
                                                    <hr />
                                                    <p dangerouslySetInnerHTML={{ __html: rows.contents }}></p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>

                        )
                    }}
                </Async.Fulfilled>
                <Async.Rejected>
                    {error => `Something went wrong: ${error.message}`}
                </Async.Rejected>
            </Async>
        </div >
    );
}
export default Post;