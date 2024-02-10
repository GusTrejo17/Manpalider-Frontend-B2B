import React from "react";
import moment from "moment";
import CurrencyFormat from 'react-currency-format';
import {config} from "../libs/utils/Const";

class SavedCartsPrintFormat extends React.Component {
  render() {
    const { doc, seller, user, savedCart } = this.props;
    let totalPrecioTotal = 0;
    if (doc.length === 0 || !savedCart) {
      return <div></div>;
    }
    //PDF CARRITOS GUARDADOS 'boton arriba de la tabla'
    return (
      <div style={{ pageBreakBefore: 'always', padding: '50px' }}>
        <div className="d-flex flex-column" style={{ marginTop: "20px" }}>
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
                  Distribuidora Industrial de Abrasivos S.A. de C.V 10
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
                      style={{
                        border: "0px solid #ddd",
                        textAlign: "center",
                        fontWeight: "bold",
                      }}
                      className="font-weight-bold"
                    >
                      {savedCart ? savedCart.CardCode : "N/A"}
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

              {/* Tabla información N° Carrito, fecha y vendedor */}
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
                    {savedCart ? savedCart.id : 'N/A'}
                  </td>
                  <td
                    style={{ border: "0px solid #ddd", textAlign: "center" }}
                    className="font-weight-bold"
                  >
                    {savedCart ? moment(savedCart.DateCart).utc().format('DD-MM-YYYY') : 'N/A'}
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

          {/* Tabla info body */}
          <div className="mt-5 d-flex flex-column bd-highlight text-center">
            <table className="text-center">
              <tr className="text-white" style={{ backgroundColor: "#0060EA" }}>
                <th>Código SAP</th>
                <th>Cód. Fabricante</th>
                <th>Descripción</th>
                <th>Cantidad</th>
                <th>Precio</th>
                <th>Precio total</th>
              </tr>
              {!!doc &&
                doc.data.body.map((item, index) => {
                  const precioTotalItem = parseFloat(item.Price);
                  totalPrecioTotal += precioTotalItem;
                  return (
                    <tr key={index}>
                      <th>{item.ItemCode ? item.ItemCode : '--'}</th>
                      <th>{item.SuppCatNum ? item.SuppCatNum : 'N/A'}</th>
                      <th>{item.ItemName ? item.ItemName : 'N/A'}</th>
                      <th>{item.Quantity>=0 ?item.Quantity : '--'}</th>
                      {/* <th>
                        $
                        {Number(
                          item.Price - (item.Price * (item.Discount || 0)) / 100
                        ).toFixed(2)} MXN
                      </th> */}
                      <th>
                      <CurrencyFormat
                        value={item.Price - (item.Price * (item.Discount || 0)) / 100 ?? "0"}
                        displayType={'text'}
                        thousandSeparator={true}
                        fixedDecimalScale={true}
                        decimalScale={2}
                        prefix={'$ '}
                        suffix={config.general.currency}>
                      </CurrencyFormat>
                      </th>
                      <th /*style={{ textAlign: "right" }}*/>
                        {/* $ */}
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
                          //   Number(
                          //   (
                          //     item.Price -
                          //     (item.Price * (item.Discount || 0)) / 100
                          //   ).toFixed(2) * item.Quantity
                          // ).toFixed(2)} MXN
                          <CurrencyFormat
                            value={item.Price - (item.Price * (item.Discount || 0)) / 100 ?? "0"}
                            displayType={'text'}
                            thousandSeparator={true}
                            fixedDecimalScale={true}
                            decimalScale={2}
                            prefix={'$ '}
                            suffix={config.general.currency}>
                          </CurrencyFormat>
                        }
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
                <td className="font-weight-bold">
                  {/* {totalPrecioTotal ? `$ ${totalPrecioTotal.toFixed(2)} MXN` : '--'} */}
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
                <td className="font-weight-bold">
                  {/* {totalPrecioTotal ? `$ ${(totalPrecioTotal * 0.16).toFixed(2)} MXN` : '--'} */}
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
                  style={{ border: "0px solid #ddd", backgroundColor: "#0060EA" }}
                  className="text-center text-white font-weight-bold"
                >
                  Total
                </th>
                <td className="font-weight-bold">
                  {/* {totalPrecioTotal ? `$ ${(totalPrecioTotal + totalPrecioTotal * 0.16).toFixed(2)} MXN` : '--'} */}
                  <CurrencyFormat
                    value={totalPrecioTotal + totalPrecioTotal * 0.16 ?? "0"}
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
    );
  }
}

export default SavedCartsPrintFormat;