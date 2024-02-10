let local = "FMBSolutions";

export default {
    general: {
        titleWindowsExplorer: 'FMB Solutions',
        iconWindowsExplorer: 'favicon.ico',
        loaderImage: 'Cargando...', //require('./images/loader/831.gif'),
        loaderBackground: 'rgba(215,160,0, 0.1)',
        loaderColor: 'text-warning',
        business: 1,
        imagesPath: 'fmbSolutions',
    },

    icons: {
        menu: 'fas fa-bars fa-1x',
        user: 'fas fa-user',
        password: 'fa fa-unlock-alt',
        search: 'fas fa-search',
        shoppingCart: 'fa fa-shopping-cart',
        signature: 'fa fa-signature',
        building: 'fa fa-building',
        phone: 'fa fa-phone',
        pin: 'fa fa-map-pin',
        road: 'fa fa-road',
        map: 'fa fa-map',
        city: 'fa fa-city',
        envelope: 'fa fa-envelope-open-text',
        globalAmericas: 'fa fa-globe-americas',
        shield: 'fa fa-shield',
        favorite: "fas fa-star",
        trash: "fa fa-trash",
        backOrderTrue: 'fa fa-plus',
        backOrderFalse: 'fa fa-minus',
        arrowLeft: 'fas fa-caret-left',
        arrowRight: 'fas fa-caret-right',
    },

    navBar: {
        icon: require('../../images/fmbSolutions/navBarIcon.png'),
        backgroundColor: '#666666',
        iconColor: '#FFC200',        
        menuCategoriesBackground: 'rgb(102,102,102)',
        textColor: 'white',
        textColorCategorie: 'white',
    },

    dashboard: 'Carousel',
    slider: {
        videoLocation: '',
        videoFormat: '',
        videoText: '',
        image: '',
    },
    home: {
        images: require('../../images/cig/promo.png')
    },
    carousel: {
        images: [{path: require('../../images/fmbSolutions/carousel/banner1.jpg')},
            {path: require('../../images/fmbSolutions/carousel/banner2.jpg')},
            {path: require('../../images/fmbSolutions/carousel/banner3.jpg')}]
    },

    aboutUs: {
        active: false,
        description: ``,
        mission: '',
        vision: '',
        values: [],
        images: '',
    },

    contactUs: {
        active: false,
        locations: [],
    },

    itemsList: {
        backgroundColor: 'rgba(255,255,255, 0.5)',
        textColor: 'rgba(0,0,0, 0.8)',
        menuCategoriesBackground: 'rgba(0,0,0, 0.8)',
        iconColor: 'rgb(215,160,0)',
        textPrice: 'rgb(0,0,0)'
    },

    shoppingList: {
        productList: '#efefef',
        textProductList: 'rbg (0,0,0)',
        summaryList: '#FFC200',
        textsummaryList: '#000000'
    },

    footer: {
        icon: require('../../images/fmbSolutions/footerIcon.png'),
        power: require('../../images/powered_fmb.png'),
        backgroundColor: '#666666',
        iconColor: '#FFC200',
        textColor: 'white',

        info: {
            hoursIcon: 'fas fa-lg fa-user-clock',
            hours: 'Lunes a Viernes 10:00 - 20:00 Sábado 10:00 - 15:00',
            emailIcon: 'fas fa-lg fa-envelope',
            email: 'contacto@fmbsolutions.com.mx',
            phoneIcon: 'fas fa-lg fa-phone',
            phone: '+52 771 473 1952',
            addressIcon: 'fas fa-lg fa-location-arrow',
            address: 'Pachuca, Hidalgo. México.',
        },

        socialMedia: {
            youtubeIcon: 'fab fa-2x fa-youtube',
            youtube: 'https://www.youtube.com/channel/UC3XN3-TIyiQtnnELfnJZo3w',
            instagramIcon: 'fab fa-2x fa-instagram',
            instagram: 'a',
            facebookIcon: 'fab fa-2x fa-facebook-f',
            facebook: 'https://www.facebook.com/pg/FMB-Solutions-oficial-102577427958597/about/?ref=page_internal',
        }
    },

    paymentMethod: {
        paypal: {
            enable: true,
            clienId: 'AcgfSWjvFifar4P_3alUSPkhf0Z5g21gs1ieaFCF0HoFojz5GnYxYFE5L-uIH4tZEqWffcTzN_jnqf6l',
        },
        transbank: {
            enable: false,
        }
    },

    BASE_URL: 'http://192.168.0.177:3006/api',
    localStorageNamed: local + 'E-commerce',
};
