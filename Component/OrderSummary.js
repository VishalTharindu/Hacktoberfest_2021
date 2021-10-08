import React, {Component} from 'react'

import Auxiliary from './../../../hoc/Auxiliary/Auxiliary'
import Button from './../../UI/Button/Button'
class OrderSummary extends Component{

    componentDidUpdate() {
        console.log("test Summary");
    }
    render(){
        const ingredientSummary = Object.keys(this.props.ingredients)
        .map(igKey => {
        return (
            <li key={igKey}>
                <span style={{textTransform: 'capitalize'}}>{igKey}</span>: 
                {this.props.ingredients[igKey]}
            </li>)
        }) 

        return(
            <Auxiliary>
                <h3>Your Order</h3>
                <p>A delicious with the following ingredient</p>
                <ul>
                    {ingredientSummary}
                </ul>
                <p><strong>Total Price: {this.props.price.toFixed(2)}$</strong></p>
                <p>continue to checkout</p>
                <Button btnType="Danger" clicked={this.props.purchesCancled}>CANCLE</Button>
                <Button btnType="Success" clicked={this.props.purchesContinued}>CONTINUE</Button>
            </Auxiliary>
        )
    }   
}

export default OrderSummary