import React, { useContext, useState, useEffect, useCallback } from 'react';
import { Text, View, Image, Modal, TouchableOpacity, Alert, SafeAreaView, StatusBar, FlatList, StyleSheet, Dimensions } from 'react-native';
//import CheckBox from '@react-native-community/checkbox';
import { Menu, Divider, Provider as PaperProvider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
    getListNhomThietBi, 
    getListKhuVuc, 
    getListTBByDonVi,
    getListParentID,
    getListXuatXuValue,
    getListNhaCungCapValue,
    getListHangSanXuatValue,
    getImageByThietBiID
 } from '../../api/Api_ThietBi';
import { GlobalContext } from '../../store/GlobalProvider';
import { getVietNamDate } from '../../common/CommonFunction';
import { Loading } from '../../common/Loading';
import { useRoute, useNavigation } from '@react-navigation/native';
import DelThietBiModal from '../../screens/thietbi/DelThietBiModal';
import moment from 'moment';
//import ImageViewer from 'react-native-image-zoom-viewer';

const { width, height } = Dimensions.get('window');

const ThietBiScreen = () => {

    const base_url = useContext(GlobalContext).url;    
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);  
    const [keyword, setKeyword] = useState("");
    const [loaitb, setLoaiTb] = useState(0);
    const [trangthai, setTrangThai] = useState(0);
    const navigation = useNavigation();
    const route = useRoute();

    useEffect(() => {
        const fetchParamsAndData = async () => {
            try {
                const { keyword = "", loaitb = 0, trangthai = 0 } = route?.params || {};

                setKeyword(keyword);
                setLoaiTb(loaitb ? parseInt(loaitb, 10) : 0);
                setTrangThai(trangthai ? parseInt(trangthai, 10) : 0);

                await fetchData(keyword, loaitb ? parseInt(loaitb, 10) : 0, trangthai ? parseInt(trangthai, 10) : 0);
            } catch (error) {
                console.error('Error fetching params and data:', error);
            }
        };

        fetchParamsAndData();
    }, [route.params]);
    
    const fetchData = async (keyword, loaitb, trangthai) => {
        try {
            setIsLoading(true);
            const userMaDonVi = await AsyncStorage.getItem('userMaDonVi');
            const response = await getListTBByDonVi(base_url, parseInt(userMaDonVi, 10), keyword, loaitb, trangthai);
            if (response && response.resultCode === true) {
                setData(response.data);
            } else {
                Alert.alert('Error', 'Failed to fetch data.');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            Alert.alert('Error', 'Failed to fetch data.');
        } finally {
            setIsLoading(false);
        }
    }; 

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor='#2755ab' barStyle="light-content" />           
            <PaperProvider>
                {isLoading ? (
                    <Loading />
                ) : (                  
                    data && data.length > 0 ? (
                        <FlatList
                            data={data}
                            renderItem={({ item }) => <FlatListItemThietBi item={item} />}
                            keyExtractor={item => item.thietBiId.toString()}
                            onRefresh={() => fetchData(keyword, loaitb, trangthai)}
                            refreshing={isLoading}
                        />
                    ) : (
                        <View style={styles.cardView}>
                            <View style={styles.cardViewDataNullContainer}>
                                <View style={styles.viewContainerFlatlist}>
                                    <View style={styles.noDataView}>
                                        <Text style={styles.noDataText}>Chưa có thiết bị nào cần bảo trì!</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    )                   
                )}
            </PaperProvider> 
                       
        </SafeAreaView>
    );
};
   

export default ThietBiScreen;

