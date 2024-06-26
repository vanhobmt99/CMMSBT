import React, { useState, useEffect, useContext } from 'react';
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
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {SelectList} from 'react-native-dropdown-select-list';
import CheckBox from '@react-native-community/checkbox';
import Toast from 'react-native-toast-message';
import { getValidString, getValidNumber} from '../../common/CommonFunction';
import { GlobalContext } from '../../store/GlobalProvider';
import { getListThietBiByID } from '../../api/Api_ThietBi';
import { postPutLapKeHoach } from '../../api/Api_LapKeHoach';

const { width } = Dimensions.get('window');

const AddEditLapKeHoachScreen = ({ route, navigation }) => {

    const base_url = useContext(GlobalContext).url;
    const [isLoading, setIsLoading] = useState(false);    
    const [TenThietBiTitle, setTenThietBiTitle] = useState(""); 
    const [makh, setMakh] = useState(0);
    const [matb, setMatb] = useState(0);
    const [soluong, setSoLuong] = useState(1);
    const [noibaotri, setNoibaotri] = useState(null);
    const [chuky, setChuKy] = useState(0);
    const [nam, setNam] = useState(null);
    const [months, setMonths] = useState(Array(12).fill(false));
    const [data, setData] = useState([]);

    const handleNumberChange = (value, setter) => {
        if (/^\d+$/.test(value) || value === '') {
            setter(value);
        }
    };
    
    const generateYears = () => {
        const currentYear = new Date().getFullYear() + 1;
        const years = [];
        for (let year = currentYear; year >= 2020; year--) {
            years.push({ key: year.toString(), value: year.toString() });
        }
        return years;
    };

    const handleCheckboxChange = (index) => {
        setMonths(prevState => {
            const newMonths = [...prevState];
            newMonths[index] = !newMonths[index];
            return newMonths;
        });
    };
    
    const fetchThietBiTitle = async () => {
        try {
          const response = await getListThietBiByID(base_url, route.params.matb);
          if (response && response.resultCode === true) {
            setTenThietBiTitle(response.data.tenTb);
            setMatb(response.data.thietBiId);
          }
        } catch (error) {
          console.error("Error fetching title thiết bị: ", error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const years = generateYears();
            setData(years);
            await fetchThietBiTitle();
        };    
        fetchData();
    }, []);

    useEffect(() => {
        const fetchDataFromRoute = async () => {
            if (route.params) {
                const { makh, matb, soluong, noibaotri, chuky, nam, thang1, thang2, thang3, thang4,thang5,
                       thang6, thang7, thang8, thang9, thang10, thang11, thang12, } = route.params;
                setMakh(makh);
                setMatb(matb);
                setSoLuong(soluong);
                setNoibaotri(noibaotri);
                setChuKy(chuky);
                setNam(nam);
                setMonths([thang1, thang2, thang3, thang4, thang5, thang6, thang7, thang8, thang9, thang10, thang11, thang12]);
            }
        };
        fetchDataFromRoute();
    }, [route.params]);

    const handleBack = () => {
        try {
            setIsLoading(true);
            resetFormState();
            navigation.navigate('LapKeHoachThietBiScreen', { keyword: "", nambt: 0 });
        } catch (error) {
            console.error("Error:", error);
            Alert.alert('Error', error.message);
        } finally {
            setIsLoading(false);
        }
    };   

    const convertDataKeysToString = (data) => {
        return data.map(item => ({ key: item.key.toString(), value: item.value }));
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
    const dataNamOptions = convertDataKeysToString(data);

    const handleSubmit = async () => {       
        
        if (!noibaotri || parseInt(soluong) <= 0 || parseInt(chuky) <= 0 || !nam || !months.some(month => month)) {
            Toast.show({
                type: 'error',
                text1: 'Vui lòng điền đầy đủ các thông tin',
                text2: 'Nơi bảo trì, số lượng, chu kỳ (tháng/lần), năm, và chọn ít nhất một tháng bảo trì là trường bắt buộc!',
            });
            return;
        }
    
        try {
            setIsLoading(true);
            const formData = new FormData();
    
            formData.append('makh', getValidNumber(makh));
            formData.append('matb', getValidNumber(matb));
            formData.append('soluong', getValidNumber(soluong));
            formData.append('noibaotri', getValidString(noibaotri));
            formData.append('chuky', getValidNumber(chuky));
            formData.append('nam', getValidNumber(nam));
            months.forEach((month, index) => {
                formData.append(`thang${index + 1}`, month);
            });
    
            const response = await postPutLapKeHoach(base_url, formData);
            if (response?.resultCode) {
                resetFormState();
                navigation.navigate("LapKeHoachThietBiScreen", { keyword: "", nambt: 0 });
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
        setMakh(0);
        setMatb(0);
        setSoLuong(1);
        setNoibaotri(null);
        setChuKy(0);
        setNam(null);
        setMonths(Array(12).fill(false));
    };

    return (
        <View style={styles.container}>            
            <View style={styles.rowHeader}>
                <Icon name="chevron-left" color="#000" size={26} onPress={handleBack} />
                <Text style={styles.titleHeader}>Kế hoạch kiểm tra</Text>
            </View>
               
            <View style={{ height: 5 }}></View>
            <View style={styles.cardView}>
                <Text style={styles.cardTitleH4}>{TenThietBiTitle}</Text>
            </View>
            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                    <Text>Loading...</Text>
                </View>
                ) : (
                <>    
                <View style={styles.cardView}>
                    <View style={styles.cardViewContainer}>
                        <ScrollView>
                            <View style={{ height: 5 }}></View>
                            <View style={styles.inputGroup}>
                                <View style={styles.labelContainer}>
                                    <Text style={styles.label}>Nơi bảo trì:</Text>
                                    <Text style={styles.required}>(*)</Text>
                                </View>
                                <TextInput
                                    value={noibaotri}
                                    onChangeText={setNoibaotri}
                                    placeholder="Nhập nơi bảo trì"
                                    style={styles.textInput}
                                />
                            </View>
                            <View style={styles.inputGroup}>
                               <View style={styles.labelContainer}>
                                    <Text style={styles.label}>Số lượng:</Text>
                                    <Text style={styles.required}>(*)</Text>
                                </View>
                                <TextInput
                                    value={soluong.toString()}
                                    onChangeText={(value) => handleNumberChange(value, setSoLuong)}
                                    placeholder="Nhập số lượng"
                                    style={styles.textInput}
                                    keyboardType="numeric"
                                />
                            </View>
                            <View style={styles.inputGroup}>
                                <View style={styles.labelContainer}>
                                    <Text style={styles.label}>Chu kỳ (tháng/lần):</Text>
                                    <Text style={styles.required}>(*)</Text>
                                </View>
                                <TextInput
                                    value={chuky.toString()}
                                    onChangeText={(value) => handleNumberChange(value, setChuKy)}
                                    placeholder="Nhập chu kỳ"
                                    style={styles.textInput}
                                    keyboardType="numeric"
                                />
                            </View>
                            <View style={styles.inputContainer}>
                                <View style={styles.labelContainer}>
                                    <Text style={styles.label}>Năm:</Text>
                                    <Text style={styles.required}>(*)</Text>
                                </View>
                                <View style={{ marginTop: 5 }}>
                                    <SelectList
                                        setSelected={setNam}
                                        data={dataNamOptions}
                                        defaultOption={getDefaultOption(nam, data, nam)}
                                        save="key"
                                        placeholder="Chọn năm"
                                        boxStyles={styles.selectBox}
                                        dropdownStyles={styles.dropdown}
                                    />
                                </View>
                            </View>
                            <View style={{ height: 10 }}></View>
                            <View style={styles.inputGroup}>
                                <View style={styles.labelContainer}>
                                    <Text style={styles.label}>Tháng:</Text>
                                    <Text style={styles.required}>(*)</Text>
                                </View>
                                <View style={styles.horizontalContainer}>
                                    {months.map((month, index) => (
                                        <View key={index} style={styles.checkboxContainer}>
                                            <CheckBox
                                                value={month}
                                                onValueChange={() => handleCheckboxChange(index)}
                                            />
                                            <Text style={styles.checkboxLabel}>T{index + 1}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        </ScrollView>
                    </View>
                </View>
                </>
            )}
            
            <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
                <View style={styles.buttonContent}>
                    <Icon name="content-save-edit-outline" size={22} color="#fff" style={styles.saveIcon} />
                    <Text style={styles.submitButtonText}>
                        {isLoading ? 'ĐANG XỬ LÝ...' : 'LƯU THÔNG TIN'}
                    </Text>
                </View>
            </TouchableOpacity>
               
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

  });
  
  export default AddEditLapKeHoachScreen;