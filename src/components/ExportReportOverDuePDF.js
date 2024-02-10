import React from 'react';
import ReactToPrint from 'react-to-print';
import ReportModalOverDue from './ReportModalOverDue';
 
class ExportReportOverDuePDF extends React.Component {
     
    render() {
      const {data} = this.props;
      return (
        <div>
           <ReactToPrint
                content={() => this.componentRef}
                trigger={() =>  <label className="btn float-left impr mr-sm-2"><i class="fas fa-print"></i> Imprimir PDF</label>}
            />
            <div style={{ display: "none" }}>
                <ReportModalOverDue ref={(response) => (this.componentRef = response)} data={data}/>
            </div>
        </div>
      );
    }
}
 
export default ExportReportOverDuePDF;