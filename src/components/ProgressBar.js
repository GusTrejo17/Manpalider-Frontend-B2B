import React, {Component} from 'react';
import moment from "moment";

class ProgressBar extends Component {
    constructor(props){
        super(props);
        this.state = {
        };
    }
    
    render() {
        const { guiaStatus, currentDocInfo, type } = this.props;
        
        let firstStateDoc = guiaStatus && guiaStatus.length > 0 ? guiaStatus.find(guiaState => (guiaState.Legend === 'ACEPTADO')) : null;
        let secondStateDoc = guiaStatus && guiaStatus.length > 0  ? guiaStatus.find(guiaState => (guiaState.Legend === 'PREPARANDO')) : null;
        let threeStateDoc = guiaStatus && guiaStatus.length > 0 ? guiaStatus.find(guiaState => (guiaState.Legend === 'EMPAQUETANDO')) : null;
        let fourStateDoc = guiaStatus && guiaStatus.length > 0 ? guiaStatus.find(guiaState => (guiaState.Legend === 'FACTURADO')) : null;
        let fifthStateDoc = guiaStatus && guiaStatus.length > 0 ? guiaStatus.find(guiaState => (guiaState.Legend === 'CANCELADO')) : null;

        return (
            <>
                <h3 className="text-center font-weight-bold" style={{fontSize:'1.4rem'}}>Estado del documento</h3><br/> 
                    <ul className="timeline" id="timeline" style = {{listStyle: 'none'}}>
                        <li className={firstStateDoc || type === 'OQUT' || type === 'ORDR' || type === 'ODLN' || type === 'OINV' ? "li complete" : "li incomplete"}>
                            <div className="timestamp">
                            </div>
                            <div className="statusAceptado mb-2">
                                <div className="mt-2 author" style={{fontSize:'1.2rem'}}>ACEPTADO</div>
                                <span className="mt-2 date" style={{fontSize:'1.2rem'}}>{firstStateDoc ? moment(firstStateDoc.DocDate).utc().format('DD/MM/YYYY') : guiaStatus && guiaStatus.length === 0 && type === 'OQUT'? moment(currentDocInfo.DocDate).utc().format('DD/MM/YYYY') : '--'}</span><br/>
                                <span className="mt-2 date" style={{fontSize:'1.2rem'}}>{firstStateDoc ? '#' +  firstStateDoc.DocNum : guiaStatus && guiaStatus.length === 0 && type === 'OQUT' ? '#' + (currentDocInfo.DocNum) : type !== 'OQUT' ? 'Sin orígen' : ''}</span>
                            </div>
                        </li>
                        <li className={secondStateDoc || type === 'ORDR' || type === 'ODLN' || type === 'OINV'  ? "li complete" : "li incomplete"}>
                            <div className="timestamp">
                            </div>
                            <div className="statusPreparando mb-2">
                                <div className="mt-2 author" style={{fontSize:'1.2rem'}}>PREPARANDO</div>
                                <span className="mt-2 date" style={{fontSize:'1.2rem'}}>{secondStateDoc ? moment(secondStateDoc.DocDate).utc().format('DD/MM/YYYY') : guiaStatus && guiaStatus.length === 0 && type === 'ORDR'? moment(currentDocInfo.DocDate).utc().format('DD/MM/YYYY') : '--'}</span><br/>
                                <span className="mt-2 date" style={{fontSize:'1.2rem'}}>{secondStateDoc ? '#' + secondStateDoc.DocNum : guiaStatus && guiaStatus.length === 0 && type === 'ORDR' ? '#' + (currentDocInfo.DocNum) : type === 'OQUT' ? 'Sin procesar' : 'Sin orígen'}</span>
                            </div>
                        </li>
                        <li className={threeStateDoc || type === 'ODLN' || type === 'OINV' ? "li complete" : "li incomplete"}>
                            <div className="timestamp">
                            </div>
                            <div className="statusEmpaquetando mb-2">
                                <div className="mt-2 author" style={{fontSize:'1.2rem'}}>EMPAQUETANDO</div>
                                <span className="mt-2 date" style={{fontSize:'1.2rem'}}>{threeStateDoc ? moment(threeStateDoc.DocDate).utc().format('DD/MM/YYYY') : guiaStatus && guiaStatus.length === 0 && type === 'ODLN'? moment(currentDocInfo.DocDate).utc().format('DD/MM/YYYY') : '--'}</span><br/>
                                <span className="mt-2 date" style={{fontSize:'1.2rem'}}>{threeStateDoc ? '#' + threeStateDoc.DocNum : guiaStatus && guiaStatus.length === 0 && type === 'ODLN' ? '#' + (currentDocInfo.DocNum) : type === 'OQUT' || type === 'ORDR' ? 'Sin procesar' : 'Sin orígen'}</span>
                            </div>
                        </li>
                        <li className={fourStateDoc  || type === 'OINV' ? "li complete" : "li incomplete"}>
                            <div className="timestamp">
                            </div>
                            <div className="statusFacturado mb-2">
                                <div className="mt-2 author" style={{fontSize:'1.2rem'}}>FACTURADO</div>
                                <span className="mt-2 date" style={{fontSize:'1.2rem'}}>{fourStateDoc ? moment(fourStateDoc.DocDate).utc().format('DD/MM/YYYY') : guiaStatus && guiaStatus.length === 0 && type === 'OINV'? moment(currentDocInfo.DocDate).utc().format('DD/MM/YYYY') : '--'}</span><br/>
                                <span className="mt-2 date" style={{fontSize:'1.2rem'}}>{fourStateDoc ? '#' + fourStateDoc.DocNum : guiaStatus && guiaStatus.length === 0 && type === 'OINV' ? '#' + (currentDocInfo.DocNum) : type === 'OQUT' || type === 'ORDR' || type === 'ODLN' ? 'Sin procesar' : 'Sin orígen'}</span>
                            </div>
                        </li>
                        {
                            fifthStateDoc && 
                            <li className="li complete ">
                            <div className="timestamp">
                            </div>
                            <div className="statusCancelado mb-2">
                                <div className="mt-2 author" style={{fontSize:'1.2rem'}}>{fifthStateDoc.Legend}</div>
                                <span className="mt-2 date" style={{fontSize:'1.2rem'}}>{moment(fifthStateDoc.DocDate).utc().format('DD/MM/YYYY')}</span><br/>
                                <span className="mt-2 date" style={{fontSize:'1.2rem'}}>{'#' + fifthStateDoc.DocNum}</span>
                            </div>
                        </li>
                        }
                    </ul> 
                {/* <br/> */}
            </>
        );
    }
}

export default ProgressBar;