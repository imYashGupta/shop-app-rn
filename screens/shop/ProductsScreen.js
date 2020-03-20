import React, { useEffect, useState, useCallback } from 'react';
import { FlatList, Platform, View, ActivityIndicator, Text, TouchableOpacity, ToastAndroid,StyleSheet} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import Product from "../../components/shop/Product";
import {HeaderButtons,Item } from "react-navigation-header-buttons";
import HeaderButton from "../../components/UI/HeaderButton";
import { getProducts } from "../../store/actions/product";
import THEME from '../../constants/THEME';
import ProductListView from '../../components/shop/ProductListView';
import { BASE_URL } from '../../constants/API';

const productScreen= props => {
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadmoreLoading, setLoadmoreLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    const products = useSelector(state => state.products.products);
    const user = useSelector(state => state.auth.user);
    const dispatch = useDispatch();
    const [URL,setURL] = useState(BASE_URL+"api/products");
    const LoadProduct = useCallback(() => {
        setIsLoading(true)
        console.log("before",URL);
        dispatch(getProducts(URL)).then((res) => {
            
            setIsError(false);
            setIsLoading(false)
            setURL(res.data.products.next_page_url);
            console.log("after",URL);
        }).catch(error => {
            console.log(error);
            setIsLoading(false)
            setIsError(true);
            ToastAndroid.show('Something went wrong, Please try again later!', ToastAndroid.SHORT);
        });
    }, [dispatch, setURL, LoadProduct, setIsError, setIsLoading  ]);
    useEffect(() => {
        //setIsLoading(true)
        LoadProduct();    
    }, [dispatch, setURL,LoadProduct, setIsError, setIsLoading]);

    const loadmore = () => {
        console.log("LOADMORE ",URL);
        if (URL==null) {
            ToastAndroid.show('No more product to load..', ToastAndroid.SHORT);
            return;
        }
        setLoadmoreLoading(true);
        dispatch(getProducts(URL,true)).then((res) => {
            setURL(res.data.products.next_page_url);
          //  console.log("after", URL);
            setLoadmoreLoading(false);
        }).catch(error => {
            console.log(error);
            setLoadmoreLoading(false);
            ToastAndroid.show('Something went wrong, Please try again later!', ToastAndroid.SHORT);
        });
    }
     

    if (isLoading) {
        return (
            <View style={{ justifyContent: "center", alignContent: "center" ,flex:1}}>
                <ActivityIndicator size="large" />
            </View>
        )
    }

    if (isError) {
        return (
            <View style={{ justifyContent: "center", alignContent: "center", flex: 1,alignItems:"center" }}>
                <Text>Something went Wrong, Please Try again later!</Text>
                <TouchableOpacity onPress={LoadProduct}>
                    <Text style={{color:THEME.ACCENT}}>Retry</Text>
                </TouchableOpacity>
            </View>
        )
    }

    if (products.length==0) {
        return (
            <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
                <Text>No products to be display.</Text>
            </View>
        )
    }

    return (
        <View style={{flex:1}}>
            <FlatList
                style={styles.screen}
                onRefresh={LoadProduct}
                refreshing={isLoading}
                data={products}
                renderItem={itemData =>
                    (<ProductListView
                        style={{marginBottom:15}}
                        navigation={props.navigation}
                        itemData={itemData}
                        user={false}
                        showFav={true}

                    />)}
                onEndReached={loadmore}
                onEndReachedThreshold={0.2}
                initialNumToRender={10}
                keyExtractor={(item) => {
                    return item.id.toString()
                }}
            />
            {
                isLoadmoreLoading ? 
                <ActivityIndicator size="small" color={THEME.ACCENT} />
                : null
            }

        </View>
        )
}

const styles = StyleSheet.create({
    screen:{
        padding:20,
    }
})

productScreen.navigationOptions =(navData) => {
    return{
        headerTitle:"Products   ",
        headerLeft: () => { return (<HeaderButtons HeaderButtonComponent={HeaderButton}>
            <Item title="Cart" iconName={Platform.OS === "android" ? "md-menu" : "ios-menu"} onPress={() => { navData.navigation.toggleDrawer(); }} />
        </HeaderButtons>)},
        headerRight: () => {
            return (<HeaderButtons HeaderButtonComponent={HeaderButton}>
            <Item title="Cart" iconName={Platform.OS === "android" ? "md-cart" : "ios-cart"} onPress={() => { navData.navigation.navigate("Cart")}}  />
                
        </HeaderButtons>)}, 
     
       

         
    }
}

export default productScreen;