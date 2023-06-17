import {
  Text,
  StyleSheet,
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Image,
} from "react-native";
import React from "react";
import { useState } from "react";
import * as Animatable from "react-native-animatable";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";

const SignUpUserScreen = (props) => {
  const [data, setData] = React.useState({
    email: "",
    password: "",
    confirm_password: "",
    fullname: "",
    check_textInputChange: false,
    secureTextEntry: true,
    confirm_secureTextEntry: true,
  });

  const [username, setusername] = useState("");
  const [passwd, setpasswd] = useState("");
  const [confirmPasswd, setconfirmPasswd] = useState("");
  const [fullname, setfullname] = useState("");
  const [role, setrole] = useState("user");

  const textInputChange = (val) => {
    if (val.length != 0) {
      setData({
        ...data,
        email: val,
        check_textInputChange: true,
      });
    } else {
      setData({
        ...data,
        email: val,
        check_textInputChange: false,
      });
    }
    setusername(val);
  };

  const textInputChange1 = (val) => {
    if (val.length != 0) {
      setData({
        ...data,
        fullname: val,
        check_textInputChange: true,
      });
    } else {
      setData({
        ...data,
        fullname: val,
        check_textInputChange: false,
      });
    }
    setfullname(val);
  };

  const handlePasswordChange = (val) => {
    setData({
      ...data,
      password: val,
    });
    setpasswd(val);
  };

  const handleConfirmPasswordChange = (val) => {
    setData({
      ...data,
      confirm_password: val,
    });
    setconfirmPasswd(val);
  };

  const updateSecureTextEntry = () => {
    setData({
      ...data,
      secureTextEntry: !data.secureTextEntry,
    });
  };

  const updateConfirmSecureTextEntry = () => {
    setData({
      ...data,
      confirm_secureTextEntry: !data.confirm_secureTextEntry,
    });
  };

  var api_url = "http://172.20.10.3:3000/users";

  const handleSignUp = async () => {
    if (username.length == 0) {
      alert("Vui lòng nhập username");
      return;
    }
    if (passwd.length == 0) {
      alert("Vui lòng nhập password");
      return;
    }
    if (fullname.length == 0) {
      alert("Vui lòng nhập họ tên");
      return;
    }

    fetch("http://172.20.10.3:3000/users?username=" + username)
      .then((res) => res.json())
      .then(async (data) => {
        if (data.length > 0) {
          alert("Username đã tồn tại");
          return;
        } else {
          const response = await fetch(api_url, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: username,
              passwd: confirmPasswd,
              fullname: fullname,
              role: role,
              // avatar: avatar,
            }),
          });
          if (response.ok) {
            alert("Đăng ký thành công");
            // setavatar(null);
            setusername("");
            setpasswd("");
            setconfirmPasswd("");
            setfullname("");
          }
        }
      });

    // try {
    //   const res = await fetch(url_check_login);
    //   const data = await res.json();
    //   if (data.length != 1) {
    //     alert("Username đã tồn tại");
    //     return;
    //   }
    // } catch (err) {
    //   console.error(err);
    // }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={{ flexDirection: "row" }}>
          <Text style={styles.text_header}>Create User Account!</Text>
          {/* <TouchableOpacity activeOpacity={0.5} onPress={pickImage}>
              {avatar ? (
                <Image
                  source={{ uri: avatar }}
                  style={{ width: 100, height: 100, borderRadius: 50 }}
                />
              ) : (
                <Image
                  source={require("../assets/addavatarr.png")}
                  style={{ width: 100, height: 100, tintColor: "white" }}
                />
              )}
            </TouchableOpacity> */}
        </View>
      </View>
      <View style={styles.footer}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
          <ScrollView>
            <Text style={styles.text_footer}>Username</Text>
            <View style={styles.action}>
              <FontAwesome name="user-o" color="#05375a" size={20} />
              <TextInput
                placeholder="Your Username"
                style={styles.textInput}
                autoCapitalize="none"
                onChangeText={textInputChange}
                value={username}
              />
              {data.check_textInputChange ? (
                <Animatable.View animation="bounceIn">
                  <Feather name="check-circle" color="green" size={20} />
                </Animatable.View>
              ) : null}
            </View>
            <Text style={[styles.text_footer, { marginTop: 35 }]}>
              Password
            </Text>
            <View style={styles.action}>
              <FontAwesome name="lock" color="#05375a" size={20} />
              <TextInput
                placeholder="Your Password"
                style={styles.textInput}
                autoCapitalize="none"
                secureTextEntry={data.secureTextEntry ? true : false}
                onChangeText={(val) => handlePasswordChange(val)}
                value={passwd}
              />
              <TouchableOpacity onPress={updateSecureTextEntry}>
                {data.secureTextEntry ? (
                  <Feather name="eye-off" color="grey" size={20} />
                ) : (
                  <Feather name="eye" color="grey" size={20} />
                )}
              </TouchableOpacity>
            </View>
            <Text style={[styles.text_footer, { marginTop: 35 }]}>
              Confirm Password
            </Text>
            <View style={styles.action}>
              <FontAwesome name="lock" color="#05375a" size={20} />
              <TextInput
                placeholder="Your Password"
                style={styles.textInput}
                autoCapitalize="none"
                secureTextEntry={data.confirm_secureTextEntry ? true : false}
                onChangeText={(val) => handleConfirmPasswordChange(val)}
                value={confirmPasswd}
              />
              <TouchableOpacity onPress={updateConfirmSecureTextEntry}>
                {data.secureTextEntry ? (
                  <Feather name="eye-off" color="grey" size={20} />
                ) : (
                  <Feather name="eye" color="grey" size={20} />
                )}
              </TouchableOpacity>
            </View>
            {passwd !== confirmPasswd && (
              <Text style={{ color: "red" }}>
                Mật khẩu không trùng khớp
              </Text>
            )}
            <Text style={[styles.text_footer, { marginTop: 35 }]}>
              Fullname
            </Text>
            <View style={styles.action}>
              <FontAwesome name="user-o" color="#05375a" size={20} />
              <TextInput
                placeholder="Your Fullname"
                style={styles.textInput}
                autoCapitalize="none"
                onChangeText={textInputChange1}
                value={fullname}
              />
              {data.check_textInputChange ? (
                <Animatable.View animation="bounceIn">
                  <Feather name="check-circle" color="green" size={20} />
                </Animatable.View>
              ) : null}
            </View>
            <View style={{ marginHorizontal: 50 }}>
              <TouchableOpacity style={styles.signIn} onPress={handleSignUp}>
                <Text
                  style={{ fontSize: 17, color: "white", fontWeight: "bold" }}
                >
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: "row",
                marginTop: 30,
                justifyContent: "center",
              }}
            >
              <Text>You had an account? </Text>
              <TouchableOpacity
                onPress={() => {
                  props.navigation.navigate("Login");
                }}
              >
                <Text style={{ color: "#23B4D2", fontSize: 14 }}>Login</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};

export default SignUpUserScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#23B4D2",
  },
  header: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  footer: {
    flex: 4,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  text_header: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 30,
    flex: 1,
    height: "100%",
  },
  text_footer: {
    color: "#000",
    fontSize: 18,
  },
  action: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: 0,
    paddingLeft: 10,
    color: "#05375a",
  },
  signIn: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#23B4D2",
    marginTop: 30,
    padding: 15,
  },
});
