import React, { useContext, useState, useEffect, useCallback } from 'react';
import {Text, Button, View, SafeAreaView, TouchableOpacity, RefreshControl, ActivityIndicator,
StyleSheet, Dimensions, FlatList, Modal, Vibration, StatusBar} from 'react-native';
import { Menu, Provider as PaperProvider } from 'react-native-paper';
import { GlobalContext } from '../../store/GlobalProvider';
import {getListNhomThietBi, getListKhuVuc, getListTBByDonVi} from '../../api/Api_ThietBi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getVietNamDate} from '../../common/CommonFunction';
import {Loading} from '../../common/Loading';

const { width, height } = Dimensions.get('window');

const HomeScreen = ({navigation}) => {

  const base_url  = useContext(GlobalContext).url;  
  const [data, setData] = useState([]);   
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { 
    setTimeout(() => {
      fetchData();
      setIsLoading(false); // Update loading state when data fetching is complete
    }, 3000); // Simulate a 3-second delay       
  }, []);

  const fetchData = async () => {
    try
    {                 
      const userMaDonVi = await AsyncStorage.getItem('userMaDonVi');               
      const response = await getListTBByDonVi(base_url, parseInt(userMaDonVi));  
      if(response && response.resultCode === true){           
        //console.log(response.data);
        setData(response.data);  
      }                      
    } catch (error) {
      console.error(error);
    }
  }; 

    return (      
      <SafeAreaView style={styles.container}> 
      <StatusBar backgroundColor='#2755ab' barStyle="light-content"/>
        <PaperProvider> 
            {isLoading ? (
              <Loading />
            ) : (      
            <FlatList
                data={data}
                renderItem = {({item}) => (
                  <FlatListItemThietBi item = {item}/>                        
              )}
              keyExtractor = {item => item.thietBiId}
              refreshing={false} 
              onRefresh={fetchData} 
              >
            </FlatList>
          )}
        </PaperProvider> 
    </SafeAreaView>
    );
};

export default HomeScreen;

function FlatListItemThietBi({item}){ 

    const base_url = React.useContext(GlobalContext).url;
    const [TenLoaiTB, setTenLoaiTB] = useState('');
    const [TenKhuVuc, setTenKhuVuc] = useState('');

    //Lấy danh sách nhóm thiết bị
    const fetchLoaiTB = useCallback(async () => {
        const response = await getListNhomThietBi(base_url);
        if (response && response.resultCode === true) {
            //console.log(response.data);
            return response.data;
        }
        return [];
    }, [base_url]);

    const getAreaLoaiTB = useCallback(async (areaId) => {
        const data = await fetchLoaiTB();
        const area = data.find((a) => a.nhomThietBiId === areaId);
        return area ? area.tenNhom : '';
    }, [fetchLoaiTB]);

    const fetchAreaNhomTB = useCallback(async () => {
        const name = await getAreaLoaiTB(parseInt(item.nhomThietBiId));
        //console.log(name);
        setTenLoaiTB(name);
    }, [item.nhomThietBiId, getAreaLoaiTB]);

    //Lấy danh sách khu vực theo đơn vị
    const fetchListKhuVuc = useCallback(async () => {
        const userMaDonVi = await AsyncStorage.getItem('userMaDonVi');
        const response = await getListKhuVuc(base_url, parseInt(userMaDonVi));
        if (response && response.resultCode === true) {
            //console.log(response.data);
            return response.data;
        }
        return [];
    }, [base_url]);

    const getAreaKhuVuc = useCallback(async (areaId) => {
        const data = await fetchListKhuVuc();
        const area = data.find((a) => parseInt(a.key) === areaId);
        return area ? area.value : '';
    }, [fetchListKhuVuc]);

    const fetchAreaKhuVuc = useCallback(async () => {
        const name = await getAreaKhuVuc(parseInt(item.khuVucId));
        //console.log(name);
        setTenKhuVuc(name);
    }, [item.khuVucId, getAreaKhuVuc]);

    useEffect(() => {
        fetchAreaNhomTB();
        fetchAreaKhuVuc();
    }, [fetchAreaNhomTB, fetchAreaKhuVuc]);

  return (
      <View style={styles.cardView}>                
        <View style={{ width: Dimensions.get('window').width * 0.96, marginLeft: 'auto', marginRight: 'auto' }}>       
          <View style = {styles.viewContainerFlatlist}>
            <Text style={styles.titleFlatlist}>Model:</Text>  
            <Text style={styles.itemFlatlist}>{item.model}</Text>
            <View  style = {styles.iconFlatlist}></View>  
          </View>                   
          <View style = {styles.viewContainerFlatlist}>
            <Text style={styles.titleFlatlist}>Tên TB:</Text>  
            <Text style={styles.itemFlatlist}>{item.tenTb}</Text>
            <View  style = {styles.iconFlatlist}>                                         
            </View>  
          </View>           
          <View style = {styles.viewContainerFlatlist}>
            <Text style={styles.titleFlatlist}>Nhóm TB:</Text>  
            <Text style={styles.itemFlatlist}>{TenLoaiTB}</Text>
            <View  style = {styles.iconFlatlist}>                                         
            </View>  
          </View>                
          <View style = {styles.viewContainerFlatlist}>
            <Text style={styles.titleFlatlist}>Khu vực:</Text>  
            <Text style={styles.itemFlatlist}>{TenKhuVuc}</Text>
            <View  style = {styles.iconFlatlist}>  
            </View>  
          </View>
          <View style = {styles.viewContainerFlatlist}>
            <Text style={styles.titleFlatlist}>Công dụng:</Text>  
            <Text style={styles.itemFlatlist}>{item.congDung}</Text>
            <View  style = {styles.iconFlatlist}>  
            </View>
          </View>   
          <View style = {styles.viewContainerFlatlist}>
            <Text style={styles.titleFlatlist}>Vị trí:</Text>  
            <Text style={styles.itemFlatlist}>{item.viTriLapDat}</Text>
            <View  style = {styles.iconFlatlist}>  
            </View>
          </View>    
          <View style = {styles.viewContainerFlatlist}>
            <Text style={styles.titleFlatlist}>Ngày SD:</Text>  
            <Text style={styles.itemFlatlist}>{getVietNamDate(item.ngaySuDung)}</Text>
            <View  style = {styles.iconFlatlist}>  
            </View>
          </View>
      </View>                                                
    </View>              
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    paddingTop: 5,
    alignItems: 'center', 
    justifyContent: 'center',
    backgroundColor: '#dcdcdc',    
  },
  wrapper: {
    borderBottomColor: '#fff',
    borderBottomWidth: 1,
  },
  cardView : {       
    backgroundColor: 'white',
    margin: width * 0.01,
    borderRadius: width * 0.02,
    shadowColor: '#fff',
    shadowOffset: { width:0.5, height: 0.5 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    borderWidth : 0.5,
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
});