import $ from 'jquery';

class Modal {

    constructor(){}

    loginModal(action){
        $('#loginModal').modal(action);
    }

    searchModal(action){
        $('#searchModal').modal(action);
    }

    publicationType(action){
        $('#publicationType').modal(action);
    }

    updateML(action){
        $('#updateML').modal(action);
    }

    openPayModal(action){
        $('#openPayModal').modal(action);
    }

    itemDetails(action){
        $('#itemDetails').modal(action);
    }

    loginRegisterModal(action){
        if(action === 'show'){
            $('#loginRegisterModal').modal({backdrop: 'static', keyboard: false}, action);
        } else {
            $('#loginRegisterModal').modal(action);
        }
    }

}

export default Modal;