import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';

import 'react-datepicker/dist/react-datepicker.css';

export default class Control extends Component {
    constructor(props) {
        super(props);

        this.state = this.initialState();

        this.initialState = this.initialState.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDate = this.handleDate.bind(this);
    }
    initialState() {
        return {
            items: this.props.items,
            valueError: false,
            noteError: false,
            value: '',
            note: '',
            operator: 'add',
            show: this.props.active,
            date: moment()
        };
    }
    componentWillReceiveProps(nextProps) {
        this.setState({ show: nextProps.active });  
    }
    handleDate(date) {
        this.setState({
            date
        });
    }
    handleSubmit() {
        var value = this.state.value;
        var note = this.state.note;
        var state = {};
        if(typeof(parseInt(value)) !== 'number' || value === '') {
            state['valueError'] = true;
        } else {
            state['valueError'] = false;
        }

        if(note === '') {
            state['noteError'] = true;
        } else {
            state['noteError'] = false;
        }
        if ( !state.noteError && !state.valueError ) {
            var post = {
                author: this.props.user.name,
                date: moment(this.state.date).valueOf(),
                note: this.state.note,
                value: this.state.operator === 'add' ? Math.round(parseInt(this.state.value)) : -1*(Math.round(parseInt(this.state.value))),
                spent: this.state.operator === 'spend' ? true : false
            };
            this.props.addPost(post);
            this.setState(this.initialState());
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
        <div className={this.state.show ? 'point-dialog show' : 'point-dialog'}>
            <div className="input-container">
                <div className="signup">
                    <h2>Post Points</h2>
                    <div className="input-group">
                        <div className="input-row">
                            <div className="half">
                            <input 
                                className={this.state.value !== '' ? 'valid' : null}
                                type="number" 
                                name="value" 
                                value={this.state.value} 
                                id="value"
                                onKeyPress={(e) => { this.handleKeyPress(e)}}
                                onChange={(e) => { this.setState({ value : e.target.value < 0 ? Math.abs(e.target.value) : e.target.value, valueError : false })} } />
                            <label htmlFor="value">Point Value</label>
                            { this.state.valueError ? <span className="error">Please enter a valid number</span> : null }
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
                                selected={this.state.date}
                                onChange={this.handleDate}
                            />
                        </div>
                        <div className="input-row">
                            <textarea 
                                className={this.state.note !== '' ? 'valid' : null}
                                name="note" 
                                value={this.state.note} 
                                id="note"
                                onChange={(e) => { this.setState({ note : e.target.value, noteError : false })} }>
                            </textarea>
                            <label htmlFor="note">Notes</label>
                            { this.state.noteError ? <span className="error">Please leave a description</span> : null }
                        </div>
                        <div className="input-row">
                            <button className="btn" onClick={(e) => { this.props.handleAddAction(false) } }>Cancel</button>
                            <button className="btn" onClick={(e) => { this.handleSubmit(); }}>Submit</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        )
    }
}