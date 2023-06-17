import { FlatList, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { WebView } from "react-native-webview";
import YoutubeIframe from "react-native-youtube-iframe";

const VideosScreen = () => {
  const [videos, setvideos] = useState([]);

  var api_url = "http://172.20.10.3:3000/videos";
  // var api_url = "http://172.20.10.3:3000/videos";

  const getData = () => {
    fetch(api_url)
      .then((response) => response.json())
      .then(async (data) => {
        setvideos(data);
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={videos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.containerItem}>
            <YoutubeIframe
              height={200}
              width={"100%"}
              play={false}
              videoId={item.linkvideo}
            />
          </View>
        )}
      />
    </View>
  );
};

export default VideosScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
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
});
