import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { ApiClient } from "../libs/apiClient/ApiClient";
import OrderPrintFormat  from './OrderPrintFormat';
import AutoPrintFormat from './AutoPrintFormat';
import QuotationPrintFormat from './QuotationPrintFormat';
import DeliverysPrintFormat from './DeliverysPrintFormat';
import SavedCartsPrintFormat from './SavedCartsPrintFormat';
import InvocesPrintFormat from './InvocesPrintFormat';
import ExpiredInvoicesPrintFormat from './ExpiredInvoicesPrintFormat';
import CollectPrintFormat from './CollectPrintFormat';
import GeneralOrdersPrintFormat from './GeneralOrdersPrintFormat';
import HistoryPrintFormat from './HistoryPrintFormat';
import QuotationPrintFormat1 from './QuotationPrintFormat1';
import AccountStatusPrintFormat from './AccountStatusPrintFormat';

import { connect } from 'react-redux';
import {config, DISPATCH_ID, SERVICE_API, SERVICE_RESPONSE} from "../libs/utils/Const";

const apiClient = ApiClient.getInstance();
let docs = []
let show = ''
const ExportReportGeneral = ({ data,itemsGift,items, address,bill, enableSpinner, notificationReducer: { showAlert }, typeDocs, view,collect, orders, seller, user, currentCart, date, currentCart1, date1, orderGeneral, customer, historyP, general, history, savedCart, selectAllChecked}) => {
  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });


  const getData = async (key)=>{
    show = key
    let response = ""
    enableSpinner(true);
    if(key === "accountStatus"){ docs.push(data); }
    for (let index = 0; index < data.length; index++) {
      switch (key) {
        case "orders":
          response =  await apiClient.getOrder(data[index]);
          break;
        case "quotations":
          response =  await apiClient.getDataQuotation(data[index]);
          break;
        case "auto":
          response =  await apiClient.getDataPreliminary(data[index]);
          break;
        case "deliverys":
          response =  await apiClient.getDataDelivery(data[index]);
          break;
        case "savedCarts":
          response =  await apiClient.getDataProduct(data[index]);
          break;
        case "invoices":
          response =  await apiClient.getDataBill(data[index]);
          break;
        case "collect":
          let obj ={
            status:1
          }
          response =  obj;
          break;
        case "quotations2":
          response =  data;
          break;
        case "generalOrders":
          response =  await apiClient.getOrder(data[index]);
          docs.push(response); //Necesario para mostrar pdf
        break;
        // case "orders":
        //   response =  await apiClient.getOrder(data[index]);
        //   break;
      
        default:
          break;
      }
      if (key !== 'collect' && key !== 'history' && key !== 'generalOrders' && key !== 'quotations2') {
        if (response.status === SERVICE_RESPONSE.SUCCESS) {
          docs.push(response)
        }else if(key !== "accountStatus") {
          showAlert({ type: 'error', message: response.message })
        } 
      }
    }
    enableSpinner(false);
  }

  const print = async (typeDocs)=>{
    docs = []
    await getData(typeDocs)    
    handlePrint()
  }



  return (
    <div>
      {view && view == 'validateOrder'?
        <button 
          onClick={()=>print(typeDocs)}          
          className="btn btn-block text-white"
          style={{
              backgroundColor: config.navBar.menuCategoriesBackgroundHover,
              color: config.navBar.textColorCategorieHover,
              fontWeight: "bold",
          }}>
          Imprimir Cotización
        </button>
        :
        <button className="btn float-left impr mr-sm-2" style={{ marginTop: "15px", background: config.Back.color, color: "white" }} onClick={()=>print(typeDocs)}>
          <i className="fas fa-print"/>
          <span style={{marginLeft: '10px'}}>Imprimir PDF</span>
        </button>
       
      }
      <div style={{ display: "none" }}>
        <div ref={componentRef} id='DocsToPrint2'>
          {/* {PDF Cotización despues de continuar compra} */}
          {show === "quotations2" &&
            <QuotationPrintFormat  doc={data[0]} itemsGift={itemsGift} address={address} bill={bill} items={items}/>
          }
          {/* {PDF Cobranza} */}
          {show === "collect" &&
                <CollectPrintFormat  collect={data} user={user} />
          }
          {/* {PDF Estado de cuenta} */}
          {show === "accountStatus" &&
              <AccountStatusPrintFormat  doc={docs} selectAllChecked={selectAllChecked}/>
          }
          {/* {PDF Historial de compra} */}
          {show === "history" &&
                <HistoryPrintFormat  history={data} user={user}/>
          }
          
          {docs.map((doc, index)=>{
            return(
              <>
              {/* {PDF Pedidos} */}
              {show === "orders" &&
                <OrderPrintFormat  doc={doc} orders={orders}/>
              }
              {/* {PDF Oferta de venta} */}
              {show === "quotations" && 
                <QuotationPrintFormat1  doc={doc} orders={orders}/>
              }
              {/* {PDF Autorizaciones} */}
              {show === "auto" &&
                <AutoPrintFormat  doc={doc} orders={orders && orders[index]}/>
              }
              {/* {PDF Entregas} */}
              {show === "deliverys" &&
                <DeliverysPrintFormat  doc={doc} />
              }
              {/* {PDF Guardados} */}
              {show === "savedCarts" &&
                <SavedCartsPrintFormat  doc={doc} savedCart={savedCart && savedCart[index]} user={user} seller={seller}/>
              }
              {/* {PDF Facturas} */}
              {show === "invoices" &&
                <InvocesPrintFormat  doc={doc}/>
              }
              {show === "expiredInvoices" &&
                <ExpiredInvoicesPrintFormat  doc={doc}/>
              }
              {/* {PDF Pedidos Generales} */}
              {show === "generalOrders" &&
                <GeneralOrdersPrintFormat  doc={doc} general={general && general[index]}/>
              }
              </>
            )
          })}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (store) => {
  return {
      notificationReducer: store.NotificationReducer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
      enableSpinner: (value) =>
          dispatch({ type: DISPATCH_ID.CONFIG_SET_SPINNER, value }),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExportReportGeneral) ;