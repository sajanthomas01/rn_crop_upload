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
const base_url = 'https://3820d1b2.ngrok.io';

function App() {
  const [indication, setIndication] = React.useState(false);
  const [files, setFiles] = React.useState([]);


  const uploadImage = async () => {
    console.log('image uri ==>');
    setIndication(true);
    let uploadData = new FormData();
    for (const file of files) {
      console.log('file uri', file);
      uploadData.append('image[]', {
        type: 'image/jpg',
        uri: file,
        name: 'pic.jpg',
      });
    }
    ToastAndroid.show('Uploading...', ToastAndroid.LONG);
    try {
      console.log('inside tc', base_url);
      let response = await fetch(`${base_url}/api/imageupload`, {
        method: 'POST',
        body: uploadData,
      });
      let data = await response.json();
      if (data) {
        setIndication(false);
        ToastAndroid.show('uploaded', ToastAndroid.SHORT);
      }
    } catch (error) {
      setIndication(false);
      console.log(error);
      ToastAndroid.show('Network error', ToastAndroid.SHORT);
    }
    ImagePicker.clean();
  };

  const callCropper = async () => {
    setFiles([]);
    const crop = await ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
      mediaType: 'photo',
      multiple: true,
    });
    if (crop) {
      console.log(crop.length);
      console.log('=====================');
      console.log('=========ORG===========', crop);
      console.log('=====================');
      //to limit by 2 we can set the lenth of i to 2 , i saw that the libraries maxFiles is only supported in ios
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
          const fileArray = files;
          fileArray.push(finalCrop.path);
          setFiles(fileArray);
        }
      }
      uploadImage();

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
          style={styles.scrollView}>
          <View style={styles.body}>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Choose Image/s</Text>
              <TouchableOpacity onPress={() => callCropper()} style={styles.buttonCropper}>
                <Text>Tap Choose Image</Text>
              </TouchableOpacity>
              <ActivityIndicator animating={indication} size="large" color="#0000ff" style={styles.indicatorActivity} />

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
    alignItems: 'center',
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
    margin: 10,
  },
  buttonCropper: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#eee',
    borderRadius: 15,
  },
  indicatorActivity: {
    margin: 50,
  },

});

export default App;
