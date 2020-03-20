import React, { useState} from 'react'
import { StyleSheet, Text, View, TouchableHighlight, ToastAndroid } from 'react-native'
import PasswordInputText from 'react-native-hide-show-password-input';
import { Formik } from 'formik';
import * as Yup from "yup";
import { Button, } from 'react-native-paper';
import THEME from '../../constants/THEME'
import API from '../../constants/API';
import { authHeader } from '../../constants/authHeader';
import { useSelector } from 'react-redux';
const validations = Yup.object().shape({
    oldPassword: Yup.string()
        .min(6, "Password must be 6 char long.")
        .trim()
        .required('Required'),
    newPassword: Yup.string()
        .trim()
        .required('Required')
        .min(6,"Password must be 6 char long."),
    confirmPassword: Yup.string().trim().required("Required").oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
});
const updatePasswordScreen = (props) => {
    const [loading, setLoading] = useState(false);
    const [oldPasswordError, setOldPasswordError] = useState(null);
    const auth = useSelector(state => state.auth);

    // console.log("cr")
    const handleSubmit = (form, { resetForm }) => {
         setLoading(true);
        API.post("user/update/password",{
            old_password:form.oldPassword,
            new_password:form.newPassword
        },authHeader(auth.token)).then(res => {
             setLoading(false);
            
            if (res.data.status==0) {
                 setOldPasswordError(res.data.message);
            }else{
                setOldPasswordError(false);
            }
            if (res.data.status==1) {
                resetForm();
                ToastAndroid.show("Password updated Successfully",ToastAndroid.LONG);
                props.navigation.goBack();
            }
        }).catch(err => {
             setLoading(false);
        });
    }
    const theme = {
        colors: {
            primary: THEME.PRIMARY,
            accent: THEME.ACCENT,
        },
    };
    return (
        <View>
            <View style={styles.container}>
                <Formik
                    initialValues={{ oldPassword: "", newPassword: "", confirmPassword: "" }}
                    validationSchema={validations}
                    onSubmit={(values, { resetForm }) => handleSubmit(values, { resetForm })}

                >
                    {
                        ({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue,resetForm }) => (
                            <View>
                                <PasswordInputText
                                    value={values.oldPassword}
                                    onChangeText={handleChange('oldPassword')}
                                    onChange={e => {
                                        setOldPasswordError(null);
                                        setFieldValue('oldPassword', e);
                                    }}
                                    placeholder="Old password"
                                    onBlur={handleBlur('oldPassword')}
                                />
                                {errors.oldPassword && touched.oldPassword ? <Text style={styles.errorText}>{errors.oldPassword}</Text> : null}
                                {oldPasswordError != null ? <Text style={styles.errorText}>{oldPasswordError}</Text> : null}

                                <PasswordInputText
                                    value={values.newPassword}
                                    onChangeText={handleChange('newPassword')}
                                    placeholder="New Password"
                                    onBlur={handleBlur('newPassword')}

                                />
                                {errors.newPassword && touched.newPassword ? <Text style={styles.errorText}>{errors.newPassword}</Text> : null}

                                <PasswordInputText
                                    value={values.confirmPassword}
                                    onChangeText={handleChange('confirmPassword')}
                                    placeholder="Confirm Password"
                                    onBlur={handleBlur('confirmPassword')}

                                />
                                {errors.confirmPassword && touched.confirmPassword ? <Text style={styles.errorText}>{errors.confirmPassword}</Text> : null}


                                <Button mode="text" style={{marginTop:10}} theme={theme} loading={loading} onPress={handleSubmit}>
                                    Change Password
                                            </Button>
                            </View>
                        )
                    }
                </Formik>


            </View>
        </View>
    )
}
updatePasswordScreen.navigationOptions = () => {
    return {
        headerTitle: "Change Password     "
    }
}

export default updatePasswordScreen

const styles = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: "white",
        elevation: 5,
        paddingBottom: 20
    },
    errorText: {
        color: THEME.DANGER,
        fontFamily: "open-sans",
    }

})
