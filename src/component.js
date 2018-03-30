import React, {Component} from 'react';
import './style.css'
import { DatePicker } from 'antd';

import Icon from './icon.jpg';

export default class IndexPage extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return(
            <div className="demo">
                <DatePicker />
                <img src={Icon} width="100"/>
                <p>Hello,This is created By wallaceYuan,22222</p>
            </div>
        )
    }
}
