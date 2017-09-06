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

export const changeProperty = (newValue, field, propertyName, isParentOnly = false) => ({
    type: types.CHANGE_PROPERTIES,
    payload: {
        propertyName,
        newValue,
        isParentOnly,
        field
    }
});

export const deleteField = (field) => ({
    type: types.DELETE_FIELD,
    payload: {
        field
    }
})