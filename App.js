/* eslint-disable prettier/prettier */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  ToastAndroid,
  ActivityIndicator,
  PermissionsAndroid,
} from 'react-native';

import { Colors } from 'react-native/Libraries/NewAppScreen';
import ImagePicker from 'react-native-image-crop-picker';
const base_url = 'https://3820d1b2.ngrok.io/';

function App() {
  const [indication, setIndication] = React.useState(false);


  const uploadImage = async (_image_uri) => {
    console.log('calling server ', _image_uri);
    let uploadData = new FormData();
    uploadData.append('submit', 'ok');
    uploadData.append('image', {
      type: 'image/jpg',
      uri: _image_uri,
      name: 'pic.jpg',
    });
    ToastAndroid.show('Processing... Please wait', ToastAndroid.LONG);

    try {
      console.log('inside tc', base_url);
      let response = await fetch(`${base_url}api/imageupload`, {
        method: 'POST',
        body: uploadData,
      });
      let data = await response.json();
      if (data) {
        ToastAndroid.show('uploaded', ToastAndroid.SHORT);
      }
    } catch (error) {
      setIndication(false);
      console.log(error);
      ToastAndroid.show('Network error', ToastAndroid.SHORT);
    }

  };


  const callCropper = async () => {

    const crop = await ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
      mediaType: 'photo',
      multiple: true,
    });
    if (crop) {
      console.log(crop.length);
      for (let i = 0; i < crop.length; i++) {
        console.log(crop[i].path);

        const finalCrop = await ImagePicker.openCropper({
          path: crop[i].path,
          width: 300,
          height: 400,
          freeStyleCropEnabled: true,
        });
        if (finalCrop) {
          console.log(finalCrop.path);
          uploadImage(finalCrop.path);
          console.log('calleed uplaod image')
        }
      }
      // crop.map(async (item) => {
      //   const finalCrop = await ImagePicker.openCropper({
      //     path: item.path,
      //     width: 300,
      //     height: 400,
      //     freeStyleCropEnabled: true,
      //   });
      //   if (finalCrop) {
      //     console.log(finalCrop.path);
      //     await uploadImage(finalCrop.path);
      //     console.log('calleed uplaod image')
      //   }
      // });
    } else {
      ToastAndroid.show('Nothing selected', ToastAndroid.LONG);
    }
  };



  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <View style={styles.body}>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Choose Image/s</Text>
              <TouchableOpacity onPress={() => callCropper()} style={{ padding: 30 }}>
                <Text style={{textAlign: 'center'}}>Tap Choose Image</Text>
              </TouchableOpacity>
              <ActivityIndicator animating={indication} size="large" color="#0000ff" style={{ marginTop: 25 }} />

            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },

});

export default App;
