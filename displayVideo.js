import React, {Component} from 'react';
import {Text, View, StyleSheet, Image} from 'react-native';
import Video from 'react-native-video';
export default class VideoPlayer extends Component {
  constructor() {
    super();
    this.state = {
      resizeMode: 'cover',
      image: 'file:///data/user/0/com.livecam/files/out002.jpg',
      video:
        'file:///data/user/0/com.livecam/cache//46354d77-98e0-49d2-b111-e0848f1351e3.mp4',
    };
  }
  render() {
    if(this.props.route.params){
        console.log(this.props.route.params);
    }else{
        console.log("No:",this.props.route.params);
    }
    return (
      <View
        style={{
          padding: 20,
        }}>
        <View style={{marginVertical: 20}}>
          <Text
            style={{
              paddingVertical: 10,
              fontSize: 20,
              fontWeight: 'bold',
              color: '#008',
              textAlign: 'center',
            }}>
            IMAGE
          </Text>
          <Image
            source={{uri: this.props.route.params.value.image.illustration}}
            style={{height: 200, width: '100%'}}
          />
        </View>
        <View style={{marginVertical: 20}}>
          <Text
            style={{
              paddingVertical: 10,
              fontSize: 20,
              fontWeight: 'bold',
              color: '#008',
              textAlign: 'center',
            }}>
            VIDEO
          </Text>
          <Video
            source={{
              uri: this.props.route.params.value.video,
            }} // Can be a URL or a localfile.
            ref={(ref) => {
              this.player = ref;
            }} // Store reference
            onBuffer={this.onBuffer} // Callback when remote video is buffering
            onEnd={this.onEnd} // Callback when playback finishes
            onError={this.videoError} // Callback when video cannot be loaded
            style={styles.backgroundVideo}
            repeat={true}
            controls={true}
            resizeMode={this.state.resizeMode}
          />
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center'},
  backgroundVideo: {
    height: 200,
    width: '100%',
  },
});
