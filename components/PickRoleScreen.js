import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import colors from "../misc/colors";

const PickRoleScreen = (props) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => props.navigation.navigate("SignUpAdmin")}
      >
        <View>
          <Text>Create Admin Account</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => props.navigation.navigate("SignUpUser")}
      >
        <View>
          <Text>Create User Account</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default PickRoleScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  btn: {
    padding: 15,
    color: colors.BLUE1,
  },
});
