import React from 'react';
import { createAppContainer, createSwitchNavigator  } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { createDrawerNavigator,DrawerItems } from 'react-navigation-drawer';
import THEME from "../constants/THEME";
import { Platform,SafeAreaView,View,Text, Image } from "react-native";
//screens
import ProductsScreen from "../screens/shop/ProductsScreen";
import ProductDetailsScreen from "../screens/shop/ProductDetailsScreen";
import CartScreen from '../screens/shop/CartScreen';
import OrderScreen from '../screens/shop/OrdersScreen';
import { Ionicons,FontAwesome } from "@expo/vector-icons";
import OrderPlaced from '../screens/shop/OrderPlacedScreen';
import userProducts from '../screens/user/UserProductsScreen';
import createProduct from '../screens/user/CreateProductScreen';
import AuthScreen from '../screens/Auth/AuthScreen';
import SignUpScreen  from '../screens/Auth/SignupScreen';
import StartupScreen from '../screens/StartupScreen';
import { Button } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/actions/auth';
import Favorites from '../screens/shop/FavoriteScreen';
import UserScreen from '../screens/user/UserScreen';
import Constants from 'expo-constants';
import { TouchableOpacity, TouchableNativeFeedback } from 'react-native-gesture-handler';
import editProfileScreen from '../screens/user/editProfileScreen';
import updatePasswordScreen from '../screens/user/updatePasswordScreen';
import forgotPasswordWW from '../screens/Auth/forgotPasswordWW';
import yashgupta from '../screens/yashgupta';

const defaultNavOpt = {
    headerStyle: {
        backgroundColor: Platform.OS === "android" ? THEME.PRIMARY : "",
    },
    headerTintColor: Platform.OS === "android" ? THEME.TEXT : THEME.PRIMARY
};

const productsNavigator = createStackNavigator(
    {
     //   CreateProduct: createProduct,
     Products: ProductsScreen,
     user: UserScreen,
     ProductDetails: ProductDetailsScreen,
     Cart:CartScreen,
     OrderPlaced:OrderPlaced,
     editProfile:editProfileScreen,
     updatePassword:updatePasswordScreen,
     yashgupta:yashgupta,
     
    },{
        defaultNavigationOptions: defaultNavOpt,
        navigationOptions: {
            drawerIcon: drawerConfig => {
                return <Ionicons name={Platform.OS === "android" ? "md-list" : "ios-list"} size={23} color={drawerConfig.tintColor} />
            }
        },
    }
);

const OrderNavigator = createStackNavigator(
    {
        Orders:OrderScreen,
        ProductDetails: ProductDetailsScreen,
    },
    {
        navigationOptions: {
            drawerIcon: drawerConfig => {
                return <Ionicons name={Platform.OS === "android" ? "md-cart" : "ios-cart"} size={23} color={drawerConfig.tintColor} />
            },
            
        },
        defaultNavigationOptions: defaultNavOpt
    }
);


const adminNavigator=createStackNavigator(
    {
        UserProducts:userProducts,
        CreateProduct:createProduct,
        ProductDetails: ProductDetailsScreen,
    },
    {
        navigationOptions: {
            drawerIcon: drawerConfig => {
                return <Ionicons name={Platform.OS === "android" ? "md-create" : "ios-create"} size={23} color={drawerConfig.tintColor} />
            },
            drawerLabel: "My Products   "
             
        },
        defaultNavigationOptions: defaultNavOpt
    }

);

const FavoritesNavigator = createStackNavigator(
    {
        Favorites: Favorites,
        Cart: CartScreen,
        ProductDetails: ProductDetailsScreen,
    }, {
        navigationOptions: {
            drawerIcon: drawerConfig => {
                return <Ionicons name={Platform.OS === "android" ? "md-heart-empty" : "ios-heart-empty"} size={23} color={drawerConfig.tintColor} />
            },
            drawerLabel: "Wishlists   "

        },
        defaultNavigationOptions: defaultNavOpt

    }
)
const drawer = createDrawerNavigator(
    {
        Products: productsNavigator,
        Orders: OrderNavigator,
        Favorites: FavoritesNavigator,
        UserProduct: adminNavigator
    },
    {
        contentOptions:{
            activeTintColor:THEME.PRIMARY
        },
        contentComponent: props => {
            const dispatch=useDispatch();
            const logoutUser = () => {
                dispatch(logout());
                props.navigation.navigate("Auth");
            }

            const user=useSelector(state => state.auth.user);
            const userProfile= () => {
                props.navigation.navigate({routeName:"user",params:{user:user}});
            }
            return <View style={{
                flex: 1, paddingTop: Constants.statusBarHeight}}>
                <SafeAreaView forceInset={{top:"always",horizontal:"never"}} style={{flex:1,justifyContent:"space-between"}}>
                    <View>
                        <View style={{ height: 100, backgroundColor: THEME.LIGHT_PRIMARY, justifyContent: "center", paddingLeft: 20 }}>
                            <TouchableOpacity onPress={userProfile} activeOpacity={0.5} style={{ flexDirection: "row", alignItems: "center" }}>
                                <Image style={{ height: 50, width: 50, borderRadius: 25, backgroundColor: THEME.ACCENT }} source={{ uri: user.imageUrl }} />
                                <View>
                                    <Text style={{ color: THEME.PRIMARY_TEXT, fontSize: 18, marginLeft: 10, fontWeight: "bold" }}>{user.name}</Text>
                                    <Text style={{ color: THEME.PRIMARY_TEXT, fontSize: 16, marginLeft: 10 }}>{user.email}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <DrawerItems {...props} />
                        <Button color={THEME.PRIMARY} icon="logout" onPress={logoutUser}>Logout</Button>
                    </View>
                    <TouchableNativeFeedback onPress={() => props.navigation.navigate("yashgupta")}>
                        <View style={{ padding: 20, justifyContent: "center", alignContent: "center", alignItems: "center" }}>
                            <Text>Developed By <Text style={{fontFamily:"open-sans-bold",color:THEME.ACCENT}}>Yash Gupta</Text></Text>
                        </View>
                    </TouchableNativeFeedback>
                </SafeAreaView>
            </View>
        }
    }
)
const AuthNavigator = createStackNavigator({
    login: AuthScreen,
    signup:SignUpScreen,
    forgotPassword: forgotPasswordWW
},{
    defaultNavigationOptions: defaultNavOpt

});

const mainNavigator = createSwitchNavigator({
    Start:StartupScreen,
    Auth: AuthNavigator,
    Shop: drawer,
});

export default createAppContainer(mainNavigator);