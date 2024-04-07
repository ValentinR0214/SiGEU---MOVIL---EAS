import AxiosCliente from '../http-gateway/http-cleint';

export const getColorsFromServer = async () => {
  try {
    const response = await AxiosCliente({
      url: "/publico/sistema/",
      method: "GET",
    });
    if (response.status === 'OK') {
        console.log(response);
      return response.data;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};
export const getLogoFromServer = async () => {
  try {
    const response = await AxiosCliente({
        url: "/publico/logo/",
        method: "GET",
    });
    if (response.status === 'OK') {
        return response.data;
    }
} catch (error) {
    console.log(error);
    return null;
} 
}