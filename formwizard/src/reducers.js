import { combineReducers } from 'redux';
import * as types from './constants';

const initialState = {
   initialFieldChoices: [
    {
        type: 'number',
        hidden: 'false',
    }
   ],
   fields: [] //array of field types
};

const formBuilder = (state = initialState, action) => {
    switch(action.type) {
        case types.ADD_FIELD:
            return state;
        case types.GET_INITIAL_FIELDS:
            return state.initialFieldChoices;
        default:
            return state;
    }
};


export default combineReducers({
   formBuilder 
});