import { apiURL } from '../utils';

export const getListDocumentsPublicByCategtory = async () => {
    return (await apiURL.get('/api/category/nonPrivate')).data;
};

export const getAllCategory = async () => {
    return (await apiURL.get('/api/category')).data;
};

export const updateCategory = async (data) => {
    await apiURL.put('/api/category/' + data.id, {
        name: data.name
    });
};

export const deleteCategory = async (id) => {
    const res = await apiURL.get('/api/product/category/' + id);
    const data = res.data;

    if (data && data.length > 0) {
        data.forEach(async (element) => {
            await apiURL.delete('/api/comment/' + element.id);

            await apiURL.delete('/api/product/' + element.id);
        });
    }
    setTimeout(async () => {
        await apiURL.delete('/api/category/' + id);
    }, 1000);
};

export const getDocumentByCategoryId = async (id) => {
    return (await apiURL.get('/api/product/category/' + id)).data;
};

export const addCategory = async (name) => {
    return await apiURL.post('/api/category', {
        name
    });
};
