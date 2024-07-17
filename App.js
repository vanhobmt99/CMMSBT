import React, { useEffect, Dimensions } from 'react';
import { Text, View, ActivityIndicator } from 'react-native';
import { 
  NavigationContainer, 
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme
} from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';

import { 
  Provider as PaperProvider, 
  DefaultTheme as PaperDefaultTheme,
  DarkTheme as PaperDarkTheme, 
  Title
} from 'react-native-paper';

import { DrawerContent } from  './src/screens/DrawerContent';
import MainTabScreen from './src/screens/MainTabScreen';
import SupportScreen from './src/screens/home/SupportScreen';
import ConfigScreen from './src/screens/home/ConfigScreen';
import AddThietBiScreen from './src/screens/thietbi/AddThietBiScreen';
import EditThietBiScreen from './src/screens/thietbi/EditThietBiScreen';
import CauTrucThietBiScreen from './src/screens/cautruc/CauTrucThietBiScreen';
import AddEditCauTrucScreen from './src/screens/cautruc/AddEditCauTrucScreen';
import LapKeHoachThietBiScreen from './src/screens/kehoach/LapKeHoachThietBiScreen';
import AddEditLapKeHoachScreen from './src/screens/kehoach/AddEditLapKeHoachScreen';
import CongViecBaoTriScreen from './src/screens/congviec/CongViecBaoTriScreen';
import AddEditCongViecScreen from './src/screens/congviec/AddEditCongViecScreen';
import BoPhanScreen from './src/screens/congviec/BoPhanScreen';
import { AuthContext } from './src/components/context';
import RootStackScreen from './src/screens/RootStackScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from 'react-native-splash-screen';
import Toast, {BaseToast, ErrorToast} from 'react-native-toast-message';

const Drawer = createDrawerNavigator();

