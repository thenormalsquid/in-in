import { combineReducers } from 'redux';
import { cloneDeep, remove } from 'lodash';
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
                                parentCondValue: updateField.conditionTypes[0].value
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

// TODO: a lot of these recursive search can be refactored into their own function
// most of the functionality is repeated
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
                        parentCondValue: parent.conditionTypes[0].value,
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

const updateProperty = (state, { payload }) => {
    // TODO: switch to immutablejs for less expensive state clones
    // and possibly normalize so we can already update at the current field level, no need to
    // keep doing searches
    const stateClone = cloneDeep(state);
    const fieldsClone = stateClone.fields;
    const { propertyName, newValue, field, isParentOnly } = payload;
    const update = (fields, fieldId, parentOnly, backTrack) => {
        if(fields) {
            for(let i = 0; i < fields.length; i++) {
                const f = fields[i];
                if(f.id === fieldId) {
                    if((!parentOnly || backTrack) && f.hasOwnProperty(propertyName)) {
                        f[propertyName] = newValue;
                        if(backTrack) {
                            return;
                        }
                    } 

                    if(!backTrack && f.parent && f.parent.hasOwnProperty(propertyName)) {
                        f.parent[propertyName] = newValue;
                        // walk back up the tree to update parent. only go one level back
                        update(fieldsClone, f.parent.id, parentOnly, true);
                    }
                    return;
                }
                update(f.children, fieldId, parentOnly, backTrack);
            }
        }
    };
    update(fieldsClone, field.id, isParentOnly, false);
    return stateClone;
}

const deleteField = (state, action) => {
    const stateClone = cloneDeep(state);
    const fieldClone = stateClone.fields;
    const { field } = action.payload;

    const findAndDestroy = (fields) => {
        if(fields) {
            for(let i = 0; i < fields.length; i++) {
                const f = fields[i];
                if(f.id === field.id) {
                    remove(fields, (el) => {
                       return el.id === field.id
                    });
                    return;
                }
                findAndDestroy(f.children);
            }
        }
    }
    findAndDestroy(fieldClone);
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
        case types.CHANGE_PROPERTIES:
            return updateProperty(state, action);
        case types.GET_INITIAL_FIELDS:
            return state.initialFieldChoices;
        case types.DELETE_FIELD:
            return deleteField(state, action);
        default:
            return state;
    }
};


export default combineReducers({
   formBuilder 
});