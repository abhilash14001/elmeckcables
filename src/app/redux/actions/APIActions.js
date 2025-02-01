import api from '../../../api';

export const GET_STATES = 'GET_STATES'

export const getNotification = () => (dispatch) => {
    api.state.list().then((res) => {
        dispatch({
            type: GET_STATES,
            payload: res.data,
        })
    })
}
