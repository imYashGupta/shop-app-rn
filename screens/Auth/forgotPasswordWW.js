import React, { useState} from 'react'
import { StyleSheet, Text, View, ImageBackground, ActivityIndicator } from 'react-native'
import { WebView } from 'react-native-webview';
import THEME from '../../constants/THEME';

const forgotPasswordWW = () => {
  const [loading, setLoading] = useState(true)

  const hideSpinner =() => {
    setLoading(false);
  }

  return (
    <View style={styles.screen}>
      <WebView onLoad={() => hideSpinner()} onLoadStart={() => console.log("ls")} source={{ uri: 'http://tranquil-crag-19664.herokuapp.com/public/password/reset?app=true' }} />
      {loading && (
        <ActivityIndicator
          style={{ position: 'absolute', left: 0, right: 0, bottom: 0, top: 0, }}
          size="large"
        />
      )}
    </View>
  )
}

forgotPasswordWW.navigationOptions = () =>{
    return {
      headerTitle: "Forgot Password"
    }
}

export default forgotPasswordWW

const styles = StyleSheet.create({
  screen:{
    flex:1,
    height:'100%'
  }
})
