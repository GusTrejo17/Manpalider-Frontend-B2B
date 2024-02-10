import React, {Component} from 'react';
import { config } from "../libs/utils/Const";
import $ from 'jquery';
import {ApiClient} from "../libs/apiClient/ApiClient";
let apiClient = ApiClient.getInstance();

class CrearPaqueteModal extends Component {

    constructor(props) {
        super(props);

        this.state = {
            Cond : [],
        };
    };

    CloseConfirm = ()=>{
        $('#exampleModalConfirm').modal('hide');
    }

    
    
    render (){
        const {createNewPackage} = this.props;
        return (
        <div> 
            {/*--------------- MODAL CONFIRMA ---------------*/}
            <div className="modal fade exampleModalConfirm" id="exampleModalConfirm" tabindex="-1" role="dialog" aria-labelledby="exampleModalConfirmLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalConfirmLabel">Creación de paquete</h5>
                            <button type="button" className="close" onClick={this.CloseConfirm} aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className = "col-md-12">
                                    <h6>Seleccione un tipo de paquete</h6>
                                    <div className = "row justify-content-center mx-auto text-center">
                                        <button
                                            className="btn btn-sm"
                                            type="button"
                                            style={{ backgroundColor: config.navBar.iconBackground, color: config.navBar.iconModal }}
                                            onClick={() => createNewPackage(1)}>
                                            Automático
                                        </button>
                                        <button
                                            className="btn btn-sm ml-5"
                                            type="button"
                                            style={{ backgroundColor: config.navBar.iconBackground, color: config.navBar.iconModal }}
                                            onClick={() => createNewPackage(2)}>
                                            Selección
                                        </button>
                                    </div>
                                </div>
                                
                            </form>
                        </div>
                        <div className="modal-footer">
                        </div>
                    </div>
                </div>
            </div>
        </div>
        )
    }
}
export default CrearPaqueteModal