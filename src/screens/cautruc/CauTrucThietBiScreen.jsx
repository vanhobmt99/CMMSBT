import React, { useContext, useEffect, useState } from 'react';
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
import { useNavigation } from '@react-navigation/native';
import { Menu, Divider, Provider as PaperProvider } from 'react-native-paper';
import { getVietNamDate} from '../../common/CommonFunction';
import SearchCauTrucModal from './SearchCauTrucModal';
import DelCauTrucModal from './DelCauTrucModal';
import { GlobalContext } from '../../store/GlobalProvider';
import { getListThietBiByID } from '../../api/Api_ThietBi';
import { getListCauTrucThietBiByDonVi } from '../../api/Api_CauTruc';

const { width, height } = Dimensions.get('window');

const CauTrucThietBiScreen = ({ route, navigation }) => {

  const base_url = useContext(GlobalContext).url;     
  const [isLoading, setIsLoading] = useState(false); 
  const [modalVisible, setModalVisible] = useState(false); 
  const [TenThietBiTitle, setTenThietBiTitle] = useState(""); 
  const [MaTB, setMaTB] = useState(0); 
  const { thietBiId } = route.params;  

  const [data, setData] = useState([]); 
  const [keyword, setKeyword] = useState(""); 

  const fetchThietBiTitle = async () => {
    try {
      const response = await getListThietBiByID(base_url, thietBiId);
      if (response && response.resultCode === true) {
        setTenThietBiTitle(response.data.tenTb);
        setMaTB(response.data.thietBiId);
      }
    } catch (error) {
      console.error("Error fetching title thiết bị: ", error);
    }
  };

  useEffect(() => {
    const fetchParamsAndData = async () => {
      try {
        const { keyword = "" } = route?.params || {};
        setKeyword(keyword);
        await fetchData(keyword);
      } catch (error) {
        console.error('Error fetching params and data:', error);
      }
    };
    fetchParamsAndData();
    fetchThietBiTitle();
  }, [route.params]);  

  const fetchData = async (_keyword) => {
    try {
      setIsLoading(true);
      const userMaDonVi = await AsyncStorage.getItem('userMaDonVi');
      const response = await getListCauTrucThietBiByDonVi(base_url, _keyword, thietBiId, parseInt(userMaDonVi, 10));
      if (response && response.resultCode === true) {
        setData(response.data);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };    

  const handleOpenModal = () => {
    setModalVisible(true);
  }; 

  const handleSearch = async (keyword) => {   
    try {       
      navigation.navigate("CauTrucThietBiScreen", { keyword });
    } catch (error) {
      console.error("Error storing data:", error);
    }
  };
  
  const LoadRefreshData = async () => {   
    try {       
      navigation.navigate("CauTrucThietBiScreen", { keyword: "" });
    } catch (error) {
      console.error("Error storing data:", error);
    }
  };  

  const handlePlusItem = async () => {   
    try {       
      navigation.navigate("AddEditCauTrucScreen", 
        { 
          cauTrucThietBiId: 0,
          tenCttb: null,
          thietBiId: MaTB,
          xuatXu: null,
          soLuong: 1,            
          namSuDung: 0,
          ghiChu: null,
          cauTrucThietBiCha: 0,
          thongSoCauTrucTb: null          
        });
    } catch (error) {
      console.error("Error storing data:", error);
    }
  };

  const handleBack = () => {
    try {      
      setIsLoading(true);
      navigation.navigate('ThietBiTab', { keyword: '', loaitb: 0, trangthai: 0 });
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
              <Text style={styles.titleHeader}>Cấu trúc thiết bị</Text>

              <TouchableOpacity style={[styles.buttonFilter, {marginLeft: 10 }]}  onPress={handleOpenModal} title="Tìm kiếm">
                  <Icon name="filter" color="#fff" size={22} />                
              </TouchableOpacity> 

              <TouchableOpacity style={styles.buttonRefesh} onPress={LoadRefreshData} title="Refresh Data">
                  <Icon name="autorenew" color="#fff" size={22} />                
              </TouchableOpacity>      

              <TouchableOpacity style={styles.buttonPlus}  onPress={handlePlusItem} title="Thêm">
                <Icon name="plus" color="#fff" size={22} />                
              </TouchableOpacity>                                                                
              
              <SearchCauTrucModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onSearch={handleSearch} />
            </View>

            <View style={{ height: 5 }}></View>

            <View style={styles.cardView}>
              <Text style={styles.cardTitleH4}>{TenThietBiTitle}</Text>
            </View>

            <PaperProvider>
                {isLoading ? (
                   <Loading />
                ) : (                                    
                  data && data.length > 0 ? (
                    <FlatList
                      data={data}
                      renderItem={({ item }) => <FlatListItemCauTruc item={item} />}
                      keyExtractor={item => item.cauTrucThietBiId.toString()}
                      onRefresh={() => fetchData(keyword)}
                      refreshing={isLoading}
                     />
                 ) : (
                  <View style={styles.cardView}>
                    <View style={styles.cardViewDataNullContainer}>
                      <View style={styles.viewContainerFlatlist}>
                        <View style={styles.noDataView}>
                          <Text style={styles.noDataText}>Chưa có cấu trúc nào được lập của thiết bị trên này!</Text>
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

export default CauTrucThietBiScreen;

function FlatListItemCauTruc({ item }) {

  const [modalDelVisible, setModalDelVisible] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [visible, setVisible] = useState(false); 

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  const navigation = useNavigation();    

  const showDialog = () => {
      setSelectedId(parseInt(item?.cauTrucThietBiId, 10));
      setModalDelVisible(true);
  };

  const handleSearch = async (keyword) => {   
    try {       
      navigation.navigate("CauTrucThietBiScreen", { keyword });
    } catch (error) {
      console.error("Error storing data:", error);
    }
  };    

  const handleEdit = () => {
    try {
        if (item?.cauTrucThietBiId) {
          navigation.navigate("AddEditCauTrucScreen", 
          { 
            cauTrucThietBiId: item.cauTrucThietBiId,
            thietBiId: item.thietBiId,
            tenCttb: item.tenCttb ? item.tenCttb: null,
            xuatXu: item.xuatXu ? item.xuatXu: null,
            soLuong: parseInt(item.soLuong, 10) > 0 ? item.soLuong: 0,            
            namSuDung: parseInt(item.namSuDung, 10) >0 ? item.namSuDung: 0,
            ghiChu: item.ghiChu ? item.ghiChu : null,
            cauTrucThietBiCha: parseInt(item.cauTrucThietBiCha) >0 ? item.cauTrucThietBiCha : 0,
            thongSoCauTrucTb: item.thongSoCauTrucTb ? item.thongSoCauTrucTb : null  
          });
        }
    } catch (error) {
        console.error("Error edit data:", error);
    }
  };

  const renderMenuItem = (onPress, title, iconName, iconSize = 20, iconColor = '#000', showDivider = true) => (
    <>
      <Menu.Item 
        onPress={() => { 
          onPress(); 
          closeMenu();
        }} 
        title={title}
        style={styles.menuItem}
        leadingIcon={() => <Icon name={iconName} size={iconSize} color={iconColor} />} 
      />
      {showDivider && <Divider style={styles.divider} />}
    </>
  );

  return (
      <View style={styles.cardView}>        
          <View style={styles.cardViewContainer}>                                  
              <View style={styles.viewContainerFlatlist}>
                  <Text style={styles.titleFlatlist}>Thành phần:</Text>
                  <View style = {styles.divFlexFive}>
                      <Text style={styles.itemFlatlist}>{item.tenCttb || ''}</Text>
                  </View> 
                  <View style = {styles.divFlexOne}> 
                      <Menu
                          visible={visible}
                          onDismiss={closeMenu}
                          anchor={
                            <TouchableOpacity onPress={openMenu} style={styles.divTouchableOpacity}>
                              <Icon name="dots-vertical" size={25} />
                            </TouchableOpacity>
                          }
                          style={styles.menuMargin}>

                          {renderMenuItem(handleEdit, "Sửa", "account-edit")}
                          {renderMenuItem(showDialog, "Xóa", "delete")}
                          {renderMenuItem(closeMenu, "Đóng", "close", 20, '#000', false)}

                      </Menu>                                                      
                  </View>      
                  <DelCauTrucModal
                      visible={modalDelVisible}
                      onClose={() => setModalDelVisible(false)}
                      onSearch={handleSearch}
                      cauTrucThietBiId={selectedId}
                  />                                                               
              </View>                           
              <View style={styles.viewContainerFlatlist}>
                  <Text style={styles.titleFlatlist}>Số lượng:</Text>
                  <Text style={styles.itemFlatlist}>{item.soLuong || 0}</Text>
              </View>                      
              <View style={styles.viewContainerFlatlist}>
                  <Text style={styles.titleFlatlist}>Xuất xứ:</Text>
                  <Text style={styles.itemFlatlist}>{item.xuatXu}</Text>
              </View>
              <View style={styles.viewContainerFlatlist}>
                  <Text style={styles.titleFlatlist}>Năm sử dụng:</Text>
                  <Text style={styles.itemFlatlist}>{item.namSuDung}</Text>
              </View>
              <View style={styles.viewContainerFlatlist}>
                  <Text style={styles.titleFlatlist}>Ngày:</Text>
                  <Text style={styles.itemFlatlist}>{item.ngayCapNhat ? getVietNamDate(item.ngayCapNhat) : ''}</Text>
              </View>                      

          </View>
      </View>
  );
}

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
  buttonFilter: {
    backgroundColor: '#5caef8',
    padding: 2,      
    borderRadius: 2,
  },
  buttonRefesh: {
    backgroundColor: '#5bc0de',
    marginLeft: 5,
    padding: 2,
    borderRadius: 2,
  },
 
  buttonPlus: {
    backgroundColor: '#5cb85c', 
    marginLeft: 5,
    padding: 2,
    borderRadius: 2,
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
  cardViewDataTitleContainer: {
    width: width * 0.96, 
    height: height / 24, 
    marginLeft: 'auto', 
    marginRight: 'auto'
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
  viewContainerFlatlist : {
      flexDirection : 'row',
      marginBottom : 5,
      flex : 1
  }, 
  titleFlatlist : {
      margin : 3,
      marginLeft : 5,
      paddingLeft: 10,
      fontStyle : 'italic',
      flex : 2,
  },
  itemFlatlist : {
      margin : 3,
      fontWeight : 'bold',
      flex : 6
  },
  iconFlatlist : {
      alignItems : 'flex-end',
      justifyContent : 'flex-start',
      marginRight : 10,
      flex : 1,
  },
  submitText: {    
      backgroundColor:'#428bca',
      width: 'auto', 
      paddingLeft: 7,  
      paddingRight: 7,      
      paddingTop: 1, 
      paddingBottom: 3, 
      fontWeight: 'bold', 
      textAlign: 'center',
      borderRadius: 5,
      color: '#fff',              
  },      
  btnCheckbox: {    
      position: 'absolute', // Đặt vị trí tuyệt đối
      right: 10, // Đặt cách lề phải
      top: 0, // Đặt cách lề trên
      width: 28, // Đặt chiều rộng
      height: 28, // Đặt chiều cao
      borderColor: '#ffffff',
      borderRadius: 5,
      marginVertical: 5,
      borderWidth: 0,
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
  noDataTitleView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataTitleText: {
      fontSize: 16,
      color: '#000',
      paddingLeft: 10,
      paddingRight: 10,
  },
  editButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#e0e0e0',
      padding: 5,
      borderRadius: 5,
  },
  editButtonText: {
      marginLeft: 5,
      color: '#000',
  },
  divFlexFive: {
      flex: 5,
  },
  divFlexOne: {
      flexDirection: 'row',       
      flex: 1,
  },    
  divFlexStatus: {
      flex: 4,
      flexDirection: 'row',
      marginTop: 3,
      marginRight: 0,        
  },
  divImage: {
      flex: 2,
      marginLeft: 5, 
      justifyContent: 'center',
      alignItems: 'center',       
  },     
  buttonDel: {
      backgroundColor: '#d9534f',        
      padding: 2,
      borderRadius: 3,
  },     
  buttonEdit: {
      backgroundColor: '#428bca', 
      marginLeft: 5,
      padding: 2,
      borderRadius: 3,
  }, 
  imageStyle: {
      maxWidth: 120,
      maxHeight: 120,
      marginBottom: 2,
      width: width * 0.1,
      height: undefined,  
      aspectRatio: 1,
  },
  menuMargin: {
    marginTop: -135,

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
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',    
    marginRight: 10,
    marginBottom: 5,
  },
  checkboxLabel: {
    marginLeft: 1,
  },

});