import React, { useContext, useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Button } from "react-native";
import { Camera } from "expo-camera";
import { Timer } from "../components/Timer";
import { getExetention } from "../utils/file";
import { Audio } from "expo-av";
import { UserContext } from "../contexts/UserContext";
import { upLoadImg } from "../lib/firebase";

export const CameraScreen: React.FC = () => {
  const cameraRef = useRef(null);
  const { user } = useContext(UserContext);
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  const snap = async () => {
    if (cameraRef) {
      const { uri } = await cameraRef.current.takePictureAsync(); // uriはローカルイメージURIで一時的にローカルに保存される
      const ext = getExetention(uri);
      const storagePath = `users/${user.id}/0/0.${ext}`;
      const downloadUrl = await upLoadImg(uri, storagePath);
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Camera ref={cameraRef} style={styles.camera} type={type}>
          <Timer onFinish={snap} />
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}
          >
            <Text style={styles.text}> Flip </Text>
          </TouchableOpacity>
        </Camera>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "row",
    margin: 20,
  },
  button: {
    flex: 0.1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    color: "white",
  },
});
