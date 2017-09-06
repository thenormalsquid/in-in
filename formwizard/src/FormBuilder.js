import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from './Button';

const AddButton = ({ actions }) => {
    return (
        <Button type="add" label="Add Input" action={() => {}} />
    )
};

export default class FormBuilder extends Component {
    render() {
        const { initialFieldChoices, fields } = this.props.initialFieldChoices;
        return (<section className="FormBuilder">
            <div className="add-input">
                <AddButton />            
            </div>
        </section>);
    }
}

FormBuilder.propTypes = {
    initialFieldChoices: PropTypes.array.isRequired,
    fields: PropTypes.array.isRequired
}