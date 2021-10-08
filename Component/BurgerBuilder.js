import React, { Component } from 'react'
import Auxiliary from './../../hoc/Auxiliary/Auxiliary'
import Burger from './../../components/Buger/Burger'
import BuildControls from './../../components/Buger/BuildControls/BuildControls'
import Modal from './../../components/UI/Modal/Modal'
import OrderSummary from './../../components/Buger/OrderSummary/OrderSummary'
import withErrorHandler from './../../hoc/WithErrorHandler/withErrorHandler'
import axios from '../../axiosorders';
import Spiner from '../../components/UI/Spiner/Spiner'

const INGREDIENT_PRICE = {
    salad: 0.5,
    bacon: 0.7,
    cheese: 0.3,
    meat: 1.3
}

class BurgerBuilder extends Component{

    constructor(props){
        super(props)
    }
    
    state = {
        ingredients: null,
        totlaPrice: 4,
        purchasable: false,
        purchasing: false,
        loader:false
    }

    componentDidMount() {
        axios.get("https://burgerbuilder-77120.firebaseio.com/ingredients.json")
            .then(response => {
                this.setState({ingredients: response.data})
            })
            .catch(error =>{})
    }

    updatePurchasableState = (ingredients) =>{

        const sum = Object.keys(ingredients)
            .map(igKey => {
                return ingredients[igKey]
            })
            .reduce((sum, el) => {
                return sum + el
            }, 0);

            this.setState({purchasable: sum > 0});
        
    }

    addIngredientHandler= (type) =>{
        
        //copy the old count in to new variable
        const oldCount = this.state.ingredients[type]

        //set updated count to nthe new variable
        const updatedCount = oldCount + 1

        //create the new object and copying the elemint of the old object in to the new object
        const updatedIngredient = {
            ...this.state.ingredients
        }

        // set the new count into the perticular enliment of the new object
        updatedIngredient[type] = updatedCount

        const additionPrice = INGREDIENT_PRICE[type]
        const oldPrice = this.state.totlaPrice
        const newPrice = oldPrice + additionPrice

        //replace the new object in to the old aobject
        this.setState({totlaPrice : newPrice, ingredients : updatedIngredient})
        this.updatePurchasableState(updatedIngredient)
    }

    removeIngredientHandler = (type) => {
        
        const oldCount = this.state.ingredients[type]

        if (oldCount <= 0) {
            return;
        }
        const updatedCount = oldCount - 1
        const updatedIngredient = {
            ...this.state.ingredients
        }
        updatedIngredient[type] = updatedCount

        const deductionPrice = INGREDIENT_PRICE[type]
        const oldPrice = this.state.totlaPrice
        const newPrice = oldPrice - deductionPrice

        this.setState({totlaPrice : newPrice, ingredients : updatedIngredient})
        this.updatePurchasableState(updatedIngredient)
    }

    purchesHandler = () =>{
        this.setState({purchasing: true})
    }

    purchesCancleHandler = () => {
        this.setState({purchasing: false})
    }

    purchesContinueHandler = () => {
        
        this.setState({loader: true})
        const order = {
            ingredients:this.state.ingredients,
            price:this.state.totlaPrice,
            coustomer:{
                name:"tharindu vishal",
                address:{
                    city:"Badulla",
                    country:"Sri Lanka"
                },
                email:"test@gmail.com"
            },
            deliverymethod:"cash on delivery"
        }

        axios.post('/orders.json', order)
            .then(response => {
                this.setState({loader:false, purchasing: false})
            })
            .catch(error => {
                this.setState({loader:false, purchasing: false})
            })
    }
    
    render(){
       const disableInfo = {
           ...this.state.ingredients
       }
       for (let key in disableInfo) {
          disableInfo[key] = disableInfo[key] <= 0
           
       }

       let orderSummary = null

       let burger = <Spiner />

       if (this.state.ingredients) {
           burger = (
           <Auxiliary>
               <Burger ingredients={this.state.ingredients} />
                <BuildControls
                    addIngredient={this.addIngredientHandler}
                    removeIngredient={this.removeIngredientHandler}
                    price={this.state.totlaPrice}
                    purchasable={this.state.purchasable}
                    ordered={this.purchesHandler}
                    disabled={disableInfo}
                />
           </Auxiliary>
           )

           orderSummary = <OrderSummary 
                price={this.state.totlaPrice}
                ingredients={this.state.ingredients}
                purchesCancled={this.purchesCancleHandler}
                purchesContinued={this.purchesContinueHandler}
            />

            if (this.state.loader) {
                orderSummary = <Spiner />
            }
       }
        return(
            <Auxiliary>
                <Modal show={this.state.purchasing} modalClose={this.purchesCancleHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Auxiliary>
        )
    }
}

export default withErrorHandler(BurgerBuilder ,axios);