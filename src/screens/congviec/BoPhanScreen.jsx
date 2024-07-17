import React, { useContext, useEffect, useState } from 'react';
import { 
  View, 
  Text,   
  Alert, 
  ScrollView,
  TouchableOpacity,    
  StyleSheet, 
  Dimensions, 
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Loading } from '../../common/Loading';
import { Provider as PaperProvider } from 'react-native-paper';
import ChuKyBaoDuongModal from './ChuKyBaoDuongModal';
import { useNavigation, useRoute } from '@react-navigation/native';
import { GlobalContext } from '../../store/GlobalProvider';
import { 
  getListDonViTinh,
  getListByMacv, 
  deleteCTCVByID 
} from '../../api/Api_CongViec';

const { width, height } = Dimensions.get('window');

const BoPhanScreen = () => {
  
  const base_url = useContext(GlobalContext).url;
  const [isLoading, setIsLoading] = useState(false);
  const [TenCVTitle, setTenCVTitle] = useState("");
  const [datadvt, setDatadvt] = useState([]);
  const navigation = useNavigation();
  const route = useRoute();

  const [modalEditVisible, setModalEditVisible] = useState(false);
  const [selectedDP, setSelectedDuPhong] = useState(null);
  const [selectedBD, setSelectedBaoDuong] = useState(null);
  const [selectedCK, setSelectedChuKy] = useState(null);
  const [selectedId, setSelectedId] = useState(0);

  const [tableData, setTableData] = useState({
    header: ['', '', '', '', '', '', 'Tên chi tiết', 'ĐVT', 'SL', 'Quy cách'],
    rows: [],
  });

  useEffect(() => {
    if (route.params) {
      const { macv, tencv } = route.params;     
      setTenCVTitle(tencv);
      fetchCTCVByMaCV(macv);
    }
  }, [route.params, datadvt]);

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

  // Load List All Chi Tiết Công Việc By MaCV
  const fetchCTCVByMaCV = async (_macv) => {
    try {
      const response = await getListByMacv(base_url, parseInt(_macv, 10));
      if (response?.resultCode === true) {
        const newRow = response.data.map(item => {
          const unit = datadvt.find(dvtItem => parseInt(dvtItem.key, 10) === parseInt(item.dvt, 10));
          return [
            item.id || 0,
            item.macv || 0,
            item.dvt || 0,
            item.duphong || '',
            item.baoduong || '',
            item.chuky || '',
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
          header: ['', '', '', '', '', '', 'Tên chi tiết', 'ĐVT', 'SL', 'Quy cách'],
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

  const handleEditItem = (id, duphong, baoduong, chuky) => {   
    setSelectedId(id);
    setSelectedDuPhong(duphong);
    setSelectedBaoDuong(baoduong);
    setSelectedChuKy(chuky);
    setModalEditVisible(true);
  };

  const handleBack = () => {
    navigation.navigate("CongViecBaoTriScreen", {
      keyword: "",
      trangthai: [],
      loaicv: [],
      manvth: [],
      ngaybd: "",
      ngaykt: ""
    });
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
    }
  };

  const TableRow = ({ row, rowIndex }) => {

    const _id = row[0];
    const _duphong = row[3];
    const _baoduong = row[4];
    const _chuky = row[5];

    return (
      <View style={[styles.tableRow, rowIndex % 2 === 0 ? styles.tableRowEven : styles.tableRowEven]}>
        {row.slice(6).map((cell, cellIndex) => (
           <View
           key={cellIndex + 6}
           style={[
               styles.tableCell,
               { width: cellWidths[cellIndex + 6] },
               (cellIndex === 1 || cellIndex === 2) && styles.centeredCell, 
           ]}
          >
            <Text style={styles.tableCellText}>{cell}</Text>
          </View>
        ))}
        <View style={[styles.tableCell, styles.removeCell]}>

          <TouchableOpacity onPress={() => handleEditItem(_id, _duphong, _baoduong, _chuky)}>
            <Icon name='pencil' color={'#007bff'} size={16} />
          </TouchableOpacity>
        </View>
        <View style={[styles.tableCell, styles.removeCell]}>

          <TouchableOpacity onPress={() => removeRow(rowIndex, _id)}>
            <Text style={styles.removeButton}>X</Text>
          </TouchableOpacity>

        </View>
      </View>
    );
  };

  const Table = ({ data }) => (
    <ScrollView horizontal>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          {data.header.slice(6).map((header, index) => (
            <View key={index + 6} style={[styles.tableCell, styles.tableHeader, { width: cellWidths[index + 6] }]}>
              <Text style={styles.tableHeaderText}>{header}</Text>
            </View>
          ))}
          <View style={[styles.tableCell, styles.tableHeader, { width: 30 }]}>
            <Text style={styles.tableHeaderText}></Text>
          </View>
          <View style={[styles.tableCell, styles.tableHeader, { width: 30 }]}>
            <Text style={styles.tableHeaderText}></Text>
          </View>
        </View>
        {data.rows.map((row, rowIndex) => (
          <TableRow key={rowIndex} row={row} rowIndex={rowIndex} />
        ))}
      </View>
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <View style={styles.rowHeader}>
        <Icon name="chevron-left" color="#000" size={26} onPress={handleBack} />
        <Text style={styles.titleHeader}>Chi tiết công việc</Text>

        <TouchableOpacity style={[styles.buttonFilter, { marginRight: 5 }]} onPress={() => fetchData(route.params.macv)}>
          <Icon name="autorenew" color="#fff" size={22} />
        </TouchableOpacity>

      </View>

      <View style={{ height: 5 }}></View>
      <View style={styles.cardViewNull}>
        <Text style={styles.cardTitleH4}>{TenCVTitle}</Text>
      </View>

      <PaperProvider>
        {isLoading ? (
          <Loading />
        ) : tableData.rows.length > 0 ? (
          <Table data={tableData} />
        ) : (
          <View style={styles.cardView}>
            <View style={styles.cardViewDataNullContainer}>
              <View style={styles.viewContainerFlatlist}>
                <View style={styles.noDataView}>
                  <Text style={styles.noDataText}>Chưa có bộ phận nào của công việc bảo trì này!</Text>
                </View>
              </View>
            </View>
          </View>
        )}
      </PaperProvider>

      <ChuKyBaoDuongModal
        visible={modalEditVisible}
        onClose={() => setModalEditVisible(false)}     
        id={selectedId}
        duphong={selectedDP}
        baoduong={selectedBD}
        chuky={selectedCK}
      />
    </View>
  );
};

const cellWidths = [0, 0, 0, 0, 0, 0, 120, 58, 45, 115];

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
    cardViewNull : {       
      backgroundColor: 'white',
      width: width * 0.96, 
      height: 'auto', 
      marginTop: 5, 
      marginBottom: 1, 
      marginLeft: 'auto', 
      marginRight: 'auto',
      paddingBottom: 5,
      paddingTop: 5,
    },
    cardView : {       
      backgroundColor: 'white',
      width: width * 0.96, 
      height: 'auto', 
      paddingTop: 5,  
      paddingBottom: 5, 
      marginLeft: 'auto', 
      marginRight: 'auto',
      marginBottom: 1, 
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
    cardViewDataNullContainer: {
      width: width * 0.96, 
      height: height / 12, 
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
    contentContainer: {
      flex: 1,
      padding: 10,
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
      padding: 6,
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

export default BoPhanScreen;