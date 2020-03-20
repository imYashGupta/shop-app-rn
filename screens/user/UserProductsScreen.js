import React from 'react';
import { View,Text,FlatList } from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from "../../components/UI/HeaderButton";
import Product from "../../components/shop/Product";
import { useSelector } from 'react-redux';
import THEME from '../../constants/THEME';
import { TouchableOpacity } from 'react-native-gesture-handler';
const userProducts= props => {
    const userProducts=useSelector(state => state.products.userProducts);
    
    if (userProducts.length == 0) {
        return <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text>You don't have any products! </Text>
            <TouchableOpacity onPress={() => props.navigation.navigate("CreateProduct")}>
                <Text style={{ color: THEME.PRIMARY, fontSize: 16, fontFamily: "open-sans-bold" }}>Create a Product</Text>
            </TouchableOpacity>
        </View>
    }
    return (
        <FlatList
            data={userProducts}
            keyExtractor={product => product.id.toString()}
            renderItem={itemData =>
                (<Product
                    navigation={props.navigation}
                    itemData={itemData}
                    user={true}
                    />)} />
     );
}
userProducts.navigationOptions = navData => {
    return {
        headerTitle: "My Products   ",
        headerLeft: () => (<HeaderButtons HeaderButtonComponent={HeaderButton}>
            <Item title="menu" iconName={Platform.OS === "android" ? "md-menu" : "ios-menu"} onPress={() => { navData.navigation.toggleDrawer(); }} />
        </HeaderButtons>),
        headerRight:() => (
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item title="create" iconName={Platform.OS === "android" ? "md-add" : "ios-add"} onPress={() => { navData.navigation.navigate("CreateProduct") }} />
            </HeaderButtons>
        )
    }
}

export default userProducts;