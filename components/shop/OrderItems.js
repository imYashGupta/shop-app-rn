import React from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity, Alert } from "react-native";
import THEME from '../../constants/THEME';
 import { TouchableNativeFeedback } from 'react-native-gesture-handler';

const OrderItem = props => {
    const order=props.item;
    const date = new Date(order.id).toLocaleDateString('en-En',{
        year:'numeric',
        month:"long",
        day:"numeric",
        hour:"2-digit",
        minute:'2-digit'
    });

    const navigateToProduct = (item) => {
        if (item.deleted_at==null){
            return props.navigation.navigate({ routeName: "ProductDetails", params: { pid: item.product_id } });
        }
        Alert.alert("Product deleted","This product has been deleted and not availabe to view or purchase",["okay"]);
    }   
     

    return (
        <View style={styles.orderBg}>
            <View style={styles.headerBox}>
                <Text style={styles.headerText}>Order ID: #{order.id}   </Text>
                <Text style={styles.headerText}>Total: ${order.amount}</Text>
            </View>
           
            {
                order.items.map(item => {
                    console.log(item);
                    return (
                        
                            <View style={styles.ordersContainer} key={item.id.toString()}>
                        <TouchableNativeFeedback   >
                                <View style={styles.orders}>

                                <Image style={styles.productImage} source={{ uri: item.imageUrl }} />
                                <View style={{ padding: 10 }}>
                                        <TouchableOpacity onPress={navigateToProduct.bind(this,item)}>
                                            <Text style={styles.productTitle}>{item.title} {item.id}</Text>
                                    </TouchableOpacity>
                                    <Text style={styles.productQty}>Qty: {item.qty}</Text>
                                </View>
                                <View style={styles.productPrice}>
                                    <Text style={styles.productPriceText}>
                                            ${(parseFloat(item.price) * item.qty).toFixed(2)}
                                    </Text>
                                </View>
                            </View>
                            
                        </TouchableNativeFeedback>
                            </View>
                    )
                })
            }
            <View style={{height:40,flex:1,justifyContent:"center",padding:10}}>
                <Text>{order.created_at} </Text>
            </View>
             
        </View>
    );
}
const styles= StyleSheet.create({
    orderBg:{
        backgroundColor:"white",
        marginHorizontal:10,
        marginVertical:10,
        minHeight:150,
        elevation:5,
        borderRadius:5,
        overflow:"hidden",
 
    },
    headerBox:{
        height:50,
        backgroundColor: THEME.LIGHT_PRIMARY + '50', //'#cccccc25'
        paddingHorizontal:10,
        flexDirection:"row",
        justifyContent:"space-between",
        alignContent:"center",
        alignItems:"center",
        borderColor:THEME.BORDER,
        borderWidth:0.5
    },
    headerText:{
        fontSize:16,
        color:THEME.PRIMARY_TEXT,
    },
    ordersContainer:{
        backgroundColor:"#fff",
       
        borderRadius:10,
        borderColor: THEME.BORDER,
        borderWidth: 0.5,
        marginVertical:5,
        overflow:"hidden",
        marginHorizontal:10
    },
    orders:{
        flexDirection:"row"
    },
    productImage:{
        height:100,
        width:100
    },
    productTitle:{
        fontSize:18,
    },
    productPrice:{
        alignItems: "flex-end",
        flex: 1,
        padding: 10
    },
    productPriceText:{
        color:THEME.PRIMARY_TEXT,
        fontSize:16
    }
});

export default OrderItem;