import React, { useContext, useState } from 'react';
import { 
  View, 
  Text,   
  Alert, 
  TouchableOpacity,
  StyleSheet, 
  Dimensions, 
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Animatable from 'react-native-animatable';
import { Provider as PaperProvider } from 'react-native-paper';
import { GlobalContext } from '../../store/GlobalProvider';
import { Loading } from '../../common/Loading';
import { useRoute, useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const ConfigScreen = () => {
  const base_url = useContext(GlobalContext).url;
  const [isLoading, setIsLoading] = useState(false);   
  const navigation = useNavigation();
  const route = useRoute(); 

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

  const handleLinkThietBi = () => {   
    try {       
        navigation.navigate("ThietBi", { keyword: "", loaitb: 0, trangthai: 0 });
    } catch (error) {
        console.error("Error storing data:", error);
    }
  };

  const handleLinkThongBao = () => {   
    try {       
        navigation.navigate("Notifications");
    } catch (error) {
        console.error("Error storing data:", error);
    }
  };

  const handleLinkCongViec = () => {   
    try {       
        navigation.navigate("CongViecBaoTriScreen");
    } catch (error) {
        console.error("Error storing data:", error);
    }
  };

  const handleLinkTaiKhoan = () => {   
    try {       
        navigation.navigate("TaiKhoan");
    } catch (error) {
        console.error("Error storing data:", error);
    }
  };

  return (
    <View style={styles.container}>  
      <View style={styles.rowHeader}>
        <Icon name="chevron-left" color="#000" size={26} onPress={handleBack} />                     
        <Text style={styles.titleHeader}>Cấu hình</Text>    
      </View>

      <PaperProvider>
        {isLoading ? (
          <Loading />
        ) : (                  
          <View>
            
            <View style={styles.header}>
              <Animatable.Image 
                animation="bounceIn"
                duraton="1500"
                source={require('../../assets/logo.png')}
                style={styles.logo}
                resizeMode="stretch"
              />
            </View>

            <View style={styles.cardView}>

              <View style={styles.column}>
                <View style={styles.quarterView1}>
                  <TouchableOpacity onPress={handleLinkThietBi} style={styles.fullWidth}>
                    <Icon name='ballot' size={40} color={'#029cf2'} />
                    <Text style={[styles.noDataText, {color:'#029cf2'}]}>Thiết bị</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.quarterView2}>
                  <TouchableOpacity onPress={handleLinkThongBao} style={styles.fullWidth}>
                    <Icon name='bell-badge-outline' size={40} color={'#18c142'} />
                    <Text style={[styles.noDataText, {color:'#18c142'}]}>Thông báo</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.column}>
                <View style={styles.quarterView3}>
                  <TouchableOpacity onPress={handleLinkCongViec} style={styles.fullWidth}>
                    <Icon name='account-outline' size={40} color={'#de182a'} />
                    <Text style={[styles.noDataText, {color:'#de182a'}]}>Công việc</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.quarterView4}>
                  <TouchableOpacity onPress={handleLinkTaiKhoan} style={styles.fullWidth}>
                    <Icon name='account' size={40} color={'#0063b8'} />
                    <Text style={[styles.noDataText, {color:'#0063b8'}]}>Tài khoản</Text>
                  </TouchableOpacity>
                </View>
              </View>

            </View>

          </View>
        )}
      </PaperProvider>       
    </View>
  );
};

const height_logo = height * 0.22;

const styles = StyleSheet.create({
  container: {
    flex: 1,  
    alignItems: 'center', 
    justifyContent: 'center',
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
  header: {
    flex: 1,
    marginTop: 10,
    alignItems: 'center',
    textAlign: 'center'
  },
  logo: {
    width: height_logo,
    height: height_logo
  },
  cardView: {   
    flexDirection: 'row',
    width: width * 0.96,
    marginTop: height_logo*1.1,
    justifyContent: 'space-between',
  },
  column: {
    width: '48%',
  },
  quarterView1: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    backgroundColor: '#dbedf9',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  quarterView2: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    backgroundColor: '#dff0e8',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  quarterView3: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    backgroundColor: '#f1e4fe',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  quarterView4: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    backgroundColor: '#fcecdd',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  fullWidth: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 16,
    fontWeight: 'bold',
    //color: '#000',
    paddingLeft: 10,
    paddingRight: 10,
  },
});

export default ConfigScreen;