import { combineReducers } from 'redux';
import { cloneDeep } from 'lodash';
import { guid } from './utils';
import * as types from './constants';

const conditionTypes = [
    { label: 'Equals', value: '=' }, 
    { label: 'Greater Than', value: '>'}, 
    {label: 'Less Than', value: '<'}
];

const initialState = {
   initialFieldChoices: [
    {
        id: guid(),
        type: 'number',
        label: 'Number',
        parentCondValue: null,
        parent: null,
        question: null,
        value: null,
        children: null,
        conditionTypes
    },
    {
        id: guid(),
        type: 'text',
        label: 'Text',
        parentCondValue: null,
        parent: null,
        question: null,
        value: null,
        children: null,
        conditionTypes: [conditionTypes[0]]
    },
    {
        id: guid(),
        type: 'yes_no',
        label: 'Yes / No',
        parentCondValue: null,
        parent: null,
        question: null,
        value: 1,
        inputFields: [{value: 1, type: "radio", label: "Yes"}, {value: 0, type: "radio", label: "No"}],
        children: null,
        conditionTypes: [conditionTypes[0]]
    },
   ],
   fields: [] //array of field types
};

const changeFieldType = (state, action) => {
    const stateClone = cloneDeep(state);
    const { fields } = stateClone;
    const { field, fieldType } = action.payload;
    const searchAndUpdate = (fields, field) => {
    // recursively search for provided field and modify type
        if(fields) {
            for(let i = 0; i < fields.length; i++) {
                if(fields[i].id === field.id) {
                    const updateField = state.initialFieldChoices.find(f => f.type === fieldType);
                    let children = cloneDeep(field.children);
                    // update children's conditional fields
                    if(children) {
                        children = children.map(child => {
                            return {
                                ...child,
                                parent: {
                                    id: field.id,
                                    conditionTypes: updateField.conditionTypes,
                                    type: updateField.type,
                                    value: updateField.value,
                                    inputFields: updateField.inputFields || null
                                },
                                parentCondValue: updateField.parentCondValue
                            };
                        });
                    }

                    if(field.parent) {
                        updateField.parent = fields[i].parent;
                    }
                    fields[i] = {
                        ...updateField,
                        id: field.id,
                        children
                    };
                    return; 
                }
                searchAndUpdate(fields[i].children, field);
            }
        }
    }
    searchAndUpdate(fields, field);
    return stateClone;
}

const addSubInput = (state, { payload }) => {
    const stateClone = cloneDeep(state);
    const { fields } = stateClone;
    const { parentId } = payload;
    const search = (fields, parentId) => {
        if(fields) {
            for(let i = 0; i < fields.length; i++) {
                const parent = fields[i];
                if(parent.id === parentId) {
                    const newSub = { 
                        ...state.initialFieldChoices[0], 
                        parent: {
                            id: parent.id,
                            conditionTypes: parent.conditionTypes,
                            type: parent.type,
                            value: parent.value,
                            inputFields: parent.inputFields || null
                        },
                        id: guid() 
                    };
                    if(parent.children) {
                        parent.children.push(newSub);
                    } else {
                        parent.children = [newSub];
                    }
                    return;
                }
                search(parent.children, parentId);
            }
        }
    };
    search(fields, parentId);
    return stateClone;
}

// the conditional switch should ideally be more condensed and different functionality
// split out
const formBuilder = (state = initialState, action) => {
    let fields;
    switch(action.type) {
        case types.ADD_FIELD:
            fields = state.fields ? [...state.fields] : [];
            fields.push({ ...action.payload, id: guid() });
            return {...state, fields};
        case types.CHANGE_FIELD_TYPE:
            return changeFieldType(state, action);
        case types.ADD_SUB_INPUT:
            return addSubInput(state, action);
        case types.GET_INITIAL_FIELDS:
            return state.initialFieldChoices;
        default:
            return state;
    }
};


export default combineReducers({
   formBuilder 
});