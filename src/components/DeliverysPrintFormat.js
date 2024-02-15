import React from "react";
import moment from "moment";
import CurrencyFormat from 'react-currency-format';
import {config} from "../libs/utils/Const";

class DeliverysPrintFormat extends React.Component {
  render() {
    const { doc } = this.props;
    if (doc.length === 0 || !doc.data.header || !doc.data.header[0]) {
      return <div></div>;
    }
    let totalPrecioTotal = 0;

    //PDF ENTREGAS
    return (
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
              style={{
                flexWrap: "wrap",
                alignItems: "flex-end",
                justifyContent: "flex-end",
                content: "center",
                maxWidth: '60%',
              }}
            >
              <div style={{ textAlign: "center" }}>
                <h2 style={{ fontWeight: "bold" }}>Entregas</h2>
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
                      style={{
                        border: "0px solid #ddd",
                        textAlign: "center",
                        fontWeight: "bold",
                      }}
                      className="font-weight-bold"
                    >
                      {doc.data.header && doc.data.header.length > 0
                        ? doc.data.header[0].CardCode : "N/A"}
                    </td>
                    <td
                      style={{ border: "0px solid #ddd", textAlign: "center" }}
                      className="font-weight-bold"
                    >
                      {doc.data.header && doc.data.header.length > 0
                        ? doc.data.header[0].CardName : "N/A"}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Tabla información de N° entrega, Fecha y Vendedor Asignado */}
              <table style={{ width: "90%", borderCollapse: "collapse" }}>
                <tr style={{ backgroundColor: config.Back.color, color: "white" }}>
                  <th style={{ border: "0px solid #ddd", textAlign: "center" }}>
                    Nº Entrega
                  </th>
                  <th style={{ border: "0px solid #ddd", textAlign: "center" }}>
                    Fecha
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
                    {doc.data.header && doc.data.header.length > 0
                      ? doc.data.header[0].DocEntry : "N/A"}
                  </td>
                  <td
                    style={{ border: "0px solid #ddd", textAlign: "center" }}
                    className="font-weight-bold"
                  >
                    {doc && doc.data && doc.data.header && doc.data.header.length > 0 ?
                      moment(doc.data.header[0].TaxDate).utc().format('YYYY-MM-DD') : "N/A"}
                  </td>
                  <td
                    style={{ border: "0px solid #ddd", textAlign: "center" }}
                    className="font-weight-bold"
                  >
                    {doc.data.header && doc.data.header.length > 0 && doc.data.header[0].SlpName
                      ? doc.data.header[0].SlpName : "N/A"}
                  </td>
                </tr>
              </table>

              {/* {Tabla información de direcciones} */}
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
                      style={{
                        border: "0px solid #ddd",
                        textAlign: "center",
                        fontWeight: "bold",
                      }}
                      className="font-weight-bold"
                    >
                      {doc && doc.data && doc.data.header && doc.data.header[0].Address
                        ? doc.data.header[0].Address : "N/A"}
                    </td>
                    <td
                      style={{ border: "0px solid #ddd", textAlign: "center" }}
                      className="font-weight-bold"
                    >
                      {doc && doc.data &&
                        doc.data.header && doc.data.header[0].Address2
                        ? doc.data.header[0].Address2 : "N/A"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="mt-5 d-flex flex-column bd-highlight text-center">

            {/* Tabla info body */}
            <table>
              <tr className="text-white text-center" style={{ backgroundColor: config.Back.color }}>
                <th>Cód. Fabricante</th>
                <th>Código SAP</th>
                <th>Descripción</th>
                <th>Cantidad</th>
                <th>Precio</th>
                <th>Precio total</th>
              </tr>
              {!!doc &&
                doc.data.body.map((item, index) => {
                  const precioTotalItem = parseFloat(item.LineTotal);
                  totalPrecioTotal += precioTotalItem;
                  return (
                    <tr className="text-center" key={index}>
                      <th>{item.SuppCatNum ? item.SuppCatNum : 'N/A'}</th>
                      <th>{item.ItemCode ? item.ItemCode : '--'}</th>
                      <th>{item.ItemName ? item.ItemName : 'N/A'}</th>
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
                {/* <td className="font-weight-bold"> {totalPrecioTotal ? `$ ${totalPrecioTotal.toFixed(2)} MXN` : '--'} </td> */}
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
                  style={{
                    backgroundColor: config.Back.color,
                  }}
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
                  style={{
                    backgroundColor: config.Back.color,
                  }}
                >
                  Total
                </th>
                <td>
                  {doc.data.header && doc.data.header.length > 0
                    // ? '$ ' + doc.data.header[0].DocTotal + ' MXN' : "--"
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

export default DeliverysPrintFormat;