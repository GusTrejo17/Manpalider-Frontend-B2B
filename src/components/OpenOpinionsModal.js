import React, { Component } from 'react';
import {config} from "../libs/utils/Const";
import { connect } from "react-redux";
import $ from 'jquery';
import CurrencyFormat from 'react-currency-format';
import ReactStars from "react-rating-stars-component";

class OpenOpinionsModal extends Component{

    componentDidMount(): void {
        this.closeAction();
    }

    closeConfirm = async () => {
        $('#OpinionsModal').modal('hide');  
    }

    closeAction = () => {
        $('#OpinionsModal').on('hidden.bs.modal', function () {
        });
    };


    render() {
        const { All } = this.props;
        return (
                <div class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog" id="OpinionsModal" >
                    <div class="modal-dialog modal-lg modal-dialog-scrollable" role="document">
                        <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Opiniones del producto</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                        <div class="row">
                            <div class="col">
                                {!!All && All.map((raiting, index ) => {
                                    return(
                                        <div>
                                            <div style={{paddingBottom:0}}>
                                                <ReactStars
                                                    count={5}
                                                    onChange={(event) => {this.ratingChanged(event)}}
                                                    value= {raiting.calificacion}
                                                    edit= {false}
                                                    size={30}
                                                    isHalf={true}
                                                    emptyIcon={<i className="far fa-star"></i>}
                                                    halfIcon={<i className="fa fa-star-half-alt"></i>}
                                                    fullIcon={<i className="fa fa-star"></i>}
                                                    activeColor="#ffd700"
                                                />
                                            </div>
                                            {/* <br></br> */}
                                            <label><b>{raiting.titulo}</b></label>
                                            <div className="text-justify" id="comment" role="tabpanel" aria-labelledby="home-tab" style={{paddingBottom:20}}>
                                                <div style={{maxHeight: "332px", overflow: "scroll"}}>{raiting.comentario}</div>
                                            </div>
                                        </div>
                                    )
                                })
                                }
                            </div>
                        </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={this.closeConfirm}>Cerrar</button>                          
                        </div>
                        </div>
                    </div>
                </div>
        );  
    }
}

const mapStateToProps = store => {
    return {
        sessionReducer: store.SessionReducer,
        configReducer: store.ConfigReducer,
        notificationReducer: store.NotificationReducer,
    };
};

export default connect(
    mapStateToProps,
)(OpenOpinionsModal);
