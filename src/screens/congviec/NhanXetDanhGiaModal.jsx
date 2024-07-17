import React, { useState, useEffect, useContext } from 'react';
import { View, Modal, Alert, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SelectList } from 'react-native-dropdown-select-list';
import { Text } from 'react-native-paper';
import { GlobalContext } from '../../store/GlobalProvider';
import { postEditNhanXetDanhGia } from '../../api/Api_CongViec';
import { getValidString, getValidNumber } from '../../common/CommonFunction';
import { useNavigation } from '@react-navigation/native';

const { height } = Dimensions.get('window');

const NhanXetDanhGiaModal = ({ visible, onClose, macv, tiendo, tiendodg, chatluong, nhanxet }) => {

    const base_url = useContext(GlobalContext).url;
    const [isLoading, setIsLoading] = useState(false);
    const [phantram, setPhanTram] = useState(null);
    const [tentiendodg, setTenTienDoDG] = useState(null); 
    const [tenchatluong, setTenChatLuong] = useState(null);   

    const [formState, setFormState] = useState({
        macv: 0,        
        tiendo: 0, 
        tiendodg: 0, 
        chatluong: 0, 
        nhanxet: null       
    });  

    const navigation = useNavigation();

    const handleChange = (name, value) => {
        setFormState(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const percentOptions = Array.from({ length: 101 }, (_, i) => ({ key: i.toString(), value: i.toString() }));

    useEffect(() => {
       setFormState({ macv, tiendo, tiendodg, chatluong, nhanxet });
    }, [macv, tiendo, tiendodg, chatluong, nhanxet]);

    const handleSubmit = async () => {
        if (
            (!formState.tiendodg || parseInt(formState.tiendodg, 10) === 0) || 
            (!formState.chatluong || parseInt(formState.chatluong, 10) === 0)
        ) {
            Alert.alert("Thông báo lỗi", "Tiến độ, chất lượng là trường bắt buộc!");            
            return;
        }
    
        try {
            setIsLoading(true);   

            const formData = new FormData();
            formData.append('macv', getValidNumber(macv));
            formData.append('tiendo', getValidNumber(formState.tiendo));
            formData.append('tiendodg', getValidNumber(formState.tiendodg));
            formData.append('chatluong', getValidNumber(formState.chatluong));
            formData.append('nhanxet', getValidString(formState.nhanxet));
    
            const response = await postEditNhanXetDanhGia(base_url, formData);
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
        setFormState({ 
            macv: 0,        
            tiendo: 0, 
            tiendodg: 0, 
            chatluong: 0, 
            nhanxet: null
        });    
    };

    const dataStatusTD = [        
        { key: '1', value: 'Đúng hạn' },
        { key: '2', value: 'Quá hạn' },       
    ];

    const dataStatusCL = [        
        { key: '1', value: 'Xuất sắc' },
        { key: '2', value: 'Đạt' },     
        { key: '3', value: 'Không đạt' },  
    ];

    const getDefaultOption = (id, data, defaultText = 'Chưa đánh giá') => {
        const allOptions = [{ key: '0', value: defaultText }, ...data];  
        const foundItem = allOptions.find(item => parseInt(item.key, 10) === parseInt(id, 10));
        return foundItem ? { key: id.toString(), value: foundItem.value } : { key: '0', value: defaultText };
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
                            <View style={styles.inputContainer}>                 
                                <View style={styles.labelContainer}>
                                    <Text style={styles.label}>Phần trăm tiến độ:</Text>                                    
                                </View>
                                <View style={{marginTop:5}}>
                                    <SelectList
                                        setSelected={(key) => {
                                            const selectedPercent = percentOptions.find(item => parseInt(item.key, 10) === parseInt(key, 10));
                                            if (selectedPercent) {
                                                setFormState({ ...formState, tiendo: selectedPercent.key });
                                                setPhanTram(selectedPercent.value);
                                            }
                                        }}
                                        data={percentOptions}
                                        defaultOption={getDefaultOption(formState.tiendo, percentOptions, phantram)}
                                        save="key"
                                        boxStyles={styles.selectBox}
                                        dropdownStyles={styles.dropdown}
                                    />                                                             
                                </View>         
                            </View>    

                            <View style={{ height: 10 }}></View> 

                            <View style={styles.inputContainer}>                 
                                <View style={styles.labelContainer}>
                                    <Text style={styles.label}>Tiến độ:</Text>
                                    <Text style={styles.required}>(*)</Text>
                                </View>
                                <View style={{marginTop:5}}>
                                    <SelectList
                                        setSelected={(key) => {
                                            const selectedStatusTD = dataStatusTD.find(item => parseInt(item.key, 10) === parseInt(key, 10));
                                            if (selectedStatusTD) {
                                                setFormState({ ...formState, tiendodg: selectedStatusTD.key });
                                                setTenTienDoDG(selectedStatusTD.value);
                                            }
                                        }}
                                        data={dataStatusTD}
                                        defaultOption={getDefaultOption(formState.tiendodg, dataStatusTD, tentiendodg)}
                                        save="key"
                                        placeholder="Chưa đánh giá"
                                        searchPlaceholder="Từ khóa"
                                        boxStyles={styles.selectBox}
                                        dropdownStyles={styles.dropdown}
                                    />                                                                
                                </View>         
                            </View>  

                            <View style={{ height: 10 }}></View> 

                            <View style={styles.inputContainer}>                 
                                <View style={styles.labelContainer}>
                                    <Text style={styles.label}>Chất lượng:</Text>
                                    <Text style={styles.required}>(*)</Text>
                                </View>
                                <View style={{marginTop:5}}>
                                    <SelectList
                                        setSelected={(key) => {
                                            const selectedStatusCL = dataStatusCL.find(item => parseInt(item.key, 10) === parseInt(key, 10));
                                            if (selectedStatusCL) {
                                                setFormState({ ...formState, chatluong: selectedStatusCL.key });
                                                setTenChatLuong(selectedStatusCL.value);
                                            }
                                        }}
                                        data={dataStatusCL}
                                        defaultOption={getDefaultOption(formState.chatluong, dataStatusCL, tenchatluong)}
                                        save="key"
                                        placeholder="Chưa đánh giá"
                                        searchPlaceholder="Từ khóa"
                                        boxStyles={styles.selectBox}
                                        dropdownStyles={styles.dropdown}
                                    />                                                                
                                </View>         
                            </View> 

                            <View style={{ height: 10 }}></View>      

                            <InputGroup
                                label="Nhận xét"                               
                                value={formState.nhanxet}
                                onChangeText={(value) => handleChange('nhanxet', value)}
                                multiline = {true}                                 
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

export default NhanXetDanhGiaModal;

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
    inputGroup: {
        marginBottom: 10,
    },
    labelContainer: {
        flexDirection: 'row',
        alignItems: 'center',       
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

