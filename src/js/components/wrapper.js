import React from 'react';
const Wrapper = (props) => {
    const classes = () => {
        var $class = 'container';
        if (props.active === 'mobile') {
            $class += ' open';
        }
        if (props.active === 'admin') {
            $class += ' admin';
        }
        return $class;
    }
    return(
        <div className={props.active !== "default" && props.active !== "admin" ? "wrapper open" : "wrapper"}>
            <div className={classes()}>
                {props.children}
            </div>
        </div>   
    );
}

export default Wrapper;