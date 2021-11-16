import * as MediaLibrary from 'expo-media-library';
import firebase from 'firebase';

export const getHinomeTime = async (
  startAt: firebase.firestore.Timestamp,
  endAt: firebase.firestore.Timestamp
): firebase.firestore.Timestamp[] => {
  await MediaLibrary.requestPermissionsAsync();
  const media = await MediaLibrary.getAssetsAsync({
    mediaType: [MediaLibrary.MediaType.photo],
  });

  //convert to firestore timestamp to unixtime
  const startTime = new Date(startAt.seconds * 1000);
  const endTime = new Date(endAt.seconds * 1000);
  let hinomeTime = [];

  //各時間帯を取得
  for (const metadata of media.assets) {
    let exif;
    let mediainfo = await MediaLibrary.getAssetInfoAsync(metadata);
    try {
      exif = mediainfo.exif['{GPS}'];
    } catch {
      console.log('no gps');
    }
    const filecreatesecons = metadata.creationTime;
    const convert_filecratetime = new Date(filecreatesecons * 1000);
    if (convert_filecratetime < endTime && convert_filecratetime > startTime) {
      hinomeTime.push(
        firebase.firestore.Timestamp.fromDate(convert_filecratetime)
      );
    }
    if (hinomeTime.length > 0) break;
  }
  return hinomeTime;
};
