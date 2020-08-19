import React, { Component } from 'react';

import Order from '../../components/Order/Order';
import axios from '../../axios-orders';
import WithErrorHandler from '../../hoc/WithErrorHandler/WithErrorHandler';

class Orders extends Component {
    state = {
        orders: [],
        loading: true,
    };

    componentDidMount() {
        axios
            .get('/orders.json')
            .then((res) => {
                console.log(res.data);
                const fetchedOrders = [];
                for (const key in res.data) {
                    fetchedOrders.push({ id: key, ...res.data[key] });
                }
                this.setState({ loading: false, orders: fetchedOrders });
            })
            .catch((err) => {
                this.setState({ loading: false });
            });
    }

    render() {
        return (
            <div>
                <Order />
                <Order />
                <Order />
            </div>
        );
    }
}

export default WithErrorHandler(Orders, axios);
