import React, { Component } from 'react';
import {config} from "../libs/utils/Const";
import { connect } from "react-redux";
import $ from 'jquery';
import CurrencyFormat from 'react-currency-format';

class SaveCartModal extends Component{

    componentDidMount() {
        this.closeAction();
    }

    closeConfirm = async () => {
        $('#saveCartModal').modal('hide');  
    }

    closeAction = () => {
        $('#saveCartModal').on('hidden.bs.modal', function () {
        });
    };

    Delete =()=>{
        const { notificationReducer: { showAlert }, SaveCart } = this.props;
        SaveCart(4);
        $('#saveCartModal').modal('hide');
    }

    Save =()=>{
        const { notificationReducer: { showAlert }, SaveCart,empleado } = this.props;
        SaveCart(empleado);
        $('#saveCartModal').modal('hide');
    }

    render() {
        return (
                <div class="modal" tabindex="-1" role="dialog" id="saveCartModal" >
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                        <div class="modal-header" style={{background: config.shoppingList.summaryList}}>
                            <h5 class="modal-title" style={{color: config.navBar.textColor2}}>Alerta</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <div className="row">
                                <div className="col-sm-12 col-md-12">
                                    {/* <div class="form-group" style={{marginBottom: '2px'}}> 
                                        <input type="text" class="form-control" autoComplete="off" id="comments" placeholder="Escribe aqui" />
                                    </div> */}
                                    <h2 style={{textAlign:'center'}}>¿Deseas guardar tu carrito?</h2>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" className="btn btn-danger" onClick={this.Delete}>Eliminar carrito</button>
                            <button type="button" className="btn btn-success" onClick={this.Save}> Guardar carrito </button>                            
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
)(SaveCartModal);