import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { baseURL } from '../../config/config';
// Create an Axios instance

const apiURL = axios.create({
    baseURL: baseURL
    // withCredentials: true
});

const shouldRefreshToken = (token) => {
    // Decode the token to extract the expiration time
    const decodedToken = jwtDecode(token);

    // Get the current time
    const currentTime = Math.floor(Date.now() / 1000); // Convert to seconds

    // Check if the token is expired or close to expiration (e.g., within a specified threshold)
    const expirationTime = decodedToken.exp;
    const expirationThreshold = 60; // 5 minutes (adjust according to your needs)

    return expirationTime - currentTime <= expirationThreshold;
};

const refreshAccessToken = async () => {
    try {
        const user = localStorage.getItem('@user');
        const response = await axios.post(
            `${baseURL}/auth/refreshToken/${user}`
        );
        const newToken = response.data.token;
        localStorage.setItem('accessToken', newToken);
    } catch (error) {
        console.log('Token refresh failed:', error.message);
    }
};

apiURL.interceptors.request.use(
    async (config) => {
        const token = localStorage.getItem('accessToken');

        // Check if token exists and if it's expired or close to expiration
        if (token && shouldRefreshToken(token)) {
            // Refresh the token
            await refreshAccessToken();
        }

        // Set the Authorization header with the new or existing token
        config.headers.Authorization = `Bearer ${localStorage.getItem(
            'accessToken'
        )}`;
        return config;
    },
    (error) => Promise.reject(error)
);

export default apiURL;
