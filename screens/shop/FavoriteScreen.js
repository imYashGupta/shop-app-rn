import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, FlatList, Text } from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from "../../components/UI/HeaderButton";
import ProductListView from '../../components/shop/ProductListView';
import { useDispatch, useSelector } from 'react-redux';
import { getFavorites } from '../../store/actions/product';
const Favorites = (props) => {

    const dispatch = useDispatch();
    const [loading,setLoading] = useState(true);
    const favProducts = useSelector(state => state.products.favorites);
    useEffect(() => {
        dispatch(getFavorites()).then(response => {
            setLoading(false);
        }).catch(error => {
            setLoading(false);
        });
    },[])
   
    if (loading) {
        return (
            <View style={styles.loaderScreen}>
                <ActivityIndicator size="large" /> 
            </View>
        );
    }

    if (favProducts.length == 0) {
        return <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
            <Text>No item in your WishLists.</Text>
        </View> 
    }
    
    return (
        <View>
            <FlatList
                style={styles.screen}
                data={favProducts}
                renderItem={itemData =>
                    (<ProductListView
                        style={{ marginBottom: 15 }}
                        navigation={props.navigation}
                        itemData={itemData}
                        user={false}
                        screen="fav"
                        showFav={true}

                    />)}
                keyExtractor={(item) => {
                    return item.id.toString()
                }}

            />
        </View>
    );
}

const styles = StyleSheet.create({
    screen:{
        padding:20
    },
    loaderScreen:{
        flex:1,
        justifyContent:"center"
    }
     
});
Favorites.navigationOptions = (navData) => {
    return {
        headerTitle: "Wishlists      ",
        headerLeft: () => (<HeaderButtons HeaderButtonComponent={HeaderButton}>
            <Item title="Cart" iconName={Platform.OS === "android" ? "md-menu" : "ios-menu"} onPress={() => { navData.navigation.toggleDrawer(); }} />
        </HeaderButtons>),
        headerRight: () => <HeaderButtons HeaderButtonComponent={HeaderButton}>
            <Item title="Cart" iconName={Platform.OS === "android" ? "md-cart" : "ios-cart"} onPress={() => { navData.navigation.navigate("Cart") }} />
        </HeaderButtons>
    }
}
export default Favorites;
