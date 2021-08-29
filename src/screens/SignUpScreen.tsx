import React, { useContext, useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StackNavigationProp } from '@react-navigation/stack';
import { useForm, Controller } from 'react-hook-form';
import { AntDesign } from '@expo/vector-icons';
/* components */
import { Loading } from '../components/Loading';
/* contexts */
import { UserContext } from '../contexts/UserContext';
/* lib */
import { signUp } from '../lib/firebase';
/* types */
import { RootStackParamList } from '../types/navigation';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'SignUp'>;
};

type FormData = {
  userName: string;
  email: string;
  password: string;
};

export const SignUpScreen = ({ navigation }: Props) => {
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
    const user = await signUp(d.userName, d.email, d.password);
    setLoading(false);
    if (!user) {
      Alert.alert('登録失敗', 'すでに使われているメールアドレスです', [
        { text: 'OK' },
      ]);
    } else {
      setUser(user);
    }
  };

  const onPressLogIn = () => {
    navigation.pop();
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
      style={styles.signUpViewLinearGradient}
    >
      <View style={styles.signUpView}>
        <Text style={styles.signUpText}>Sign Up</Text>
        <Text style={styles.label}>User Name</Text>
        <Controller
          control={control}
          rules={{
            required: true,
            minLength: 3,
            maxLength: 128,
            pattern: /^[0-9a-zA-Z]*$/,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              value={value}
              onChangeText={(value) => {
                onChange(value);
              }}
              onBlur={onBlur}
              placeholder="Your user name"
              style={styles.textInput}
            />
          )}
          name="userName"
          defaultValue=""
        />
        {errors.userName && errors.userName.type === 'required' && (
          <Text style={styles.errorMessage}>必須項目です</Text>
        )}
        {errors.userName && errors.userName.type === 'minLength' && (
          <Text style={styles.errorMessage}>3文字以上にしてください</Text>
        )}
        {errors.userName && errors.userName.type === 'pattern' && (
          <Text style={styles.errorMessage}>英数字のみしか使えません</Text>
        )}
        <View style={styles.separatorView} />
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
              onChangeText={(value) => {
                onChange(value);
              }}
              onBlur={onBlur}
              placeholder="Your email"
              style={styles.textInput}
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
              onChangeText={(value) => {
                onChange(value);
              }}
              onBlur={onBlur}
              placeholder="Your password"
              secureTextEntry={true}
              style={styles.textInput}
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

        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          style={styles.signUpButton}
        >
          <AntDesign
            name="adduser"
            style={styles.signUpButtonImage}
            size={30}
            color="black"
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={onPressLogIn} style={styles.logInButton}>
          <Text style={styles.logInButtonText}>Log In</Text>
        </TouchableOpacity>
      </View>
      <Loading visible={loading} />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  signUpView: {
    width: '100%',
    height: '100%',
  },
  signUpViewLinearGradient: {
    flex: 1,
  },
  label: {
    color: 'white',
    marginLeft: 20,
  },
  signUpText: {
    backgroundColor: 'transparent',
    color: 'white',
    fontSize: 42,
    fontStyle: 'normal',
    fontWeight: 'normal',
    textAlign: 'center',
    marginTop: 120,
    marginBottom: 50,
  },
  textInput: {
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
  signUpButton: {
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
    height: 70,
    marginLeft: 20,
    marginRight: 20,
    marginTop: Platform.OS === 'android' ? 60 : 200,
  },
  logInButton: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    height: 20,
    marginTop: 10,
    marginBottom: 20,
  },
  logInButtonText: {
    color: 'white',
    fontSize: 15,
    fontStyle: 'normal',
    fontWeight: 'normal',
    textAlign: 'center',
  },
  signUpButtonImage: {
    marginRight: 10,
  },
  errorMessage: {
    fontSize: 15,
    color: 'white',
    textAlign: 'center',
    marginTop: 5,
  },
});
