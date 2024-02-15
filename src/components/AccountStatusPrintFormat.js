import React from "react";
import moment from "moment";
import CurrencyFormat from 'react-currency-format';
import {config} from "../libs/utils/Const";
const styles = {
    companyName: {
        fontSize: '32px',
        fontWeight: 'bold',
        color: 'black',
    },
    companyInfo: {
        fontSize: '25px',
        fontWeight: 'bold',
        color: 'black',
    },
    title1: {
        padding: '30px 0px',
        fontSize: '32px',
        fontWeight: 'bold',
        color: 'black',
    },
    title2: {
        padding: '15px 0px',
        fontSize: '32px',
        fontWeight: 'bold',
        color: 'black',
    },
    rowHeader1: {
        padding: '5px',
        backgroundColor: '#0060EA',
        fontSize: '18px',
        fontWeight: 'normal',
        color: 'white',
    },
    rowHeader2: {
        padding: '5px',
        backgroundColor: '#0060EA',
        fontSize: '18px',
        fontWeight: 'bold',
        color: 'white',
    },
    row1: {
        padding: '10px',
        backgroundColor: '#FFF',
        fontSize: '18px',
        fontWeight: 'bold',
        color: 'black',
    },
    row2: {
        padding: '10px',
        backgroundColor: '#FFF',
        fontSize: '18px',
        fontWeight: 'normal',
        color: 'black',
    }
};

