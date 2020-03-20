import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TouchableNativeFeedback, Alert, ToastAndroid } from "react-native";
// import {  } from 'react-native-gesture-handler';
import THEME from "../../constants/THEME";
import { FontAwesome } from "@expo/vector-icons";
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../store/actions/cart';
import { favorite } from '../../store/actions/product';

const ProductListView = (props) => {
    const dispatch = useDispatch();
    const product = props.itemData.item;
    const userID=useSelector(state => state.auth.user.id);

    const toCart = () => {
        dispatch(addToCart(props.itemData.item));
    }
    const productDetail = () => {
        // console.log(product);
        if (product.deleted_at!=null) {
            Alert.alert("Product deleted", "This product has been deleted and not availabe to view or purchase", ["okay"]);
            if (props.screen=="fav") {
                toggleFavorite();
            }
            return;
        }
        props.navigation.navigate({ 
            routeName: "ProductDetails", 
            params: { pid: product.id,fav:product.isFav } 
        });
    }

    const toggleFavorite = () => {
        dispatch(favorite(product)).then(response => {
            console.log(response);
        });
    }

    const navigateToUser = () => {
        //console.log(product.user)  
        props.navigation.navigate({ routeName: "user", params: { user: product.user } });
    }
    // const toggleFavorite = useCallback(() => {
    //     dispatch(favorite(product)).then(response => {
    //         console.log(response);
    //     });
    // },[product]);
    
    console.log(props.showFav)
    return (
        <View style={props.style}>
            <View style={styles.container}>
                <TouchableNativeFeedback onPress={productDetail}>
                    <View style={styles.inner}>
                        <View style={styles.imageBg}>
                            <Image 
                                style={styles.image} source={{ uri: product.imageUrl }} />
                        </View>
                        <View style={styles.productContent}>
                            <View style={styles.titleAndFavBg}>
                                <Text style={styles.title}>{product.title} </Text>
                                <View style={styles.wishList}>
                                    {
                                        props.showFav==true ?  
                                    <TouchableOpacity onPress={toggleFavorite} style={styles.wishListBtn}>
                                        <FontAwesome size={20} name={product.isFav ? "heart" : "heart-o"} color={THEME.PRIMARY} />
                                    </TouchableOpacity> : null
                                    }
                                </View>
                            </View>
                            <View>
                                <TouchableOpacity onPress={navigateToUser} style={styles.userDetails}>
                                    <Image style={styles.userImage} source={{ uri: product.user.imageUrl }} />
                                    <Text style={styles.userName}> {product.user.name}</Text>
                                </TouchableOpacity>
                                <View style={styles.priceBg}>
                                    <Text style={styles.price}>${parseFloat( product.price)}</Text>
                                    {userID!=product.user.id ? 
                                    <TouchableOpacity style={styles.cart}>
                                        <FontAwesome size={24} onPress={toCart} name="cart-plus" color={THEME.PRIMARY} />
                                    </TouchableOpacity>
                                    : null
                                    }
                                </View>
                            </View>
                        </View>
                    </View>
                </TouchableNativeFeedback>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        
    },
    container: {
        height: 150,
        backgroundColor: "#fff",
        borderRadius: 5,
        elevation: 5,
        overflow: "hidden",

    },
    inner: {
        height: 150,
        flexDirection: "row",

    },
    imageBg: {
        flex: 1.5,
        margin: 5,

    },
    image: {
        height: "100%",
        borderRadius: 5,
        borderColor:THEME.BORDER,
        borderWidth:0.5
    },
    productContent: {
        flex: 3,
        justifyContent: "space-around"
    },
    titleAndFavBg: {
        flexDirection: "row",
        justifyContent: "space-between",
        // backgroundColor:"red",
        alignItems: "center",
        marginLeft: 10,

        height: 30
    },
    title: {
        fontFamily: "open-sans",
        fontSize: 18,
        flex: 1
    },
    wishList: {
        paddingHorizontal: 15,
        // backgroundColor:"red",
        // height:50,
    },
    wishListBtn: {
    },
    userDetails: {
        marginLeft: 10,
        // marginTop:10,
        flexDirection: "row",
        alignItems: "center",
        height: 30,
        // backgroundColor: "blue"
    },
    userImage: {
        height: 25,
        width: 25,
        borderRadius: 50
    },
    userName: {
        fontSize: 16,
        marginLeft: 5,
        color: THEME.SECONDARY_TEXT,
        fontFamily: "roboto-regular",
    },
    priceBg: {
        marginLeft: 10,
        marginTop: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        height: 30,
        // backgroundColor:"green"
    },
    price: {
        color: THEME.SECONDARY_TEXT,
        fontSize: 20,
        fontFamily: "roboto-regular",
        fontWeight: "bold",
        flex: 1
    },
    cart: {
        paddingHorizontal: 15
    }
});
export default ProductListView;
