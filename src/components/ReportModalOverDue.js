import React from "react";
import moment from "moment";
import {config} from "../libs/utils/Const";
class ReportModalOverDue extends React.Component {
  render() {
    const {data} = this.props;
    if(data.length === 0){
    return (
        <div></div>
    );
    }
    return (
      <div>
        <table style={{width: '100%'}}>
          <thead style={{textAlign: "-webkit-center"}}>
            <th style={{width:'300px',textAlign:'right', paddingTop:'70px'}}>
              <img style={{width: '100%', height:'auto'}} src={config.Back.icon} />
            </th>
            <th style={{textAlign:'center'}}>
              <h2 style={{fontWeight:'bold'}}>Manpalider</h2>
              {/* <h4>Av. 1a Avenida #1495 Piso 6 Col. Las Cumbres CP 64610</h4> */}
              {/* <h4>Monterrey, N.L.</h4> */}
            </th>
            <th style={{width:' 50px',visibility:'hidden'}}><p>Oculto</p></th>
          </thead>
        </table>
        <br></br>
        <table style={{width: '100%'}}>
          <thead style={{textAlign: "-webkit-center"}}>
            <th style={{visibility:'hidden'}}>a</th>
            <th style={{textAlign:'center'}}>
              <h4 style={{fontWeight:'bold'}}>DETALLE DE LA FACTURA DE RESERVA</h4>
            </th>
            <th style={{visibility:'hidden'}}>a</th>
          </thead>
        </table>
        <table style={{width: '100%', borderCollapse: 'collapse'}}>
          <tr style={{backgroundColor:'#0060EA',paddingTop: '12px', paddingBottom: '12px', textAlign: 'left', color: 'white'}}>
            <th style={{visibility:'hidden'}}>a</th>
            <th style={{textAlign:'center'}}>No. documento</th>
            <th style={{textAlign:'center'}}>Fecha del documento</th>
            <th style={{textAlign:'center'}}>Fecha del vencimiento</th>
            <th style={{textAlign:'center'}}>Cant. de articulos</th>
            <th style={{textAlign:'center'}}>Cant. de unidades</th>
            <th style={{textAlign:'center'}}>Adeudo</th>
            <th style={{textAlign:'center'}}>Días transcurridos</th>
            <th style={{textAlign:'center'}}>Total</th>
            <th style={{visibility:'hidden'}}>a</th>
          </tr>
          {!!data && data.map((order, index) => {
             return (
                    <tr>
                        <th style={{visibility:'hidden'}}>a</th>
                        <th style={{textAlign:'center'}}>{order.DocNum}</th>
                        <th style={{textAlign:'center'}}>{moment(order.DocDate).utc().format('YYYY-MM-DD')}</th>                        
                        <th style={{textAlign:'center'}}>{moment(order.DocDueDate).utc().format('YYYY-MM-DD')}</th>
                        <th style={{textAlign:'center'}}>{parseInt(order.Cant)}</th>
                        <th style={{textAlign:'center'}}>{parseInt(order.Unit)}</th>
                        <th style={{textAlign:'right'}}>{'$'+ parseFloat(order.PORVENCER || 0).toFixed(2) + ' MXN'}</th>
                        <th style={{textAlign:'center'}}>{order.DIAS}</th>
                        <th style={{textAlign:'right'}}>{'$'+ parseFloat(order.DocTotal).toFixed(2) + ' MXN'}</th>
                        <th style={{visibility:'hidden'}}>a</th>
                    </tr>
                );
            })
           }
        </table>
      </div>
    );
  }
}

export default ReportModalOverDue;