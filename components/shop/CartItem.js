import React from 'react';
import { Text,View,StyleSheet, Image, Alert } from "react-native";
import { TouchableNativeFeedback, TouchableOpacity } from 'react-native-gesture-handler';
import { useDispatch } from "react-redux";
import { removeToCart } from "../../store/actions/cart";
import { FontAwesome } from "@expo/vector-icons";
import THEME from "../../constants/THEME";

const CartItem = props =>{
    const product=props.item.item;
     
    const dispatch = useDispatch();

    const confirmation=() =>{
        // Works on both Android and iOS
        Alert.alert(
            'Remove Item!',
            'Are you sure want to remove that item from cart?',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                { text: 'OK', onPress: () => dispatch(removeToCart(product)) },
            ],
            { cancelable: true },
        );
    }

    

    return (
            

        <View style={styles.cartItemCard}>
            <TouchableNativeFeedback style={styles.container}>
                 
                <View>
                    <Image source={{ uri: product.imageUrl }} style={styles.img} />
                </View>
                <View style={styles.detailContainer}>
                    <View style={styles.details}>
                        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">{product.title}sadasdsd</Text>
                        <View style={{ marginTop: 10 }}>
                            <Text style={{ fontSize: 16 }}>Qty : {product.qty}</Text>
                            <Text style={{ fontSize: 16 }}>Price : ${parseFloat(product.price).toFixed(2)}</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.actions} onPress={confirmation}>
                        <Text style={styles.removeText}>
                            <FontAwesome size={20} name="trash-o" color={THEME.DANGER} />
                        </Text>
                    </TouchableOpacity>
               </View>
            </TouchableNativeFeedback>
            </View>
            
        
    );
}
const styles = StyleSheet.create({
    cartItemCard: {
        height: 100,
        backgroundColor: "white",
        elevation: 5,
        borderRadius: 10,
        marginVertical: 5,
        overflow:"hidden",
        marginHorizontal:15
         
    },
    container:{
        flexDirection:"row"
    },
    img: {
        height: 100,
        width: 100,
        marginRight:10
    },
    details:{
        marginVertical:10,
        flex:1
    },  
    title:{
        fontSize:20,
    },
    detailContainer:{
        flexDirection: "row",
        justifyContent: "space-between",
        flex: 1
    },
    actions:{
        margin:10,
       
    },
    removeText:{
        color:"red",
        textAlign: "right",
        fontSize:16
    }
});

export default CartItem;