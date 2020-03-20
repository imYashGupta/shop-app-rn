import React, { useState, useEffect, useCallback } from 'react';
import { Text, View, StyleSheet, ToastAndroid, Image, ScrollView, Keyboard } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import THEME from '../../constants/THEME';
import { useSelector, useDispatch } from 'react-redux';
import { createProduct, updateProduct } from "../../store/actions/product";
import * as ImagePicker from 'expo-image-picker';
import API from '../../constants/API';
import { Formik } from 'formik';
import * as Yup from "yup";
const SignupSchema = Yup.object().shape({
    name: Yup.string()
        .trim()
        .required('Required')
        .min(3, 'Too Short!'),
    description: Yup.string()
        .trim()
        .required('Required')
        .min(3, 'Too Short!'),
    price: Yup.number("s")
        .min(1, "Invalid price")
        .positive("Invalid price")
        .required("Required")
        .typeError('Price must be a valid number'),
    image: Yup.string()
        .required("Required")

});
const createEditProduct = props => {
    console.log("CreateProductScreen");

    const productId = props.navigation.getParam("pid");
    const product = useSelector(state => state.products.userProducts.find(product => product.id === productId));
    const [pickedImage, setPickedImage] = useState();
    const [imgbase64, setImgbase64] = useState();
    useEffect(() => {
        if (product) {
            setPickedImage(product.imageUrl);
        } 
    },[product]);

    const [name, setName] = useState(product ? product.title : "");
    const [desc, setDesc] = useState(product ? product.description : "");
    const [price, setPrice] = useState(product ? product.price.toString() : "");
    const [imageUrl, setImageUrl] = useState(product ? product.imageUrl : "");
    const [isLoading, setIsLoading] = useState(false);
    const theme = {
        colors: {
            primary: THEME.PRIMARY,
            accent: THEME.ACCENT,
        },
    };
    const dispatch = useDispatch();
    const submitHandler = (input) => {
        Keyboard.dismiss();


        const { name, description, price, image } = input;

        setIsLoading(true);
        if (product) {
            let imageData;
            if (image==product.imageUrl) {
                imageData = false;
            }else{
                imageData = image;
            }
            dispatch(updateProduct(product.id, name, description, imageData)).then(res => {
                setIsLoading(false);
                ToastAndroid.show('Product Updated.', ToastAndroid.SHORT);
                props.navigation.goBack();
            }).catch(error => {
                setIsLoading(false);
                if (error.response.status == 422) {
                    let objs = Object.values(error.response.data);
                    ToastAndroid.show(objs[0][0], ToastAndroid.SHORT);
                } else {
                    ToastAndroid.show('Something went wrong, Please try again later!', ToastAndroid.SHORT);
                }
            });

        } else {
            // console.log("create");
            dispatch(createProduct(name, description, +price, image)).then((res) => {
                setIsLoading(false);
                //console.log(res)
                ToastAndroid.show('Product Added.', ToastAndroid.SHORT);
                props.navigation.goBack();
            }).catch(error => {
                setIsLoading(false);
                if (error.response.status == 422) {
                    let objs = Object.values(error.response.data);
                    ToastAndroid.show(objs[0][0], ToastAndroid.SHORT);
                } else {
                    ToastAndroid.show('Something went wrong, Please try again later!', ToastAndroid.SHORT);
                }

            })
        }
    }

    const imagePicker = () => {
        // ImagePicker.launchCameraAsync().then(data => {
        //     console.log(data);
        // });
        return new Promise((resolve, reject) => {
            ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [16, 9],
                base64: true,
                quality: 0.5
            }).then(image => {
                setPickedImage(image.uri);
                setImgbase64(image.base64);
                resolve(image);
            })

        })
    }

    return (
        <ScrollView style={styles.screen}>
            <Text style={styles.h1}>Product Details </Text>


            <Formik
                initialValues={{ name: product ? product.title : "", description: product ? product.description : "", price: product ? product.price.toString() : "", image: product ? product.imageUrl : ""}}
                onSubmit={values => submitHandler(values)}
                validationSchema={SignupSchema}
            >
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
                    <View>
                        <TextInput
                            label='Name'
                            theme={theme}
                            selectionColor={THEME.LIGHT_PRIMARY}
                            style={styles.formControl}
                            returnKeyType="next"
                            onChangeText={handleChange('name')}
                            value={values.name}
                            error={errors.name && touched.name ? true : false}
                            onBlur={handleBlur('name')}

                        />
                        {errors.name && touched.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
                        <TextInput
                            label='Description'
                            theme={theme}
                            selectionColor={THEME.LIGHT_PRIMARY}
                            multiline={true}
                            style={styles.formControl}
                            numberOfLines={4}
                            onChangeText={handleChange('description')}
                            onBlur={handleBlur('description')}
                            value={values.description}
                            error={errors.description && touched.description ? true : false}

                        />
                        {errors.description && touched.description ? <Text style={styles.errorText}>{errors.description}</Text> : null}

                        <TextInput
                            label='Price'
                            theme={theme}
                            style={styles.formControl}
                            selectionColor={THEME.LIGHT_PRIMARY}
                            keyboardType="decimal-pad"
                            disabled={product ? true : false}

                            onChangeText={handleChange('price')}
                            onBlur={handleBlur('price')}
                            value={values.price}
                            error={errors.price && touched.price ? true : false}

                        />
                        {errors.price && touched.price ? <Text style={styles.errorText}>{errors.price}</Text> : null}

                        {!pickedImage ?
                            <Text style={styles.imageTitle}>Please upload product image!</Text>
                            :
                            (
                                <View>
                                    <Text style={styles.imageTitle}>Product image:</Text>
                                    <Image style={styles.image} source={{ uri: pickedImage }} />
                                </View>
                            )
                        }
                        {errors.image ? <Text style={styles.errorText}>{errors.image}</Text> : null}
                        <Button color={THEME.primary} style={styles.uploadBtn} theme={theme} onPress={() => {
                            imagePicker().then(res => {
                                setFieldValue('image', res.base64);
                            }).catch(err => {
                                console.log("img err", err);
                            })

                        }}>UPLOAD IMAGE</Button>

                        <Button loading={isLoading} style={{ marginBottom: 20 }} onPress={handleSubmit} theme={theme} mode="contained" >save</Button>
                    </View>
                )}
            </Formik>

        </ScrollView>
    )
}

const styles = StyleSheet.create({
    screen: {
        paddingHorizontal: 20,
        paddingTop: 20
    },
    formControl: {
        fontSize: 16,
        marginTop: 15,
        elevation: 3,
        color: THEME.PRIMARY_TEXT,
        overflow: "hidden"
    },
    h1: {
        fontSize: 24,
    },
    btn: {
        marginTop: 20
    },
    imageTitle: {
        marginTop: 20,
        fontSize: 17
    },
    image: {
        height: 300,
        width: "100%",
        borderColor: "#ccc",
        borderWidth: 1,
        marginTop: 10
    },
    errorText: {
        color: "#B00020",
        marginVertical: 5
    },
    uploadBtn: {
        marginVertical: 10
    }
})

createEditProduct.navigationOptions = navData => {
    let pid = navData.navigation.getParam("pid");
    return {
        headerTitle: pid ? "Edit Product    " : "Add New Product    "
    }
}

export default createEditProduct;