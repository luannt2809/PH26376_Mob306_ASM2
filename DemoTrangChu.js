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
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import colors from "./misc/colors";

const DemoTrangChu = () => {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [followposts, setfollowposts] = useState([]);

  var api_url =
    "http://172.20.10.3:3000/posts?_sort=id&_order=desc&_expand=users";
  var api_url_followposts = "http://172.20.10.3:3000/followposts";

  useEffect(() => {
    fetch(api_url)
      .then((response) => response.json())
      .then(async (data) => {
        setPosts(data);
      })
      .catch((error) => console.error(error));
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetch(api_url)
      .then((response) => response.json())
      .then((data) => setPosts(data))
      .catch((error) => console.error(error));
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const addFollowPost = async (item) => {
    const response = await fetch(api_url_followposts, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item),
    });
    if (response.ok) {
      alert("Followed");
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
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
                  addFollowPost(item);
                }}
              >
                <View style={styles.containerBtnFl}>
                  <Text style={styles.follow}>Follow +</Text>
                </View>
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
    </View>
  );
};

export default DemoTrangChu;

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
    marginBottom: 15,
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
    marginTop: 10,
  },
  createdAt: {
    marginLeft: 160,
    fontStyle: "italic",
    color: colors.GREY,
  },
});
