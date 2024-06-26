import React, { useContext, useEffect, useState, useCallback } from 'react';
import { 
  View, 
  Text,   
  Alert, 
  TouchableOpacity,   
  FlatList,
  StyleSheet, 
  Dimensions, 
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Loading } from '../../common/Loading';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Menu, Divider, Provider as PaperProvider } from 'react-native-paper';
import { getVietNamDate } from '../../common/CommonFunction';
import moment from 'moment';
import SearchCongViecModal from './SearchCongViecModal';
import DelCongViecModal from './DelCongViecModal';
import { GlobalContext } from '../../store/GlobalProvider';
import { 
  getListNhanVienTH,
  getListNhanVienKT,
  getListThietBiByDonVi,
  getListCongViecBaoTriByDonVi 
} from '../../api/Api_CongViec';

const { width, height } = Dimensions.get('window');

const CongViecBaoTriScreen = () => {

  const base_url = useContext(GlobalContext).url;
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [data, setData] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [trangthai, setTrangThai] = useState([]);
  const [loaicv, setLoaiCV] = useState([]);
  const [manvth, setMaNVTH] = useState([]);
  const [ngaybd, setNgayBD] = useState(null);
  const [ngaykt, setNgayKT] = useState(null);
  const navigation = useNavigation();
  const route = useRoute();

  useEffect(() => {
    const fetchParamsAndData = async () => {
      try {
        const {
          keyword = "",
          trangthai = [],
          loaicv = [],
          manvth = [],
          ngaybd = "",
          ngaykt = ""
        } = route?.params || {};

        setKeyword(keyword);
        setTrangThai(trangthai);
        setLoaiCV(loaicv);
        setMaNVTH(manvth);
        setNgayBD(ngaybd);
        setNgayKT(ngaykt);

        await fetchData(keyword, trangthai, loaicv, manvth, ngaybd, ngaykt);
      } catch (error) {
        console.error('Error fetching params and data:', error);
      }
    };

    fetchParamsAndData();
  }, [route.params]);

  const fetchData = async (_keyword, _trangthai, _loaicv, _manvth, _ngaybd, _ngaykt) => {
    try {
      setIsLoading(true);
      const userMaDonVi = await AsyncStorage.getItem('userMaDonVi');
      const response = await getListCongViecBaoTriByDonVi(
        base_url,
        _keyword,
        _trangthai,
        _loaicv,
        _manvth,
        _ngaybd,
        _ngaykt,
        parseInt(userMaDonVi, 10)
      );

      if (response && response.resultCode === true) {
        setData(response.data);
      } else {
        setData([]);
      }
    } catch (error) {      
      setData([]);
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleSearch = async (keyword, trangthai, loaicv, manvth, ngaybd, ngaykt) => {
    try {
      navigation.navigate("CongViecBaoTriScreen", { keyword, trangthai, loaicv, manvth, ngaybd, ngaykt });
    } catch (error) {
      console.error("Error storing data:", error);
    }
  };

  const LoadRefreshData = async () => {
    try {
      navigation.navigate("CongViecBaoTriScreen", {
        keyword: "",
        trangthai: [],
        loaicv: [],
        manvth: [],
        ngaybd: "",
        ngaykt: ""
      });
    } catch (error) {
      console.error("Error storing data:", error);
    }
  };

  let date = new Date();
  let day = date.getDate();
  let month = date.getMonth();
  let year = date.getFullYear();

  const dateBegin = new Date(year, month, day);
  const dateEnd = new Date(year, month + 1, day);

  // Convert dates to ISO string format
  const dateBeginStr = dateBegin ? moment(dateBegin).toISOString() : null;
  const dateEndStr = dateEnd ? moment(dateEnd).toISOString() : null;

  const handlePlusItem = async () => {
    try {
      navigation.navigate("AddEditCongViecScreen", {
        macv: 0,
        matb: 0,
        tentb: null,
        tencv: null,
        loaicv: 0,
        tenloaicv: null,
        loaikh: 0,
        tenloaikh: null,
        ngaybd: dateBeginStr,
        ngaykt: dateEndStr,
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
    } catch (error) {
      console.error("Error storing data:", error);
    }
  };

  const handleBack = async () => {
    try {
      setIsLoading(true);
      navigation.navigate('Home');
    } catch (error) {
      console.error("Error:", error);
      Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };  

  return (
    <View style={styles.container}>  

      <View style={styles.rowHeader}>
        <Icon name="chevron-left" color="#000" size={26} onPress={handleBack} />                     
        <Text style={styles.titleHeader}>Công Việc Bảo Trì</Text>
        <TouchableOpacity style={[styles.buttonFilter, {marginLeft: 5 }]}  onPress={handleOpenModal} title="Tìm kiếm">
          <Icon name="filter" color="#fff" size={22} />                
        </TouchableOpacity> 
        <TouchableOpacity style={[styles.buttonRefesh, {marginLeft: 5 }]} onPress={LoadRefreshData} title="Refresh Data">
          <Icon name="autorenew" color="#fff" size={22} />                
        </TouchableOpacity>      
        <TouchableOpacity style={[styles.buttonPlus, {marginLeft: 5 }]}  onPress={handlePlusItem} title="Thêm">
          <Icon name="plus" color="#fff" size={22} />                
        </TouchableOpacity>                                                                
        <SearchCongViecModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSearch={handleSearch} 
        />
      </View>

      <PaperProvider>
        {isLoading ? (
          <Loading />
        ) : (                                    
          data && data.length > 0 ? (
            <FlatList
              data={data}
              renderItem={({ item }) => <FlatListItemCongViecBaoTri item={item} />}
              keyExtractor={item => item.macv.toString()}
              onRefresh={() => fetchData(keyword, trangthai, loaicv, manvth, ngaybd, ngaykt)}
              refreshing={isLoading}
            />
          ) : (
            <View style={styles.cardView}>
              <View style={styles.cardViewDataNullContainer}>
                <View style={styles.viewContainerFlatlist}>
                  <View style={styles.noDataView}>
                    <Text style={styles.noDataText}>Chưa có công việc bảo trì!!</Text>
                  </View>
                </View>
              </View>
            </View>
          )                   
        )}
      </PaperProvider>       
    </View>
  );
};

const FlatListItemCongViecBaoTri = ({ item }) => {

  const base_url = useContext(GlobalContext).url;
  const [modalDelVisible, setModalDelVisible] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [visible, setVisible] = useState(false);
  const [tenTrangThai, setTenTrangThai] = useState('');
  const [tenLoaiCV, setTenLoaiCV] = useState('');
  const [tenDoUuTien, setTenDoUuTien] = useState('');
  const [tenNhanVienTH, setTenNhanVienTH] = useState('');
  const [tenNhanVienKT, setTenNhanVienKT] = useState('');
  const [tenLoaiKH, setTenLoaiKH] = useState('');
  const [tenThietBi, setTenThietBi] = useState('');

  const [dataTB, setDataThietBi] = useState([]);
  const [dataTH, setDataTH] = useState([]);
  const [dataKT, setDataKT] = useState([]);  

  const navigation = useNavigation();

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

  const dataStatusLoaiCV = [
    { key: '1', value: 'Định kỳ' },
    { key: '2', value: 'Đột xuất' },
    { key: '3', value: 'Dự án' },
    { key: '4', value: 'Hằng ngày' },
  ];

  const dataStatusLoaiKH = [
    { key: '1', value: 'Trong KH' },
    { key: '2', value: 'Ngoài KH' },
  ];

  const dataStatusDoUuTien = [        
    {key:'1', value:'Trung bình'},
    {key:'2', value:'Thấp'},
    {key:'3', value:'Cao'},
  ] 

  useEffect(() => {
    setTenTrangThai(dataStatusTT.find(status => status.key == item.trangthai)?.value || '');
    setTenLoaiCV(dataStatusLoaiCV.find(status => status.key == item.loaicv)?.value || '');
    setTenLoaiKH(dataStatusLoaiKH.find(status => status.key == item.loaikh)?.value || '');
    setTenDoUuTien(dataStatusDoUuTien.find(status => status.key == item.douutien)?.value || '');
  }, [item]);

  useEffect(() => {

    const fetchDataTB = async () => {
      const userMaDonVi = await AsyncStorage.getItem('userMaDonVi');
      const response = await getListThietBiByDonVi(base_url, parseInt(userMaDonVi, 10));
      if (response && response.resultCode === true) {
        setDataThietBi(response.data);
      }
    };

    const fetchDataTH = async () => {
      const userMaDonVi = await AsyncStorage.getItem('userMaDonVi');
      const response = await getListNhanVienTH(base_url, parseInt(userMaDonVi, 10));
      if (response && response.resultCode === true) {
        setDataTH(response.data);
      }
    };

    const fetchDataKT = async () => {
      const userMaDonVi = await AsyncStorage.getItem('userMaDonVi');
      const response = await getListNhanVienKT(base_url, parseInt(userMaDonVi, 10));
      if (response && response.resultCode === true) {
        setDataKT(response.data);
      }
    };

    fetchDataTB();
    fetchDataTH();
    fetchDataKT();

  }, []);

  useEffect(() => {
    setTenThietBi(dataTB.find(nv =>  nv.key == item.matb)?.value || '');
    setTenNhanVienTH(dataTH.find(nv =>  nv.key == item.manvth)?.value || '');
    setTenNhanVienKT(dataKT.find(nv => nv.key == item.manvkt)?.value || '');
  }, [item, dataTB, dataTH, dataKT]);

  const closeMenu = () => setVisible(false);
  const openMenu = (id) => {
    setSelectedId(id);
    setVisible(true);
  };

  const handleDeleteItem = (id) => {
    setSelectedId(id);
    setModalDelVisible(true);
  };

  const handleEditItem = (id) => {
    setVisible(false);
    navigation.navigate("AddEditCongViecScreen", 
      { 
        macv: id,        
        matb: item.matb,
        tentb: tenThietBi,
        tencv: item.tencv,
        loaicv: item.loaicv,
        tenloaicv: tenLoaiCV,
        loaikh: item.loaikh,
        tenloaikh: tenLoaiKH,
        ngaybd: item.ngaybd,
        ngaykt: item.ngaykt,
        trangthai: item.trangthai,
        tentrangthai: tenTrangThai,       
        douutien: item.douutien,
        tendouutien: tenDoUuTien,
        manvth: item.manvth,
        tennvth: tenNhanVienTH,        
        manvkt: item.manvkt,
        tennvkt: tenNhanVienKT,
        noidung: item.noidung,
        ghichu: item.ghichu
      });
  };  

  return (
    <TouchableOpacity style={styles.itemContainer}>      
      <View style={styles.itemRow}>
        <View style = {styles.divFlexTen}>
          <Text style={styles.itemHeaderText}>{item.tencv}</Text> 
        </View> 
        <View style = {styles.divFlexOne}>                      
          <Menu
            visible={visible && selectedId === item.macv}
            onDismiss={closeMenu}
            anchor={<TouchableOpacity onPress={() => openMenu(item.macv)}><Icon name="dots-vertical" color="#000" size={22} /></TouchableOpacity>}
            style={styles.menuMargin} >

            <Menu.Item style={styles.menuItem} leadingIcon={() => <Icon name="account-edit" size={20} color="#000" />} onPress={() => handleEditItem(item.macv)} title="Sửa" />
            <Divider style={styles.divider} />
            <Menu.Item style={styles.menuItem} leadingIcon={() => <Icon name="delete" size={20} color="#000" />}  onPress={() => handleDeleteItem(item.macv)} title="Xóa" />
            <Divider style={styles.divider} />
            <Menu.Item style={styles.menuItem} leadingIcon={() => <Icon name="close" size={20} color="#000" />}  onPress={closeMenu} title="Đóng" />

          </Menu>
        </View>
      </View>
      <View style={styles.itemInfoRow}>
        <View style={styles.itemColumn}>
          <Text style={styles.itemLabel}>Từ ngày:</Text>
          <Text style={styles.itemValue}>{item.ngaybd ? getVietNamDate(item.ngaybd) : 'N/A'}</Text>
        </View>
        <View style={styles.itemColumn}>
          <Text style={styles.itemLabel}>Đến ngày:</Text>
          <Text style={styles.itemValue}>{item.ngaykt ? getVietNamDate(item.ngaykt) : 'N/A'}</Text>
        </View>
      </View>
      <View style={styles.itemInfoRow}>
        <View style={styles.itemColumn}>
          <Text style={styles.itemLabel}>Người thực hiện:</Text>
          <Text style={styles.itemValue}>{tenNhanVienTH}</Text>
        </View>
        <View style={styles.itemColumn}>
          <Text style={styles.itemLabel}>Người kiểm tra:</Text>
          <Text style={styles.itemValue}>{tenNhanVienKT}</Text>
        </View>
      </View>
      <View style={styles.itemInfoRow}>
        <View style={styles.itemColumn}>
          <Text style={styles.itemLabel}>Loại công việc:</Text>
          <Text style={styles.itemValue}>{tenLoaiCV}</Text>
        </View>
        <View style={styles.itemColumn}>
          <Text style={styles.itemLabel}>Trạng thái:</Text>
          <Text style={styles.itemValue}>{tenTrangThai} - {item.tiendo}%</Text>
        </View>
      </View>
      <DelCongViecModal
        visible={modalDelVisible}
        onClose={() => setModalDelVisible(false)}
        macv={selectedId}
        fetchData={() => fetchData(keyword, trangthai, loaicv, manvth, ngaybd, ngaykt)}
      />
    </TouchableOpacity>
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
    padding: 5,
  },
  titleHeader: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonFilter: {
    padding: 5,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  buttonRefesh: {
    padding: 5,
    backgroundColor: '#28a745',
    borderRadius: 5,
  },
  buttonPlus: {
    padding: 5,
    backgroundColor: '#ffc107',
    borderRadius: 5,
  },
  itemContainer: {    
    backgroundColor: 'white',
    padding: 15,
    width: width * 0.96, 
    height: 'auto',       
    margin: 5, 
    marginLeft: 'auto', 
    marginRight: 'auto',
    borderRadius: width * 0.02,
  },
  divFlexTen: {
     flex: 10,
  },
  divFlexOne: {
      flexDirection: 'row',       
      flex: 1,
  },  
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',    
  },
  itemHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemInfoRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
  itemColumn: {
    flex: 1,
  },
  itemLabel: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  itemValue: {
    fontSize: 14,
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
  cardViewContainer: {
      width: width * 0.96, 
      height: 'auto', 
      marginLeft: 'auto', 
      marginRight: 'auto'
  },
  cardViewDataNullContainer: {
      width: width * 0.96, 
      height: height / 10, 
      marginLeft: 'auto', 
      marginRight: 'auto'
  },
  viewContainerFlatlist : {
    flexDirection : 'row',
    marginBottom : 5,
    flex : 1
  },
  noDataView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
      fontSize: 16,
      color: '#000',
      paddingLeft: 10,
      paddingRight: 10,
  },
  menuMargin: {
    marginTop: -75,

  },
  divTouchableOpacity: {
      flexDirection: 'row', 
      alignItems: 'center', 
      marginLeft: 'auto', 
      marginRight: 10,
  },    
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  anchor: {    
    justifyContent: 'center',
    alignItems: 'center',   
  },
  menuItem: {
    fontSize: 13,
  },
});

export default CongViecBaoTriScreen;