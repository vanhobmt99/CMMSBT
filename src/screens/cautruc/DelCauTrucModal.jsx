import React, { useState } from 'react';
import { View, Modal, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Text } from 'react-native-paper';
import { GlobalContext } from '../../store/GlobalProvider';
import { deleteByCauTrucThietBiID } from '../../api/Api_CauTruc';

const DelCauTrucModal = ({ visible, onClose, onSearch, cauTrucThietBiId }) => {

    const base_url = React.useContext(GlobalContext).url;
    const [keyword] = useState(""); 

    const handleDelete = async () => {
        try {
            const response = await deleteByCauTrucThietBiID(base_url, cauTrucThietBiId);
            if (response.resultCode) {             
                await onSearch(keyword);
                Alert.alert('Kết quả', `Xóa thành công cấu trúc của thiết bị với ID: ${cauTrucThietBiId}`);
                onClose(true); // Indicate success
            } else {
                Alert.alert('Lỗi', response.message || 'Xóa không thành công, vui lòng thử lại');
                onClose(false); // Indicate failure               
            }
        } catch (error) {
            console.error("Lỗi trong khi xóa:", error);
            Alert.alert('Xóa lỗi', 'Đã có lỗi xảy ra trong quá trình xóa, vui lòng thử lại sau');
            onClose(false); // Indicate failure           
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
                    <View style={styles.buttonContainer}>
                        <Icon name='close' size={20} onPress={onClose} style={styles.closeButton} />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={{ fontWeight: 'bold' }}>Bạn có chắc chắn muốn xóa item này không?</Text>                                
                    </View>                            
                    <View style={styles.row}>
                        <TouchableOpacity style={styles.btnButtonDel} onPress={onClose}>
                            <Icon name="debug-step-over" color="#fff" size={18} />
                            <Text style={styles.btnText}>Hủy</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btnButtons} onPress={handleDelete}>
                            <Icon name="delete-forever-outline" color="#fff" size={18} />
                            <Text style={styles.btnText}>Xóa</Text>
                        </TouchableOpacity>
                    </View>                                                  
                </View>
            </View>
        </Modal>
    </View>
  );
};

export default DelCauTrucModal;

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
    btnButtonDel: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        backgroundColor: '#f48859', 
        borderRadius: 5,
    },
    btnButtons: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        backgroundColor: '#2755ab', 
        borderRadius: 5,
        marginLeft: 8,        
    },
    btnText: {
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 5, // Adjust spacing as needed
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
    
});