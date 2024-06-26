import React, { useContext, useState, useEffect, useCallback } from 'react';
import { FlatList, Button, Text, View, StyleSheet, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Loading} from '../../common/Loading';

const ThongBaoScreen = ({navigation}) => {

  const [data, setData] = useState([]);   
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { 
    setTimeout(() => {
      fetchData();
      setIsLoading(false); // Update loading state when data fetching is complete
    }, 3000); // Simulate a 3-second delay       
  }, []);

  // Dữ liệu mẫu cho danh sách thông báo
  const listdata = [
    { id: 1, message: 'Đơn hàng bị trể hẹn', dateupdate: '20/05/2024' },
    { id: 2, message: 'Chưa cập nhật trạng thái', dateupdate: '10/03/2024' },
    { id: 3, message: 'Làm lộn dữ liệu', dateupdate: '15/01/2024' },
    { id: 4, message: 'Đơn hàng bị trể hẹn 2', dateupdate: '20/05/2024' },
    { id: 5, message: 'Chưa cập nhật trạng thái 2', dateupdate: '10/03/2024' },
    { id: 6, message: 'Làm lộn dữ liệu 2', dateupdate: '15/01/2024' },
    { id: 7, message: 'Đơn hàng bị trể hẹn', dateupdate: '20/05/2024' },
    { id: 8, message: 'Chưa cập nhật trạng thái', dateupdate: '10/03/2024' },
    { id: 9, message: 'Làm lộn dữ liệu', dateupdate: '15/01/2024' },
    { id: 10, message: 'Đơn hàng bị trể hẹn 2', dateupdate: '20/05/2024' },
    // Thêm các thông báo khác tùy ý
  ];

  const fetchData = async () => {
    try
    {                 
      setData(listdata);                         
    } catch (error) {
      console.error(error);
    }
  };  

  // Hàm render một mục trong danh sách thông báo
  const renderItem = ({ item }) => (
    <View style={styles.notificationItem}>
      <View style = {styles.viewContainerFlatlist}>
        <View style={styles.iconFlatlist}>
        <Icon.Button
          name="bell-outline"
          size={16}
          iconStyle={{ marginTop: 1, marginLeft: 1, marginRight: 1, marginBottom: 1 }} // Adjusts the margin between icon and button boundary
          style={{ padding: 1, margin: 4, width: 20 }} // Sets padding and margin for the button
        />         
        </View>  
        <View style={styles.itemFlatlist}>
          <Text style={{fontWeight: 'bold', fontSize: 16}}>{item.message}</Text>          
          <Text style={{ fontSize: 12 }}>{item.dateupdate}</Text>
        </View>  
      </View>   
    </View>
  );

    return (
      <View style={styles.container}>
        <StatusBar backgroundColor='#2755ab' barStyle="light-content"/>
        {isLoading ? (
          <Loading />
          ) : (
            <FlatList
              data={data}
              renderItem={renderItem}
              keyExtractor={item => item.id.toString()}
              refreshing={false} 
              onRefresh={fetchData} 
            />
        )}
    </View>
    );
};

export default ThongBaoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 7,
    backgroundColor: '#dcdcdc',   
  },
  notificationItem: {
    padding: 10,
    fontSize: 18,  
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#fff',
    marginBottom: 7,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 10
  },
  viewContainerFlatlist : {
    flexDirection : 'row',
    marginBottom : 5,
    flex : 1
  }, 
  iconFlatlist : {
    margin : 6,
    alignItems : 'flex-end',
    justifyContent : 'flex-start',
    marginRight : 10,    
  },
  itemFlatlist : {
    margin : 3,
    flex : 4
  },
});