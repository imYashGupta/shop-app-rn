import React, { useEffect, useCallback, useState } from 'react';
import { View, Text, Platform, FlatList, ActivityIndicator, TouchableOpacity } from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from "../../components/UI/HeaderButton";
import { useSelector, useDispatch } from 'react-redux';
import OrderItem from '../../components/shop/OrderItems';
import { getOrders } from '../../store/actions/order';
import THEME from '../../constants/THEME';

const OrderScreen = props => {
    console.log("OrderScreen")

    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
   
    const orders=useSelector(state => state.order.orders);
    const dispatch = useDispatch();
    const loadOrder = useCallback(() => {
        setIsLoading(true);
        dispatch(getOrders(1)).then(response => {
            setIsLoading(false);
            setIsError(false);
        }).catch(error => {
            setIsLoading(false);
            setIsError(true);
        })    
    }, [dispatch, setIsLoading, setIsError])

    useEffect(() => {
        loadOrder();
    }, [dispatch, loadOrder]);

    useEffect(() => {
       const willFocusSub= props.navigation.addListener('willFocus',() => {
            loadOrder();
        })

        return () => {
            willFocusSub.remove();
        }
    }, [loadOrder,])

    if(isLoading){
        return (
            <View style={{flex:1,alignItems:"center",alignContent:"center",justifyContent:"center"}}>
                <ActivityIndicator size="large"  />
            </View>
        );
    }

    if(isError){
        return (
            <View style={{ justifyContent: "center", alignContent: "center", flex: 1, alignItems: "center" }}>
                <Text>Failed to load Orders, Please Try again later!</Text>
                <TouchableOpacity onPress={loadOrder}>
                    <Text style={{ color: THEME.ACCENT }}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        orders.length > 0 ?  
        <View style={{flex:1}}>
             <FlatList keyExtractor={order => order.id.toString()} style={{paddingTop:10}} data={orders} renderItem={(itemData) => <OrderItem item={itemData.item} navigation={props.navigation} />} />
        </View>
        : <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
                <Text style={{ fontSize: 16 }}>No order has been placed yet.</Text>
        </View>
    );
}

OrderScreen.navigationOptions= (navData) => {
    return {
        headerTitle: "Orders      ",
        headerLeft:() => (<HeaderButtons HeaderButtonComponent={HeaderButton}>
            <Item title="Cart" iconName={Platform.OS === "android" ? "md-menu" : "ios-menu"} onPress={() => { navData.navigation.toggleDrawer(); }} />
        </HeaderButtons>),
        headerRight:() => <HeaderButtons HeaderButtonComponent={HeaderButton}>
            <Item title="Cart" iconName={Platform.OS === "android" ? "md-cart" : "ios-cart"} onPress={() => { navData.navigation.navigate("Cart") }} />
        </HeaderButtons>
    }
}

export default OrderScreen;