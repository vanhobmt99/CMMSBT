import {Linking, Alert, Platform} from 'react-native';

function upperCaseEachWord(str) {
    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
        // You do not need to check if i is larger than splitStr length, as your for does that for you
        // Assign it back to the array
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
    }
    // Directly return the joined string
    return splitStr.join(' '); 
 }

 function getVietNamDate(date){
   if(date != '' && date != null){
    date = date.split('T')[0].trim();
    date = String(date).split('-');
    var day = String(date[2]);
    var month = String(date[1]);
    var year = String(date[0]);
   
    return [day + '-' + month + '-' + year];
   }
   else{
    return '';
   }
  }

  function convertToFullDatetime(pDate) {
    let dd = pDate.split("/")[0].padStart(2, "0");
    let mm = pDate.split("/")[1].padStart(2, "0");
    let yyyy = pDate.split("/")[2].split(" ")[0];
    let hh = pDate.split("/")[2].split(" ")[1].split(":")[0].padStart(2, "0");
    let mi = pDate.split("/")[2].split(" ")[1].split(":")[1].padStart(2, "0");
    let secs = pDate.split("/")[2].split(" ")[1].split(":")[2].padStart(2, "0");
  
    mm = (parseInt(mm) - 1).toString(); // January is 0
  
    return new Date(yyyy, mm, dd, hh, mi, secs);
  }

  function formatNumber (text) {
    if (text && !isNaN(parseFloat(text))) {
      //format the input value to have no commas
      const inputValue = text.split(',').join('');
      //reformat the string with commas in the correct positions
      const amountString = new Intl.NumberFormat().format(parseFloat(inputValue));

      return amountString;
    } else {
      return 0;
    }
  }

  const callNumber = phone => {
    console.log('callNumber ----> ', phone);
    let phoneNumber = phone;
    if (Platform.OS !== 'android') {
      phoneNumber = `telprompt:${phone}`;
    }
    else  {
      phoneNumber = `tel:${phone}`;
    }
    Linking.canOpenURL(phoneNumber)
    .then(supported => {
      if (!supported) {
        Alert.alert('Phone number is not available');
      } else {
        return Linking.openURL(phoneNumber);
      }
    })
    .catch(err => console.log(err));
  };

  function nonAccentVietnamese(str) {
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    // Some system encode vietnamese combining accent as individual utf-8 characters
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng 
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư
    return str;
}

function isValidDate(value)
{
  if(value != '' && value != null){

    var date = String(value).split('/');
    var day = String(date[0]);
    var month = String(date[1]);
    var year = String(date[2]);

    let isValid = Date.parse(month + '/' + day + '/' + year);

    if (isNaN(isValid)) {
      return false;
    }

    return true;
  }
  else
  {
    return false;
  }
}

function getValidString(value, defaultValue = '')
{
  return value ? value : defaultValue;
};

function getValidNumber(value, defaultValue = 0)
{
  return value ? parseInt(value, 10) : defaultValue;
};

export {upperCaseEachWord};
export {getVietNamDate};
export {formatNumber};
export {callNumber};
export {convertToFullDatetime};
export {nonAccentVietnamese};
export {isValidDate};
export {getValidString};
export {getValidNumber};