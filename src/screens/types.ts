import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// Định nghĩa các loại màn hình trong Stack Navigator
export type RootStackParamList = {
  Home: undefined;
  Details: { itemId: number };
  Profile: { userId: string };
  Login: undefined; // Thêm màn hình Login vào Stack
};

// Định nghĩa các kiểu dữ liệu Route và Navigation cho mỗi màn hình
export type RootStackNavigationProp<T extends keyof RootStackParamList> = StackNavigationProp<RootStackParamList, T>;
export type RootStackRouteProp<T extends keyof RootStackParamList> = RouteProp<RootStackParamList, T>;