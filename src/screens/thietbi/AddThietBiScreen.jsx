import React, { useContext, useEffect, useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  TextInput,   
  Alert, 
  Image,
  TouchableOpacity, 
  ActivityIndicator,
  ScrollView,
  StyleSheet, 
  Dimensions, 
  Platform,
  PermissionsAndroid,
} from 'react-native';
import ImageModal from 'react-native-image-modal';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SelectList } from 'react-native-dropdown-select-list';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import Toast from 'react-native-toast-message';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { useIsFocused } from '@react-navigation/native';
import { Menu, Divider, Provider as PaperProvider } from 'react-native-paper';
import {getValidString, getValidNumber} from '../../common/CommonFunction';
import { GlobalContext } from '../../store/GlobalProvider';
import {  
  getListNhomThietBiValue,
  getListKhuVuc, 
  getListParentID,
  getListXuatXuValue,
  getListNhaCungCapValue,
  getListHangSanXuatValue,
  postPutThietBi
} from '../../api/Api_ThietBi';

const { width } = Dimensions.get('window');

const AddThietBiScreen = ({ route, navigation }) => {

  var isFocused = useIsFocused();
  const base_url = useContext(GlobalContext).url;     
  const [isLoading, setIsLoading] = useState(true);
  const [dropdownLoading, setDropdownLoading] = useState(true);
  const { thietBiId } = route.params;

  const [tentb, setTenTB] = useState(null);
  const [model, setModel] = useState(null);
  const [nhomThietBiId, setNhomThietBiId] = useState(0);
  const [status, setStatus] = useState(0);
  const [khuVucId, setKhuVucId] = useState(0);
  const [diaDiemChaId, setDiaDiemChaId] = useState(0);
  const [diaDiemId, setDiaDiemId] = useState(0);
  const [viTriLapDat, setNoiSuDung] = useState(null);
  const [congDung, setCongDung] = useState(null);
  const [namSx, setNamSuDung] = useState(0);
  const [nuocSanXuatId, setXuatXu] = useState(0);
  const [nhaCungCapId, setNhaCungCap] = useState(0);
  const [hangSanXuatId, setHangSanXuat] = useState(0);
  const [chuKyBaoTri, setChuKyBaoTri] = useState(0);
  const [congSuatThietKe, setCongXuatThietKe] = useState(0);
  const [congSuatThucTe, setCongXuatThucTe] = useState(0);
  const [tuoiTho, setTuoiTho] = useState(0);
  const [thoiGianSuDung, setThoiGianSuDung] = useState(0);
  const [hanBaoHanh, setHanBaoHanh] = useState(null);
  const [thongSoThietBi, setNoiDung] = useState(null);
  const [ghiChu, setGhiChu] = useState(null);
  const [ngaymua, setNgayMua] = useState(null);
  const [ngaysudung, setNgaySuDung] = useState(new Date());
  const [ngaybh, setNgayBH] = useState(null);
  const [ngayhh, setNgayHH] = useState(null);
  const [isDatePickerVisible1, setDatePickerVisibility1] = useState(false);
  const [isDatePickerVisible2, setDatePickerVisibility2] = useState(false);
  const [isDatePickerVisible3, setDatePickerVisibility3] = useState(false);
  const [isDatePickerVisible4, setDatePickerVisibility4] = useState(false);

  const [dataloaitb, setDataLoaiTB] = useState([]);
  const [datakhuvuc1, setDataKhuVuc1] = useState([]);
  const [datakhuvuc2, setDataKhuVuc2] = useState([]);
  const [datakhuvuc3, setDataKhuVuc3] = useState([]);
  const [dataxx, setDataXuatXu] = useState([]);
  const [datancc, setDataNhaCungCap] = useState([]);        
  const [datahsx, setDataHangSanXuat] = useState([]);

  const handleNumberChange = (value, setter) => {
      if (/^\d+$/.test(value) || value === '') {
        setter(value);
      }
  };

  const [visible, setVisible] = useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false); 

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

  const dataStatus = [        
    { key: '1', value: 'Hoạt động' },
    { key: '2', value: 'Không hoạt động' },
    { key: '3', value: 'Dự phòng' },
    { key: '4', value: 'Hỏng' },
    { key: '5', value: 'Mất' },
    { key: '6', value: 'Thanh lý' },
  ];   

  const fetchDataPublic = async (fetchFunction, setDataFunction) => {
    try {
      const response = await fetchFunction(base_url);
      if (response && response.resultCode === true) {
        setDataFunction(response.data);
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    } 
  };
  
  const fetchLoaiTB = useCallback(() => {
    fetchDataPublic(getListNhomThietBiValue, setDataLoaiTB);
  }, [base_url]);
  
  const fetchXuatXu = useCallback(() => {
    fetchDataPublic(getListXuatXuValue, setDataXuatXu);
  }, [base_url]);
  
  const fetchNhaCungCap = useCallback(() => {
    fetchDataPublic(getListNhaCungCapValue, setDataNhaCungCap);
  }, [base_url]);
  
  const fetchHangSanXuat = useCallback(() => {
    fetchDataPublic(getListHangSanXuatValue, setDataHangSanXuat);
  }, [base_url]);
  
  const fetchData = async (fetchFunction, userMaDonVi, setDataFunction, _parentId = null) => {
    try {
      const response = await fetchFunction(base_url, parseInt(userMaDonVi, 10), _parentId);
      if (response && response.resultCode === true) {
        setDataFunction(response.data);
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    } 
  };
  
  const fetchKhuVuc = useCallback(async () => {
    const userMaDonVi = await AsyncStorage.getItem('userMaDonVi');
    fetchData(getListKhuVuc, userMaDonVi, setDataKhuVuc1);
  }, [base_url]);
  
  const fetchKhuVucParentID = useCallback(async (_parentId) => {
    const userMaDonVi = await AsyncStorage.getItem('userMaDonVi');
    fetchData(getListParentID, userMaDonVi, setDataKhuVuc2, _parentId);
  }, [base_url]);
  
  const fetchKhuVucDiaDiemParentID = useCallback(async (_parentId) => {
    const userMaDonVi = await AsyncStorage.getItem('userMaDonVi');
    fetchData(getListParentID, userMaDonVi, setDataKhuVuc3, _parentId);
  }, [base_url]);
  
  useEffect(() => {
    if (isFocused) {   
      setIsLoading(true); 
      setDropdownLoading(true);  
      const fetchAllData = async () => {
        await Promise.all([
          fetchLoaiTB(),
          fetchKhuVuc(),
          fetchXuatXu(),
          fetchNhaCungCap(),
          fetchHangSanXuat()
        ]);
        setIsLoading(false);
        setDropdownLoading(false);
      };      
      fetchAllData();
      
    }
    return () => {
      isFocused = false; // Clean up focus state     
    };
    
  }, [isFocused]);
  
  useEffect(() => {
    const fetchDataForKhuVuc = async () => {
      setDropdownLoading(true);
      if (parseInt(khuVucId) > 0) {       
        await fetchKhuVucParentID(khuVucId);
        setDiaDiemChaId(0);
        setDiaDiemId(0);
        setDataKhuVuc3([]);
        setDropdownLoading(false);
      }
    };
    fetchDataForKhuVuc();
  }, [khuVucId, fetchKhuVucParentID]);
  
  useEffect(() => {
    const fetchDataForDiaDiemChaId = async () => {
      if (parseInt(diaDiemChaId) > 0) {
        setDropdownLoading(true);
        await fetchKhuVucDiaDiemParentID(diaDiemChaId);
        setDiaDiemId(0);
        setDropdownLoading(false);
      }
    };
    fetchDataForDiaDiemChaId();
  }, [diaDiemChaId, fetchKhuVucDiaDiemParentID]);

  const [filePath, setFilePath] = useState(null);

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs camera permission',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else return true;
  };

  const requestExternalWritePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'External Storage Write Permission',
            message: 'App needs write permission',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        Alert.alert('Write permission error', err);
        return false;
      }
    } else return true;
  };

  const captureImage = async (type) => {
    const options = {
      mediaType: type,
      maxWidth: 300,
      maxHeight: 550,
      quality: 1,
      videoQuality: 'low',
      durationLimit: 30, // Video max duration in seconds
      saveToPhotos: true,
    };

    const isCameraPermitted = await requestCameraPermission();
    const isStoragePermitted = await requestExternalWritePermission();

    if (isCameraPermitted && isStoragePermitted) {
      launchCamera(options, (response) => {
        if (response.didCancel) {
          Alert.alert('User cancelled camera picker');
          return;
        } else if (response.errorCode) {
          Alert.alert(response.errorMessage || 'Unknown error');
          return;
        }
        setFilePath(response.assets[0]);
      });
    }
  };

  const chooseFile = (type) => {
    const options = {
      mediaType: type,
      maxWidth: 300,
      maxHeight: 550,
      quality: 1,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        Alert.alert('User cancelled image picker');
        return;
      } else if (response.errorCode) {
        Alert.alert(response.errorMessage || 'Unknown error');
        return;
      }
      setFilePath(response.assets[0]);
    });
  };

  const handleSubmit = async () => {
    try {
      // Validate form inputs
      if (!tentb || !model || !nhomThietBiId || !status || !khuVucId || !nuocSanXuatId) {
        Toast.show({
          type: 'error',
          text1: 'Vui lòng điền đầy đủ các thông tin',
          text2: 'Mã thiết bị, Tên thiết bị, Loại thiết bị, Trạng thái, Location, Xuất xứ',
        });
        return;
      }
  
      setIsLoading(true);  
      // Construct the form data
      const formData = new FormData();
  
      formData.append('thietBiId', getValidNumber(thietBiId));
      formData.append('tenTb', getValidString(tentb));
      formData.append('model', getValidString(model));
      formData.append('nhomThietBiId', getValidNumber(nhomThietBiId));
      formData.append('nhaCungCapId', getValidNumber(nhaCungCapId));
      formData.append('nuocSanXuatId', getValidNumber(nuocSanXuatId));
      formData.append('hangSanXuatId', getValidNumber(hangSanXuatId));
      formData.append('khuVucId', getValidNumber(khuVucId));
      formData.append('diaDiemChaId', getValidNumber(diaDiemChaId));
      formData.append('diaDiemId', getValidNumber(diaDiemId));
      formData.append('ngayMua', getValidString(getFormattedDate(ngaymua)));
      formData.append('ngaySuDung', getValidString(getFormattedDate(ngaysudung)));
      formData.append('ngayBh', getValidString(getFormattedDate(ngaybh)));
      formData.append('ngayHetBh', getValidString(getFormattedDate(ngayhh)));
      formData.append('chuKyBaoTri', getValidNumber(chuKyBaoTri));
      formData.append('congDung', getValidString(congDung));
      formData.append('congSuatThietKe', getValidNumber(congSuatThietKe));
      formData.append('congSuatThucTe', getValidNumber(congSuatThucTe));
      formData.append('hanBaoHanh', getValidString(hanBaoHanh));
      formData.append('tuoiTho', getValidNumber(tuoiTho));
      formData.append('thoiGianSuDung', getValidNumber(thoiGianSuDung));
      formData.append('viTriLapDat', getValidString(viTriLapDat));
      formData.append('ghiChu', getValidString(ghiChu));
      formData.append('status', getValidNumber(status));
      formData.append('thongSoThietBi', getValidString(thongSoThietBi));
  
      if (filePath && filePath.uri) {
        // Append the file to the form data
        const file = {
          uri: filePath.uri,
          type: filePath.type || 'image/jpeg', // Ensure the type is set correctly
          name: filePath.fileName || 'image.jpg',
        };
        formData.append('hinhAnh', file);
      } else {
        formData.append('hinhAnh', '');
      }

      // Call the API function
      const response = await postPutThietBi(base_url, formData);
      if (response?.resultCode === true) {
        resetFormState();
        navigation.navigate("ThietBiTab", { keyword: "", loaitb: 0, trangthai: 0 });
      } else {
        console.log("Device data:", formData);
        console.log("Response:", response);
        Alert.alert("Error", "Lỗi trong khi thêm dữ liệu");
      }
    } catch (error) {
      console.error("Error:", error);
      Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleBack = () => {
    try {      
      setIsLoading(true);
      resetFormState();
      navigation.navigate('ThietBiTab', { keyword: '', loaitb: 0, trangthai: 0 });
    } catch (error) {
      console.error("Error:", error);
      Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false);
    }       
  };

  const delTempImage = () => {
    setFilePath(null);
  };

  const resetFormState = () => {
    setTenTB(null);
    setModel(null);
    setNhomThietBiId(0);
    setNhaCungCap(0);
    setXuatXu(0);
    setHangSanXuat(0);
    setKhuVucId(0);
    setDiaDiemChaId(0);
    setDiaDiemId(0);
    setNamSuDung(0);
    setNoiSuDung('');
    setCongDung('');
    setNgayMua(null);
    setNgaySuDung(null);
    setNgayBH(null);
    setNgayHH(null);
    setChuKyBaoTri(0);
    setCongXuatThietKe(0);
    setCongXuatThucTe(0);
    setTuoiTho(0);
    setThoiGianSuDung(0);
    setHanBaoHanh(null);
    setNoiDung(null);
    setGhiChu(null);
    setStatus(0); 
    setFilePath(null);   
  };      

  /*const convertImageToBase64 = async (uri) => {
    try {
      const base64String = await RNFS.readFile(uri, 'base64');
      return base64String;
    } catch (error) {
      console.error("Error converting image to base64:", error);
      return null;
    }
  };*/

    return (
        <View style={styles.container}> 
           {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Loading...</Text>
              </View>
            ) : (
            <>         
            <View style={styles.rowHeader}>
              <Icon name="chevron-left" color="#000" size={26} onPress={handleBack} />
              <Text style={styles.titleHeader}>Quản lý thiết bị</Text> 
              <View style={styles.menuContainer}>
                <Menu style={styles.menuMargin}
                  visible={visible}
                  onDismiss={closeMenu}
                  anchor={
                    <TouchableOpacity onPress={openMenu} style={styles.divTouchableOpacity}>
                      <Icon name="camera" size={25} />
                      <Text style={styles.textDiv}>Hình ảnh</Text>
                    </TouchableOpacity>
                  }
                >
                  <Menu.Item 
                    onPress={() => { 
                      chooseFile('photo'); 
                      closeMenu();
                    }} 
                    title="Image Library"
                    leadingIcon={() => <Icon name="image" size={20} />} 
                  />                        
                  <Divider style={styles.divider} />
                  <Menu.Item 
                    onPress={() => { 
                      captureImage('photo'); 
                      closeMenu();
                    }} 
                    title="Camera"
                    leadingIcon={() => <Icon name="camera" size={20} />} 
                  />
                  <Divider style={styles.divider} />
                  <Menu.Item 
                    onPress={() => { 
                      chooseFile('video'); 
                      closeMenu();
                    }} 
                    title="Video Library"
                    leadingIcon={() => <Icon name="image" size={20} />} 
                  />
                  <Divider style={styles.divider} />
                  <Menu.Item 
                    onPress={() => { 
                      captureImage('video'); 
                      closeMenu();
                    }} 
                    title="Video"
                    leadingIcon={() => <Icon name="video" size={20} />} 
                  />
                </Menu>
              </View>                                                                  
            </View>
            
              <View style={styles.cardView}>
                <View style={styles.cardViewContainer}>
                  <ScrollView style={{marginBottom: 80}}> 
                    {filePath && (
                      <>
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>                   
                          <Image
                            source={{ uri: filePath.uri }}
                            style={styles.imageStyle}
                          />
                          <TouchableOpacity onPress={delTempImage} >
                            <Icon name="delete" size={22} />
                          </TouchableOpacity>
                        </View>
                      </>
                    )}                              
                    <View style={styles.inputGroup}>
                      <View style={styles.labelContainer}>
                        <Text style={styles.label}>Mã thiết bị</Text>
                        <Text style={styles.required}>(*)</Text>
                      </View>
                      <TextInput
                        value={model}
                        onChangeText={setModel}
                        placeholder="Nhập mã thiết bị"
                        style={styles.textInput}
                      />
                    </View>
                    <View style={styles.inputGroup}>
                      <View style={styles.labelContainer}>
                        <Text style={styles.label}>Tên thiết bị</Text>
                        <Text style={styles.required}>(*)</Text>
                      </View>
                      <TextInput
                        value={tentb}
                        onChangeText={setTenTB}
                        placeholder="Nhập tên thiết bị"
                        style={styles.textInput}
                      />
                    </View>
                    <View style={styles.inputGroup}>
                      <View style={styles.labelContainer}>
                        <Text style={styles.label}>Loại thiết bị</Text>
                        <Text style={styles.required}>(*)</Text>                        
                      </View>                                          
                      <SelectList 
                        setSelected={setNhomThietBiId}
                        data={dataloaitb}
                        save="key"
                        placeholder="Tất cả"
                        searchPlaceholder="Từ khóa"
                        boxStyles={styles.selectBox}
                        dropdownStyles={styles.dropdown}
                      />                           
                    </View>
                    <View style={styles.inputGroup}>
                      <View style={styles.labelContainer}>
                        <Text style={styles.label}>Trạng thái</Text>
                        <Text style={styles.required}>(*)</Text>
                      </View>
                      <SelectList 
                        setSelected={setStatus}
                        data={dataStatus}
                        save="key"
                        placeholder="Tất cả"
                        searchPlaceholder="Từ khóa"
                        boxStyles={styles.selectBox}
                        dropdownStyles={styles.dropdown}
                      />
                    </View>
                    <View style={styles.inputGroup}>
                      <View style={styles.labelContainer}>
                        <Text style={styles.label}>Location</Text>
                        <Text style={styles.required}>(*)</Text>
                      </View>
                      {dropdownLoading ? (
                          <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#0000ff" />
                            <Text>Loading...</Text>
                          </View>
                        ) : (                            
                        <>            
                        <SelectList
                          data={datakhuvuc1.map(item => ({ key: item.key, value: item.value }))}
                          setSelected={setKhuVucId}
                          placeholder="Tất cả"
                          searchPlaceholder="Từ khóa"
                          boxStyles={styles.selectBox}
                          dropdownStyles={styles.dropdown}
                          defaultOption={datakhuvuc1.find(item => item.key === khuVucId) ? { key: khuVucId.toString(), value: datakhuvuc1.find(item => item.key === khuVucId).value } : undefined}
                        />
                        <View style={{ height: 10 }}></View>
                        <SelectList
                          data={datakhuvuc2.map(item => ({ key: item.key, value: item.value }))}
                          setSelected={setDiaDiemChaId}
                          placeholder="Tất cả"
                          searchPlaceholder="Từ khóa"
                          boxStyles={styles.selectBox}
                          dropdownStyles={styles.dropdown}
                          defaultOption={datakhuvuc2.find(item => item.key === diaDiemChaId) ? { key: diaDiemChaId.toString(), value: datakhuvuc2.find(item => item.key === diaDiemChaId).value } : undefined}
                        />
                        <View style={{ height: 10 }}></View>
                        <SelectList
                          data={datakhuvuc3.map(item => ({ key: item.key, value: item.value }))}
                          setSelected={setDiaDiemId}
                          placeholder="Tất cả"
                          searchPlaceholder="Từ khóa"
                          boxStyles={styles.selectBox}
                          dropdownStyles={styles.dropdown}
                          defaultOption={datakhuvuc3.find(item => item.key === diaDiemId) ? { key: diaDiemId.toString(), value: datakhuvuc3.find(item => item.key === diaDiemId).value } : undefined}
                        /> 
                        </>       
                      )}             
                    </View>
                      
                    <View style={styles.inputGroup}>
                      <View style={styles.labelContainer}>
                        <Text style={styles.label}>Nơi sử dụng</Text>                      
                      </View>
                      <TextInput
                        value={viTriLapDat}
                        onChangeText={setNoiSuDung}
                        placeholder="Nhập nơi sử dụng"
                        style={styles.textInput}
                      />
                    </View>
                    <View style={styles.inputGroup}>
                      <View style={styles.labelContainer}>
                        <Text style={styles.label}>Công dụng</Text>                       
                      </View>
                      <TextInput
                        value={congDung}
                        onChangeText={setCongDung}
                        placeholder="Nhập công dụng"
                        style={styles.textInput}
                      />
                    </View>
                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Năm sử dụng</Text>
                      <TextInput
                        value={namSx.toString()}
                        onChangeText={(value) => handleNumberChange(value, setNamSuDung)}
                        placeholder="Nhập năm sử dụng"
                        style={styles.textInput}
                        keyboardType="numeric"
                      />
                    </View>
                    <View style={styles.inputGroup}>
                      <View style={styles.labelContainer}>
                        <Text style={styles.label}>Xuất xứ</Text>
                        <Text style={styles.required}>(*)</Text>
                      </View>
                      <SelectList 
                        setSelected={setXuatXu}
                        data={dataxx}
                        save="key"
                        placeholder="Chọn xuất xứ"
                        searchPlaceholder="Tìm xuất xứ"
                        boxStyles={styles.selectBox}
                        dropdownStyles={styles.dropdown}
                      />
                    </View>
                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Nhà cung cấp</Text>
                      <SelectList 
                        setSelected={setNhaCungCap}
                        data={datancc}
                        save="key"
                        placeholder="Chọn nhà cung cấp"
                        searchPlaceholder="Tìm nhà cung cấp"
                        boxStyles={styles.selectBox}
                        dropdownStyles={styles.dropdown}
                      />
                    </View>
                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Hãng sản xuất</Text>
                      <SelectList 
                        setSelected={setHangSanXuat}
                        data={datahsx}
                        save="key"
                        placeholder="Chọn hãng sản xuất"
                        searchPlaceholder="Tìm hãng sản xuất"
                        boxStyles={styles.selectBox}
                        dropdownStyles={styles.dropdown}
                      />
                    </View>
                    <View style={styles.datePickerContainer}>
                      <Text style={styles.label}>Ngày mua</Text>
                      <TouchableOpacity onPress={() => showDatePicker(setDatePickerVisibility1)} style={styles.datePicker}>
                        <Text style={styles.dateText}>{formatDate(ngaymua)}</Text>
                        <Icon name="calendar" size={26} color="#000" style={styles.dateIcon} />
                      </TouchableOpacity>
                      <DateTimePickerModal
                        isVisible={isDatePickerVisible1}
                        mode="date"
                        onConfirm={(date) => handleConfirmDate(date, setNgayMua, setDatePickerVisibility1)}
                        onCancel={() => hideDatePicker(setDatePickerVisibility1)}
                      />
                    </View>
                    <View style={styles.datePickerContainer}>
                      <Text style={styles.label}>Ngày sử dụng</Text>
                      <TouchableOpacity onPress={() => showDatePicker(setDatePickerVisibility2)} style={styles.datePicker}>
                        <Text style={styles.dateText}>{formatDate(ngaysudung)}</Text>
                        <Icon name="calendar" size={26} color="#000" style={styles.dateIcon} />
                      </TouchableOpacity>
                      <DateTimePickerModal
                        isVisible={isDatePickerVisible2}
                        mode="date"
                        onConfirm={(date) => handleConfirmDate(date, setNgaySuDung, setDatePickerVisibility2)}
                        onCancel={() => hideDatePicker(setDatePickerVisibility2)}
                      />
                    </View>
                    <View style={styles.datePickerContainer}>
                      <Text style={styles.label}>Ngày bảo hành</Text>
                      <TouchableOpacity onPress={() => showDatePicker(setDatePickerVisibility3)} style={styles.datePicker}>
                        <Text style={styles.dateText}>{formatDate(ngaybh)}</Text>
                        <Icon name="calendar" size={26} color="#000" style={styles.dateIcon} />
                      </TouchableOpacity>
                      <DateTimePickerModal
                        isVisible={isDatePickerVisible3}
                        mode="date"
                        onConfirm={(date) => handleConfirmDate(date, setNgayBH, setDatePickerVisibility3)}
                        onCancel={() => hideDatePicker(setDatePickerVisibility3)}
                      />
                    </View>
                    <View style={styles.datePickerContainer}>
                      <Text style={styles.label}>Ngày hết hạn</Text>
                      <TouchableOpacity onPress={() => showDatePicker(setDatePickerVisibility4)} style={styles.datePicker}>
                        <Text style={styles.dateText}>{formatDate(ngayhh)}</Text>
                        <Icon name="calendar" size={26} color="#000" style={styles.dateIcon} />
                      </TouchableOpacity>
                      <DateTimePickerModal
                        isVisible={isDatePickerVisible4}
                        mode="date"
                        onConfirm={(date) => handleConfirmDate(date, setNgayHH, setDatePickerVisibility4)}
                        onCancel={() => hideDatePicker(setDatePickerVisibility4)}
                      />
                    </View>
                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Chu kỳ bảo trì (tháng)</Text>
                      <TextInput
                        value={chuKyBaoTri.toString()}
                        onChangeText={(value) => handleNumberChange(value, setChuKyBaoTri)}
                        placeholder="Nhập chu kỳ bảo trì"
                        style={styles.textInput}
                        keyboardType="numeric"
                      />
                    </View>
                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Công suất thiết kế (tháng)</Text>
                      <TextInput
                        value={congSuatThietKe.toString()}
                        onChangeText={(value) => handleNumberChange(value, setCongXuatThietKe)}
                        placeholder="Nhập công suất thiết kế"
                        style={styles.textInput}
                        keyboardType="numeric"
                      />
                    </View>
                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Công suất thực tế (tháng)</Text>
                      <TextInput
                        value={congSuatThucTe.toString()}
                        onChangeText={(value) => handleNumberChange(value, setCongXuatThucTe)}
                        placeholder="Nhập công suất hực tế"
                        style={styles.textInput}
                        keyboardType="numeric"
                      />
                    </View>
                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Tuổi thọ (năm)</Text>
                      <TextInput
                        value={tuoiTho.toString()}
                        onChangeText={(value) => handleNumberChange(value, setTuoiTho)}
                        placeholder="Nhập tuổi thọ"
                        style={styles.textInput}
                        keyboardType="numeric"
                      />
                    </View>
                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Thời gian sử dụng (tháng)</Text>
                      <TextInput
                        value={thoiGianSuDung.toString()}
                        onChangeText={(value) => handleNumberChange(value, setThoiGianSuDung)}
                        placeholder="Nhập thời gian sử dụng"
                        style={styles.textInput}
                        keyboardType="numeric"
                      />
                    </View>
                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Hạn bảo hành (tháng)</Text>
                      <TextInput
                        value={hanBaoHanh}
                        placeholder="Nhập hạn bảo hành"
                        style={styles.textInput}
                      />
                    </View>                    
                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Nội dung</Text>
                      <TextInput
                        value={thongSoThietBi}
                        onChangeText={setNoiDung}
                        placeholder="Nhập nội dung"
                        multiline={true}
                        numberOfLines={4}
                        style={styles.textInput}
                      />
                    </View>
                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Ghi chú</Text>
                      <TextInput
                        value={ghiChu}
                        onChangeText={setGhiChu}
                        placeholder="Nhập ghi chú"
                        multiline={true}
                        numberOfLines={2}
                        style={styles.textInput}
                      />
                    </View>                       
                                                          
                  </ScrollView>                                    
                </View>
              </View>                 
             
            
            <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
              <View style={styles.buttonContent}>
                <Icon name="content-save-edit-outline" size={22} color="#fff" style={styles.saveIcon} />
                <Text style={styles.submitButtonText}>LƯU THÔNG TIN</Text>                          
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
    //backgroundColor: '#F5FCFF',
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
    margin: width * 0.02,
    borderRadius: width * 0.02,
    paddingBottom: 5,
    paddingTop: 5,
  },
  cardViewContainer: {
      width: width * 0.96, 
      height: 'auto', 
      marginLeft: 'auto', 
      marginRight: 'auto'
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
    marginRight: 10, // Add some space between the text and the icon
  },
  saveIcon: {
    color: '#fff',
    marginRight: 5,
  },
  mainBody: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  buttonStyle: {
    backgroundColor: '#307ecc',
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#307ecc',
    height: 40,
    alignItems: 'center',
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 15,
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 16,
  },
  textStyle: {
    backgroundColor: '#fff',
    fontSize: 15,
    marginTop: 16,
    marginLeft: 35,
    marginRight: 35,
    textAlign: 'center',
  },
  titleText: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 20,
  },  
  buttonStyle: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 5,
    marginVertical: 10,
    width: 250,
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
    backgroundColor: '#000', // Set the color of the Divider
  },
  anchor: {    
    justifyContent: 'center',
    alignItems: 'center',   
  },
});

export default AddThietBiScreen;