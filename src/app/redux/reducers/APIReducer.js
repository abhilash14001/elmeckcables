import {
    GET_STATES
} from '../actions/APIActions'

const initialState = []

const APIReducer = function (state = initialState, action) {
    switch (action.type) {
        case GET_STATES: {
            return [...action.payload]
        }
        default: {
            return [...state]
        }
    }
}

export default APIReducer
