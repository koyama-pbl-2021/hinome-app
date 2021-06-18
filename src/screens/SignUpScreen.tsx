import React, { useContext, useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StackNavigationProp } from "@react-navigation/stack";
/* components */
import { Loading } from "../components/Loading";
/* contexts */
import { UserContext } from "../contexts/UserContext";
/* lib */
import { signUp } from "../lib/firebase";
/* types */
import { RootStackParamList } from "../types/navigation";

type Props = {
  navigation: StackNavigationProp<RootStackParamList, "SignUp">;
};

export const SignUpScreen = ({ navigation }: Props) => {
  const { setUser } = useContext(UserContext);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = async () => {
    setLoading(true);
    const user = await signUp(email, password);
    setUser(user);
    console.log(user);
    setLoading(false);
  };
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
            value={email}
            onChangeText={(text) => {
              setEmail(text);
            }}
            placeholder="Your email"
            style={styles.yourEmailTextInput}
          />
          <View style={styles.separatorView} />
          <TextInput
            autoCorrect={false}
            value={password}
            onChangeText={(text) => {
              setPassword(text);
            }}
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
        <TouchableOpacity onPress={onSubmit} style={styles.signUpButton}>
          <Image
            source={require("../../assets/icon-log-in.png")}
            style={styles.signUpButtonImage}
          />
          <Text style={styles.signUpButtonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
      <Loading visible={loading} />
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
