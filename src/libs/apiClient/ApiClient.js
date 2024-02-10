import { SERVICE_API } from '../utils/Const';
import { config } from '../utils/Const';
const axios = require('axios');

export class ApiClient {
    static sessionExpiredCallback;

    static getInstance(baseUrl) {
        return createApiClient(baseUrl);
    }

    static setSessionExpiredCallback(callback) {
        ApiClient.sessionExpiredCallback = callback;
    }

    constructor(baseUrl = config.BASE_URL) {
        this.baseUrl = baseUrl;
    }

    async login(user) {
        const url = this.getEndpointUrl(SERVICE_API.login);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({user})

            },
            'ztoken'
        );
        return response;
    }
    async add2Fav(itmCode){        
        const url = this.getEndpointUrl(SERVICE_API.add2Favorites);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ itmCode })
            },            
        );
        return response;
    }
    async subscribeUnsubscribe(user, option) {
        const url = this.getEndpointUrl(SERVICE_API.subscribeUnsubscribe);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user, option })
            },
            'ztoken'
        );
        return response;
    }

    async loginSeller(user) {
        const url = this.getEndpointUrl(SERVICE_API.seller);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({user})
            },
            'ztoken'
        );
        return response;
    }

    async loginousr(user) {
        const url = this.getEndpointUrl(SERVICE_API.loginousr);
        //let localShoppingCart = localStorage.getItem(config.general.localStorageNamed + 'shoppingCart');
        //console.log('LocalStorage',localShoppingCart);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({user})
                //body: JSON.stringify({user,localShoppingCart})
            },
            'ztoken'
        );
        return response;
    }

    async getDatailsAuto(docEntry) {
        const url = this.getEndpointUrl(SERVICE_API.getDatailsAuto + '/' + docEntry);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'GET',
            },
        );
        return response;
    }

    async verifySubscription(Email) {
        let mail = encodeURIComponent(Email);
        const url = SERVICE_API.verifySubscription + '/' + mail;
        const urlas = this.getEndpointUrl(url);
        const response = await apiFetchWithSession(
            urlas,
            {
                method: 'GET',
            },
        )
        return response;
    }

    async setSpecialPricesStatus(status) {
        const url = this.getEndpointUrl(SERVICE_API.setSpecialPricesStatus);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status })
            },
            'ztoken'
        );
        return response;
    }

    async getValidationSpecialPrices() {
        const url = SERVICE_API.getValidationSpecialPrices;
        const urlas = this.getEndpointUrl(url);
        const response = await apiFetchWithSession(
            urlas,
            {
                method: 'GET',
            },
        )
        return response;
    }   

    async getSpecialPrice() {
        const url = this.getEndpointUrl(SERVICE_API.getSpecialPrice);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'GET',
            },
        );
        return response;
    }

    async listClient(user, buscar, U_CAT) {
        const url = this.getEndpointUrl(SERVICE_API.listClient);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({user, buscar, U_CAT})
            },
            'ztoken'
        );
        return response;
    }

    async searchClient(user, nextNum) {
        const url = this.getEndpointUrl(SERVICE_API.searchClient);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({user, nextNum})
            },
            'ztoken'
        );
        return response;
    }

    async searchItems(item) {
        const url = this.getEndpointUrl(SERVICE_API.searchItems);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({item})
            },
            'ztoken'
        );
        return response;
    }

    async searchConditions(data) {
        const url = this.getEndpointUrl(SERVICE_API.searchConditions);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({data})
            },
            'ztoken'
        );
        return response;
    }

    async getPromo(datos) {
        const url = this.getEndpointUrl(SERVICE_API.getPromo);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({datos})
            },
            'ztoken'
        );
        return response;
    }

    async getPromocionales(data) {
        const url = this.getEndpointUrl(SERVICE_API.getPromocionales);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({data})
            },
            'ztoken'
        );
        return response;
    }
   
    async getBonificacion(data) {
            const url = this.getEndpointUrl(SERVICE_API.getBonificacion);
            const response = await apiFetchWithSession(
                url,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({data})
                },
            );
            return response;
        }
    async getPriceList(){
        const url = this.getEndpointUrl(SERVICE_API.getPriceList);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'GET',
            },
        );
        return response;
    }

    async getPromocion(data) {
        const url = this.getEndpointUrl(SERVICE_API.getPromocion);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({data})
            },
            'ztoken'
        );
        return response;
    }
    
    async getPromocionDisparador(data) {
        const url = this.getEndpointUrl(SERVICE_API.getPromocionDisparador);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({data})
            },
            'ztoken'
        );
        return response;
    }

    async getConditions(data) {
        const url = this.getEndpointUrl(SERVICE_API.getConditions);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({data})
            },
            'ztoken'
        );
        return response;
    }

    async disparadorVolumen(data) {
        const url = this.getEndpointUrl(SERVICE_API.tipoDisparadorVol);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({data})
            },
            'ztoken'
        );
        return response;
    }

    async disparadorMonto(data) {
        const url = this.getEndpointUrl(SERVICE_API.tipoDisparadorMonto);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({data})
            },
            'ztoken'
        );
        return response;
    }

    async insertPromo(data) {
        const url = this.getEndpointUrl(SERVICE_API.insertPromo);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({data})
            },
            'ztoken'
        );
        return response;
    }

    async updatePromo(data) {
        const url = this.getEndpointUrl(SERVICE_API.updatePromo);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({data})
            },
            'ztoken'
        );
        return response;
    }

    async updatePartner(data) {
        const url = this.getEndpointUrl(SERVICE_API.updatePartner);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            },
        );
        return response;
    }

    async aprobarPromo(data) {
        const url = this.getEndpointUrl(SERVICE_API.aprobarPromo);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({data})
            },
            'ztoken'
        );
        return response;
    }

    async activarPromo(data) {
        const url = this.getEndpointUrl(SERVICE_API.activarPromo);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({data})
            },
            'ztoken'
        );
        return response;
    }

    async getDescuento(data) {
        const url = this.getEndpointUrl(SERVICE_API.getDescuento);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            },
        );
        return response;        
    }
    async register(register) {
        const url = this.getEndpointUrl(SERVICE_API.register);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(register)
            },
            'ztoken'
        );
        return response;
    }

    async getCategories() {
        const url = this.getEndpointUrl(SERVICE_API.getCategories);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'GET',
            },
        );
        return response;
    }

    async getCategoriesHome(section) {
        const url = this.getEndpointUrl(SERVICE_API.getCategoriesHome+ '/' + section);//Poder consultar el url, la ruta de la funcion en el back
        const response = await apiFetchWithSession(
            url,
            {
                method: 'GET',
            },
        );
        return response;
    }

    async getProductsHome() {
        const url = this.getEndpointUrl(SERVICE_API.getProductsHome);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'GET',
            },
        );
        return response;
    }

    async getBannerHome() {
        const url = this.getEndpointUrl(SERVICE_API.getBannerHome);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'GET',
            },
        );
        return response;
    }

    async getProfile() {
        const url = this.getEndpointUrl(SERVICE_API.getProfile);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'GET',
            },

        );
        return response;
    }

    async getAutorizaciones(data) {
        const url = this.getEndpointUrl(SERVICE_API.getAutorizaciones);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
                //body: JSON.stringify({user,localShoppingCart})
            },
        );
        return response;
    }
    async getAutorizacionesCanalModerno(user, type) {
        const url = this.getEndpointUrl(SERVICE_API.getAutorizacionesCanalModerno);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({user, type})
                //body: JSON.stringify({user,localShoppingCart})
            },
        );
        return response;
    }

    async insertResetPoints(parametersResetPoints) {
        const url = this.getEndpointUrl(SERVICE_API.insertResetPoints);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ parametersResetPoints })
            },
            'ztoken'
        );
        return response;
    }

    async sendRequestCardMail(data) {
        const url = this.getEndpointUrl(SERVICE_API.sendRequestCardMail);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ data })
            },
        );
        return response;
    }

    async resetPoints() {
        const url = SERVICE_API.resetPoints;
        const urlas = this.getEndpointUrl(url);
        const response = await apiFetchWithSession(
            urlas,
            {
                method: 'GET',
            },
        )
        return response;
    }

    async getComunas(id) {
        const url = this.getEndpointUrl(SERVICE_API.getComunas + '/' + id);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'GET',
            },
        );
        return response;
    }

    async verifySubscription(Email) {
        let mail = encodeURIComponent(Email);
        const url = SERVICE_API.verifySubscription + '/' + mail;
        const urlas = this.getEndpointUrl(url);
        const response = await apiFetchWithSession(
            urlas,
            {
                method: 'GET',
            },
        )
        return response;
    }

    async loginTwoSteps(user) {
        const url = this.getEndpointUrl(SERVICE_API.loginTwoSteps);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user })
            },
            'ztoken'
        );
        return response;
    }

    

    async loginTwoStepsMail(user) {
        const url = this.getEndpointUrl(SERVICE_API.loginTwoStepsMail);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user })
            },
            'ztoken'
        );
        return response;
    }
    
    

    async validateUser(register) {
        const url = this.getEndpointUrl(SERVICE_API.validate);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(register)
            },
            'ztoken'
        );
        return response;
    }

    async sendClaim(contenido) {
        const url = this.getEndpointUrl(SERVICE_API.sendClaim);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(contenido)
            },
            'ztoken'
        );
        return response;
    }

    async searchAdvance(contenido) {
        const url = this.getEndpointUrl(SERVICE_API.getItemsAdvance);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(contenido)
            },
            'ztoken'
        );
        return response;
    }

    //cambiar hasta abajo cuando jale
    async sendFilesByEmail(formData, data) {
        const url = this.getEndpointUrl(SERVICE_API.sendFilesByEmail);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'POST',
                headers: {
                    // 'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: formData
            },
        );
        return response;
    }
    

    async sendJobMail(formData, data) {
       
        const url = this.getEndpointUrl(SERVICE_API.sendJobMail);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'POST',
                headers: {
                    // 'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: formData
            },
        );
        return response;
    }

    async getProductsEspecial(contenido, shoppingCart = undefined, whs, page) {
        // const url = this.getEndpointUrl(SERVICE_API.getProductsEspecial + '/' + category  + (shoppingCart ? ('?shoppingCartPublic=' + JSON.stringify(shoppingCart)) +'&' : '?') +'whs='+whs+'&nextNum='+page);
        const url = this.getEndpointUrl(SERVICE_API.getProductsEspecial+'/'+ (shoppingCart ? ('?shoppingCartPublic=' + JSON.stringify(shoppingCart)) +'&' : '?') +'whs='+whs+'&nextNum='+page);
       // const url = this.getEndpointUrl(SERVICE_API.getProductsEspecial+ '/' + JSON.stringify(shoppingCart)); 
        const response = await apiFetchWithSession(
            url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(contenido)
            },
        );
        return response;
    }

    async ProductsEspecial(contenido, shoppingCart = undefined, whs, page) {
        const url = this.getEndpointUrl(SERVICE_API.ProductsEspecial+'/'+ (shoppingCart ? ('?shoppingCartPublic=' + JSON.stringify(shoppingCart)) +'&' : '?') +'whs='+whs+'&nextNum='+page);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(contenido)
            },
        );
        return response;
    }
    async getFiltros() {
        const url = this.getEndpointUrl(SERVICE_API.getFiltros);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'GET',
            },
        );
        return response;
    }

    async getMarcas() {
        const url = this.getEndpointUrl(SERVICE_API.getMarcas);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'GET',
            },
        );
        return response;
    }

    async getCategorias() {
        const url = this.getEndpointUrl(SERVICE_API.getCategorias);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'POST',
            },
        );
        return response;
    }

    async getAllCategories() {
        const url = this.getEndpointUrl(SERVICE_API.getAllCategories);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'GET',
            },
        );
        return response;
    }

    async getAparatos() {
        const url = this.getEndpointUrl(SERVICE_API.getAparatos);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'GET',
            },
        );
        return response;
    }

    async getRefacciones() {
        const url = this.getEndpointUrl(SERVICE_API.getRefaccion);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'GET',
            },
        );
        return response;
    }

    async getFabricantes() {
        const url = this.getEndpointUrl(SERVICE_API.getFabricante);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'GET',
            },
        );
        return response;
    }

    
    async getMaterial() {
        const url = this.getEndpointUrl(SERVICE_API.getMaterial);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'GET',
            },
        );
        return response;
    }
    
    async searchByKey(key) {
        const url = this.getEndpointUrl(SERVICE_API.searchByKey);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ key })
            }
        );
        return response;
    }

    async searchByCategory(category,uniqueFilter, shoppingCart = undefined, whs, page) {
        const url = this.getEndpointUrl(SERVICE_API.searchByCategory + '/category'  + (shoppingCart ? ('?shoppingCartPublic=' + JSON.stringify(shoppingCart)) +'&' : '?') +'whs='+whs+'&nextNum='+page);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ category,uniqueFilter })
            },
           
        );
        return response;
    }

    async openPublicBanner() {
        const url = SERVICE_API.getBanners;
        const urlas = this.getEndpointUrl(url);
        //console.log(urlas, newItem);
        const response = await apiFetchWithSession(
            urlas,
            {
                method: 'GET',
            },
        );
        return response;
    }

    async openAdminBanner() {
        const url = SERVICE_API.getBanners;
        const urlas = this.getEndpointUrl(url);
        //console.log("here",urlas);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                //body: JSON.stringify(item),
            },
        );
        //console.log("OH no",response);
        return response;
    }

    async openItemDetails(ItemCode, shoppingCart = undefined) {
        let newItem = encodeURIComponent(ItemCode);
        const url = SERVICE_API.openItemDetails + '/' + newItem + (shoppingCart ? ('?shoppingCartPublic=' + JSON.stringify(shoppingCart)) : '');
        const urlas = this.getEndpointUrl(url);
        //console.log(urlas, newItem);
        const response = await apiFetchWithSession(
            urlas,
            {
                method: 'GET',
            },
        );
        return response;
    }

    async updateFavorite(item) {
        const url = this.getEndpointUrl(SERVICE_API.updateFavorite + '/' + item.favorite);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(item),
            },
        );
        return response;
    }

    async updateAddress(addresses) {
        //console.log('Addreses EndPoint',addresses);
        const url = this.getEndpointUrl(SERVICE_API.updateAddresses);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ addresses }),
            },
        );
        return response;
    }

    async updateShoppingCart(data) {
        const url = this.getEndpointUrl(SERVICE_API.updateShoppingCart);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            },
        );
        return response;
    }

    async updateShoppingCartLocal(data,authorization = false,docEntry = null) {
        const url = this.getEndpointUrl(SERVICE_API.updateShoppingCarLocal);
        //console.log('IniciarSesion', data);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ data,authorization,docEntry }),
            },
        );
        return response;
    }

    async createAutorization(data) {
        const url = this.getEndpointUrl(SERVICE_API.createAutorization);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            },
        );
        return response;
    }
    async updateAuthorization(data,authorization = false,docEntry = null,GroupNum = null,Total = null, Comments = '') {
        const url = this.getEndpointUrl(SERVICE_API.updateAuthorization);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ data,authorization,docEntry,GroupNum,Total,Comments }),
            },
        );
        return response;
    }

    async regresarAutorization(data) {
        const url = this.getEndpointUrl(SERVICE_API.regresarAutorization);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            },
        );
        return response;
    }

    async rejectedAutorization(data) {
        const url = this.getEndpointUrl(SERVICE_API.rejectedAutorization);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            },
        );
        return response;
    }

    async updateBackOrder(data) {
        const url = this.getEndpointUrl(SERVICE_API.updateBackOrder);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            },
        );
        return response;
    }

    async deleteShoppingCart(data) {
        const url = this.getEndpointUrl(SERVICE_API.deleteShoppingCart);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            },
        );
        return response;
    }

    async deleteBackOrder(data) {
        const url = this.getEndpointUrl(SERVICE_API.deleteBackOrder);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            },
        );
        return response;
    }

    async getShoppingCart(shoppingCart) {
        const url = this.getEndpointUrl(SERVICE_API.getShoppingCart);
        let localShoppingCart = localStorage.getItem(config.general.localStorageNamed + 'shoppingCart');
        //localShoppingCart = {localstorage : JSON.parse(localShoppingCart)};
        //console.log('LocalStorage',localShoppingCart);
        //console.log("SHOOPING CART -> ", shoppingCart)
        const response = await apiFetchWithSession(
            url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ shoppingCart, localShoppingCart })
            },
        );
        return response;
    }

    async createDocument(data) {
        const url = this.getEndpointUrl(SERVICE_API.createDocument);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            },
        );
        return response;
    }

    async sendEmail(data) {
        const url = this.getEndpointUrl(SERVICE_API.sendEmail);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            },
        );
        return response;
    }

    async SaveFileOV(data) {
        const url = this.getEndpointUrl(SERVICE_API.SaveFileOV);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'POST',
                headers: {
                    // 'Content-Type': 'application/json',
                },
                body: data
            },
        );        
        return response;         
    }
    
    async createPayment(data) {
        const url = this.getEndpointUrl(SERVICE_API.createPayment);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            },
        );
        return response;
    }

    async reomoveShopping(data) {
        const url = this.getEndpointUrl(SERVICE_API.removeShopping);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            },
        );
        return response;
    }

    async getCountries() {
        const url = this.getEndpointUrl(SERVICE_API.getCountries);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'GET',
            },
        );
        return response;
    }

    async getPaymentTest() {
        const url = this.getEndpointUrl(SERVICE_API.getPayment);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'GET',
            },
        );
        return response;
    }

    async getPayment(data) {
        const url = this.getEndpointUrl(SERVICE_API.getPayment);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            },
        );
        return response;
    }

    async getTaxEnvio(data) {
        const url = this.getEndpointUrl(SERVICE_API.getTaxEnvio);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            },
        );
        return response;
    }

    async PostItemMercadoLibre(data) {
        const url = this.getEndpointUrl(SERVICE_API.PostItemMercadoLibre);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            },
        );
        return response;
    }

    async searchItemsML(data) {
        const url = this.getEndpointUrl(SERVICE_API.searchItemsMl);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            },
        );
        return response;
    }

    async searchPublishedItemsML() {
        const url = this.getEndpointUrl(SERVICE_API.searchPublishedItemsML);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        );
        return response;
    }

    async DarValor() {
        const url = this.getEndpointUrl(SERVICE_API.darValor);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        );
        return response;
    }

    async UpdateItemML(data) {
        const url = this.getEndpointUrl(SERVICE_API.updateItemML);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            },
        );
        return response;
    }

    async PostItemML(data) {
        // console.log("Lllegua para irese", data);
        // console.log("Publication type => ",publicationType);
        // console.log("Shipment type => ",shipmentType);

        let Token= localStorage.getItem("AccessTokenML");
        const url = "https://api.mercadolibre.com/items/";
        let num;
        if (data.item.OnHandPrincipal > 99999){
            num = 90000;
        }else{
            num = data.item.OnHandPrincipal;
        }
        let data1 = JSON.stringify({
            "title": data.item.ItemName,
            "category_id": data.item.U_FMB_Handel_CatML,
            "price": data.item.Price,
            "currency_id": "MXN",
            "available_quantity": num,
            "buying_mode": "buy_it_now",
            "listing_type_id": data.publicationType,
            "condition": "new",
            "description": data.item.UserText,
            "pictures": [
                {
                    "source": "https://fmbsolutions.com.mx/img/logo_fmb_small.png"
                },
                {
                    "source": "https://fmbsolutions.com.mx/img/logo_fmb_small.png"
                }
            ],
            "shipping": {
                "mode": "me2",
                "local_pick_up": false,
                "free_shipping": data.shipmentType,
                "free_methods": []
            }

        });
        let respuesta = axios.post(url, data1,        
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                params: {
                    'access_token':  Token
                }
            })
            .then(response => {
                // console.log("PRUEBA ML RESPONSE =>", response);
                return response
            })
            .catch(error => {
                // console.log("PRUEBA ML ERROR => ", error);
                return error.response
            });
        //console.log("RESPUESTA => ",respuesta)
        return respuesta
    }

    async UpdateSingleItemML(data) {
        // console.log("Lllegua para actualizar", data);
        // console.log("Publication type => ",publicationType);
        // console.log("Shipment type => ",shipmentType);

        let Token= localStorage.getItem("AccessTokenML");
        const url = `https://api.mercadolibre.com/items/${data.item.U_FMB_Handel_CodeML}`;
      
        let data1 = JSON.stringify({
            "title": data.name,
            "price": data.price,
            "listing_type_id": data.publicationType2,

            "shipping": {
                "mode": "me2",
                "local_pick_up": false,
                "free_shipping": data.shipmentType2,
                "free_methods": []
            }
        });
    let respuesta = axios.put(url, data1,
        {
            headers: {
                'Content-Type': 'application/json'
            },
            params: {
                'access_token':  Token
            }
        })
        .then(response => {
            // console.log("PRUEBA ML RESPONSE =>", response);
            return response
        })
        .catch(error => {
            // console.log("PRUEBA ML ERROR => ", error);
            return error.response
        });
    //console.log("RESPUESTA => ",respuesta)
    return respuesta
}

    async UpdateItemListML(data) {
        // console.log("Lllegua para irese", data);
        // console.log("Publication type => ",publicationType);
        // console.log("Shipment type => ",shipmentType);

        let Token= localStorage.getItem("AccessTokenML");
        const url = "https://api.mercadolibre.com/items/"+data.idPublic;
    
        let data1 = JSON.stringify({
            "title": data.title,
            "price": data.price
        });
        let respuesta = axios.put(url, data1,
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                params: {
                    'access_token':  Token
                }
            })
            .then(response => {
                // console.log("PRUEBA ML RESPONSE =>", response);
                return response
            })
            .catch(error => {
                // console.log("PRUEBA ML ERROR => ", error);
                return error.response
            });
        //console.log("RESPUESTA => ",respuesta)
        return respuesta
    }

    async getTokenML() {
        const url = "https://api.mercadolibre.com/oauth/token";
        let data1 = JSON.stringify({
            "grant_type": "refresh_token",
            "client_id": "6178113481573817",
            "client_secret": "AGKkzu7p2sFxC45DPNumYCrn3abqSfln",
            "refresh_token": "TG-601481a53ae0ab00060b4a71-708440604"
        });
        let respuesta = axios.post(url, data1,
            {
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            .then(response => {
                // console.log("PRUEBA ML RESPONSE TOKEN =>", response);
                return response

            })
            .catch(error => {
                // console.log("PRUEBA ML ERROR => ", error);
                return error.response
            });
        //console.log("RESPUESTA => ",respuesta)
        return respuesta
    }

    async getPreferenceMP(total) {
        const url = "https://api.mercadopago.com/checkout/preferences";
        let valor = parseInt(total);
        let data1 = JSON.stringify({
            "items": [
                {
                    "title": "Valor total",
                    "quantity": 1,
                    "unit_price": valor
                }
            ],
            "back_urls": {
                // "success": "http://localhost:3000/mercadoPago/", //Si es success redirecciona aqui http://localhost:3041/
                "success": "http://187.241.167.186:3041/mercadoPago/", //Si es success redirecciona aqui http://localhost:3041/
                "failure": "https://thesecretcorps.blogspot.com", //Modificar redirrecion si es fail
                "pending": "https://www.mercadopago.com.mx/developers/es/guides/online-payments/checkout-pro/test-integration" //Modificar si esta pendiente
            },
            "auto_return": "all"
        });
        let respuesta = axios.post(url, data1,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer APP_USR-2593251192753950-010220-42f16ea23b8fa77eaabc7f96436744a8-696154492',//PRODUCTIVE ACCESS  TOKEN
                }
            })
            .then(response => {
                // console.log("PRUEBA MP RESPONSE =>", response);
                return response
            })
            .catch(error => {
                // console.log("PRUEBA MP ERROR => ", error);
                return error.response
            });
        //console.log("RESPUESTA => ",respuesta)
        return respuesta

    }

    async getCFDI() {
        const url = this.getEndpointUrl(SERVICE_API.getCFDI);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'GET',
            },
        );
        return response;
    }

    async getFlete() {
        const url = this.getEndpointUrl(SERVICE_API.getFlete);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'GET',
            },
        );
        return response;
    }

    async PostearItem() {
        const url = this.getEndpointUrl(SERVICE_API.postearItem);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'POST',
            },
        );
        return response;
    }

    async getNotifyOrder() {
        const url = this.getEndpointUrl(SERVICE_API.notifyOrders);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'POST',
            },
        );
        return response;
    }

    async getOrders(fechaInicio, fechaFinal) {
        const url = this.getEndpointUrl(SERVICE_API.getOrders + '/'+ fechaInicio  + '/'+  fechaFinal);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'GET',
            },
        );
        return response;
    }

