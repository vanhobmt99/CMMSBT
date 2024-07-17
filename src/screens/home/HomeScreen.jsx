import React, { useContext, useState, useEffect } from 'react';
import { 
  Text, 
  View, 
  SafeAreaView, 
  StyleSheet, 
  Dimensions, 
  StatusBar,
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';
import { Provider as PaperProvider } from 'react-native-paper';
import { SelectList } from 'react-native-dropdown-select-list';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PieChart, BarChart, LineChart, ProgressChart } from 'react-native-chart-kit';
import { GlobalContext } from '../../store/GlobalProvider';
import { getTrangThaiCongViec, 
  getKeHoachBaoTriYearOfMonth,
  getLoaiKeHoach,
  getLoaiCongViec, 
  getListThietBiByNhom
} from '../../api/Api_BaoCao';

const { width } = Dimensions.get('window');

const HomeScreen = () => {
  const base_url = useContext(GlobalContext).url;
  const [isLoading, setIsLoading] = useState(false);
  
  const [ngaybd, setNgayBD] = useState("");
  const [ngaykt, setNgayKT] = useState("");
  const [isDatePickerVisible1, setDatePickerVisibility1] = useState(false);
  const [isDatePickerVisible2, setDatePickerVisibility2] = useState(false);

  // Biểu đồ trạng thái công việc
  const [ht, setHoanThanh] = useState(0);
  const [cht, setChuaHT] = useState(0);
  const [htdh, setHoanThanhDH] = useState(0);
  const [htqh, setHoanThanhQH] = useState(0);  
  
  // Biểu đồ kế hoạch bảo trì năm
  const [monthsData, setMonthsData] = useState(Array(12).fill(0));
  const [nam, setNam] = useState(null);
  const [datayear, setDataYear] = useState([]);

  // Biểu đồ loại kế hoạch
  const [trongkh, setTrongKH] = useState(0);
  const [ngoaikh, setNgoaiKH] = useState(0);

  // Biểu đồ loại công việc
  const [dinhky, setDinhKy] = useState(0);
  const [dotxuat, setDotXuat] = useState(0);
  const [duan, setDuAn] = useState(0);
  const [hangngay, setHangNgay] = useState(0);

  // Biểu đồ nhóm thiết bị
  const [tennhom, setTenNhom] = useState([]);
  const [soluong, setSoLuong] = useState([]);  

  const [selectedTab, setSelectedTab] = useState('tab1');

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

  const generateYears = () => {
    const currentYear = new Date().getFullYear() + 1;
    const years = [];
    for (let year = currentYear; year >= 2020; year--) {
      years.push({ key: year.toString(), value: year.toString() });
    }
    return years;
  };

  const fetchDataTT = async (_tungay, _denngay) => {
    try {
      setIsLoading(true);
      const userMaDonVi = await AsyncStorage.getItem('userMaDonVi');
      const response = await getTrangThaiCongViec(base_url, _tungay, _denngay, parseInt(userMaDonVi, 10));
      if (response && response.resultCode === true) {
        setHoanThanh(response.data.ht);
        setChuaHT(response.data.cht);
        setHoanThanhDH(response.data.htdh);
        setHoanThanhQH(response.data.htqh);
      } else {
        setHoanThanh(0);
        setChuaHT(0);
        setHoanThanhDH(0);
        setHoanThanhQH(0);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDataYear = async (_nam) => {
    try {
      setIsLoading(true);
      const userMaDonVi = await AsyncStorage.getItem('userMaDonVi');
      const response = await getKeHoachBaoTriYearOfMonth(base_url, _nam, parseInt(userMaDonVi, 10));
      if (response && response.resultCode === true) {
        const listone = response.data;
        const newMonthsData = [
          listone.t1 || 0,
          listone.t2 || 0,
          listone.t3 || 0,
          listone.t4 || 0,
          listone.t5 || 0,
          listone.t6 || 0,
          listone.t7 || 0,
          listone.t8 || 0,
          listone.t9 || 0,
          listone.t10 || 0,
          listone.t11 || 0,
          listone.t12 || 0,
        ];
        setMonthsData(newMonthsData);
      } else {
        setMonthsData(Array(12).fill(0));
      }
    } catch (error) {
      setMonthsData(Array(12).fill(0));
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDataLoaiKH = async (_tungay, _denngay) => {
    try {
      setIsLoading(true);
      const userMaDonVi = await AsyncStorage.getItem('userMaDonVi');
      const response = await getLoaiKeHoach(base_url, _tungay, _denngay, parseInt(userMaDonVi, 10));
      if (response && response.resultCode === true) {
        setTrongKH(response.data.trong);
        setNgoaiKH(response.data.ngoai);
      } else {
        setTrongKH(0);
        setNgoaiKH(0);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDataLoaiCV = async (_tungay, _denngay) => {
    try {
      setIsLoading(true);
      const userMaDonVi = await AsyncStorage.getItem('userMaDonVi');
      const response = await getLoaiCongViec(base_url, _tungay, _denngay, parseInt(userMaDonVi, 10));
      if (response && response.resultCode === true) {
        setDinhKy(response.data.dinhky);
        setDotXuat(response.data.dotxuat);
        setDuAn(response.data.duan);
        setHangNgay(response.data.hangngay);
      } else {
        setDinhKy(0);
        setDotXuat(0);
        setDuAn(0);
        setHangNgay(0);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDataNhomTB = async (_tungay, _denngay) => {
    try {
      setIsLoading(true);
      const userMaDonVi = await AsyncStorage.getItem('userMaDonVi');
      const response = await getListThietBiByNhom(base_url, _tungay, _denngay, parseInt(userMaDonVi, 10));
      if (response && response.resultCode === true) {
        updateChartData(response.data);
      } else {        
        setTenNhom([]);
        setSoLuong([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateChartData = (data) => {
    const tennhomArray = data.map(item => item.tenNhom);
    const soluongArray = data.map(item => item.soLuong);

    setTenNhom(tennhomArray);
    setSoLuong(soluongArray);
  };


  const lineChartData = {
    labels: ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12"],
    datasets: [{ data: monthsData }],
  };

  const barChartData = {
    labels: ['HT', 'CHT', 'HTĐH', 'HTQH'],
    datasets: [{ data: [ht, cht, htdh, htqh] }],
  };
  
  const pie1ChartData = {
    labels: ['Trong', 'Ngoài'],
    data: [ trongkh, ngoaikh ]
  };    

  const pie2ChartData = [
    {
      name: 'Định kỳ',
      population: dinhky,
      color: '#28a745',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
    {
      name: 'Đột xuất',
      population: dotxuat,
      color: '#007bff',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
    {
      name: 'Dự án',
      population: duan,
      color: '#6c757d',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
    {
      name: 'Hằng ngày',
      population: hangngay,
      color: '#dc3545',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
  ];

  const barChartNhomTBData = {
    labels: tennhom,
    datasets: [{ data: soluong }],
  };  

  const chartConfig = {
    backgroundColor: '#fff',
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(34, 128, 176, ${opacity})`,  // Màu xanh dương cho biểu đồ
    style: { borderRadius: 16 },
    propsForBackgroundLines: {
      strokeWidth: 1,
      stroke: '#e3e3e3',
      strokeDasharray: null,
    },
    propsForLabels: {
      fontSize: 12,
      fill: '#6c6c6c'
    },
  };

  useEffect(() => {
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const _tungay = new Date(year, date.getMonth(), day);
    const _denngay = new Date(year, month, day);

    let date_bd = _tungay ? getFormattedDate(_tungay) : "";
    let date_kt = _denngay ? getFormattedDate(_denngay) : ""; 

    // Fetch Data Kế Hoạch Bảo Trì Năm
    const years = generateYears();
    setDataYear(years);
    fetchDataYear(year);

    // Fetch Data Trạng Thái Công Việc
    fetchDataTT(date_bd, date_kt);

    // Fetch Data Loại Kế Hoạch
    fetchDataLoaiKH(date_bd, date_kt);

    // Fetch Data Loại Công Việc
    fetchDataLoaiCV(date_bd, date_kt);

    // Fetch Data Nhóm Thiết Bị
    fetchDataNhomTB(date_bd, date_kt);

    setNgayBD(_tungay);
    setNgayKT(_denngay);
    
  }, []);

  useEffect(() => {
    if (nam) {
      fetchDataYear(nam);
    }
  }, [nam]); 

  const handleSearch = async () => {
    try {
        setIsLoading(true); 
        let bd = ngaybd ? getFormattedDate(ngaybd) : "";
        let kt = ngaykt ? getFormattedDate(ngaykt) : "";           
        await fetchDataTT( bd, kt);
        await fetchDataLoaiKH(bd, kt);
        await fetchDataLoaiCV(bd, kt);    
        await fetchDataNhomTB(bd, kt);         
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
        resetFormState();    
        await fetchDataTT("", "");
        await fetchDataLoaiKH("", "");
        await fetchDataLoaiCV("", "");
        await fetchDataNhomTB("", ""); 
    } catch (error) {
        console.error("Lỗi trong khi refresh data:", error);
        Alert.alert('Refresh lỗi', error.message);
    } finally {
        setIsLoading(false);
    }
  };

  const resetFormState = () => {      
      setNgayBD("");
      setNgayKT("");

      setTrongKH(0);
      setNgoaiKH(0);

      setDinhKy(0);
      setDotXuat(0);
      setDuAn(0);
      setHangNgay(0);
  }; 

  const getDefaultOption = (id, data, defaultText = 'Chọn năm') => {
    const allOptions = [{ key: '0', value: defaultText }, ...data];
    if (id !== null && id !== undefined && parseInt(id) !== 0) {
      const foundItem = allOptions.find(item => parseInt(item.key) === parseInt(id));
      if (foundItem) {
        return { key: id.toString(), value: foundItem.value };
      }
    }
  };

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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor='#2755ab' barStyle="light-content" />
      <PaperProvider>
        <View style={styles.content}>
          {isLoading ? (
             <ActivityIndicator size="large" animating={true} color={"#0000ff"} />
          ) : (
            <ScrollView>                           
              <View style={styles.cardView}>
                <Text style={styles.cardTitleH4}>Kế hoạch bảo trì năm</Text>
                <View style={ styles.selectBoxContent }>
                  <SelectList
                    setSelected={setNam}
                    data={datayear}
                    defaultOption={getDefaultOption(nam, datayear, nam)}
                    save="key"
                    placeholder="Chọn năm"
                    boxStyles={styles.selectBox}
                    dropdownStyles={styles.dropdown}
                  />
                </View>                
              </View>
              <LineChart
                data={lineChartData}
                width={Dimensions.get("window").width - 16}
                height={220}
                chartConfig={chartConfig}
                style={styles.chart}
              />

              <View style={styles.cardView}>
                <View style={styles.datePickerContainer}>
                  <Text style={styles.label}>Từ ngày</Text>
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
                  <Text style={styles.label}>Đến ngày</Text>
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
                  </TouchableOpacity> 

                  <TouchableOpacity style={styles.btnButtonDel} onPress={handleCancel}>
                    <Icon name="autorenew" color="#fff" size={18} />
                  </TouchableOpacity>  

                </View>                               
              </View>

              <View style={styles.cardView}>
                <Text style={styles.cardTitleH4}>Trạng thái công việc</Text>
                <BarChart
                  data={barChartData}
                  width={Dimensions.get("window").width - 16}
                  height={220}
                  chartConfig={chartConfig}
                  style={styles.chart}
                  fromZero
                  showValuesOnTopOfBars
                />
              </View>

              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsContainer}>
                {renderTab('tab1', 'Loại kế hoạch')}
                {renderTab('tab2', 'Loại công việc')}
              </ScrollView>
              <View>
                {selectedTab === 'tab1' && 
                   <View style={[styles.cardView, { marginTop: -5 }]}>
                      <ProgressChart
                        data={pie1ChartData}
                        width={Dimensions.get("window").width - 16}
                        height={220}
                        chartConfig={chartConfig}
                        style={styles.chart}
                      />                    
                  </View>                  
                }
                {selectedTab === 'tab2' && 
                  <View style={[styles.cardView, { marginTop: -5 }]}>
                    <PieChart
                      data={pie2ChartData}
                      width={Dimensions.get("window").width - 16}
                      height={220}
                      chartConfig={chartConfig}
                      style={styles.chart}
                      accessor="population"
                      backgroundColor="transparent"
                      paddingLeft="15"
                      absolute
                    />
                  </View>
                }
              </View>     

              <View style={styles.cardView}>
                <Text style={styles.cardTitleH4}>Loại thiết bị</Text>          
                <BarChart
                  data={barChartNhomTBData}
                  width={Dimensions.get("window").width - 16}
                  height={220}
                  chartConfig={chartConfig}
                  style={styles.chart}
                  fromZero
                  showValuesOnTopOfBars
                />                           
              </View>

            </ScrollView>
          )}
        </View>
      </PaperProvider>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#dcdcdc',
  },
  tabsContainer: {
    marginTop: 5,
    width: width * 0.96,
    flexDirection: 'row',
    justifyContent: 'center', // Center the tabs horizontally
    alignItems: 'center', // Center the tabs vertically
    paddingVertical: 5,
  },
  tab: {     
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    marginHorizontal: 0,    
  }, 
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  tabView: {
    flex: 1,
    width: '100%',
  },
  cardView: {
    backgroundColor: 'white',
    width: width * 0.96,
    marginVertical: 5,
    borderRadius: width * 0.02,
    padding: 5,
  },   
  cardTitleH4: {
    padding: 10,
    fontWeight: 'bold',
    fontSize: 17,
    textAlign: 'center',
    color: 'green',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  spacer: {
    height: 10,
  },
  selectBoxContent: {
    marginLeft: 10, 
    marginRight: 10,
    marginBottom: 5,
  },
  selectBox: {
    marginVertical: 5,
  },
  dropdown: {
    marginVertical: 5,
  },
  row: {
    marginTop: 5,      
    flexDirection: 'row',
    height: 40,
    marginLeft: 10, 
    marginRight: 10,
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
    marginBottom: 5,
    marginLeft: 10, 
    marginRight: 10,
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

export default HomeScreen;