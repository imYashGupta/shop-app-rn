import React, { useState} from 'react'
import { StyleSheet, Text, View, KeyboardAvoidingView, TextInput, TouchableOpacity, Image, Alert, ToastAndroid, Modal, TouchableHighlight } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import THEME from '../../constants/THEME'
import { Ionicons } from "@expo/vector-icons";
import { Button,  } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import { useSelector, useDispatch } from 'react-redux';
import { Formik } from 'formik';
import * as Yup from "yup";
import API from '../../constants/API';
import { authHeader } from '../../constants/authHeader';
import { updateUser } from '../../store/actions/auth';
import PasswordInputText from 'react-native-hide-show-password-input';

const validations = Yup.object().shape({
    name: Yup.string()
        .trim()
        .required('Required')
        .min(3, 'Too Short!')
});


const editProfileScreen = (props) => {
    const auth = useSelector(state => state.auth);    
    const [newImage, setNewImage] = useState(false);
    const [base64Image, setBase64Image] = useState(false);
    const [name, setName] = useState(auth.user.name);
    const [nameError, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(true);

    const theme = {       
        colors: {
            primary: THEME.PRIMARY,
            accent: THEME.ACCENT,
        },
    }; 

    const verifyPermissions = async () => {
        const result = await Permissions.askAsync(Permissions.CAMERA_ROLL, Permissions.CAMERA);
        if (result.status !== 'granted') {
            Alert.alert(
                'Insufficient permissions!',
                'You need to grant camera permissions to use this app.',
                [{ text: 'Okay' }]
            );
            return false;
        }
        return true;
    };


    const onEditImageHandler = async () => {
        const hasPermission = await verifyPermissions();
        if (!hasPermission) {
            return;
        }
        ImagePicker.launchImageLibraryAsync({
            base64:true,
            allowsEditing :true,
            quality :0.5
        }).then(data => {
            console.log(data);
            if (data.cancelled) {
                setNewImage(false);
                setBase64Image(data.base64);
            }else{
                setNewImage(data.uri);
                setBase64Image(data.base64);
            }
        });
    }
    const dispatch = useDispatch();

    const submitHandler = (values) => {
        setLoading(true);
        API.post("/user/update",{
            name:values.name,
            image: base64Image !== false ? base64Image : undefined  
        },authHeader(auth.token)).then(res => {
            if (res.status==200) {
                setLoading(false);
                // console.log("log",res.data.user)
                dispatch(updateUser(res.data.user));
                ToastAndroid.show("Profile update successfully",ToastAndroid.LONG);
                props.navigation.navigate({ routeName: "user", params: { user: res.data.user } });

            }
        }).catch(err => {
            setLoading(false);
            console.log(err);
            
        })
    }
    

    const toggleModal = (bool) => {
        setShowModal(bool);
    }

    
    return (
        <KeyboardAvoidingView
            behavior="padding"
            keyboardVerticalOffset={70}
            style={{ flex: 1, justifyContent: "center" }} >
            <View style={{ flex: 1,justifyContent:"center" }} >
                <View style={styles.content}>
                    <View style={styles.imageContainer}>
                        <View style={styles.iconBtn}>
                            <TouchableOpacity onPress={onEditImageHandler} style={styles.editBtnOpacity}>
                                <Ionicons name="md-create" size={23} color={THEME.ACCENT} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.imageWrapper}>
                            <Image style={styles.bgImage} source={newImage!=false ? {uri:newImage} : {uri:auth.user.imageUrl}} />
                        </View>
                    </View>
                    <Formik
                        initialValues={{name:name,email:auth.user.email}}
                        onSubmit={values => submitHandler(values)}
                        validationSchema={validations}

                    >
                    {
                        ({handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue}) => (

                        
                            <View style={{flex:1,width:"100%",alignItems:"center",justifyContent:"center"}}>
                                <TextInput 
                                    style={{
                                        borderBottomColor:THEME.BORDER,
                                        borderBottomWidth:1,
                                        textAlign:"center",
                                        width:'80%',
                                        fontSize:16, 
                                        padding:5,
                                        marginTop:10
                                        
                                    }}
                                    placeholder="Your name"
                                    value={values.name}
                                    onChangeText={handleChange('name')}


                                />
                                <View style={{flex:1,alignContent:"flex-start",justifyContent:"flex-start",width:"80%",marginTop:5}}>
                                    <Text style={{ color: "red",textAlign:"center" }}>{errors.name}</Text>
                                </View>
                                <TextInput
                                    style={{
                                        borderBottomColor: THEME.BORDER,
                                        borderBottomWidth: 1,
                                        textAlign: "center",
                                        width: '80%',
                                        fontSize: 16,
                                        padding: 5,
                                        color:"#8e8b8b",
                                        

                                    }}
                                    placeholder="Your Email"
                                    onBlur={handleBlur('email')}
                                    value={values.email}
                                    onChangeText={handleChange('email')}
                                    editable={false}

                                />
                                
                                <View style={styles.footerContainer}>
                                    <TouchableOpacity onPress={() => props.navigation.navigate("updatePassword")}>
                                        <Text style={styles.changePasswordLink}>Change Password?</Text>
                                    </TouchableOpacity>
                                    <Button loading={loading} disabled={loading} style={styles.saveBtn} icon="check" mode="contained" color={THEME.PRIMARY} onPress={handleSubmit}>
                                        Save
                                    </Button>
                                </View>
                            </View>

                        )
                    }
                    </Formik>
                </View>
                {/* <View style={styles.changePasswordContainer}>
                    <TextField />
                    <TextField />
                    <TextField />
                    
                </View> */}
            </View>
        </KeyboardAvoidingView>
    )
}
const styles = StyleSheet.create({
    screen: {
        flex: 1,
        alignItems: "center",
    },
    content: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
        padding: 20,
        width: "90%",
        elevation: 5,
        marginHorizontal: "5%",
        minHeight: 375,
        marginTop: 20,
    },
    imageContainer: {
    },
    imageWrapper: {
        overflow: "hidden",
        height: 175,
        width: 175,
        borderRadius: 175 / 2,
    },
    bgImage: {
        height: 175,
        width: 175,
        borderRadius: 175 / 2,
        backgroundColor: THEME.ACCENT,
    },
    iconBtn: {
        height: 45,
        width: 45,
        borderRadius: 45,
        backgroundColor: "white",
        position: "absolute",
        bottom: 10,
        right: 0,
        elevation: 5,
        zIndex: 10
    },
    editBtnOpacity: {
        height: 45,
        width: 45,
        borderRadius: 45,
        justifyContent: "center",
        alignItems: "center"
    },
    nameInput: {
        width: "80%",
        marginTop: 20,
        textAlign:"center"
    },
    saveBtn: {
        // marginTop: 20
    },
    footerContainer: {
        flexDirection: "row",
        width: "80%",
        marginTop: 20,
        paddingHorizontal: 10,
        justifyContent: "space-between",
        alignContent: "center",
        alignItems:"center"
    },
    changePasswordContainer: {
        backgroundColor: "white",
        padding: 20,
        width: "90%",
        elevation: 5,
        marginHorizontal: "5%",
        minHeight: 250,
        marginTop: 20
    },
    cp_title: {
        fontSize: 18,
        fontFamily: "open-sans"
    },
    changePasswordLink:{
        color:THEME.PRIMARY,
        fontFamily:"open-sans-bold",
        fontSize:16
    }
});

editProfileScreen.navigationOptions = () =>{
    return {
        headerTitle: "Edit Profile   ",
    }
}
export default editProfileScreen;


