import React, {Component} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {RNCamera} from 'react-native-camera';
import {RNFFprobe} from 'react-native-ffmpeg';
import RNVideoHelper from 'react-native-video-helper';

class Camera extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recording: false,
      path: '',
      data: {},
      duration: 3,
      croppedURL:''
    };
  }

  takePicture = async () => {
    if (this.camera) {
      const options = {quality: 0.5, base64: true};
      const data = await this.camera.takePictureAsync(options);
      console.log(data.uri);
    }
  };

  stopRecording = async () => {
    console.log('Recording stopped');
    console.log('end start:' + new Date());
    setTimeout(() => {
      this.camera.stopRecording();
    },1500)
    console.log('end terminate:' + new Date());
    // this.setState({recording: false});
  };

  takeVideo = async () => {
    if (this.camera) {
      this.setState({recording: true});
      const options = {minDuration: 120};
      console.log('record start:' + new Date());
      const data = await this.camera.recordAsync(options);
      console.log('record terminate:' + new Date());
      // const data = await this.camera.recordAsync();
      this.setState({path: data.uri});
      console.log('FILE', data);

      RNFFprobe.getMediaInformation(data.uri).then((information) => {
        setTimeout(() => {
          console.log('Result: ' + information.duration);
          this.setState({duration: information.duration / 1000});

          RNVideoHelper.compress(
            this.state.path,
            {
              startTime: this.state.duration-3, // optional, in seconds, defaults to 0
              quality: 'low', // default low, can be medium or high
              bitRate: 1.3 * 1000 * 1000, //default low:1.3M,medium:1.9M,high:2.6M
              defaultOrientation: 0, // By default is 0, some devices not save this property in metadata. Can be between 0 - 360
            },
          )
            .progress((value) => {
              console.log('progress', value); // Int with progress value from 0 to 1
            })
            .then((data) => {
              console.log('compressedUri', data); // String with path to temporary compressed video
              this.state.croppedURL=data;
              RNFFprobe.getMediaInformation(data).then((information) => {
                setTimeout(() => {
                  console.log("Compressed video duration:"+(information.duration/1000));
                },1000)
              })
            });
        }, 1000);
      })
    }
  };

  render() {
    if (this.state.recording === true) {
      setTimeout(() => {
        this.stopRecording();
      }, 60000);
    }
    else{
      setTimeout(() => {
        this.takeVideo();
      }, 500);
    }

    return (
      <View style={styles.container}>
        <RNCamera
          ref={(ref) => {
            this.camera = ref;
          }}
          style={styles.preview}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.on}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          androidRecordAudioPermissionOptions={{
            title: 'Permission to use audio recording',
            message: 'We need your permission to use your audio',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          onGoogleVisionBarcodesDetected={({barcodes}) => {
            console.log(barcodes);
          }}
        />

        <View
          style={{
            flex: 0,
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}>
          <TouchableOpacity onPress={this.takePicture} style={styles.capture}>
            <Text style={{fontSize: 14, color: 'white'}}> SNAP </Text>
          </TouchableOpacity>
          {this.state.recording ? (
            <TouchableOpacity
              onPress={this.stopRecording}
              style={styles.capture}>
              <Text style={{fontSize: 14, color: 'white'}}> Stop </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={this.takeVideo} style={styles.capture}>
              <Text style={{fontSize: 14, color: 'white'}}> Video </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: 'rgba(100,100,100,0.5)',
    borderRadius: 35,
    padding: 20,
    alignSelf: 'center',
    margin: 20,
  },
});
export default Camera;
