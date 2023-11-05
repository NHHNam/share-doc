import api from '../axios/aixos';

export const getDocumentsByUserId = async (id) => {
    return (await api.get('/api/product/user/' + id)).data;
};

export const createDocument = async (data) => {
    await api.post('/api/product/mobile', {
        name: data.name,
        description: data.description,
        userId: data.userId,
        base64String: data.base64String,
        nameFile: data.nameFile,
        categoryId: data.categoryId,
        isPrivate: data.isPrivate
    });
};

export const handleDeleteDocument = async (id) => {
    await api.delete('/api/comment/' + id);

    await api.delete('/api/product/' + id);
};

export const handleUpdateDocument = async (id, data) => {
    await api.put(`/api/product/mobile/${id}`, {
        name: data.name,
        description: data.description,
        userId: data.userId,
        base64String: data.base64String,
        nameFile: data.nameFile,
        categoryId: data.categoryId,
        isPrivate: data.isPrivate
    });
};

export const getDocumentsSharedByUserid = async (idUser) => {
    return (
        await api.get('api/sharedocument/user/' + idUser, {
            idUser: idUser
        })
    ).data;
};
