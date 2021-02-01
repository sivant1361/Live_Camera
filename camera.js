import React, {Component, useEffect} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {RNCamera} from 'react-native-camera';
import {RNFFprobe, RNFFmpeg} from 'react-native-ffmpeg';
import RNVideoHelper from 'react-native-video-helper';
import RNFS from 'react-native-fs';

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
      pressed: false,
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
    this.setState({pressed: true});
    setTimeout(() => {
      this.camera.stopRecording();
    }, 1500);
    console.log('end terminate:' + new Date());
  };

  takeVideo = async () => {
    const fPath = `${RNFS.DocumentDirectoryPath}/live.mp4`;
    var data;
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
        .then((dat) => {
          data = dat;
          // console.log(dat);
        })
        .catch((err) => {
          console.log(err.message, err.code);
          this.takeVideo()
          return;
        });
      // const data = await this.camera.recordAsync();
      console.log('record terminate:' + new Date());
      this.setState({path: data.uri});
      // console.log('FILE', data);

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

            RNFFmpeg.execute(
              `-i ${this.state.croppedURL} -vf fps=10 ${RNFS.DocumentDirectoryPath}/out%03d.jpg`,
            )
              .then((result) => {
                // setTimeout(() => {
                //   console.log('Compression' + result);
                // }, 2000);
                // console.log('Compression' + result);
                
                console.log('After creating KeySlider:' + new Date());

                this.props.navigation.navigate('KeySlider', this.state);
              })
              .catch((error) => {
                console.log(error);
              });
          });
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

  componentDidMount() {
    // setTimeout(() => {
    //   this.takeVideo();
    // }, 1000);
    if (this.state.recording === true) {
      setTimeout(() => {
        this.stopRecording();
      }, 60000);
    } else {
      setTimeout(() => {
        this.takeVideo();
      }, 1000);
    }
  }
  render() {
    // RNFS.exists(RNFS.DocumentDirectoryPath).then((res) => {
    //           if (res) {
    //             console.log(res);
    //             RNFS.unlink(RNFS.DocumentDirectoryPath)
    //               .then((res) => console.log('FILE DELETED'))
    //               .catch((err) => console.log('File is not deleted'));
    //           }
    //         });

    // RNFS.readDir(RNFS.DocumentDirectoryPath) // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
    //   .then((result) => {
    //     console.log('GOT RESULT', result);

    //     // stat the first file
    //     return Promise.all([RNFS.stat(result[0].path), result[0].path]);
    //   })
    //   .then((statResult) => {
    //     if (statResult[0].isFile()) {
    //       // if we have a file, read it
    //       return RNFS.readFile(statResult[1], 'utf8');
    //     }

    //     return 'no file';
    //   })
    //   .then((contents) => {
    //     // log the file contents
    //     console.log(contents);
    //   })
    //   .catch((err) => {
    //     console.log(err.message, err.code);
    //   });

    return (
      <View style={styles.container}>
        <RNCamera
          ref={(ref) => {
            this.camera = ref;
          }}
          style={styles.preview}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.on}
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
            flex: 0,
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}>
          {/* <TouchableOpacity onPress={this.takePicture} style={styles.capture}>
            <Text style={{fontSize: 14, color: 'white'}}> SNAP </Text>
          </TouchableOpacity> */}
          {this.state.recording ? (
            !this.state.pressed ? (
              <TouchableOpacity
                onPress={this.stopRecording}
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
                {' '}
                Capturing...{' '}
              </Text>
            )
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
