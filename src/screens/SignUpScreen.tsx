import React, { useContext, useState } from 'react';
import {
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
    const user = await signUp(d.email, d.password);
    setUser(user);
    setLoading(false);
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
        <Controller
          control={control}
          rules={{
            required: true,
            maxLength: 60,
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
        <Controller
          control={control}
          rules={{
            maxLength: 60,
            minLength: 8,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              autoCorrect={false}
              value={value}
              onChangeText={(value) => {
                onChange(value);
              }}
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
    alignItems: 'center',
  },
  signUpViewLinearGradient: {
    flex: 1,
  },
  signUpText: {
    backgroundColor: 'transparent',
    color: 'white',
    fontSize: 42,
    fontStyle: 'normal',
    fontWeight: 'normal',
    textAlign: 'center',
    marginTop: 120,
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
    marginTop: 70,
  },
  separatorView: {
    backgroundColor: 'black',
    opacity: 0.1,
    height: 20,
    marginTop: 20,
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
    marginTop: 200,
  },
  logInButton: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    width: 150,
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
    color: 'red',
  },
});
