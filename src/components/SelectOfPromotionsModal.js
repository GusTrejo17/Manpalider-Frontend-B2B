import React, {Component} from 'react';
import $ from 'jquery';
import '../App.css';
import '../index.css';

class SelectOfPromotionsModal extends Component {
    CloseModal = ()=>{
        $('#modalSeleccted').modal('hide');
    }

    OpenPreview = ()=>{
        $('#modalPreview').modal('show');
    }

    render (){
        const {createPromo,openItemsClick,itemsSelected,deleteItemsSelected,enableGlobalQuantity,onChangeQuantityVenta,packagesInfo,onChangeQuantityBonificacion} = this.props;
        return (
            <div className="modal fade bd-example-modal-xl modal-open scroll" id="modalSeleccted" tabindex="1" role="dialog"  aria-labelledby="exampleModalLabel" aria-hidden="true" style={{overflowY: 'scroll'}}>
                <div className="modal-dialog modal-xl">
                    <div className="modal-content" style={{position:'center'}}>
                    <div className="modal-content">
                        <div className="modal-header text-light" style={{background: '#0060EA', borderRadius: '0' }}>
                            <h5 className="modal-title" id="modal-basic-title ">Artículos de bonificación {packagesInfo === 1 ? 'automatica': ' a seleccionar'}</h5>

                            <button type="button" className="close" onClick={this.CloseModal} aria-label="Close">
                            <span aria-hidden="true" className="white-text">&times;</span>
                            </button>
                        </div>

                        <div className="modal-body">
                            {/*---------------------------------------------------------- NO BORRAR -------------------------------------------------------------------*/}

                            {/* BUSQUEDA DE ARTÍCULOS EN VENTA */}
                            <div className="form-group row">
                                <div className="col-md-12">
                                    <div className="form-group row">
                                        <div className="col-md-6 row justify-content-center text-center" >
                                            <h3>Venta</h3>
                                        </div>
                                        <div className="col-md-6 row justify-content-center text-center">
                                        </div>
                                        <div className="col-md-6">
                                            <div className="row justify-content-center text-center">
                                                <div className="col-md row">
                                                    <input
                                                        id="searchItem"
                                                        // disabled = {disableSearches}
                                                        type="search"
                                                        className="form-control col-md-8"
                                                        autoComplete="off"
                                                        placeholder="Buscar artículo"
                                                        // onKeyPress={(ev) => {
                                                        //     if (ev.key === 'Enter') {
                                                        //         this.openItems();
                                                        //     }}}
                                                        // value={createPromo.buscarLike ? createPromo.buscarLike : '' } onChange={this.hadleChange}
                                                    />
                                                    <button className="col-md-4" type="button" id="btnVenta" 
                                                    // disabled = {disableSearches}
                                                        style={{
                                                            backgroundColor: 'transparent',
                                                            padding: 5,
                                                            color: 'green',
                                                            paddingTop: 2,
                                                            paddingBottom: 2,
                                                        }}
                                                        className="btn"
                                                        onClick={() =>openItemsClick(1)}
                                                        >
                                                        <i className="fa fa-plus-circle" aria-hidden="true" size="10"/>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="justify-content-right">
                                                <button type="button" className="btn btn-success float-right" 
                                                    style={{display: 'none'}} 
                                                    //style={{display:createPromo.typeVol === '1' ? 'block' : 'none'}} 
                                                    onClick={this.OpenPreview}>Vista Previa</button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* TABLA ARTÍCULOS EN VENTA */}
                                    <div className="row">
                                        <div className="col-lg-12">
                                            <div className="table-responsive">
                                                <table className="table table-striped" >
                                                    <thead>
                                                        <tr style={{backgroundColor:"#0060EA", color:'white'}}>
                                                        <th scope="col" className = "align-middle text-center"></th>
                                                            <th scope="col" className = "align-middle text-center" style={{width:'10%', paddingLeft:'0px', paddingRight:'0px'}}>Unidad</th>
                                                            {createPromo.typeVol === '2' ? <th scope="col" className = "align-middle text-center" style={{width:'8%',paddingLeft:'0px', paddingRight:'0px'}}>Cantidad</th>: ''}
                                                            <th scope="col" className = "align-middle text-center" style={{width:'13%'}}>Artículo</th>
                                                            <th scope="col" className = "align-middle text-center" style={{width:'25%'}}>Descripción</th>
                                                            {createPromo.typeVol === '1' ? <th scope="col" className = "align-middle text-center" style={{width:'8%',paddingLeft:'0px', paddingRight:'0px'}}>Cantidad</th>: ''}
                                                            <th scope="col" className = "align-middle text-center" style={{width:'50%'}}>Bonificación</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        { !!itemsSelected && itemsSelected.map((item, itemIndex ) => {
                                                            return(
                                                            <tr> 
                                                                <td className="align-middle text-center"
                                                                        style={{
                                                                            //backgroundColor: item.LineStatus ? 'rgb(210,210,210)' : '#FFF',
                                                                           }}>
                                                                        <i className="fas fa-trash-alt" data-toggle="tooltip"  
                                                                            title={'Eliminar articulo'}
                                                                            style={{
                                                                                backgroundColor: 'transparent',
                                                                                padding: 5,
                                                                                color: '#c42222',
                                                                                paddingTop: 2,
                                                                                paddingBottom: 2, 
                                                                                // width:'4%'
                                                                            }} 
                                                                            aria-hidden="true" 
                                                                            size="10"
                                                                            onClick = {()=>deleteItemsSelected(1,itemIndex)}/>
                                                                </td>
                                                                <td scope="col" className = "align-middle text-center" style={{width:'10%', paddingLeft:'0px', paddingRight:'0px',fontSize: 11}}>Unidad</td>

                                                                { enableGlobalQuantity == false && createPromo.typeVol === '2' && 
                                                                    <td className = "align-middle text-center" style={{width:'8%',fontSize: 11}}>
                                                                        <input className="form-control sm-1 text-center" type="text" value = {item.quantity }  onChange={(event)=>onChangeQuantityVenta(event, itemIndex)}/>
                                                                    </td> }
                                                                {/* { enableGlobalQuantity == true && index < 1 &&
                                                                <td rowSpan = {itemsSelected.length} className = "align-middle text-center">
                                                                    <input className="form-control sm-1 text-center" type="text" onChange={event =>onChangeGlobalQuantity(event)} value = { globalQuantityValidate }/>
                                                                </td>
                                                                } */}       
                                                                <td className = "align-middle text-center" style={{width:'13%', paddingLeft:'0px', paddingRight:'0px',fontSize: 11}}>{item.itemCode}</td>

                                                                <td className = "align-middle text-center" style={{width:'25%', paddingLeft:'0px', paddingRight:'0px',fontSize: 10}}>{item.itemName}</td>
                                                    
                                                                { createPromo.typeVol === '1' && itemIndex > 0 &&
                                                                    <td className = "align-middle" style={{width:'60%'}}></td>
                                                                }   

                                                                { enableGlobalQuantity == true && createPromo.typeVol === '1' && itemIndex < 1 &&
                                                                    <td rowSpan={itemsSelected.length} className = "align-middle text-center" style={{width:'8%'}}>
                                                                        <input className="form-control sm-1 text-center" type="text" value = {item.quantity }  onChange={(event)=>onChangeQuantityVenta(event, itemIndex)}/>
                                                                    </td> 
                                                                }

                                                                { packagesInfo === 2 && createPromo.typeVol === '1' && itemIndex < 1 && <td
                                                                    className="sticky-columns align-middle text-center"
                                                                    style={{
                                                                        backgroundColor: item.LineStatus ? 'rgb(210,210,210)' : '#FFF', 
                                                                        textAlign: 'center'}}>
                                                                    <button className="btn col-md-4" type="button" id="btnCombo" 
                                                                        data-toggle="tooltip"  title={'Agregar paquete'}
                                                                        style={{
                                                                            backgroundColor: 'transparent',
                                                                            padding: 5,
                                                                            color: 'green',
                                                                            paddingTop: 2,
                                                                            paddingBottom: 2,
                                                                        }}
                                                                        // className="btn"
                                                                        onClick={() =>openItemsClick(2,itemIndex)}>
                                                                        <i className="fa fa-plus-circle" aria-hidden="true" size="10"/>
                                                                    </button>
                                                                </td>}


                                                                { packagesInfo === 2 && createPromo.typeVol === '2' && <td
                                                                    className="sticky-columns align-middle text-center"
                                                                    style={{
                                                                        //backgroundColor: item.LineStatus ? 'rgb(210,210,210)' : '#FFF', 
                                                                        textAlign: 'center'}}>
                                                                    <button className="btn col-md-4" type="button" id="btnCombo" 
                                                                        data-toggle="tooltip"  title={'Agregar paquete'}
                                                                        style={{
                                                                            backgroundColor: 'transparent',
                                                                            padding: 5,
                                                                            color: 'green',
                                                                            paddingTop: 2,
                                                                            paddingBottom: 2,
                                                                        }}
                                                                        // className="btn"
                                                                        onClick={() =>openItemsClick(2,itemIndex)}>
                                                                        <i className="fa fa-plus-circle" aria-hidden="true" size="10"/>
                                                                    </button>
                                                                </td>}
                                                                   
                                                                {createPromo.typeVol === '1' && itemIndex < 1 &&
                                                                <td className = "align-middle text-center" style={{width:'50%',}}>
                                                                {/* &nbsp; {bonificacion.itemQuantity} */}
                                                                    {item.bonificacion.map((combo, indexCombo)=>{
                                                                        return (
                                                                            <div style={{border: '2px solid #000', borderRadius: '10px',marginBottom: '0px', padding : '5px'}}>
                                                                            {combo.map((bonificacion, indexBoni)=>{
                                                                                return (
                                                                                    <div className="row" >
                                                                                        <div className="col-md-2">
                                                                                            <div scope="col" className="align-middle text-center">Unidad</div>
                                                                                            <div className = "align-middle"> 
                                                                                                <input className="form-control sm-1 text-center" type="text" value = {bonificacion.quantity}  onChange={(event)=>onChangeQuantityBonificacion(event, itemIndex, indexCombo, indexBoni)}/>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="col-md-9" style={{paddingLeft: '0px', paddingRight: '0px'}}>
                                                                                            <div className = "align-middle" style={{fontSize: 12}}>{bonificacion.itemCode}</div>
                                                                                            <div className = "align-middle" style={{fontSize: 12}}>{bonificacion.itemName}</div>
                                                                                        </div>
                                                                                        <div className="col-md-1">
                                                                                            <div className = "sticky-columns align-middle text-center"
                                                                                                style={{
                                                                                                    backgroundColor: item.LineStatus ? 'rgb(45, 117, 189)' : '#FFF',
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
                                                                                                    className="btn"
                                                                                                    onClick = {()=>deleteItemsSelected(3,itemIndex,indexCombo,indexBoni)}>
                                                                                                    <i className="fas fa-trash-alt" 
                                                                                                    aria-hidden="true" size="10"/>
                                                                                                </button>
                                                                                            </div>
                                                                                        </div>   
                                                                                    </div>
                                                                                )
                                                                            })}
                                                                            <div>
                                                                                <button className="col-md-4" type="button" id="btnCombo" 
                                                                                data-toggle="tooltip"  title={`Agregar artículo al paquete ${indexCombo + 1}`}
                                                                                    style={{
                                                                                        backgroundColor: 'transparent',
                                                                                        padding: 5,
                                                                                        color: 'green',
                                                                                        paddingTop: 2,
                                                                                        paddingBottom: 2,
                                                                                    }}
                                                                                    className="btn"
                                                                                    onClick={() =>openItemsClick(3,itemIndex,indexCombo)}>
                                                                                    <i className="fa fa-plus-circle" aria-hidden="true" size="10"/>
                                                                                </button>
                                                                                { packagesInfo === 2  &&   <button className="col-md-4" type="button" id="btnCombo" 
                                                                                    data-toggle="tooltip"  title={`Eliminar paquete ${indexCombo + 1}`}
                                                                                    style={{
                                                                                        backgroundColor: 'transparent',
                                                                                        padding: 5,
                                                                                        color: '#c42222',
                                                                                        paddingTop: 2,
                                                                                        paddingBottom: 2,
                                                                                    }}
                                                                                    className="btn"
                                                                                    onClick = {()=>deleteItemsSelected(2,itemIndex,indexCombo)}>
                                                                                    <i className="fas fa-trash-alt" 
                                                                                         aria-hidden="true" size="10"/>
                                                                                </button>}
                                                                            </div>
                                                                    </div> 
                                                                        )
                                                                    })}
                                                                </td>}

                                                                {createPromo.typeVol === '2' &&
                                                                    <td className = "align-middle text-center" style={{width:'50%',}}>
                                                                    {/* &nbsp; {bonificacion.itemQuantity} */}
                                                                        {item.bonificacion.map((combo, indexCombo)=>{
                                                                            return (
                                                                                <div style={{border: '2px solid #000', borderRadius: '10px', padding : '10px'}}>
                                                                                {combo.map((bonificacion, indexBoni)=>{
                                                                                    return (
                                                                                        <div className="row">
                                                                                             {/* style={{paddingLeft: '5px', paddingRight: '5px'}} */}
                                                                                            <div className="col-md-2">
                                                                                                <div scope="col" className="align-middle text-center">Unidad</div>
                                                                                                <div className = "align-middle"> 
                                                                                                    <input className="form-control sm-1 text-center" type="text" value = {bonificacion.quantity }  onChange={(event)=>onChangeQuantityBonificacion(event, itemIndex, indexCombo, indexBoni)}/>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="col-md-9" style={{paddingLeft: '0px', paddingRight: '0px'}}>
                                                                                                <div className = "align-middle" style={{fontSize: 12}}>{bonificacion.itemCode}</div>
                                                                                                <div className = "align-middle" style={{fontSize: 12}}>{bonificacion.itemName}</div>
                                                                                            </div>
                                                                                            <div className="col-md-1">
                                                                                                <div className = "sticky-columns align-middle text-center"
                                                                                                    style={{
                                                                                                        backgroundColor: item.LineStatus ? 'rgb(45, 117, 189)' : '#FFF',
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
                                                                                                        className="btn"
                                                                                                        onClick = {()=>deleteItemsSelected(3,itemIndex,indexCombo,indexBoni)}>
                                                                                                        <i className="fas fa-trash-alt" 
                                                                                                        aria-hidden="true" size="10"/>
                                                                                                    </button>
                                                                                                </div>
                                                                                            </div>   
                                                                                        </div>
                                                                                    )
                                                                                })}
                                                                                <div>
                                                                                    <button className="col-md-4" type="button" id="btnCombo" 
                                                                                    data-toggle="tooltip"  title={`Agregar artículo al paquete ${indexCombo + 1}`}
                                                                                        style={{
                                                                                            backgroundColor: 'transparent',
                                                                                            padding: 5,
                                                                                            color: 'green',
                                                                                            paddingTop: 2,
                                                                                            paddingBottom: 2,
                                                                                        }}
                                                                                        className="btn"
                                                                                        onClick={() =>openItemsClick(3,itemIndex,indexCombo)}>
                                                                                        <i className="fa fa-plus-circle" aria-hidden="true" size="10"/>
                                                                                    </button>
                                                                                    { packagesInfo === 2  &&   <button className="col-md-4" type="button" id="btnCombo" 
                                                                                        data-toggle="tooltip"  title={`Eliminar paquete ${indexCombo + 1}`}
                                                                                        style={{
                                                                                            backgroundColor: 'transparent',
                                                                                            padding: 5,
                                                                                            color: '#c42222',
                                                                                            paddingTop: 2,
                                                                                            paddingBottom: 2,
                                                                                        }}
                                                                                        className="btn"
                                                                                        onClick = {()=>deleteItemsSelected(2,itemIndex,indexCombo)}>
                                                                                        <i className="fas fa-trash-alt" 
                                                                                            aria-hidden="true" size="10"/>
                                                                                    </button>}
                                                                                </div>
                                                                        </div> 
                                                                            )
                                                                        })}
                                                                    </td>
                                                                }
                                                                
                                                            </tr>
                                                            )
                                                        })
                                                        }
                                                        
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button type="button" className="btn btn-success float-right" onClick={this.CloseModal}>Terminar selección</button> 
                            {/* onClick={() => this.finishSelection()} */}
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        )
    }

}


export default SelectOfPromotionsModal;