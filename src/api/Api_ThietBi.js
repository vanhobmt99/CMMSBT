const apiGetListNhomThietBi = 'api/CMMSBT/ThietBi/GetListNhomThietBi';
const apiGetListNhomThietBiVlue = 'api/CMMSBT/ThietBi/GetListNhomThietBiValue';
const apiGetListXuatXu = 'api/CMMSBT/ThietBi/GetListXuatXuValue';
const apiGetListNhaCungCap = 'api/CMMSBT/ThietBi/GetListNhaCungCapValue';
const apiGetListHangSanXuat = 'api/CMMSBT/ThietBi/GetListHangSanXuatValue';
const apiGetListKhuVuc = 'api/CMMSBT/ThietBi/GetListKhuVuc';
const apiGetListParentID = 'api/CMMSBT/ThietBi/GetListParentID';
const apiGetListThietBi = 'api/CMMSBT/ThietBi/GetListThietBiByDonVi';
const apiGetListThietBiByID = 'api/CMMSBT/ThietBi/GetListThietBiByID';
const apiDeleteByThietBiID = 'api/CMMSBT/ThietBi/DeleteByThietBiID';
const apiPostPutThietBi= 'api/CMMSBT/ThietBi/PostPutThietBi';
const apiGetImageByThietBiID= 'api/CMMSBT/ThietBi/GetImageByThietBiID';

async function getListNhomThietBi(url) {
  try {
    let response = await fetch(url + apiGetListNhomThietBi, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },     
    });
    let responseJson = await response.json(); 
    return responseJson;
  } catch (error) {
    console.log(`Error is : ${error}`);
  }
}

async function getListNhomThietBiValue(url) {
  try {
    let response = await fetch(url + apiGetListNhomThietBiVlue, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },     
    });
    let responseJson = await response.json(); 
    return responseJson;
  } catch (error) {
    console.log(`Error is : ${error}`);
  }
}

async function getListXuatXuValue(url) {
  try {
    let response = await fetch(url + apiGetListXuatXu, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },     
    });
    let responseJson = await response.json(); 
    return responseJson;
  } catch (error) {
    console.log(`Error is : ${error}`);
  }
}

async function getListNhaCungCapValue(url) {
  try {
    let response = await fetch(url + apiGetListNhaCungCap, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },     
    });
    let responseJson = await response.json(); 
    return responseJson;
  } catch (error) {
    console.log(`Error is : ${error}`);
  }
}

async function getListHangSanXuatValue(url) {
  try {
    let response = await fetch(url + apiGetListHangSanXuat, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },     
    });
    let responseJson = await response.json(); 
    return responseJson;
  } catch (error) {
    console.log(`Error is : ${error}`);
  }
}

async function getListKhuVuc(url, _donviId) {
  try {
    let response = await fetch(url + apiGetListKhuVuc, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }, 
      body: JSON.stringify({
        donViId: _donviId
      }),      
    });
    let responseJson = await response.json(); 
    return responseJson;
  } catch (error) {
    console.log(`Error is : ${error}`);
  }
}

async function getListParentID(url, _donviId, _ParentId) {
  try {
    let response = await fetch(url + apiGetListParentID, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }, 
      body: JSON.stringify({
        donViId: _donviId,
        parentId: _ParentId
      }),      
    });
    let responseJson = await response.json(); 
    return responseJson;
  } catch (error) {
    console.log(`Error is : ${error}`);
  }
}

async function getListTBByDonVi(url, madv, tukhoa, loai, trangthai) {
  try {
    let response = await fetch(url + apiGetListThietBi, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }, 
      body: JSON.stringify({
        donViId: madv,
        searchKey: tukhoa,
        nhomTB: loai,
        statusTB: trangthai,
      }),      
    });
    let responseJson = await response.json(); 
    return responseJson;
  } catch (error) {
    console.log(`Error is : ${error}`);
  }
}

async function getListThietBiByID(url, _thietBiId) {
  try {
    let response = await fetch(url + apiGetListThietBiByID, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }, 
      body: JSON.stringify({
        thietBiId: _thietBiId
      }),      
    });
    let responseJson = await response.json(); 
    return responseJson;
  } catch (error) {
    console.log(`Error is : ${error}`);
  }  
}

async function deleteByThietBiID(url, _thietBiId) {
  try {
    let response = await fetch(url + apiDeleteByThietBiID, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }, 
      body: JSON.stringify({
        thietBiId: _thietBiId
      }),      
    });
    let responseJson = await response.json(); 
    return responseJson;
  } catch (error) {
    console.log(`Error is : ${error}`);
  }  
}

async function postPutThietBi(url, formData) {
  try {
    let response = await fetch(url + apiPostPutThietBi, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data'
      },
      body: formData,
    });
    let responseJson = await response.json(); 
    return responseJson;
  } catch (error) {
    console.log(`Error is : ${error}`);
    throw error; 
  }  
}

async function getImageByThietBiID(url, _thietBiId) {
  try {
    let response = await fetch(url + apiGetImageByThietBiID, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }, 
      body: JSON.stringify({
        thietBiId: _thietBiId
      }),      
    });
    let responseJson = await response.json(); 
    return responseJson;    
  } catch (error) {
    console.log(`Error is : ${error}`);
    throw error; 
  }  
}


export { 
  getListNhomThietBi,
  getListNhomThietBiValue,
  getListXuatXuValue, 
  getListNhaCungCapValue,  
  getListHangSanXuatValue,   
  getListKhuVuc, 
  getListParentID,
  getListTBByDonVi,
  getListThietBiByID,
  deleteByThietBiID,
  postPutThietBi,
  getImageByThietBiID
};
