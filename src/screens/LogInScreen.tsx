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
import { logIn } from "../lib/firebase";
/* types */
import { RootStackParamList } from "../types/navigation";

type Props = {
  navigation: StackNavigationProp<RootStackParamList, "SignUp">;
};

export const LogInScreen = ({ navigation }: Props) => {
  const { setUser } = useContext(UserContext);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = async () => {
    setLoading(true);
    const user = await logIn(email, password);
    setUser(user);
    console.log(user);
    setLoading(false);
  };

  const onPressSignUp = () => {
    navigation.navigate("SignUp");
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
      style={styles.loginViewLinearGradient}
    >
      <View style={styles.loginView}>
        <Text style={styles.logInText}>Log in</Text>
        <Text style={styles.welcomeBackText}>
          Welcome back.{"\n"}Hinome awaits you.
        </Text>
        <View style={styles.loginFieldsView}>
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
        <TouchableOpacity onPress={onSubmit} style={styles.loginButton}>
          <Image
            source={require("../../assets/icon-log-in.png")}
            style={styles.loginButtonImage}
          />
          <Text style={styles.loginButtonText}>LOG IN</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {}}
          style={styles.forgotYourPasswordButton}
        >
          <Text style={styles.forgotYourPasswordButtonText}>
            Forgot your password?
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onPressSignUp} style={styles.signUpButton}>
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
  loginView: {
    width: "100%",
    height: "100%",
    alignItems: "center",
  },
  loginViewLinearGradient: {
    flex: 1,
  },
  logInText: {
    backgroundColor: "transparent",
    color: "white",
    fontSize: 42,
    fontStyle: "normal",
    fontWeight: "normal",
    textAlign: "center",
    marginTop: 114,
  },
  welcomeBackText: {
    color: "white",
    fontSize: 18,
    fontStyle: "normal",
    fontWeight: "normal",
    textAlign: "center",
    backgroundColor: "transparent",
    marginTop: 20,
  },
  loginFieldsView: {
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
  loginButton: {
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
  loginButtonText: {
    color: "rgb(217, 103, 110)",
    fontSize: 15,
    fontStyle: "normal",
    fontWeight: "normal",
    textAlign: "center",
  },
  loginButtonImage: {
    resizeMode: "contain",
    marginRight: 10,
  },
  forgotYourPasswordButton: {
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
    width: 150,
    height: 18,
    marginBottom: 19,
  },
  forgotYourPasswordButtonText: {
    color: "white",
    fontSize: 15,
    fontStyle: "normal",
    fontWeight: "normal",
    textAlign: "center",
  },
  forgotYourPasswordButtonImage: {
    resizeMode: "contain",
    marginRight: 10,
  },
  signUpButton: {
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
    width: 150,
    height: 18,
    marginBottom: 19,
  },
  signUpButtonText: {
    color: "white",
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
