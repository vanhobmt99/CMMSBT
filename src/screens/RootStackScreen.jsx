import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import SplashScreen from './splash/SplashScreen';
import SignInScreen from './account/SignInScreen';
import SignUpScreen from './account/SignUpScreen';

const RootStack = createStackNavigator();

const RootStackScreen = ({navigation}) => (
    <RootStack.Navigator screenOptions={{headerShown: false}}>
        <RootStack.Screen name="SplashScreen" component={SplashScreen}/>
        <RootStack.Screen name="SignInScreen" component={SignInScreen} />
        <RootStack.Screen name="SignUpScreen" component={SignUpScreen}/>
    </RootStack.Navigator>
);

export default RootStackScreen;