import React, { useState, useEffect } from 'react';
import { View, Modal, Alert, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Text } from 'react-native-paper';
import { GlobalContext } from '../../store/GlobalProvider';
import { postEditNhacViec } from '../../api/Api_CongViec';
import { getValidString, getValidNumber } from '../../common/CommonFunction';
import { useNavigation } from '@react-navigation/native';

const { height } = Dimensions.get('window');

const NhacViecModal = ({ visible, onClose, macv, nhacviec }) => {

    const base_url = React.useContext(GlobalContext).url;
    const [isLoading, setIsLoading] = useState(false);
    const [formState, setFormState] = useState({
        macv: 0,        
        nhacviec: null,       
    });  

    const navigation = useNavigation();

    const handleChange = (name, value) => {
        setFormState(prevState => ({
          ...prevState,
          [name]: value
        }));
      };

    useEffect(() => {
       setFormState({ macv: macv, nhacviec: nhacviec });
    }, [macv, nhacviec]);

    const handleSubmit = async () => {
        if (!formState.nhacviec) {
            Alert.alert("Thông báo lỗi", "Nội dung nhắc việc là trường bắt buộc!");            
            return;
        }

        try {
            setIsLoading(true);       
            const formData = new FormData();
            formData.append('macv', getValidNumber(macv));
            formData.append('nhacviec', getValidString(formState.nhacviec));

            const response = await postEditNhacViec(base_url, formData);
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
        setFormState({ macv: 0, nhacviec: null });    
    };

    const InputGroup = ({ label, required, value, onChangeText, placeholder, multiline, numberOfLines, keyboardType }) => (
        <View style={styles.inputGroup}>
            <View style={styles.labelContainer}>
                <Text style={styles.label}>{label}:</Text>
                {required && <Text style={styles.required}>(*)</Text>}
            </View>
            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                multiline={multiline}
                numberOfLines={numberOfLines}
                style={[styles.textInput, multiline && styles.multilineTextInput]}
                keyboardType={keyboardType}
            />
        </View>
    );

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
                            <InputGroup
                                label="Nội dung"
                                required
                                value={formState.nhacviec}
                                onChangeText={(value) => handleChange('nhacviec', value)}
                                multiline = {true}                                
                                //placeholder="Vui lòng thực hiện công việc mình được giao"                                 
                            />                                
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

export default NhacViecModal;

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
    bottom_padding: {
        marginBottom: 5
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',       
        marginBottom: 5
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
    btnText: {
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 5, // Adjust spacing as needed
    },    
    inputGroup: {
        marginBottom: 10,
    },
    labelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    label: {
        fontWeight: 'bold',
        marginRight: 5,
    },
    required: {
        color: 'red',
    },   
    multilineTextInput: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor: '#fff',
        height: height/10, // Độ cao tăng lên cho TextInput đa dòng
        textAlignVertical: 'top', // Căn chỉnh văn bản lên trên cho TextInput đa dòng
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
        fontSize: 15,
        paddingHorizontal: 10,
    },    
});

