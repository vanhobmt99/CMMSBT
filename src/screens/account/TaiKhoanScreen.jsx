import React, {useState, useEffect} from 'react';
import { View, StyleSheet, Dimensions, StatusBar } from 'react-native';
import { useTheme, Title, Caption, Text } from 'react-native-paper';

import * as Animatable from 'react-native-animatable';
import { GlobalContext } from '../../store/GlobalProvider';
import { getDetailByDonVi } from  '../../api/Api_DungChung';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const TaiKhoanScreen = () => {
  const base_url  = React.useContext(GlobalContext).url; 
  const { colors } = useTheme();

  const [token, setToken] = useState('');  
  const [hoTen, setHoTen] = useState(''); 
  const [tendonvi, setTenDV] = useState('');
  const [tengiayto, setTenGiayTo] = useState('');
  const [diachi, setDiaChi] = useState('');
  const [dienthoai, setDienThoai] = useState('');

  useEffect(() => {
    const getData = async () => {
      try {
          const [userToken, userMaDonVi, userHoTen] = await Promise.all([
              AsyncStorage.getItem('userToken'),
              AsyncStorage.getItem('userMaDonVi'),
              AsyncStorage.getItem('userHoTen')
            ]);
            console.log(userToken);
            setToken(userToken);          
            console.log(userHoTen);
            setHoTen(userHoTen);

            const responsedv = await getDetailByDonVi(base_url, parseInt(userMaDonVi));  
            if (responsedv && responsedv.resultCode === true) {           
              console.log(responsedv.data.tendonvi);
              setTenDV(responsedv.data.tendonvi);  
              setTenGiayTo(responsedv.data.tengiayto);
              setDiaChi(responsedv.data.diachi);
              setDienThoai(responsedv.data.dienthoai);
            }                      

          } catch (error) {
              console.error(error);
          }
      };      
      getData();      
  }, [base_url]); 

    return (
      <View style={styles.container}>
        <StatusBar backgroundColor='#2755ab' barStyle="light-content"/>      
        <View style={styles.header}>
            <Animatable.Image 
                animation="bounceIn"
                duraton="1500"
            source={require('../../assets/logo.png')}
            style={styles.logo}
            resizeMode="stretch"
            />            
            <Title style={styles.titleUppercase}>{hoTen}</Title>
            <Caption style={styles.caption}>{tendonvi}</Caption>   
            <Text style={{height:7}}></Text>                
            <Text style={styles.caption}>@Biwase phiên bản 1.1.0</Text>
        </View>
        <Animatable.View 
            animation="fadeInUpBig"
            style={[styles.footer,{
                backgroundColor: colors.background
            }, {width: Dimensions.get('window').width * 0.96}]} >
            <View>
              <Text style={[styles.text_footer, {
                  color: colors.text }]}>THÔNG TIN ỨNG DỤNG:</Text>
              <Text style={styles.text_child}>Ứng dụng:</Text>
              <Text style={styles.text_child}>Hỗ trợ theo dõi lịch bảo trì định kỳ thiết bị thuộc Công ty CP - Tổng Công Ty Nước - Môi trường Bình Dương</Text>
              <Text style={styles.padding_space}></Text>
              <Text style={styles.bottomDrawerSection}></Text>
              <Text style={[styles.text_footer, {
                  color: colors.text }]}>THÔNG TIN LIÊN HỆ:</Text>
              <Text style={styles.text_child}>Trực thuộc: {tengiayto}</Text>              
              <Text style={styles.text_child}>Địa chỉ: {diachi}</Text>              
              <Text style={styles.text_child}>Điện thoại: {dienthoai}</Text>              
            </View>                
        </Animatable.View>
      </View>
    );
};

export default TaiKhoanScreen;

const height_logo = height * 0.22;

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center',
    backgroundColor: '#ecf0f3'    
  },
  header: {
    flex: 1,
    marginTop: 20,
    textAlign: 'center'
  },
  logo: {
    width: height_logo,
    height: height_logo
  },
  titleUppercase: {
    fontSize: 17,
    marginTop: 3,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    textAlign: 'center'
  },
  title: {
    fontSize: 16,
    marginTop: 3,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
    textAlign: 'center'
  },
  footer: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 5,
    paddingVertical: 10,
    flexDirection: 'row'
  },
  text_footer: {
    color: '#05375a',
    fontSize: 16,
    fontWeight: 'bold',
    paddingLeft: 10,
    paddingRight: 10, 
    marginTop: 8
  },
  text_child: {
    color: '#000',
    fontSize: 15,
    paddingLeft: 10,
    paddingRight: 10, 
    marginTop: 5
  },
  padding_space: {     
    marginTop: 3
  },
  bottomDrawerSection: {    
    borderTopColor: '#f4f4f4',
    borderTopWidth: 1
  },
});