import React, { Component } from 'react';
import ReactTable from "react-table";
import "react-table/react-table.css";
import DatePicker from 'react-datepicker';
import moment from 'moment';

export default class Admin extends Component {
    constructor(props) {
        super(props);
        
        this.state = this.initialState();
        this.initialState = this.initialState.bind(this);
        this.allItems = this.allItems.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleDate = this.handleDate.bind(this);
        this.confirmDelete = this.confirmDelete.bind(this);

        this.handleColAuthor = this.handleColAuthor.bind(this);
        this.handleColDate = this.handleColDate.bind(this);
        this.handleColValue = this.handleColValue.bind(this);
        this.handleColNotes = this.handleColNotes.bind(this);
        this.handleColSpent = this.handleColSpent.bind(this);
        this.handleColAction = this.handleColAction.bind(this);

        this.userHandleEdit = this.userHandleEdit.bind(this);
        this.userHandleCancel = this.userHandleCancel.bind(this);
        this.userHandleDelete = this.userHandleDelete.bind(this);
        this.userHandleUpdate = this.userHandleUpdate.bind(this);
        this.userConfirmDelete = this.userConfirmDelete.bind(this);
        this.handleUserName = this.handleUserName.bind(this);
        this.handleUserEmail  = this.handleUserEmail.bind(this);
        this.handleUserPerm = this.handleUserPerm.bind(this);
        this.handleUserSuper = this.handleUserSuper.bind(this);
        this.handleUserAction = this.handleUserAction.bind(this);
    }
    initialState() {
        return {
            editID: null,
            editAuthor: '',
            editDate: '',
            editValue: '',
            editSpent: false,
            editNotes: '',
            deleteID: null,
            userEditID: null,
            userDeleteID: null,
            userName: '',
            userEmail: '',
            userPerm: null,
            userSuper: false
            
        };
    }
    allItems(data) {
        const tabledata = [];
        Object.keys(data).map((key) => {
            data[key]['id'] = key;
            tabledata.push(data[key]);
        });
        return tabledata;
    }
    // POST HANDLE METHODS //
    handleEdit(id) {
        var state = {
            editID : id,
            editAuthor: this.props.items.ian[id].author,
            editDate: moment(this.props.items.ian[id].date),
            editValue: this.props.items.ian[id].value,
            editNotes: this.props.items.ian[id].notes,
        }
        if (this.props.items.ian[id].spent !== false) {
            state['editSpent'] = this.props.items.ian[id].spent;
        }
        this.setState(state);
    }
    handleCancel() {
        this.setState({            
            editID: null,
            editAuthor: '',
            editDate: '',
            editValue: '',
            editSpent: false,
            editNotes: '',
            deleteID: null,
        });
    }
    handleUpdate() {
        let post = {
            id: this.state.editID,
            author: this.state.editAuthor,
            date: moment(this.state.editDate).valueOf(),
            note: this.state.editNotes,
            value:this.state.editValue,
            spent: this.state.editSpent
        }
        this.props.updatePost(post);
        this.handleCancel();
    }
    handleDelete(id) {
        this.setState({
            deleteID: id
        })
    }
    confirmDelete() {
        let post = {
            id: this.state.deleteID
        }
        this.props.deletePost(post);
        this.handleCancel();
    }
    handleDate(date) {
        this.setState({
            editDate: date
        });
    }
    handleColAuthor(data) {
        if (this.state.editID === data.id) {
            console.log(this.state.editID);
            return(
                <select value={this.state.editAuthor} onChange={(e) => { this.setState({ editAuthor : e.target.value }) }}>
                    { 
                        Object.keys(this.props.users).map((key) => {
                            return <option value={this.props.users[key].name} key={key}>{this.props.users[key].name}</option>
                        }) 
                    }
                </select>
            );
        }
        else {
            return(
                <span>{data.author}</span>
            );
        }
    }
    handleColDate(data) {
        if (this.state.editID === data.id) {
            return(
                <DatePicker
                    selected={this.state.editDate}
                    onChange={this.handleDate}
                />
            );
        }
        else {
            return(
                <span>{ moment(data.date).format('MM/DD/YYYY') }</span>
            );
        }
    }
    handleColValue(data) {
        if (this.state.editID === data.id) {
            return(
                <input type="number" value={this.state.editValue} onChange={(e) => { this.setState({ editValue: e.target.value })}}/>
            );
        }
        else {
            return(
                <span>{data.value}</span>
            );
        }
    }
    handleColSpent(data) {
        if (this.state.editID === data.id) {
            return(
                <input type="checkbox" checked={this.state.editSpent} onChange={(e) => { this.setState({ editSpent: e.target.checked })}}/>
            );
        }
        else {
            return(
                <span>{data.spent ? <i className="fa fa-check"></i> : <i className="fa fa-times"></i>}</span>
            );
        }
    }
    handleColNotes(data) {
        if (this.state.editID === data.id) {
            return(
                <input type="text" value={this.state.editNotes} onChange={(e) => { this.setState({ editNotes: e.target.value })}}/>
            );
        }
        else {
            return(
                <span>{data.notes}</span>
            );
        }
    }
    handleColAction(id) {
        if (this.state.editID === id) {
            return(
                <div>
                    <button onClick={(e) => { this.handleUpdate() }}>Save</button>    
                    <button onClick={(e) => { this.handleCancel() }}>Cancel</button>
                </div>
            );
        }
        else if (this.state.deleteID === id) {
            return(
                <div>
                    <button onClick={(e) => { this.confirmDelete() }}>Confirm</button>    
                    <button onClick={(e) => { this.handleCancel() }}>Cancel</button>
                </div>
            );
        }
        else {
            return(
                <div>
                    <button onClick={(e) => { this.handleEdit(id) }}>Edit</button>
                    <button onClick={(e) => { this.handleDelete(id) }}>Delete</button>
                </div>
            );
        }
    }
    // USER HANDLE METHODS //
    userHandleEdit(id) {
        var state = {
            userEditID: id,
            userName: this.props.users[id].name,
            userEmail: this.props.users[id].email,
            userPerm: this.props.users[id].permission,
        }
        if (this.props.users[id].super !== undefined) {
            state['userSuper'] = this.props.users[id].super;
        }
        this.setState(state);
    }
    userHandleCancel() {
        this.setState({            
            userEditID: null,
            userDeleteID: null,
            userName: '',
            userEmail: '',
            userPerm: null,
            userSuper: false
        });
    }
    userHandleUpdate() {
        let user = {
            name: this.state.userName,
            email: this.state.userEmail,
            permission: this.state.userPerm,
            super: this.state.userSuper
        };
        this.props.updateUser(user, this.state.userEditID);
        this.userHandleCancel();
    }
    userHandleDelete(id) {
        this.setState({
            userDeleteID: id
        })
    }
    userConfirmDelete() {
        this.props.deleteUser(this.state.userDeleteID);
        this.userHandleCancel();
    }
    handleUserName(data) {
        if (this.state.userEditID === data.id) {
            return(
                <input type="text" value={this.state.userName} onChange={(e) => { this.setState({ userName: e.target.value })}}/>
            );
        }
        else {
            return(
                <span>{data.name}</span>
            );
        }
    }
    handleUserEmail(data) {
        if (this.state.userEditID === data.id) {
            return(
                <input type="text" value={this.state.userEmail} onChange={(e) => { this.setState({ userEmail: e.target.value })}}/>
            );
        }
        else {
            return(
                <span>{data.email}</span>
            );
        }
    }
    handleUserPerm(data) {
        if (this.state.userEditID === data.id) {
            return(
                <input type="checkbox" checked={parseInt(this.state.userPerm) === 1 ? true : false } onChange={(e) => { console.log(e.target.value); this.setState({ userPerm: e.target.checked  ? 1 : 0 })}}/>
            );
        }
        else {
            return(
                <span>{parseInt(data.permission) === 1 ? <i className="fa fa-check"></i> : <i className="fa fa-times"></i>}</span>
            );
        }
    }
    handleUserSuper(data) {
        if (this.state.userEditID === data.id) {
            return(
                <input type="checkbox" checked={this.state.userSuper ? true : false } onChange={(e) => { this.setState({ userSuper: e.target.checked ? true : false })}}/>
            );
        }
        else {
            return(
                <span>{data.super ? <i className="fa fa-check"></i> : <i className="fa fa-times"></i>}</span>
            );
        }
    }
    handleUserAction(id) {
        if (this.state.userEditID === id) {
            return(
                <div>
                    <button onClick={(e) => { this.userHandleUpdate() }}>Save</button>    
                    <button onClick={(e) => { this.userHandleCancel() }}>Cancel</button>
                </div>
            );
        }
        if (this.state.userDeleteID === id) {
            return(
                <div>
                    <button onClick={(e) => { this.userConfirmDelete() }}>Confirm</button>    
                    <button onClick={(e) => { this.userHandleCancel() }}>Cancel</button>
                </div>
            );
        }
        else {
            return(
                <div>
                    <button onClick={(e) => { this.userHandleEdit(id) }}>Edit</button>
                    <button onClick={(e) => { this.userHandleDelete(id) }}>Delete</button>
                </div>
            );
        }
    }
    render() {
        const pColumns = [
            {
                id: 'date',
                Header: 'Date',
                accessor: d => d,
                Cell: props => this.handleColDate(props.value),
                maxWidth: 100,
                defaultSortDesc: true
            }, 
            {
                id: 'author',
                Header: 'Author',
                accessor: d => d,
                maxWidth: 100,
                Cell: props => this.handleColAuthor(props.value)
            }, 
            {
                id: 'value',
                Header: 'Value', 
                accessor: d => d,
                maxWidth: 100,
                Cell: props => this.handleColValue(props.value)
            },
            {
                id: 'spent',
                Header:'Spent',
                accessor: d => d,
                maxWidth: 100,
                Cell: props => this.handleColSpent(props.value)
            },
            {
                id: 'notes',
                Header: 'Notes',
                accessor: d => d,
                maxWidth: 400,
                Cell: props => this.handleColNotes(props.value)
            },
            {
                Header: 'Actions',
                accessor: 'id',
                maxWidth: 100,
                Cell: props => this.handleColAction(props.value)
            }
        ];

        const uColumns = [
            {
                id: 'name',
                Header: 'Name',
                accessor: d => d,
                Cell: props => this.handleUserName(props.value)
            },
            {
                id: 'email',
                Header: 'Email',
                accessor: d => d,
                Cell: props => this.handleUserEmail(props.value)
            }, 
            {
                id: 'permission',
                Header: 'Write Permission',
                accessor: d => d,
                Cell: props => this.handleUserPerm(props.value),
            },
            {
                id: 'super',
                Header: 'Super',
                accessor: d => d,
                Cell: props => this.handleUserSuper(props.value),
            },
            {
                Header: 'Actions',
                accessor: 'id',
                maxWidth: 100,
                Cell: props => this.handleUserAction(props.value)
            }
        ];

        return(
            <div className="admin-panel">
                <a className="text-right" href="#" onClick={(e) => { this.props.handleToggleAdmin() } }>Back <i className="fa fa-chevron-right"></i></a>     
                <h3>All Posts</h3>                
                <ReactTable 
                data={this.allItems(this.props.items.ian)} 
                columns={pColumns}     
                defaultSorted={[
                    {
                    id: "date",
                    desc: true
                    }
                ]}
                defaultPageSize={20}
                className="-striped -highlight"
                style={{ height: '400px'}}
                />       
                <h3>All Users</h3>  
                 <ReactTable 
                data={this.allItems(this.props.users)} 
                columns={uColumns}           
                defaultPageSize={20}
                className="-striped -highlight"
                style={{ height: '400px'}}
                />                           
            </div>
        );
    }
}
