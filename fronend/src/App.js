import React from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import ModelView from "./components/ModelTraining/ModelTraining";
import DatasetView from "./components/DatasetView/DatasetView";
import "react-tabs/style/react-tabs.css";
import { Container } from "react-bootstrap";

function App() {
  return (
    <div style={{ marginTop: "2rem" }}>
      <Container>
        <Tabs>
          <TabList>
            <Tab>Dataset</Tab>
            <Tab>Model</Tab>
          </TabList>

          <TabPanel>
            <DatasetView />
          </TabPanel>
          <TabPanel>
            <ModelView />
          </TabPanel>
        </Tabs>
      </Container>
    </div>
  );
}

export default App;
