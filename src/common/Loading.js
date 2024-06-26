import React from 'react';
import {Text, View, StyleSheet, ActivityIndicator, Dimensions} from 'react-native';

const { width, height } = Dimensions.get('window');

export function Loading()
{
    return(
        <View style={styles.loading}>
            <View style = {styles.modal}>
            <ActivityIndicator size="large" animating={true} color={"#0000ff"} style ={{marginBottom : 10}}>
            </ActivityIndicator>
            <Text>Đang xử lý...</Text>
            </View>                  
        </View>
    )  
}

const styles = StyleSheet.create({
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center', 
    backgroundColor: 'rgba(0,0,0,0.5)',  
  },
  modal : {
    backgroundColor : '#f0f8ff', 
    width : width - 150, 
    height : height / 5, 
    alignItems : 'center', 
    justifyContent : 'center'
  }
});