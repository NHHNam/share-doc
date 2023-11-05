import { apiURL } from '../utils';

export const getDocumentsByUserId = async (id) => {
    return (await apiURL.get('/api/product/user/' + id)).data;
};

export const getAllDocuments = async () => {
    return (await apiURL.get('/api/product/')).data;
};

export const getAllDocumentsAndBlacklist = async () => {
    return (await apiURL.get('/api/product/blacklist')).data;
};

export const searchDocument = async (word) => {
    return (
        await apiURL.post('/api/product/search', {
            search: word,
            idUser: localStorage.getItem('id')
        })
    ).data;
};

export const updateDocument = async (data) => {
    const { name, description, category, isPrivate, file, id } = data;
    let form = new FormData();
    form.append('Name', name);
    form.append('Description', description);
    form.append('UserId', localStorage.getItem('id'));
    form.append('File', file);
    form.append('CategoryId', category);
    form.append('isPrivate', isPrivate);

    await apiURL.put('/api/product/' + id, form);
};

export const deleteDocument = async (id) => {
    await apiURL.delete('/api/comment/' + id);

    await apiURL.delete('/api/blacklist/product/' + id);

    await apiURL.delete('/api/sharedocument/product/' + id);

    await apiURL.delete('/api/product/' + id);
};

export const uploadDocument = async (data) => {
    const { name, description, file, category, isPrivate } = data;
    let form = new FormData();
    form.append('Name', name);
    form.append('Description', description);
    form.append('UserId', localStorage.getItem('id'));
    form.append('File', file);
    form.append('CategoryId', category);
    form.append('isPrivate', isPrivate);

    await apiURL.post('/api/product', form);
};

export const getDocumentById = async (id) => {
    return (await apiURL.get('/api/product/' + id)).data;
};

export const shareToUser = async (id, idUser) => {
    await apiURL.post('api/sharedocument', {
        idProduct: id,
        idUser: idUser
    });
};

export const getDocumentsSharedByUserid = async (idUser) => {
    return (
        await apiURL.get('api/sharedocument/user/' + idUser, {
            idUser: idUser
        })
    ).data;
};
