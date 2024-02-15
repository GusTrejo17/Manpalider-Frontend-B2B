import React from "react";
import moment from "moment";
import CurrencyFormat from 'react-currency-format';
import {config} from "../libs/utils/Const";

class InvocesPrintFormat extends React.Component {
  render() {
    const { doc } = this.props;
    let totalPrecioTotal = 0;
    return (
      // PDF FACTURAS
      <div style={{ pageBreakBefore: 'always', padding: '50px' }}>
        <div className="d-flex flex-column" style={{ marginTop: "20px" }}>
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
              style={{ flexWrap: "wrap", alignItems: "flex-end", justifyContent: "flex-end", content: "center", maxWidth: '60%' }}
            >
              <div style={{ textAlign: "center" }}>
                <h2 style={{ fontWeight: "bold" }}>Facturas</h2>
              </div>

              {/* Tabla información de cliente */}
              <table style={{ width: "90%", borderCollapse: "collapse" }}>
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
                      {doc && doc.data && doc.data.header && doc.data.header.CardCode
                        ? doc.data.header.CardCode : "N/A"}
                    </td>
                    <td
                      style={{ border: "0px solid #ddd", textAlign: "center" }}
                      className="font-weight-bold"
                    >
                      {doc && doc.data && doc.data.header && doc.data.header.CardName
                        ? doc.data.header.CardName : "N/A"}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Tabla información N° Factura, fecha de contabilización y Vendedor Asignado*/}
              <table style={{ width: "90%", borderCollapse: "collapse" }}>
                <tr style={{ backgroundColor: config.Back.color, color: "white" }}>
                  <th style={{ border: "0px solid #ddd", textAlign: "center" }}>
                    Nº Factura
                  </th>
                  <th style={{ border: "0px solid #ddd", textAlign: "center" }}>
                    Fecha de contabilización
                  </th>
                  <th style={{ border: "0px solid #ddd", textAlign: "center" }}>
                    Vendedor Asignado
                  </th>
                </tr>
                <tr>
                  <td
                    style={{ border: "0px solid #ddd", textAlign: "center" }}
                    className="font-weight-bold"
                  >
                    {doc && doc.data && doc.data.header && doc.data.header.DocNum
                      ? doc.data.header.DocNum : "--"}
                  </td>
                  <td
                    style={{ border: "0px solid #ddd", textAlign: "center" }}
                    className="font-weight-bold"
                  >
                    {doc && doc.data && doc.data.header && doc.data.header.TaxDate
                      ? moment(doc.data.header.TaxDate).utc().format('YYYY-MM-DD') : 'N/A'}
                  </td>
                  <td
                    style={{ border: "0px solid #ddd", textAlign: "center" }}
                    className="font-weight-bold"
                  >
                    {doc.data.header && doc.data.header.SlpName
                      ? doc.data.header.SlpName : "N/A"}
                  </td>
                </tr>
              </table>

              {/* Tabla información domicilios */}
              <table style={{ width: "90%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ backgroundColor: config.Back.color, color: "white" }}>
                    <th style={{ border: "0px solid #ddd", textAlign: "center" }}>
                      Domicilio de entrega
                    </th>
                    <th style={{ border: "0px solid #ddd", textAlign: "center" }}>
                      Domicilio facturación
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td
                      style={{ border: "0px solid #ddd", textAlign: "center", fontWeight: "bold" }}
                      className="font-weight-bold"
                    >
                      {doc && doc.data && doc.data.header && doc.data.header.Address
                        ? doc.data.header.Address : "N/A"}
                    </td>
                    <td
                      style={{ border: "0px solid #ddd", textAlign: "center" }}
                      className="font-weight-bold"
                    >
                      {doc && doc.data && doc.data.header && doc.data.header.Address2
                        ? doc.data.header.Address2 : "N/A"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Tabla info body */}
          <div className="mt-5 d-flex flex-column bd-highlight text-center">
            <table className="text-center">
              <tr className="text-white" style={{ backgroundColor: config.Back.color }}>
                <th>Cód. Fabricante</th>
                <th>Código SAP</th>
                <th>Descripción</th>
                <th>Cantidad</th>
                <th>Precio</th>
                <th>Precio total</th>
                <th>Descuento</th>
              </tr>
              {!!doc &&
                doc.data.body.map((item, index) => {
                  const precioTotalItem = parseFloat(item.LineTotal);
                  totalPrecioTotal += precioTotalItem;
                  return (
                    <tr key={index}>
                      <th>{item.SuppCatNum ? item.SuppCatNum : 'N/A'}</th>
                      <th>{item.ItemCode ? item.ItemCode : '--'}</th>
                      <th>{item.Dscription ? item.Dscription : 'N/A'}</th>
                      <th>{item.Quantity ? item.Quantity : '--'}</th>
                      {/* <th>{item.Price ? `$ ${item.Price} MXN` : '--'}</th> */}
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
                      {/* <th>{item.LineTotal ? `$ ${item.LineTotal} MXN` : '--'}</th> */}
                      <th><CurrencyFormat
                        value={item.LineTotal ?? "0"}
                        displayType={'text'}
                        thousandSeparator={true}
                        fixedDecimalScale={true}
                        decimalScale={2}
                        prefix={'$ '}
                        suffix={config.general.currency}>
                      </CurrencyFormat>
                      </th>
                      {/* <th>{item.Price ? `$ ${(item.Price - item.PriceBeforeDiscount).toFixed(2)} MXN` : '--'}</th> */}
                      <th><CurrencyFormat
                        value={item.Price - item.PriceBeforeDiscount ?? "0"}
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
                  style={{ backgroundColor: config.Back.color }}
                >
                  Subtotal
                </th>
                {/* <td>{totalPrecioTotal ? `$ ${totalPrecioTotal.toFixed(2)} MXN` : '--'}</td> */}
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
                  style={{ backgroundColor: config.Back.color }}
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
                  style={{ border: "0px solid #ddd", backgroundColor: config.Back.color }}
                  className="text-center text-white font-weight-bold"
                >
                  Total
                </th>
                <td className="font-weight-bold">
                  {doc.data.header &&
                  //? '$ ' + doc.data.header.DocTotal + ' MXN' : "--"
                  <CurrencyFormat
                    value={doc.data.header.DocTotal ?? "0"}
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

export default InvocesPrintFormat;