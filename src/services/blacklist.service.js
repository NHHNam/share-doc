import { apiURL } from '../utils';

export const getBlacklistByDocumentId = async (id) => {
    return (await apiURL.get('/api/blacklist/' + id)).data?.metadata;
};

export const getAllBlacklist = async () => {
    return (await apiURL.get('/api/blacklist')).data?.metadata;
};

export const addBlacklist = async (id) => {
    let date = new Date(Date.now());
    await apiURL.post('/api/blacklist', {
        idProduct: id,
        createdAt: date,
        updatedAt: date
    });
};

export const deleteFromBlacklist = async (id) => {
    await apiURL.delete('/api/blacklist/' + id);
};
