import React, {Component} from 'react';
import { config } from "../libs/utils/Const";
import $ from 'jquery';
import {ApiClient} from "../libs/apiClient/ApiClient";
let apiClient = ApiClient.getInstance();

class CondicionesModal extends Component {

    constructor(props) {
        super(props);

        this.state = {
            Cond : [],
        };
    };

    CloseCondiciones = ()=>{
        $('#modalConditions').modal('hide');
    }

    async changeTypeSelectCond(event){
        const {createPromo} = this.props;
        const { buscarLikeCondiotions} = this.state;
        let condicion = document.getElementById('typeselectCond').value; //event.nativeEvent.target.value || 
        createPromo.typeSelectCond = condicion;
        let data = {
            condicion : condicion,
            value : buscarLikeCondiotions 
        }

        let datos = [];
            let conditions = await apiClient.searchConditions(data)
            datos = conditions.data.list;
        
        this.setState({
            createPromo,
            Cond: datos
        });
    };

    selectConditions = async (valor) => {
        const { arrayConditions } = this.props;
        const {Cond} = this.state;
        let bandera = false;
        Cond.map(condition => {
            
            arrayConditions.map(arr => {
                if(arr.value1 === valor){
                    bandera = true;
                    return;
                }
            })
            
            if(condition.value1 === valor && !bandera){
                let value1 = condition.value1;
                let value2 = condition.value2;
                let value3 = document.getElementById('typeselectCond').value;

                arrayConditions.push({value1, value2, value3})
            }
        })
        
        this.setState({
            arrayConditions: arrayConditions
        });
    };

    changeCondiotions = key => {
        const {createPromo} = this.state;
       let  value= key.target.value;
       this.changeTypeSelectCond(value)
        this.setState({
            buscarLikeCondiotions : value
        });
    }

