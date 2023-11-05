import { apiURL } from '../utils';

export const getUserById = async (id) => {
    return (await apiURL.get('/api/user/' + id)).data;
};

export const searchUser = async (value) => {
    return (await apiURL.get('api/user/search?value=' + value)).data;
};

export const getAllUser = async () => {
    return (await apiURL.get('/api/user')).data;
};

export const updateUser = async (data) => {
    return await apiURL.put('/api/user/' + data.id, {
        fullName: data.name
    });
};

export const handleDeleteUser = async (id) => {
    const products = (await apiURL.get('/api/product/user/' + id)).data;
    const comments = (await apiURL('/api/comment/user/' + id)).data;

    if (comments && comments.length > 0) {
        comments.forEach(async (element) => {
            await apiURL.delete('/api/comment/user/' + element.userId);
        });
    }

    if (products && products.length > 0) {
        products.forEach(async (element) => {
            await apiURL.delete('/api/product/' + element.id);
        });
    }
    setTimeout(async () => {
        await apiURL.delete('/api/user/' + id);
    }, 1000);
};

export const changeRole = async (idUser, role) => {
    await apiURL.put(`/api/user/role/${idUser}`, {
        role: role
    });
};
