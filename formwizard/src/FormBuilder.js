import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import './FormBuilder.css';
import Button from './Button';


// TODO: split these components into their own modules
const AddButton = ({ action, value }) => {
    return (
        <Button type="add" label="Add Input" action={action} value={value} />
    )
};

// Field component for the formbuilder.
// To save on time, actions are passed directly to it.
// ideally, it should connect to its own 'slice' of state and live in a separate
// file
class Field extends Component {
    constructor(props) {
        super(props);
        // need explicit binding for event handlers, otherwise we'd lose 'this' as
        // a reference to the current class
        this.handleSelectChange = this.handleSelectChange.bind(this);
        this.handleChangeCond = this.handleChangeCond.bind(this);
        this.handleChangeCondVal = this.handleChangeCondVal.bind(this);
        this.handleQuestionChange = this.handleQuestionChange.bind(this);
    }

    handleChangeCondVal(e) {
        this.props.changeProperty(e.target.value, this.props.field, 'value', true);
    }

    handleSelectChange(e) {
        this.props.changeFieldType(e.target.value, this.props.field);
    }

    handleQuestionChange(e) {
        // update the question property
        this.props.changeProperty(e.target.value, this.props.field, 'question');
    }

    handleChangeCond(e) {
        this.props.changeProperty(e.target.value, this.props.field, 'parentCondValue');
    }

    render() {
        const { initialFieldChoices, field, level, addSubInput } = this.props;
        return (
            <div className='FormBuilder__Field' style={{ left: `${level * 2}%`}}>
               <fieldset>
                   {level > 0 && 
                    <div className="FormBuilder__Field__Conds">
                        <label htmlFor="conditions">Condition</label>
                        <select name="conditions" onChange={this.handleChangeCond}>
                            {field.parent.conditionTypes.map((cond, i) => {
                                return <option key={i} value={cond.value}>{cond.label}</option>
                            })}
                        </select>
                        {/* conditional for yes/no case  */}
                        {field.parent.type === 'yes_no' ? 
                          <div className="FormBuilder__Field__Conds__Inp">
                              <select name="yesNoCond" value={field.parent.value} onChange={this.handleChangeCondVal}>
                                {field.parent.inputFields.map((radio, i) => {
                                    return <option key={i} value={radio.value}>{radio.label}</option>
                                })}
                              </select>
                          </div> :
                          <input type={field.parent.type} value={field.parent.value || ''} onChange={this.handleChangeCondVal} />
                        }
                    </div>
                   }
                   <label htmlFor="question">Question</label>
                   <input name="question" type="text" value={field.question || ''} onChange={this.handleQuestionChange} />
                   <label htmlFor="type">Type</label>
                   <select name="type" defaultValue={field.type} onChange={this.handleSelectChange}>
                       {initialFieldChoices.map((choice, i) => {
                           return <option key={i} value={choice.type}>{choice.label}</option>
                       })}
                   </select>
                    <div className="FormBuilder__ChildrenCtrl">
                        <Button type="sub-input" label="Add Sub-Input" action={addSubInput} value={field} />
                        <Button type="delete" label="Delete" action={this.props.deleteField} value={field} />
                    </div>
                </fieldset> 
           </div>
        )
    }
}

class FormBuilder extends Component {
    constructor(props) {
        super(props);
        this.recursiveRenderFields = this.recursiveRenderFields.bind(this);
    }

    recursiveRenderFields(fields) {
        // recursive walk of field tree
        const allNodes = []; 
        const { initialFieldChoices, actions } = this.props;
        const recursiveWalk = (fields, level) => {
            if(fields === null) {
                return;
            }
            fields.forEach((field) => {
              allNodes.push(
                <Field 
                     key={field.id}
                     level={level}
                     initialFieldChoices={initialFieldChoices}
                     field={field}
                     changeFieldType={actions.changeFieldType}
                     addSubInput={actions.addSubInput}
                     changeProperty={actions.changeProperty}
                     deleteField={actions.deleteField}
                />);
              recursiveWalk(field.children, level + 1);
            }, this);
        }
        recursiveWalk.call(this, fields, 0);
        return allNodes; 
    }

    render() {
        const { initialFieldChoices, fields, actions } = this.props;
        return (<section className="FormBuilder">
            <div className="FormBuilder__Form">
                <form>
                    {this.recursiveRenderFields(fields)}
                </form>
            </div>
            <div className="add-input">
                <AddButton action={actions.addField} value={initialFieldChoices[0]} />            
            </div>
        </section>);
    }
}

FormBuilder.propTypes = {
    initialFieldChoices: PropTypes.array.isRequired,
    fields: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    fields: state.formBuilder.fields
});

export default connect(
    mapStateToProps,
    {}
)(FormBuilder);