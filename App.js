import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import LoginScreen from "./components/LoginScreen";
import UserScreen from "./components/UserScreen";
import AdminScreen from "./components/AdminScreen";
import TrangChu from "./components/TrangChu";
import SignUpScreen from "./components/SignUpScreen";
import PickRoleScreen from "./components/PickRoleScreen";
import SignUpAdminScreen from "./components/SignUpAdminScreen";
import SignUpUserScreen from "./components/SignUpUserScreen";

const StackDemo = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer style={styles.container}>
      <StackDemo.Navigator initialRouteName="Login">
        <StackDemo.Screen
          name="Home"
          component={TrangChu}
          options={{
            title: "Trang chủ",
            headerStyle: { backgroundColor: "#23B4d2" },
            headerTitleStyle: { color: "white" },
          }}
        />
        <StackDemo.Screen
          name="Login"
          component={LoginScreen}
          options={{
            title: "Login",
            headerShown: false,
          }}
        />
        <StackDemo.Screen
          name="PickRole"
          component={PickRoleScreen}
          options={{
            title: "Pick Role",
            headerShown: false,
          }}
        />
        <StackDemo.Screen
          name="SignUp"
          component={SignUpScreen}
          options={{
            title: "Sign Up",
            headerShown: false,
          }}
        />
        <StackDemo.Screen
          name="SignUpAdmin"
          component={SignUpAdminScreen}
          options={{
            title: "Sign Up Admin",
            headerShown: false,
          }}
        />
        <StackDemo.Screen
          name="SignUpUser"
          component={SignUpUserScreen}
          options={{
            title: "Sign Up User",
            headerShown: false,
          }}
        />
        <StackDemo.Screen
          name="Admin"
          component={AdminScreen}
          options={{
            title: "New Post",
            headerShown: false,
          }}
        />
        <StackDemo.Screen
          name="User"
          component={UserScreen}
          options={{
            title: "New Post",
            headerShown: false,
          }}
        />
      </StackDemo.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
