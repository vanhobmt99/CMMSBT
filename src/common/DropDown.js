import React, {useState} from 'react';
import {View, Text, Modal, TouchableOpacity, SafeAreaView, StyleSheet} from 'react-native';
import {ModalPicker} from '../common/ModalPicker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export function DropDown (props)
{
    const initialValue = {
        value : (props.defaultValue != null) 
        ? 
        props.defaultValue 
        : 
        'Chọn nội dung'
    };

    const [chooseData, setChooseData] = useState(initialValue);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const changeModalVisible = (bool) => {
        setIsModalVisible(bool);
    }

    const setData = (option) => {
        setChooseData({key : option.key, value : option.value});

        props.setValueDropDown(option.key);
    }   

    return(
        <SafeAreaView style = {styles.container}>
            <TouchableOpacity 
                style = {styles.touchableOpactity}
                onPress = {() => changeModalVisible(true)}
            >
                <Text style = {styles.text}>{chooseData.value}</Text>
                <View style = {{flex : 1, alignItems : 'flex-end'}}>
                    <MaterialCommunityIcons name="chevron-down" size={20} />
                </View>             
            </TouchableOpacity>
            <Modal            
                transparent = {true}
                animationType = 'fade'
                visible = {isModalVisible}
                onRequestClose = {() => changeModalVisible(false)}
            >
                <ModalPicker 
                    changeModalVisible = {changeModalVisible}
                    setData = {setData}
                    list = {props.list}
                />
            </Modal>
        </SafeAreaView>
    );
} 
const styles = StyleSheet.create({
    container : {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        //padding: 20,
    },
    touchableOpactity : {
        width : '100%',
        flexDirection : 'row',
        paddingHorizontal : 10,
        //backgroundColor : '#fffaf0',
        //height : '70%',
        alignItems : 'center',
        justifyContent : 'center',
        borderWidth: 1,
        borderColor: '#CCCCCC',
        borderRadius: 5,
        padding: 8,
    },
    text : {
        fontSize : 15
    },
});
