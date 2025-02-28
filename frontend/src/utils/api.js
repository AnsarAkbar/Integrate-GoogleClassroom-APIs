import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const useApi = () => {
    const navigate = useNavigate();

    const apiRequest = async (url, method = 'GET', data = null) => {
        const token = new URLSearchParams(window.location.search).get('access_token');
        if (token) {
            localStorage.setItem('accessToken', token);
            window.history.replaceState({}, document.title, window.location.pathname);
        }

        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            navigate('/login');
            return;
        }

        try {
            const response = await axios({
                url,
                method,
                data,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            return response;
        } catch (error) {
            if (error.response && error.response.status === 401) {
                localStorage.removeItem('accessToken');
                navigate('/login');
            } else {
                throw error;
            }
        }
    };

    return { apiRequest };
};

export default useApi;