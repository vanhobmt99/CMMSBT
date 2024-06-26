const apiDeleteCauTrucThietBiByID = 'api/CMMSBT/CauTruc/DeleteByID';
const apiGetListCauTrucThietBiByDonVi = 'api/CMMSBT/CauTruc/GetListCauTrucThietBiByDonVi';
const apiPostPutCauTrucThietBi = 'api/CMMSBT/CauTruc/PostPutCauTrucThietBi';

async function deleteByCauTrucThietBiID(url, _CauTrucThietBiId) {
  try {
    let response = await fetch(url + apiDeleteCauTrucThietBiByID, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }, 
      body: JSON.stringify({
        CauTrucThietBiId: _CauTrucThietBiId
      }),      
    });
    let responseJson = await response.json(); 
    return responseJson;
  } catch (error) {
    console.log(`Error is : ${error}`);
  }  
}

async function getListCauTrucThietBiByDonVi(url, _keyword, _thietBiId, _madv) {
  try {
    let response = await fetch(url + apiGetListCauTrucThietBiByDonVi, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }, 
      body: JSON.stringify({
        searchKey: _keyword,       
        thietBiId: _thietBiId,
        donViId: _madv,
      }),      
    });
    let responseJson = await response.json(); 
    return responseJson;
  } catch (error) {
    console.log(`Error is : ${error}`);
  }
}

async function postPutCauTrucThietBi(url, formData) {
  try {
    let response = await fetch(url + apiPostPutCauTrucThietBi, {
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
  deleteByCauTrucThietBiID,
  getListCauTrucThietBiByDonVi,
  postPutCauTrucThietBi
};
