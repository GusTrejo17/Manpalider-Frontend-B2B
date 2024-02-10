import React from "react";
import moment from "moment";
import { config } from '../libs/utils/Const';
class QuotationPrintFormat extends React.Component {
  render() {
    const { doc, itemsGift, address, bill, items } = this.props;
    const user = JSON.parse(localStorage.getItem(config.general.localStorageNamed + 'CurrentUser'));
    const seller = JSON.parse(localStorage.getItem(config.general.localStorageNamed + 'PartnerUser'));
    const addressComplete = (address.street || '') + ' ' + (address.block || '') + ' ' + (address.city || '') + ' C.P. ' + (address.cp || '') + ', ' + (address.state || '') + ', ' + (address.country || '') + '.';
    const addressBill = (bill.street || '') + ' ' + (bill.block || '') + ' ' + (bill.city || '') + ' C.P. ' + (bill.cp || '') + ', ' + (bill.state || '') + ', ' + (bill.country || '') + '.';
    // Resto del código para renderizar el componente con el valor de suppCatNum
    //PDF de Cotización despues de continuar la compra
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
                    {user && user.CardCode
                      ? user.CardCode
                      : "N/A"}
                  </td>
                  <td
                    style={{ border: "0px solid #ddd", textAlign: "center" }}
                    className="font-weight-bold"
                  >
                    {user && user.CardName
                      ? user.CardName
                      : "N/A"}
                  </td>
                </tr>
              </tbody>
            </table>
            {/* Tabla información del vendedor y Direcciones */}
            <table style={{ width: "90%", borderCollapse: "collapse" }}>
              <tr style={{ backgroundColor: "#0060EA", color: "white" }}>
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
                  {seller ? (seller.firstName || '') + ' ' + (seller.lastName || '')
                    : "N/A"}
                </td>
                <td
                  style={{ border: "0px solid #ddd", textAlign: "center" }}
                  className="font-weight-bold"
                >
                  {addressBill || "N/A"}
                </td>
                <td
                  style={{ border: "0px solid #ddd", textAlign: "center" }}
                  className="font-weight-bold"
                >
                  {addressComplete || "N/A"}
                </td>
              </tr>
            </table>
          </div>
        </div>
        <div className="p-0 mt-5" style={{ textAlign: "center" }}>
          <h2 style={{ fontWeight: "bold" }}>
            Listado de artículos
          </h2>
        </div>
        <div className="mt-5 d-flex flex-column bd-highlight text-center">
          {/* Tabla productos de entregas */}
          <table className="text-center">
            <tr className="text-white" style={{ backgroundColor: "#0060EA" }}>
              <th>Cód. DIASA</th>
              <th>Cód. Fabricante</th>
              <th>Descripción</th>
              <th>Cantidad</th>
              <th>Precio unitario</th>
              <th>Precio total</th>
            </tr>
            {!!items &&
              items.map((item1, index) => {
                return (
                  <tr key={index}>
                    <th >{item1.ItemCode || '--'}</th>
                    <th >{item1.SuppCatNum  || 'N/A'}</th>
                    <th>{item1.ItemName || 'N/A'}</th>
                    <th >
                      {item1.quantity > 0 ? item1.quantity : "--"}
                    </th>
                    <th >
                      {item1.Price ? "$ " + parseFloat(item1.Price).toFixed(2) + " MXN" : '--'}
                    </th>
                    <th>
                      {"$ " + parseFloat(item1.newTotal * ((item1.taxRate * .01) + 1)).toFixed(2) + " MXN"}
                    </th>
                  </tr>
                );
              })}
          </table>
        </div>
        {itemsGift.length > 0 ?
          <div className="mt-5 d-flex flex-column bd-highlight text-center">
            {/* Tabla productos de entregas */}
            <table className="text-center">
              <tr className="text-white" style={{ backgroundColor: "#0060EA" }}>
                <th>Cód. DIASA</th>
                <th>Cód. Fabricante</th>
                <th>Descripción</th>
                <th>Cantidad</th>
              </tr>
              {!!itemsGift &&
                itemsGift.map((item, index) => {
                  return (
                    <tr key={index}>
                      <th>
                        {item.bonificacion.idProducto ? item.bonificacion.idProducto : 'N/A'}
                      </th>
                      <th>
                        {item.bonificacion.SuppCatNum ? item.bonificacion.SuppCatNum : 'NA'}
                      </th>
                      <th>{item.bonificacion.ItemName ? item.bonificacion.ItemName : 'N/A'}</th>
                      <th>
                        {item.bonificacion.cantidad > 0 ? item.bonificacion.cantidad : 0}
                      </th>
                    </tr>
                  );
                })}
            </table>
          </div> : <></>
        }
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
                $ {doc &&
                  doc.data &&
                  doc.data.header &&
                  doc.data.header.subTotal
                  ? doc.data.header.subTotal.toFixed(2)
                  : "N/A"} MXN
              </td>
            </tr>
            <tr>
              <th
                className="text-white"
                style={{
                  backgroundColor: "#0060EA",
                }}
              >
                IVA 16%
              </th>
              <td>$ {doc &&
                doc.data &&
                doc.data.header &&
                doc.data.header.taxTotal
                ? doc.data.header.taxTotal.toFixed(2)
                : "N/A"} MXN</td>
            </tr>
            <tr>
              <th
                className="text-white"
                style={{
                  backgroundColor: "#0060EA",
                }}
              >
                Total
              </th>
              <td>
                $ {doc &&
                  doc.data &&
                  doc.data.header &&
                  doc.data.header.DocTotal
                  ? doc.data.header.DocTotal
                  : "N/A"}
                MXN
              </td>
            </tr>
          </table>
        </div>
      </div>
    );
  }
}
export default QuotationPrintFormat;