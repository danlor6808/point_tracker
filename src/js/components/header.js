import React, {Component} from 'react';
// import { Link } from 'react-router';

const Header = (props) => {
    if (props.user === null) {
        return(
            <header>
                {/* <Link className="branding" to="/">{props.title}</Link> */}
                <button className={props.active === "mobile" ? "mobile-nav open" : "mobile-nav"} onClick={(e) => { props.handleToggleMobile() } }>
                    <span className="bar"></span>
                    <span className="bar"></span>
                    <span className="bar"></span>
                </button>
                <nav className={props.mobile ? "open" : null}>
                    <ul>
                        <li className="header">Menu</li>
                        <li><a className="btn" href="#" onClick={(e) => { props.handleLoginAction(true) } }>Login</a></li>
                        <li><a className="btn" href="#" onClick={(e) => { props.handleSignupAction(true) } }>Signup</a></li>
                    </ul>
                </nav>
            </header>
        );
    } else {
        return(
            <header>
                <span className="branding" to="/">{props.title}</span>
                <button className={props.active === "mobile" ? "mobile-nav open" : "mobile-nav"} onClick={(e) => { props.handleToggleMobile() } }>
                    <span className="bar"></span>
                    <span className="bar"></span>
                    <span className="bar"></span>
                </button>
                <nav className={props.mobile ? "open" : null}>
                    <ul>
                        <li className="header">Hello, {props.user.name}</li>
                        <li>
                            <a className="btn hide-mobile" href="#">Hello, {props.user.name}</a>
                            <ul className="submenu">
                                { props.user.permission === 1 ? <li><a href="#" className="btn" onClick={(e) => { e.preventDefault(); props.handleAddAction(true) } }>Post Points</a></li> : null}
                                { props.user.super ? <li><a className="btn" href="#" onClick={(e) => { props.handleToggleAdmin() } }>Admin Panel</a></li> : null}
                                <li><a className="btn" href="#" onClick={(e) => { props.handleSignOutAction() } }>Sign Out</a></li>
                            </ul>
                        </li>
                    </ul>
                </nav>
            </header>
            );
        }
}

export default Header;