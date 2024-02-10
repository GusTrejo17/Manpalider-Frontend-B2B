import React, {Component} from 'react';
import $ from 'jquery';

class PreviewModal extends Component {

    ClosePreview = ()=>{
        $('#modalPreview').modal('hide');
    }

    bonificacion = () => {
        const {itemsSelected} = this.props;

        let bonificacion = [];
        if(itemsSelected.length > 0){
            bonificacion = itemsSelected[0].bonificacion;
        }

        // for (let x = 0; x < itemsSelected.length; x++) {
        //     const element = itemsSelected[x];
            
        // }

        return (
            <td className = "align-middle text-center" style={{width:'50%',}}>
                {bonificacion.map((combo, indexCombo)=>{
                    return (
                        <div style={{border: '2px solid #000', borderRadius: '10px', padding : '10px'}}>
                        {combo.map((bonificacion, indexBoni)=>{
                            return (
                                <div className="form-group row">
                                    <div scope="col" className="align-middle text-center">Unidad</div>&nbsp;
                                    <div className = "align-middle">{bonificacion.itemQuantity}</div>&nbsp;
                                    <div className = "align-middle">{bonificacion.itemCode}</div>&nbsp;
                                    <div className = "align-middle">{bonificacion.itemName}</div>
                                    <div className = "sticky-columns align-middle text-center"
                                        style={{
                                            backgroundColor: '#FFF',
                                            textAlign: 'center'
                                        }}>
                                        <button className="col-md-4" type="button" id="btnCombo" 
                                            data-toggle="tooltip" title={`Eliminar artículo de paquete ${indexCombo + 1}`}
                                            style={{
                                                backgroundColor: 'transparent',
                                                padding: 5,
                                                color: '#c42222',
                                                paddingTop: 2,
                                                paddingBottom: 2,
                                            }}
                                            className="btn">
                                            <i className="fas fa-trash-alt" 
                                            aria-hidden="true" size="10"/>
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                        <div>
                    </div>
                </div>)
                })}
            </td>
        )
    };

    render (){
        const {itemsSelected,packagesInfo,enableGlobalQuantity} = this.props;

        return (
        <div> 
            <div class="modal fade bd-example-modal-lg" id="modalPreview" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-xl" role="document">
                    <div class="modal-content">
                    <div class="modal-header text-light" style={{background: '#0060EA', borderRadius: '0' }}>
                        <h5 class="modal-title" id="exampleModalLabel">Vista Previa</h5>
                        <button type="button" class="close" onClick={this.ClosePreview} aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div className="form-group row"> 
                            <div className="col-md-6" >
                                {/* <h4>En la compra de 12 piezas de cualquiera de estos artículos</h4> */}
                                <div style={{display:'flex', alignItems:'center'}}>
                                    <table className="table scrollPromo table-striped" style={{verticalAlign: 'center'}}>
                                        <thead style={{textAlign: "-webkit-center"}}>
                                            <tr className="text-light bg-primary" >
                                                <th scope="col" className = "align-middle text-center" style={{width:'10%'}}>Cantidad</th>
                                                <th scope="col" className = "align-middle text-center" style={{width:'30%'}}>Artículo</th>
                                                <th scope="col" className = "align-middle text-center" style={{width:'60%'}}>Descripción</th>
                                            </tr>
                                        </thead>
                                        
                                        <tbody>
                                            {itemsSelected.map((item, itemIndex ) => {
                                                return(
                                                <tr style={{paddingTop: '3px', overflow: 'hidden'}}> 

                                                    <td rowSpan = {itemsSelected.length} style={{width:'10%'}} className = "align-middle text-center">
                                                        <input className="form-control text-center" type="text" />
                                                    </td>

                                                    <td className = "align-middle text-center" style={{width:'30%'}}>{item.itemCode}</td>

                                                    <td className = "align-middle" style={{width:'50%'}}>{item.itemName}</td>
                                                </tr>
                                                )})
                                            }
                                            
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="col-md-6">
                                {this.bonificacion()}
                            </div>
                        </div>
                        <div>
                            
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" onClick={this.ClosePreview}>Aceptar</button>
                    </div>
                    </div>
                </div>
            </div>
        </div>
        )
    }
}
export default PreviewModal