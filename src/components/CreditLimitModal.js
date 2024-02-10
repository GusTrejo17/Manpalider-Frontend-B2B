import React, { Component } from 'react';
import {config} from "../libs/utils/Const";
import $ from 'jquery';
import CurrencyFormat from 'react-currency-format';

class CreditLimitModal extends Component{

    componentDidMount(): void {
        this.closeAction();
    }

    closeConfirm = async () => {
        //const { clearSocio } = this.props;
        //clearSocio();
        $('#creditLimitModal').modal('hide');  
    }

    closeAction = () => {
        $('#creditLimitModal').on('hidden.bs.modal', function () {
        });
    };

    Continue =()=>{
        const { createDocument } = this.props;
        createDocument();
        $('#creditLimitModal').modal('hide');  
    }

    render() {
        const {Limit,Codigo,CardName} = this.props;
        return (
                <div class="modal" tabindex="-1" role="dialog" id="creditLimitModal" >
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                        <div class="modal-body">
        <p>"{Codigo}-{CardName}" tu saldo al día es de  <CurrencyFormat 
                                    value={Limit} 
                                    displayType={'text'} 
                                    thousandSeparator={true} 
                                    fixedDecimalScale={true} 
                                    decimalScale={2} 
                                    prefix={'$ '}
                                    suffix={config.general.currency}
                                    >
                                </CurrencyFormat></p>
                            <p>¿Deseas continuar?</p>
                        </div>
                        <div class="modal-footer">
                            <button type="button" className="btn btn-success" onClick={this.Continue}> Si </button>
                            <button type="button" className="btn btn-danger" onClick={this.closeConfirm}>No</button>
                        </div>
                        </div>
                    </div>
                </div>
        );  
    }
}
export default CreditLimitModal;