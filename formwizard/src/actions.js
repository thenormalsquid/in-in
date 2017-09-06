import * as types from './constants';

export const addField = field => ({
    type: types.ADD_FIELD,
    payload: field
});

export const getInitFields = () => ({
    type: types.GET_INITIAL_FIELDS
});