import axios from 'axios';

const axiosInstance = axios.create({
    // baseURL: 'https://timepiece-server.inuappcenter.kr',
    baseURL: 'http://localhost:5173',
    timeout: 5000,
});

// 요청 인터셉터
axiosInstance.interceptors.request.use(
    function (config) {
        // 요청이 전달되기 전에 작업 수행
        return config;
    },
    function (error) {
        // 요청 오류가 있는 작업 수행
        return Promise.reject(error);
    }
);

// 응답 인터셉터
axiosInstance.interceptors.response.use(
    function (response) {
        // 2xx 범위에 있는 상태 코드는 이 함수를 트리거 합니다.
        // 응답 데이터가 있는 작업 수행
        const responseData = response.data;
        console.log('reponseData : ', responseData);
        return responseData;
    },
    function (error) {
        // 2xx 외의 범위에 있는 상태 코드는 이 함수를 트리거 합니다.
        // 응답 오류가 있는 작업 수행
        return Promise.reject(error);
    }
);

export default axiosInstance;