    render (){
        const {arrayConditions,deleteCondition, createPromo} = this.props;
        const {buscarLikeCondiotions} = this.state;
        const {Cond} = this.state;
        return (
        <div> 
            {/*--------------- MODAL CONDICIONES ---------------*/}
            <div className="modal fade bd-example-modal-lg" id="modalConditions" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-xl" role="document">
                    <div className="modal-content">
                    <div className="modal-header text-light" style={{background: '#0060EA', borderRadius: '0' }}>
                        <h5 className="modal-title" id="exampleModalLabel">Condiciones</h5>
                        <button type="button" className="close" onClick={this.CloseCondiciones} aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <div className="form-group row">
                            <h6>Seleccione y configure el tipo de condición</h6>
                        </div>
                        <div className="form-group row">
                                <div className="col-md-12">
                                    <div className="form-group row">
                                        <div className="col-md-6">
                                            <div className="row justify-content-center text-center">
                                                <div className="col-md row">
                                                    <input
                                                        id="searchItem"
                                                        type="search"
                                                        className="form-control col-md-7"
                                                        autoComplete="off"
                                                        placeholder="Buscar"
                                                        value={buscarLikeCondiotions ? buscarLikeCondiotions : '' } onChange={this.changeCondiotions}
                                                    />&nbsp;
                                                    <select className="form-control text-light col-md-4" style={{background: '#2d75bd', borderRadius: '0' }} id="typeselectCond" value={createPromo.typeSelectCond || '0'} onChange={event =>this.changeTypeSelectCond(event || 0)}>
                                                        <option value="0">--seleccionar--</option>
                                                        <option value="Cliente">Cliente</option>
                                                        {/* <option value="Region">Región/Sucursal</option>
                                                        <option value="SubCanal">Sub canal</option>
                                                        <option value="Canal">Canal</option>                                                         */}
                                                    </select>
                                                </div>
                                            </div>
                                                <br/>                                               
                                        </div>
                                            
                                        <div className="col-md-6">
                                            <div className="row justify-content-center text-center">
                                                <div className="col-md row">
                                                    
                                                </div>
                                            </div>
                                                <br/>                                             
                                        </div>
                                    </div>

                                    {/* TABLA ARTÍCULOS EN VENTA */}
                                    <div className="row">
                                        <div className="col-lg-6">
                                            <div className='table-responsive' style={{/*height: 290, maxHeight: 290, overflow: 'auto', marginBottom: 0 */}}> 
                                                <table className="table scroll"> 
                                                    <thead style={{textAlign: "-webkit-center"}}>
                                                        <tr className="text-light bg-primary" >
                                                            <th scope="col-lg-auto" style={{width:'30%'}} className = "align-middle text-center">Código</th>
                                                            <th scope="col-lg-auto" style={{width:'60%'}} className = "align-middle text-center">Nombre</th>
                                                            <th scope="col-lg-auto" style={{width:'10%'}} className = "align-middle text-center"></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {!!Cond && Cond.map((item, index ) => {
                                                            return(
                                                                <tr>
                                                                <td scope="col-lg-auto" style={{width:'30%'}} className = "align-middle text-center">{item.value1}</td>
                                                                <td scope="col-lg-auto" style={{width:'60%'}} className = "align-middle text-center">{item.value2}</td>
                                                                                                                                    
                                                                <td scope="col-lg-auto" style={{width:'10%'}}>
                                                                    <button
                                                                        className="btn btn-sm align-middle text-center"
                                                                        type="button"
                                                                        style={{ backgroundColor: config.navBar.iconBackground, color: config.navBar.iconModal }}
                                                                        onClick={() => this.selectConditions(item.value1)}> 
                                                                        <i className="fas fa-plus-circle"></i> 
                                                                    </button>
                                                                </td>
                                                                </tr> )

                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>

                                        {/* TABLA DE ARTÍCULOS EN BONIFICACIÓN */}
                                        <div className="col-lg-6">
                                            <div className='table-responsive' style={{/*marginBottom: 0, height: 290, maxHeight: 290, overflow: 'auto'*/}}> 
                                                <table className="table scroll">
                                                    <thead style={{textAlign: "-webkit-center"}}>
                                                        <tr className="text-light bg-primary" >
                                                        <th scope="col-lg-auto" style={{width:'30%'}} className = "align-middle text-center">Código</th>
                                                        <th scope="col-lg-auto" style={{width:'60%'}} className = "align-middle text-center">Nombre</th>
                                                        <th scope="col-lg-auto" style={{width:'10%'}}></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {arrayConditions.length !== 0 && arrayConditions.map((item, index ) => {
                                                            return(
                                                            <tr>
                                                                <td scope="col-lg-auto" style={{width:'30%'}} className = "align-middle text-center">{item.value1}</td>
                                                                <td scope="col-lg-auto" style={{width:'60%'}} className = "align-middle text-center">{item.value2 || item.value3}</td>
                                                            
                                                                <td
                                                                    className="sticky-columns align-middle text-center"
                                                                    style={{
                                                                        backgroundColor: item.LineStatus ? 'rgb(210,210,210)' : '#FFF',
                                                                        textAlign: 'center',
                                                                        width:'10%'
                                                                    }}>
                                                                    {/*Eliminar*/}
                                                                    <button
                                                                        type="button"
                                                                        style={{
                                                                            backgroundColor: 'transparent',
                                                                            padding: 5,
                                                                            color: '#c42222',
                                                                            paddingTop: 2,
                                                                            paddingBottom: 2,
                                                                        }}
                                                                        className="btn"
                                                                        onClick={() => deleteCondition(index)}>
                                                                        <i className="fas fa-trash-alt" aria-hidden="true" size="10"/>
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                            )
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>                       
                                </div>                   
                            </div>
                            
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={this.CloseCondiciones}>Aceptar</button>
                    </div>
                    </div>
                </div>
            </div>
        </div>
        )
    }
}
export default CondicionesModal