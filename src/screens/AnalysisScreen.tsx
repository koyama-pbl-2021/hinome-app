import React, { useState } from 'react';
import * as MediaLibrary from 'expo-media-library';
import { BarChart } from 'react-native-chart-kit';
import moment from 'moment';
import { LinearGradient } from 'expo-linear-gradient';
import { Loading } from '../components/Loading';

import {
  View,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';

/* types */
import { RootStackParamList } from '../types/navigation';
import { StackNavigationProp } from '@react-navigation/stack';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'Analysis'>;
};

export const AnalysisScreen: React.FC<Props> = () => {
  const [loading, setLoading] = useState<boolean>(false);

  //グラフ用の設定
  const chartConfig = {
    backgroundGradientFrom: 'black',
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: 'black',
    backgroundGradientToOpacity: 0,
    fillShadowGradient: 'white',
    fillShadowGradientOpacity: 0.7,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    barPercentage: 1,
  };
  const [data, setData] = useState<number[]>([]);
  async function mediaLibraryAsync() {
    setLoading(true);

    await MediaLibrary.requestPermissionsAsync();
    const media = await MediaLibrary.getAssetsAsync({
      mediaType: [MediaLibrary.MediaType.photo],
    });

    // 時間帯の境界
    const earlymorningbar = 4;
    const morningbar = 8;
    const noonbar = 11;
    const eveningboarder = 15;
    const nightboarder = 19;
    const midnightboarder = 23;

    // 変数初期化 (時間帯)
    let earlymorning = 0;
    let morning = 0;
    let afternoon = 0;
    let evening = 0;
    let night = 0;
    let midnight = 0;
    let total = 0;

    // 変数初期化 (GPS)
    const gpslatarr = [];
    const gpslonarr = [];
    let latcur = 0;
    let latmax = 0;
    let loncur = 0;
    let lonmax = 0;
    const londistance = 0.1;
    const latdistance = 0.1;

    //普段の場所を算出
    for (const cur of media.assets) {
      const mediainfo = await MediaLibrary.getAssetInfoAsync(cur);
      try {
        gpslatarr.push(mediainfo.exif['{GPS}'].Latitude.toFixed(1));
        gpslonarr.push(mediainfo.exif['{GPS}'].Longtitude.toFixed(1));
      } catch {
        console.log('no gps');
      }
    }

    for (const lat of gpslatarr) {
      const latlength = gpslatarr.filter(function (x) {
        return x == lat;
      }).length;
      if (latlength > latmax) {
        latcur = Number(lat);
        latmax = latlength;
      }
    }

    for (const lon of gpslonarr) {
      const lonlength = gpslonarr.filter(function (x) {
        return x == lon;
      }).length;
      if (lonlength > lonmax) {
        loncur = Number(lon);
        lonmax = lonlength;
      }
    }

    //各時間帯を取得
    for (const metadata of media.assets) {
      let exif;
      let mediainfo = await MediaLibrary.getAssetInfoAsync(metadata);
      try {
        exif = mediainfo.exif['{GPS}'];
      } catch {}
      if (exif != null) {
        if (
          Math.abs(exif.Latitude - latcur) >= latdistance ||
          Math.abs(exif.Longtitude - loncur) >= londistance
        ) {
          const hour = Number(moment.unix(metadata.creationTime).format('HH'));
          console.log(hour);

          total += 1;
          if (hour > earlymorningbar && hour <= morningbar) {
            earlymorning += 1;
          } else if (hour > morningbar && hour <= noonbar) {
            morning += 1;
          } else if (hour > noonbar && hour <= eveningboarder) {
            afternoon += 1;
          } else if (hour > eveningboarder && hour <= nightboarder) {
            evening += 1;
          } else if (hour > nightboarder && hour <= midnightboarder) {
            night += 1;
          } else {
            midnight += 1;
          }
        }
      }
    }
    const data = [
      (earlymorning / total) * 100,
      (morning / total) * 100,
      (afternoon / total) * 100,
      (evening / total) * 100,
      (night / total) * 100,
      (midnight / total) * 100,
    ];
    setData(data);
    setLoading(false);
  }
  const d = {
    labels: ['朝', '午前', '昼ごろ', '夕方', '夜', '深夜'],
    datasets: [
      {
        data: data,
      },
    ],
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
      style={styles.analysisViewLinearGradient}
    >
      <View style={styles.container}>
        <TouchableOpacity onPress={mediaLibraryAsync} style={styles.Button}>
          <Text style={styles.ButtonText}>旅先でカメラを撮る時間帯</Text>
        </TouchableOpacity>
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

        <Text style={styles.TimeText}>{`
        【時間帯】
        朝:4:00~8:00
        午前:8:00~11:00
        昼ごろ:11:00~15:00
        夕方:15:00~19:00
        夜:19:00~23:00
        深夜:23:00~4:00
        `}</Text>
      </View>
      <Loading visible={loading} />
    </LinearGradient>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  Button: {
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: 'rgba(0, 0, 0, 00.20)',
    shadowRadius: 25,
    shadowOpacity: 1,
    justifyContent: 'center',
    padding: 0,
    alignSelf: 'stretch',
    height: 60,
    marginLeft: 90,
    marginRight: 90,
    marginBottom: 20,
    marginTop: 40,
  },
  analysisViewLinearGradient: {
    flex: 1,
  },
  ButtonText: {
    color: 'rgb(217, 103, 110)',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: 'normal',
    textAlign: 'center',
  },
  TimeText: {
    color: 'rgb(255, 255, 255)',
    fontSize: 12,
    fontStyle: 'normal',
    fontWeight: 'normal',
  },
});
