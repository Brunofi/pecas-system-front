import Axios, {AxiosInstance} from 'axios';

export const httpClient: AxiosInstance = Axios.create({
    baseURL: 'http://127.0.0.1:8080/'
})