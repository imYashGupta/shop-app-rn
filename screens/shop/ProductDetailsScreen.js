import React, { useEffect, useCallback, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, FlatList, ImageBackground, ActivityIndicator } from "react-native";
import { useSelector,useDispatch } from 'react-redux';
import THEME from '../../constants/THEME';
import { FontAwesome } from "@expo/vector-icons";
import {addToCart} from "../../store/actions/cart";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from "../../components/UI/HeaderButton";
import { favorite } from '../../store/actions/product';
import API from '../../constants/API';
import { authHeader } from '../../constants/authHeader';
import { Avatar, Button, Card, Title, Paragraph } from 'react-native-paper';

const ProductDetails = props => {
    console.log("DETAIL RENDER")
    const productID = props.navigation.getParam("pid");
    const fav = props.navigation.getParam("fav");
    const [isFav, setFav] = useState(fav);
    const [product, setProduct] = useState(null);
    const [relatedProducts,setRelatedProduct] = useState([]);
    const products = useSelector(state => state.products.products);
    const user= useSelector(state => state.auth.user);

    const dispatch = useDispatch();

    useEffect(() => {
        API.get("product/"+productID,authHeader(window.auth.token)).then(response => {
            console.log(response);
            setProduct(response.data.product);
            setRelatedProduct(response.data.related);
        }).catch(error => {
            console.log(error);
        })
    
    }, [productID]);

    useEffect(() =>{
        props.navigation.setParams({ fav: isFav});
    },[isFav]);
    const toggleFavHandler = useCallback(() => {
        dispatch(favorite(product)).then(response => {
            setFav(fav => !fav);
        });
    },[isFav,product]);  
    
    useEffect(() => {
        props.navigation.setParams({ toggleFav: toggleFavHandler });
    }, [toggleFavHandler]);

    const toCart = () => {
        dispatch(addToCart(product));
    }

    const productDetail = useCallback((p) => {
        setProduct(null);
        props.navigation.navigate({
            routeName: "ProductDetails",
            params: { pid: p.id, fav: p.isFav }
        });
    },[product])

    const navigateToSeller = () => {
        props.navigation.navigate({ routeName: "user", params: { user: product.user } });
    }
      
    if (product==null) {
        return <ActivityIndicator size="large" color={THEME.PRIMARY} style={{flex:1}}/>;
    }
    return (
        <View style={styles.screen}> 
            <View style={styles.imageContainer}>
                <Image source={{ uri: product.imageUrl }} style={styles.image} />
            </View>
            <View style={styles.titlContainer}>
                <View style={styles.nameContainer}>
                    <Text style={styles.title}>{product.title} </Text>
                    <Text style={styles.price}>${parseFloat(product.price).toFixed(2)}</Text>
                </View>
                {
                user.id!=product.user_id ? 
                <TouchableOpacity style={styles.addToCart} onPress={toCart}>
                    <Text style={styles.addtoCartText}>Add to Cart  </Text>
                    <FontAwesome name="cart-plus" style={styles.addtoCartText} />
                </TouchableOpacity>
                : null
                }
            </View>
            <ScrollView>
            <View style={styles.desc}>
                <Text style={styles.descTitle}>Description</Text>
                <Text style={styles.descText}>{product.description}</Text>
            </View> 
            <View style={styles.seller}>
                <Text style={styles.descTitle}>Seller</Text>
                <Card style={styles.card}>
                    <TouchableOpacity onPress={navigateToSeller}>
                        <Card.Title title={product.user.name} left={(props) => <Avatar.Image color={THEME.PRIMARY} size={42} source={{uri:product.user.imageUrl}} />} />
                    </TouchableOpacity>
                </Card>    
            </View>   
            <FlatList 
                style={{marginBottom:20,paddingBottom:10,height:190}}
                horizontal={true} 
                    keyExtractor={(item) => {
                        return item.id.toString()
                    }}
                    data={relatedProducts}
                renderItem={(item) => 
                    <View style={styles.box}>
                        <TouchableOpacity activeOpacity={0.7} onPress={productDetail.bind(this,item.item)}>

                            <ImageBackground style={styles.bgImage} source={{ uri: item.item.imageUrl }}>
                                <View style={styles.releted_bg}>
                                    <Text style={styles.releted_title}>{item.item.title}</Text>
                                    <Text style={styles.related_price}>$ {parseFloat(item.item.price).toFixed(2)}</Text>
                                </View>
                            </ImageBackground>
                        </TouchableOpacity>
                    </View>}
                />
                
            </ScrollView>
        </View>
    );
}

ProductDetails.navigationOptions = (navData) => {
    const isFav = navData.navigation.getParam('fav');
    const toggleFav = navData.navigation.getParam('toggleFav');

    return {
        headerTitle: "Product Details   ",
        headerRight: () => <HeaderButtons HeaderButtonComponent={HeaderButton}>
            <Item title="Fav" iconName={!isFav ? "md-heart-empty" : "md-heart"} onPress={toggleFav} />
            <Item title="Cart"  iconName={Platform.OS === "android" ? "md-cart" : "ios-cart"} onPress={() => { navData.navigation.navigate("Cart") }} />
        </HeaderButtons>
    }
}

const styles=StyleSheet.create({
    box:{
        height:150,
        width:150,
        backgroundColor:"white",
        margin:5,
        elevation:10,
        borderRadius:10,
        overflow:"hidden"
    },
    bgImage:{
        height: 150,
        width: 150,
    },  
    releted_bg:{
        justifyContent:"flex-end",
        flex:1,
        padding:10
    },
    releted_title:{
        fontSize:18,
        fontFamily:"open-sans-bold",
        color:"white",
      
    },  
    related_price:{
        fontSize: 18,
        fontFamily: "open-sans",
        color: THEME.PRIMARY,
    },
    screen:{
        flex:1
    },
    imageContainer:{
        height:350,
        width:"100%",
        backgroundColor: "#fff",
        elevation:10
    },  
    image:{
        height:350,
        width:'100%',
        backgroundColor:"#fff",
    },
    titlContainer:{
        minHeight:75,
        borderBottomColor:THEME.BORDER,
        borderBottomWidth:2,
        backgroundColor:"white",
        elevation:10,
        flexDirection:"row",
        alignItems:"center",
        paddingHorizontal:20,
        paddingVertical:10
    },
    nameContainer:{
        flex:1
    },  
    title:{
        fontFamily:"open-sans",
        fontSize:24
    },
    price:{
        fontSize:20,
        color:THEME.PRIMARY
    },
    addToCart:{
        flexDirection:"row"
    },
    addtoCartText:{
        fontSize:20,
        fontFamily:"open-sans-bold",
        color:THEME.ACCENT,
    },
    desc:{
        margin:10
    },
    descTitle:{
        fontSize:22,
        fontFamily:"open-sans-bold",
        color:THEME.PRIMARY_TEXT
    },
    descText:{
        fontSize:16,
        fontFamily:"open-sans",
        marginTop:5
    },
    seller:{
        padding:10,
    },
    card:{
        marginTop:10
    }

});
export default ProductDetails;