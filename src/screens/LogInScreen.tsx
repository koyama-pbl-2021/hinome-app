import React, { useContext, useState } from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StackNavigationProp } from '@react-navigation/stack';
import { useForm, Controller } from 'react-hook-form';
/* components */
import { Loading } from '../components/Loading';
/* contexts */
import { UserContext } from '../contexts/UserContext';
/* lib */
import { logIn } from '../lib/firebase';
/* types */
import { RootStackParamList } from '../types/navigation';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'SignUp'>;
};

type FormData = {
  email: string;
  password: string;
};

export const LogInScreen = ({ navigation }: Props) => {
  const { setUser } = useContext(UserContext);
  const [loading, setLoading] = useState<boolean>(false);
  // for validation
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (d: FormData) => {
    setLoading(true);
    const user = await logIn(d.email, d.password);
    setLoading(false);
    setUser(user);
    // Alertダサいので変えたい
    if (!user) {
      Alert.alert(
        'ログイン失敗',
        'メールアドレスもしくはパスワードが違います',
        [{ text: 'OK' }]
      );
    }
  };

  const onPressSignUp = () => {
    navigation.navigate('SignUp');
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
      colors={['rgb(247, 132, 98)', 'rgb(139, 27, 140)']}
      style={styles.loginViewLinearGradient}
    >
      <View style={styles.loginView}>
        <Text style={styles.logInText}>Log in</Text>
        <Text style={styles.label}>Email</Text>
        <Controller
          control={control}
          rules={{
            required: true,
            maxLength: 128,
            pattern:
              /^[a-zA-Z0-9_+-]+(.[a-zA-Z0-9_+-]+)*@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              value={value}
              onChangeText={(value) => onChange(value)}
              onBlur={onBlur}
              placeholder="Your email"
              style={styles.emailTextInput}
            />
          )}
          name="email"
          defaultValue=""
        />
        {errors.email && errors.email.type === 'required' && (
          <Text style={styles.errorMessage}>必須項目です</Text>
        )}
        {errors.email && errors.email.type === 'pattern' && (
          <Text style={styles.errorMessage}>適切な形式で入力してください</Text>
        )}
        <View style={styles.separatorView} />
        <Text style={styles.label}>Password</Text>
        <Controller
          control={control}
          rules={{
            required: true,
            maxLength: 256,
            minLength: 8,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              value={value}
              onChangeText={(value) => onChange(value)}
              onBlur={onBlur}
              placeholder="Your password"
              secureTextEntry={true}
              style={styles.passwordTextInput}
            />
          )}
          name="password"
          defaultValue=""
        />
        {errors.password && errors.password.type === 'required' && (
          <Text style={styles.errorMessage}>必須項目です</Text>
        )}
        {errors.password && errors.password.type === 'minLength' && (
          <Text style={styles.errorMessage}>8文字以上にしてください</Text>
        )}
        <View
          style={{
            flex: 1,
          }}
        />
        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          style={styles.loginButton}
        >
          <Image
            source={require('../../assets/icon-log-in.png')}
            style={styles.loginButtonImage}
          />
          <Text style={styles.loginButtonText}>LOG IN</Text>
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
  loginView: {
    width: '100%',
    height: '100%',
  },
  loginViewLinearGradient: {
    flex: 1,
  },
  label: {
    color: 'white',
    marginLeft: 20,
  },
  logInText: {
    backgroundColor: 'transparent',
    color: 'white',
    fontSize: 42,
    fontStyle: 'normal',
    fontWeight: 'normal',
    textAlign: 'center',
    marginTop: 120,
    marginBottom: 50,
  },
  emailTextInput: {
    backgroundColor: 'white',
    padding: 0,
    borderRadius: 10,
    color: 'black',
    fontSize: 15,
    fontStyle: 'normal',
    fontWeight: 'normal',
    textAlign: 'left',
    alignSelf: 'stretch',
    height: 50,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
  },
  separatorView: {
    opacity: 0.1,
    height: 10,
    marginTop: 10,
  },
  passwordTextInput: {
    backgroundColor: 'white',
    padding: 0,
    borderRadius: 10,
    color: 'black',
    fontSize: 15,
    fontStyle: 'normal',
    fontWeight: 'normal',
    textAlign: 'left',
    alignSelf: 'stretch',
    height: 50,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
  },
  loginButton: {
    backgroundColor: 'white',
    borderRadius: 2,
    shadowColor: 'rgba(0, 0, 0, 00.20)',
    shadowRadius: 25,
    shadowOpacity: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    alignSelf: 'stretch',
    height: 60,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 10,
  },
  loginButtonText: {
    color: 'rgb(217, 103, 110)',
    fontSize: 15,
    fontStyle: 'normal',
    fontWeight: 'normal',
    textAlign: 'center',
  },
  loginButtonImage: {
    resizeMode: 'contain',
    marginRight: 10,
  },
  forgotYourPasswordButton: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    height: 20,
    marginBottom: 20,
  },
  forgotYourPasswordButtonText: {
    color: 'white',
    fontSize: 15,
    fontStyle: 'normal',
    fontWeight: 'normal',
    textAlign: 'center',
  },
  forgotYourPasswordButtonImage: {
    resizeMode: 'contain',
    marginRight: 10,
  },
  signUpButton: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    height: 20,
    marginBottom: 20,
  },
  signUpButtonText: {
    color: 'white',
    fontSize: 15,
    fontStyle: 'normal',
    fontWeight: 'normal',
    textAlign: 'center',
  },
  signUpButtonImage: {
    resizeMode: 'contain',
    marginRight: 10,
  },
  errorMessage: {
    fontSize: 15,
    color: 'white',
    textAlign: 'center',
    marginTop: 5,
  },
});
