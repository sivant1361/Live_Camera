import React, {Component} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {RNCamera} from 'react-native-camera';

class Camera extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recording: false,
      path: '',
      data: {},
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
    console.log("end start:"+new Date());
    this.camera.stopRecording();
    console.log("end terminate:"+new Date());
    this.setState({recording: false});
  };

  takeVideo = async () => {
    if (this.camera) {
      this.setState({recording: true});
      const options = {minDuration: 10};
      console.log("record start:"+new Date());
      const data = await this.camera.recordAsync(options);
      console.log("record terminate:"+new Date());
      // const data = await this.camera.recordAsync();
      this.setState({path: data.uri});
      this.setState({recording: false});
      console.log('FILE', data);
    }
  };

  render() {
    if (this.state.recording === true) {
      setTimeout(() => {
        this.stopRecording();
      }, 15000);
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
