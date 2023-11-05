import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';
import baseURL from '../config/config';
// Create an Axios instance

const api = axios.create({
    baseURL: baseURL
});

const shouldRefreshToken = (token) => {
    // Decode the token to extract the expiration time
    const decodedToken = jwtDecode(token);

    // Get the current time
    const currentTime = Math.floor(Date.now() / 1000); // Convert to seconds

    // Check if the token is expired or close to expiration (e.g., within a specified threshold)
    const expirationTime = decodedToken.exp;
    const expirationThreshold = 300; // 5 minutes (adjust according to your needs)

    return expirationTime - currentTime <= expirationThreshold;
};

const refreshAccessToken = async () => {
    try {
        // Make an API call to your server to refresh the token
        const user = await AsyncStorage.getItem('@user');
        const userParse = JSON.parse(user);

        const response = await axios.post(
            `${baseURL}/auth/refreshToken/${userParse.email}`
        );
        // Extract the new token from the response
        const newToken = response.data.token;
        // Update the token in your AsyncStorage
        await AsyncStorage.setItem('accessToken', newToken);
    } catch (error) {
        // Handle any errors that occur during the token refresh
        console.error('Token refresh failed:', error.message);
    }
};

// Add an interceptor to refresh the token before each request
api.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('accessToken');

        // Check if token exists and if it's expired or close to expiration
        if (token && shouldRefreshToken(token)) {
            // Refresh the token
            await refreshAccessToken();
        }

        // Set the Authorization header with the new or existing token
        config.headers.Authorization = `Bearer ${await AsyncStorage.getItem(
            'accessToken'
        )}`;
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
