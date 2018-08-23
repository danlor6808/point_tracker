import React from 'react';
import moment from 'moment';
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Text} from 'recharts';

const Chart = (props) => {
    let toArray = (items) => {
        let week = {
            Sunday : {
                earned: 0,
                lost: 0,
                spent: 0,
                date: moment().isoWeekday(0).format("MM/DD/YYYY")
            },
            Monday : {
                earned: 0,
                lost: 0,
                spent: 0,
                date: moment().isoWeekday(1).format("MM/DD/YYYY")
                
            },
            Tuesday : {
                earned: 0,
                lost: 0,
                spent: 0,
                date: moment().isoWeekday(2).format("MM/DD/YYYY")
            },
            Wednesday : {
                earned: 0,
                lost: 0,
                spent: 0,
                date: moment().isoWeekday(3).format("MM/DD/YYYY")
            },
            Thursday : {
                earned: 0,
                lost: 0,
                spent: 0,
                date: moment().isoWeekday(4).format("MM/DD/YYYY")
            },
            Friday : {
                earned: 0,
                lost: 0,
                spent: 0,
                date: moment().isoWeekday(5).format("MM/DD/YYYY")
            },
            Saturday : {
                earned: 0,
                lost: 0,
                spent: 0,
                date: moment().isoWeekday(6).format("MM/DD/YYYY")
            }
        }
        let data = [];
        Object.keys(items).map((key) => {
            if (moment(items[key].date).startOf('week').isoWeek() === moment().startOf('week').isoWeek()) {
                var day = moment(items[key].date).format('dddd').toString();
                var value = parseInt(items[key].value);
                if (value >= 0) {
                    week[day].earned += value;
                } else {
                    if (items[key].spent !== false) {
                        if (items[key].spent) {
                            week[day].spent += Math.abs(value);
                        }
                    }
                    else {
                        week[day].lost += Math.abs(value);
                    }
                }

            }
        });
        Object.keys(week).map((key) => {
            data.push({
                day: key,
                date: week[key].date,
                earned: week[key].earned,
                lost: week[key].lost,
                spent: week[key].spent
            });
        });
        return data;
    }
    const CustomTooltip = (props) => {
        const { active } = props;
        if (active) {
            const { payload, label } = props;
            return (
                <div className="custom-tooltip">
                 <span className="day">{`${payload[0].payload.day}`}</span>
                 <span className="date">{`(${payload[0].payload.date})`}</span>
                 <span className="text">Points</span>
                 <span className="earned"><i className="fa fa-arrow-up"></i> {`${payload[0].value}`}</span>
                 <span className="lost"><i className="fa fa-arrow-down"></i> {`${payload[1].value}`}</span>
                 <span className="spent"><i className="fa fa-arrow-down"></i> {`${payload[2].value}`}</span>
                </div>
            );
        }
        return null;
    }
    const CustomLabel = (props) => {
        const {x, y, stroke, value} = props;
        console.log(value);
        return (
            <text x={x} y={y} dy={0} fill="black" fontSize={25} textAnchor="middle">{value}</text>
        );
    }
    return(
        <ResponsiveContainer height={350} width="100%">
            <BarChart data={toArray(props.items.ian)} margin={{left: 0}}>
                <XAxis dataKey="day"/>
                <YAxis/>
                <Tooltip content={<CustomTooltip/>} />
                <CartesianGrid/>
                <Legend />
                <Bar dataKey="earned" fill="#03436A" stackId="a" name="Points earned"/>
                <Bar dataKey="lost" fill="#FF0D00" stackId="a" name="Points lost"/>
                <Bar dataKey="spent" fill="#3D9AD1" stackId="b" name="Points spent"/>
            </BarChart>
        </ResponsiveContainer>
    )
}

export default Chart;