import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, ToastAndroid, Keyboard } from "react-native";
import { Formik } from 'formik';
import { LinearGradient } from 'expo-linear-gradient';
import { TextInput, Button } from 'react-native-paper';
import THEME from '../../constants/THEME';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { signup } from '../../store/actions/auth';
const SignupSchema = Yup.object().shape({
    name: Yup.string().trim().required("This field is required.").min(3,"Too Short!"),
    email: Yup.string().trim()
        .email('Please enter a valid email address.')
        .required('This field is required.'),
    password: Yup.string().trim().required("This field is required.").min(6, "Password must be 6 char. long."),
    confirmed: Yup.string().trim().required("This field is required.").oneOf([Yup.ref('password'), null], 'Passwords must match')
});
const SignUpScreen = props => {
    console.log("sign up", window.auth);
    const [loading, setLoading] = useState(false);
    const [emailError,setEmailError] = useState(null);
    const theme = {
        colors: {
            primary: "#556270",
            accent: "#4ecdc4",
        },
    };

    const dispatch = useDispatch();

    const signupHandler = (data) => {
        Keyboard.dismiss();

        setLoading(true);
        dispatch(signup(data.name,data.email,data.password)).then(response => {
            setLoading(false);
            setEmailError(null);
            if (response.status===201) {
                console.log("signup",response.data);
                props.navigation.navigate("Shop");
            }
            // ToastAndroid.show("Something went wrong, Try again later!", ToastAndroid.SHORT);

        }).catch(error => {
            setLoading(false);
            if (error.response.status == 422) {
                if (error.response.data.errors["email"] !== undefined ){
                    setEmailError(error.response.data.errors.email[0]);
                }else{
                    setEmailError(null);
                }
                let objs = Object.values(error.response.data.errors);
                ToastAndroid.show(objs[0][0], ToastAndroid.SHORT);
            }
            else{
                ToastAndroid.show("Something went wrong, Try again later!", ToastAndroid.SHORT);
            }
                
        })
    }

    return (
        <KeyboardAvoidingView style={styles.screen}>
            <LinearGradient style={styles.gradient} colors={["#FFFFFF", "#4ecdc4", "#556270"]} start={[0, 0]} end={[1, 1]} location={[0.25, 0.4, 1]}>
                <Formik
                    initialValues={{ name:"",email: '', password: "",confirmed:"" }}
                    onSubmit={values => signupHandler(values)}
                    validationSchema={SignupSchema}

                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, setFieldValue,touched }) => (


                        <View style={styles.container}>
                            <Text style={styles.headerText}>
                                SIGN UP
                            </Text>
                            <TextInput
                                label='Your Name'
                                mode="outlined"
                                style={styles.inputs}
                                theme={theme}
                                onChangeText={handleChange('name')}
                                onBlur={handleBlur('name')}
                                value={values.name}
                                error={errors.name && touched.name ? true :false}
                                autoCapitalize="words"
                                
                            />
                            {errors.name && touched.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
                            <TextInput
                                label='Email'
                                mode="outlined"
                                style={styles.inputs}
                                theme={theme}
                                keyboardType="email-address"
                                clearButtonMode="never"
                                onChangeText={handleChange('email')}
                                onChange={e => {
                                    setEmailError(null);
                                    setFieldValue('email', e);
                                }}
                                onBlur={handleBlur('email')}
                                value={values.email}
                                error={errors.email && touched.email  || emailError!==null ? true : false}

                            />
                            {errors.email && touched.email  ? <Text style={styles.errorText}>{errors.email}</Text> : null}
                            {emailError != null ? <Text style={styles.errorText}>{emailError}</Text> : null}
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
                            <TextInput
                                label='Confirm Password'
                                mode="outlined"
                                style={styles.inputs}
                                theme={theme}
                                secureTextEntry={true}
                                onChangeText={handleChange('confirmed')}
                                onBlur={handleBlur('confirmed')}
                                value={values.confirmed}
                                error={errors.confirmed && touched.confirmed ? true :false}
                            />
                            {errors.confirmed && touched.confirmed ? <Text style={styles.errorText}>{errors.confirmed}</Text> : null}

                            <Button loading={loading} onPress={handleSubmit} labelStyle={{ color: "#fff" }} style={styles.loginBtn} color="#4ecdc4" mode="contained" >
                                Sign up
                            </Button>

                            <Text style={{ textAlign: "center", fontSize: 24, color: "#556270", marginVertical: 10 }}>
                                OR
                         </Text>
                            <Text style={{ textAlign: "center", margin: 10 }}>Already have an Account?</Text>
                            <Button labelStyle={{ color: "#4ecdc4" }} color="#fff" mode="contained" onPress={() => props.navigation.navigate("login")}>
                                Log in
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
    errorText: {
        color: "#B00020",
        marginTop: 5
    }
});
SignUpScreen.navigationOptions = navData => {
    return {
        headerShown: false,

    }
}

export default SignUpScreen;