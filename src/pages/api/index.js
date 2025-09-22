import axios from 'axios';
import { toRaw } from 'vue';
import { useAuthStore } from '../stores/authStore';

const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 5000,
  withCredentials: true,
});

// Axios 인터셉터
//   - 요청(Request) 또는 응답(Response)이 처리되기 전에 가로채서 특정 로직을 수행하도록 하는 기능이다.

// 요청(Request) 인터셉터
//   - HTTP 요청이 서버로 전송되기 전에 실행된다.
apiClient.interceptors.request.use(
  config => {
    if (config._skipInterceptor) {
      return config;
    }

    // authStore에서 accessToken을 가져온다.
    const authStore = useAuthStore();
    const accessToken = authStore.tokenInfo.accessToken;
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }

    return config;
  },
  error => {
    // 비동기 코드에서 에러를 처리하거나 에러를 즉시 반환할 때 사용된다.
    return Promise.reject(error);
  },
);

// 응답(Response) 인터셉터
//   - 서버에서 HTTP 응답이 도착한 후에 실행된다.
apiClient.interceptors.response.use(
  response => response,
  async error => {
    // 이전 요청에 대한 config 객체를 얻어온다.
    const originConfig = error.config;

    // 토큰이 만료되어 401 에러가 발생한 경우
    if (error.response && error.response.status === 401 && !originConfig._retry) {
      originConfig._retry = true;
      const authStore = useAuthStore();
      console.log(
        '[Axios Response] 401 발생, Refresh Token 시도:',
        authStore.tokenInfo.refreshToken,
      );

      try {
        // 리프레시 토큰을 사용하여 새 액세스 토큰을 요청한다.
        await authStore.refreshAccessToken();

        console.log(
          '[Axios Response] 토큰 재발급 완료, 새 Access Token:',
          authStore.tokenInfo.accessToken,
        );
        // 원래 요청을 다시 재시도
        return apiClient(originConfig);
      } catch (refreshError) {
        console.log('[Axios Response] 토큰 재발급 실패, 로그아웃 처리');
        authStore.performLogout();

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
