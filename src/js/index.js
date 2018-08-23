import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import * as firebase from 'firebase';
import {DB_CONFIG} from '../config/config';

//Components
import Admin from './components/admin';
import Wrapper from './components/wrapper';
import Header from './components/header';
import Display from './components/display';
import Control from './components/control';
import Login from './components/login';
import Signup from './components/signup';
import Recent from './components/recentnotes';
import Chart from './components/chart';

var style = require('../scss/main.scss');

class App extends Component {
    constructor(props) {
        super(props);
        // Firebase
        this.fb = firebase.initializeApp(DB_CONFIG);
        this.database = this.fb.database().ref().child('items');
        this.db = this.fb.database().ref();

        this.state = {
            items: {
                ian: {}
            },
            user: null,
            userlist: [],
            active: 'default',
            loginError: false,
            signupError: false,
            loading: false
        }

        this.handleAddAction = this.handleAddAction.bind(this);
        this.handleLoginAction = this.handleLoginAction.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        this.deletePost = this.deletePost.bind(this);
        this.handleSignupAction = this.handleSignupAction.bind(this);
        this.handleSignup = this.handleSignup.bind(this);
        this.handleSignOutAction = this.handleSignOutAction.bind(this);
        this.addPost = this.addPost.bind(this);
        this.updatePost = this.updatePost.bind(this);
        this.toggleMobile = this.toggleMobile.bind(this);
        this.toggleAdmin = this.toggleAdmin.bind(this);
        this.updateUser = this.updateUser.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
        this.setState = this.setState.bind(this);
    }
    componentDidMount() {
        var items = this.state.items;
        const allItems = this.database.child('ian').orderByValue();
        // Listeners for all changes to post items
        allItems.on('child_added', snap => {
            items.ian[snap.key] = {
                author: snap.val().author,
                date: snap.val().date,
                notes: snap.val().note,
                value: snap.val().value
            };
            if (snap.val().spent !== undefined) {
                items.ian[snap.key]['spent'] = snap.val().spent;
            }
            this.setState({items});
        });
        allItems.on('child_changed', snap => {
            items.ian[snap.key] = {
                author: snap.val().author,
                date: snap.val().date,
                notes: snap.val().note,
                value: snap.val().value
            };
            if (snap.val().spent !== undefined) {
                items.ian[snap.key]['spent'] = snap.val().spent;
            }
            this.setState({items});
        });
        allItems.on('child_removed', snap => {
            delete items.ian[snap.key];
            this.setState({items});
        });
        //Authentication listener for logging in/siging up
        this.fb.auth().onAuthStateChanged((user) => {
            if (user) {
                var ref = this.db.child('users').child(user.uid);
                var currentUser = {};
                ref.once('value', snap => {
                    currentUser['name'] = snap.val().name;
                    currentUser['email'] = snap.val().email;
                    currentUser['permission'] = snap.val().permission;
                    currentUser['super'] = snap.val().super ? true : false;
                }).then(() => {
                    //If user has superuser permissions, populate userlist for admin view
                    if (currentUser.super) {
                        let reqlist = this.db.child('users');
                        let userlist = this.state.userlist;
                        //Listeners for all changes to users
                        reqlist.on('child_added', snap => {
                            userlist[snap.key] = {
                                email: snap.val().email,
                                name: snap.val().name,
                                permission: snap.val().permission,
                            };
                            if (snap.val().super !== undefined) {
                                userlist[snap.key]['super'] = snap.val().super;
                            }
                            this.setState({userlist});
                        });
                        reqlist.on('child_changed', snap => {
                            userlist[snap.key] = {
                                email: snap.val().email,
                                name: snap.val().name,
                                permission: snap.val().permission,
                            };
                            if (snap.val().super !== undefined) {
                                userlist[snap.key]['super'] = snap.val().super;
                            }
                            this.setState({userlist});
                        });
                        reqlist.on('child_removed', snap => {
                            delete userlist[snap.key];
                            this.setState({userlist});
                        });
                    }
                    this.setState({
                        user: currentUser,
                        active: 'default'
                    },() => {console.log(this.state)});   
                });
            } else {
                this.setState({
                    user: null,
                    active: 'default'
                });
            }
        });
    }
    addPost(post) {
        var id = Object.keys(this.state.items.ian).length + 1;
        this.database.child('ian').child(id).set(post);
        this.setState({
            active: 'default'
        });
    }
    updatePost(post) {
        var update = {
            date: post.date,
            note: post.note,
            value: post.value,
            spent: false
        }
        if (post.author) {
            update['author'] = post.author;
        }
        if (post.spent) {
            update['spent'] = post.spent;
        }
        this.database.child('ian').child(post.id).update(update);
        if (this.state.active !== 'admin') {
            this.setState({
                active: 'default'
            }); 
        }
    }
    deletePost(post) {
        this.database.child('ian').child(post.id).remove();
        if (this.state.active !== 'admin') {
            this.setState({
                active: 'default'
            }); 
        }
    }
    updateUser(user, id) {
        this.db.child('users').child(id).update(user);
    }
    deleteUser(id) {
        this.db.child('users').child(id).remove();
    }
    handleLoginAction(active) {
        if(active){
            this.setState({
                active: 'login'
            });
        } else {
            this.setState({
                active: 'default'
            });
        }
    }
    handleAddAction(active) {
        if(active){
            this.setState({
                active: 'add'
            });
        } else {
            this.setState({
                active: 'default'
            });
        }
    }
    handleSignupAction(active) {
        if(active){
            this.setState({
                active: 'signup'
            });
        } else {
            this.setState({
                active: 'default'
            });
        }
    }
    handleSignOutAction() {
        this.fb.auth().signOut().then(() => {
            this.setState({
                active: 'default'
            });
        });
    }
    handleSignup(user) {
        this.setState({
            loading: true,
            active: 'default'
        });
        this.fb.auth().createUserWithEmailAndPassword(user.email, user.password).then((NewUser) => {
            this.db.child('users').child(NewUser.uid).set({
                name: user.name,
                email: user.email,
                permission: 0
            });
            this.setState({
                signupError: false,
                loading: false
            });
        }).catch((error) => {
            this.setState({
                signupError : true,
                loading: false,
                active: 'signup'
            });
        });
    }
    handleLogin(user) {
        this.setState({
            loading: true,
            active: 'default'
        });
        this.fb.auth().signInWithEmailAndPassword(user.email, user.password).then(()=> {
            this.setState({
                loginError: false,
                loading: false
            });
        }).catch((error) => {
            this.setState({
                loginError: true,
                loading: false,
                active: 'login'
            })
        });
    }
    toggleMobile() {
        var active = this.state.active === "default" || this.state.active === "admin"  ? "mobile" : "default";
        this.setState({
            active
        })
    }
    toggleAdmin() {
        var active = this.state.active === "admin" ? "default" : "admin";
        this.setState({
            active
        })
    }
    render() {
        return (
       <Wrapper active={this.state.active}>
            <Header 
                title="Point Tracker" 
                handleLoginAction={this.handleLoginAction} 
                handleSignupAction={this.handleSignupAction} 
                handleAddAction={this.handleAddAction}
                user={this.state.user} 
                active={this.state.active}
                handleSignOutAction={this.handleSignOutAction}
                handleToggleMobile={this.toggleMobile}
                handleToggleAdmin={this.toggleAdmin}
                />
                <div className="main-content">
                    <Display items={this.state.items} />
                    <Recent items={this.state.items} updatePost={this.updatePost} user={this.state.user} deletePost={this.deletePost}/>
                    <Chart items={this.state.items} />
                    { this.state.user !== null && this.state.user.permission !== 0 ? 
                        <Control 
                            items={this.state.items} 
                            addPost={this.addPost} 
                            user={this.state.user}
                            active={this.state.active === 'add' ? true : false}
                            handleAddAction={this.handleAddAction}/>
                    : 
                        null
                    }
                    { this.state.user !== null && this.state.user.super ? <Admin items={this.state.items} users={this.state.userlist} handleToggleAdmin={this.toggleAdmin} updateUser={this.updateUser} deleteUser={this.deleteUser} updatePost={this.updatePost} deletePost={this.deletePost} /> : null }
                </div>
                <Login 
                    handleLoginAction={this.handleLoginAction} 
                    handleLogin={this.handleLogin} 
                    active={this.state.active === 'login' ? true : false}
                    loginError={this.state.loginError}>
                </Login>
                <Signup 
                    handleSignupAction={this.handleSignupAction} 
                    handleSignup={this.handleSignup}
                    active={this.state.active === 'signup' ? true : false}
                    signupError={this.state.signupError}> 
                </Signup> 
                <div className={ this.state.loading ? 'signal' : 'hide signal' }></div>
                <div className="overlay" onClick={(e) => { this.setState({ active: 'default' })}}></div>

        </Wrapper>
        );
    }
}

ReactDOM.render(
 <App/>, document.getElementById('app')
);