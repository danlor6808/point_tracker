import React from 'react';

const Display = (props) => {
    let count = 0;
    if (props.items.ian) {
        return(
            <div className="display">
                <h2>Total Points:</h2>
                { 
                    Object.keys(props.items.ian).map((key) => {
                        count += parseInt(props.items.ian[key].value);
                    }) 
                }
                <div className="info">
                    <span className="count">{count}pts</span>
                </div>
            </div>
        );   
    }
    else {
        return <div>No Data!</div>
    }
}

export default Display;