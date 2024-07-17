import React, { useState, useEffect } from 'react';
import { View, Modal, Alert, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SelectList } from 'react-native-dropdown-select-list';
import { Text } from 'react-native-paper';
import { GlobalContext } from '../../store/GlobalProvider';
import { postEditTrangThai } from '../../api/Api_CongViec';
import Toast from 'react-native-toast-message';
import { getValidNumber } from '../../common/CommonFunction';
import { useNavigation } from '@react-navigation/native';

const TrangThaiModal = ({ visible, onClose, macv, trangthai }) => {

    const base_url = React.useContext(GlobalContext).url;
    const [isLoading, setIsLoading] = useState(false);    
    const [tentrangthai, setTenTrangThai] = useState(null);  
    const [formState, setFormState] = useState({
        macv: 0,        
        trangthai: 0,       
    });  

    const navigation = useNavigation();

    useEffect(() => {
       setFormState({ macv: macv, trangthai: trangthai });
    }, [macv, trangthai]);

    const handleSubmit = async () => {
        if (!formState.trangthai || parseInt(formState.trangthai, 10) === 0) {
            Alert.alert("Thông báo lỗi","Trạng thái là trường bắt buộc!");            
            return;
        }

        try {
            setIsLoading(true);       
            const formData = new FormData();
            formData.append('macv', getValidNumber(macv));
            formData.append('trangthai', getValidNumber(formState.trangthai));

            const response = await postEditTrangThai(base_url, formData);
            if (response?.resultCode) {
                resetFormState();
                navigation.navigate("CongViecBaoTriScreen", { 
                    keyword: "",
                    trangthai: [],
                    loaicv: [],
                    manvth: [],
                    ngaybd: "",
                    ngaykt: ""
                });
            } else {
                console.log("Device data:", formData);
                console.log("Response:", response);
                Alert.alert("Error", "Lỗi trong khi cập nhật dữ liệu");
            }
        } catch (error) {
            console.error("Error:", error);
            Alert.alert('Error', error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const resetFormState = () => {
        setFormState({ macv: 0, trangthai: 0 });
        setTenTrangThai('');      
    };

    const dataStatusTT = [        
        { key: '1', value: 'Chưa phân công' },
        { key: '2', value: 'Đã phân công' },
        { key: '3', value: 'Đã nhận việc' },
        { key: '4', value: 'Đang thực hiện' },
        { key: '5', value: 'Hoàn thành' },
        { key: '6', value: 'Hoàn thành quá hạn' },
        { key: '7', value: 'Hoàn thành đúng hạn' },
        { key: '8', value: 'Chưa hoàn thành' },
        { key: '9', value: 'Tạm dừng' },
        { key: '10', value: 'Hủy' },
    ];

    const getDefaultOption = (id, data, defaultText = 'Tất cả') => {
        const allOptions = [{ key: '0', value: defaultText }, ...data];  
        const foundItem = allOptions.find(item => parseInt(item.key, 10) === parseInt(id, 10));
        return foundItem ? { key: id.toString(), value: foundItem.value } : { key: '0', value: defaultText };
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
                            <View style={styles.inputContainer}>                 
                                <Text>Trạng thái:</Text>
                                <View style={{marginTop:5}}>
                                    <SelectList
                                        setSelected={(key) => {
                                            const selectedStatus = dataStatusTT.find(item => parseInt(item.key, 10) === parseInt(key, 10));
                                            if (selectedStatus) {
                                                setFormState({ ...formState, trangthai: selectedStatus.key });
                                                setTenTrangThai(selectedStatus.value);
                                            }
                                        }}
                                        data={dataStatusTT}
                                        defaultOption={getDefaultOption(formState.trangthai, dataStatusTT, tentrangthai)}
                                        save="key"
                                        placeholder="Tất cả"
                                        searchPlaceholder="Từ khóa"
                                        boxStyles={styles.selectBox}
                                        dropdownStyles={styles.dropdown}
                                    />                                                                
                                </View>         
                            </View>                               
                            <View style={styles.row}>

                                <TouchableOpacity style={styles.btnButtons} onPress={handleSubmit}>
                                    <Icon name="content-save-edit-outline" color="#fff" size={18} />
                                    <Text style={styles.btnText}>Cập nhật</Text>
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

export default TrangThaiModal;

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
    selectBox: {
        borderWidth: 1,
        borderColor: '#CCCCCC',
        borderRadius: 5,
        padding: 8,
    },
    dropdown: {
        borderWidth: 1,
        borderColor: '#CCCCCC',
        borderRadius: 5,
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
    label: {
        marginBottom: 5,
        //fontWeight: 'bold',
    },
    datePickerContainer: {
        marginBottom: 10,
    },
    datePicker: {
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 4,
        paddingHorizontal: 8,
    },
    dateText: {
        fontSize: 14,
    },
    dateIcon: {
        marginLeft: 8,
    },
});