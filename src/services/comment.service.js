import { apiURL } from '../utils';

export const addComment = async (data) => {
    await apiURL.post('/api/comment', {
        comment: data.name,
        userId: localStorage.getItem('id'),
        productId: data.id
    });
};
