import React, { useState, useEffect, useContext, useCallback, useRef } from 'react';
import { View, 
    Text,
    Alert, 
    TextInput,
    Button, 
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
  postPutCongViecBaoTri,
  getListByMacv,
  postPutCTCV, 
  deleteCTCVByID, 
 } from '../../api/Api_CongViec';

const { width } = Dimensions.get('window');

const AddEditCongViecScreen = ({ route, navigation }) => {

  const base_url = useContext(GlobalContext).url;
  const [isLoading, setIsLoading] = useState(false);

  const [macv, setMaCV] = useState(0);
  const [matb, setMaTB] = useState(0);
  const [tencv, setTenCV] = useState(null);
  const [loaicv, setLoaiCV] = useState(0);
  const [loaikh, setLoaiKH] = useState(0);
  const [ngaybd, setNgayBD] = useState(null);
  const [ngaykt, setNgayKT] = useState(null);
  const [trangthai, setTrangThai] = useState(0);
  const [tiendo, setTienDo] = useState(0);
  const [douutien, setDoUuTien] = useState(0);
  const [manvth, setMaNVTH] = useState(0);
  const [manvkt, setMaNVKT] = useState(0);
  const [noidung, setNoiDung] = useState(null);
  const [ghichu, setGhiChu] = useState(null);  

  const [tenthietbi, setTenThietBi] = useState('');
  const [tenloaicv, setTenLoaiCV] = useState('');
  const [tentrangthai, setTenTrangThai] = useState('');
  const [tenloaikh, setTenLoaiKH] = useState('');
  const [tendouutien, setTenDoUuTien] = useState('');
  const [tennvth, setTenNhanVienTH] = useState('');
  const [tennvkt, setTenNhanVienKT] = useState('');
  const [tendvt, setTendvt] = useState('');

  const [isDatePickerVisible1, setDatePickerVisibility1] = useState(false);
  const [isDatePickerVisible2, setDatePickerVisibility2] = useState(false);

  const [datathietbi, setDataThietBi] = useState([]);
  const [datanvth, setDataNhanVienTH] = useState([]);
  const [datanvkt, setDataNhanVienKT] = useState([]); 
  const [selectedTab, setSelectedTab] = useState('tab1');

  // Chi tiết bộ phận
  const [id, setId] = useState(0);
  const [tenct, setTenChiTiet] = useState(null);
  const [dvt, setDVT] = useState(null);
  const [sl, setSoLuong] = useState(1);
  const [quycach, setQuyCach] = useState(null); 
  const [datadvt, setDatadvt] = useState([]); 

  const [tableData, setTableData] = useState({
    header: ['', '', '', 'Tên chi tiết', 'ĐVT', 'SL', 'Quy cách'],
    rows: [],
  });

  const handleNumberChange = (value, setter) => {
    if (/^\d+$/.test(value) || value === '') {
        setter(value);
    }
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

  const richText = useRef(null);

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

      setMaCV(macv);
      setMaTB(matb);
      setTenCV(tencv);
      setLoaiCV(loaicv);
      setLoaiKH(loaikh);
      setNgayBD(ngaybd);
      setNgayKT(ngaykt);
      setTrangThai(trangthai);
      setTienDo(tiendo);
      setDoUuTien(douutien);
      setMaNVTH(manvth);
      setMaNVKT(manvkt);
      setNoiDung(noidung);
      setGhiChu(ghichu);

      //Load edit chi tiết công việc    
      fetchCTCVByMaCV(macv);

    }
  }, [route.params, datadvt]);

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
    if (!tencv) {
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
  
      // Create formData for CongViecBaoTri
      const formDataCongViec = new FormData();
      formDataCongViec.append('macv', getValidNumber(macv));
      formDataCongViec.append('matb', getValidNumber(matb));
      formDataCongViec.append('tencv', getValidString(tencv));
      formDataCongViec.append('loaicv', getValidNumber(loaicv));
      formDataCongViec.append('loaikh', getValidNumber(loaikh));
      formDataCongViec.append('ngaybd', getValidString(getFormattedDate(ngaybd)));
      formDataCongViec.append('ngaykt', getValidString(getFormattedDate(ngaykt)));
      formDataCongViec.append('trangthai', getValidNumber(trangthai));
      formDataCongViec.append('douutien', getValidNumber(douutien));
      formDataCongViec.append('manvth', getValidNumber(manvth));
      formDataCongViec.append('manvkt', getValidNumber(manvkt));
      formDataCongViec.append('noidung', getValidString(noidung));
      formDataCongViec.append('ghichu', getValidString(ghichu));
  
      // Create JavaScript object for ChiTietCongViec
      const chiTietCongViec = tableData.rows.map(row => ({
          id: getValidNumber(row[0]),
          macv: getValidNumber(row[1]),
          tenct: getValidString(row[3]),
          dvt: getValidNumber(row[2]),
          sl: getValidNumber(row[5]),
          quycach: getValidString(row[6]),
          duphong: null,
          baoduong: null,
          chuky: null,
      }));

      const responseCongViec = await postPutCongViecBaoTri(base_url, formDataCongViec);  
      const responseCTCV = await postPutCTCV(base_url, chiTietCongViec);
  
      if (responseCongViec?.resultCode || responseCTCV?.resultCode) {
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
        console.error("Device data:", formDataCongViec, chiTietCongViec);
        console.error("Response:", responseCongViec, responseCTCV);
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

      setMaCV(0);
      setMaTB(0);
      setTenCV(null);
      setLoaiCV(0);
      setLoaiKH(0);
      setNgayBD(null);
      setNgayKT(null);
      setTrangThai(0);
      setTienDo(0);
      setDoUuTien(0);
      setMaNVTH(0);
      setMaNVKT(0);
      setNoiDung(null);
      setGhiChu(null);

      // Reset individual state variables
      setTenThietBi('');
      setTenLoaiCV('');
      setTenTrangThai('');
      setTenLoaiKH('');
      setTenDoUuTien('');
      setTenNhanVienTH('');
      setTenNhanVienKT('');

      // Reset SelectList state
      setTenChiTiet(null);
      setDVT(0);     
      setSoLuong(1);
      setQuyCach(null);
      setTendvt('');      

      // Reset table data
      setTableData({
        header: ['', '', '', 'Tên chi tiết', 'ĐVT', 'SL', 'Quy cách'],
        rows: [],
      });
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
          setDatadvt(response.data);            
        } else {
          setDatadvt([]);
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

  // Load List All Chi Tiết Công Việc By MaCV
  const fetchCTCVByMaCV = async (_macv) => {
    try {
        const response = await getListByMacv(base_url, parseInt(_macv, 10));
        if (response?.resultCode === true) {
          const newRow = response.data.map(item => {
            const unit  = datadvt.find(dvtItem => parseInt(dvtItem.key, 10) === parseInt(item.dvt, 10));
            return [
                item.id || 0,
                item.macv || 0,
                item.dvt || 0,
                item.tenct || '',
                unit ? unit.value : '',
                item.sl || 1,
                item.quycach || ''
            ];
          });

            setTableData(prevTableData => ({
                ...prevTableData,
                rows: newRow // Replace the existing rows with fetched rows
            }));

        } else {
            setTableData({
              header: ['', '', '', 'Tên chi tiết', 'ĐVT', 'SL', 'Quy cách'],
              rows: [],
            });
        }
    } catch (error) {
        console.error("Error fetching chi tiết công việc: ", error);
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    const macv = parseInt(route.params.macv, 10);
    try {
        await Promise.all([
            fetchThietBi(),
            fetchNhanVienTH(),
            fetchNhanVienKT(),
            fetchDonViTinh(),
            fetchCTCVByMaCV(macv > 0 ? macv : 0),
        ]);
    } catch (error) {
        console.error("Error fetching data: ", error);
    } finally {
        setIsLoading(false);
    }
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
  
  const handleAddRow = () => {
    // Validation checks
    if (!tenct || !dvt || (!sl || isNaN(sl) || parseInt(sl, 10) <= 0) || !quycach) {
        Alert.alert('Thông báo', 'Tên chi tiết, đơn vị tính, số lượng >0 và quy cách không được để trống!');
        return;
    }   

    const unit = datadvt.find(dvtItem => parseInt(dvtItem.key, 10) === parseInt(dvt, 10));
    const unitName = unit ? unit.value : '';
    
    const newRow = [id, macv, dvt, tenct, unitName, sl, quycach];
    
    setTableData(prevTableData => ({
        ...prevTableData,
        rows: [...prevTableData.rows, newRow]
    }));
  };

  const handleDelete = async (_id, rowIndex) => {
    try {
        const response = await deleteCTCVByID(base_url, _id);
        if (response.resultCode) {          
            setTableData(prevTableData => ({
                ...prevTableData,
                rows: prevTableData.rows.filter((_, index) => index !== rowIndex)
            }));
        }
    } catch (error) {
        Alert.alert('Xóa lỗi', 'Đã có lỗi xảy ra trong quá trình xóa, vui lòng thử lại sau');
    }
  };

  const removeRow = (rowIndex, id) => {
    if (id !== 0) {
      Alert.alert(
        'Xác nhận xóa',
        'Bạn có chắc chắn muốn xóa mục này?',
        [
          {
            text: 'Hủy',
            onPress: () => console.log('Xóa đã bị hủy'),
            style: 'cancel'
          },
          {
            text: 'Xóa',
            onPress: () => handleDelete(id, rowIndex),
            style: 'destructive'
          }
        ],
        { cancelable: false } 
      );
    } else {        
        setTableData(prevTableData => ({
            ...prevTableData,
            rows: prevTableData.rows.filter((_, index) => index !== rowIndex)
        }));
    }
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
            style={styles.textInput}
            keyboardType={keyboardType}
        />
    </View>
  );    

  const renderTab = (tabkey, tabName) => (
    <TouchableOpacity
      key={tabkey}
      style={[
        styles.tab,
        { 
          borderBottomWidth: 2,                  
          borderBottomColor: selectedTab === tabkey ? '#2196F3' : 'transparent'  // Set border bottom color
        }
      ]}
      onPress={() => setSelectedTab(tabkey)}
    >
      <Text style={{color: selectedTab === tabkey ? '#2196F3' : '#000000', fontSize: 16, fontWeight: 'bold' }}>{tabName}</Text>
    </TouchableOpacity>
  );

  const TableRow = ({ row, rowIndex, removeRow }) => {
    const id = row[0]; // Assuming the id is the first element in the row array
  
    return (
      <View style={[styles.tableRow, rowIndex % 2 === 0 ? styles.tableRowEven : styles.tableRowEven]}>
        {row.slice(3).map((cell, cellIndex) => ( // Skip row[0], row[1], row[2] by slicing the array starting from index 2
          <View
          key={cellIndex + 3}
          style={[
              styles.tableCell,
              { width: cellWidths[cellIndex + 3] },
              (cellIndex === 1 || cellIndex === 2) && styles.centeredCell, 
          ]}
         >
            <Text style={styles.tableCellText}>{cell}</Text>
          </View>
        ))}
        <View style={[styles.tableCell, styles.removeCell]}>
          <TouchableOpacity onPress={() => removeRow(rowIndex, id)}>
            <Text style={styles.removeButton}>X</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const Table = ({ data, removeRow }) => (
    <ScrollView horizontal>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          {data.header.slice(3).map((header, index) => (
            <View key={index + 3} style={[styles.tableCell, styles.tableHeader, { width: cellWidths[index + 3] }]}>
              <Text style={styles.tableHeaderText}>{header}</Text>
            </View>
          ))}
          <View style={[styles.tableCell, styles.tableHeader, { width: 30 }]}>
            <Text style={styles.tableHeaderText}></Text>
          </View>
        </View>
        {data.rows.map((row, rowIndex) => (
          <TableRow key={rowIndex} row={row} rowIndex={rowIndex} removeRow={removeRow} />
        ))}
      </View>
    </ScrollView>
  );    

  return (
      <View style={styles.container}>
          <View style={styles.rowHeader}>
              <Icon name="chevron-left" color="#000" size={26} onPress={handleBack} />
              <Text style={styles.titleHeader}>Công việc bảo trì</Text>
          </View>
            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                    <Text>Loading...</Text>
                </View>
            ) : (
              <>
                  <ScrollView style={{ marginBottom: 50 }}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsContainer}>
                      {renderTab('tab1', 'Thông tin')}
                      {renderTab('tab2', 'Công việc thực hiện')}
                      {renderTab('tab3', 'Bộ phận')}
                    </ScrollView>
                    <View>
                      {selectedTab === 'tab1' && 
                        <View style={[styles.cardView, { marginTop: -5 }]}>
                               <View style={styles.cardViewContainer}>
                            <View style={styles.inputGroup}>
                              <View style={styles.labelContainer}>
                                <Text style={styles.label}>Thiết bị:</Text>
                                <Text style={styles.required}>(*)</Text> 
                              </View>
                              <SelectList
                                setSelected={setMaTB}
                                data={datathietbi}
                                defaultOption={getDefaultOption(matb, datathietbi, tenthietbi)}
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
                                value={tencv}
                                onChangeText={setTenCV}
                                placeholder="Nhập nội dung bảo trì, sửa chữa"                                 
                            /> 

                            <View style={styles.inputGroup}>
                              <View style={styles.labelContainer}>
                                <Text style={styles.label}>Loại công việc:</Text>
                                <Text style={styles.required}>(*)</Text> 
                              </View>
                              <SelectList
                                setSelected={setLoaiCV}
                                data={dataStatusLoaiCV}
                                defaultOption={getDefaultOption(loaicv, dataStatusLoaiCV, tenloaicv)}                           
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
                                setSelected={setTrangThai}
                                data={dataStatusTT}
                                defaultOption={getDefaultOption(trangthai, dataStatusTT, tentrangthai)}                           
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
                              <View style={styles.labelContainer}>
                                  <Text style={styles.label}>Ngày kết thúc:</Text>
                                  <Text style={styles.required}>(*)</Text>
                                </View> 
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
                            
                              <View style={styles.inputGroup}>
                                <View style={styles.labelContainer}>
                                  <Text style={styles.label}>Loại kế hoạch:</Text>
                                  <Text style={styles.required}>(*)</Text> 
                                </View>
                                <SelectList
                                  setSelected={setLoaiKH}
                                  data={dataStatusLoaiKH}
                                  defaultOption={getDefaultOption(loaikh, dataStatusLoaiKH, tenloaikh)}                           
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
                                  setSelected={setDoUuTien}
                                  data={dataStatusDoUuTien}
                                  defaultOption={getDefaultOption(douutien, dataStatusDoUuTien, tendouutien)}                           
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
                                  setSelected={setMaNVTH}
                                  data={datanvth}
                                  defaultOption={getDefaultOption(manvth, datanvth, tennvth)}                           
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
                                  setSelected={setMaNVKT}
                                  data={datanvkt}
                                  defaultOption={getDefaultOption(manvkt, datanvkt, tennvkt)}                           
                                  save="key"                                                 
                                  placeholder="Tất cả"
                                  searchPlaceholder="Từ khóa"
                                  boxStyles={styles.selectBox}
                                  dropdownStyles={styles.dropdown}
                                />
                              </View> 
                              
                              <InputGroup
                                  label="Ghi chú"
                                  value={ghichu}
                                  onChangeText={setGhiChu}
                                  placeholder="Nhập ghi chú"                                 
                              />
                                                                                    
                          </View>              
                        </View>                  
                      }
                      {selectedTab === 'tab2' && 
                        <View style={[styles.cardView, { marginTop: -5 }]}>
                          <View style={styles.inputGroup}>
                              <View style={styles.richTextContainer}>
                                <RichEditor                                        
                                  ref={richText}
                                  onChange={setNoiDung}
                                  maxLength={200}
                                  editorStyle={styles.richEditor}
                                  placeholder="Nhập công việc thực hiện"
                                  initialContentHTML={noidung}                                          
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
                        </View>
                      }
                      {selectedTab === 'tab3' && 
                        <View style={[styles.cardView, { marginTop: -5 }]}> 
                           <View style={{ marginLeft: 10, marginRight: 10 }}>

                            <View style={styles.inputGroup}>
                                <View style={styles.labelContainer}>
                                  <Text style={styles.label}>Tên chi tiết:</Text> 
                                </View>
                                <TextInput
                                  style={styles.textInput}
                                  value={tenct}
                                  onChangeText={setTenChiTiet}
                                />  
                            </View> 

                            <View style={styles.itemInfoRow}>
                              <View style={styles.itemColumn}>
                                <Text style={styles.label}>Đơn vị tính:</Text> 
                                <View style={{ marginRight: 5 }}>                               
                                  <SelectList
                                    setSelected={setDVT}
                                    data={datadvt}
                                    defaultOption={getDefaultOption(dvt, datadvt, tendvt)}
                                    save="key"
                                    placeholder="Tất cả"
                                    searchPlaceholder="Từ khóa"
                                    boxStyles={styles.selectBox}
                                    dropdownStyles={styles.dropdown}
                                  />
                                </View>                             
                              </View>
                              <View style={styles.itemColumn}>
                                <Text style={[styles.label, { marginLeft: 5 }]}>Số lượng:</Text>
                                <View style={{ marginLeft: 5 }}>
                                  <TextInput
                                    style={styles.textInput}
                                    value={sl.toString()}
                                    onChangeText={(text) => handleNumberChange(text, setSoLuong)}
                                    keyboardType="numeric"
                                  />
                                </View>
                              </View>
                            </View>
                            
                            <View style={styles.inputGroup}>
                                <View style={styles.labelContainer}>
                                  <Text style={styles.label}>Quy cách:</Text>
                                </View>
                                <TextInput
                                  style={styles.textInput}
                                  value={quycach}
                                  onChangeText={setQuyCach}
                                />
                            </View>  
                            <View style={{ flex: 1, flexDirection: 'row', marginBottom: 10 }}>
                              <TouchableOpacity style={styles.btnButtons} onPress={handleAddRow}>
                                  <Icon name='plus' color={'#fff'} size={16} />
                              </TouchableOpacity>
                            </View>
                          </View>  

                          <Table
                            data={tableData}                         
                            removeRow={removeRow}                            
                          />      

                        </View>
                      }
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

const cellWidths = [0, 0, 0, 125, 58, 48, 120];

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
    tabsContainer: {
      marginTop: 5,
      width: width * 0.96,
      flexDirection: 'row',
      paddingVertical: 5,
      marginLeft: 10,
    },
    tab: {     
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderBottomWidth: 2,
      borderBottomColor: 'transparent',
      marginHorizontal: 0,    
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
        paddingBottom: 10,
        paddingTop: 10,
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
    itemInfoRow: {
      flexDirection: 'row',
      marginBottom: 10,
    },
    itemColumn: {
      flex: 1,
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
    btnButtons: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 8,
      backgroundColor: '#2755ab', 
      borderRadius: 5,              
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
      width: "97%",
      marginLeft: 5,
    },
  
    richTextEditorStyle: {
      borderWidth: 1,
      borderColor: "#ccaf9b",    
      fontSize: 14,
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

    table: {
      borderWidth: 1,
      marginLeft: 6,
      borderColor: '#ddd',
      borderRadius: 4,
      overflow: 'hidden',
    },
    tableRow: {
      flexDirection: 'row',
    },
    tableHeader: {
      backgroundColor: '#f8f9fa',
      borderBottomWidth: 1,
      borderColor: '#ddd',
    },
    tableHeaderText: {
      fontWeight: 'bold',
      fontSize: 12,
      padding: 8,
      textAlign: 'center',
    },
    tableCell: {
      borderWidth: 1,
      borderColor: '#ddd',
      padding: 8,
    },
    centeredCell: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    tableCellText: {
      fontSize: 12,
    },
    tableRowEven: {
      backgroundColor: '#ffffff',
    },
    tableRowOdd: {
      backgroundColor: '#f2f2f2',
    },    
    removeButton: {
      color: 'red',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    removeCell: {
      width: 30,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
  
  export default AddEditCongViecScreen;