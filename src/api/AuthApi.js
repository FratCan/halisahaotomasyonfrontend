import axios from 'axios';

const loginApp = async (email, password) => {
  try {
    const response = await axios.post("https://halisaha.up.railway.app/api/Auth/login", {
      email,
      password
    });

    console.log('Giriş başarılı:', response.data);

    localStorage.setItem('token', response.data.token);

    let userId, userRole;

    if (response.data.token) {
      const token = response.data.token;
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const payload = JSON.parse(jsonPayload);

      console.log("Decoded payload:", payload);

      // 🎯 Role alanını claim URI ile al
      if (payload && payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]) {
        userRole = payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
        localStorage.setItem('userRole', userRole);
      }

      if (payload && payload.id) {
        userId = parseInt(payload.id, 10);
        localStorage.setItem('userId', userId);
      }
    }

    // 🎯 Rolü ve userId'yi de döndür!
    return { ...response.data, userRole, userId };
  } catch (error) {
    console.error('Giriş başarısız:', error.response?.data || error.message);
    throw error;
  }
};

const registerApp = async (firstName, lastName, userName, email, role, city, town, birthday, password) => {
      try {
        role = "Owner";
        //lokaldeki = 'http://localhost:5021/api/Auth/register'
        const response = await axios.post("https://halisaha.up.railway.app/api/Auth/register-owner", {
          firstName,
          lastName,
          userName,
          email,
          role,
          city,
          town,
          birthday,
          password
        });

        console.log('Kayıt başarılı:', response.data);

        // OwnerId'yi localStorage'a kaydet
        if (response.data && response.data.id) {
          localStorage.setItem("userId", response.data.id);
        }

        return response.data;
      } catch (error) {
        console.error('Kayıt başarısız:', error.response?.data || error.message);
        throw error;
      }
};
export const forgot_password = async (email) => {
      //lokaldeki="http://localhost:5021/api/Auth/forgot-password"
      const response = await axios.post("https://halisaha.up.railway.app/api/Auth/forgot-password", { email });
      return response.data;
};

export const reset_password = (data) => {
      //lokaldeki="http://localhost:5021/api/Auth/reset-password"
      return axios.post("https://halisaha.up.railway.app/api/Auth/reset-password", data);
};
export const update_password = (data) => {
      const token = localStorage.getItem("token");
      return axios.post(
        "https://halisaha.up.railway.app/api/Auth/update-password",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
};
export const updateOwner = async (payload) => {
  const token = localStorage.getItem("token");       // <-- JWT burada
  if (!token) throw new Error("Oturum bulunamadı");

  try {
    const { data } = await axios.put(
      "https://halisaha.up.railway.app/api/Auth/owner",
      payload,                                        // dışarıdan gelen veriyi kullan
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;                                     // caller setUserData(data) diyebilsin
  } catch (err) {
    const msg =
      typeof err.response?.data === "object"
        ? err.response.data.Message || "Güncelleme hatası"
        : err.response?.data || err.message;
    throw new Error(msg);
  }
};
export const getUserInfo = async (id) => {
  const token = localStorage.getItem("token");   // gerekiyorsa
  const { data } = await axios.get(
    `https://halisaha.up.railway.app/user/info/${id}`,
    {
      headers: {
        Accept: "*/*",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    }
  );
  return data;   // { firstName, lastName, userName, ... }
};
export {loginApp, registerApp}