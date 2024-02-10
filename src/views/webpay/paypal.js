import './App.css';
import React from 'react';
import { PayPalButton } from "react-paypal-button";

function App() {
  const paypalOptions = {
    // ID del ccliende desde su development paypal
    clientId: "AcgfSWjvFifar4P_3alUSPkhf0Z5g21gs1ieaFCF0HoFojz5GnYxYFE5L-uIH4tZEqWffcTzN_jnqf6l",
    intent: 'capture',
    //moneda
    currency: 'MXN',
    //Para que conteste y regres algo: Regresa en consola
    commit: true
  }

  const buttonStyles = {
      //Estilo del boton 
    layout: 'vertical',
    shape: 'pill',
    color: 'silver'
  }

  return (
    <div className="App" style={{backgroundColor:config.Back.backgroundColor }}>
      <h1>Prueba Paypal</h1>
      <PayPalButton 
        paypalOptions={paypalOptions}
        buttonStyles={buttonStyles}
        //metodos de validadción si entra uno los otros ya no pasan
        onPaymentSuccess={data => console.log('onPaymentSuccess', data)}
        onPaymentError={msg => console.log('payment error', msg)}
        onPaymentCancel={data => console.log(data)}
        //Cambiar por variable del precio total
        amount={0.01}
        />
    </div>
  );
}

export default App;