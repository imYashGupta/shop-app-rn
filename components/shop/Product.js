import React from 'react';
import { View, Text, ImageBackground, StyleSheet, TouchableOpacity, Alert } from "react-native";
import THEME from "../../constants/THEME";
import {  FontAwesome } from "@expo/vector-icons";
import { useDispatch } from 'react-redux';
import { addToCart } from '../../store/actions/cart';
import { deleteProduct } from '../../store/actions/product';

const Product  = props => {

    const dispatch = useDispatch();
    const toCart = () => {
        dispatch(addToCart(props.itemData.item));
    }
    const editProduct = () => {
        props.navigation.navigate({ routeName: "CreateProduct", params: { pid: props.itemData.item.id}})
    } 

    const softDelete = () => {
        Alert.alert("Delete product?","Are you sure want to delete this product, you will not be able to recover it!",
        [
            {
                text:"Delete",
                color:"red",
                onPress: () => dispatch(deleteProduct(props.itemData.item.id))
            },
            {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
        ]
        );
    }
    // console.log(props.itemData.item.imageUrl);
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => props.navigation.navigate({routeName:"ProductDetails",params:{pid:props.itemData.item.id}})} activeOpacity={0.7}>
                <ImageBackground style={styles.image} source={{ uri: props.itemData.item.imageUrl }}>
                    <View style={styles.wishList}>
                        {/* <TouchableOpacity style={styles.wishListBtn}>
                            <FontAwesome size={20} name="heart-o" color={THEME.PRIMARY} />
                        </TouchableOpacity> */}
                    </View>
                </ImageBackground>
            </TouchableOpacity>
            <View style={styles.detailContainer}>
                <View style={styles.bottomContainer}>
                    <View>
                        <TouchableOpacity activeOpacity={0.3}>
                            <Text style={styles.title}>{props.itemData.item.title}</Text>
                        </TouchableOpacity>
                        <Text style={styles.price}>$ {parseFloat(props.itemData.item.price).toFixed(2)}</Text>
                    </View>
                    {
                        props.user !== true ?
                            <TouchableOpacity activeOpacity={0.3} onPress={toCart}>
                                <Text style={styles.addToCart}>Add to Cart <FontAwesome size={18} name="cart-plus" />  </Text>
                    </TouchableOpacity> 
                    : 
                    <View style={{ flexDirection: "row",alignItems:"center"}}>

                        <TouchableOpacity activeOpacity={0.3} onPress={editProduct} >
                                    <Text style={styles.addToCart}>Edit <FontAwesome size={18} name="edit" />  </Text>
                        </TouchableOpacity>
                                <TouchableOpacity onPress={softDelete}>
                            <Text style={[styles.addToCart,{color:"red"}]}>Delete <FontAwesome size={18} name="trash-o" />  </Text>
                        </TouchableOpacity>
                    </View>
                    }
                </View>

            </View>
        </View>
    );
}

const styles=StyleSheet.create({
    container:{
        height:300,
        backgroundColor:"#FFF",
        margin:15,
        elevation:7,
        borderRadius:10,
        overflow:"hidden"
    },
    image:{
        height:242,
        width:'100%',
       
    },
    detailContainer:{
        borderTopColor: "#CCC",
        borderTopWidth:0.5,
        padding:10,
    },  
    title:{
        fontSize:18,
        color:THEME.PRIMARY_TEXT
    },
    price:{
        color:THEME.ACCENT
    },
    bottomContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        // backgroundColor:"red"
    },
    viewDetail:{
        fontSize:18,
        color:THEME.DARK_PRIMARY,
        fontWeight:"bold",
    },
    addToCart:{
        marginRight:10,
        fontSize: 18,
        color: THEME.DARK_PRIMARY,
        fontWeight: "bold",
    },
    wishList:{
        flexDirection:"row-reverse",
    },
    wishListBtn: {
        width: 50, 
        height: 50,
        flexDirection: "row-reverse",
        padding: 15
    }
});
export default Product;