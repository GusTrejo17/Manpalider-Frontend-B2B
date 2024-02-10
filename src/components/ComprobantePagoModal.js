import React, {Component} from 'react';
import { config } from "../libs/utils/Const";
import $ from 'jquery';
import '../index.css';
import 'jquery-ui-dist/jquery-ui';


class ComprobantePagoModal extends Component {

    constructor(props) {
        super(props);

        this.state = {
            Cond : [],
        };

    };
    
    moverModal = () => {
        $(document).ready(function () {
            $("#ComprobantePagoModal").draggable({
                handle: ".modal-header"
            });
        });
    };

    CloseArticulosVenta = ()=>{
        $('#ComprobantePagoModal').modal('hide');
    }
   
    render (){
        const {searchItemsValue,hadleChangeTable,items,selectItems} = this.props;
        return (
        <div> 
            {/*--------------- MODAL COMPROBANTE DE PAGO ---------------*/}
            <div className="modal fade" id="ComprobantePagoModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" >
                <div className="modal-dialog modal-md" role="document" >
                    <div className="modal-content" >
                    <div className="modal-header" id="HeaderModalVenta" style={{background: '#2d75bd', borderRadius: '0' }} onMouseDown={this.moverModal}>
                        <h5 className="modal-title text-white" id="exampleModalLabel">Artículos Venta</h5>
                        <button type="button" className="close" onClick={this.CloseArticulosVenta} aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                    {/* <form> */}
                            <input
                                id="searchItem"
                                type="search"
                                className="form-control"
                                autoComplete="off"
                                placeholder="Buscar artículo"
                                
                                value={searchItemsValue || '' } 
                                onChange={(event)=>hadleChangeTable(event)}
                                />
                                &nbsp;
                                
                            <div>                                  
                                <table className="table scroll" >
                                    <thead style={{textAlign: "-webkit-center"}}>
                                        <tr className="text-light bg-primary" >
                                        {/* <th scope="col">#</th> */}
                                        <th scope="col" style={{width:'30%'}}>Artículo</th>
                                        <th scope="col" style={{width:'60%'}}>Descripción</th>
                                        <th scope="col" style={{width:'10%'}}></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {items.map((item, index) => {
                                            return (
                                            <tr key={'itemsBoni' + index}>
                                                <td style={{width:'30%',fontSize: 12}}>{item.ItemCode}</td>
                                                <td style={{width:'60%',fontSize: 12}}>{item.ItemName}</td>
                                                <td style={{width:'10%'}}>
                                                <button
                                                    className="btn btn-sm"
                                                    type="button"
                                                    style={{ backgroundColor: config.navBar.iconBackground, color: config.navBar.iconModal }}
                                                    onClick={() => selectItems(item)}> 
                                                    <i className="fas fa-plus-circle"></i> 
                                                </button>
                                                </td>
                                            </tr>)
                                        })}
                                    </tbody>
                                </table>
                            </div>
                    {/* </form> */}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={this.CloseArticulosVenta}>Cerrar</button>
                    </div>
                    </div>
                </div>
            </div>
        </div>
        )
    }
}
export default ComprobantePagoModal