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
    const createTime = metadata.creationTime;
    hinomeTime.push(createTime);
  }
  const hinomeDate = hinomeTime.sort().map((x) => new Date(x));
  const HOURS = [
    { hour: 1, minute: 1, weight: 0 },
    { hour: 1, minute: 2, weight: 0 },
    { hour: 1, minute: 3, weight: 0 },
    { hour: 1, minute: 4, weight: 0 },
    { hour: 1, minute: 5, weight: 0 },
    { hour: 1, minute: 6, weight: 0 },
    { hour: 2, minute: 1, weight: 0 },
    { hour: 2, minute: 2, weight: 0 },
    { hour: 2, minute: 3, weight: 0 },
    { hour: 2, minute: 4, weight: 0 },
    { hour: 2, minute: 5, weight: 0 },
    { hour: 2, minute: 6, weight: 0 },
    { hour: 3, minute: 1, weight: 0 },
    { hour: 3, minute: 2, weight: 0 },
    { hour: 3, minute: 3, weight: 0 },
    { hour: 3, minute: 4, weight: 0 },
    { hour: 3, minute: 5, weight: 0 },
    { hour: 3, minute: 6, weight: 0 },
    { hour: 4, minute: 1, weight: 0 },
    { hour: 4, minute: 2, weight: 0 },
    { hour: 4, minute: 3, weight: 0 },
    { hour: 4, minute: 4, weight: 0 },
    { hour: 4, minute: 5, weight: 0 },
    { hour: 4, minute: 6, weight: 0 },
    { hour: 5, minute: 1, weight: 0 },
    { hour: 5, minute: 2, weight: 0 },
    { hour: 5, minute: 3, weight: 0 },
    { hour: 5, minute: 4, weight: 0 },
    { hour: 5, minute: 5, weight: 0 },
    { hour: 5, minute: 6, weight: 0 },
    { hour: 6, minute: 1, weight: 0 },
    { hour: 6, minute: 2, weight: 0 },
    { hour: 6, minute: 3, weight: 0 },
    { hour: 6, minute: 4, weight: 0 },
    { hour: 6, minute: 5, weight: 0 },
    { hour: 6, minute: 6, weight: 0 },
    { hour: 6, minute: 1, weight: 0 },
    { hour: 6, minute: 2, weight: 0 },
    { hour: 6, minute: 3, weight: 0 },
    { hour: 6, minute: 4, weight: 0 },
    { hour: 6, minute: 5, weight: 0 },
    { hour: 6, minute: 6, weight: 0 },
    { hour: 7, minute: 1, weight: 0 },
    { hour: 7, minute: 2, weight: 0 },
    { hour: 7, minute: 3, weight: 0 },
    { hour: 7, minute: 4, weight: 0 },
    { hour: 7, minute: 5, weight: 0 },
    { hour: 7, minute: 6, weight: 0 },
    { hour: 8, minute: 1, weight: 0 },
    { hour: 8, minute: 2, weight: 0 },
    { hour: 8, minute: 3, weight: 0 },
    { hour: 8, minute: 4, weight: 0 },
    { hour: 8, minute: 5, weight: 0 },
    { hour: 8, minute: 6, weight: 0 },
    { hour: 9, minute: 1, weight: 0 },
    { hour: 9, minute: 2, weight: 0 },
    { hour: 9, minute: 3, weight: 0 },
    { hour: 9, minute: 4, weight: 0 },
    { hour: 9, minute: 5, weight: 0 },
    { hour: 9, minute: 6, weight: 0 },
    { hour: 10, minute: 1, weight: 0 },
    { hour: 10, minute: 2, weight: 0 },
    { hour: 10, minute: 3, weight: 0 },
    { hour: 10, minute: 4, weight: 0 },
    { hour: 10, minute: 5, weight: 0 },
    { hour: 10, minute: 6, weight: 0 },
    { hour: 11, minute: 1, weight: 0 },
    { hour: 11, minute: 2, weight: 0 },
    { hour: 11, minute: 3, weight: 0 },
    { hour: 11, minute: 4, weight: 0 },
    { hour: 11, minute: 5, weight: 0 },
    { hour: 11, minute: 6, weight: 0 },
    { hour: 13, minute: 1, weight: 0 },
    { hour: 13, minute: 2, weight: 0 },
    { hour: 13, minute: 3, weight: 0 },
    { hour: 13, minute: 4, weight: 0 },
    { hour: 13, minute: 5, weight: 0 },
    { hour: 12, minute: 6, weight: 0 },
    { hour: 14, minute: 1, weight: 0 },
    { hour: 14, minute: 2, weight: 0 },
    { hour: 14, minute: 3, weight: 0 },
    { hour: 14, minute: 4, weight: 0 },
    { hour: 14, minute: 5, weight: 0 },
    { hour: 14, minute: 6, weight: 0 },
    { hour: 15, minute: 1, weight: 0 },
    { hour: 15, minute: 2, weight: 0 },
    { hour: 15, minute: 3, weight: 0 },
    { hour: 15, minute: 4, weight: 0 },
    { hour: 15, minute: 5, weight: 0 },
    { hour: 15, minute: 6, weight: 0 },
    { hour: 16, minute: 1, weight: 0 },
    { hour: 16, minute: 2, weight: 0 },
    { hour: 16, minute: 3, weight: 0 },
    { hour: 16, minute: 4, weight: 0 },
    { hour: 16, minute: 5, weight: 0 },
    { hour: 16, minute: 6, weight: 0 },
    { hour: 17, minute: 1, weight: 0 },
    { hour: 17, minute: 2, weight: 0 },
    { hour: 17, minute: 3, weight: 0 },
    { hour: 17, minute: 4, weight: 0 },
    { hour: 17, minute: 5, weight: 0 },
    { hour: 17, minute: 6, weight: 0 },
    { hour: 18, minute: 1, weight: 0 },
    { hour: 18, minute: 2, weight: 0 },
    { hour: 18, minute: 3, weight: 0 },
    { hour: 18, minute: 4, weight: 0 },
    { hour: 18, minute: 5, weight: 0 },
    { hour: 18, minute: 6, weight: 0 },
    { hour: 19, minute: 1, weight: 0 },
    { hour: 19, minute: 2, weight: 0 },
    { hour: 19, minute: 3, weight: 0 },
    { hour: 19, minute: 4, weight: 0 },
    { hour: 19, minute: 5, weight: 0 },
    { hour: 19, minute: 6, weight: 0 },
    { hour: 20, minute: 1, weight: 0 },
    { hour: 20, minute: 2, weight: 0 },
    { hour: 20, minute: 3, weight: 0 },
    { hour: 20, minute: 4, weight: 0 },
    { hour: 20, minute: 5, weight: 0 },
    { hour: 20, minute: 6, weight: 0 },
    { hour: 21, minute: 1, weight: 0 },
    { hour: 21, minute: 2, weight: 0 },
    { hour: 21, minute: 3, weight: 0 },
    { hour: 21, minute: 4, weight: 0 },
    { hour: 21, minute: 5, weight: 0 },
    { hour: 21, minute: 6, weight: 0 },
    { hour: 22, minute: 1, weight: 0 },
    { hour: 22, minute: 2, weight: 0 },
    { hour: 22, minute: 3, weight: 0 },
    { hour: 22, minute: 4, weight: 0 },
    { hour: 22, minute: 5, weight: 0 },
    { hour: 22, minute: 6, weight: 0 },
    { hour: 23, minute: 1, weight: 0 },
    { hour: 23, minute: 2, weight: 0 },
    { hour: 23, minute: 3, weight: 0 },
    { hour: 23, minute: 4, weight: 0 },
    { hour: 23, minute: 5, weight: 0 },
    { hour: 23, minute: 6, weight: 0 },
    { hour: 24, minute: 1, weight: 0 },
    { hour: 24, minute: 2, weight: 0 },
    { hour: 24, minute: 3, weight: 0 },
    { hour: 24, minute: 4, weight: 0 },
    { hour: 24, minute: 5, weight: 0 },
    { hour: 24, minute: 6, weight: 0 },
  ];

  //日の目時間の配列を切り出す
  let start_index = 0;
  let end_index = 0;
  for (let i = 1; i < HOURS.length; i++) {
    let tmp = HOURS[i];
    let hour = tmp.hour;
    let min = tmp.minute;
    if (startTime.getHours() == hour) {
      if (
        startTime.getMinutes() < min * 10 &&
        startTime.getMinutes() >= HOURS[i - 1].minute * 10
      )
        start_index = i;
    }
    if (endTime.getHours() == hour) {
      if (
        endTime.getMinutes() < min * 10 &&
        startTime.getMinutes() >= HOURS[i - 1].minute * 10
      )
        end_index = i;
    }
  }
  let pushHour = {};
  if (end_index < start_index) {
    //日またぎの回避のため、HOURSにDATEプロパティを追加で修正できる見込み
    end_index = 144;
  }
  pushHour = HOURS.slice(start_index, end_index);

  //　時間単位で区間ごとの和をとった
  let totalweight = 0;
  for (let [key, value] of Object.entries(pushHour)) {
    totalweight += pushHour[key].weight;
  }

  for (let h of hinomeDate) {
    for (let p in pushHour) {
      if (h.getHours() + 12 == pushHour[p].hour) {
        if (
          h.getMinutes() < pushHour[p].minute * 10 &&
          h.getMinutes() >= pushHour[p].minute * 10 - 10
        )
          pushHour[p].weight++;
      }
    }
  }

  //開始時間と終了時間を考慮した時間配列を生成
  let maxCountTime = 0;
  for (let [key, value] of Object.entries(pushHour)) {
    maxCountTime = Math.max(maxCountTime, pushHour[key].weight);
  }
  pushHour.map((x) => (x.weight = Math.abs(x.weight - maxCountTime)));

  //年月日は本日を取得 (TODO 日またぎ、月またぎはプロパティを追加)
  const d = new Date();
  const curMonth = d.getMonth();
  const curDate = d.getDate();
  const curYear = d.getFullYear();
  const curSecond = d.getSeconds();
  const curMSecond = d.getMilliseconds();

  let NotifyHour = [];
  let NotifyMinute = [];
  let cnt = 0;

  //重み付け乱択アルゴリズム
  while (NotifyHour.length < 9) {
    let pickedItem = Math.random() * totalweight;
    let searchPosition = 0;
    for (let [key, value] of Object.entries(pushHour)) {
      searchPosition += pushHour[key].weight;
      if (pickedItem < searchPosition) {
        NotifyHour.push(value.hour);
        NotifyMinute.push(value.minute);
      }
      if (NotifyHour.length > 9) break;
    }
    cnt++;
  }

  //日付生成し、firestampに変換
  let NotifyDate = [];
  const timeoffset = 9;
  for (let j = 0; j < 10; j++) {
    let s = new Date(
      curYear,
      curMonth,
      curDate,
      NotifyHour[j] + timeoffset,
      NotifyMinute[j],
      curSecond,
      curMSecond
    );

    let da = firebase.firestore.Timestamp.fromDate(s);
    NotifyDate.push(da);
  }

  return NotifyDate;
};
