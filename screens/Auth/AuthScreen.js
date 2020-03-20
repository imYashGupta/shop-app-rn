import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, ToastAndroid, Keyboard, TouchableOpacity } from "react-native";
import { Formik } from 'formik';
import { LinearGradient } from 'expo-linear-gradient';
import { TextInput, Button } from 'react-native-paper';
import THEME from '../../constants/THEME';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { login } from '../../store/actions/auth';
const SignupSchema = Yup.object().shape({

    email: Yup.string()
        .email('Please enter a valid email address.')
        .required('This field is required.'),
    password: Yup.string().required("This field is required.").min(6,"Password must be 6 char. long.")
});
const AuthScreen = props => {
    console.log("sign in",window.auth);

    const theme = {
        colors: {
            primary: "#556270",
            accent: "#4ecdc4",
        },
    };

    const dispatch = useDispatch();
    const [authFailed, setAuthFailed] = useState(null);
    const [loading,setLoading]=useState(false);

    const loginHandler = (input) => {
        Keyboard.dismiss();
        setLoading(true);
        dispatch(login(input.email,input.password)).then(response => {
            console.log(response)
            setLoading(false);
            setAuthFailed(null);
            props.navigation.navigate("Shop");
        }).catch(error => {
            setLoading(false);
            if (error.response.status===401) {
                setAuthFailed(error.response.data.message);
                console.log(error.response.data.message)
            }else{
                setAuthFailed(null);
                ToastAndroid.show("Something went wrong, Try again later!", ToastAndroid.SHORT);
            }
        })
    }

    return (
        <KeyboardAvoidingView style={styles.screen}>
            <LinearGradient style={styles.gradient} colors={["#FFFFFF", "#4ecdc4", "#556270"]} start={[1, 0]} end={[0, 1]} location={[0.25, 0.4, 1]}>
                <Formik
                    initialValues={{ email: '', password: "" }}
                    onSubmit={values => loginHandler(values)}
                    validationSchema={SignupSchema}

                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, setFieldValue,touched}) => (


                        <View style={styles.container}>
                            <Text style={styles.headerText}>
                                LOG IN
                            </Text>
                            <TextInput
                                label='Email'
                                mode="outlined"
                                style={styles.inputs}
                                theme={theme}
                                keyboardType="email-address"
                                onChangeText={handleChange('email')}
                                clearButtonMode="never"
                                onChange={e => {
                                    setAuthFailed(null);
                                    setFieldValue('email', e);
                                }}
                                onBlur={handleBlur('email')}
                                value={values.email}
                                error={errors.email && touched.email || authFailed!==null ? true : false}

                            />
                            {errors.email && touched.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
                            {authFailed !== null ? <Text style={styles.errorText}>{authFailed}</Text> : null}
                            <TextInput
                                label='Password'
                                mode="outlined"
                                style={styles.inputs}
                                theme={theme}
                                secureTextEntry={true}
                                onChangeText={handleChange('password')}
                                onBlur={handleBlur('password')}
                                value={values.password}
                                error={errors.password && touched.password ? true :false}
                            />
                            {errors.password && touched.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

                            <TouchableOpacity onPress={() => props.navigation.navigate("forgotPassword")}>
                                <Text style={{ textAlign: "right", margin: 10 }}>Forgot password?</Text>
                            </TouchableOpacity>

                            <Button loading={loading} disabled={loading} onPress={handleSubmit} labelStyle={{ color: "#fff" }} style={styles.loginBtn} color="#4ecdc4" mode="contained" >
                                Log In
                            </Button>

                            <Text style={{ textAlign: "center", fontSize: 24, color: "#556270", marginVertical: 10 }}>
                                OR
                         </Text>
                            <Text style={{ textAlign: "center", margin: 10 }}>Set up a new Account</Text>
                            <Button labelStyle={{ color: "#4ecdc4" }} color="#fff" mode="contained" onPress={() => props.navigation.navigate("signup")}>
                                Sign Up
                    </Button>
                        </View>
                    )}
                </Formik>
            </LinearGradient>
        </KeyboardAvoidingView>
    )
}
const styles = StyleSheet.create({
    screen: {
        flex: 1
    },
    gradient: {
        flex: 1,
        justifyContent: "center"
    },
    container: {
        backgroundColor: "white",
        margin: 20,
        borderRadius: 10,
        elevation: 10,
        padding: 20
    },
    headerText: {
        fontSize: 24,
        textAlign: "center",
    },
    inputs: {
        backgroundColor: "#fff",
        marginTop: 20
    },
    loginBtn: {
        marginTop: 20,
        color: "white"
    },
    signupBtn: {
        color: "white"
    },
    errorText:{
        color:"#B00020",
        marginTop:5
    }
});
AuthScreen.navigationOptions = navData => {
    return {
        headerShown: false,

    }
}

export default AuthScreen;