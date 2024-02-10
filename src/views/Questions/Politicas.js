import React, {Component} from 'react';
import {Footer, NavBar, Session} from "../../components";
import {VIEW_NAME, config} from "../../libs/utils/Const";
import { animateScroll as scroll, scroller } from 'react-scroll';

class Politicas extends Component {

    constructor(props) {
        super(props);

        this.scrollToBottom = this.scrollToBottom.bind(this);
    };


    async componentDidMount(){
        this.scrollToBottom();
    };

    scrollToBottom() {
	    scroll.scrollToTop({
	        duration: 1000,
	        delay: 100,
	        smooth: 'easeOutQuart',
	        isDynamic: true
	      })
    }

    render() {
        const {history} = this.props;
        return (
            <div className="content-fluid" style={{marginTop: 150,backgroundColor:config.Back.backgroundColor }}>
                <Session history={history} view={VIEW_NAME.POLITICS_US_VIEW}/>
                <NavBar/>
                <div className="container" style={{paddingTop: 60, paddingBottom: 20 }}>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="jumbotron">
                                <h1 className="display-4 text-center">Términos y condiciones</h1>
                            </div>
                        </div>    
                    </div>
                    <div className="container">
                        <div className="row">
                            <div className="accordion" id="accordionExample">
                                <div className="card">
                                    <div className="card-header" id="headingOne">
                                        <h2 className="mb-0">
                                            <button className="btn btn-link" type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                            Aspectos generales
                                            </button>
                                        </h2>
                                    </div>
                                    <div id="collapseOne" className="collapse show" aria-labelledby="headingOne" data-parent="#accordionExample">
                                        <div className="card-body">
                                            <p>Bienvenido a JACUZZI CHILE. Estos Términos y Condiciones regulan el acceso en Chile a nuestro sitio www.Jacuzzi.cl o www.Jacuzzistore.cl y su uso por todo usuario o consumidor. En este sitio podrás usar, sin costo alguno, nuestro software y nuestras aplicaciones, para visitar, comparar y adquirir, si lo deseas, los productos y servicios que se exhiben aquí. Te recomendamos leer atentamente estos términos y condiciones.</p>
                                            <p>Estos Términos y Condiciones se aplicarán y se entenderán incorporados en todas las compras y a todos los servicios que contrates con Jacuzzi Chile S.A. (en adelante “Jacuzzi”), mediante los sistemas de comercialización comprendidos en este sitio web. Esos contratos, el uso de este sitio web y la aplicación de estos Términos y Condiciones se someterán a las leyes de la República de Chile; especialmente las que protegen los derechos de los consumidores, sin renunciar a los derechos y acciones que otorgan estas leyes.</p>
                                            <p>En consecuencia, gozarás de todos los derechos que te reconoce la ley chilena y, además, de los que te otorgan estos términos y condiciones. Podrás también acceder, en este mismo sitio, a los hipervínculos, cuyo objeto es facilitarte el acceso e incrementar los beneficios de uso del sitio, que pueden variar periódicamente, sin afectar, en caso alguno, derechos adquiridos por los consumidores.</p>
                                            <p>Jacuzzi aplicará estrictamente todos los beneficios y garantías que la Ley sobre de Protección a los Derechos de los Consumidores establece para las transacciones que se realizan a través de este sitio. Adicionalmente www.Jacuzzistore.cl adhiere en todas sus partes al Código de Buenas Prácticas para el Comercio Electrónico de la Cámara de Comercio de Santiago. Este código de buenas prácticas se encuentra disponible en este mismo sitio. (Ver Código de Buenas Prácticas)</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="card">
                                    <div className="card-header" id="headingTwo">
                                        <h2 className="mb-0">
                                            <button className="btn btn-link" type="button" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="true" aria-controls="collapseTwo">
                                            Comunicaciones eletrónicas
                                            </button>
                                        </h2>
                                    </div>
                                    <div id="collapseTwo" className="collapse" aria-labelledby="headingTwo" data-parent="#accordionExample">
                                        <div className="card-body">
                                            <p>Toda comunicación promocional o publicitaria enviada electrónicamente desde este sitio indicará el asunto a que se refiere, nuestra identidad como remitente y, además, un link para que el destinatario, si lo desea, e imprimir un comprobante de la solicitud.</p>
                                            <p>Jacuzzi Chile no solicita datos personales ni financieros a través de e-mail ni de ninguna otra forma escrita. Si tienes cualquier duda comunícate con nosotros al +56 2 2592 2222 o a contacto@Jacuzzi.cl, donde atenderemos todas tus consultas.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="card">
                                    <div className="card-header" id="headingFour">
                                        <h2 className="mb-0">
                                            <button className="btn btn-link" type="button" data-toggle="collapse" data-target="#collapseFour" aria-expanded="true" aria-controls="collapseFour">
                                            Libertad para navegar y comprar productos y servicios
                                            </button>
                                        </h2>
                                    </div>
                                    <div id="collapseFour" className="collapse" aria-labelledby="headingFour" data-parent="#accordionExample">
                                        <div className="card-body">
                                            <p>La sola visita de este sitio no te impone obligación alguna, a menos que hayas expresado en forma inequívoca y mediante actos positivos tu voluntad de adquirir determinados bienes o servicios, en la forma indicada en estos Términos y Condiciones.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="card">
                                    <div className="card-header" id="headingEleven">
                                        <h2 className="mb-0">
                                            <button className="btn btn-link" type="button" data-toggle="collapse" data-target="#collapseEleven" aria-expanded="true" aria-controls="collapseEleven">
                                            Políticas de seguridad
                                            </button>
                                        </h2>
                                    </div>
                                    <div id="collapseEleven" className="collapse" aria-labelledby="headingEleven" data-parent="#accordionExample">
                                        <div className="card-body">
                                            <p>Jacuzzi adoptará las medidas necesarias y prudentes para resguardar la seguridad de tus datos y de tu clave secreta. En caso de detectarse cambios en la información que has registrado en el sitio, o bien, ante cualquier irregularidad en las transacciones relacionadas con tu identificación o la del medio de pago, o simplemente como medida de protección a tu identidad, nuestros ejecutivos podrán contactarte por vía telefónica o e-mail, a fin de corroborar tus datos e intentar evitar posibles fraudes.</p>
                                            <p>Los datos personales que voluntariamente entregues al hacer uso de este sitio, al completar un proceso de compra, sólo podrán ser tratados por Jacuzzi para el llenado automático de los documentos, recibos o comprobantes asociados a tus transacciones y para la operación de los medios de pago disponibles en el sitio; no serán entregados a terceros.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="card">
                                    <div className="card-header" id="headingTwelve">
                                        <h2 className="mb-0">
                                            <button className="btn btn-link" type="button" data-toggle="collapse" data-target="#collapseTwelve" aria-expanded="true" aria-controls="collapseTwelve">
                                            Alcance de los precios informados en este sitio
                                            </button>
                                        </h2>
                                    </div>
                                    <div id="collapseTwelve" className="collapse" aria-labelledby="headingTwelve" data-parent="#accordionExample">
                                        <div className="card-body">
                                            <p>Jacuzzi no modificará las condiciones bajo las cuales haya contratado con los consumidores en este sitio. Mientras aparezcan en este sitio, los precios informados estarán a tu disposición, aunque no sean los mismos que se ofrezcan en otros canales de venta de Jacuzzi, como tiendas físicas, Mercado Libre u otros.</p>
                                            <p>Cualquier cambio en las informaciones publicadas en este sitio, incluyendo las referidas a mercaderías, servicios, precios, existencias y condiciones, promociones y ofertas, tendrá lugar antes de recibir una orden de compra y solo se referirá a operaciones futuras, sin afectar, en caso alguno, derechos adquiridos por los consumidores.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="card">
                                    <div className="card-header" id="headingThirteen">
                                        <h2 className="mb-0">
                                            <button className="btn btn-link" type="button" data-toggle="collapse" data-target="#collapseThirteen" aria-expanded="true" aria-controls="collapseThirteen">
                                            Promociones y ofertas
                                            </button>
                                        </h2>
                                    </div>
                                    <div id="collapseThirteen" className="collapse" aria-labelledby="headingThirteen" data-parent="#accordionExample">
                                        <div className="card-body">
                                            <p>Las promociones y ofertas que se ofrezcan en este sitio no serán necesariamente las mismas que ofrezcan otros canales de venta de Jacuzzi. En las promociones que consistan en la entrega gratuita o rebajada de un producto por la compra de otro, el despacho del bien que se entregue gratuitamente o a precio rebajado se hará en el mismo lugar al cual se despache el producto comprado, salvo que solicites, al aceptar la promoción u oferta, que los productos se remitan a direcciones distintas, en cuyo caso deberás pagar el valor del despacho de ambos productos. No se podrá participar en estas promociones sin adquirir conjuntamente todos los productos comprendidos en ellas.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="card">
                                    <div className="card-header" id="headingFourteen">
                                        <h2 className="mb-0">
                                            <button className="btn btn-link" type="button" data-toggle="collapse" data-target="#collapseFourteen" aria-expanded="true" aria-controls="collapseFourteen">
                                            Propiedad intelectual
                                            </button>
                                        </h2>
                                    </div>
                                    <div id="collapseFourteen" className="collapse" aria-labelledby="headingFourteen" data-parent="#accordionExample">
                                        <div className="card-body">
                                            <p>Todos los contenidos incluidos en este sitio, como textos, material gráfico, logotipos, íconos de botones, códigos fuente, imágenes, audio clips, descargas digitales y compilaciones de datos, son propiedad de Jacuzzi, o de sus proveedores de contenidos, y están protegidos por las leyes chilenas e internacionales sobre propiedad intelectual. Los materiales gráficos, logotipos, encabezados de páginas, frases publicitarias, iconos de botones, textos escritos y nombres de servicios incluidos en este sitio son marcas comerciales, creaciones o imágenes comerciales de propiedad de Jacuzzi Chile S.A en Chile y en otros países. Dichas marcas, creaciones e imágenes comerciales no se pueden usar en relación a ningún producto o servicio que pueda causar confusión entre los clientes y en ninguna forma que desprestigie o desacredite a Jacuzzi. Las demás marcas comerciales que no sean de propiedad de Jacuzzi Chile S.A.  y que aparezcan en este sitio pertenecen a sus respectivos dueños.</p>
                                            <p>Todos los derechos no expresamente otorgados en estos Términos y Condiciones son reservados por Jacuzzi, proveedores, editores, titulares de derechos u otros proveedores de contenidos. Ningún producto, imagen o sonido pueden ser reproducidos, duplicados, copiados, vendidos, revendidos, visitados o explotados para ningún fin, en todo o en parte, sin el consentimiento escrito previo de Jacuzzi. No se puede enmarcar o utilizar técnicas de enmarcación para encerrar alguna marca comercial, logotipo u otra información registrada o patentada (incluyendo imágenes, texto, disposición de páginas, o formulario) de Jacuzzi Chile S.A, sin nuestro consentimiento escrito previo. Tampoco se puede usar meta etiquetas ni ningún otro “texto oculto” que use el nombre o marcas comerciales de Jacuzzi Chile S.A., sin autorización escrita previa de esta empresa. Se prohíbe hacer un uso indebido de este sitio o de estas marcas, licencias o patentes. Lo anterior, sin perjuicio de las excepciones expresamente señaladas en la ley.</p>
                                            <p>Jacuzzi respeta la propiedad intelectual de otros. Si crees que tu trabajo ha sido copiado en forma tal que constituye una violación del derecho de propiedad intelectual, contáctate con nosotros a contacto@Jacuzzi.cl</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Politicas;