////////////////////////////
    // Resumenes
    async getDataResumen(data) {
        const url = this.getEndpointUrl(SERVICE_API.getDataReumen);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            },
        );
        return response;
    }
    async getOrdersSeller(data) {
        const url = this.getEndpointUrl(SERVICE_API.getOrdersSeller);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: data
            },
        );
        return response;
    }

    async getQuotation(fechaInicio,fechaFinal) {
        const url = this.getEndpointUrl(SERVICE_API.getQuotation + '/'+ fechaInicio  + '/'+  fechaFinal);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'GET',
            },
        );
        return response;
    }
    
    async getGeneralOrdersView(fechaInicio,fechaFinal, slpCode) {
        const url = this.getEndpointUrl(SERVICE_API.getGeneralOrdersView + '/'+ fechaInicio  + '/'+  fechaFinal + '/' + slpCode);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'GET',
            },
        );
        return response;
    }

     // 117
     async getHistory (fechaInicio,fechaFinal,itemCode,filter) {
        const url = this.getEndpointUrl(SERVICE_API.getHistory + '/'+ fechaInicio  + '/'+  fechaFinal+ '/'+  itemCode);
        // const url = this.getEndpointUrl(SERVICE_API.getStatitics + '/'+ fechaInicio  + '/'+  fechaFinal+ '/'+  itemCode);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fechaInicio,
                    fechaFinal,
                    itemCode,
                    filter,
                })
            },
        );
        return response;
    }

    async getDelivery(fechaInicio,fechaFinal) {
        const url = this.getEndpointUrl(SERVICE_API.getDelivery + '/'+ fechaInicio  + '/'+  fechaFinal);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'GET',
            },
        );
        return response;
    }

    async getSaveds(fechaInicio,fechaFinal) {
        const url = this.getEndpointUrl(SERVICE_API.getSaveds + '/'+ fechaInicio  + '/'+  fechaFinal);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'GET',
            },
        );
        return response;
    }
    async getPreliminarys(fechaInicio,fechaFinal) {
        const url = this.getEndpointUrl(SERVICE_API.getPreliminarys + '/'+ fechaInicio  + '/'+  fechaFinal);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'GET',
            },
        );
        return response;
    }
    
    async getCollections(fechaInicio,fechaFinal) {
        const url = this.getEndpointUrl(SERVICE_API.getCollections + '/'+ fechaInicio  + '/'+  fechaFinal);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'GET',
            },
        );
        return response;
    }

    // conF
    async getOneOrder(docNum) {
        const url = this.getEndpointUrl(SERVICE_API.getOneOrder + '/'+ docNum );
        // const url = this.getEndpointUrl(SERVICE_API.getOneBilling + '/'+ fechaInicio  + '/'+  fechaFinal);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'GET',
            },
        );
        return response;
    }

    async getOverdueOne() {
        const url = this.getEndpointUrl(SERVICE_API.getOverdueOne);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'GET',
            },
        );
        return response;
    }
    async getOverdueTwo() {
        const url = this.getEndpointUrl(SERVICE_API.getOverdueTwo);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'GET',
            },
        );
        return response;
    }
    async getOverdueThree() {
        const url = this.getEndpointUrl(SERVICE_API.getOverdueThree);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'GET',
            },
        );
        return response;
    }
    async getOverdueFour() {
        const url = this.getEndpointUrl(SERVICE_API.getOverdueFour);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'GET',
            },
        );
        return response;
    }
    async getOverdueFIve() {
        const url = this.getEndpointUrl(SERVICE_API.getOverdueFive);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'GET',
            },
        );
        return response;
    }
    async getDataProfiel() {
        const url = this.getEndpointUrl(SERVICE_API.getDataProfiled);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'GET',
            },
        );
        return response;
    }

    async dataProfileCode(code) {
        const url = this.getEndpointUrl(SERVICE_API.getDataProfiled+'/'+code);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'GET',
            },
        );
        return response;
    }


    async getBills(fechaInicio,fechaFinal) {
        const url = this.getEndpointUrl(SERVICE_API.getBillings+ '/'+ fechaInicio  + '/'+  fechaFinal);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'GET',
            },
        );
        return response;
    }

    async getBillsDue(fechaInicio,fechaFinal) {
        const url = this.getEndpointUrl(SERVICE_API.getBillingsDue+ '/'+ fechaInicio  + '/'+  fechaFinal);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'GET',
            },
        );
        return response;
    }

    async getProductsDash() {
        const url = this.getEndpointUrl(SERVICE_API.getProdutcsDashBoard);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'GET',
            },
        );
        return response;
    }

    async getOrder(docEntry) {
        const url = this.getEndpointUrl(SERVICE_API.getOrder + '/' + docEntry);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'GET',
            },
        );
        return response;
    }

    async getDataBill(docEntry) {
        const url = this.getEndpointUrl(SERVICE_API.getDataBillings + '/' + docEntry);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'GET',
            },
        );
        return response;
    }

    async getDataQuotation(docEntry) {
        const url = this.getEndpointUrl(SERVICE_API.getDataQuotation + '/' + docEntry);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'GET',
            },
        );
        return response;
    }
    async getDataDelivery(docEntry) {
        const url = this.getEndpointUrl(SERVICE_API.getDataDelivery + '/' + docEntry);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'GET',
            },
        );
        return response;
    }
    async getDataPreliminary(docEntry) {
        const url = this.getEndpointUrl(SERVICE_API.getDataPreliminarys + '/' + docEntry);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'GET',
            },
        );
        return response;
    }
    async getDataProduct(docEntry) {
        const url = this.getEndpointUrl(SERVICE_API.getDataProduct + '/' + docEntry);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'GET',
            },
        );
        return response;
    }
    async getDataDocuemt(docEntry) {
       
        const url = this.getEndpointUrl(SERVICE_API.getDataDocument);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(docEntry)
            },
        );
        return response;
    }

    async getDataExcel(docEntry) {
       
        const url = this.getEndpointUrl(SERVICE_API.getDataExcel);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(docEntry)
            },
        );
        return response;
    }

    async getAllEmails() {
       
        const url = this.getEndpointUrl(SERVICE_API.getAllEmails);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            },
        );
        return response;
    }

    async getOrderDetails(docEntry) {
        const url = this.getEndpointUrl(SERVICE_API.getOrdersDetails + '/' + docEntry);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'GET',
            },
        );
        return response;
    }

    async getStates(country) {
        const url = this.getEndpointUrl(SERVICE_API.getStates + '/' + country);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'GET',
            },
        );
        return response;
    }

    async getInfoCP(cp) {
        const url = this.getEndpointUrl(SERVICE_API.getCP + '/' + cp);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'GET',
            },
        );
        return response;
    }

    async getRegions() {
        const url = this.getEndpointUrl(SERVICE_API.getRegions);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'GET',
            },
        );
        return response;
    }

    async getCities(id) {
        const url = this.getEndpointUrl(SERVICE_API.getCities + '/' + id);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'GET',
            },
        );
        return response;
    }

    async getBusinessPartnerInfo(CardCode) {
        let cardCode = encodeURIComponent(CardCode);
        const url = SERVICE_API.getBusinessPartnerInfo + '/' + cardCode;
        const urlas = this.getEndpointUrl(url);
        const response = await apiFetchWithSession(
            urlas,
            {
                method: 'GET',
            },
        )
        return response;
    }

    async detailsprofile(profile) {
        const url = this.getEndpointUrl(SERVICE_API.detailsprofile + '/' + profile);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'GET',
            },
        );
        return response;
    }
    
    async getPackageStrore() {
        const url = this.getEndpointUrl(SERVICE_API.getPackageStrore);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'GET',
            },
        );
        return response;
    }

    async createSavedCart(data) {
        const url = this.getEndpointUrl(SERVICE_API.createSavedCart);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            },
        );
        return response;
    }

    async updateSavedCart(data) {
        const url = this.getEndpointUrl(SERVICE_API.updateSavedCart);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            },
        );
        return response;
    }

    async getInfoCoupon(coupon) {
        const url = SERVICE_API.getInfoCoupon + '/' + coupon;
        const urlas = this.getEndpointUrl(url);
        const response = await apiFetchWithSession(
            urlas,
            {
                method: 'GET',
            },
        )
        return response;
    }

    async sendRaiting(register) {
        const url = this.getEndpointUrl(SERVICE_API.sendRaiting);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(register)
            },
            'ztoken'
        );
        return response;
    }

    async getRaiting(itemCode, cardCode) {
        const url = SERVICE_API.getRaiting + '/' + itemCode + '/' + cardCode;
        const urlas = this.getEndpointUrl(url);
        const response = await apiFetchWithSession(
            urlas,
            {
                method: 'GET',
            },
        )
        return response;
    }
    async getStockDetails(itemCode) {
        const url = SERVICE_API.getItemStock + '/' + itemCode;
        const urlas = this.getEndpointUrl(url);
        const response = await apiFetchWithSession(
            urlas,
            {
                method: 'GET',
            },
        )
        return response;
    }

    async AutoComplete() {
        const url = SERVICE_API.AutoComplete;
        const urlas = this.getEndpointUrl(url);
        const response = await apiFetchWithSession(
            urlas,
            {
                method: 'GET',
            },
        )
        return response;
    }

    async getCartSaveds(data) {
        const url = this.getEndpointUrl(SERVICE_API.getCartSaveds);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({data})
            },
        );
        return response;
    }

    async getDetailsCartSaveds(data) {
        const url = this.getEndpointUrl(SERVICE_API.getDetailsCartSaveds);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({data})
            },
        );
        return response;
    }

    async deleteCartSaved(id) {
        const url = this.getEndpointUrl(SERVICE_API.deleteCartSaved + '/' + id);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'GET',
            },
        );
        return response;
    }

    async sendData(register) {
        const url = this.getEndpointUrl(SERVICE_API.sendData);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(register)
            },
            'ztoken'
        );
        return response;
    }

    async liberarCliente(CardCode) {
        const url = this.getEndpointUrl(SERVICE_API.liberarCliente+ '/' + CardCode);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'GET',
            },
        );
        return response;
    }

    static async getSessionToken() {
        return await localStorage.getItem(config.general.localStorageNamed + 'Token');
    }

    static async getBusiness() {
        return await localStorage.getItem(config.general.localStorageNamed + 'Business');
    }


    getEndpointUrl(urlPath) {
        return this.baseUrl + urlPath;
    }

    async getJobTypes() {
        const url = SERVICE_API.jobTypes + '/';
        const urlas = this.getEndpointUrl(url);
        const response = await apiFetchWithSession(
            urlas,
            {
                method: 'GET',
            },
        )
        return response;
    }

    // 117
    async getOneOverdue(docNum) {
        const url = this.getEndpointUrl(SERVICE_API.getOneOverdue + '/' + docNum);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'GET',
            },
        );
        return response;
    }

    //New distributor
    async sendDistributorData(data) {
        const url = this.getEndpointUrl(SERVICE_API.sendDistributorData);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            },
        );
        return response;
    }

    //New image profile
    async sendImageProfile(formData) {
        const url = this.getEndpointUrl(SERVICE_API.sendImageProfile);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            },
        );
        return response;
    }
    // get related cart
    async getRelatedCart(brands) {
        const url = this.getEndpointUrl(SERVICE_API.getRelatedCart + '/');
        const response = await apiFetchWithSession(
            url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(brands)
            },
        );
        return response;
    }

    async getMenuCategories() {
        const url = this.getEndpointUrl(SERVICE_API.getMenuCategories);
        const response = await apiFetchWithSession(
            url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            },
        );
        return response;
    }
    

}

