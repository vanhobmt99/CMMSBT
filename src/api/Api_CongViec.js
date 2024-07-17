const apiGetListDonViTinh = 'api/CMMSBT/CongViec/GetListDonViTinh';
const apiGetListNhanVienTH = 'api/CMMSBT/CongViec/GetListNhanVienTH';
const apiGetListNhanVienKT = 'api/CMMSBT/CongViec/GetListNhanVienKT';
const apiGetListThietBiByDonVi = 'api/CMMSBT/CongViec/GetListThietBiByDonVi';
const apiDeleteByID = 'api/CMMSBT/CongViec/DeleteByID';
const apiGetListCongViecBaoTriByDonVi = 'api/CMMSBT/CongViec/GetListCongViecBaoTriByDonVi';
const apiPostPutCongViecBaoTri = 'api/CMMSBT/CongViec/PostPutCongViecBaoTri';
const apiUpdateTrangThai = 'api/CMMSBT/CongViec/UpdateTrangThai';
const apiUpdateNhanXetDanhGia = 'api/CMMSBT/CongViec/UpdateNhanXetDanhGia';
const apiDeleteCTCVByID = 'api/CMMSBT/CongViec/DeleteCTCVByID';
const apiUpdateNhacViec = 'api/CMMSBT/CongViec/UpdateNhacViec';

// Chi tiết công việc
const apiGetListByMacv = 'api/CMMSBT/CongViec/GetListByMacv';
const apiPostPutCTCV = 'api/CMMSBT/CongViec/PostPutCTCV';
const apiUpdateChuKyBaoDuong = 'api/CMMSBT/CongViec/UpdateChuKyBaoDuong';

async function getListDonViTinh(url) {
  try {
    let response = await fetch(url + apiGetListDonViTinh, {
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

async function getListNhanVienTH(url, _madv) {
  try {
    let response = await fetch(url + apiGetListNhanVienTH, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }, 
      body: JSON.stringify({       
        donViId: _madv,
      }),      
    });
    let responseJson = await response.json(); 
    return responseJson;
  } catch (error) {
    console.log(`Error is : ${error}`);
  }
}

async function getListNhanVienKT(url, _madv) {
  try {
    let response = await fetch(url + apiGetListNhanVienKT, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }, 
      body: JSON.stringify({       
        donViId: _madv,
      }),      
    });
    let responseJson = await response.json(); 
    return responseJson;
  } catch (error) {
    console.log(`Error is : ${error}`);
  }
}

async function getListThietBiByDonVi(url, _madv) {
  try {
    let response = await fetch(url + apiGetListThietBiByDonVi, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }, 
      body: JSON.stringify({       
        donViId: _madv,
      }),      
    });
    let responseJson = await response.json(); 
    return responseJson;
  } catch (error) {
    console.log(`Error is : ${error}`);
  }
}


async function deleteByID(url, _macv) {
  try {
    let response = await fetch(url + apiDeleteByID, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }, 
      body: JSON.stringify({       
        macv: _macv,
      }),      
    });
    let responseJson = await response.json(); 
    return responseJson;
  } catch (error) {
    console.log(`Error is : ${error}`);
  }
}

async function getListCongViecBaoTriByDonVi(url, _searchKey, _trangthai, _loaicv, _manvth, _ngaybd, _ngaykt, _donViId) {
  try {
    
    // Filter out unnecessary elements like 0 from the arrays
    const filteredTrangthai = _trangthai.filter(item => item !== 0);
    const filteredLoaicv = _loaicv.filter(item => item !== 0);
    const filteredManvth = _manvth.filter(item => item !== 0);

    let response = await fetch(url + apiGetListCongViecBaoTriByDonVi, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }, 
      body: JSON.stringify({       
        searchKey: _searchKey,
        trangthai: filteredTrangthai,
        loaicv: filteredLoaicv,
        manvth: filteredManvth, 
        ngaybd: _ngaybd, 
        ngaykt: _ngaykt,
        donViId: _donViId,

      }),      
    });
    let responseJson = await response.json(); 
    return responseJson;
  } catch (error) {
    console.log(`Error is : ${error}`);
  }
}

async function postPutCongViecBaoTri(url, formData) {
  try {
    let response = await fetch(url + apiPostPutCongViecBaoTri, {
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

async function postEditTrangThai(url, formData) {
  try {
    let response = await fetch(url + apiUpdateTrangThai, {
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

async function postEditNhanXetDanhGia(url, formData) {
  try {
    let response = await fetch(url + apiUpdateNhanXetDanhGia, {
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

async function postEditNhacViec(url, formData) {
  try {
    let response = await fetch(url + apiUpdateNhacViec, {
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

async function getListByMacv(url, _macv) {
  try {
    let response = await fetch(url + apiGetListByMacv, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }, 
      body: JSON.stringify({       
        macv: _macv,
      }),      
    });
    let responseJson = await response.json(); 
    return responseJson;
  } catch (error) {
    console.log(`Error is : ${error}`);
  }
}

async function postPutCTCV(url, formData) {
  try {
    let response = await fetch(url + apiPostPutCTCV, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData),
    });
    let responseJson = await response.json(); 
    return responseJson;
  } catch (error) {
    console.log(`Error is : ${error}`);
    throw error; 
  }  
}

async function deleteCTCVByID(url, _id) {
  try {
    let response = await fetch(url + apiDeleteCTCVByID, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }, 
      body: JSON.stringify({       
        id: _id,
      }),      
    });
    let responseJson = await response.json(); 
    return responseJson;
  } catch (error) {
    console.log(`Error is : ${error}`);
  }
}

async function postEditChuKyBaoDuong(url, formData) {
  try {
    let response = await fetch(url + apiUpdateChuKyBaoDuong, {
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


export {  
  getListDonViTinh,
  getListNhanVienTH,
  getListNhanVienKT,
  getListThietBiByDonVi,
  deleteByID,
  getListCongViecBaoTriByDonVi,
  postPutCongViecBaoTri,
  postEditTrangThai,
  postEditNhanXetDanhGia,
  postEditNhacViec,
  getListByMacv,
  postPutCTCV,
  deleteCTCVByID,
  postEditChuKyBaoDuong,  
};
