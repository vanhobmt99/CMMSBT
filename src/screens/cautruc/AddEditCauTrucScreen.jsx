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
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';
import { GlobalContext } from '../../store/GlobalProvider';
import { getListThietBiByID } from '../../api/Api_ThietBi';
import { postPutCauTrucThietBi } from '../../api/Api_CauTruc';

const { width } = Dimensions.get('window');

const AddEditCauTrucScreen = ({ route, navigation }) => {

  const base_url = useContext(GlobalContext).url;
  const [isLoading, setIsLoading] = useState(false);

  const [formState, setFormState] = useState({
      cauTrucThietBiId: 0,
      tenCttb: null,
      thietBiId: 0,
      xuatXu: null,
      soLuong: 1,
      namSuDung: 0,
      ghiChu: null,
      cauTrucThietBiCha: 0,
      thongSoCauTrucTb: null
  });

  const [TenThietBiTitle, setTenThietBiTitle] = useState("");
  const [showDescError, setShowDescError] = useState(false);
  const richText = useRef();

  const handleChange = (name, value) => {
    setFormState(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleNumberChange = (name, value) => {
    if (/^\d+$/.test(value) || value === '') {
      handleChange(name, value);
    }
  };

  const richTextThongSoHandle = useCallback((descriptionText) => {
    if (descriptionText) {
      setShowDescError(false);
      handleChange('thongSoCauTrucTb', descriptionText);
    } else {
      setShowDescError(true);
      handleChange('thongSoCauTrucTb', "");
    }
  }, []);

  const richTextGhiChuHandle = useCallback((descriptionText) => {
    if (descriptionText) {
      setShowDescError(false);
      handleChange('ghiChu', descriptionText);
    } else {
      setShowDescError(true);
      handleChange('ghiChu', "");
    }
  }, []);

  useEffect(() => {
    if (route.params) {
      const {
        cauTrucThietBiId,
        tenCttb,
        thietBiId,
        xuatXu,
        soLuong,
        namSuDung,
        ghiChu,
        cauTrucThietBiCha,
        thongSoCauTrucTb
      } = route.params;

      setFormState({
        cauTrucThietBiId,
        tenCttb,
        thietBiId,
        xuatXu,
        soLuong,
        namSuDung,
        ghiChu,
        cauTrucThietBiCha,
        thongSoCauTrucTb
      });
    }
  }, [route.params]);

  const handleBack = () => {
    try {
      setIsLoading(true);
      resetFormState();
      navigation.navigate('CauTrucThietBiScreen', { keyword: "" });
    } catch (error) {
      console.error("Error:", error);
      Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    
    if (!formState.tenCttb) {
      Toast.show({
        type: 'error',
        text1: 'Vui lòng điền đầy đủ các thông tin',
        text2: 'Thành phần chính là trường bắt buộc!',
      });
      setShowDescError(true);
      return;
    }

    try {
      setIsLoading(true);
      const formData = new FormData();

      Object.keys(formState).forEach(key => {
        formData.append(key, formState[key]);
      });

      const response = await postPutCauTrucThietBi(base_url, formData);
      if (response?.resultCode) {
        resetFormState();
        navigation.navigate("CauTrucThietBiScreen", { keyword: "" });
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
          cauTrucThietBiId: 0,
          tenCttb: null,
          thietBiId: 0,
          xuatXu: null,
          soLuong: 1,
          namSuDung: 0,
          ghiChu: null,
          cauTrucThietBiCha: 0,
          thongSoCauTrucTb: null
      });
  };

  const fetchThietBiTitle = async () => {
      try {
          const response = await getListThietBiByID(base_url, route.params.thietBiId);
          if (response && response.resultCode) {
              setTenThietBiTitle(response.data.tenTb);
              handleChange('thietBiId', response.data.thietBiId);
          }
      } catch (error) {
          console.error("Error fetching title thiết bị: ", error);
      }
  };

  useEffect(() => {
      const fetchData = async () => {
          await fetchThietBiTitle();
      };
      fetchData();
  }, []);

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

  const RichTextInput = ({ label, value, onChange, placeholder, showError, errorMessage }) => (
      <View style={styles.inputGroup}>
          <View style={styles.labelContainer}>
              <Text style={styles.label}>{label}:</Text>
          </View>
          <View style={styles.richTextContainer}>
              <RichEditor
                  ref={richText}
                  onChange={onChange}
                  maxLength={200}
                  editorStyle={styles.richEditor}
                  placeholder={placeholder}
                  initialContentHTML={value}
                  multiline
                  scrollEnabled
                  autoCorrect
                  autoCompleteType
                  spellCheck
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
  );
  
  return (
      <View style={styles.container}>
          <View style={styles.rowHeader}>
              <Icon name="chevron-left" color="#000" size={26} onPress={handleBack} />
              <Text style={styles.titleHeader}>Cấu trúc thiết bị</Text>
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
                  <ScrollView style={{ marginBottom: 50 }}>
                      <View style={styles.cardView}>
                          <View style={styles.cardViewContainer}>
                              <View style={{ height: 5 }}></View>
                              <InputGroup
                                  label="Thành phần"
                                  required
                                  value={formState.tenCttb}
                                  onChangeText={(value) => handleChange('tenCttb', value)}
                                  placeholder="Nhập tên thành phần chính"
                                  multiline
                                  numberOfLines={2}
                              />
                              <InputGroup
                                  label="Số lượng"
                                  value={formState.soLuong.toString()}
                                  onChangeText={(value) => handleNumberChange('soLuong', value)}
                                  placeholder="Nhập số lượng"
                                  keyboardType="numeric"
                              />
                              <InputGroup
                                  label="Xuất xứ"
                                  value={formState.xuatXu}
                                  onChangeText={(value) => handleChange('xuatXu', value)}
                                  placeholder="Nhập xuất xứ"
                              />
                              <InputGroup
                                  label="Năm sử dụng"
                                  value={formState.namSuDung.toString()}
                                  onChangeText={(value) => handleNumberChange('namSuDung', value)}
                                  placeholder="Nhập năm sử dụng"
                                  keyboardType="numeric"
                              />
                              <RichTextInput
                                  label="Thông số"
                                  value={formState.thongSoCauTrucTb}
                                  onChange={richTextThongSoHandle}
                                  placeholder="Nhập thông số kỹ thuật"
                                  showError={showDescError}
                                  //errorMessage="Your content shouldn't be empty"
                              />
                              <RichTextInput
                                  label="Ghi chú"
                                  value={formState.ghiChu}
                                  onChange={richTextGhiChuHandle}
                                  placeholder="Nhập ghi chú"
                                  showError={showDescError}
                                  //errorMessage="Your note shouldn't be empty"
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
  
  export default AddEditCauTrucScreen;