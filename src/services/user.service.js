import api from '../axios/aixos';

export const getUserById = async (id) => {
    try {
        const data = await api.get(`/api/user/${id}`);
        const dataResult = data.data;
        return dataResult;
    } catch (error) {
        console.log(error.message);
    }
};