const App = () => {
  // const [isLoading, setIsLoading] = React.useState(true);
  // const [userToken, setUserToken] = React.useState(null); 

  const [isDarkTheme, setIsDarkTheme] = React.useState(false);

  const initialLoginState = {
    isLoading: true,
    userName: null,
    userToken: null,
  };

  const CustomDefaultTheme = {
    ...NavigationDefaultTheme,
    ...PaperDefaultTheme,
    colors: {
      ...NavigationDefaultTheme.colors,
      ...PaperDefaultTheme.colors,
      background: '#ffffff',
      text: '#333333'
    }
  }
  
  const CustomDarkTheme = {
    ...NavigationDarkTheme,
    //...PaperDarkTheme,
    colors: {
      ...NavigationDarkTheme.colors,
      //...PaperDarkTheme.colors,
      background: '#333333',
      text: '#ffffff'
    }
  }

  const navOptionHandler = () => ({
    //headerShown : false,    
    headerStyle: {
     backgroundColor: '#2755ab',
   },
   headerTintColor: '#fff',
   headerTitleStyle: {
     fontWeight: 'bold',
   },  
   headerTitleAlign: 'center',
   title:'App bảo trì BIWASE',
 })

  const toastConfig = {
    success: props => (
      <BaseToast
        {...props}
        style={{
          borderLeftColor: 'green',
          borderLeftWidth: 3,
          width: '90%',
          maxHeight: 100,
          //height: 70,
          borderRightColor: 'green',
          borderRightWidth: 3,
        }}
        contentContainerStyle={{paddingHorizontal: 15}}
        text1Style={{
          fontSize: 15,
          fontWeight: '700',
        }}
        text2Style={{
          fontSize: 12,
        }}
      />
    ),
  
    error: props => (
      <ErrorToast
        {...props}
        text2NumberOfLines={3}
        style={{
          borderLeftColor: 'red',
          borderLeftWidth: 3,
          width: '90%',
          maxHeight: 100,
          //height: 70,
          borderRightColor: 'red',
          borderRightWidth: 3,
        }}
        contentContainerStyle={{paddingHorizontal: 15}}
        text1Style={{
          fontSize: 15,
          fontWeight: '700',
        }}
        text2Style={{
          fontSize: 12,
        }}
      />
    ),
  };

  const theme = isDarkTheme ? CustomDarkTheme : CustomDefaultTheme;

  const loginReducer = (prevState, action) => {
    switch( action.type ) {
      case 'RETRIEVE_TOKEN': 
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false,
        };
      case 'LOGIN': 
        return {
          ...prevState,
          userid: action.id,
          userHoTen: action.hoTen,
          userMaCV: action.maCV,
          userMaDonVi: action.maDonVi,
          userToken: action.token,
          isLoading: false,
        };
      case 'LOGOUT': 
        return {
          ...prevState,
          userid: null,
          userHoTen: null,
          userMaCV: null,
          userMaDonVi: null,
          userToken: null,
          isLoading: false,
        };
      case 'REGISTER': 
        return {
          ...prevState,
          userid: action.id,
          userHoTen: action.hoTen,
          userMaCV: action.maCV,
          userMaDonVi: action.maDonVi,
          userToken: action.token,
          isLoading: false,
        };
    }
  };

  const [loginState, dispatch] = React.useReducer(loginReducer, initialLoginState);

  const authContext = React.useMemo(() => ({
      signIn: async(data) => {
          const { id, hoTen, maCV, maDonVi, token } = data;
          const userData = {
              userid: id.toString(),
              userHoTen: hoTen,
              userMaCV: maCV,
              userMaDonVi: maDonVi.toString(),
              userToken: token
          };
          try {
              await AsyncStorage.multiSet(Object.entries(userData));
              dispatch({ type: 'LOGIN', ...userData });
          } catch(e) {
              console.log(e);
          }
      },
      signOut: async() => {
          try {
              await AsyncStorage.multiRemove(['userid', 'userHoTen', 'userMaCV', 'userMaDonVi', 'userToken']);
              dispatch({ type: 'LOGOUT' });
          } catch(e) {
              console.log(e);
          }
      },
      signUp: () => {
          // Implement signUp logic if needed
      },
      toggleTheme: () => {
          setIsDarkTheme(isDarkTheme => !isDarkTheme);
      }
  }), []);  

  useEffect(() => {
      const fetchData = async () => {
          SplashScreen.hide();
          try {
              const keys = ['userid', 'userHoTen', 'userMaCV', 'userMaDonVi', 'userToken'];
              const [userid, userHoTen, userMaCV, userMaDonVi, userToken] = await AsyncStorage.multiGet(keys);
              
              const userData = {
                  id: userid ? userid[1] : null,
                  hoTen: userHoTen ? userHoTen[1] : null,
                  maCV: userMaCV ? userMaCV[1] : null,
                  maDonVi: userMaDonVi ? userMaDonVi[1] : null,
                  token: userToken ? userToken[1] : null,
              };

              dispatch({ type: 'RETRIEVE_TOKEN', ...userData });
          } catch (error) {
              console.log(error);
          }
      };
      const fetchDataTimeout = setTimeout(fetchData, 1000);
      return () => clearTimeout(fetchDataTimeout);
  }, []); 
  

  if( loginState.isLoading ) {
    return(
      <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
        <ActivityIndicator size="large"/>
        <Text>Đang xử lý...</Text>
      </View>
    );
  }
  return (    
    <PaperProvider theme={theme}>
      <AuthContext.Provider value={authContext}>
        <NavigationContainer theme={theme}>
          { loginState.userToken !== null ? (        
            <Drawer.Navigator drawerContent={props => <DrawerContent {...props} />}>
              <Drawer.Screen name="HomeDrawer" component={MainTabScreen} options = {navOptionHandler} />
              <Drawer.Screen name="SupportScreen" component={SupportScreen} options = {navOptionHandler}/>
              <Drawer.Screen name="ConfigScreen" component={ConfigScreen} options = {navOptionHandler} />
              <Drawer.Screen name="AddThietBiScreen" component={AddThietBiScreen} options = {navOptionHandler} />
              <Drawer.Screen name="EditThietBiScreen" component={EditThietBiScreen} options = {navOptionHandler} />
              <Drawer.Screen name="CauTrucThietBiScreen" component={CauTrucThietBiScreen} options = {navOptionHandler} />
              <Drawer.Screen name="AddEditCauTrucScreen" component={AddEditCauTrucScreen} options = {navOptionHandler} />
              <Drawer.Screen name="LapKeHoachThietBiScreen" component={LapKeHoachThietBiScreen} options = {navOptionHandler} />
              <Drawer.Screen name="AddEditLapKeHoachScreen" component={AddEditLapKeHoachScreen} options = {navOptionHandler} />
              <Drawer.Screen name="CongViecBaoTriScreen" component={CongViecBaoTriScreen} options = {navOptionHandler}/>
              <Drawer.Screen name="AddEditCongViecScreen" component={AddEditCongViecScreen} options = {navOptionHandler}/>
              <Drawer.Screen name="BoPhanScreen" component={BoPhanScreen} options = {navOptionHandler}/>
            </Drawer.Navigator>
          ): (
            <RootStackScreen/>
          )}
          <Toast config={toastConfig} />
        </NavigationContainer>
      </AuthContext.Provider>
    </PaperProvider>
  );
}

export default App;