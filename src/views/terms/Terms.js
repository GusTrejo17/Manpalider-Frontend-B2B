import React, {Component} from 'react';
import {Footer, NavBar, Session, Suscription} from "../../components";
import {VIEW_NAME, SERVICE_RESPONSE} from "../../libs/utils/Const";
import {ApiClient} from "../../libs/apiClient/ApiClient";
import { connect } from "react-redux";
import { animateScroll as scroll, scroller } from 'react-scroll'

let apiClient = ApiClient.getInstance();

const EMAIL_FORMAT_REGEX = /^([A-Za-z0-9_\-\.+])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

class TermsView extends Component {
    constructor(props){
        super(props);
        this.scrollToBottom = this.scrollToBottom.bind(this);
    }

    scrollToBottom() {
        scroll.scrollToTop({
            duration: 1500,
            delay: 100,
            smooth: 'easeOutQuart',
            isDynamic: true
          })
    }

    componentDidMount(){
        this.scrollToBottom();
    }

    render() {
        const {history} = this.props;
        // console.log('Valor del state', this.state);
        return (
            <div className="content-fluid" style={{marginTop: 150,backgroundColor:"#FFFFFF"}}>
                <Session history={history} view={VIEW_NAME.TERMS_VIEW}/>
                <NavBar/>
                <div className="bannerRedCompensas margenS" style={{backgroundColor:"#FFFFFF" }}>
                    <img className="img-fluid"
                        src={require('../../images/diasa/avisoPrivacidad/icon-10.png')}
                        alt="Segundo NavBar"
                    />
                </div>
                <div className="container" style={{paddingTop: 60, paddingBottom: 20, fontSize: 15}}>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="text-justify">
                                Aceptación de términos y condiciones. Este acuerdo de términos y condiciones (en adelante, “Acuerdo”) se lleva a cabo entre GRUPO REDHOGAR SA DE CV (en adelante, “REDHOGAR/redhogar.com.mx”, “nosotros” o “nuestros”) y usted y sus agentes (en adelante, “usted”, “Su” y “Suyo”) para el uso de este sitio Web. Este acuerdo incluye cualquier lineamiento o regla publicada
                                y actualizada en el Sitio por REDHOGAR/redhogar.com.mx periódicamente. Al usar el Sitio, usted acepta este Acuerdo. Puede revisar la versión más actualizada de este Acuerdo en cualquier momento en el sitio Web de REDHOGAR/redhogar.com.mx.<br/>
                                Propiedad del sitio y restricciones de uso del contenido:<br/>
                                El Sitio es propiedad de REDHOGAR/ REDHOGAR/redhogar.com.mx, usted reconoce que este sitio Web puede contener información, comunicaciones, software, fotos, textos, videos, grácos, música, sonido y otros materiales y servicios (colectivamente y en adelante “Contenido”), que es generalmente proporcionado por REDHOGAR/redhogar.com.mx o por fabricantes
                                proveedores de REDHOGAR/ redhogar.com.mx.<br/>
                                Usted acepta y reconoce que, a pesar de que REDHOGAR/redhogar.com.mx permite el acceso al contenido, el contenido o su uso o el uso de este Sitio web está protegido por derechos de
                                patentes, reproducción, marcas y otros derechos de marca registrada (incluyendo derechos de propiedad intelectual), que estos derechos son válidos y protegidos en todo medio de comunicación ahora existente o posteriormente desarrollado y que excepto como especícamente esté provisto en este Acuerdo. Su uso del Contenido estará determinado y obligado por
                                leyes de patentes, derechos de propiedad y otras leyes de derechos de propiedad de marca. La modicación o uso del Sitio y/o el Contenido para cualquier propósito comercial es una violación de los derechos de patente, marca y otros derechos de marca registrada por REDHOGAR/redhogar.com.mx.cm.mx y terceras partes. Además de los derechos de REDHOGAR/redhogar.com.mx y sus licenciadores, REDHOGAR/ redhogar.com.mx posee derechos de reproducción en elementos individuales de los contenidos, REDHOGAR/redhogar.com.mx posee derecho
                                de reproducción en la selección, coordinación, arreglo y mejora del Contenido. Usted no puede modicar, publicar, transmitir, participar en la transferencia o venta de, reproducir, crear
                                trabajos derivados de, distribuir, ejecutar, exponer, incorporar en otro sitio Web, o explotar en ninguna otra manera el Sitio y/o el Contenido, total o parcialmente, sin la debida autorización.
                                Acceso a servicios de miembro y terminación del acceso: Para obtener acceso a la sección Servicios de Miembros del Sitio web, usted debe ser un miembro vigente de REDHOGAR/redhogar.com.mx e ingresar Su nombre de usuario y contraseña. Usted acepta que será responsable de mantener la condencialidad de Su cuenta de usuario y será responsable también por cualquier actividad que tuviere lugar como resultado de Su permiso a otra persona o entidad del uso de Su cuenta. Usted acepta noticarnos inmediatamente en el evento que Su cuenta haya
                                sido perdida o robada, o usted se haya dado cuenta de cualquier uso no autorizado de Su cuenta o de cualquier otra violación de seguridad que pudiera afectar al Sitio. REDHOGAR/redhogar.com.mx no es responsable de ninguna pérdida o daño que surgiere de Su falla en el cumplimiento de la disposición de esta Sección.<br/>
                                Usted reconoce y acepta que REDHOGAR/redhogar.com.mx puede terminar Sus privilegios de acceso y remover y desechar cualquier Contenido sin aviso para usted por cualquier razón,
                                incluyendo y sin limitación, si usted no usa el Sitio para lo que REDHOGAR/redhogar.com.mx, en su sola discreción, considere ser un periodo extendido de tiempo, REDHOGAR/redhogar.com.mx cree que usted ha violado cualquier disposición de este Acuerdo, y/o de algún otro modo ha actuado o fallado en actuar en una manera que REDHOGAR/redhogar.com.mx
                                juzgue censurable. Usted acepta que cualquier terminación de Su acceso al Sitio no resultará en ninguna responsabilidad u otra obligación de REDHOGAR/redhogar.com.mx hacia usted o
                                hacia ninguna tercera parte en conexión con tal terminación.<br/><br/>
                                Política de Privacidad: Vea la Política de Privacidad de REDHOGAR/redhogar.com.mx. Los términos y condiciones de la Política de Privacidad están incorporados por la presente cláusula por
                                referencia aquí.<br/><br/>
                                Descargo de responsabilidad de garantías: El uso de este sitio es exclusivamente bajo su propio riesgo. Este sitio es provisto en una base "como es" y "como esta disponible". REDHOGAR/redhogar.com.mx expresamente descarga responsabilidad de cualquier garantía de cualquier tipo con respecto al sitio, sea expreso o implícito, incluyendo garantías implícitas de comerciabilidad, aptitud para un propósito particular, titulo o no violación. REDHOGAR/redhogar.com.mx no garantiza que este sitio y/o su Contenido en ese respecto satisfacerá sus requerimientos, o que será ininterrumpido, oportuno, seguro, actual, exacto, completo o libre de errores o que los resultados que puedan obtenerse por el uso del sitio y/o cualquier contenido
                                en ello será exacto o conable. Usted entiende y reconoce que su sola y exclusiva remediación respecto a cualquier defecto o insatisfacción con el sitio es suspender el uso del sitio.<br/><br/>
                                Limitación de responsabilidad: Usted expresamente entiende y acepta que REDHOGAR/redhogar.com.mx no será responsable directa, indirecta, incidental, especial, consecuentemente o
                                ejemplarmente, incluyendo y sin limitación, daños por la perdida de utilidades, derechos de llave, uso, pérdida de datos y otras perdidas (incluso si REDHOGAR/redhogar.com.mx ha sido
                                noticada de la posibilidad de estos daños) resultantes de: el uso o incapacidad de uso del sitio, el costo de obtención de cualquier producto y/o servicios sustituidos resultantes de cualquier producto, datos, información o servicios obtenidos o de aquellos que usted fuera incapaz de obtener o transacciones efectuadas o no posibles de ser efectuadas, cualquier enlace
                                provisto en conexión con este sitio, o cualquier asunto de otro modo relacionado con su uso del sitio.<br/>
                                Su conducta en el sitio: En el evento de que REDHOGAR/redhogar.com.mx le permita subir, publicar, enviar correos electrónicos o de otra forma transmitir contenidos, datos, información u
                                otros materiales (colectivamente y en adelante, “Contenido de Usuario”) para exponer en el sitio, usted será responsable de todo aquel Contenido de Usuario que cargue, publique, envíe
                                por correo electrónico o transmita de otro modo al usar el Sitio. Al enviar Contenido de Usuario a REDHOGAR/redhogar.com.mx, usted automáticamente concede el derecho a REDHOGAR/redhogar.com.mx de que esta información sea manipulada en sus servidores. Usted está expresamente prohibido de poner cualquier mensaje en ningún Contenido de Usuario o ningún
                                producto, bien o servicio o de otra manera transmitir a través de o colocar en el Sitio (incluyendo mensajes de correo electrónico o ningún chat o mensaje de foro) ningún material ilegal,
                                nocivo, amenazador, abusivo, hostigador, difamatorio, vulgar, obsceno, sexualmente explícito, irreverente, que fomente el odio, censurable racial o étnicamente de ningún tipo, incluyendo
                                y sin limitación, ningún material que promueva conducta que pudiere constituir ofensa criminal, dar lugar a una responsabilidad civil, o de otra manera violar cualquier ley aplicable a nivel
                                local, estatal, nacional o internacional (colectivamente y en adelante, “Conducta Prohibida”). La Conducta Prohibida expresamente incluye cualquier transmisión a personas u otras entidades en listas de correos a las que usted no tenga los derechos totales de uso. Usted acepta y reconoce que REDHOGAR/redhogar.com.mx no es responsable hacia usted o cualquier otra
                                parte o usuario del Sitio por cualquier Conducta Prohibida que usted o cualquier parte o usuario del Sitio hubieren llevado a cabo.
                                Usted no puede directa o indirectamente, de forma intencional interrumpir o interferir el Sitio de modo que pueda afectar desfavorablemente a REDHOGAR/redhogar.com.mx o cualquier
                                usuario del Sitio.<br/>
                                Usted no puede cargar, publicar, enviar por correo electrónico o de otra manera transmitir ningún material que contenga software con virus o ningún otro código, archivo o programa
                                diseñado o conocido para inutilizar, interrumpir o limitar la funcionalidad de ningún equipo de computación o equipo o facilidad de telecomunicaciones.
                                Sus responsabilidades: Además usted acepta y se compromete a proporcionar información veras y exacta para que REDHOGAR/redhogar.com.mx pueda procesarla adecuadamente.
                                Exposición de productos: Usamos esfuerzos comercialmente razonables para asegurar que los colores, diseños y detalles de los productos expuestos en el Sitio sean exactos. Sin embargo,
                                no podemos y no garantizamos que los colores, tipo de letras, diseño, existencias de papel y/o detalles, tal como son expuestos por su monitor, serán exactos y no asumimos ninguna
                                responsabilidad en absoluto por tal diferencia en color, diseño y detalles.<br/>
                                Información de marca: REDHOGAR/redhogar.com.mx y su logotipo son marcas registradas de REDHOGAR/redhogar.com.mx. Otras marcas expuestas en este sitio son propiedad de tal
                                marca registrada.<br/>
                                Su sumisión: Si usted contacta a REDHOGAR/redhogar.com.mx con información que incluye, sin limitación, datos de opinión (por ejemplo, preguntas, comentarios, sugerencias o similares)
                                sobre este Sitio, el Contenido del Sitio o cualquier ítem del Sitio (colectivamente y en adelante, “Opinión de Usuario”), la Opinión de Usuario deberá ser juzgada como no condencial y
                                REDHOGAR/redhogar.com.mx no tendrá obligación de ningún tipo con respecto a la Opinión de Usuario. Además, usted acepta y reconoce que REDHOGAR/redhogar.com.mx tendrá libertad de reproducir, usar, revelar, exponer, exhibir, transmitir, presentar, crear trabajos derivados y distribuir la Opinión de Usuario a otros sin limitación, y autorizar a otros a hacer lo mismo.
                                Además, REDHOGAR/redhogar.com.mx tendrá la libertad de usar cualquier idea, concepto, conocimientos o técnicas contenidas en la Opinión de Usuario para cualquier propósito en absoluto, incluyendo y sin limitación, desarrollo, manufactura y mercadeo de productos y otros ítems incorporando Opinión de Usuario. REDHOGAR/redhogar.com.mx no será responsable o
                                deberá ninguna compensación por el uso o revelación de la Opinión de Usuario.<br/>
                                Enlaces: El Sitio puede proveer, o terceras partes pueden proveer, enlaces a otros sitios Web. Usted reconoce y acepta que tales enlaces son proporcionados para su conveniencia y no reejan aprobación alguna de REDHOGAR/redhogar.com.mx con respecto al proveedor de tal sitio enlazado o de la calidad, responsabilidad o cualquier otra característica o rasgo de tal sitio
                                enlazado y REDHOGAR/redhogar.com.mx no es responsable en ninguna forma (incluyendo y sin limitación con respecto a cualquier pérdida o daño que pueda sufrir) por cualquier asunto
                                asociado con el sitio enlazado, incluyendo y sin limitación, el contenido provisto en o a través de tal sitio enlazado o su conanza en él. REDHOGAR/redhogar.com.mx NO REPRESENTA NI
                                GARANTIZA A NINGÚN SITIO ENLAZADO. SU USO DE CUALQUIER SITIO ENLAZADO ES EXCLUSIVAMENTE BAJO SU PROPIO RIESGO. Además, usted deberá estar al tanto de que Su uso de
                                cualquier sitio enlazado es sujeto de los términos y condiciones aplicables a aquel sitio, incluyendo las políticas de privacidad (o falta de ellas) de tal sitio, por lo que se recomienda antes de
                                realizar dicho enlace, consultar y leer los términos de uso y políticas de dichos sitios.
                            </div>
                        </div>    
                    </div>
                </div>
                <Suscription/>
            </div>
        );
    }
}

const mapStateToProps = store => {
    return {
        notificationReducer: store.NotificationReducer,
        configReducer: store.ConfigReducer
    };
};

export default connect(
    mapStateToProps
)(TermsView);