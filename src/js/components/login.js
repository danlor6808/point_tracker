import React, { Component } from 'react';

export default class Login extends Component {
    constructor(props) {
        super(props);
            // NOTE 
            // this is the initial state, it only initiates ONCE
            // so in order for this state to get updated by the parent's props
            // we had to use the "componentWillReceieProps" function and get 
            // the data from there
            this.state = this.initialState();

            this.handleSubmit = this.handleSubmit.bind(this);
            this.initialState = this.initialState.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        this.setState({ show: nextProps.active, loginError: nextProps.loginError });  
    }
    initialState() {
        return {
            email: '',
            password: '',
            emailError: false,
            passwordError: false,
            loginError: this.props.loginError,
            show: this.props.active
        };
    }
    handleSubmit() {
        var email = this.state.email
        var password = this.state.password;
        let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var state = {};
        if(email === '' || !re.test(email)) {
            state['emailError'] = true;
        } else {
            state['emailError'] = false;
        }

        if(password === '') {
            state['passwordError'] = true;
        } else {
            state['passwordError'] = false;
        }  
        
        if(!state.emailError && !state.passwordError) {
            this.props.handleLogin({
                email: this.state.email,
                password: this.state.password,
                setState: this.setState
            });
        }
        else {
            this.setState(state);
        }
    }
    handleKeyPress(e) {
        if (e.key === "Enter") {
            this.handleSubmit();
        }
    }
    render() {
        return(
            <div className={this.state.show ? 'login-dialog show' : 'login-dialog'}>
                <div className="input-container">
                    <div className="login">
                        <h2>Login</h2>
                        <div className="input-group">
                            <div className="input-row">
                                <input 
                                    type="email" 
                                    id="login-email" 
                                    className={this.state.email !== '' ? 'valid' : null}
                                    onKeyPress={(e) => { this.handleKeyPress(e)}}
                                    onChange={(e) => { this.setState({ email : e.target.value, emailError: false, loginError : false })}} />
                                <label htmlFor="login-email">E-mail</label>
                                { this.state.emailError ? <span className="error">Please enter a valid e-mail address</span> : null }
                            </div>
                            <div className="input-row">
                                <input 
                                    type="password" 
                                    id="login-pass" 
                                    className={this.state.password !== '' ? 'valid' : null}
                                    onKeyPress={(e) => { this.handleKeyPress(e)}}
                                    onChange={(e) => { this.setState({ password : e.target.value, passwordError : false, loginError : false })}}/>
                                <label htmlFor="login-pass">Password</label>
                                { this.state.loginError ? <span className="error">There was a problem with your login information</span> : null }
                            </div>
                            <div className="input-row">
                                <button className="btn" onClick={(e) => { this.props.handleLoginAction(false) } }>Cancel</button>
                                <button className="btn" onClick={(e) => { this.handleSubmit() } }>Login</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

