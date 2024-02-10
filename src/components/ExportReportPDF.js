import React from 'react';
import ReactToPrint from 'react-to-print';
import ReportModal from './ReportModal';
 
class ExportReportPDF extends React.Component {
     
    render() {
      const {date,data,SubTotal,seller, user, currentCart} = this.props;
      return (
        <div>
           <ReactToPrint
                content={() => this.componentRef}
                trigger={() =>  <label className="btn float-left impr mr-sm-2"><i class="fas fa-print"></i> Imprimir PDF</label>}
            />
            <div style={{ display: "none" }}>
                <ReportModal ref={(response) => (this.componentRef = response)} date={date} data={data} SubTotal={SubTotal} seller={seller} currentCart={currentCart} user={user}/>
            </div>
        </div>
      );
    }
}
 
export default ExportReportPDF;