import * as MediaLibrary from 'expo-media-library';
import firebase from 'firebase';

export const getHinomeTime = async (
  startAt: firebase.firestore.Timestamp,
  endAt: firebase.firestore.Timestamp
): Promise<firebase.firestore.Timestamp[]> => {
  function getArrayMax(array: []) {
    return Math.max.apply(null, array);
  }

  await MediaLibrary.requestPermissionsAsync();
  const media = await MediaLibrary.getAssetsAsync({
    mediaType: [MediaLibrary.MediaType.photo],
  });
  //firestore timpestampをunix時間に変換
  const startTime = new Date(startAt.seconds * 1000);
  const endTime = new Date(endAt.seconds * 1000);
  //各時間帯を取得
  const hinomeDate = media.assets.map(
    (metadata) => new Date(metadata.creationTime)
  );
  // GPSを利用する場合
  // for (const metadata of media.assets) {
  //   const mediainfo = await MediaLibrary.getAssetInfoAsync(metadata);
  //   try {
  //     const exif = mediainfo.exif['{GPS}'];
  //   } catch {
  //     console.log('no gps');
  //   }
  // }
  const hinomePoint = {
    1: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    2: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    3: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    4: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    5: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    6: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    7: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    8: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    9: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    10: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    11: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    12: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    13: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    14: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    15: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    16: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    17: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    18: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    19: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    20: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    21: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    22: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    23: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    24: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  };

  //　時間単位で区間ごとの和をとった
  for (const h of hinomeDate) {
    const hour = h.getHours();
    const minute = h.getMinutes();
    // 一桁なら0、それ以外は10の位を取る
    const minuteTensPlace = minute < 10 ? 0 : Math.floor((minute / 10) % 10);
    hinomePoint[hour][minuteTensPlace] += 1;
  }

  let maxCountHour = 0;
  let maxCountMinute = 0;

  // 日の目ポイントを算出する
  for (let [key, value] of Object.entries(HOURS)) {
    maxCountHour = Math.max(maxCountHour, value);
  }
  for (let [key, value] of Object.entries(MINUTES)) {
    maxCountMinute = Math.max(maxCountMinute, value);
  }
  let hinomePointHour = {};
  let hinomePointMinute = {};
  for (let [key, value] of Object.entries(HOURS)) {
    hinomePointHour[key] = Math.abs(HOURS[key] - maxCountHour);
  }
  for (let [key, value] of Object.entries(MINUTES)) {
    hinomePointMinute[key] = Math.abs(MINUTES[key] - maxCountHour);
  }

  // //プッシュ日時を生成
  // let pushHour = [];
  // let pushMinute = [];
  // let h = 1;
  // let curH = 0;
  // let nextH = 0;
  // let i = 0;
  // while (i++) {
  //   curH = hinomePointHour[h];
  //   nextH = hinomePointHour[h + 1];
  //   if (curH - nextH) {
  //     if (curH) pushHour.push(curH);
  //   } else {
  //     if (nextH) pushHour.push(nextH);
  //     h = h + 1;
  //   }
  //   curH = curH - nextH;
  // }
  // console.log(pushHour);

  // let m = 0;
  // let curM = 0;
  // let nextM = 0;
  // for (let i = 0; i < 10; i++) {
  //   curM = hinomePointMinute[m];
  //   nextM = hinomePointMinute[m + 1];
  //   if (curM - nextM) {
  //     if (curM) pushMinute.push(curM);
  //   } else {
  //     if (nextM) pushMinute.push(nextM);
  //     m = m + 1;
  //   }
  //   curM = curM - hinomePointMinute.length;
  // }

  // valueで並び替え
  hinomePointHour = Object.keys(hinomePointHour).map((e) => ({
    key: e,
    value: hinomePointHour[e],
  }));
  hinomePointMinute = Object.keys(hinomePointMinute).map((e) => ({
    key: e,
    value: hinomePointMinute[e],
  }));

  // 通知日時を生成
  const startH = startTime.getHours();
  const startM = startTime.getMinutes();
  const endH = startTime.getHours();
  const endM = startTime.getMinutes();
  let idxm = 0;
  let idxh = 0;
  let keym = startM;
  let keyh = startH;
  let pushTime = [];
  let reth = 0;
  let retm = 0;
  //年月日は本日を取得
  const d = new Date();
  const curMonth = d.getMonth();
  const curDate = d.getDate();
  const curYear = d.getFullYear();
  const curs = d.getSeconds();
  const curMs = d.getMilliseconds();

  let n = 0;
  let tmph = endH;
  let tmpm = 0;
  // while (pushTime.length <= 9) {
  //   for (let [key, value] of Object.entries(hinomePointHour)) {
  //     if (Number(key) >= startH || Number(key) <= endH) {
  //       if (hinomePointHour[key] > hinomePointHour[tmph]) reth = Number(key);
  //       else {
  //         reth = tmph;
  //         value = value/2
  //       }
  //       tmph = Number(key);
  //     }
  //   }
  //   hinomePointHour[reth]-
  //   for (let [key, value] of Object.entries(hinomePointMinute)) {
  //     if (Number(key) >= startM || Number(key) <= endM) {
  //       if (hinomePointMinute[key] > hinomePointMinute[tmpm])
  //         retm = Number(key);
  //         value = value/2
  //     }
  //       else {
  //         retm = tmpm;

  //       }
  //         tmph = Number(key);
  //     }

  //   console.log(
  //     curYear.toString() +
  //       '-' +
  //       curMonth.toString() +
  //       '-' +
  //       curDate.toString() +
  //       'T' +
  //       reth.toString() +
  //       ':' +
  //       retm.toString() +
  //       ':' +
  //       curs
  //   );

  //   pushTime.push(
  //     firebase.firestore.Timestamp.fromDate(
  //       new Date(curYear, curMonth, curDate, reth, retm, curs, curMs)
  //     )
  //   );
  // }
  // for (let i of pushTime) {
  //   i = i;
  // }

  // pushTime.forEach((element) => console.log(element.toDate()));

  //return pushTime;
};
