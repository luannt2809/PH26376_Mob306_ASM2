// import { Text, StyleSheet, View, SafeAreaView, TextInput, TouchableOpacity, ScrollView, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Image, Animated } from 'react-native'
// import React, { Component, useRef, useState } from 'react'
// import profile from '../assets/profile.png';
// // Tab ICons...
// import home from '../assets/home.png'
// import addposts from '../assets/addposts.png'
// import logout from '../assets/logout.png';
// // Menu
// import menu from '../assets/menu.png';
// import close from '../assets/close.png';
// import colors from '../misc/colors'

// import { createDrawerNavigator } from '@react-navigation/drawer';
// import { NavigationContainer } from '@react-navigation/native';

// const Drawer = createDrawerNavigator();

// function HomeScreen({ navigation }) {
//     return (
//         <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
//             <Text>Home Screen</Text>
//         </View>
//     );
// }

// function AddPostsScreen({ navigation }) {
//     return (
//         <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
//             <Text>Add Posts Screen</Text>
//         </View>
//     );
// }

// const AdminScreen = () => {
//     const [currentTab, setCurrentTab] = useState("Home");
//     const [showMenu, setShowMenu] = useState(false);

//     const offsetValue = useRef(new Animated.Value(0)).current;
//     const scaleValue = useRef(new Animated.Value(1)).current;
//     const closeButtonOffset = useRef(new Animated.Value(0)).current;

//     return (
//         <SafeAreaView style={styles.container}>

//             <View style={{ justifyContent: 'flex-start', padding: 15 }}>
//                 <Image source={profile} style={{
//                     width: 60,
//                     height: 60,
//                     borderRadius: 10,
//                     marginTop: 8
//                 }}></Image>

//                 <Text style={{
//                     fontSize: 20,
//                     fontWeight: 'bold',
//                     color: 'white',
//                     marginTop: 20
//                 }}>Admin</Text>

//                 <View style={{ flexGrow: 1, marginTop: 40 }}>
//                     {TabButton(currentTab, setCurrentTab, "Home", home)}
//                     {TabButton(currentTab, setCurrentTab, "AddPosts", addposts)}
//                 </View>

//                 <View>
//                     {TabButton(currentTab, setCurrentTab, "LogOut", logout)}
//                 </View>

//             </View>

//             <Animated.View style={{
//                 flexGrow: 1,
//                 backgroundColor: 'white',
//                 position: 'absolute',
//                 top: 0,
//                 bottom: 0,
//                 left: 0,
//                 right: 0,
//                 paddingHorizontal: 15,
//                 paddingVertical: 20,
//                 borderRadius: showMenu ? 15 : 0,
//                 transform: [
//                     { scale: scaleValue },
//                     { translateX: offsetValue }
//                 ]
//             }}>

//                 <Animated.View style={{
//                     transform: [{
//                         translateY: closeButtonOffset
//                     }]
//                 }}>
//                     <TouchableOpacity onPress={() => {
//                         Animated.timing(scaleValue, {
//                             toValue: showMenu ? 1 : 0.88,
//                             duration: 300,
//                             useNativeDriver: true
//                         })
//                             .start()

//                         Animated.timing(offsetValue, {
//                             toValue: showMenu ? 0 : 230,
//                             duration: 300,
//                             useNativeDriver: true
//                         })
//                             .start()

//                         Animated.timing(closeButtonOffset, {
//                             toValue: !showMenu ? -30 : 0,
//                             duration: 300,
//                             useNativeDriver: true
//                         })
//                             .start()

//                         setShowMenu(!showMenu);
//                     }}>

//                         <Image source={showMenu ? close : menu} style={{
//                             width: 20,
//                             height: 20,
//                             tintColor: 'black',
//                             marginTop: 40,

//                         }}></Image>

//                     </TouchableOpacity>

//                     <Drawer.Navigator>
//                         <Drawer.Screen name="Home" component={HomeScreen} />
//                         <Drawer.Screen name="AddPosts" component={AddPostsScreen} />
//                     </Drawer.Navigator>

//                 </Animated.View>

//             </Animated.View>

//         </SafeAreaView>
//     )
// }

// const TabButton = (currentTab, setCurrentTab, title, image) => {
//     return (

//         <TouchableOpacity onPress={() => {
//             if (title == "LogOut") {
//                 // Do your Stuff...
//             } else {
//                 setCurrentTab(title)
//             }
//         }}>
//             <View style={{
//                 flexDirection: "row",
//                 alignItems: 'center',
//                 paddingVertical: 8,
//                 backgroundColor: currentTab == title ? 'white' : 'transparent',
//                 paddingLeft: 13,
//                 paddingRight: 35,
//                 borderRadius: 8,
//                 marginTop: 15
//             }}>

//                 <Image source={image} style={{
//                     width: 25, height: 25,
//                     tintColor: currentTab == title ? colors.BGR : "white"
//                 }}></Image>

//                 <Text style={{
//                     fontSize: 15,
//                     fontWeight: 'bold',
//                     paddingLeft: 15,
//                     color: currentTab == title ? colors.BGR : "white"
//                 }}>{title}</Text>

//             </View>
//         </TouchableOpacity>
//     );
// }

// export default AdminScreen

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: colors.BGR,
//         alignItems: 'flex-start',
//         justifyContent: 'flex-start',
//     },
// })

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
import PostsOfAdmin from "./PostsOfAdmin";
import DemoTrangChu from "../DemoTrangChu";
import EditAdminProfile from "./EditAdminProfile";
import VideosScreen from "./VideosScreen";

const Drawer = createDrawerNavigator();

const CustomDrawer = (props) => {
  const [objU, setobjU] = useState({});
  const [posts, setposts] = useState([]);
  const [fullname, setfullname] = useState("");
  const [avatar, setavatar] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  var api_url = "http://172.20.10.3:3000/users/";
  // var api_url = "http://172.20.10.3:3000/users/";

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

  // React.useEffect(() => {
  //   const unsubscribe = props.navigation.addListener("focus", () => {
  //     getData();
  //   });

  //   return unsubscribe;
  // }, [props.navigation]);

  useEffect(() => {
    getData();
  }, []);

  // var api_url = "http://172.20.10.3:3000/users";

  // useEffect(() => {
  //   fetch(api_url)
  //     .then((res) => res.json())
  //     .then((data) => setposts(data))
  //     .catch((err) => console.error(err));
  // }, []);

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
          {/* <TouchableOpacity> */}
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
          {/* </TouchableOpacity> */}
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
          <Text style={{ color: colors.BLUE1, fontWeight: "600" }}>
            Log Out
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const AdminScreen = () => {
  return (
    <Drawer.Navigator drawerContent={(props) => <CustomDrawer {...props} />}>
      <Drawer.Screen name="Posts" component={TrangChu} />
      <Drawer.Screen name="Videos" component={VideosScreen} />
      <Drawer.Screen name="Add Posts" component={AddPostsScreen} />
      <Drawer.Screen name="My Posts" component={PostsOfAdmin} />
      <Drawer.Screen name="Follows" component={FollowScreen} />
      <Drawer.Screen name="Edit Profile" component={EditAdminProfile} />
      
    </Drawer.Navigator>
  );
};

export default AdminScreen;

const styles = StyleSheet.create({});
