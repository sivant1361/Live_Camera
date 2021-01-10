import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  FlatList,
  Dimensions
} from 'react-native';
import RNFS from 'react-native-fs';
import Carousel, {ParallaxImage} from 'react-native-snap-carousel';

const {width: screenWidth} = Dimensions.get('window');

export default function KeySlider({route, navigation}) {
  const path = `file:///${RNFS.DocumentDirectoryPath}/out0`;
  const dataImages = [
    `${path}01.jpg`,
    `${path}02.jpg`,
    `${path}03.jpg`,
    `${path}04.jpg`,
    `${path}05.jpg`,
    `${path}06.jpg`,
    `${path}07.jpg`,
    `${path}08.jpg`,
    `${path}09.jpg`,
    `${path}10.jpg`,
  ];
  const [state, setState] = useState({});
  setTimeout(() => {
    setState(route.params);
    console.log(state);
  }, 6000);

  return (
    <View style={{padding: 10, flex: 1}}>
      <Text
        style={{
          textAlign: 'center',
          fontSize: 25,
          fontWeight: 'bold',
          marginVertical: 10,
        }}>
        HELLO
      </Text>
      {/* <FlatList
        keyExtractor={(image,index) =>index * Math.random()}
        // horizontal={true}
        data={dataImages}
        renderItem={({image}) => {
          return (<Text style={{fontWeight: 'bold',marginVertical:10,color:'red'}}>{image}</Text>)
          // return(<Image source={image} style={{height:100,width:100}}/>);
        }}
      /> */}

      {/* beta version */}
      {/* <FlatList
        // numColumns={3}
        horizontal={true}
        data={dataImages}
        renderItem={({item,index}) => {
          return (
            <View>
              <Image source={{uri: item}} style={{height: 200, width: 200}} />
              <Text>{index}</Text>
            </View>
          );
        }}
      /> */}

      <Carousel
        ref={carouselRef}
        sliderWidth={screenWidth}
        sliderHeight={screenWidth}
        itemWidth={screenWidth - 60}
        data={dataImages}
        renderItem={renderItem}
        hasParallaxImages={true}
      />
      {/* {dataImages.map(item => <Image source={{uri:item}} style={{height:100,width:100}}/>)} */}
    </View>
  );
}
