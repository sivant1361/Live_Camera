import React, {useState, useEffect} from 'react';
import {
  Text,
  Dimensions,
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {TabView, TabBar, SceneMap} from 'react-native-tab-view';
const initialLayout = {width: Dimensions.get('window').width, height: 0};


const Tabview = ({
  stopRecording,
  recording,
  takeVideo,
  captureVideo,
  forceStopRecording,
  getRecording
}) => {

  const getTabBarLabel = (props) => {
    const {route, focused} = props;
    if (route.key === 'first') {
      return (
        <Text
          style={{
            color: index === 0 ? 'rgba(255,255,255,1)' : 'rgba(186,186,186,1)',
            fontFamily: 'Roboto-Medium',
            fontSize: 15,
          }}>
          Video
        </Text>
      );
    } else if (route.key === 'second') {
      return (
        <Text
          style={{
            color: index === 1 ? 'rgba(255,255,255,1)' : 'rgba(186,186,186,1)',
            fontFamily: 'Roboto-Medium',
            fontSize: 15,
          }}>
          LiveCamera
        </Text>
      );
    }
  };

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={{backgroundColor: 'white'}}
      style={{
        backgroundColor: 'rgba(0,0,0,0.85)',
        // marginHorizontal: 30,
        marginBottom: 3,
        width: '100%',
        elevation: 0,
      }}
      renderLabel={(props) => getTabBarLabel(props)}
      pressColor="transparent"
    />
  );

  const [routes] = React.useState([
    {key: 'first', title: 'Video'},
    {key: 'second', title: 'LiveCamera'},
  ]);

  const [index, setIndex] = useState(0);

  useEffect(() => {
    console.log("Video (0) or LiveCamera (1) : "+index);
    if(index === 0){
      if(getRecording()==true){
        forceStopRecording();
      }
    }else if(index === 1){
      if (getRecording() === true) {
            setTimeout(() => {
              stopRecording();
            }, 60 * 1000);
          } else {
            setTimeout(() => {
              takeVideo();
            }, 500);
          }
    }
  }, [index]);

  const renderScene = SceneMap({
    first: () => {
      return (
        <View>
          {getRecording() ? (
            <TouchableOpacity
              onPress={() => {
                forceStopRecording();
              }}
              style={styles.capture}>
              <Text style={{fontSize: 14, color: 'white'}}> Stop </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={captureVideo} style={styles.capture}>
              <Text style={{fontSize: 14, color: 'white'}}> Video </Text>
            </TouchableOpacity>
          )}
        </View>
      );
    },
    second: () => {
      return (
        <View>
          {getRecording() ? (
            <TouchableOpacity
              onPress={() => {
                stopRecording();
              }}
              style={styles.capture}>
              <Text style={{fontSize: 14, color: 'white'}}> Stop </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={takeVideo} style={styles.capture}>
              <Text style={{fontSize: 14, color: 'white'}}> Video </Text>
            </TouchableOpacity>
          )}
        </View>
      );
    },
  });

  return (
    <TabView
      renderTabBar={renderTabBar}
      navigationState={{index, routes}}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={initialLayout}
      style={{
        marginBottom: 2,
        justifyContent: 'space-between',
        height: Dimensions.get('window').height,
        elevation: 0,
      }}
    />
  );
};

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

export default Tabview;
