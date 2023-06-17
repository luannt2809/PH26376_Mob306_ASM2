// import { FlatList, Image, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from "react-native";
// import React, { useEffect, useState } from "react";
// import colors from "../misc/colors";

// const FollowScreen = () => {
//   const [followposts, setfollowposts] = useState([]);
//   const [refreshing, setRefreshing] = useState(false);

//   var api_url_followposts = "http://172.20.10.3:3000/followposts?_sort=id&_order=desc";

//   useEffect(() => {
//     fetch(api_url_followposts)
//       .then((response) => response.json())
//       .then((data) => setfollowposts(data))
//       .catch((error) => console.error(error));
//   }, []);

//   const onRefresh = () => {
//     setRefreshing(true);
//     fetch(api_url_followposts)
//       .then((response) => response.json())
//       .then((data) => setfollowposts(data))
//       .catch((error) => console.error(error));
//     setTimeout(() => {
//       setRefreshing(false);
//     }, 2000);
//   };

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={followposts}
//         keyExtractor={(item) => item.id.toString()}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//         }
//         renderItem={({ item }) => (
//           <View style={styles.containerItem}>
//             <View style={{ flexDirection: "row" }}>
//               <Text style={styles.title}>{item.title}</Text>
//               <TouchableOpacity>
//                 <View style={styles.containerBtnFl}>
//                   <Text style={styles.follow}>Followed</Text>
//                 </View>
//               </TouchableOpacity>
//             </View>
//             <Text style={styles.content}>{item.content}</Text>
//             <Image
//               source={{ uri: item.image }}
//               style={{ width: "100%", height: 300, marginBottom: 10 }}
//             />
//             <View style={{ flexDirection: "row" }}>
//               <Text>{item.id}</Text>
//               <Text style={styles.createdAt}>{item.createdAt}</Text>
//             </View>
//           </View>
//         )}
//       />
//     </View>
//   );
// };

// export default FollowScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     padding: 0,
//   },
//   containerItem: {
//     backgroundColor: "#fff",
//     marginTop: 10,
//     marginHorizontal: 10,
//     borderRadius: 20,
//     padding: 20,
//     marginBottom: 10,
//     shadowColor: "black",
//     shadowOpacity: 0.26,
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 8,
//     elevation: 5,
//   },
//   title: {
//     fontWeight: "bold",
//     fontStyle: "italic",
//     fontSize: 22,
//     marginBottom: 15,
//     flex: 1,
//   },
//   containerBtnFl: {
//     borderWidth: 1,
//     borderColor: colors.GREEN1,
//     alignItems: "center",
//     justifyContent: "center",
//     padding: 10,
//     borderRadius: 10,
//     marginLeft: 10,
//   },
//   follow: {
//     color: colors.GREEN1,
//   },
//   content: {
//     marginBottom: 10,
//     marginTop: 10,
//   },
//   createdAt: {
//     marginLeft: 160,
//     fontStyle: "italic",
//     color: colors.GREY,
//   },
// });

import {
  Alert,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const FollowScreen = () => {
  const [objU, setobjU] = useState({});
  const [fullname, setfullname] = useState("");
  const [avatar, setavatar] = useState(null);
  const [followusers, setfollowusers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  var api_url_followusers =
    "http://172.20.10.3:3000/followusers?userFollowerId=";

  var api_url_ds = "http://172.20.10.3:3000/followusers";
  // var api_url_followusers =
  //   "http://172.20.10.3:3000/followusers?userFollowerId=";

  // var api_url_ds = "http://172.20.10.3:3000/followusers";

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem("login");
      if (value !== null) {
        let obj = JSON.parse(value);
        setobjU(JSON.parse(value));

        fetch(api_url_followusers + obj.id + "&_expand=users")
          .then((res) => res.json())
          .then((data) => {
            setfollowusers(data);
          })
          .catch((err) => console.error(err));
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
    fetch(api_url_followusers + objU.id + "&_expand=users")
      .then((res) => res.json())
      .then((data) => {
        setfollowusers(data);
      })
      .catch((err) => console.error(err));
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const deletFollower = (id) => {
    Alert.alert("Xóa", "Xác nhận xóa?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Confirm",
        onPress: () => {
          fetch(api_url_ds + `/${id}`, {
            method: "DELETE",
          })
            .then((res) => res.json())
            .then((data) => {
              const newFollows = followusers.filter((item) => item.id !== id);
              alert("Unfollowed");
              setfollowusers(newFollows);
            })
            .catch((err) => console.error(err));
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={followusers}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => (
          <View style={styles.containerItem}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image
                source={{ uri: item.users.avatar }}
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 100,
                  marginRight: 10,
                }}
              />
              <Text style={{ flex: 1 }}>{item.users.fullname}</Text>
              <TouchableOpacity style={styles.button} onPress={() => {deletFollower(item.id)}}>
                <Text style={{ color: "#D2042D" }}>Unfollow</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default FollowScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  containerItem: {
    backgroundColor: "#fff",
    marginTop: 10,
    marginHorizontal: 10,
    borderRadius: 20,
    padding: 20,
    marginBottom: 10,
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
  },
  button: {
    borderWidth: 1,
    borderColor: "#D2042D",
    borderRadius: 5,
    padding: 10,
  },
});
