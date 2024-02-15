import React from "react";
import moment from "moment";
import CurrencyFormat from 'react-currency-format';
import {config} from "../libs/utils/Const";

class HistoryPrintFormat extends React.Component {
  render() {
    const { doc, user, history } = this.props;
    let totalPrecioTotal = 0;
    //PDF Historial de compra
    return (
      <div className="d-flex flex-column mt-5" style={{ padding: '50px' }}>
        {/* Cabecera información */}
        <div className="d-flex flex-row">
          <div>
            <img
              style={{ width: "300px"}}
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
              flexWrap: "wrap",
              alignItems: "flex-end",
              justifyContent: "flex-end",
              content: "center",
              marginLeft: "auto"
            }}
          >
            <div style={{ textAlign: "center" }}>
              <h2 style={{ fontWeight: "bold" }}>Historial de compra</h2>
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

        {/* Tabla información de N° Pedido y fecha */}
        {/* <table style={{ width: "90%", borderCollapse: "collapse" }}>
              <tr style={{ backgroundColor: config.Back.color, color: "white" }}>
                <th style={{ border: "0px solid #ddd", textAlign: "center" }}>
                  Nº Pedido
                </th>
                <th style={{ border: "0px solid #ddd", textAlign: "center" }}>
                  Fecha
                </th>
              </tr>
              <tr>
                <td
                  style={{ border: "0px solid #ddd", textAlign: "center" }}
                  className="font-weight-bold"
                >
                  {history ? history.DocEntry : 'N/A'}
                </td>
                <td
                  style={{ border: "0px solid #ddd", textAlign: "center" }}
                  className="font-weight-bold"
                >
                  {history ? historyDate
                    : "N/A"}
                </td>
              </tr>
            </table> */}

        {/* Tabla información del vendedor y direcciones */}
        {/* <table style={{ width: "90%", borderCollapse: "collapse" }}>
              <tr style={{ backgroundColor: config.Back.color, color: "white" }}>
                <th style={{ border: "0px solid #ddd", textAlign: "center" }}>
                  Vendedor
                </th>
                <th style={{ border: "0px solid #ddd", textAlign: "center" }}>
                  Domicilio de factura
                </th>
                <th style={{ border: "0px solid #ddd", textAlign: "center" }}>
                  Domicilio de entrega
                </th>
              </tr>
              <tr>
                <td
                  style={{ border: "0px solid #ddd", textAlign: "center" }}
                  className="font-weight-bold"
                >
                  {doc &&
                  doc.data &&
                  doc.data.header &&
                  doc.data.header.U_FMB_Handel_Creador
                    ? doc.data.header.U_FMB_Handel_Creador
                    : "N/A"}
                </td>
                <td
                  style={{ border: "0px solid #ddd", textAlign: "center" }}
                  className="font-weight-bold"
                >
                  {doc && doc.data && doc.data.header && doc.data.header.Address
                    ? doc.data.header.Address
                    : "N/A"}
                </td>
                <td
                  style={{ border: "0px solid #ddd", textAlign: "center" }}
                  className="font-weight-bold"
                >
                  {history? history.Address2 : 'N/A'}
                </td>
              </tr>
            </table> */}
        {/* </div>
        </div> */}

        {/* Tabla contenido de historial de compras */}
        <div className="mt-5 d-flex flex-column bd-highlight text-center">
          <table className='text-center'>
            <tr className="text-white" style={{ backgroundColor: config.Back.color }}>
              <th>Fecha</th>
              <th>No. pedido</th>
              <th>ID del artículo</th>
              <th>Artículo</th>
              <th>Marca</th>
              <th>Cantidad</th>
              <th>Precio</th>
              <th>% Descuento</th>
              <th>Precio con descuento</th>
              <th>Precio con IVA</th>
            </tr>

            {!!history &&
              history.map((item, index) => {
                const precioTotalItem = parseFloat(item.Price * 1.16);
                totalPrecioTotal += precioTotalItem;
                return (
                  <tr key={index}>
                    <th>{moment(item.DocDate).utc().format('YYYY-MM-DD')}</th>
                    <th>{item.DocNum ? item.DocNum : '--'}</th>
                    <th>{item.ItemCode ? item.ItemCode : '--'}</th>
                    <th>{item.ItemName ? item.ItemName : 'N/A'}</th>
                    <th>{item.ItmsGrpNam ? item.ItmsGrpNam : 'N/A'}</th>
                    <th>{item.Quantity ? item.Quantity : '--'}</th>
                    <th>{item.OriginalPrice ? '$ ' + parseFloat(item.OriginalPrice).toFixed(2) + ' MXN' : '--'}</th>
                    <th>{item.DiscPrcnt>=0 ? parseInt(item.DiscPrcnt) + '%' : '--'}</th>
                    {/* <th>{item.Price ? '$ ' + parseFloat(item.Price).toFixed(2) + ' MXN' : '--'}</th> */}
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
                    {/* <th>{item.Price ? '$ ' + parseFloat(item.Price * 1.16).toFixed(2) + ' MXN' : '--'}</th> */}
                    <th><CurrencyFormat
                      value={item.Price * 1.16 ?? "0"}
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
        {/* <div className="d-flex justify-content-end mt-5 text-center">
          <table className="font-weight-bold">
            <tr>
              <th
                className="text-white p-2"
                style={{ backgroundColor: config.Back.color }}
              >
                Subtotal
              </th>
              <td>
                {totalPrecioTotal
                  ? `$ ${totalPrecioTotal.toFixed(2)} MXN`
                  : '--'
                }
              </td>
            </tr>
            <tr>
              <th
                className="text-white"
                style={{
                  backgroundColor: config.Back.color,
                }}
              >
                IVA 16%
              </th>
              <td className="font-weight-bold">
                {totalPrecioTotal
                  ? `$ ${(totalPrecioTotal * 0.16).toFixed(2)} MXN`
                  : '--'
                }
              </td>
            </tr>
            <tr>
              <th
                style={{
                  border: "0px solid #ddd",
                  backgroundColor: config.Back.color,
                }}
                className="text-center text-white font-weight-bold"
              >
                Total
              </th>
              <td className="font-weight-bold">
                {totalPrecioTotal
                  ? `$ ${(((totalPrecioTotal) + (totalPrecioTotal * 0.16)).toFixed(2) + " MXN")}`
                  : '--'
                }
              </td>
            </tr>
          </table>
        </div> */}
      </div>
    );
  }
}

export default HistoryPrintFormat;