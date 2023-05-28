import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Provider } from "react-native-paper";
import { initializeApp } from "firebase/app";
import StacksNavigator from "./StacksNavigator";

const firebaseConfig = {
  apiKey: "AIzaSyA0SikDVTgahuWVjCFe9Cw7P43mHK2kC2E",
  authDomain: "ogienchat-v1.firebaseapp.com",
  projectId: "ogienchat-v1",
  storageBucket: "ogienchat-v1.appspot.com",
  messagingSenderId: "115798331248",
  appId: "1:115798331248:web:e581e9f7054d9718e7c9b5"
};

const app = initializeApp(firebaseConfig);

const App = () => {
  return (
    <Provider>
      <NavigationContainer>
        <StacksNavigator />
      </NavigationContainer>
    </Provider>
  );
};

export default App;