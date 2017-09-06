import * as types from './constants';

export const addField = field => ({
    type: types.ADD_FIELD,
    payload: field
});

export const getInitFields = () => ({
    type: types.GET_INITIAL_FIELDS
});

export const changeFieldType = (fieldType, field) => ({
    type: types.CHANGE_FIELD_TYPE,
    payload: {
        fieldType,
        field
    }
});

export const addSubInput = field => ({
    type: types.ADD_SUB_INPUT,
    payload: {
       parentId: field.id 
    }
});