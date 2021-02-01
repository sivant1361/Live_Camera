import React, {useRef, useState, useEffect} from 'react';
import Carousel, {ParallaxImage} from 'react-native-snap-carousel';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import RNFS from 'react-native-fs';

const ENTRIES1 = [
  {
    title: 'THUMBNAIL 1',
    illustration: `file://${RNFS.DocumentDirectoryPath}/out011.jpg`,
  },
  {
    title: 'THUMBNAIL 2',
    illustration: `file://${RNFS.DocumentDirectoryPath}/out012.jpg`,
  },
  {
    title: 'THUMBNAIL 3',
    illustration: `file://${RNFS.DocumentDirectoryPath}/out013.jpg`,
  },
  {
    title: 'THUMBNAIL 4',
    illustration: `file://${RNFS.DocumentDirectoryPath}/out014.jpg`,
  },
  {
    title: 'THUMBNAIL 5',
    illustration: `file://${RNFS.DocumentDirectoryPath}/out015.jpg`,
  },
  {
    title: 'THUMBNAIL 6',
    illustration: `file://${RNFS.DocumentDirectoryPath}/out016.jpg`,
  },
  {
    title: 'THUMBNAIL 7',
    illustration: `file://${RNFS.DocumentDirectoryPath}/out017.jpg`,
  },
  {
    title: 'THUMBNAIL 8',
    illustration: `file://${RNFS.DocumentDirectoryPath}/out018.jpg`,
  },
  {
    title: 'THUMBNAIL 9',
    illustration: `file://${RNFS.DocumentDirectoryPath}/out019.jpg`,
  },
  {
    title: 'THUMBNAIL 10',
    illustration: `file://${RNFS.DocumentDirectoryPath}/out020.jpg`,
  },
];
const {width: screenWidth} = Dimensions.get('window');

const MyCarousel = ({props,navigation,route}) => {
  const [entries, setEntries] = useState([]);
  const carouselRef = useRef(null);
  const [state, setState] = useState(0);

  const goForward = () => {
    carouselRef.current.snapToNext();
  };

  setTimeout(()=>{
    console.log(carouselRef.current._activeItem);
  },500)
  useEffect(() => {
    setEntries(ENTRIES1);
  }, []);

  

  const renderItem = ({item, index}, parallaxProps) => {
    return (
      <View style={styles.item}>
        <ParallaxImage
          source={{uri: item.illustration}}
          containerStyle={styles.imageContainer}
          style={styles.image}
          parallaxFactor={0.4}
          {...parallaxProps}
        />
        <TouchableOpacity>
          <Text
            style={{textAlign: 'center', marginVertical: 5, fontWeight: 'bold'}}
            numberOfLines={2}>
            {item.title}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* <TouchableOpacity onPress={goForward}>
        <Text>go to next slide</Text>
      </TouchableOpacity> */}
      <Carousel
        ref={carouselRef}
        sliderWidth={screenWidth}
        sliderHeight={screenWidth}
        itemWidth={screenWidth - 60}
        data={entries}
        renderItem={renderItem}
        hasParallaxImages={true}
      />
      <View style={{marginHorizontal: 50}}>
        <TouchableOpacity
          style={{
            paddingHorizontal: 20,
            paddingVertical: 10,
            backgroundColor: '#d13',
          }}
          onPress={()=>{
            // console.log(route.params);
            console.log(ENTRIES1[carouselRef.current._activeItem]);
            navigation.navigate('DisplayVideo',{value:{image:ENTRIES1[carouselRef.current._activeItem],video:`file://${route.params.croppedURL}`}});
          }}
          >
          <Text style={{color: 'white', textAlign: 'center'}}>
            SET IMAGE AS KEYFRAME
          </Text>
        </TouchableOpacity>
      </View>
      <Text
        style={{marginVertical: 10, textAlign: 'center', fontWeight: 'bold'}}>
        {/* {carouselRef.getPositionIndex} */}
      </Text>
    </View>
  );
};

export default MyCarousel;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 75,
  },
  item: {
    width: screenWidth - 60,
    height: screenWidth - 60,
  },
  imageContainer: {
    flex: 1,
    marginBottom: Platform.select({ios: 0, android: 1}), // Prevent a random Android rendering issue
    backgroundColor: 'white',
    borderRadius: 8,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
  },
});

