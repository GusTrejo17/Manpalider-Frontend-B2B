import React from "react";
import moment from "moment";
import CurrencyFormat from 'react-currency-format';
import {config} from "../libs/utils/Const";

class AutoPrintFormat extends React.Component {
  render() {
    const { orders, doc } = this.props;
    // PDF Documentos de autorización
    let totalPrecioTotal = 0;
    return (
      <div style={{ pageBreakBefore: 'always', padding: '50px' }}>
        <div className="d-flex flex-column" style={{ marginTop: "20px" }}>
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
              }}
            >
              <div style={{ textAlign: "center" }}>
                <h2 style={{ fontWeight: "bold" }}>Documentos de autorización</h2>
              </div>

              {/* Tabla información de cliente */}
              <table style={{ width: "90%", borderCollapse: "collapse" }}>
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
                      {orders ? orders.CardCode : "N/A"}
                    </td>
                    <td
                      style={{ border: "0px solid #ddd", textAlign: "center" }}
                      className="font-weight-bold"
                    >
                      {orders ? orders.CardName : "N/A"}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Tabla información de N° documento, fecha y vendedor */}
              <table style={{ width: "90%", borderCollapse: "collapse" }}>
                <tr style={{ backgroundColor: "#0060EA", color: "white" }}>
                  <th style={{ border: "0px solid #ddd", textAlign: "center" }}>
                    Nº Documento
                  </th>
                  <th style={{ border: "0px solid #ddd", textAlign: "center" }}>
                    Fecha
                  </th>
                  <th style={{ border: "0px solid #ddd", textAlign: "center" }}>
                    Vendedor
                  </th>
                </tr>
                <tr>
                  <td
                    style={{ border: "0px solid #ddd", textAlign: "center" }}
                    className="font-weight-bold"
                  >
                    {orders ? orders.DocEntry : "N/A"}
                  </td>
                  <td
                    style={{ border: "0px solid #ddd", textAlign: "center" }}
                    className="font-weight-bold"
                  >
                    {doc && doc.data && doc.data.header && doc.data.header.length > 0 ?
                      moment(doc.data.header[0].TaxDate).utc().format('DD-MM-YYYY') : "N/A"}
                  </td>
                  <td
                    style={{ border: "0px solid #ddd", textAlign: "center" }}
                    className="font-weight-bold"
                  >
                    {doc?.data?.header?.[0]?.U_FMB_Handel_Creador
                      ? doc.data.header[0].U_FMB_Handel_Creador.split(",")[1]?.trim() ?? "N/A"
                      : "N/A"}
                  </td>
                </tr>
              </table>

            </div>
          </div>

          {/* Tabla info body */}
          <div className="mt-5 d-flex flex-column bd-highlight text-center">
            <table>
              <tr className="text-white text-center" style={{ backgroundColor: "#0060EA" }}>
                <th>Cód. Fabricante</th>
                <th>Cód. SAP</th>
                <th>Descripción</th>
                <th>Cantidad</th>
                <th>Precio</th>
                <th>Precio con IVA</th>
                <th>Precio total con IVA</th>
              </tr>
              {!!doc &&
                doc.data.body.map((item, index) => {
                  const precioTotalItem = parseFloat(item.LineTotal);
                  totalPrecioTotal += precioTotalItem;
                  return (
                    <tr className='text-center' key={index}>
                      <th>{item.SuppCatNum || item.DocEntry ? item.SuppCatNum || item.DocEntry : 'N/A'}</th>
                      <th>{item.ItemCode ? item.ItemCode : '--'}</th>
                      <th>{item.ItemName ? item.ItemName : 'N/A'}</th>
                      <th>{item.Quantity ? item.Quantity : '--'}</th>
                      {/* <th>{item.Price ? `$ ${parseFloat(item.Price).toFixed(2)} MXN` : '--'}</th> */}
                      <th><CurrencyFormat
                        value={item.Price ?? "0"}
                        displayType={'text'}
                        thousandSeparator={true}
                        fixedDecimalScale={true}
                        decimalScale={2}
                        prefix={'$ '}
                        suffix={config.general.currency}>
                      </CurrencyFormat>
                      </th>
                      {/* <th>{item.Price ? `$ ${parseFloat(item.Price * 0.16).toFixed(2)} MXN` : '--'}</th> */}
                      <th><CurrencyFormat
                        value={item.Price * 0.16 ?? "0"}
                        displayType={'text'}
                        thousandSeparator={true}
                        fixedDecimalScale={true}
                        decimalScale={2}
                        prefix={'$ '}
                        suffix={config.general.currency}>
                      </CurrencyFormat>
                      </th>
                      {/* <th>{item.Price ? `$ ${parseFloat(item.Price * 0.16 + item.Price).toFixed(2)} MXN` : '--'}</th> */}
                      <th><CurrencyFormat
                        value={item.Price * 0.16 + item.Price ?? "0"}
                        displayType={'text'}
                        thousandSeparator={true}
                        fixedDecimalScale={true}
                        decimalScale={2}
                        prefix={'$ '}
                        suffix={config.general.currency}>
                      </CurrencyFormat>
                      </th>
                    </tr>
                  );
                })}
            </table>
          </div>

          {/* Tabla total de total */}
          <div className="d-flex justify-content-end mt-5 text-center">
            <table className="font-weight-bold">
              <tr>
                <th
                  className="text-white p-2"
                  style={{ backgroundColor: "#0060EA" }}
                >
                  Subtotal
                </th>
                {/* <td> {totalPrecioTotal ? `$ ${totalPrecioTotal.toFixed(2)} MXN` : '--'} </td> */}
                <td>
                  <CurrencyFormat
                    value={totalPrecioTotal ?? "0"}
                    displayType={'text'}
                    thousandSeparator={true}
                    fixedDecimalScale={true}
                    decimalScale={2}
                    prefix={'$ '}
                    suffix={config.general.currency}>
                  </CurrencyFormat>
                </td>
              </tr>
              <tr>
                <th
                  className="text-white"
                  style={{ backgroundColor: "#0060EA" }}
                >
                  IVA 16%
                </th>
                {/* <td> {totalPrecioTotal ? `$ ${(totalPrecioTotal * 0.16).toFixed(2)} MXN` : '--'} </td> */}
                <td>
                  <CurrencyFormat
                    value={totalPrecioTotal * 0.16 ?? "0"}
                    displayType={'text'}
                    thousandSeparator={true}
                    fixedDecimalScale={true}
                    decimalScale={2}
                    prefix={'$ '}
                    suffix={config.general.currency}>
                  </CurrencyFormat>
                </td>
              </tr>
              <tr>
                <th
                  className="text-white"
                  style={{ backgroundColor: "#0060EA" }}
                >
                  Total
                </th>
                <td>
                  {doc && doc.data && doc.data.header && doc.data.header.length > 0
                    // ? `$ ${doc.data.header[0].DocTotal}  MXN` : "--"
                    &&
                    <CurrencyFormat
                      value={doc.data.header[0].DocTotal ?? "0"}
                      displayType={'text'}
                      thousandSeparator={true}
                      fixedDecimalScale={true}
                      decimalScale={2}
                      prefix={'$ '}
                      suffix={config.general.currency}>
                    </CurrencyFormat>
                    }
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

export default AutoPrintFormat;
