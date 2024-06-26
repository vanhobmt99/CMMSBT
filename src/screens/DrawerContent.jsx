import React, {useState, useEffect} from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import {
    useTheme,
    Avatar,
    Title,
    Caption,
    Paragraph,
    Drawer,
    Text,
    TouchableRipple,
    Switch
} from 'react-native-paper';
import {
    DrawerContentScrollView,
    DrawerItem
} from '@react-navigation/drawer';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import{ AuthContext } from '../components/context';
import { GlobalContext } from '../store/GlobalProvider';
import { getDetailByDonVi, getDetailByCongViec } from  '../api/Api_DungChung';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function DrawerContent(props) {  

    const { signOut } = React.useContext(AuthContext);
    const base_url = React.useContext(GlobalContext).url;

    const [token, setToken] = useState('');
    const [maDV, setMaDV] = useState('');
    const [hoTen, setHoTen] = useState('');
    const [maCV, setMaCV] = useState('');
    const [tendonvi, setTenDV] = useState('');
    const [tencongviec, setTenCV] = useState('');

    useEffect(() => {
        const getData = async () => {
            try {
                const [userToken, userMaDonVi, userHoTen, userMaCV] = await Promise.all([
                    AsyncStorage.getItem('userToken'),
                    AsyncStorage.getItem('userMaDonVi'),
                    AsyncStorage.getItem('userHoTen'),
                    AsyncStorage.getItem('userMaCV')
                ]);
                console.log(userToken);
                setToken(userToken); // Set token in state   
                console.log(userMaDonVi);
                setMaDV(userMaDonVi);
                console.log(userHoTen);
                setHoTen(userHoTen);
                console.log(userMaCV);
                setMaCV(userMaCV);
    
                const [responsedv, responsecv] = await Promise.all([
                    getDetailByDonVi(base_url, parseInt(userMaDonVi)),
                    getDetailByCongViec(base_url, userMaCV.toString())
                ]);
                
                if (responsedv && responsedv.resultCode === true) {
                    console.log(responsedv.data.tendonvi);
                    setTenDV(responsedv.data.tendonvi);
                }
    
                if (responsecv && responsecv.resultCode === true) {
                    console.log(responsecv.data.tencv);
                    setTenCV(responsecv.data.tencv);
                }
    
            } catch (error) {
                console.error(error);
            }
        };
        getData();
    }, [base_url]);       

    

    return(
        <View style={{flex:1}}>
            <DrawerContentScrollView {...props}>
                <View style={styles.drawerContent}>
                    <View style={styles.userInfoSection}>
                        <View style={{flexDirection:'row',marginTop: 15}}>
                            <Avatar.Image 
                                source={require('../assets/logo.png')}
                                size={50}
                            />
                            <View style={{marginLeft:15, flexDirection:'column'}}>
                                <Title style={styles.titleUppercase}>{hoTen}</Title>   
                                <Caption style={styles.caption}>{tendonvi}</Caption>                             
                                <Caption style={styles.caption}>{tencongviec}</Caption>
                            </View>
                        </View>

                        <View style={styles.row}>
                            <View style={styles.section}>
                                <Paragraph style={[styles.paragraph, styles.caption]}>80</Paragraph>
                                <Caption style={styles.caption}>Following</Caption>
                            </View>
                            <View style={styles.section}>
                                <Paragraph style={[styles.paragraph, styles.caption]}>100</Paragraph>
                                <Caption style={styles.caption}>Followers</Caption>
                            </View>
                        </View>
                    </View>

                    <Drawer.Section style={styles.drawerSection}>
                        <DrawerItem 
                            icon={({color, size}) => (
                                <Icon 
                                name="home-outline" 
                                color={color}
                                size={size}
                                />
                            )}
                            label="Trang chủ"
                            onPress={() => {props.navigation.navigate('Home')}}
                        />
                        <DrawerItem 
                            icon={({color, size}) => (
                                <Icon 
                                name="ballot" 
                                color={color}
                                size={size}
                                />
                            )}
                            label="Thiết bị"
                            onPress={() => {props.navigation.navigate('ThietBi')}}
                        />
                        <DrawerItem 
                            icon={({color, size}) => (
                                <Icon 
                                name="wrench" 
                                color={color}
                                size={size}
                                />
                            )}
                            label="Công việc"
                            onPress={() => {props.navigation.navigate('CongViecBaoTriScreen')}}
                        />
                        <DrawerItem 
                            icon={({color, size}) => (
                                <Icon 
                                name="account-outline" 
                                color={color}
                                size={size}
                                />
                            )}
                            label="Tài khoản"
                            onPress={() => {props.navigation.navigate('TaiKhoan')}}
                        />                        
                        <DrawerItem 
                            icon={({color, size}) => (
                                <Icon 
                                name="cog-outline" 
                                color={color}
                                size={size}
                                />
                            )}
                            label="Cấu hình"
                            onPress={() => {props.navigation.navigate('Explore')}}
                        />
                        <DrawerItem 
                            icon={({color, size}) => (
                                <Icon 
                                name="account-check-outline" 
                                color={color}
                                size={size}
                                />
                            )}
                            label="Support"
                            onPress={() => {props.navigation.navigate('SupportScreen')}}
                        />
                        <DrawerItem 
                            icon={({color, size}) => (
                                <Icon 
                                name="trophy-award" 
                                color={color}
                                size={size}
                                />
                            )}
                            label="Phiên bản 1.1.0"
                        />
                    </Drawer.Section>                    
                </View>
            </DrawerContentScrollView>            
            <Drawer.Section style={styles.bottomDrawerSection}>
                <DrawerItem 
                    icon={({color, size}) => (
                        <Icon 
                        name="exit-to-app" 
                        color={color}
                        size={size}
                        />
                    )}
                    label="Thoát"
                    onPress={() => {signOut()}}
                />
            </Drawer.Section>
        </View>
    );
}

const styles = StyleSheet.create({
    drawerContent: {
      flex: 1,
    },
    userInfoSection: {
      paddingLeft: 20,
    },
    titleUppercase: {
        fontSize: 17,
        marginTop: 3,
        fontWeight: 'bold',
        textTransform: 'uppercase',
      },
    title: {
      fontSize: 16,
      marginTop: 3,
      fontWeight: 'bold',
    },
    caption: {
      fontSize: 14,
      lineHeight: 14,
    },
    row: {
      marginTop: 20,
      flexDirection: 'row',
      alignItems: 'center',
    },
    section: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 15,
    },
    paragraph: {
      fontWeight: 'bold',
      marginRight: 3,
    },
    drawerSection: {
      marginTop: 15,
    },
    bottomDrawerSection: {
        marginBottom: 15,
        borderTopColor: '#f4f4f4',
        borderTopWidth: 1
    },
    preference: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
  });