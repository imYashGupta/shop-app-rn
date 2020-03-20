import React, { useState } from 'react';
import { View,Text,StyleSheet,  FlatList } from "react-native";
import { HeaderTitle } from 'react-navigation-stack';
import THEME from '../../constants/THEME';
import { useSelector,useDispatch } from "react-redux";
import CartItem from '../../components/shop/CartItem';
import { addToOrder } from "../../store/actions/order";
import {  Button } from 'react-native-paper';


const CartScreen = props =>{
    const theme = {
        colors: {
            primary: THEME.PRIMARY,
            accent: THEME.ACCENT,
        },
    };
    const total = useSelector(state => state.cart.total);
    const cartItems = useSelector(state => state.cart.cart);
    const dispatch = useDispatch();

    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    //console.log(cartItems);
    const cart=[];
    for (const p in cartItems) {
        //console.log(cartItems[p]);   
        cart.push(cartItems[p]);
    }
    
    const placeOrder = () => {
        let orderID = Date.parse(new Date());
        setIsLoading(true);
        dispatch(addToOrder(cart, total, orderID )).then(response => {
            if (response.status === 200 && response.data.status==="OK"){
                setIsLoading(false);
                props.navigation.navigate({ routeName: 'OrderPlaced', params: { orderID: response.data.orderID}});
            }
        })
    }

    return (
        <View>
            <View style={styles.cartTotalBox}>
                <View style={styles.totalContainer}>
                    <Text style={styles.cartTotal}>Cart Total : </Text>
                    <Text style={styles.cartTotal} >${total.toFixed(2)}</Text>
                </View>
                {/* <Button onPress={placeOrder} title="Order Now"  color={THEME.ACCENT}/> */}
                <Button mode="outlined" loading={isLoading}  disabled={total > 0 ? false : true} onPress={placeOrder} theme={theme}>
                    ORDER NOW
                </Button>
            </View>
            <View style={styles.cartItemWrapper}>
                <Text style={styles.HeaderText}>Cart Items</Text>
            </View>
            {
                cart.length > 0 ? 
                <FlatList   data={cart} renderItem={(itemData) =>   <CartItem item={itemData} />} />
                :
                <View style={{flex:1,justifyContent:"center",margin:15}}>
                    <Text>Your cart is empty.</Text>
                </View>
            }    
        
        </View>
    )
}

CartScreen.navigationOptions = {
    headerTitle: "Cart   "
}

const styles = StyleSheet.create({
    cartTotalBox:{
        height:100,
        backgroundColor:"white",
        marginHorizontal:20,
        marginVertical:15,
        elevation:5,
        borderRadius:10,
        justifyContent:"center",
        padding:15
    },
    totalContainer:{
        width:"100%",
        flexDirection:"row",
        justifyContent:"space-between",
        marginBottom:10
    },  
    cartTotal:{
        fontSize:24
    },
    cartItemWrapper:{
        marginHorizontal:15,
        
    },
    HeaderText:{
        fontSize:24,
        marginBottom:5,
    },
    
});
export default CartScreen;