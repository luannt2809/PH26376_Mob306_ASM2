import {
  Image,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import AsyncStorage from "@react-native-async-storage/async-storage";
import colors from "../misc/colors";

const ModalEditPost = (props) => {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [avatar, setavatar] = useState("");
  const [fullname, setfullname] = useState("");
  const [showModal, setshowModal] = useState(false);
  const [objU, setobjU] = useState({});

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem("login");
      if (value !== null) {
        setobjU(JSON.parse(value));
      }
    } catch (e) {
      console.log(e);
    }
  };

  var api_url = "http://172.20.10.3:3000/posts";
  // var api_url = "http://172.20.10.3:3000/posts";

  useEffect(() => {
    getData();
    fetch(api_url + `/${props.idPost}` + "?_expand=users")
      .then((res) => res.json())
      .then((data) => {
        setTitle(data.title),
          setContent(data.content),
          setImage(data.image),
          setavatar(data.users.avatar),
          setfullname(data.users.fullname);
      })
      .catch((err) => console.error(err));
  }, []);

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

  const updatePost = () => {
    // if (fullname.length == 0) {
    //   alert("Vui lòng nhập họ và tên");
    //   return;
    // } else if (phone.length == 0) {
    //   alert("Vui lòng nhập số điện thoại");
    //   return;
    // } else if (email.length == 0) {
    //   alert("Vui lòng nhập email");
    //   return;
    // }
    fetch(api_url + `/${props.idPost}` + "?_expand=users", {
      method: "PUT",
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
      .then((res) => {
        if (res.status === 200 || res.status === 204) {
          alert("Sửa thành công");
          setTitle("");
          setContent("");
          setImage("");
          setshowModal(false);
        } else {
          alert("Sửa thất bại");
        }
      })
      .catch((err) => console.error(err));
  };

  return (
    <View style={{ width: "100%" }}>
      <Modal
        animationType="slide"
        transparent={false}
        visible={showModal}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setshowModal(!showModal);
        }}
      >
        <SafeAreaView>
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 10,
              paddingVertical: 10,
              alignItems: "center",
              borderTopColor: "transparent",
              borderLeftColor: "transparent",
              borderRightColor: "transparent",
              borderBottomColor: "#F0F0F0",
              borderWidth: 1,
            }}
          >
            <TouchableOpacity
              style={{ flex: 0.85 }}
              onPress={() => setshowModal(false)}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 24,
                  color: "#C0C0C0",
                }}
              >
                X
              </Text>
            </TouchableOpacity>
            <Text style={{ flex: 1, fontWeight: "500", fontSize: 18 }}>
              Edit Post
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: colors.BLUE,
                justifyContent: "center",
                alignItems: "center",
                padding: 12,
                borderRadius: 10,
              }}
              onPress={updatePost}
              activeOpacity={0.5}
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>Save</Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 10,
              alignItems: "center",
              marginTop: 10,
            }}
          >
            {avatar ? (
              <Image
                source={{ uri: avatar }}
                style={{ width: 40, height: 40, borderRadius: 50 }}
              />
            ) : (
              <Image
                source={require("../assets/profile.png")}
                style={{ width: 40, height: 40 }}
              />
            )}
            <Text
              style={{
                fontWeight: "600",
                fontSize: 15,
                marginLeft: 10,
                flex: 1,
              }}
            >
              {fullname}
            </Text>
          </View>
          <View>
            <TextInput
              placeholder="Tiêu đề bài viết"
              value={title}
              style={styles.title}
              onChangeText={(title) => setTitle(title)}
            />
            {/* <View style={{ flex: 1 }}> */}
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
            {/* </View> */}
            {/* </View> */}
          </View>
        </SafeAreaView>
      </Modal>
      <View style={{ alignItems: "center" }}>
        <TouchableOpacity
          style={styles.buttonEdit}
          onPress={() => setshowModal(true)}
        >
          <Text style={{ color: "white", fontWeight: "bold", padding: 15 }}>
            Edit Post
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ModalEditPost;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
  },
  modalView: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
    flex: 1,
    width: 60,
    height: 60,
    position: "absolute",
    bottom: 30,
    right: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  textInput: {
    width: "100%",
    borderWidth: 1,
    borderTopColor: "transparent",
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#808080",
    marginTop: 10,
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  buttonSave: {
    flex: 1,
    backgroundColor: "#35B9F9",
    marginLeft: 10,
  },
  buttonClose: {
    flex: 1,
    backgroundColor: "#FF8C00",
    marginRight: 10,
  },
  buttonEdit: {
    width: "80%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF8C00",
    borderRadius: 15,
    marginTop: 20,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
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
});
