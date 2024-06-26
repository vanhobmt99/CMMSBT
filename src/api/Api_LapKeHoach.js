const apiDeleteLapKeHoachByID = 'api/CMMSBT/KeHoach/DeleteByID';
const apiGetListLapKeHoachByDonVi = 'api/CMMSBT/KeHoach/GetListLapKeHoachByDonVi';
const apiPostPutLapKeHoach = 'api/CMMSBT/KeHoach/PostPutLapKeHoach';

async function deleteByLapKeHoachID(url, _makh) {
  try {
    let response = await fetch(url + apiDeleteLapKeHoachByID, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }, 
      body: JSON.stringify({
        makh: _makh
      }),      
    });
    let responseJson = await response.json(); 
    return responseJson;
  } catch (error) {
    console.log(`Error is : ${error}`);
  }  
}

async function getListLapKeHoachByDonVi(url, _matb, _keyword, _nambt, _madv) {
  try {
    let response = await fetch(url + apiGetListLapKeHoachByDonVi, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }, 
      body: JSON.stringify({
        matb: _matb,         
        searchKey: _keyword,        
        nambt: _nambt,
        donViId: _madv,
      }),      
    });
    let responseJson = await response.json(); 
    return responseJson;
  } catch (error) {
    console.log(`Error is : ${error}`);
  }
}

async function postPutLapKeHoach(url, formData) {
  try {
    let response = await fetch(url + apiPostPutLapKeHoach, {
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
  deleteByLapKeHoachID,
  getListLapKeHoachByDonVi,
  postPutLapKeHoach
};
