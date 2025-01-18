import axios from 'axios';

const REST_API_BASE_URL = 'http://localhost:8080/api/user';
export const listUser = () =>  axios.get(REST_API_BASE_URL+'/getListAll');
export const getValueUserById = (userId) => axios.get(REST_API_BASE_URL + '/getValueById/' + userId);
export const createUser = (user) => {
    const formData = new FormData();
    formData.append('userName', user.userName);
    formData.append('userDesc', user.userDesc);
    if (user.userImage) {
      formData.append('userImage', user.userImage);
    }
  
    // Send the request with FormData
    return axios.post(REST_API_BASE_URL + '/createUser', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // This is set automatically by the browser, but you can specify it here for clarity
      },
    });
  };

export const updateUser = (userId, formData) => {
  return axios.put(REST_API_BASE_URL + '/updateUser/'+userId, formData, {
    headers: {
      'Content-Type': 'multipart/form-data', // This is set automatically by the browser, but you can specify it here for clarity
    },
  });
};

export const deleteUser = (userId) => axios.delete(REST_API_BASE_URL + '/deleteUser/'+userId);

// export const getuserByKategori = (kategoriId) => axios.get(REST_API_BASE_URL + '/getuserByKategori/'+kategoriId);
