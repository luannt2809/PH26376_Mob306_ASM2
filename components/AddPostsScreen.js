import {
  Image,
  KeyboardAvoidingView,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import colors from "../misc/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";

const AddPostsScreen = (props) => {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [objU, setobjU] = useState({});
  const [fullname, setfullname] = useState("");
  const [avatar, setavatar] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  var api_url_users = "http://172.20.10.3:3000/users/";
  // var api_url_users = "http://172.20.10.3:3000/users/";

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem("login");
      if (value !== null) {
        setobjU(JSON.parse(value));
        let obj = JSON.parse(value);

        fetch(api_url_users + obj.id)
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

  const onRefresh = () => {
    setRefreshing(true);
    getData();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  var api_url = "http://172.20.10.3:3000/posts";
  // var api_url = "http://172.20.10.3:3000/posts";

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      let _uri = result.assets[0].uri;
      let file_ext = _uri.substring(_uri.lastIndexOf(".") + 1);

      FileSystem.readAsStringAsync(result.assets[0].uri, {
        encoding: "base64",
      }).then((res) => {
        setImage("data:image/" + file_ext + ";base64," + res);
      });
    }
  };

  const uploadPost = () => {
    if (title.length == 0) {
      alert("Bạn chưa nhập tiêu đề");
      return;
    }
    if (content.length == 0) {
      alert("Bạn chưa nhập nội dung");
      return;
    }
    fetch(api_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
        content: content,
        image: image,
        usersId: objU.id,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setPosts([...posts, data]);
        setTitle("");
        setContent("");
        setImage("");
        alert("Đăng bài thành công");
      })
      .catch((error) => console.error(error));
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "white" }}
      behavior="padding"
    >
      <ScrollView>
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        <View style={styles.container}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 15,
              paddingVertical: 10,
            }}
          >
            <Image
              source={{ uri: avatar }}
              style={{
                width: 50,
                height: 50,
                borderRadius: 50,
                marginRight: 10,
              }}
            />
            <Text style={{ fontWeight: "600", fontSize: 16 }}>{fullname}</Text>
          </View>
          <TextInput
            placeholder="Tiêu đề bài viết"
            value={title}
            style={styles.title}
            onChangeText={(title) => setTitle(title)}
          />
          <View style={{ flex: 1 }}>
            <TextInput
              placeholder="Hãy viết gì đó với bức ảnh"
              value={content}
              multiline={true}
              style={styles.content}
              onChangeText={(content) => setContent(content)}
            />
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={pickImage}
              style={{ alignItems: "center", paddingHorizontal: 10 }}
            >
              {image ? (
                <Image
                  source={{ uri: image }}
                  style={{ width: "100%", height: 300 }}
                />
              ) : (
                <Image
                  source={require("../assets/uploadimage.png")}
                  style={{ width: 100, height: 100 }}
                />
              )}
            </TouchableOpacity>
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <TouchableOpacity
                style={styles.btnSave}
                activeOpacity={0.7}
                onPress={uploadPost}
              >
                <Text
                  style={{ color: "white", fontWeight: "bold", fontSize: 16 }}
                >
                  Save Post
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AddPostsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  title: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomColor: colors.GREY,
    fontSize: 18,
  },
  content: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  btnSave: {
    backgroundColor: colors.ORANGE,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 50,
    paddingVertical: 20,
    marginTop: 30,
    borderRadius: 20,
  },
});
