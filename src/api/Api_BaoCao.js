const apiTrangThaiCongViec = 'api/CMMSBT/BaoCao/TrangThaiCongViec';
const apiLoaiKeHoach = 'api/CMMSBT/BaoCao/LoaiKeHoach';
const apiLoaiCongViec = 'api/CMMSBT/BaoCao/LoaiCongViec';
const apiKeHoachBaoTriYearOfMonth = 'api/CMMSBT/BaoCao/KeHoachBaoTriYearOfMonth';
const apiThietBiByNhom = 'api/CMMSBT/BaoCao/ThietBiByNhom';

async function getTrangThaiCongViec(url, _tungay, _denngay, _donViId) {
  try {
    let response = await fetch(url + apiTrangThaiCongViec, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },  
      body: JSON.stringify({          
        tungay: _tungay, 
        denngay: _denngay,
        donViId: _donViId,
      }),             
    });
    let responseJson = await response.json(); 
    return responseJson;
  } catch (error) {
    console.log(`Error is : ${error}`);
  }  
}

async function getLoaiKeHoach(url, _tungay, _denngay, _donViId) {
  try {
    let response = await fetch(url + apiLoaiKeHoach, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }, 
      body: JSON.stringify({          
        tungay: _tungay, 
        denngay: _denngay,
        donViId: _donViId,
      }),       
    });
    let responseJson = await response.json(); 
    return responseJson;
  } catch (error) {
    console.log(`Error is : ${error}`);
  }
}

async function getLoaiCongViec(url, _tungay, _denngay, _donViId) {
  try {
    let response = await fetch(url + apiLoaiCongViec, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }, 
      body: JSON.stringify({          
        tungay: _tungay, 
        denngay: _denngay,
        donViId: _donViId,
      }),       
    });
    let responseJson = await response.json(); 
    return responseJson;
  } catch (error) {
    console.log(`Error is : ${error}`);
  }
}

async function getKeHoachBaoTriYearOfMonth(url, _nam, _donViId) {
  try {
    let response = await fetch(url + apiKeHoachBaoTriYearOfMonth, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }, 
      body: JSON.stringify({ 
        nam: _nam,      
        donViId: _donViId,
      }),      
    });
    let responseJson = await response.json(); 
    return responseJson;
  } catch (error) {
    console.log(`Error is : ${error}`);
  }
}


async function getListThietBiByNhom(url, _tungay, _denngay, _donViId) {
  try {
    let response = await fetch(url + apiThietBiByNhom, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }, 
      body: JSON.stringify({          
        tungay: _tungay, 
        denngay: _denngay,
        donViId: _donViId,
      }), 
    });
    let responseJson = await response.json(); 
    return responseJson;
  } catch (error) {
    console.log(`Error is : ${error}`);
  }
}

export {  
  getTrangThaiCongViec,
  getLoaiKeHoach,
  getLoaiCongViec,
  getKeHoachBaoTriYearOfMonth,
  getListThietBiByNhom
};
