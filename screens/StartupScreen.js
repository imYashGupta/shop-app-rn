import React, { useEffect } from 'react';
import { View,ActivityIndicator,StyleSheet,AsyncStorage } from "react-native";
import { useDispatch } from 'react-redux';
import {auth} from '../store/actions/auth';

const StartupScreen = props => {

    const dispatch = useDispatch();
    useEffect(() => {
        const tryLogin = async () => {
            const userData =await AsyncStorage.getItem("userData");
            if(!userData){ 
                props.navigation.navigate("Auth");
                return;
            }
            const user= JSON.parse(userData);
            const expiryDate = new Date(user.expires_in);
            if (expiryDate <= new Date() || !user.token || !user.user) {
                props.navigation.navigate("Auth");
                return; 
            }
            dispatch(auth(user.token, user.user)).then(res => {
                window.auth = {
                    token:user.token,
                    user:user.user
                } 
                console.log("startup",window.auth);
                props.navigation.navigate("Shop");

            })

        }   


        tryLogin();
    }, [dispatch]);

    return (
        <View style={styles.screen}>
            <ActivityIndicator size="large" /> 
        </View>
    )
}

const styles = StyleSheet.create({
    screen:{
        flex:1,
        justifyContent:"center",
        alignItems:"center"
    }
});
export default StartupScreen;