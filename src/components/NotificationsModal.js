import React, { Component } from 'react';
import {config} from "../libs/utils/Const";
import $ from 'jquery';
import CurrencyFormat from 'react-currency-format';

class NotificationsModal extends Component{

    componentDidMount(): void {
        this.closeAction();
    }

    closeConfirm = async () => {
        //const { clearSocio } = this.props;
        //clearSocio();
        $('#notificationsModal').modal('hide');  
    }

    closeAction = () => {
        $('#notificationsModal').on('hidden.bs.modal', function () {
        });
    };

    // Continue =()=>{
    //     const { createDocument } = this.props;
    //     createDocument();
    //     $('#notificationsModal').modal('hide');  
    // }

    render() {
        const {responseArray} = this.props;
        return (
                <div className="modal bd-example-modal-lg" tabindex="-1" role="dialog" id="notificationsModal" >
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header text-white" style={{backgroundColor:'#343a40',borderRadius:'0'}}>
                                <h4 className="modal-title" id="modal-basic-title ">Mensajes</h4>
                                <button type="button" className="close" onClick={this.closeConfirm} aria-label="Close">
                                    <span className="text-white" aria-hidden="true">&times;</span>
                                </button>
                            </div>
                        <div className="modal-body">
                            <div className="table-responsive" style={{marginBottom: 0, overflow: 'auto', fontSize:"13px", fontWeight:"bold"}}> 
                                <table className="table table-hover scrolltable" >
                                    <thead style={{textAlign: "-webkit-center"}}>
                                        <tr className="text-light" style={{/*background: '#2d75bd', borderRadius: '0' */}} >
                                            <th className="text-center" scope="col">Documento</th>
                                            <th className="text-center" scope="col">Mensaje</th>
                                        </tr>
                                    </thead>
                                    <tbody style={{overflowY:'auto'}}>
                                        {!!responseArray && responseArray.map((msj, index ) => {
                                            return(
                                                <tr >
                                                    <td className="text-center">{msj.docNum}</td>
                                                    <td className="text-center">{msj.message}</td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>

                        </div>
                        <div className="modal-footer">
                            {/* <button type="button" className="btn btn-success" onClick={this.Continue}> Si </button> */}
                            <button type="button" className="btn btn-danger" onClick={this.closeConfirm}>Cerrar</button>
                        </div>
                        </div>
                    </div>
                </div>
        );  
    }
}
export default NotificationsModal;