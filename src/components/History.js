
class History {

    constructor(history){
        this.history = history;
    }

    goHome(){
        this.history.push('/');
    }

    goLogin(){
        this.history.push('/login');
    }
    
    goRedZone(){
        this.history.push('/zonaRecompensa');
    }

    goResetPoints(){
        this.history.push('/resetPoints');
    }

    goProfile(){
        this.history.push('/profile');
    }

    goOrders(){
        this.history.push('/Orders');
    }
    goBill(){
        this.history.push('/Bill');
    }

    goItems(){
        this.history.push('/items');
    }

    goItemsDetails(){
        this.history.push('/itemsDetails');
    }

    goML(){
        this.history.push('/mercadoLibre');
    }

    goBackOrder(){
        this.history.push('/backOrder');
    }

    goShoppingCart(){
        this.history.push('/shoppingCart');
    }

    goQuote(){
        this.history.push('/quote');
    }
    
    goAboutUs(){
        this.history.push('/aboutUs');
    }

    goContactUs(){
        this.history.push('/contactUs');
    }

    goSelectClient(){
        this.history.push('/selector');
    }
    goReports(){
        this.history.push('/reports');
    }

    goSelectAddress(){
        this.history.push('/selectAddress');
    }

    goValidateOrder(){
        this.history.push('/validateOrder');
    }

    goCreateOrder(){
        this.history.push('/createOrder');
    }

    goSelector(){
        this.history.push('/selector');
    }

    goMyProfile(){
        this.history.push('/myprofile')
    }

    goSubirArchivo(){
        this.history.push('/subirArchivo')
    }

    goAutorizaciones(){
        this.history.push('/autorizaciones')
    }

    goCanalModerno(){
        this.history.push('/canalModerno')
    }

    goClaim(){
        this.history.push('/claim');
    }

    goPolitics(){
        this.history.push('/politics');
    }

    goQuestions(){
        this.history.push('/questions');
    }

    goItemsPolar(){
        this.history.push('/itemsM1');
    }
    
    goItemsBlanca(){
        this.history.push('/itemsM2');
    }
    
    goItemsRoutlet(){
        this.history.push('/itemsM3');
    }

    goTerms(){
        this.history.push('/terms');
    }

    goAddress(){
        this.history.push('/addAddress');
    }

    goEditAddress(){
        this.history.push('/editAddress');
    }

    goAccountData(){
        this.history.push('/accountData');
    }

    goSellingPolices(){
        this.history.push('/sellingPolices');
    }

    goRedAliado(){
        this.history.push('/aliado');
    }

    goPrivacy(){
        this.history.push('/privacy');
    }

    goJob(){
        this.history.push('/job');
    }

    goSucursales(){
        this.history.push('/sucursales');
    }

    goDevolution(){
        this.history.push('/devolutionView');
    }

    goPaymentMethodView(){
        this.history.push('/paymentMethodView');
    }

    goSafeShopping(){
        this.history.push('/safeShoppig');
    }

    goAboutRedZone(){
        this.history.push('/clientePreferente');
    }

    goAdmiNewsBlog(){
        this.history.push('/admiNewsBlog');
    }

    goNewsBlog(){
        this.history.push('/newsBlog');
    }

    goSpecialPrices(){
        this.history.push('/specialPrices');
    }

    goPromocionales(){
        this.history.push('/promocionales');
    }

    goGetPlantilla(){
        this.history.push('/platilla');
    }

    goItemsMarcaFour(){
        this.history.push('/itemsM4');
    }

    goItemsMarcaFive(){
        this.history.push('/itemsM5');
    }

    goAsesoria(){
        this.history.push('/asesoria');
    }

    goBoletin(){
        this.history.push('/boletin');
    }

    goCardSaveds(){
        this.history.push('/cardsaved');
    }

    goResumenCuenta(){
        this.history.push('/resumenCuenta')
    }
    goAccountStatus(){
        this.history.push('/accountStatus')
    }

    goBrands(){
        this.history.push('/brands')
    }
}

export default History;