import { Image, RefreshControl, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import TrangChu from "./TrangChu";
import AddPostsScreen from "./AddPostsScreen";
import colors from "../misc/colors";
import { TouchableOpacity } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FollowScreen from "./FollowScreen";
import EditUserProfile from "./EditUserProfile";
import VideosScreen from "./VideosScreen";

const Drawer = createDrawerNavigator();

const CustomDrawer = (props) => {
  const [objU, setobjU] = useState({});
  const [fullname, setfullname] = useState("");
  const [avatar, setavatar] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  var api_url = "http://172.20.10.3:3000/users/";

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem("login");
      if (value !== null) {
        setobjU(JSON.parse(value));
        let obj = JSON.parse(value);

        fetch(api_url + obj.id)
          .then((res) => res.json())
          .then((data) => {
            setavatar(data.avatar);
            setfullname(data.fullname);
          });
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    getData();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        <View style={{ padding: 20 }}>
          {avatar ? (
            <Image
              source={{ uri: avatar }}
              style={{
                width: 100,
                height: 100,
                marginBottom: 15,
                borderRadius: 100,
              }}
            />
          ) : (
            <Image
              source={require("../assets/profile.png")}
              style={{ width: 100, height: 100, marginBottom: 15 }}
            />
          )}
          <Text style={{ color: "black", fontWeight: "600", fontSize: 18 }}>
            {fullname}
          </Text>
        </View>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <View style={{ padding: 20, borderTopWidth: 1, borderTopColor: "#ccc" }}>
        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate("Login");
          }}
        >
          <Text style={{ color: colors.BLUE1, fontWeight: "bold" }}>
            Log Out
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const UserScreen = () => {
  return (
    <Drawer.Navigator drawerContent={(props) => <CustomDrawer {...props} />}>
      <Drawer.Screen name="Posts" component={TrangChu} />
      <Drawer.Screen name="Follows" component={FollowScreen} />
      <Drawer.Screen name="Videos" component={VideosScreen} />
      <Drawer.Screen name="Edit Profile" component={EditUserProfile} />
      
    </Drawer.Navigator>
  );
};

export default UserScreen;

const styles = StyleSheet.create({});
