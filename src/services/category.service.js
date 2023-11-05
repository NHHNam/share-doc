import api from '../axios/aixos';

export const getAllCategory = async () => {
    return (await api.get('/api/category')).data;
};
