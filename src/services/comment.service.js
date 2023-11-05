import api from '../axios/aixos';

export const createComment = async (data) => {
    await api.post(`/api/comment`, {
        comment: data.comment,
        userId: data.userId,
        productId: data.productId
    });
};
