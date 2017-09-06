// main tabbed application view
import React, { Component } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

export default class Main extends Component {
    render() {
        return (<div id="formTab">
          <Tabs>
            <TabList>
                <Tab>Create</Tab>
                <Tab>Preview</Tab>
                <Tab>Export</Tab>
            </TabList>
            <TabPanel><h1>pd</h1></TabPanel>
            <TabPanel><h1>dd</h1></TabPanel>
            <TabPanel><h1>ee</h1></TabPanel>
          </Tabs>
        </div>);
    }
}