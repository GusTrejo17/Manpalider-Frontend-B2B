import React from "react";
import moment from "moment";
import CurrencyFormat from 'react-currency-format';
import {config} from "../libs/utils/Const";

class ReportModalBill extends React.Component {
  render() {
    const { data, user } = this.props;
    if(data.length === 0){
      return (
        <div></div>
      );
    }
    //PDF Todas las FACTURAS
    return (
      <div className="d-flex flex-column mt-5" style={{padding: '50px'}}>
        {/* Cabecera información */}
        <div className="d-flex flex-row">
          <div>
            <img
              style={{ width: "80%", height: "auto" }}
              src={config.Back.icon}
              alt="Logo"
            />
            <br />
            <div>
              <h2 class="mt-4 text-left font-weight-bold">
                Manpalider
              </h2>
              {/* <h5 class="mb-2 text-left">Av. 1a Avenida #1495 Piso 6 Col.</h5> */}
              {/* <h5 class="text-left">Las Cumbres CP 64610 Monterrey, N.L.</h5> */}
            </div>
          </div>

          <div
            className="d-flex justify-content-end"
            style={{
              flexWrap: "wrap", alignItems: "flex-end", justifyContent: "flex-end", content: "center", marginLeft: "auto"
            }}
          >
            <div style={{ textAlign: "center" }}>
              <h2 style={{ fontWeight: "bold" }}>LISTADO GENERAL DE FACTURAS</h2>
            </div>

            {/* Tabla información de cliente */}
            <table style={{ width: "90%", borderCollapse: "collapse", textAlign: "center" }}>
              <thead>
                <tr style={{ backgroundColor: config.Back.color, color: "white" }}>
                  <th style={{ border: "0px solid #ddd", textAlign: "center" }}>
                    Nº Cliente
                  </th>
                  <th style={{ border: "0px solid #ddd", textAlign: "center" }}>
                    Nombre
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td
                    style={{ border: "0px solid #ddd", textAlign: "center", fontWeight: "bold" }}
                    className="font-weight-bold"
                  >
                    {user ? user.CardCode : 'N/A'}
                  </td>
                  <td
                    style={{ border: "0px solid #ddd", textAlign: "center" }}
                    className="font-weight-bold"
                  >
                    {user ? user.CardName : 'N/A'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Tabla info body */}
        <div className="mt-5 d-flex flex-column bd-highlight text-center">
          <table className='text-center' style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tr style={{ backgroundColor: '#0060EA', paddingTop: '12px', paddingBottom: '12px', /*textAlign: 'left',*/ color: 'white' }}>
              <th>Fecha de contabilización</th>
              <th>No. de factura</th>
              <th>Documento origen</th>
              <th>No. de relación</th>
              <th>Fecha de vencimiento</th>
              <th>Valor total</th>
              <th>Total pagado</th>
              <th>Estado</th>
              <th>Entregado</th>
              <th>Guía cargada</th>
            </tr>
            {!!data && data.map((order, index) => {
              return (
                <tr>
                  <th>{order.DocDate ? moment(order.DocDate).utc().format('YYYY-MM-DD') : 'N/A'}</th>
                  <th>{order.DocNum ? order.DocNum : '--'}</th>
                  <th>{order.BaseType === 17 ? "Pedido" : order.BaseType === 15 ? "Entrega" : 'N/A'}</th>
                  <th>{order.BaseRef ? order.BaseRef : ''}</th>
                  <th>{order.DocDueDate ? moment(order.DocDueDate).utc().format('YYYY-MM-DD') : 'N/A'}</th>
                  {/* <th>{order.DocTotal ? '$ ' + parseFloat(order.DocTotal).toFixed(2) + ' MXN' : '--'}</th> */}
                  <th><CurrencyFormat
                    value={order.DocTotal ?? "0"}
                    displayType={'text'}
                    thousandSeparator={true}
                    fixedDecimalScale={true}
                    decimalScale={2}
                    prefix={'$ '}
                    suffix={config.general.currency}>
                  </CurrencyFormat>
                  </th>
                  {/* <th>{order.PaidToDate ? '$' + parseFloat(order.PaidToDate).toFixed(2) + ' MXN' : '$ 0.00 MXN'}</th> */}
                  <th><CurrencyFormat
                    value={order.PaidToDate ?? "0"}
                    displayType={'text'}
                    thousandSeparator={true}
                    fixedDecimalScale={true}
                    decimalScale={2}
                    prefix={'$ '}
                    suffix={config.general.currency}>
                  </CurrencyFormat>
                  </th>
                  <th>{order.DocStatus === 'O' ? "Abierta" : "Cerrada"}</th>
                  <th>{order.U_Entregado || 'NO'}</th>
                  <th>{order.U_TipoarticuloOV || ''}</th>
                </tr>
              );
            })
            }
          </table>
        </div>
      </div>
    );
  }
}

export default ReportModalBill;