import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ImageBackground, Image, Button, TouchableNativeFeedback, FlatList } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import THEME from '../../constants/THEME';
import { Ionicons } from "@expo/vector-icons";
import API from '../../constants/API';
import { authHeader } from '../../constants/authHeader';
import { ActivityIndicator } from 'react-native-paper';
import ProductListView from '../../components/shop/ProductListView';
import { Bubbles, DoubleBounce, Bars, Pulse } from 'react-native-loader';
import { useSelector } from 'react-redux';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const screenHeight = Dimensions.get('screen').height;


const userScreen = (props) => {
    const user= props.navigation.getParam("user");
    const backHandler=() => {  
        props.navigation.goBack();
    }
    const [loading,setLoading] = useState(true);
    const [getUser, setUser] = useState({});
    const [products, setProducts] = useState([]);
    const authUser = useSelector(state => state.auth.user);
    const getUserInfo = () => {
        API.post("user/"+user.id+"/info",{},authHeader(window.auth.token)).then(response => {
            setProducts(response.data.products);
            setUser(response.data.user);
            setLoading(false);
        }).catch(error => {

        })
    }

    useEffect(() => {
        getUserInfo();
    },[user])


    


    return (
        <View style={{ flex: 1 }}>
            <View style={styles.header}>
                <View style={{ ...styles.btnBg, top: "12%", left: "2%" }}>
                    <TouchableNativeFeedback onPress={backHandler} background={TouchableNativeFeedback.Ripple('white')}>
                        <View style={styles.backbtn}>
                            <Ionicons style={styles.backIcon} name="ios-arrow-back" size={23} color="white" />
                        </View>
                    </TouchableNativeFeedback>
                </View>
                {
                    authUser.id === user.id ?
                <View style={{ ...styles.btnBg, top: "12%", right: "2%" }}>
                    <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('white')} onPress={() => props.navigation.navigate("editProfile")}>
                        <View style={styles.backbtn}>
                            <Ionicons style={styles.backIcon} name="md-create" size={23} color="white" />
                        </View>
                    </TouchableNativeFeedback>
                </View>
                : null
                }


                <View style={styles.centerCircleContainer}>
                    <View style={styles.imageWrapper}>
                        <Image style={styles.image} source={{ uri: getUser.imageUrl}}/>
                        {console.log(getUser.imageUrl)}
                    </View>
                        <Text style={styles.name}>{user.name}</Text>
                    <View style={{flexDirection:"row"}}>
                        <View style={{ flexDirection: "row" }}>
                            <Text style={styles.detail}> Products </Text>
                            {
                                loading ? 
                                <Pulse size={10} color="#fff" />
                                : 
                                <Text style={styles.detail}>{getUser.info.products}</Text>
                            }
                        </View>
                        {/* <Text style={styles.detail}> | </Text>
                        <View style={{ flexDirection: "row" }}>
                            <Text style={styles.detail}> Orders </Text>
                            {
                                loading ?
                                    <Pulse size={10} color="#fff" />
                                    :
                                    <Text style={styles.detail}>{getUser.info.orders}</Text>
                            }
                        </View> */}
                    </View>
                </View>
            </View>
            {
            loading ? 
            <View style={styles.section}>
                <ActivityIndicator size="small" color={THEME.ACCENT} />
            </View>
            : 
            <View style={styles.sectionContent}> 
                <View style={styles.infoSection}>
                    <Text style={styles.infoName}>Products By {user.name}</Text>
                    {/* <Text style={styles.infoContact}>Products By {user.name}</Text> */}

                </View>
                <FlatList 
                    style={{padding:20}}
                    data={products}
                            keyExtractor={(item) => {
                                return item.title
                            }}
                    renderItem={(item) => {
                        return <ProductListView 
                            style={{ marginBottom: 15 }}
                            navigation={props.navigation}
                            itemData={item}
                            user={false}
                            showFav={false}
                        />
                    }}

                />
            </View>
            }
        </View>

    );
}

const styles = StyleSheet.create({
    header: {
        height: windowHeight / 3,
        width: "100%",
        backgroundColor: THEME.ACCENT,
        elevation:10,
        borderBottomColor:"#ccc",
        borderBottomWidth:2
    },
    btnBg: {
        height: 50,
        width: 50,
        borderRadius: 25,
        overflow: "hidden",
        position: "absolute",
    },
    backbtn: {
        height: 50,
        width: 50,
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        borderRadius: 25,
    },
    backIcon: {
        marginTop: 0,
        paddingTop: 0
    },
    centerCircleContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    image: {
        height: 150,
        width: 150,
        borderRadius: 300,
        borderWidth: 5,
        borderColor: "white",
    },
    imageWrapper: {
        elevation: 10,
        height: 150,
        width: 150,
        borderRadius: 300,
        backgroundColor:THEME.ACCENT
    },
    name: {
        fontSize: 24,
        color: THEME.PRIMARY_TEXT,
        fontFamily: "open-sans",
        marginTop: 10,
        color: "white"
    },
    detail: {
        color: "white",
        fontSize: 16
    },
    section:{
        flex:1,
        justifyContent:"center",
        alignItems:"center"
    },
    sectionContent:{
        flex:1
    },
    infoSection:{
        flexDirection:"row",
        padding:20,
        backgroundColor:"white",
        elevation:5,
        justifyContent:"center"
    },
    infoName:{
        fontFamily:"roboto-regular",
        fontSize:16,
        textAlign:"center"
    }
});

userScreen.navigationOptions = () => {
    return {
        headerShown: false
    }
}

export default userScreen;