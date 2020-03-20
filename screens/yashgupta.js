import React, { useState } from 'react'
import { StyleSheet, Text, View, ImageBackground, ActivityIndicator } from 'react-native'
import { WebView } from 'react-native-webview';
import THEME from '../constants/THEME';

const yashgupta = () => {
    const [loading, setLoading] = useState(true)

    const hideSpinner = () => {

        setLoading(false);
    }
    
    return (
        <View style={styles.screen}>
            <WebView onLoad={() => hideSpinner()}  source={{ uri: 'http://yashgupta.work/' }} />
            {loading && (
                <ActivityIndicator
                    style={{ position: 'absolute', left: 0, right: 0, bottom: 0, top: 0, }}
                    size="large"
                />
            )} 
        </View>
    )
}

yashgupta.navigationOptions = () => {
    return {
        headerTitle: "About Me    "
    }
}

export default yashgupta

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        height: '100%'
    }
})