function FlatListItemThietBi({ item }) {

    const base_url = useContext(GlobalContext).url;

    const [TenLoaiTB, setTenLoaiTB] = useState('');
    const [TenKhuVuc, setTenKhuVuc] = useState('');
    const [TenDiaDiemCha, setTenDiaDiemCha] = useState('');
    const [TenDiaDiem, setTenDiaDiem] = useState('');
    const [TrangThai, setTrangThai] = useState('');
    const [TenXuatXu, setTenXuatXu] = useState('');
    const [TenNhaCungCap, setTenNhaCungCap] = useState('');
    const [TenHangSanXuat, setTenHangSanXuat] = useState('');

    const [modalDelVisible, setModalDelVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedThietBiId, setSelectedThietBiId] = useState(null);
    const [imageUri, setImageUri] = useState(null);
    const [visible, setVisible] = useState(false);
    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);
    const navigation = useNavigation();

    const fetchData = useCallback(async (fetchFunction, params = [], _parentId = null) => {
    try {
        const response = await fetchFunction(base_url, ...params, _parentId);
        if (response && response.resultCode === true) {
        return response.data;
        }
        return [];
    } catch (error) {
        console.error("Error fetching data: ", error);
        return [];
    }
    }, [base_url]);

    const getAreaName = useCallback(async (fetchFunction, areaId, idKey, nameKey) => {
    const data = await fetchFunction();
    //console.log(`Data fetched for areaId ${areaId}:`, data);
    const area = data.find((a) => parseInt(a[idKey], 10) === areaId);
    return area ? area[nameKey] : '';
    }, []);

    const statusMapping = {
        1: 'Hoạt động',
        2: 'Không hoạt động',
        3: 'Dự phòng',
        4: 'Hỏng',
        5: 'Mất',
        6: 'Thanh lý'
    };

    const fetchLoaiTB = useCallback(() => fetchData(getListNhomThietBi), [fetchData]);
    const fetchXuatXu = useCallback(() => fetchData(getListXuatXuValue), [fetchData]);
    const fetchNhaCungCap = useCallback(() => fetchData(getListNhaCungCapValue), [fetchData]);
    const fetchHangSanXuat = useCallback(() => fetchData(getListHangSanXuatValue), [fetchData]);

    const fetchListKhuVuc = useCallback(async () => {
    const userMaDonVi = await AsyncStorage.getItem('userMaDonVi');
    return fetchData(getListKhuVuc, [parseInt(userMaDonVi, 10)]);
    }, [fetchData]);

    const fetchListDiaDiemCha = useCallback(async () => {
    const userMaDonVi = await AsyncStorage.getItem('userMaDonVi');
    return fetchData(getListParentID, [parseInt(userMaDonVi, 10)], item.khuVucId);
    }, [fetchData]);

    const fetchListDiaDiem = useCallback(async () => {
    const userMaDonVi = await AsyncStorage.getItem('userMaDonVi');
    return fetchData(getListParentID, [parseInt(userMaDonVi, 10)], item.diaDiemChaId);
    }, [fetchData]);

    const fetchAreaData = useCallback(async (fetchFunction, setName, itemId, idKey, nameKey) => {
    if (itemId) {
        const name = await getAreaName(fetchFunction, parseInt(itemId, 10), idKey, nameKey);
        setName(name);
    } else {
        setName('');
    }
    }, [getAreaName]);

    const fetchAreaTrangThai = useCallback(() => {
    if (item?.status) {
        const tt = parseInt(item.status, 10);
        setTrangThai(statusMapping[tt] || '');
    } else {
        setTrangThai('');
    }
    }, [item?.status]);

    const fetchImageUri = async () => {
        try {
          const response = await getImageByThietBiID(base_url, item.thietBiId);
          if (response && response.resultCode === true) {
            setImageUri(response.url);
          }
        } catch (error) {
          console.error("Error fetching image URI: ", error);
        }
    };

    useEffect(() => {
    const fetchInitialData = async () => {
        if (item) {
        await fetchAreaData(fetchLoaiTB, setTenLoaiTB, item?.nhomThietBiId, 'nhomThietBiId', 'tenNhom');
        await fetchAreaData(fetchListKhuVuc, setTenKhuVuc, item?.khuVucId, 'key', 'value');
        await fetchAreaData(fetchListDiaDiemCha, setTenDiaDiemCha, item?.diaDiemChaId, 'key', 'value');
        await fetchAreaData(fetchListDiaDiem, setTenDiaDiem, item?.diaDiemId, 'key', 'value');
        fetchAreaTrangThai();
        fetchImageUri();
        await fetchAreaData(fetchXuatXu, setTenXuatXu, item?.nuocSanXuatId, 'key', 'value');
        await fetchAreaData(fetchNhaCungCap, setTenNhaCungCap, item?.nhaCungCapId, 'key', 'value');
        await fetchAreaData(fetchHangSanXuat, setTenHangSanXuat, item?.hangSanXuatId, 'key', 'value');
        }
    };

    fetchInitialData();
    }, [item,
        fetchAreaData,
        fetchLoaiTB,
        fetchListKhuVuc,
        fetchListDiaDiemCha,
        fetchListDiaDiem,
        fetchAreaTrangThai,
        fetchImageUri(),
        fetchXuatXu,
        fetchNhaCungCap,
        fetchHangSanXuat
    ]);

    /*const handleCheckBoxChange = (newValue) => {
        setToggleCheckBox(newValue);
        if (newValue) {
            if (item && item.thietBiId) {
                navigation.navigate("EditThietBiScreen", { thietBiId: item.thietBiId });
            } else {
                console.error("No thietBiId available for editing");
            }
        }
    }; */

    const showDialog = () => {
        setSelectedThietBiId(parseInt(item?.thietBiId, 10));
        setModalDelVisible(true);
    };

    const handleSearch = async (keyword, loaitb, trangthai) => {   
        try {       
            navigation.navigate("ThietBiTab", { keyword, loaitb, trangthai });
        } catch (error) {
            console.error("Error storing data:", error);
        }
    };   

    const handleEdit = () => {
        try {
            if (item?.thietBiId) {
                navigation.navigate("EditThietBiScreen", 
                { 
                    thietBiId: item.thietBiId,
                    tenTb: item.tenTb || null,
                    model: item.model || null,
                    nhomThietBiId: item.nhomThietBiId || 0,
                    tenNhom: TenLoaiTB || "Tất cả",
                    nuocSanXuatId: item.nuocSanXuatId || 0,
                    tennuocsx: TenXuatXu || "Tất cả",
                    nhaCungCapId: item.nhaCungCapId || 0,
                    tenncc: TenNhaCungCap || "Tất cả",
                    hangSanXuatId: item.hangSanXuatId || 0,
                    tenHangsx: TenHangSanXuat || "Tất cả",
                    khuVucId: item.khuVucId || 0,
                    tenKhuVuc: TenKhuVuc || "Tất cả",
                    diaDiemChaId: item.diaDiemChaId || 0,
                    tenDiaDiemCha: TenDiaDiemCha || "Tất cả",
                    diaDiemId: item.diaDiemId || 0,
                    tenDiaDiem: TenDiaDiem || "Tất cả",
                    namSx: item.namSx || 0,
                    ngayMua: item.ngayMua ? moment(item.ngayMua).toISOString() : null,
                    ngaySuDung: item.ngaySuDung ? moment(item.ngaySuDung).toISOString() : null,
                    ngayBh: item.ngayBh ? moment(item.ngayBh).toISOString() : null,
                    ngayHetBh: item.ngayHetBh ? moment(item.ngayHetBh).toISOString() : null,
                    chuKyBaoTri: item.chuKyBaoTri || 0,
                    hinhAnh: item.hinhAnh || null,
                    congDung: item.congDung || null,
                    congSuatThietKe: item.congSuatThietKe || 0,
                    congSuatThucTe: item.congSuatThucTe || 0,
                    hanBaoHanh: item.hanBaoHanh || "0",                   
                    tuoiTho: item.tuoiTho || 0,
                    thoiGianSuDung: item.thoiGianSuDung || 0,
                    viTriLapDat: item.viTriLapDat || null,
                    ghiChu: item.ghiChu || null,
                    status: item.status || 0,
                    tenTrangThai: TrangThai || null,
                    thongSoThietBi: item.thongSoThietBi || null         

                });
            }
        } catch (error) {
            console.error("Error edit data:", error);
        }
    };

    const handleCauTruc = () => {
        try {
            if (item?.thietBiId) {
                navigation.navigate("CauTrucThietBiScreen", 
                { 
                    thietBiId: item.thietBiId,                    
                });
            }
        } catch (error) {
            console.error("Error edit data:", error);
        }
    };

    const handleKeHoachKiemTra = () => {
        try {
            if (item?.thietBiId) {
                navigation.navigate("LapKeHoachThietBiScreen", 
                { 
                    thietBiId: item.thietBiId,
                });
            }
        } catch (error) {
            console.error("Error edit data:", error);
        }
    };

    const renderImage = () => {
        if (imageUri) {
          return (
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Image
                source={{ uri: imageUri }}
                style={styles.imageStyle}
              />
            </TouchableOpacity>
          );
        }
        return null;
    };

    /*const renderImage = () => {
        const uri = imageUri;
        if (uri) {
          return (
            <Image
                source={{ uri }}
                style={styles.imageStyle}
            />
          );
        }
        return null;
    };*/

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
                    <Text style={styles.titleFlatlist}>Model:</Text>
                    <View style = {styles.divFlexFive}>
                        <Text style={styles.itemFlatlist}>{item.model || ''}</Text>
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

                            {renderMenuItem(handleEdit, "Sửa thiết bị", "account-edit")}
                            {renderMenuItem(showDialog, "Xóa thiết bị", "delete")}
                            {renderMenuItem(handleCauTruc, "Cấu trúc thiết bị", "calculator")}
                            {renderMenuItem(handleKeHoachKiemTra, "Kế hoạch kiểm tra", "calendar-month-outline")}
                            {renderMenuItem(closeMenu, "Đóng", "close", 20, '#000', false)}

                        </Menu>                                                      
                    </View>      
                    <DelThietBiModal
                        visible={modalDelVisible}
                        onClose={() => setModalDelVisible(false)}
                        onSearch={handleSearch}
                        thietBiId={selectedThietBiId}
                    />                                                       
                </View>                 
                <View style={styles.viewContainerFlatlist}>
                    <Text style={styles.titleFlatlist}>Tên TB:</Text>
                    <Text style={styles.itemFlatlist}>{item.tenTb || ''}</Text>
                </View>                
                <View style={styles.viewContainerFlatlist}>
                    <Text style={styles.titleFlatlist}>Nhóm TB:</Text>
                    <Text style={styles.itemFlatlist}>{TenLoaiTB}</Text>
                </View>
                <View style={styles.viewContainerFlatlist}>
                    <Text style={styles.titleFlatlist}>Location:</Text>
                    <Text style={styles.itemFlatlist}>{TenKhuVuc}</Text>                   
                </View>                        
                {TenDiaDiemCha && (
                    <View style={styles.viewContainerFlatlist}>
                        <Text style={styles.titleFlatlist}></Text>
                        <Text style={styles.itemFlatlist}>{TenDiaDiemCha}</Text>
                    </View>
                )}
                {TenDiaDiem && (
                    <View style={styles.viewContainerFlatlist}>
                        <Text style={styles.titleFlatlist}></Text>
                        <Text style={styles.itemFlatlist}>{TenDiaDiem}</Text>
                    </View>
                )}                  
                <View style={styles.viewContainerFlatlist}>
                    <Text style={styles.titleFlatlist}>Công dụng:</Text>
                    <Text style={styles.itemFlatlist}>{item.congDung || ''}</Text>
                </View>
                <View style={styles.viewContainerFlatlist}>
                    <Text style={styles.titleFlatlist}>Vị trí:</Text>
                    <Text style={styles.itemFlatlist}>{item.viTriLapDat || ''}</Text>
                </View>
                <View style={styles.viewContainerFlatlist}>
                    <Text style={styles.titleFlatlist}>Ngày SD:</Text>
                    <Text style={styles.itemFlatlist}>{item.ngaySuDung ? getVietNamDate(item.ngaySuDung) : ''}</Text>
                </View>                
                <View style={styles.viewContainerFlatlist}>
                    <Text style={styles.titleFlatlist}>Trạng thái:</Text>                     
                    <View style = {[styles.divFlexStatus]}> 
                        <TouchableOpacity style={{ marginTop: 10 }}>
                            <Text style={styles.submitText}>{TrangThai}</Text>
                        </TouchableOpacity>                                                                    
                    </View>                            
                    <View style = {styles.divImage}>
                        {imageUri && (
                          <>{renderImage()}</>                                                   
                        )}
                        <Modal
                            visible={modalVisible}
                            transparent={true}
                            onRequestClose={() => setModalVisible(false)}
                        >
                            <View style={styles.modalContainer}>
                                <View style={styles.modalContent}>
                                    <Image
                                        source={{ uri: imageUri }}
                                        style={styles.modalImage}
                                        resizeMode="contain"
                                    />
                                    <TouchableOpacity
                                        style={styles.closeButton}
                                        onPress={() => setModalVisible(false)}
                                        >
                                        <Text style={styles.closeButtonText}>X</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal>
                    </View> 
                </View>

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 5,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#dcdcdc',
    },
    cardView : {       
        backgroundColor: 'white',
        margin: width * 0.01,
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
        height: height / 5, 
        marginLeft: 'auto', 
        marginRight: 'auto'
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
      marginTop: -65,
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
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
        width: '92%',
    },
    modalImage: {
        width: '100%',
        height: height/3,
        resizeMode: 'contain',
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: 6,
        paddingRight: 6,
        borderRadius: 3,
    },
    closeButtonText: {
        color: 'white',
        fontSize: 16,
    },
});