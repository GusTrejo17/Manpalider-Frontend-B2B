import React, { Component } from 'react';

class NavBarButton extends Component {
    render() {
        const { icon, iconColor, ruta } = this.props;
        return (
            <button className="navbar-toggler toggler-example ml-auto" 
                type="button" data-toggle="collapse"
                data-target="#navbarSupportedContent1"
                aria-controls="navbarSupportedContent1" 
                aria-expanded="false" 
                aria-label="Toggle navigation" 
                style={{color: iconColor, width: "100%"}}
            >
                <span className="dark-blue-text">
                    <i className={icon} />
                    {/* <img src={ruta} style={{ color: iconColor, fontSize: 25, width:35 }}/> */}
                </span>
            </button>
        );
    }
}

export default NavBarButton;