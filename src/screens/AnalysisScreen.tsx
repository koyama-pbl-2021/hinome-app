import React, { useState } from 'react';
import * as Permissions from 'expo-permissions';
import * as MediaLibrary from 'expo-media-library';
import { BarChart } from 'react-native-chart-kit';
import moment from 'moment';
import { Button, View, Dimensions, StyleSheet } from 'react-native';

/* types */
import { RootStackParamList } from '../types/navigation';
import { StackNavigationProp } from '@react-navigation/stack';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'Analysis'>;
};

export const AnalysisScreen: React.FC<Props> = ({ navigation }: Props) => {
  //グラフ用の設定
  const chartConfig = {
    backgroundGradientFrom: 'black',
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: 'black',
    backgroundGradientToOpacity: 0,
    fillShadowGradient: 'gray',
    fillShadowGradientOpacity: 0.7,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    barPercentage: 1,
  };
  const [data, setData] = useState<number[]>([]);
  async function mediaLibraryAsync() {
    let earlymornin = 0;
    let mornin = 0;
    let afternoon = 0;
    let evening = 0;
    let night = 0;
    let total = 0;
    const { status } = await MediaLibrary.requestPermissionsAsync();
    const media = await MediaLibrary.getAssetsAsync({
      mediaType: [MediaLibrary.MediaType.photo],
    });
    //各時間帯を取得
    for (let { creationTime } of media.assets) {
      let number = Number(moment.unix(creationTime).format('h'));
      total += 1;
      if (number > 4 && number < 9) {
        earlymornin += 1;
      } else if (number >= 9 && number < 12) {
        mornin += 1;
      } else if (number >= 9 && number < 12) {
        afternoon += 1;
      } else if (number >= 12 && number < 17) {
        evening += 1;
      } else if (evening >= 17 && number < 24) {
        night += 1;
      }
    }
    const data = [
      earlymornin / total,
      mornin / total,
      afternoon / total,
      evening / total,
      night / total,
    ];
    setData(data);
  }
  const d = {
    labels: ['早朝', '午前', '午後', '夕方', '夜'],
    datasets: [
      {
        data: data,
      },
    ],
  };
  return (
    <View
      style={{
        // このstyleはstylesheetに[from hikimochi]
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Button onPress={mediaLibraryAsync} title="分析" />
      {data && ( // データがあればグラフ表示
        <BarChart
          data={d}
          width={windowWidth * 0.99}
          height={windowHeight / 2}
          yAxisLabel="$"
          yAxisSuffix="%"
          fromZero={true}
          showValuesOnTopOfBars={true}
          chartConfig={{
            backgroundGradientFrom: 'black',
            backgroundGradientFromOpacity: 0,
            backgroundGradientTo: 'black',
            backgroundGradientToOpacity: 0,
            fillShadowGradient: 'gray',
            fillShadowGradientOpacity: 0.7,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            barPercentage: 1,
          }}
        />
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    padding: 10,
  },
  header: {
    textAlign: 'center',
    fontSize: 18,
    padding: 16,
    marginTop: 16,
  },
});
