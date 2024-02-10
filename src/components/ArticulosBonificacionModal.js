import React, {Component} from 'react';
import { config } from "../libs/utils/Const";
import $ from 'jquery';
import {ApiClient} from "../libs/apiClient/ApiClient";
let apiClient = ApiClient.getInstance();

class ArticulosBonificacionModal extends Component {

    constructor(props) {
        super(props);

        this.state = {
            Cond : [],
        };
    };

    CloseArticulosBonificacion = ()=>{
        $('#exampleModalBonificacion').modal('hide');
    }
    hadleChangeTable = key => {
        const {createPromo} = this.state;
       let  value= key.target.value;
       this.search(value)
       createPromo.buscarLikeTable = value

        this.setState({
            createPromo
        });
    }

    
    
    render (){
        const {createPromo,items,selectItemsBonification} = this.props;
        const {Cond} = this.state;
        return (
        <div> 
            {/*--------------- MODAL ARTICULOS BONIFICACIONES ---------------*/}
            <div className="modal fade" tabindex="-1" id="exampleModalBonificacion" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog " role="document">
                    <div className="modal-content">
                    <div className="modal-header text-white" style={{background: '#2d75bd', borderRadius: '0' }}>
                        <h5 className="modal-title" id="exampleModalLabel">Artículos Bonificaciones</h5>
                        <button type="button" className="close" onClick={this.CloseArticulosBonificacion} aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                            <input
                                id="searchItem"
                                type="search"
                                className="form-control"
                                placeholder="Buscar artículo"
                                autoComplete="off"
                                // value={createPromo.buscarBoniLikeTable ? createPromo.buscarBoniLikeTable : '' } onChange={this.hadleChangeBoniTable}
                                />
                                &nbsp;
                            <div style={{/*marginBottom: 0, height: 370, maxHeight: 370, width:470, maxWidth:470,overflow: 'auto'*/}}> 
                                <table className="table scroll" >
                                    <thead style={{textAlign: "-webkit-center"}}>
                                        <tr className="text-light bg-primary" >
                                        {/* <th scope="col">#</th> */}
                                        <th scope="col">Artículo</th>
                                        <th scope="col">Descripción</th>
                                        <th scope="col"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {items.map((item, index) => {
                                            return (<tr key={index}>
                                                {/* <th scope="row">{index+1}</th> */}
                                                <td>{item.ItemCode}</td>
                                                <td>{item.ItemName}</td>
                                                <td>
                                                    {/* <input id="selectItem" type="hidden" value={index}/> */}
                                                    <button
                                                        className="btn btn-sm"
                                                        type="button"
                                                        style={{ backgroundColor: config.navBar.iconBackground, color: config.navBar.iconModal }}
                                                        onClick={() => selectItemsBonification(item.ItemCode)}> 
                                                        <i className="fas fa-plus-circle"></i> 
                                                    </button>
                                                </td>
                                            </tr>)
                                        })}
                                    </tbody>
                                </table>
                            </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={this.CloseArticulosBonificacion}>Cerrar</button>
                    </div>
                    </div>
                </div>
            </div>
        </div>
        )
    }
}
export default ArticulosBonificacionModal