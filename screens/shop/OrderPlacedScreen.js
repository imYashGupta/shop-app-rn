import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity} from "react-native";
import THEME from '../../constants/THEME';
import { Ionicons } from "@expo/vector-icons";

const height = Dimensions.get('screen').height;
const OrderPlaced= props => {
     
    return (
        <View style={styles.screen}>
            <Text style={styles.headerText}>Your order placed successfully.</Text>
            <Text style={{ fontSize: 18 }}>ORDER ID: #{props.navigation.getParam("orderID")}</Text>
            <Image style={styles.checkImg}
            source={require('../../assets/correct.png')} 
            />
            <Text style={{ fontSize: 24 }}>Thank You!</Text>
            <TouchableOpacity onPress={() => props.navigation.navigate("Products")}>
                <Text style={{ fontSize: 18, color: THEME.PRIMARY }}>Home </Text>
            </TouchableOpacity>
        </View>
    )
}

const styles=StyleSheet.create({
    screen:{
     
        justifyContent:"center",
        alignItems:"center",
        alignContent:"center",
        height: height,
    
    },
    checkImg:{
        width:300,
        height:300,
        marginBottom:20,
        marginTop:20
    },
    headerText:{
        fontSize:24,
        marginBottom:10        
    },
});

OrderPlaced.navigationOptions= navData =>{
    return {
        headerShown: false,
        
    }
}
export default OrderPlaced;