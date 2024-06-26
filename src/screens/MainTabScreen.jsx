import React, {useState} from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeScreen from '../screens/home/HomeScreen';
import ThietBiScreen from '../screens/thietbi/ThietBiScreen';
import SearchThietBiModal from '../screens/thietbi/SearchThietBiModal';
import ThongBaoScreen from '../screens/thongbao/ThongBaoScreen';
import ExploreScreen from './ExploreScreen';
import TaiKhoanScreen from '../screens/account/TaiKhoanScreen';


const HomeStack = createStackNavigator();
const ThietBiStack = createStackNavigator();
const ThongBaoStack = createStackNavigator();
const ExploreStack = createStackNavigator();

const Tab = createMaterialBottomTabNavigator();

const MainTabScreen = () => (
    <Tab.Navigator initialRouteName="Home"  activeColor="#2755ab">
      <Tab.Screen
        name="Home"
        component={HomeStackScreen}
        options={{
          tabBarLabel: 'Trang chủ',
          //tabBarColor: '#009387',
          tabBarIcon: ({ color }) => (
            <Icon 
            name="home-account" 
            color={color}
            size={26}
            />
          ),          
        }}
      />
      <Tab.Screen
        name="ThietBi"
        component={ThietBiStackScreen}
        options={{
          tabBarLabel: 'Thiết bị',
          //tabBarColor: '#1f65ff',
          tabBarIcon: ({ color }) => (
            <Icon name="ballot" color={color} size={26} />
          ),          
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={DetailsStackScreen}
        options={{
          tabBarLabel: 'Thông báo',
          //tabBarColor: '#1f65ff',
          tabBarIcon: ({ color }) => (
            <Icon name="bell-badge-outline" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="TaiKhoan"
        component={TaiKhoanScreen}
        options={{
          tabBarLabel: 'Tài khoản',
          //tabBarColor: '#694fad',
          tabBarIcon: ({ color }) => (
            <Icon name="account" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Explore"
        component={ExploreStackScreen}
        options={{
          tabBarLabel: 'Thêm',
          //tabBarColor: '#d02860',
          tabBarIcon: ({ color }) => (
            <Icon name="dots-horizontal" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
);

export default MainTabScreen;

const HomeStackScreen = ({navigation}) => (
<HomeStack.Navigator screenOptions={{        
        headerStyle: {
          backgroundColor: '#ecf0f3',
          height: 40,
        },
        headerTintColor: '#000',           
        headerTitleStyle: {
        //fontWeight: 'bold'
        marginLeft: -10
        }
    }}>
        <HomeStack.Screen name="HomeTab" component={HomeScreen} options={{
        title:'Dashboard',
        headerLeft: () => (
          <View style={{ marginLeft: 10 }}>
            <Icon name="home-outline" color="#000" size={26} />
          </View>
        )
        }} />
</HomeStack.Navigator>
);

const ThietBiStackScreen = ({navigation}) => {  

  const [modalVisible, setModalVisible] = useState(false); 

  const handleOpenModal = () => {
    setModalVisible(true);
  }; 
  
  const handleSearch = async (keyword, loaitb, trangthai) => {   
    try {       
        navigation.navigate("ThietBiTab", { keyword, loaitb, trangthai });
    } catch (error) {
        console.error("Error storing data:", error);
    }
  };

  const LoadRefreshData = async () => {   
    try {       
        navigation.navigate("ThietBiTab", { keyword: "", loaitb: 0, trangthai: 0 });
    } catch (error) {
        console.error("Error storing data:", error);
    }
  };

  const handlePlusItem = async () => { 
    try {
        await navigation.navigate("AddThietBiScreen", { thietBiId: 0 }); 
    } catch (error) {
        console.error("Error navigating to AddThietBiScreen:", error);
    } 
  };

  return (
    <View style={styles.container}>      
      <ThietBiStack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#ecf0f3',
            height: 40,
          },
          headerTintColor: '#000',
          headerTitleStyle: {
            marginLeft: -10,
          },
        }}
      >
        <ThietBiStack.Screen
          name="ThietBiTab"
          component={ThietBiScreen}
          options={{
            title: 'Thiết bị',
            headerLeft: () => (
              <View style={{ marginLeft: 10 }}>
                <Icon name="chevron-left" color="#000" size={26} onPress={() => navigation.navigate('Home')} />
              </View>
            ),
            headerRight: () => (
              <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
                <TouchableOpacity style={styles.buttonFilter}  onPress={handleOpenModal} title="Tìm kiếm">
                  <Icon name="filter" color="#fff" size={22} />                
                </TouchableOpacity> 
                <TouchableOpacity style={styles.buttonRefesh} onPress={LoadRefreshData} title="Refresh Data">
                  <Icon name="autorenew" color="#fff" size={22} />                
                </TouchableOpacity>                 
                <TouchableOpacity style={styles.buttonPlus}  onPress={handlePlusItem} title="Thêm">
                  <Icon name="plus" color="#fff" size={22} />                
                </TouchableOpacity>                                                                
              </View>              
            ),
          }}
        />   
      </ThietBiStack.Navigator> 
      <SearchThietBiModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSearch={handleSearch} // Pass the onSearch function as a prop
      />   
    </View>
  );
};

//export default ThietBiTabStack;

const DetailsStackScreen = ({ navigation}) => (
<ThongBaoStack.Navigator screenOptions={{
        headerStyle: {
          backgroundColor: '#ecf0f3',
          height: 40,
        },
        headerTintColor: '#000',
        headerTitleStyle: {
          marginLeft: -10
        }
    }}>
        <ThongBaoStack.Screen name="ThongBaoTab" component={ThongBaoScreen} options={{
        title:'Thông báo',
        headerLeft: () => (
          <View style={{ marginLeft: 10 }}>
            <Icon name="chevron-left" color="#000" size={26}
            onPress={ () => { navigation.navigate('Home') } } />    
          </View>          
        )
        }} />
</ThongBaoStack.Navigator>
);

const ExploreStackScreen = ({ navigation}) => (
  <ExploreStack.Navigator screenOptions={{
          headerShown: false,
          headerStyle: {
            backgroundColor: '#ecf0f3',
            height: 40,
          },
          headerTintColor: '#000',
          headerTitleStyle: {         
            marginLeft: -10
          }
      }}>
          <ExploreStack.Screen name="ExploreTab" component={ExploreScreen} options={{
          title:'Cấu hình',
          headerLeft: () => (
            <View style={{ marginLeft: 10 }}>
              <Icon name="chevron-left" color="#000" size={26}
              onPress={ () => { navigation.navigate('Home') } } />
            </View>
          )
          }} />
  </ExploreStack.Navigator>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',          
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
  });
    