import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createStore,combineReducers,applyMiddleware } from "redux";
import { Provider } from "react-redux";
import productReducer from "./store/reducers/product";
import cartReducer from "./store/reducers/cart";
import orderReducer from './store/reducers/order';
import Navigator from "./navigation/ShopNavigator";
import { composeWithDevTools } from "redux-devtools-extension";
import ReduxThunk from "redux-thunk";
import authReducer from './store/reducers/auth';
import { AppLoading } from 'expo';
import * as Font from 'expo-font';
const fetchFonts = () => {
  return Font.loadAsync({
    'open-sans': require("./assets/fonts/OpenSans-Regular.ttf"),
    'open-sans-bold': require('./assets/fonts/OpenSans-Bold.ttf'),
    'open-sans-regular': require('./assets/fonts/OpenSans-Regular.ttf'),
    'roboto-light': require('./assets/fonts/Roboto-Light.ttf'),
    'roboto-medium': require('./assets/fonts/Roboto-Medium.ttf'),
    'roboto-regular': require('./assets/fonts/Roboto-Regular.ttf'),
  })
}

const rootReducer = combineReducers({
  products:productReducer,
  cart: cartReducer,
  order:orderReducer,
  auth:authReducer
});

const store = createStore(rootReducer, composeWithDevTools(
  applyMiddleware(ReduxThunk)
));

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false);

  if (!fontLoaded) {
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={() => {
          setFontLoaded(true);
        }}
      />
    );
  }

  return (
    <Provider store={store}>
      <Navigator />
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
