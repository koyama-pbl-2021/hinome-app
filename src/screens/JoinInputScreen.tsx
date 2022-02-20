import React, { useContext } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useForm, Controller } from 'react-hook-form';
/* lib */
import {
  getGroupByCode,
  addGroupUser,
  addGroupToUserCollection,
} from '../lib/firebase';
/* components */
import { WalkthroughModal } from '../components/WalkthroughModal';
/* contexts */
import { UserContext } from '../contexts/UserContext';
import { GroupContext } from '../contexts/GroupContext';
import { VisibleWalkthroughContext } from '../contexts/VisibleWalkthroughContext';
/* types */
import { RootStackParamList } from '../types/navigation';
import { StackNavigationProp } from '@react-navigation/stack';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'JoinInput'>;
};

type FormData = {
  userName: string;
  groupCode: string;
};

export const JoinInputScreen: React.FC<Props> = ({ navigation }: Props) => {
  const { user } = useContext(UserContext);
  const { group, setGroup } = useContext(GroupContext);
  const { visibleWalkthrough, setVisibleWalkthrough } = useContext(
    VisibleWalkthroughContext
  );
  // for validation
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onNext = async (d: FormData) => {
    const group = getGroupByCode(d.groupCode);
    group
      .then((query) => {
        query.forEach((doc) => {
          addGroupUser(doc.id, d.userName);
          const data = doc.data();
          const group = addGroupToUserCollection(
            user.id,
            doc.id,
            data.name,
            data.code
          );
          setGroup(group);
        });
      })
      .then(() => {
        navigation.navigate('WaitHost');
      });
  };

  const dismissWalkthroughModal = async () => {
    setVisibleWalkthrough(false);
  };

  // アルバムオブジェクトの有無で日の目画面を変更する
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
      style={styles.viewLinearGradient}
    >
      <SafeAreaView style={styles.container}>
        <WalkthroughModal
          visible={visibleWalkthrough}
          dismissModal={dismissWalkthroughModal}
        />
        <View style={styles.startContainer}>
          <Controller
            control={control}
            rules={{
              required: true,
              minLength: 3,
              maxLength: 128,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.userNameInput}
                value={value}
                onChangeText={(value) => {
                  onChange(value);
                }}
                onBlur={onBlur}
                placeholder="ユーザ名を入力してください"
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
          <Controller
            control={control}
            rules={{
              required: true,
              minLength: 3,
              maxLength: 128,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.groupCodeInput}
                value={value}
                onChangeText={(value) => {
                  onChange(value);
                }}
                onBlur={onBlur}
                placeholder="コードを入力してください"
              />
            )}
            name="groupCode"
            defaultValue=""
          />
          {errors.groupCode && errors.groupCode.type === 'required' && (
            <Text style={styles.errorMessage}>必須項目です</Text>
          )}
          {errors.groupCode && errors.groupCode.type === 'minLength' && (
            <Text style={styles.errorMessage}>3文字以上にしてください</Text>
          )}
          <TouchableOpacity
            onPress={handleSubmit(onNext)}
            style={styles.nextButton}
          >
            <Text style={styles.nextButtonText}>参加</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  viewLinearGradient: {
    flex: 1,
  },
  startContainer: {
    marginTop: 40,
  },
  settingContainer: {
    top: '50%',
  },
  userNameInput: {
    backgroundColor: 'white',
    borderRadius: 20,
    justifyContent: 'center',
    padding: 20,
    height: 60,
    marginTop: 50,
    marginLeft: 50,
    marginRight: 50,
    marginBottom: 20,
  },
  groupCodeInput: {
    backgroundColor: 'white',
    borderRadius: 20,
    justifyContent: 'center',
    padding: 20,
    height: 60,
    marginTop: 20,
    marginLeft: 50,
    marginRight: 50,
    marginBottom: 20,
  },
  nextButton: {
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: 'rgba(0, 0, 0, 00.20)',
    shadowRadius: 25,
    shadowOpacity: 1,
    justifyContent: 'center',
    padding: 0,
    height: 60,
    marginLeft: 50,
    marginRight: 50,
    marginBottom: 20,
  },
  nextButtonText: {
    color: 'rgb(217, 103, 110)',
    fontSize: 30,
    fontFamily: 'MPLUS1p_400Regular',
    fontStyle: 'normal',
    fontWeight: 'normal',
    textAlign: 'center',
  },
  container: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  errorMessage: {
    fontSize: 15,
    color: 'white',
    textAlign: 'center',
    marginTop: 0,
    marginBottom: 20,
  },
});
