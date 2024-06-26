import React, { useState, useEffect, useCallback } from 'react';
import { View, Modal, Alert, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator  } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MultipleSelectList } from 'react-native-dropdown-select-list';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text } from 'react-native-paper';
import moment from 'moment';
import { GlobalContext } from '../../store/GlobalProvider';
import { 
    getListNhanVienTH
} from '../../api/Api_CongViec';

const SearchCongViecModal = ({ visible, onClose, onSearch }) => {

    const base_url = React.useContext(GlobalContext).url;      
    const [isLoading, setIsLoading] = useState(false);
    const [keyword, setKeyword] = useState("");          
    const [trangthai, setTrangThai] = useState([]);
    const [loaicv, setLoaiCV] = useState([]);
    const [manvth, setMaNVTH] = useState([]);
    const [ngaybd, setNgayBD] = useState("");
    const [ngaykt, setNgayKT] = useState("");
    const [isDatePickerVisible1, setDatePickerVisibility1] = useState(false);
    const [isDatePickerVisible2, setDatePickerVisibility2] = useState(false);
    const [data, setData] = useState([]);  

    const showDatePicker = (setter) => setter(true);
    const hideDatePicker = (setter) => setter(false);

    const handleConfirmDate = (date, setter, hideSetter) => {    
        setter(date);     
        hideSetter(false);
    };
    const formatDate = (date) => (date ? moment(date).format("DD-MM-YYYY") : "Chọn ngày");

    const splitDate = (dateString) => {
        if (!dateString) return { day: null, month: null, year: null };
        const [day, month, year] = dateString.split('-');
        return { day, month, year };
    };
      
    const getFormattedDate = (date) => {
        const { day, month, year } = splitDate(formatDate(date));
        return date ? `${day}/${month}/${year}` : null;
    };     

    const dataStatusTT = [        
        {key:'1', value:'Chưa phân công'},
        {key:'2', value:'Đã phân công'},
        {key:'3', value:'Đã nhận việc'},
        {key:'4', value:'Đang thực hiện'},
        {key:'5', value:'Hoàn thành'},
        {key:'6', value:'Hoàn thành quá hạn'},
        {key:'7', value:'Hoàn thành đúng hạn'},
        {key:'8', value:'Chưa hoàn thành'},
        {key:'9', value:'Tạm dừng'},
        {key:'10', value:'Hủy'},
    ]

    const dataStatusLoaiCV = [        
        {key:'1', value:'Định kỳ'},
        {key:'2', value:'Đột xuất'},
        {key:'3', value:'Dự án'},
        {key:'4', value:'Hằng ngày'},
    ]    

    const fetchNhanVienTH = useCallback(async () => {
        try {
            const userMaDonVi = await AsyncStorage.getItem('userMaDonVi');
            const response = await getListNhanVienTH(base_url, parseInt(userMaDonVi, 10));
            if (response && response.resultCode === true) {               
                setData(response.data);
            }
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    }, [base_url]);

    useEffect(() => {
        setIsLoading(true);        
        fetchNhanVienTH().finally(() => setIsLoading(false));        
    }, [fetchNhanVienTH]);

    const handleSearch = async () => {
        try {
            setIsLoading(true);    
            // Format dates only if they exist
            let bd = ngaybd ? getFormattedDate(ngaybd) : "";
            let kt = ngaykt ? getFormattedDate(ngaykt) : "";    
            // Perform search with the given parameters
            await onSearch(keyword, trangthai, loaicv, manvth, bd, kt);
            // Clear state
            resetFormState(); 
            // Fetch updated data
            await fetchNhanVienTH();     
            // Trigger close with parameters
            onClose(true, { keyword, trangthai, loaicv, manvth, ngaybd, ngaykt });                           
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
            // Clear state
            resetFormState();    
            // Fetch updated data
            await fetchNhanVienTH();
        } catch (error) {
            console.error("Lỗi trong khi xóa:", error);
            Alert.alert('Xóa lỗi', error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const resetFormState = () => {
        setKeyword("");            
        setTrangThai([]); 
        setLoaiCV([]); 
        setMaNVTH([]); 
        setNgayBD("");
        setNgayKT("");
        setData([]);   
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
                                <Text>Từ khóa:</Text>
                                <TextInput
                                    placeholder="Tìm theo: nội dung bảo trì, sửa chữa"
                                    value={keyword}
                                    onChangeText={setKeyword}
                                    style={styles.text_input}
                                />
                            </View>
                            <View style={styles.inputContainer}>                 
                                <Text>Trạng thái:</Text>
                                <View style={{marginTop:5}}>
                                    <MultipleSelectList setSelected={setTrangThai} data={dataStatusTT} placeholder='Chọn trạng thái' />                           
                                </View>         
                            </View>
                            <View style={styles.inputContainer}>                 
                                <Text>Loại công việc:</Text>
                                <View style={{marginTop:5}}>
                                    <MultipleSelectList setSelected={setLoaiCV} data={dataStatusLoaiCV} placeholder='Chọn loại công việc' />                           
                                </View>         
                            </View>
                            <View style={styles.inputContainer}>                 
                                <Text>Người thực hiện:</Text>
                                <View style={{marginTop:5}}>
                                    <MultipleSelectList setSelected={setMaNVTH} data={data}  placeholder='Chọn người thực hiện'  />                           
                                </View>         
                            </View>        
                            <View style={styles.datePickerContainer}>
                                <Text style={styles.label}>Ngày bắt đầu</Text>
                                <TouchableOpacity onPress={() => showDatePicker(setDatePickerVisibility1)} style={styles.datePicker}>
                                    <Text style={styles.dateText}>{formatDate(ngaybd)}</Text>
                                    <Icon name="calendar" size={26} color="#000" style={styles.dateIcon} />
                                </TouchableOpacity>
                                <DateTimePickerModal
                                    isVisible={isDatePickerVisible1}
                                    mode="date"
                                    onConfirm={(date) => handleConfirmDate(date, setNgayBD, setDatePickerVisibility1)}
                                    onCancel={() => hideDatePicker(setDatePickerVisibility1)}
                                />
                            </View>
                            <View style={styles.datePickerContainer}>
                                <Text style={styles.label}>Ngày kết thúc</Text>
                                <TouchableOpacity onPress={() => showDatePicker(setDatePickerVisibility2)} style={styles.datePicker}>
                                    <Text style={styles.dateText}>{formatDate(ngaykt)}</Text>
                                    <Icon name="calendar" size={26} color="#000" style={styles.dateIcon} />
                                </TouchableOpacity>
                                <DateTimePickerModal
                                    isVisible={isDatePickerVisible2}
                                    mode="date"
                                    onConfirm={(date) => handleConfirmDate(date, setNgayKT, setDatePickerVisibility2)}
                                    onCancel={() => hideDatePicker(setDatePickerVisibility2)}
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

export default SearchCongViecModal;

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