class AccountStatusPrintFormat extends React.Component {
  render() {
    const {doc, selectAllChecked} = this.props;
    let date = moment(new Date()).format('DD/MM/YYYY');
    let time = moment(new Date()).format('hh:mm');
    let total = 0;
    const clientData = doc[0]?.clientData ?? [];
    const documents = doc[0]?.documents ?? [];

    return(    
        <div className="d-flex min-vh-100 p-0">
            <div className='container-fluid p-5' id='document'>
                <div className="row" id='header'>
                    <div className='col-4 pr-5 pl-0 font-weight-bold'>
                        <img style={{width: '80%', height:'auto'}} src={config.Back.icon} />
                        <h1 className='mt-3 font-weight-bold pr-3' style={styles.companyName}> Manpalider</h1>
                        {/* <p className='pl-1' style={styles.companyInfo} >TEL: 01(81)12533080 <br/>E-mail: pagos@diasa.net</p> */}
                        <p className='pl-1' style={styles.companyInfo} >TEL: 01(81)12533080 <br/></p>
                    </div>
                    <div className='col-8 text-center'>
                        <div className='row text-right'>
                            <div className='col font-weight-bold' style={styles.title1}> Estado de cuenta</div>
                        </div>
                        <div className='row' style={styles.rowHeader1}>
                            <div className='col-4'>N° Cliente</div>
                            <div className='col-4'>Nombre</div>
                            <div className='col-4'>Teléfono</div>
                        </div>
                        <div className='row' style={styles.row1}>
                            <div className='col-4'>{clientData?.CardCode ?? "---"}</div>
                            <div className='col-4'>{clientData?.CardName ?? "---"}</div>
                            <div className='col-4'>{clientData?.Phone1 ?? "---"}</div>
                        </div>
                        
                        <div className='row' style={styles.rowHeader1}>
                            <div className='col-4'>Fecha</div>
                            <div className='col-4'>Hora</div>
                            <div className='col-4'>Limite de crédito</div>
                        </div>
                        <div className='row' style={styles.row1}>
                            <div className='col-4'>{date ?? "DD/MM/YYYY"}</div>
                            <div className='col-4'>{time ?? "hh:mm"}</div>
                            <div className='col-4'>
                                <CurrencyFormat 
                                    value= {clientData?.LimiteCredito ?? "0"}
                                    displayType={'text'} 
                                    thousandSeparator={true} 
                                    fixedDecimalScale={true} 
                                    decimalScale={2} 
                                    prefix={'$ '}
                                    suffix={' MXN'}>
                                </CurrencyFormat>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col font-weight-bold' style={styles.title2}> Estado de cuenta</div>
                        </div>
                    </div>
                </div>
                <div className='row' id='body'>                    
                    <div className='container-fluid text-center mt-3 px-3' id='table'>
                        <div className='row' id='table-header' style={styles.rowHeader1}>
                            <div className='col-2'>Documento</div>
                            <div className='col-2'>Fecha Doc.</div>
                            <div className='col-2'>Fecha vencimiento</div>
                            <div className='col-3'>Total</div>
                            <div className='col-3'>Saldo Vencido</div>
                            {/* <div className='col-2'>Saldo acumulado</div> */}
                        </div>
                        
                        {!!documents && documents?.map((currentDoc, index) => {
                            total += currentDoc.DocTotal;
                            return (
                                <div className='row' id='table-body' style={styles.row2}>
                                    <div className='col-2'>{currentDoc?.DocNum ?? ""}</div>
                                    <div className='col-2'>{currentDoc?.DocDate ? moment(currentDoc.DocDate).format("DD/MM/YYYY") : "DD/MM/YYYY"}</div>
                                    <div className='col-2'>{currentDoc?.DocDueDate ? moment(currentDoc.DocDate).format("DD/MM/YYYY") : "DD/MM/YYYY"}</div>
                                    <div className='col-3'>
                                        <CurrencyFormat 
                                            value= {currentDoc?.DocTotal ?? "0"}
                                            displayType={'text'} 
                                            thousandSeparator={true} 
                                            fixedDecimalScale={true} 
                                            decimalScale={2} 
                                            prefix={'$ '}
                                            suffix={' MXN'}>
                                        </CurrencyFormat>
                                    </div>
                                    <div className='col-3'>
                                        <CurrencyFormat 
                                            value= {currentDoc?.DueTotal ?? "0"}
                                            displayType={'text'} 
                                            thousandSeparator={true} 
                                            fixedDecimalScale={true} 
                                            decimalScale={2} 
                                            prefix={'$ '}
                                            suffix={' MXN'}>
                                        </CurrencyFormat>
                                    </div>
                                    {/* <div className='col-2'>
                                        <CurrencyFormat 
                                            value= {currentDoc?.DocTotal ?? "0"}
                                            displayType={'text'} 
                                            thousandSeparator={true} 
                                            fixedDecimalScale={true} 
                                            decimalScale={2} 
                                            prefix={'$ '}
                                            suffix={' MXN'}>
                                        </CurrencyFormat>
                                    </div> */}
                                </div>
                            );
                        })}
                        <div className='row' id='table-footer'>
                            <div className='col-9'></div>
                            <div className='col-3'>
                                <div className='row'>
                                    <div className='col-4' style={styles.rowHeader2}>Total</div>
                                    <div className='col-8' style={styles.row1}>
                                        <CurrencyFormat 
                                            value= {total ?? "0"}
                                            displayType={'text'} 
                                            thousandSeparator={true} 
                                            fixedDecimalScale={true} 
                                            decimalScale={2} 
                                            prefix={'$ '}
                                            suffix={' MXN'}>
                                        </CurrencyFormat>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='container-fluid' id='footer' style={{position: (selectAllChecked ? 'none' : 'absolute'), bottom:'50px', marginTop:'3rem'}}>
                    <div className='row'>
                        <div className='col-7'>
                            <p style={styles.companyInfo}>
                                BANORTE<br />
                                CLAVE: 072 580 001 430 173 119<br />
                                CUENTA: 0143017311 SUC. 143<br />
                            </p>
                        </div>
                        <div className='col-5'>
                            <p style={styles.companyInfo}>
                                RFC: DIA820111NG5<br />
                                TEL: 01 (81) 12533080<br />
                                E-MAIL: pagos@diasa.net<br />
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>    
    )
  }
}

export default AccountStatusPrintFormat;