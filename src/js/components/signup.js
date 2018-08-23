import React, { Component } from 'react';

export default class Signup extends Component {
    constructor(props) {
        super(props);
            // NOTE 
            // this is the initial state, it only initiates ONCE
            // so in order for this state to get updated by the parent's props
            // we had to use the "componentWillReceieProps" function and get 
            // the data from there
            this.state = this.initialState();

            this.initialState = this.initialState.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        this.setState({ show: nextProps.active, signupError: nextProps.signupError });  
    }
    initialState() {
        return {
            name: '',
            email: '',
            password: '',
            password2: '',
            show: this.props.active,
            nameError: false,
            emailError: false,
            passwordError: false,
            password2Error: false,
            signupError: this.props.signupError
        }
    }
    handleSubmit() {
        let name = this.state.name;
        let email = this.state.email;
        let password = this.state.password;
        let password2 = this.state.password2;
        let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let state = {};
        if (name === '') {
            state['nameError'] = true;
        }
        else {
            state['nameError'] = false;
        }

        if (email === '' || !re.test(email)) {
            state['emailError'] = true;
        } else {
            state['emailError'] = false;
        }

        if (password === '' || password.length <= 5) {
            state['passwordError'] = true;
        } else {
            state['passwordError'] = false;
        }

        if (!state.nameError && !state.emailError && !state.passwordError && !state.password2Error) {
            var user = {
                name: this.state.name,
                email: this.state.email,
                password: this.state.password
            };
            this.props.handleSignup(user);
        } else {
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
            <div className={this.state.show ? 'signup-dialog show' : 'signup-dialog'}>
                <div className="input-container">
                    <div className="signup">
                        <h2>Signup</h2>
                        <div className="input-group">
                            <div className="input-row">
                                <input 
                                    type="text" 
                                    id="signup-name" 
                                    className={this.state.name !== '' ? 'valid' : null}
                                    onKeyPress={(e) => { this.handleKeyPress(e)}}
                                    onChange={(e) => { this.setState({ name : e.target.value, nameError : false })}} />
                                <label htmlFor="signup-name">Name</label>
                                { this.state.nameError ? <span className="error">Name cannot be blank</span> : null }
                            </div>
                            <div className="input-row">
                                <input 
                                    type="email" 
                                    id="signup-email" 
                                    className={this.state.email !== '' ? 'valid' : null}
                                    onKeyPress={(e) => { this.handleKeyPress(e)}}
                                    onChange={(e) => { this.setState({ email : e.target.value, emailError : false, signupError: false })}} />
                                <label htmlFor="signup-email">E-mail</label>
                                { this.state.emailError ? <span className="error">Please enter a valid e-mail address</span> : null }
                                { this.state.signupError ? <span className="error">E-mail address seems to be already in use</span> : null }
                            </div>
                            <div className="input-row">
                                <input 
                                    type="password" 
                                    id="signup-pass" 
                                    className={this.state.password !== '' ? 'valid' : null}
                                    onKeyPress={(e) => { this.handleKeyPress(e)}}
                                    onChange={(e) => { this.setState({ password : e.target.value, passwordError : false })}}/>
                                <label htmlFor="signup-pass">Password</label>
                                { this.state.passwordError ? <span className="error">Please choose a password that is at least 6 characters</span> : null }
                            </div>
                            <div className="input-row">
                                <input 
                                    type="password" 
                                    id="signup-pass2" 
                                    className={this.state.password2 !== '' ? 'valid' : null}
                                    onKeyPress={(e) => { this.handleKeyPress(e)}}
                                    onChange={(e) => { this.setState({ password2 : e.target.value, password2Error : e.target.value !== this.state.password ? true : false })}}/>
                                <label htmlFor="signup-pass2">Verify Password</label>
                                { this.state.password2Error && !this.state.passwordError ? <span className="error">Passwords do not match</span> : null }
                            </div>
                            <div className="input-row">
                                <button className="btn" onClick={(e) => { this.props.handleSignupAction(false) } }>Cancel</button>
                                <button className="btn" onClick={(e) => { this.handleSubmit() } }>Signup</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

