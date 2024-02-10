 //redondear el numero a dos decimas y formateo de cada 3 posiciones una ,  
export function roundigFormat(number:String = 0) {//41699733.28
    return new Intl.NumberFormat('en-US').format(number);
}   
    

