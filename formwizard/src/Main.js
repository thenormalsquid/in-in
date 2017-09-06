// main tabbed application view
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './actions';
import FormBuilder from './FormBuilder';
import 'react-tabs/style/react-tabs.css';
import './Main.css';

class Main extends Component {
    render() {
        const { initialFieldChoices, fields, actions } = this.props;
        return (<section className="Main">
          <Tabs>
            <TabList>
                <Tab>Create</Tab>
                <Tab>Preview</Tab>
                <Tab>Export</Tab>
            </TabList>
            <TabPanel>
              <FormBuilder 
                initialFieldChoices={initialFieldChoices} 
                fields={fields}
                actions={actions}
              />
            </TabPanel>
            <TabPanel><h1>dd</h1></TabPanel>
            <TabPanel><h1>ee</h1></TabPanel>
          </Tabs>
        </section>);
    }
}

Main.propTypes = {
    actions: PropTypes.object.isRequired,
    initialFieldChoices: PropTypes.array.isRequired
}

// fields will be built out as we progress through the form builder
const mapStateToProps = (state) => ({
    initialFieldChoices: state.formBuilder.initialFieldChoices,
    fields: state.formBuilder.fields
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch)
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Main);