import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export const SignUpScreen: React.FC = () => {
  return (
    <LinearGradient
      start={{
        x: 0.31,
        y: 1.1,
      }}
      end={{
        x: 0.69,
        y: -0.1,
      }}
      locations={[0, 1]}
      colors={["rgb(247, 132, 98)", "rgb(139, 27, 140)"]}
      style={styles.signUpViewLinearGradient}
    >
      <View style={styles.signUpView}>
        <Text style={styles.signUpText}>Sign Up</Text>
        <View style={styles.signUpFieldsView}>
          <TextInput
            autoCorrect={false}
            placeholder="Your email"
            style={styles.yourEmailTextInput}
          />
          <View style={styles.separatorView} />
          <TextInput
            autoCorrect={false}
            placeholder="Your password"
            secureTextEntry={true}
            style={styles.yourPasswordTextInput}
          />
        </View>
        <View
          style={{
            flex: 1,
          }}
        />
        <TouchableOpacity onPress={() => {}} style={styles.signUpButton}>
          <Image
            source={require("../../assets/icon-log-in.png")}
            style={styles.signUpButtonImage}
          />
          <Text style={styles.signUpButtonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  navigationBarItemIcon: {
    tintColor: "white",
  },
  navigationBarItem: {},
  headerLeftContainer: {
    flexDirection: "row",
    marginLeft: 8,
  },
  signUpView: {
    width: "100%",
    height: "100%",
    alignItems: "center",
  },
  signUpViewLinearGradient: {
    flex: 1,
  },
  signUpText: {
    backgroundColor: "transparent",
    color: "white",
    fontSize: 42,
    fontStyle: "normal",
    fontWeight: "normal",
    textAlign: "center",
    marginTop: 114,
  },
  signUpFieldsView: {
    backgroundColor: "white",
    borderRadius: 2,
    shadowColor: "rgba(0, 0, 0, 00.20)",
    shadowRadius: 25,
    shadowOpacity: 1,
    alignSelf: "stretch",
    height: 101,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 70,
  },
  yourEmailTextInput: {
    backgroundColor: "transparent",
    padding: 0,
    color: "black",
    fontSize: 15,
    fontStyle: "normal",
    fontWeight: "normal",
    textAlign: "left",
    height: 20,
    marginLeft: 15,
    marginRight: 15,
    marginTop: 14,
  },
  separatorView: {
    backgroundColor: "black",
    opacity: 0.1,
    height: 1,
    marginTop: 16,
  },
  yourPasswordTextInput: {
    backgroundColor: "transparent",
    padding: 0,
    color: "black",
    fontSize: 15,
    fontStyle: "normal",
    fontWeight: "normal",
    textAlign: "left",
    height: 20,
    marginLeft: 15,
    marginRight: 15,
    marginTop: 14,
  },
  signUpButton: {
    backgroundColor: "white",
    borderRadius: 2,
    shadowColor: "rgba(0, 0, 0, 00.20)",
    shadowRadius: 25,
    shadowOpacity: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
    alignSelf: "stretch",
    height: 60,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 11,
  },
  signUpButtonText: {
    color: "rgb(217, 103, 110)",
    fontSize: 15,
    fontStyle: "normal",
    fontWeight: "normal",
    textAlign: "center",
  },
  signUpButtonImage: {
    resizeMode: "contain",
    marginRight: 10,
  },
});
