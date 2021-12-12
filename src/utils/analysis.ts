import * as MediaLibrary from 'expo-media-library';
import firebase from 'firebase';

export const getHinomeTime = async (
  startAt: firebase.firestore.Timestamp,
  endAt: firebase.firestore.Timestamp
): Promise<firebase.firestore.Timestamp[]> => {
  await MediaLibrary.requestPermissionsAsync();
  const media = await MediaLibrary.getAssetsAsync({
    mediaType: [MediaLibrary.MediaType.photo],
  });
  //firestore timpestampをunix時間に変換
  const startTime = new Date(startAt.seconds * 1000);
  const endTime = new Date(endAt.seconds * 1000);
  let hinomeTime = [];
  function getMillisecondsOfLocalDay(dt, offsetHours = 0) {
    return (
      (dt.getTime() - (offsetHours * 60 + dt.getTimezoneOffset()) * 60000) %
      86400000
    );
  }
  function getArrayMax(array) {
    return Math.max.apply(null, array);
  }
  //各時間帯、GPSを取得
  for (const metadata of media.assets) {
    let exif;
    let mediainfo = await MediaLibrary.getAssetInfoAsync(metadata);
    try {
      exif = mediainfo.exif['{GPS}'];
    } catch {
      console.log('no gps');
    }
    // metadataからtimestampを取る
    const filecreateseconds = metadata.creationTime;
    // timestampをDateに変更
    const convert_filecratetime = new Date(filecreateseconds);

    //時差なしとして、第２引数を0とする
    hinomeTime.push(convert_filecratetime.getTime(), 0);
  }
  let maxTime = getArrayMax(hinomeTime);

  //年月日は本日を取得
  const d = new Date();
  const curMonth = d.getMonth() + 1;
  const curDate = d.getDate();
  const curYear = d.getFullYear();
  const hinome = hinomeTime.map((x) => new Date(Math.abs(x - maxTime)));

  //firestampに変換
  const time = hinome.map((x) =>
    firebase.firestore.Timestamp.fromDate(
      new Date(
        curYear,
        curMonth,
        curDate,
        Number(x.getHours()),
        Number(x.getMinutes()),
        Number(x.getSeconds())
      )
    )
  );

  time.forEach((element) => console.log(element.toDate()));

  return time;
};