export function createApiClient(baseUrl) {
    return new ApiClient(baseUrl);
}

async function apiFetch(url, init) {
    try {
        //console.log('URL: ', url+ "Token", init);
        
        const rawResponse = await fetch(url, init);
        //console.log('raw response: ', rawResponse);
        const response = await rawResponse.json();
        evaluateSessionExpiredResponse(response);

        return response;
    } catch (e) {
        //console.log(e);
        return {
            status: 0,
            message: 'Ocurrió un error inesperado, por favor intente más tarde o ponganse en contacto con soporte', e,
        };
    }
}

async function apiFetchWithSession(url, init, optionalToken = undefined) {
    let token;

    if (!optionalToken) {
        token = await ApiClient.getSessionToken();
    } else {
        token = optionalToken;
    }

    /*if (!token) {
        const response = {
            status: -10,
            message: 'No hay una sesión activa',
            data: {},
        };

        evaluateSessionExpiredResponse(response);

        return response;
    }*/

    if (init) {
        init.headers = {
            ...init.headers,
            Business: config.general.business,
        };

        if (token) {
            init.headers = {
                ...init.headers,
                Authorization: token || undefined,
            };
        }

    }

    //console.log(init.headers);
    return apiFetch(url, init);
}

function evaluateSessionExpiredResponse(response) {
    if (response.status < 0) {
        if (ApiClient.sessionExpiredCallback) {
            ApiClient.sessionExpiredCallback(response);
        }
    }
}


