    import axios from 'axios';

    const loginApp = async (email, password) => {
    try {
        const response = await axios.post('http://localhost:5021/api/Auth/login', {
        email,
        password
        });

        console.log('Giriş başarılı:', response.data);

        // Eğer token dönüyorsa localStorage'a kaydedebilirsin:
        // localStorage.setItem('token', response.data.token);

        return response.data;
    } catch (error) {
        console.error('Giriş başarısız:', error.response?.data || error.message);
        throw error;
    }
    };


    const registerApp = async (firstName, lastName, userName, email, city, town, birthday, password) => {
      try {
        const response = await axios.post('http://localhost:5021/api/Auth/register', {
          firstName,
          lastName,
          userName,
          email,
          city,
          town,
          birthday,
          password
        });

        console.log('Kayıt başarılı:', response.data);

        // Kayıt başarılıysa başka işlemler yapabilirsin (örneğin, login, yönlendirme vb.)
        return response.data;
      } catch (error) {
        console.error('Kayıt başarısız:', error.response?.data || error.message);
        throw error;
      }
    };
    export const forgot_password = async (email) => {
      const response = await axios.post("http://localhost:5021/api/Auth/forgot-password", { email });
      return response.data;
    };

    export const reset_password = (data) => {
      return axios.post("http://localhost:5021/api/Auth/reset-password", data);
    };

export {loginApp, registerApp}