import { apiURL, getMessasge } from '../utils';

export const loginService = async (
    data,
    dispatch,
    actions,
    state,
    navigate
) => {
    try {
        const loginRequest = await apiURL.get(
            `/auth/login?email=${data.email}&fullName=${data.displayName}`
        );

        const { code, user, token } = loginRequest.data;
        localStorage.setItem('@user', data.email);
        localStorage.setItem('@picture', data.photo);
        localStorage.setItem('@permission', user.roles);
        localStorage.setItem('accessToken', token);
        localStorage.setItem('id', user.id);
        localStorage.setItem('@name', `${user.fullName}`);

        dispatch(
            actions.setData({
                ...state.set,
                email: user.email,
                info: {
                    name: localStorage.getItem('@name'),
                    picture: localStorage.getItem('@picture'),
                    permission: localStorage.getItem('@permission'),
                    id: localStorage.getItem('id')
                }
            })
        );
        navigate('/');
    } catch (error) {
        getMessasge('Internal server', 'error', dispatch, actions, state);
    }
};
