import React, { useState, useEffect, useContext, useCallback, useRef } from 'react';
import { View, 
    Text,
    Alert, 
    TextInput, 
    TouchableOpacity, 
    StyleSheet, 
    ScrollView, 
    Dimensions, 
    ActivityIndicator 
} from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';
import { getValidString, getValidNumber} from '../../common/CommonFunction';
import { GlobalContext } from '../../store/GlobalProvider';
import { 
  getListThietBiByDonVi,
  getListDonViTinh,
  getListNhanVienTH,
  getListNhanVienKT, 
  postPutCongViecBaoTri  
 } from '../../api/Api_CongViec';

const { width } = Dimensions.get('window');

const AddEditCongViecScreen = ({ route, navigation }) => {

  const base_url = useContext(GlobalContext).url;
  const [isLoading, setIsLoading] = useState(false);

  const [tenthietbi, setTenThietBi] = useState('');
  const [tenloaicv, setTenLoaiCV] = useState('');
  const [tentrangthai, setTenTrangThai] = useState('');
  const [tenloaikh, setTenLoaiKH] = useState('');
  const [tendouutien, setTenDoUuTien] = useState('');
  const [tennvth, setTenNhanVienTH] = useState('');
  const [tennvkt, setTenNhanVienKT] = useState('');

  const [isDatePickerVisible1, setDatePickerVisibility1] = useState(false);
  const [isDatePickerVisible2, setDatePickerVisibility2] = useState(false);

  const [datathietbi, setDataThietBi] = useState([]);  
  const [dataloaicv, setDataLoaiCV] = useState([]);
  const [datatt, setDataTrangThai] = useState([]);
  const [dataloaikh, setDataLoaiKH] = useState([]);
  const [datadouutien, setDataDoUuTien] = useState([]);
  const [datanvth, setDataNhanVienTH] = useState([]);
  const [datanvkt, setDataNhanVienKT] = useState([]);
  const [datadvt, setDataDVT] = useState([]);

  const [formState, setFormState] = useState({
      macv: 0,
      matb: 0,
      tencv: null,
      loaicv: 0,
      loaikh: 0,
      ngaybd: null,
      ngaykt: null,
      trangthai: 0,
      tiendo: 0,
      douutien: 0,
      manvth: 0,
      manvkt: 0,
      noidung: null,
      ghichu: null
  }); 

  const handleChange = (name, value) => {
    setFormState(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  
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

  const richText = useRef();

  const richTextNoiDungHandle = useCallback((descriptionText) => {
    if (descriptionText) {
      handleChange('noidung', descriptionText);
    } else {
      handleChange('noidung', "");
    }
  }, []);

  useEffect(() => {
    if (route.params) {
      const {
        macv,
        matb,
        tentb,
        tencv,
        loaicv,
        tenloaicv,
        loaikh,
        tenloaikh,
        ngaybd,
        ngaykt,
        trangthai,
        tentrangthai,       
        douutien,
        tendouutien,
        manvth,
        tennvth,
        manvkt,
        tennvkt,
        noidung,
        ghichu
      } = route.params;

      setTenThietBi(tentb);
      setTenLoaiCV(tenloaicv);
      setTenTrangThai(tentrangthai);
      setTenLoaiKH(tenloaikh);
      setTenDoUuTien(tendouutien);
      setTenNhanVienTH(tennvth);
      setTenNhanVienKT(tennvkt);

      setFormState({
        macv,
        matb,
        tentb,
        tencv,
        loaicv,
        tenloaicv,
        loaikh,
        tenloaikh,
        ngaybd,
        ngaykt,
        trangthai,
        tentrangthai,      
        douutien,
        tendouutien,
        manvth,
        tennvth,
        manvkt,
        tennvkt,
        noidung,
        ghichu
      });
    }
  }, [route.params]);

  const handleBack = () => {
    try {
      setIsLoading(true);
      resetFormState();
      navigation.navigate('CongViecBaoTriScreen',  { 
        keyword: "",
        trangthai: [],
        loaicv: [],
        manvth: [],
        ngaybd: "",
        ngaykt: ""
      });
    } catch (error) {
      console.error("Error:", error);
      Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    
    if (!formState.tencv) {
      Toast.show({
        type: 'error',
        text1: 'Vui lòng điền đầy đủ các thông tin',
        text2: 'Thành phần chính và thông số kỹ thuật là các trường bắt buộc!',
      });
      setShowDescError(true);
      return;
    }

    try {
      setIsLoading(true);            
      const formData = new FormData();

      formData.append('matb', getValidNumber(formState.matb));
      formData.append('tencv', getValidString(formState.tencv));
      formData.append('loaicv', getValidNumber(formData.loaicv));
      formData.append('loaikh', getValidNumber(formData.loaikh));
      formData.append('ngaybd', getFormattedDate(formData.ngaybd));
      formData.append('ngaykt', getFormattedDate(formData.ngaykt));
      formData.append('trangthai', getValidNumber(formData.trangthai));
      formData.append('douutien', getValidNumber(formData.douutien));
      formData.append('manvth', getValidNumber(formData.manvth));
      formData.append('manvkt', getValidNumber(formData.manvkt));
      formData.append('noidung', getValidString(formState.noidung));
      formData.append('ghichu', getValidString(formState.ghichu));
      
      const response = await postPutCongViecBaoTri(base_url, formData);
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
        matb: 0,
        tentb: null,
        tencv: null,
        loaicv: 0,
        tenloaicv: null,
        loaikh: 0,
        tenloaikh: null,
        ngaybd: null,
        ngaykt: null,
        trangthai: 0,
        tentrangthai: null,       
        douutien: 0,
        tendouutien: null,
        manvth: 0,
        tennvth: null,        
        manvkt: 0,
        tennvkt: null,
        noidung: null,
        ghichu: null
      });

      setTenThietBi('');
      setTenLoaiCV('');
      setTenTrangThai('');
      setTenLoaiKH('');
      setTenDoUuTien('');
      setTenNhanVienTH('');
      setTenNhanVienKT('');

  };

  // Load List All Thiết Bị By Đơn Vị
  const fetchThietBi = async () => {
    try {
      const userMaDonVi = await AsyncStorage.getItem('userMaDonVi');
      const response = await getListThietBiByDonVi(base_url, parseInt(userMaDonVi, 10));
      if (response && response.resultCode === true) {
        setDataThietBi(response.data);            
      } else {
        setDataThietBi([]);
      }
    } catch (error) {
       console.error("Error fetching thiết bị: ", error);
    }
  };

  const dataStatusLoaiCV = [        
    {key:'1', value:'Định kỳ'},
    {key:'2', value:'Đột xuất'},
    {key:'3', value:'Dự án'},
    {key:'4', value:'Hằng ngày'},
  ] 

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

  const dataStatusLoaiKH = [        
    {key:'1', value:'Trong KH'},
    {key:'2', value:'Ngoài KH'},
  ] 

  const dataStatusDoUuTien = [        
    {key:'1', value:'Trung bình'},
    {key:'2', value:'Thấp'},
    {key:'3', value:'Cao'},
  ] 
     
  // Load List All Đơn Vị Tính
  const fetchDonViTinh = async () => {
    try {
        const response = await getListDonViTinh(base_url);
        if (response && response.resultCode === true) {
           setDataDVT(response.data);            
        } else {
           setDataDVT([]);
        }
    } catch (error) {
        console.error("Error fetching đơn vị tính: ", error);
    }
  };

  // Load List All Nhân Viên Thực Hiện By Đơn Vị
  const fetchNhanVienTH = async () => {
    try {
      const userMaDonVi = await AsyncStorage.getItem('userMaDonVi');
      const response = await getListNhanVienTH(base_url, parseInt(userMaDonVi, 10));
      if (response && response.resultCode === true) {
          setDataNhanVienTH(response.data);            
      } else {
          setDataNhanVienTH([]);
      }
    } catch (error) {
       console.error("Error fetching đơn vị tính: ", error);
    }
  };

  // Load List All Nhân Viên Thực Hiện By Đơn Vị
  const fetchNhanVienKT = async () => {
    try {
      const userMaDonVi = await AsyncStorage.getItem('userMaDonVi');
      const response = await getListNhanVienKT(base_url, parseInt(userMaDonVi, 10));
      if (response && response.resultCode === true) {
          setDataNhanVienKT(response.data);            
      } else {
          setDataNhanVienKT([]);
      }
    } catch (error) {
       console.error("Error fetching đơn vị tính: ", error);
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    await Promise.all([
      fetchThietBi(),
      fetchNhanVienTH(),
      fetchNhanVienKT()
    ]);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getDefaultOption = (id, data, defaultText = 'Tất cả') => {    
    const allOptions = [{ key: '0', value: defaultText }, ...data];  
    if (id !== null && id !== undefined && parseInt(id) !== 0) {
      const foundItem = allOptions.find(item => parseInt(item.key) === parseInt(id));
      if (foundItem) {
        return { key: id.toString(), value: foundItem.value };
      }
    }
  } 

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
            style={styles.textInput}
            keyboardType={keyboardType}
        />
    </View>
  );    

  return (
      <View style={styles.container}>
          <View style={styles.rowHeader}>
              <Icon name="chevron-left" color="#000" size={26} onPress={handleBack} />
              <Text style={styles.titleHeader}>Công Việc Bảo Trì</Text>
          </View>
          {isLoading ? (
              <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#0000ff" />
                  <Text>Loading...</Text>
              </View>
          ) : (
              <>
                  <ScrollView style={{ marginBottom: 50 }}>
                      <View style={styles.cardView}>
                          <View style={styles.cardViewContainer}>
                            <View style={styles.inputGroup}>
                              <View style={styles.labelContainer}>
                                <Text style={styles.label}>Thiết bị:</Text>
                                <Text style={styles.required}>(*)</Text> 
                              </View>
                              <SelectList
                                setSelected={setDataThietBi}
                                data={datathietbi}
                                defaultOption={getDefaultOption(formState.matb, datathietbi, tenthietbi)}                           
                                save="key"                                                 
                                placeholder="Tất cả"
                                searchPlaceholder="Từ khóa"
                                boxStyles={styles.selectBox}
                                dropdownStyles={styles.dropdown}
                              />
                            </View> 

                            <InputGroup
                                label="Nội dung bảo trì, sửa chữa"
                                required
                                value={formState.tencv}
                                onChangeText={(value) => handleChange(formState.tencv, value)}
                                placeholder="Nhập nội dung bảo trì, sửa chữa"                                 
                            /> 

                            <View style={styles.inputGroup}>
                              <View style={styles.labelContainer}>
                                <Text style={styles.label}>Loại công việc:</Text>
                                <Text style={styles.required}>(*)</Text> 
                              </View>
                              <SelectList
                                setSelected={setDataLoaiCV}
                                data={dataStatusLoaiCV}
                                defaultOption={getDefaultOption(formState.loaicv, dataStatusLoaiCV, tenloaicv)}                           
                                save="key"                                                 
                                placeholder="Tất cả"
                                searchPlaceholder="Từ khóa"
                                boxStyles={styles.selectBox}
                                dropdownStyles={styles.dropdown}
                              />
                            </View> 

                            <View style={styles.inputGroup}>
                              <View style={styles.labelContainer}>
                                <Text style={styles.label}>Trạng thái:</Text>
                                <Text style={styles.required}>(*)</Text> 
                              </View>
                              <SelectList
                                setSelected={setDataTrangThai}
                                data={dataStatusTT}
                                defaultOption={getDefaultOption(formState.trangthai, dataStatusTT, tentrangthai)}                           
                                save="key"                                                 
                                placeholder="Tất cả"
                                searchPlaceholder="Từ khóa"
                                boxStyles={styles.selectBox}
                                dropdownStyles={styles.dropdown}
                              />
                            </View>                               

                            <View style={styles.datePickerContainer}>
                                <View style={styles.labelContainer}>
                                  <Text style={styles.label}>Ngày bắt đầu:</Text>
                                  <Text style={styles.required}>(*)</Text>
                                </View> 
                                <TouchableOpacity onPress={() => showDatePicker(setDatePickerVisibility1)} style={styles.datePicker}>
                                  <Text style={styles.dateText}>{formatDate(formState.ngaybd)}</Text>
                                  <Icon name="calendar" size={26} color="#000" style={styles.dateIcon} />
                                </TouchableOpacity>
                                <DateTimePickerModal
                                  isVisible={isDatePickerVisible1}
                                  mode="date"
                                  onConfirm={(date) => handleConfirmDate(date, formState.ngaybd, setDatePickerVisibility1)}
                                  onCancel={() => hideDatePicker(setDatePickerVisibility1)}
                                />
                            </View>

                              <View style={styles.datePickerContainer}>
                                <View style={styles.labelContainer}>
                                  <Text style={styles.label}>Ngày kết thúc:</Text>
                                  <Text style={styles.required}>(*)</Text>
                                </View> 
                                <TouchableOpacity onPress={() => showDatePicker(setDatePickerVisibility2)} style={styles.datePicker}>
                                  <Text style={styles.dateText}>{formatDate(formState.ngaykt)}</Text>
                                  <Icon name="calendar" size={26} color="#000" style={styles.dateIcon} />
                                </TouchableOpacity>
                                <DateTimePickerModal
                                  isVisible={isDatePickerVisible2}
                                  mode="date"
                                  onConfirm={(date) => handleConfirmDate(date, formState.ngaykt, setDatePickerVisibility2)}
                                  onCancel={() => hideDatePicker(setDatePickerVisibility2)}
                                />
                              </View>

                              <View style={styles.inputGroup}>
                                <View style={styles.labelContainer}>
                                  <Text style={styles.label}>Loại kế hoạch:</Text>
                                  <Text style={styles.required}>(*)</Text> 
                                </View>
                                <SelectList
                                  setSelected={setDataLoaiKH}
                                  data={dataStatusLoaiKH}
                                  defaultOption={getDefaultOption(formState.loaikh, dataStatusLoaiKH, tenloaikh)}                           
                                  save="key"                                                 
                                  placeholder="Tất cả"
                                  searchPlaceholder="Từ khóa"
                                  boxStyles={styles.selectBox}
                                  dropdownStyles={styles.dropdown}
                                />
                              </View> 

                              <View style={styles.inputGroup}>
                                <View style={styles.labelContainer}>
                                  <Text style={styles.label}>Độ ưu tiên:</Text>
                                  <Text style={styles.required}>(*)</Text> 
                                </View>
                                <SelectList
                                  setSelected={setDataDoUuTien}
                                  data={dataStatusDoUuTien}
                                  defaultOption={getDefaultOption(formState.douutien, dataStatusDoUuTien, tendouutien)}                           
                                  save="key"                                                 
                                  placeholder="Tất cả"
                                  searchPlaceholder="Từ khóa"
                                  boxStyles={styles.selectBox}
                                  dropdownStyles={styles.dropdown}
                                />
                              </View>     

                              <View style={styles.inputGroup}>
                                <View style={styles.labelContainer}>
                                  <Text style={styles.label}>Nhân viên thực hiện:</Text>
                                  <Text style={styles.required}>(*)</Text> 
                                </View>
                                <SelectList
                                  setSelected={setDataNhanVienTH}
                                  data={datanvth}
                                  defaultOption={getDefaultOption(formState.manvth, datanvth, tennvth)}                           
                                  save="key"                                                 
                                  placeholder="Tất cả"
                                  searchPlaceholder="Từ khóa"
                                  boxStyles={styles.selectBox}
                                  dropdownStyles={styles.dropdown}
                                />
                              </View>  

                              <View style={styles.inputGroup}>
                                <View style={styles.labelContainer}>
                                  <Text style={styles.label}>Nhân viên kiểm tra:</Text>
                                  <Text style={styles.required}>(*)</Text> 
                                </View>
                                <SelectList
                                  setSelected={setDataNhanVienKT}
                                  data={datanvkt}
                                  defaultOption={getDefaultOption(formState.manvkt, datanvkt, tennvkt)}                           
                                  save="key"                                                 
                                  placeholder="Tất cả"
                                  searchPlaceholder="Từ khóa"
                                  boxStyles={styles.selectBox}
                                  dropdownStyles={styles.dropdown}
                                />
                              </View> 
                              <View style={styles.inputGroup}>
                                  <View style={styles.labelContainer}>
                                      <Text style={styles.label}>Công việc thực hiện:</Text>
                                  </View>
                                  <View style={styles.richTextContainer}>
                                      <RichEditor                                        
                                          ref={richText}
                                          onChange={richTextNoiDungHandle}
                                          maxLength={200}
                                          editorStyle={styles.richEditor}
                                          placeholder="Nhập công việc thực hiện"
                                          initialContentHTML={formState.noidung}                                          
                                          androidHardwareAccelerationDisabled={true}
                                          style={styles.richTextEditorStyle}
                                      />
                                      <RichToolbar
                                          editor={richText}
                                          selectedIconTint="#873c1e"
                                          iconTint="#312921"
                                          actions={[
                                              actions.setBold,
                                              actions.setItalic,
                                              actions.insertBulletsList,
                                              actions.insertOrderedList,
                                              actions.insertLink,
                                              actions.setStrikethrough,
                                              actions.setUnderline,
                                          ]}
                                          style={styles.richTextToolbarStyle}
                                      />
                                  </View>          
                              </View>
                              <InputGroup
                                  label="Ghi chú"
                                  value={formState.ghichu}
                                  onChangeText={(value) => handleChange(formState.ghichu, value)}
                                  placeholder="Nhập ghi chú"                                 
                              />
                                                                                    
                          </View>
                      </View>                      
                  </ScrollView>
                  
                  <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
                    <View style={styles.buttonContent}>
                        <Icon name="content-save-edit-outline" size={22} color="#fff" style={styles.saveIcon} />
                        <Text style={styles.submitButtonText}>
                            {isLoading ? 'ĐANG XỬ LÝ...' : 'LƯU THÔNG TIN'}
                        </Text>
                    </View>
                </TouchableOpacity>                    
                  
              </>
          )}
      </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#dcdcdc',
    },
    rowHeader: {
      flexDirection: 'row',
      backgroundColor: '#ecf0f3',
      alignItems: 'center',
      padding: 10,
    },
    titleHeader: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#000',
      marginLeft: 10,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    cardView : {       
        backgroundColor: 'white',
        width: width * 0.96, 
        height: 'auto', 
        marginTop: 5, 
        marginBottom: 5, 
        marginLeft: 'auto', 
        marginRight: 'auto',
        borderRadius: width * 0.02,
        paddingBottom: 5,
        paddingTop: 5,
    },
    cardTitleH4 : {
        paddingLeft: 10, 
        paddingRight: 10, 
        paddingTop: 5, 
        paddingBottom: 5, 
        fontWeight: 'bold', 
        fontSize: 17, 
        textAlign: 'center', 
        color:'green'
    },
    cardViewContainer: {
        width: width * 0.90, 
        height: 'auto', 
        marginLeft: 12
    },
    contentContainer: {
      flex: 1,
      padding: 10,
    },
    inputGroup: {
      marginBottom: 10,
    },
    labelContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    label: {
      marginBottom: 5,
      fontWeight: 'bold',
    },
    required: {
      color: 'red',
      marginLeft: 4,
      marginBottom: 5,
    },
    textInput: {
      borderWidth: 1,
      borderColor: '#CCCCCC',
      borderRadius: 5,
      padding: 6,
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
    submitButton: {
      position: 'absolute',
      bottom: 5,
      left: 0,
      right: 0,
      marginLeft: 7, 
      marginRight: 7,
      backgroundColor: '#428bca',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    },
    buttonContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    submitButtonText: {
      color: '#fff',
      fontSize: 14,
      fontWeight: 'bold',
      marginRight: 10,
    },
    saveIcon: {
      color: '#fff',
      marginRight: 5,
    },
    imageStyle: {
      width: 200,
      height: 200,
      margin: 5,
    },
    menuContainer: {
      flexDirection: 'row', 
      alignItems: 'center', 
      marginLeft: 'auto', 
      position: 'relative',
    },
    menuMargin: {
      marginTop: 35,
    },
    divTouchableOpacity: {
      flexDirection: 'row', 
      alignItems: 'center', 
      marginLeft: 'auto', 
      marginRight: 10,
    },
    textDiv: {
      marginLeft: 5, 
      fontWeight: 'bold',
    },
    divider: {
      backgroundColor: '#000', 
    },
    anchor: {    
      justifyContent: 'center',
      alignItems: 'center',   
    },
    horizontalContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 15,
        marginBottom: 5,
    },
    checkboxLabel: {
        marginLeft: 5,
    },
    headerStyle: {
      fontSize: 20,
      fontWeight: "600",
      color: "#312921",
      marginBottom: 10,
    },
  
    htmlBoxStyle: {
      height: 200,
      width: 330,
      backgroundColor: "#fff",
      borderRadius: 10,
      padding: 20,
      marginBottom: 10,
    },
  
    richTextContainer: {
      display: "flex",
      flexDirection: "column-reverse",
      width: "100%",
      marginBottom: 10,
    },
  
    richTextEditorStyle: {
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10,
      borderWidth: 1,
      borderColor: "#ccaf9b",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.23,
      shadowRadius: 2.62,
      elevation: 4,
      fontSize: 20,
    },
  
    richTextToolbarStyle: {
      backgroundColor: "#c6c3b3",
      borderColor: "#c6c3b3",
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      borderWidth: 1,
    },
  
    errorTextStyle: {
      color: "#FF0000",
      marginBottom: 10,
    },
  
    saveButtonStyle: {
      backgroundColor: "#c6c3b3",
      borderWidth: 1,
      borderColor: "#c6c3b3",
      borderRadius: 10,
      padding: 10,
      width: "25%",
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.23,
      shadowRadius: 2.62,
      elevation: 4,
      fontSize: 20,
    },
  
    textButtonStyle: {
      fontSize: 18,
      fontWeight: "600",
      color: "#312921",
    },

  });
  
  export default AddEditCongViecScreen;