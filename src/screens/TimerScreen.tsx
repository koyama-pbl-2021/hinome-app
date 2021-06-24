import React, { useRef } from "react";
import { SafeAreaView, StyleSheet, Button } from "react-native";
import { Camera as ExpoCamera } from "expo-camera";
import CountDown from "react-native-countdown-component";
import { upLoadImg } from "../lib/firebase";

export const TimerScreen: React.FC = () => {

  const cameraRef = useRef(null);

  const snap = async () => {
    if (cameraRef) {
      const { uri } = await cameraRef.current.takePictureAsync(); // uriはローカルイメージURIで一時的にローカルに保存される
      const response = await fetch(uri);
      const blob = await response.blob();
      const imgName = blob.data.name;
      // console.log(blob.data.name);
      upLoadImg(imgName, blob).then((url) => {
        console.log(url);
      });
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <ExpoCamera ref={cameraRef}>
        <Button onPress={() => snap()} title="Press Me"></Button>
        <CountDown
          until={+10}
          size={30}
          onFinish={() => snap()}
          digitStyle={{ backgroundColor: "#FFF" }}
          digitTxtStyle={{ color: "#1CC625" }}
          timeToShow={["S"]}
        />
      </ExpoCamera>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    padding: 20,
  },
  button: {
    position: "absolute",
    bottom: 100,
    zIndex: 1,
    alignSelf: "center",
    height: 80,
    width: 80,
    flex: 1,
    justifyContent: "center",
  },
});

export default TimerScreen;
