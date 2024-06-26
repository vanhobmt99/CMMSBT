const apiLogin = 'api/CMMSBT/Auth/Login';
const apiGetListCongViec = 'api/CMMSBT/User/GetProfileByCongViec';
const apiGetListDonVi = 'api/CMMSBT/User/GetProfileByDonVi';

async function loginPermision(url, user, pwd) {
    try {
      let response = await fetch(url + apiLogin, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: user,
          password: pwd
        }),
      });
      let responseJson = await response.json();  
      return responseJson;
    } catch (error) {
      console.log(`Error is : ${error}`);
    }
}

async function getDetailByCongViec(url, _macv) {
  try {
    let response = await fetch(url + apiGetListCongViec, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }, 
      body: JSON.stringify({
        macv: _macv,
        macv_Old: "",
      }),     
    });
    let responseJson = await response.json();    
    return responseJson;
  } catch (error) {
    console.log(`Error is : ${error}`);
  }
}

async function getDetailByDonVi(url, madv) {
  try {
    let response = await fetch(url + apiGetListDonVi, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }, 
      body: JSON.stringify({
        donViId: madv
      }),      
    });
    let responseJson = await response.json(); 
    return responseJson;
  } catch (error) {
    console.log(`Error is : ${error}`);
  }
}

export {loginPermision, getDetailByCongViec,  getDetailByDonVi};
