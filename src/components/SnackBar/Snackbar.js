import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { useAppContext } from '../../utils';
import { actions } from '../../store';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function SnackbarCom() {
    const { state, dispatch } = useAppContext();

    const active = state.set?.snackbar?.active || false;
    const message = state.set?.snackbar?.message || 'Error';
    const typeAlert = state.set?.snackbar?.type || 'success';

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        dispatch(
            actions.setData({
                ...state.set,
                snackbar: {
                    active: false,
                    message: '',
                    type: 'error'
                }
            })
        );
    };

    return (
        <div>
            <Snackbar
                open={active}
                autoHideDuration={3000}
                onClose={handleClose}
                message={message}
            >
                <Alert
                    onClose={handleClose}
                    severity={typeAlert}
                    sx={{ width: '100%' }}
                >
                    {message}
                </Alert>
            </Snackbar>
        </div>
    );
}
