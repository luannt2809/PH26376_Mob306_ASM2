import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import colors from "../misc/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import "react-native-gesture-handler";
import ModalEditPost from "./ModalEditPost";

const PostsOfAdmin = (props) => {
  const [myposts, setmyPosts] = useState([]);
  const [posts, setposts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [idPost, setidPost] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const bottomSheetModalRef = useRef(null);
  const [isOpen, setisOpen] = useState(false);

  const snapPoints = ["28%"];

  var api_url = "http://172.20.10.3:3000/posts?usersId=";
  var api_url_post = "http://172.20.10.3:3000/posts";
  // var api_url = "http://172.20.10.3:3000/posts?usersId=";
  // var api_url_post = "http://172.20.10.3:3000/posts";

  const [objU, setobjU] = useState({});
  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem("login");
      if (value !== null) {
        setobjU(JSON.parse(value));
        let obj = JSON.parse(value);

        fetch(api_url + obj.id + "&_expand=users")
          .then((response) => response.json())
          .then((data) => setmyPosts(data))
          .catch((error) => console.error(error));

        fetch(api_url_post)
          .then((res) => res.json())
          .then((data) => setposts(data))
          .catch((err) => console.error(err));
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getData();
    fetch(api_url + objU.id + "&_expand=users")
      .then((response) => response.json())
      .then((data) => setmyPosts(data))
      .catch((error) => console.error(error));

    // fetch(api_url_post)
    //   .then((res) => res.json())
    //   .then((data) => setposts(data))
    //   .catch((err) => console.error(err));
  }, []);

  //   React.useEffect(() => {
  //     const unsubscribe = props.navigation.addListener("focus", () => {
  //       getData();
  //       fetch(api_url + objU.id + "&_expand=users")
  //         .then((response) => response.json())
  //         .then((data) => setPosts(data))
  //         .catch((error) => console.error(error));
  //     });

  //     return unsubscribe;
  //   }, [props.navigation]);

  //   useFocusEffect(
  //     React.useCallback(() => {
  //       getData();
  //       const fetchMyPosts = () => {
  //         fetch(api_url + objU.id + "&_expand=users")
  //           .then((response) => response.json())
  //           .then((data) => setPosts(data))
  //           .catch((error) => console.error(error));
  //       };

  //       fetchMyPosts()
  //     })
  //   );

  const onRefresh = () => {
    setRefreshing(true);
    fetch(api_url + objU.id + "&_expand=users")
      .then((response) => response.json())
      .then((data) => setmyPosts(data))
      .catch((error) => console.error(error));
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const deletePost = (id) => {
    Alert.alert("Xóa", "Xác nhận xóa?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Confirm",
        onPress: () => {
          fetch(api_url_post + `/${id}`, {
            method: "DELETE",
          })
            .then((res) => res.json())
            .then((data) => {
              const newPosts = posts.filter((item) => item.id !== id);
              alert("Xóa thành công");
              setposts(newPosts);
              setisOpen(false);
            })
            .catch((err) => console.error(err));
        },
      },
    ]);
  };

  return (
    <BottomSheetModalProvider>
      <View style={[styles.container]}>
        <FlatList
          data={myposts}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({ item }) => (
            <View style={styles.containerItem}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <Image
                  source={{ uri: item.users.avatar }}
                  style={{ width: 40, height: 40, borderRadius: 50 }}
                />
                <Text
                  style={{
                    fontWeight: "600",
                    fontSize: 15,
                    marginLeft: 10,
                    flex: 1,
                  }}
                >
                  {item.users.fullname}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    bottomSheetModalRef.current?.present();
                    setidPost(item.id);
                    setTimeout(() => {
                      setisOpen(true);
                    }, 100);
                  }}
                >
                  <Image
                    source={require("../assets/more_asm.png")}
                    style={{ width: 30, height: 30 }}
                  />
                </TouchableOpacity>
              </View>
              <View style={{ flexDirection: "row" }}>
                <Text style={styles.title}>{item.title}</Text>
              </View>
              <Text style={styles.content}>{item.content}</Text>
              <Image
                source={{ uri: item.image }}
                style={{ width: "100%", height: 300, marginBottom: 10 }}
              />
              <View style={{ flexDirection: "row" }}>
                <Text>{item.id}</Text>
                <Text style={styles.createdAt}>{item.createdAt}</Text>
              </View>
            </View>
          )}
        />
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={0}
          snapPoints={snapPoints}
          backgroundStyle={{ borderRadius: 50 }}
          onDismiss={() => {
            setisOpen(false);
          }}
        >
          <View style={{ alignItems: "center" }}>
            <ModalEditPost idPost={idPost} />
            <TouchableOpacity
              style={styles.buttonDelete}
              onPress={() => {
                deletePost(idPost);
              }}
            >
              <Text style={{ color: "white", fontWeight: "bold", padding: 15 }}>
                Delete Posts
              </Text>
            </TouchableOpacity>
          </View>
        </BottomSheetModal>
      </View>
    </BottomSheetModalProvider>
  );
};

export default PostsOfAdmin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 0,
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
  title: {
    fontWeight: "bold",
    fontStyle: "italic",
    fontSize: 22,
    marginBottom: 10,
    marginTop: 10,
    flex: 1,
  },
  containerBtnFl: {
    borderWidth: 1,
    borderColor: colors.BLUE,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 10,
    marginLeft: 10,
  },
  follow: {
    color: colors.BLUE,
  },
  content: {
    marginBottom: 10,
    marginTop: 5,
  },
  createdAt: {
    marginLeft: 160,
    fontStyle: "italic",
    color: colors.GREY,
  },
  buttonDelete: {
    width: "80%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#D2042D",
    borderRadius: 15,
    marginTop: 20,
  },
});
