import { SET, TOGGLE } from './actions';

const initialState = {
    set: {
        email: localStorage.getItem('@user') || '',
        currentUser: '',
        info: {
            name: localStorage.getItem('@name') || '',
            picture: localStorage.getItem('@picture') || '',
            permission: localStorage.getItem('@permission') || ''
        },
        listDocument: [],
        snackbar: {
            active: false,
            message: 'Error',
            type: 'success'
        },
        upload: {
            categoryId: 1
        },
        sidebarIndex: 0,
        roles: 'user',
        comments: [],
        title: 'Dashboard',
        documentsPublic: [],
        documentsCategory: [],
        documentChoose: {}
    },
    toggle: {
        modalPaymentEdit: false,
        modalSettingEdit: false,
        modalDepositsEdit: false,
        modalWithdrawEdit: false,
        modalBuyEdit: false,
        modalSellEdit: false,
        modalDelete: false,
        modalStatus: false,
        hideAllUser: false,
        alertModal: false,
        selectStatus: false,
        selectBank: false,
        feeUpdate: false
    }
};

const setData = (payload) => {
    return {
        type: SET,
        payload
    };
};
const toggleModal = (payload) => {
    return {
        type: TOGGLE,
        payload
    };
};

const reducer = (state, action) => {
    switch (action?.type) {
        case SET:
            return {
                ...state,
                set: {
                    ...state.set,
                    ...action.payload
                }
            };
        case TOGGLE:
            return {
                ...state,
                toggle: {
                    ...state.toggle,
                    ...action.payload
                }
            };
        default:
            return state;
    }
};
export { initialState, setData, toggleModal };
export default reducer;
