import React from "react";
import moment from "moment";
import {config} from "../libs/utils/Const";
class ExpiredInvoicesPrintFormat extends React.Component {
  render() {
    const {doc} = this.props;
    
    return(
    
          <div style={{pageBreakAfter: 'always', padding: '50px' }}>
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
                  <h4 style={{fontWeight:'bold'}}>{doc.message}</h4>
                </th>
                <th style={{visibility:'hidden'}}>a</th>
              </thead>
            </table>
            <table style={{width: '100%', borderCollapse: 'collapse'}}>
              <tr style={{backgroundColor:'#0078C0',paddingTop: '12px', paddingBottom: '12px', textAlign: 'left', color: 'white'}}>
                <th style={{visibility:'hidden'}}>a</th>
                <th style={{textAlign:'center'}}>Codigo del fabricante</th>
                <th style={{textAlign:'center'}}>Cantidad</th>
                <th style={{textAlign:'center'}}>Cantidad entregada</th>
                <th style={{textAlign:'center'}}>Cantidad faltante</th>
                <th style={{textAlign:'center'}}>Precio</th>
                <th style={{textAlign:'center'}}>Precio Total</th>
                <th style={{visibility:'hidden'}}>a</th>
              </tr>
              
              {!!doc && doc.data.body.map((item, index) => {
                return (
                        <tr>
                            <th style={{visibility:'hidden'}}>a</th>
                            <th style={{textAlign:'center'}}>{item.SuppCatNum}</th>
                            <th style={{textAlign:'center'}}>{item.Quantity}</th>
                            <th style={{textAlign:'center'}}>{item.DelivrdQty}</th>
                            <th style={{textAlign:'center'}}>{item.OpenQty}</th>
                            <th style={{textAlign:'right'}}>{'$'+ parseFloat(item.Price).toFixed(2) + ' MXN'}</th>
                            <th style={{textAlign:'right'}}>{'$'+ parseFloat(item.LineTotal).toFixed(2) + ' MXN'}</th>
                            <th style={{visibility:'hidden'}}>a</th> 
                        </tr>
                    );
                })
              }
            </table>
          </div>
      
    )
  }
}

export default ExpiredInvoicesPrintFormat;