import React, {Component} from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';

import 'react-datepicker/dist/react-datepicker.css';

let count = 0;
const initialState = {
    showFull: false,
    editID: null,
    editNote: '',
    editVal: '',
    editDate: '',
    deleteID: null,
    operator: 'add',
    hasItems: false,
}

class RecentNotes extends Component {
    constructor(props) {
        super(props);

        this.state = initialState;
        this.cancelEdit = this.cancelEdit.bind(this);
        this.editItem = this.editItem.bind(this);
        this.saveItem = this.saveItem.bind(this);
        this.renderItems = this.renderItems.bind(this);
        this.handleDate = this.handleDate.bind(this);
    }

    componentDidUpdate() {
        if (count > 0) {
            if (!this.state.hasItems) {
                this.setState({hasItems: true}); 
            }
        }
    }
    cancelEdit() {
        this.setState(initialState);
    }
    editItem(key) {
        var item = {
            editID: key,
            editNote: this.props.items.ian[key].notes,
            editVal: this.props.items.ian[key].value < 0 ? Math.abs(this.props.items.ian[key].value) : this.props.items.ian[key].value,
            editDate: moment(this.props.items.ian[key].date),
            deleteID: null,
            operator: this.props.items.ian[key].value > 0 ? 'add' : 'sub'
        };
        if (this.props.items.ian[key].spent !== false) {
            item.operator = 'spend';
        }
        this.setState(item);
    }
    deleteItem(key) {
        this.setState({
            editID: null,
            editNote: '',
            editVal: '',
            editDate: '',
            deleteID: key,
            operator: 'add'
        });
    }
    saveItem() {
        var post = {
            id : this.state.editID,
            date : moment(this.state.editDate).valueOf(),
            note : this.state.editNote,
            value : this.state.operator === 'add' ? Math.round(parseInt(this.state.editVal)) : -1*(Math.round(parseInt(this.state.editVal))),
            spent : this.state.operator === 'spend' ? true : false
        }
        this.props.updatePost(post);
        this.cancelEdit();
    }
    confirmDelete() {
        var post = {
            id : this.state.deleteID
        }
        this.props.deletePost(post);
        this.cancelEdit();
    }
    showControl(key, author) {
        if (this.props.user !== null && this.props.user.name === author) {
            return (
                <div className="btn-group">
                    <button className="btn-edit" onClick={(e) => { this.editItem(key); }}><i className="fa fa-pencil"></i></button>
                    <button className="btn-delete" onClick={(e) => { this.deleteItem(key); }}><i className="fa fa-trash"></i></button>
                </div>
            );
        }
    }
    handleDate(date) {
        this.setState({
            editDate: date
        });
    }
    handleKeyPress(e) {
        if (e.key === "Enter") {
            this.handleSubmit();
        }
    }
    renderItems() {
        count = 0;
        return(
            <ul className={ this.state.showFull ? 'latest-posts show' : 'latest-posts' }>
            {Object.keys(this.props.items.ian).reverse().map((key) => {
                if (moment(this.props.items.ian[key].date).startOf('week').isoWeek() === moment().startOf('week').isoWeek()) {
                    count += 1;
                    var status = count >= 4 ? 'hide' : '';
                    if (this.state.editID === key) {
                        return(
                            <li key={key} className={status + ' edit'}>
                                <div className="input-group">
                                    <div className="input-row">
                                        <div className="half">
                                        <input 
                                            className={this.state.editVal !== '' ? 'valid' : null}
                                            type="number" 
                                            name="editVal" 
                                            value={parseInt(this.state.editVal)}
                                            onKeyPress={(e) => { this.handleKeyPress(e)}} 
                                            onChange={(e) => {this.setState({ editVal : e.target.value < 0 ? Math.abs(e.target.value) : e.target.value })}}/>
                                        <label htmlFor="editVal">Point Value</label>
                                        </div>
                                        <div className="half">
                                            <select value={this.state.operator} onChange={(e) => { this.setState({ operator: e.target.value })}}>
                                                <option value="add">Add (+)</option>
                                                <option value="sub">Subtract (-)</option>
                                                <option value="spend">Spend (-)</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="input-row">
                                        <DatePicker
                                            inline
                                            selected={this.state.editDate}
                                            onChange={this.handleDate}
                                        />
                                    </div>
                                    <div className="input-row">
                                        <textarea className={this.state.editNote !== '' ? 'valid' : null} name="editNote" value={this.state.editNote} onChange={ (e) => { this.setState({ editNote: e.target.value })}}/>
                                        <label htmlFor="editNote">Notes</label>
                                    </div>
                                </div>
                                <hr/>
                                <button className="btn-edit" onClick={(e) => { this.saveItem() }}><i className="fa fa-check"></i> Confirm</button>
                                <button className="btn-edit" onClick={(e) => { this.cancelEdit() }}><i className="fa fa-times"></i> Cancel</button>
                            </li>
                        );
                    }
                    else if (this.state.deleteID === key) {
                        return(
                            <li key={key} className={status + ' edit'}>
                                <strong>Are you sure you want to delete this item?</strong>
                                <hr/>
                                <button className="btn-edit" onClick={(e) => { this.confirmDelete() }}><i className="fa fa-check"></i> Confirm</button>
                                <button className="btn-edit" onClick={(e) => { this.cancelEdit() }}><i className="fa fa-times"></i> Cancel</button>
                            </li>
                        );
                    }
                    else {
                        return(
                            <li key={key} className={status}>
                                <span className="note">{this.props.items.ian[key].notes} 
                                    { this.showControl(key, this.props.items.ian[key].author) }
                                </span>
                                {this.props.items.ian[key].spent !== false ? 
                                    <span className="value blue">{Math.abs(this.props.items.ian[key].value)}</span>
                                :
                                    <span className={this.props.items.ian[key].value >= 0 ? 'value green' : 'value red'}>{this.props.items.ian[key].value < 0 ? Math.abs(this.props.items.ian[key].value) : this.props.items.ian[key].value}</span> 
                                }
                                <hr/>
                                <span className="author">{this.props.items.ian[key].author}</span> 
                                <span className="date">{ moment(this.props.items.ian[key].date).fromNow() }</span>
                            </li>
                        );
                    }
                }
            })}
            { (count > 3) ? <a className="btn" href="#" onClick={(e) => { e.preventDefault(); this.setState({ showFull: !this.state.showFull }) } }>{this.state.showFull ? 'Show Less' : 'Show More'}</a> : null }
            </ul>
        );
    }
    render() {
        return(
            <div className="recent">
                {this.state.hasItems ?  <h2>Latest Activity (For the past week)</h2> : <h2>No Recent Posts</h2> }         
                {Object.keys(this.props.items.ian).length > 0 ? this.renderItems() : null }
            </div>
        )
    }
}

export default RecentNotes;