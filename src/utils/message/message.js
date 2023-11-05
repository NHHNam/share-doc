const getMessasge = (message, type, dispatch, actions, state) => {
    dispatch(
        actions.setData({
            ...state.set,
            snackbar: {
                active: true,
                message: message,
                type: type
            }
        })
    );
};

export default getMessasge;
