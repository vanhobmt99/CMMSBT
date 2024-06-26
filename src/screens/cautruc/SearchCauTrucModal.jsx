import React, { useState } from 'react';
import { View, Modal, Alert, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Text } from 'react-native-paper';

const SearchCauTrucModal = ({ visible, onClose, onSearch }) => {
     
    const [isLoading, setIsLoading] = useState(false);
    const [keyword, setKeyword] = useState("");

    const handleSearch = async () => {
        try {
            setIsLoading(true);
            await onSearch(keyword);          
            onClose(true, { keyword });                           
        } catch (error) {
            console.error("Lỗi trong khi tìm kiếm:", error);
            Alert.alert('Tìm kiếm lỗi', error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = async () => {
        try {
            setIsLoading(true);
            setKeyword(""); 
        } catch (error) {
            console.error("Lỗi trong khi xóa:", error);
            Alert.alert('Xóa lỗi', error.message);
        } finally {
            setIsLoading(false);
        }
    };

  return (
    <View style={styles.container}>
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}>
            <View style={styles.container_modal}>
                <View style={styles.container_poup}>                    
                    {isLoading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#0000ff" />
                            <Text>Loading...</Text>
                        </View>
                        ) : (
                         <>
                            <View style={styles.buttonContainer}>
                                <Icon name='close' size={20} onPress={onClose} style={styles.closeButton} />
                            </View>                           
                            <View style={{ height: 10 }}></View>
                            <View style={styles.inputContainer}>
                                <Text>Từ khóa:</Text>
                                <TextInput
                                    placeholder="Tìm theo thành phần chính, xuất xứ"
                                    value={keyword}
                                    onChangeText={setKeyword}
                                    style={styles.text_input}
                                />
                            </View>                            
                            <View style={styles.row}>
                                
                                <TouchableOpacity style={styles.btnButtons} onPress={handleSearch}>
                                    <Icon name="magnify" color="#fff" size={18} />
                                    <Text style={styles.btnText}>Tìm kiếm</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.btnButtonDel} onPress={handleCancel}>
                                    <Icon name="close" color="#fff" size={18} />
                                    <Text style={styles.btnText}>Xóa bộ lọc</Text>
                                </TouchableOpacity>

                            </View>                            
                        </>
                    )} 
                </View>
            </View>
        </Modal>
    </View>
  );
};

export default SearchCauTrucModal;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',       
    },
    container_modal: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',        
    },
    container_poup: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 10,       
        width: '96%',      
    },
    text_input: {
        borderBottomWidth: 1,
        borderColor: '#ccc',
        marginBottom: 10,
        paddingVertical: 5,
    },
    bottom_padding: {
        marginBottom: 5
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',       
        marginBottom: 5
    },
    btnButton: {    
        flex : 2,
        position: 'absolute', // Đặt vị trí tuyệt đối
        right: 0, // Đặt cách lề trái
        top: 0, // Đặt cách lề trên (nếu muốn)   
        //width: '200', // Đặt chiều rộng
        height: 28, // Đặt chiều cao
        borderColor: 'blue',
        borderRadius: 2,           
        borderWidth: 0,   
        backgroundColor: '#4169e1'
    }, 
    row: {
        marginTop: 5,      
        flexDirection: 'row',
        height: 50,
        alignItems: 'center',
    },
    btnButtons: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        backgroundColor: '#2755ab', 
        borderRadius: 5,               
    },
    btnButtonDel: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        backgroundColor: '#f48859', 
        borderRadius: 5,
        marginLeft: 8, 
    },    
    btnText: {
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 5, // Adjust spacing as needed
    },
    submitText : {
        fontSize : 14,
        fontWeight : 'bold',
        color : 'white',
        alignSelf : 'center',
        marginVertical : 3,
        paddingLeft: 10,
        paddingRight: 10
    },
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },       
    closeButton: {
        padding: 2,
        backgroundColor: '#cccccc',
        fontWeight: 'bold',
        color: '#000',
        borderRadius: 3, 
    },
    textInput: {
        backgroundColor: '#BFBFBF',
        width: '80%',
        borderRadius: 5,
        height: 50,
        fontSize: 20,
        fontWeight: 'bold',
        paddingHorizontal: 10,
      },
    
});