import React, { useState } from 'react';
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

export const AnalysisScreen: React.FC<Props> = ({}: Props) => {
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
    let earlymorning = 0;
    let morning = 0;
    let afternoon = 0;
    let evening = 0;
    let night = 0;
    let total = 0;
    const media = await MediaLibrary.getAssetsAsync({
      mediaType: [MediaLibrary.MediaType.photo],
    });
    const earlymorningboarder = 9;
    const morningboarder = 12;
    const afternoonboarder = 15;
    const eveningboarder = 18;
    //各時間帯を取得
    for (const { creationTime } of media.assets) {
      const hour = Number(moment.unix(creationTime).format('h'));

      total += 1;
      if (hour < earlymorningboarder) {
        earlymorning += 1;
      } else if (hour < morningboarder) {
        morning += 1;
      } else if (hour < afternoonboarder) {
        afternoon += 1;
      } else if (hour < eveningboarder) {
        evening += 1;
      } else {
        night += 1;
      }
    }
    const data = [
      (earlymorning / total) * 100,
      (morning / total) * 100,
      (afternoon / total) * 100,
      (evening / total) * 100,
      (night / total) * 100,
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
    <View style={styles.container}>
      <Button onPress={mediaLibraryAsync} title="普段撮影する時間帯を算出" />
      {data && ( // データがあればグラフ表示
        <BarChart
          data={d}
          width={windowWidth * 0.99}
          height={windowHeight / 2}
          yAxisLabel=""
          yAxisSuffix="%"
          fromZero={true}
          showValuesOnTopOfBars={false}
          chartConfig={chartConfig}
        />
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    textAlign: 'center',
    fontSize: 18,
    padding: 16,
    marginTop: 16,
  },
});
