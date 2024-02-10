import React from "react";
import moment from "moment";
import CurrencyFormat from 'react-currency-format';
import {config} from "../libs/utils/Const";

class CollectPrintFormat extends React.Component {
  docChangeName(status) {
    let result = '';
    switch (status) {
      case '13':
        result = "Factura";
        break;
      case '24':
        result = "Pago";
        break;
      default:
        break;
    }
    return result;
  };
  render() {
    const { collect, user } = this.props;
    //PDF Cobranzas
    return (
      <div className="d-flex flex-column" style={{ padding: '50px' }}>
        {/* Cabecera información */}
        <div className="d-flex flex-row">
          <div>
            <img
              style={{ width: "300px"}}
              src="https://1.bp.blogspot.com/-XagdVdcXBRU/YSzzn_GC-1I/AAAAAAAAAc8/tZz_AfBA-asmmVtTBI7OY39B50LNPRHEQCLcBGAsYHQ/w945-h600-p-k-no-nu/logo%2BDIASA.png"
              alt="Logo"
            />
            <br />
            <div>
              <h2 class="mt-4 text-left font-weight-bold">
                Distribuidora Industrial de Abrasivos S.A. de C.V
              </h2>
              <h5 class="mb-2 text-left">Av. 1a Avenida #1495 Piso 6 Col.</h5>
              <h5 class="text-left">Las Cumbres CP 64610 Monterrey, N.L.</h5>
            </div>
          </div>

          <div
            className="d-flex justify-content-end"
            style={{
              flexWrap: "wrap",
              alignItems: "flex-end",
              justifyContent: "flex-end",
              content: "center",
              marginLeft: "auto"
            }}
          >
            <div style={{ textAlign: "center" }}>
              <h2 style={{ fontWeight: "bold" }}>Cobranzas</h2>
            </div>

            {/* Tabla información de cliente */}
            <table style={{ width: "90%", borderCollapse: "collapse", textAlign: "center" }}>
              <thead>
                <tr style={{ backgroundColor: "#0060EA", color: "white" }}>
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
                    style={{
                      border: "0px solid #ddd",
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
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
          <table className="text-center">
            <tr className="text-white" style={{ backgroundColor: "#0060EA" }}>
              <th>Fecha del documento</th>
              <th>Movimiento</th>
              <th>No. de transacción</th>
              <th>No. de cuenta</th>
              <th>Fecha de contabilización</th>
              <th>Cargo</th>
              <th>Abono</th>
              <th>Referencia</th>
            </tr>
            {!!collect && collect.map((item, index) => {
              return (
                <tr>
                  <th>{item.TaxDate ? moment(item.TaxDate).utc().format('YYYY-MM-DD') : "N/A"}</th>
                  <th>{item.TransType ? this.docChangeName(item.TransType) : 'N/A'}</th>
                  <th>{item.TransId ? item.TransId : 'N/A'}</th>
                  <th>{item.Account ? item.Account : 'N/A'}</th>
                  <th>{item.MthDate ? moment(item.MthDate).utc().format('YYYY-MM-DD') : "SIN FECHA DE PAGO"}</th>
                  {/* <th>{item.Debit ? '$ ' + item.Debit + ' MXN' : '$ 0.00 MXN'}</th> */}
                  <th><CurrencyFormat
                    value={item.Debit ?? "0"}
                    displayType={'text'}
                    thousandSeparator={true}
                    fixedDecimalScale={true}
                    decimalScale={2}
                    prefix={'$ '}
                    suffix={config.general.currency}>
                  </CurrencyFormat>
                  </th>
                  {/* <th>{item.Credit ? '$ ' + item.Credit + ' MXN' : '$ 0.00 MXN'}</th> */}
                  <th><CurrencyFormat
                    value={item.Credit ?? "0"}
                    displayType={'text'}
                    thousandSeparator={true}
                    fixedDecimalScale={true}
                    decimalScale={2}
                    prefix={'$ '}
                    suffix={config.general.currency}>
                  </CurrencyFormat>
                  </th>
                  <th>{item.Ref1 ? item.Ref1 : 'N/A'}</th>
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

export default CollectPrintFormat;