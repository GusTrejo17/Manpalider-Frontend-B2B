import React from 'react';
import ReactToPrint from 'react-to-print';
import ReportModalBill from './ReportModalBill';
 
class ExportReportBillPDF extends React.Component {
     
    render() {
      const {data, user} = this.props;
      return (
        <div>
           <ReactToPrint
                content={() => this.componentRef}
                trigger={() =>  <label className="btn float-left impr mr-sm-2"><i class="fas fa-print"></i> Imprimir PDF</label>}
            />
            <div style={{ display: "none" }}>
                <ReportModalBill ref={(response) => (this.componentRef = response)} data={data} user={user}/>
            </div>
        </div>
      );
    }
}
 
export default ExportReportBillPDF;