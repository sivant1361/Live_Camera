import React, {Component, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  ActivityIndicator,
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import {RNFFprobe, RNFFmpeg} from 'react-native-ffmpeg';
import RNVideoHelper from 'react-native-video-helper';
import RNFS from 'react-native-fs';
import TabView from './tabview';

class Camera extends Component {
  constructor() {
    super();
    this.state = {
      recording: false,
      path: '',
      data: {},
      duration: 3,
      croppedURL: '',
      instantImage: '',
      captureState: 'Capturing...',
      pressed: false,
      modalLockOpen: false,
      force: false,
    };
  }

  // componentDidMount() {
  //   if (this.state.recording === true) {
  //     setTimeout(() => {
  //       this.stopRecording();
  //     }, 60 * 1000);
  //   } else {
  //     setTimeout(() => {
  //       this.takeVideo();
  //     }, 500);
  //   }
  // }

  takePicture = async () => {
    if (this.camera) {
      const options = {quality: 0.5, base64: true};
      const data = await this.camera.takePictureAsync(options);
      console.log(data.uri);
    }
  };

  forceStopRecording = () => {
    console.log('Force Stop!');
    this.setState({force: true});
    this.camera.stopRecording();
  };

  getRecording = () => {
    return this.state.recording;
  };

  captureVideo = async () => {
    const fPath = `${RNFS.DocumentDirectoryPath}/live.mp4`;
    const options = {
      path: fPath,
    };
    console.log('record start: ' + new Date());
    this.setState({recording: true});
    await this.camera
      .recordAsync(options)
      .then((data) => {
        console.log('Video Captured: ' + data);
        console.log('record terminate: ' + new Date());
        this.setState({modalLockOpen: true});
        this.setState({captureState: 'Video Captured will show it later :)'});
        setTimeout(() => {
          this.setState({captureState: 'Video Captured will show it later :)'});
          this.setState({modalLockOpen: false, CaptureState: 'Capturing...'});
        }, 4000);
      })
      .catch((err) => {
        console.log(err.message, err.code);
        this.camera.stopRecording();
        this.captureVideo();
        return;
      });
  };

  stopRecording = async () => {
    console.log('Recording stopped');
    console.log('end start:' + new Date());
    this.setState({modalLockOpen: true, pressed: true});
    setTimeout(() => {
      this.camera.stopRecording();
    }, 1500);
    console.log('end terminate:' + new Date());
  };

  takeVideo = async () => {
    const fPath = `${RNFS.DocumentDirectoryPath}/live.mp4`;
    // const fPath = `${RNFS.ExternalStorageDirectoryPath}/live.mp4`;
    if (this.camera) {
      this.setState({recording: true});
      const options = {
        minDuration: 120,
        path: fPath,
      };
      console.log('record start:' + new Date());
      await this.camera
        .recordAsync(options)
        .then((data) => {
          if (this.state.force == true) {
            this.setState({recording: false});
            return;
          }
          // const data = await this.camera.recordAsync();
          console.log('record terminate:' + new Date());
          this.setState({path: data.uri});
          // console.log('FILE', data);

          this.setState({captureState: 'Compressing...'});
          RNFFprobe.getMediaInformation(data.uri).then((information) => {
            console.log('Result: ' + information.duration);
            this.setState({duration: information.duration / 1000});

            console.log('getting duration:' + new Date());

            RNVideoHelper.compress(this.state.path, {
              startTime: this.state.duration - 3, // optional, in seconds, defaults to 0
              quality: 'high', // default low, can be medium or high
              bitRate: 2.6 * 1000 * 1000, //default low:1.3M,medium:1.9M,high:2.6M
              defaultOrientation: 0, // By default is 0, some devices not save this property in metadata. Can be between 0 - 360
            })
              .progress((value) => {
                // console.log('progress', value); // Int with progress value from 0 to 1
              })
              .then((data) => {
                console.log('After compression:' + new Date());
                console.log('compressedUri', data); // String with path to temporary compressed video
                this.setState({croppedURL: data});

                // Delete recorded video
                RNFS.exists(this.state.path).then((res) => {
                  if (res) {
                    // console.log(res);
                    RNFS.unlink(this.state.path)
                      .then((res) => console.log('FILE DELETED'))
                      .catch((err) => console.log('File is not deleted'));
                  }
                });

                console.log('After deleting long video:' + new Date());

                this.setState({captureState: 'Generating Key Frames...'});

                RNFFmpeg.execute(
                  `-i ${this.state.croppedURL} -vf fps=10 ${RNFS.DocumentDirectoryPath}/out%03d.jpg`,
                )
                  .then((result) => {
                    // setTimeout(() => {
                    //   console.log('Compression' + result);
                    // }, 2000);
                    // console.log('Compression' + result);

                    this.setState({
                      pressed: false,
                      recording: false,
                      captureState: 'Capturing...',
                      modalLockOpen: false,
                    });
                    console.log('After creating KeySlider:' + new Date());
                    this.props.navigation.navigate('KeySlider', this.state);
                  })
                  .catch((error) => {
                    console.log(error);
                  });
              });
          });
        })
        .catch((err) => {
          console.log(err.message, err.code);
          this.camera.stopRecording();
          this.takeVideo();
          return;
        });
    }
  };

  // Size of the compressed video

  // RNFFprobe.getMediaInformation(this.state.croppedURL).then(
  //   (information) => {
  //     setTimeout(() => {
  //       console.log(
  //         'Compressed video duration:' +
  //           information.duration / 1000,
  //       );
  //     }, 1000);
  //   },
  // );

  // Display output

  // .then(() => {
  //   setTimeout(() => {
  //     RNFS.readDir(RNFS.DocumentDirectoryPath)
  //       .then((result) => {
  //         console.log('GOT RESULT', result);
  //         return Promise.all([
  //           RNFS.stat(result[0].path),
  //           result[0].path,
  //         ]);
  //       })
  //       .then((statResult) => {
  //         if (statResult[0].isFile()) {
  //           return RNFS.readFile(statResult[1], 'utf8');
  //         }
  //         return 'no file';
  //       })
  //       .then((contents) => {
  //         console.log(contents);
  //       })
  //       .catch((err) => {
  //         console.log(err.message, err.code);
  //       });

  //     this.props.navigation.navigate('KeySlider', this.state);
  //   }, 2000);
  // });

  // Delete entire folder

  // RNFS.exists(RNFS.DocumentDirectoryPath).then((res) => {
  //   if (res) {
  //     console.log(res);
  //     RNFS.unlink(RNFS.DocumentDirectoryPath)
  //       .then((res) => console.log('FILE DELETED'))
  //       .catch((err) => console.log('File is not deleted'));
  //   }
  // });

  render() {
    return (
      <View style={styles.container}>
        <Modal
          visible={this.state.modalLockOpen}
          animationType="slide"
          transparent={true}>
          <View
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.85)',
              height: '100%',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 40,
            }}>
            <View style={{borderRadius: 8}}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    padding: 10,
                  }}>
                  <ActivityIndicator size="large" color="#fff" />
                </View>
                <Text
                  style={{
                    color: 'white',
                    fontSize: 15,
                    paddingHorizontal: 7,
                  }}>
                  {this.state.captureState}
                </Text>
              </View>
            </View>
          </View>
        </Modal>
        <RNCamera
          ref={(ref) => {
            this.camera = ref;
          }}
          style={styles.preview}
          type={RNCamera.Constants.Type.back}
          // flashMode={RNCamera.Constants.FlashMode.on}
          captureAudio={false}
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
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}>
          <TabView
            stopRecording={this.stopRecording}
            recording={this.state.recording}
            pressed={this.state.pressed}
            takeVideo={this.takeVideo}
            captureVideo={this.captureVideo}
            forceStopRecording={this.forceStopRecording}
            getRecording={this.getRecording}
          />

          {/* {this.state.recording ? (
            !this.state.pressed ? (
              <TouchableOpacity
                onPress={() => {
                  this.stopRecording();
                }}
                style={styles.capture}>
                <Text style={{fontSize: 14, color: 'white'}}> Stop </Text>
              </TouchableOpacity>
            ) : (
              <Text
                style={{
                  fontSize: 14,
                  color: 'white',
                  padding: 20,
                  fontSize: 25,
                }}>
                Capturing...
              </Text>
            )
          ) : (
            <TouchableOpacity onPress={this.takeVideo} style={styles.capture}>
              <Text style={{fontSize: 14, color: 'white'}}> Video </Text>
            </TouchableOpacity>
          )} */}
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
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: '80%',
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
