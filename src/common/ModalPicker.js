import React, {useState, useRef} from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Dimensions, ScrollView} from 'react-native';
import { Searchbar} from 'react-native-paper';
import {nonAccentVietnamese} from '../common/CommonFunction';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;


export function ModalPicker(props)
{
    var OPTIONS = [{}];

    const [searchKey, setSearchKey] = useState('');
    const [list_temp, setList_Temp] = useState([]);

    OPTIONS = props.list;

    const onPressItemOption = (option) =>{
        props.changeModalVisible(false);
        props.setData({key : option.key, value : option.value});
    }
    const search_FromDropDownList = (str) => {
        const filtered = OPTIONS.filter(
            item => 
            item.value.toUpperCase().includes(str.toUpperCase())
        );
        setList_Temp(filtered);
    }

    const options = OPTIONS.map((item, index) => {
        return(
            <View key = {item.key}>
                <View 
                    style = {styles.wrapper} 
                />
                <TouchableOpacity
                    style = {styles.option}
                    onPress = {() => onPressItemOption(item)}                     
                >  
                    <Text style = {[styles.text, {flex : 10}]}>
                        {item.value}
                    </Text>                    
                </TouchableOpacity>
                {
                    index == OPTIONS.length - 1
                    ?
                        <View 
                            style = {styles.wrapper}
                        />
                    :
                    null
                }
                
            </View>
            
        );
    });

    const list = list_temp.map((item, index) => {
        return(
            <View key = {item.key}>
                <View 
                    style = {styles.wrapper} 
                />
                <TouchableOpacity
                    style = {styles.option}
                    onPress = {() => onPressItemOption(item)}                     
                >  
                    <Text style = {[styles.text, {flex : 10}]}>
                        {item.value}
                    </Text>                    
                </TouchableOpacity>
                {
                    index == list_temp.length - 1
                    ?
                        <View 
                            style = {styles.wrapper}
                        />
                    :
                    null
                }
                
            </View>
            
        );
    });

    return(        
        <TouchableOpacity style = {styles.container} onPress = {() => {
            props.changeModalVisible(false);
        }}>
            <View style = {[styles.modal, {width : WIDTH - 20, height : HEIGHT/2}]}>
                <Searchbar
                    placeholder="Search"  
                    onChangeText = {(text) => {
                        setSearchKey(text);
                        search_FromDropDownList(text);
                    }}
                />
                <ScrollView>                    
                    {
                        searchKey == '' 
                        ?
                        options
                        :
                        list
                    }
                </ScrollView>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container : {
        flex : 1, 
        alignItems : 'center',
        justifyContent : 'center',
    },
    modal : {
        // backgroundColor : 'white',
        backgroundColor : '#fffaf0',
        borderRadius : 5,
        borderColor: '#000000',
        borderWidth: 1,
    },
    option : {
        flexDirection : 'row',
    },
    text : {
        margin : 10,
        fontSize : 14,
        fontWeight : 'bold',
    },
    wrapper: {
        borderBottomColor: '#dcdcdc',
        borderBottomWidth: 1,
    }
});