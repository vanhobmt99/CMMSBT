import React, { useContext, useEffect, useState, useCallback } from 'react';
import { 
  View, 
  Text,   
  Alert, 
  TouchableOpacity,   
  FlatList,
  StyleSheet, 
  Dimensions, 
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Menu, Divider, Provider as PaperProvider } from 'react-native-paper';
import { Loading } from '../../common/Loading';
import { GlobalContext } from '../../store/GlobalProvider';
import { useRoute, useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const SupportScreen = () => {

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

  return (
    <View style={styles.container}>  

      <View style={styles.rowHeader}>
        <Icon name="chevron-left" color="#000" size={26} onPress={handleBack} />                     
        <Text style={styles.titleHeader}>Support</Text>       

      </View>

      <PaperProvider>
        {isLoading ? (
          <Loading />
        ) : (                  
          
            <View style={styles.cardView}>
              <View style={styles.cardViewDataNullContainer}>
                <View style={styles.viewContainerFlatlist}>
                  <View style={styles.noDataView}>
                    <Text style={styles.noDataText}>Chức năng đang trong quá trình nâng cấp. Vui lòng truy cập lại sau!!</Text>
                  </View>
                </View>
              </View>
            </View>
                             
        )}
      </PaperProvider>       
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
    padding: 5,
  },
  titleHeader: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonFilter: {
    padding: 5,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  buttonRefesh: {
    padding: 5,
    backgroundColor: '#28a745',
    borderRadius: 5,
  },
  buttonPlus: {
    padding: 5,
    backgroundColor: '#ffc107',
    borderRadius: 5,
  },
  itemContainer: {    
    backgroundColor: 'white',
    padding: 15,
    width: width * 0.96, 
    height: 'auto',       
    marginTop: 10, 
    marginLeft: 'auto', 
    marginRight: 'auto',
    borderRadius: width * 0.02,   
  },
  divFlexTen: {
     flex: 10,
  },
  divFlexOne: {
      flexDirection: 'row',       
      flex: 1,
  },  
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',      
  },
  itemHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemInfoRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
  itemColumn: {
    flex: 1,
  },
  itemLabel: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  itemValue: {
    fontSize: 14,
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
  cardViewContainer: {
      width: width * 0.96, 
      height: 'auto', 
      marginLeft: 'auto', 
      marginRight: 'auto'
  },
  cardViewDataNullContainer: {
      width: width * 0.96, 
      height: height / 10, 
      marginLeft: 'auto', 
      marginRight: 'auto'
  },
  viewContainerFlatlist : {
    flexDirection : 'row',
    marginBottom : 5,
    flex : 1
  },
  noDataView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
      fontSize: 16,
      color: '#000',
      paddingLeft: 10,
      paddingRight: 10,
  },
  menuMargin: {
    marginTop: -75,

  },
  divTouchableOpacity: {
      flexDirection: 'row', 
      alignItems: 'center', 
      marginLeft: 'auto', 
      marginRight: 10,
  },    
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  anchor: {    
    justifyContent: 'center',
    alignItems: 'center',   
  },
  menuItem: {
    fontSize: 13,
  },
});

export default SupportScreen;