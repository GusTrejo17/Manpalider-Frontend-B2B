import React, { Component } from 'react';
import {config} from "../libs/utils/Const";
import { connect } from "react-redux";
import $ from 'jquery';
import CurrencyFormat from 'react-currency-format';

class CommentsModal extends Component{

    componentDidMount(): void {
        this.closeAction();
    }

    closeConfirm = async () => {
        $('#commentsModal').modal('hide');  
    }

    closeAction = () => {
        $('#commentsModal').on('hidden.bs.modal', function () {
        });
    };

    Continue =()=>{
        const { notificationReducer: { showAlert }, sendOrder, sendOrderVta, tipo } = this.props;
        let comment = document.getElementById("comments").value;
        if(comment.length <= 20){
            if(tipo === 1){
                sendOrder(comment);
                $('#commentsModal').modal('hide');
            }
            else{
                sendOrderVta(comment);
                $('#commentsModal').modal('hide');
            }
        }
        else{
            showAlert({ type: 'error', message: 'Has excedido más de 20 caracteres.' });
            return;
        } 
    }

    render() {
        return (
                <div class="modal" tabindex="-1" role="dialog" id="commentsModal" >
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Escribe aqui tu comentario.</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <div className="row">
                                <div className="col-sm-12 col-md-12">
                                    <div class="form-group" style={{marginBottom: '2px'}}> 
                                        <input type="text" class="form-control" autoComplete="off" id="comments" placeholder="Escribe aqui" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" className="btn btn-danger" onClick={this.closeConfirm}>Cerrar</button>
                            <button type="button" className="btn btn-success" onClick={this.Continue}> Crear </button>                            
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
)(CommentsModal);



//export default ;