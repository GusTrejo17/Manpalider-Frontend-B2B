import React from "react";
import moment from "moment";
import CurrencyFormat from 'react-currency-format';
import {config} from "../libs/utils/Const";

class ReportModal extends React.Component {
  render() {
    const {date, data, user, SubTotal, seller, currentCart,} = this.props;
    if(data.length === 0){
      return <div></div>;
    }
    // PDF CARRITOS GUARDADOS 'BOTON DETALLE'
    return (
      <div className="d-flex flex-column" style={{ marginTop: "20px" }}>
        {/* Cabecera información */}
        <div className="d-flex flex-row">
          <div>
            <img
              style={{ width: "80%", height: "auto" }}
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
              <h2 style={{ fontWeight: "bold" }}>Cotización</h2>
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
                    style={{ border: "0px solid #ddd", textAlign: "center", fontWeight: "bold",
                    }}
                    className="font-weight-bold"
                  >
                    {currentCart? currentCart.CardCode : 'N/A'}
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

            {/* Tabla información de carrito */}
            <table style={{ width: "90%", borderCollapse: "collapse" }}>
              <tr style={{ backgroundColor: "#0060EA", color: "white" }}>
                <th style={{ border: "0px solid #ddd", textAlign: "center" }}>
                  Nº Carrito
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
                  {currentCart ? currentCart.id : '--'}
                </td>
                <td
                  style={{ border: "0px solid #ddd", textAlign: "center" }}
                  className="font-weight-bold"
                >
                  {date ? date : 'N/A'}
                </td>
                <td
                  style={{ border: "0px solid #ddd", textAlign: "center" }}
                  className="font-weight-bold"
                >
                  {seller ? (seller.firstName || '') + ' ' + (seller.lastName || '') : 'N/A'}
                </td>
              </tr>
            </table>
          </div>
        </div>
        <div
          className="d-flex justify-content-around"
          style={{ marginTop: "100px" }}
        >
          {/* Tabla productos de carrito */}
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tr style={{ backgroundColor: "#0060EA", color: "white" }}>
              {/* <th style={{ visibility: "hidden" }}>a</th> */}
              <th style={{ border: "0px solid #ddd", textAlign: "center" }}>
                Cód. Fabricante
              </th>
              <th style={{ border: "0px solid #ddd", textAlign: "center" }}>
                Código SAP
              </th>
              <th style={{ border: "0px solid #ddd", textAlign: "center" }}>
                Descripción
              </th>
              <th style={{ border: "0px solid #ddd", textAlign: "center" }}>
                Cantidad
              </th>
              <th style={{ border: "0px solid #ddd", textAlign: "center" }}>
                Precio
              </th>
              <th style={{ border: "0px solid #ddd", textAlign: "center" }}>
                Precio total
              </th>
              {/* <th style={{ visibility: "hidden" }}>a</th> */}
            </tr>
            {!!data &&
              data.map((item, index) => {
                return (
                  <tr key={index}>
                    {/* <th style={{ visibility: "hidden" }}>a</th> */}
                    <th style={{ textAlign: "center" }}>{item.SuppCatNum ? item.SuppCatNum : '--'}</th>
                    <th style={{ textAlign: "center" }}>{item.ItemCode ? item.ItemCode : 'N/A'}</th>
                    <th style={{ textAlign: "left" }}>{item.ItemName ? item.ItemName : 'N/A'}</th>
                    <th style={{textAlign: 'center'}}>{item.Quantity>=0 ?item.Quantity : '--'}</th>
                    <th style={{ textAlign: "center" }}>
                      {/* ${" "}
                      {Number(
                        item.Price -
                          (item.Price * (item.Discount || 0 / 100)) / 100
                      ).toFixed(2)} */}
                      <CurrencyFormat
                        value={item.Price - (item.Price * (item.Discount || 0 / 100)) / 100 ?? "0"}
                        displayType={'text'}
                        thousandSeparator={true}
                        fixedDecimalScale={true}
                        decimalScale={2}
                        prefix={'$ '}
                        suffix={config.general.currency}>
                      </CurrencyFormat>
                    </th>
                    <th style={{ textAlign: "center" }}>
                      {/* ${" "} */}
                      {item.newTotal
                        ? 
                        // Number(item.newTotal).toFixed(2)
                        <CurrencyFormat
                          value={item.newTotal ?? "0"}
                          displayType={'text'}
                          thousandSeparator={true}
                          fixedDecimalScale={true}
                          decimalScale={2}
                          prefix={'$ '}
                          suffix={config.general.currency}>
                        </CurrencyFormat>
                        : 
                        // Number(
                        //     (
                        //       item.Price -
                        //       (item.Price * (item.Discount || 0 / 100)) / 100
                        //     ).toFixed(2) * item.Quantity
                        //   ).toFixed(2)
                        <CurrencyFormat
                          value={item.Price - (item.Price * (item.Discount || 0 / 100)) / 100 ?? "0"}
                          displayType={'text'}
                          thousandSeparator={true}
                          fixedDecimalScale={true}
                          decimalScale={2}
                          prefix={'$ '}
                          suffix={config.general.currency}>
                        </CurrencyFormat>
                          }
                    </th>
                    {/* <th style={{ visibility: "hidden" }}>a</th> */}
                  </tr>
                );
              })}
          </table>
        </div>

        {/* Tabla total de total */}
        <div className="container m-6">
          <div className="row justify-content-end">
            <div>
              <table className="p-3 ">
                <tr>
                  <th colspan="7" className="text-right"></th>
                </tr>
                <tr>
                  <th
                    style={{
                      padding: "5px",
                      border: "0px solid #ddd",
                      backgroundColor: "#0060EA",
                    }}
                    className="text-center text-white font-weight-bold"
                  >
                    Subtotal
                  </th>
                  <td className="font-weight-bold">
                    {/* $ {parseFloat(SubTotal).toFixed(2)} MXN */}
                    <CurrencyFormat
                      value={SubTotal ?? "0"}
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
                    style={{
                      border: "0px solid #ddd",
                      backgroundColor: "#0060EA",
                    }}
                    className="text-center text-white font-weight-bold"
                  >
                    IVA 16%
                  </th>
                  <td className="font-weight-bold">
                    {/* $ {parseFloat(SubTotal * 0.16).toFixed(2)} MXN */}
                    <CurrencyFormat
                      value={SubTotal * 0.16 ?? "0"}
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
                    style={{
                      border: "0px solid #ddd",
                      backgroundColor: "#0060EA",
                    }}
                    className="text-center text-white font-weight-bold"
                  >
                    Total
                  </th>
                  <td className="font-weight-bold">
                    {/* $ {parseFloat(SubTotal * 0.16 + SubTotal).toFixed(2)} MXN */}
                    <CurrencyFormat
                      value={SubTotal * 0.16 + SubTotal ?? "0"}
                      displayType={'text'}
                      thousandSeparator={true}
                      fixedDecimalScale={true}
                      decimalScale={2}
                      prefix={'$ '}
                      suffix={config.general.currency}>
                    </CurrencyFormat>
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ReportModal;
