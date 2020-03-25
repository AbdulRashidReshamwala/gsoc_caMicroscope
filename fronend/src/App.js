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
            <h4>
              Requries Backend images may error out on hosted version due to
              heroku shutting down the dyno
            </h4>
            <h4>
              Please{" "}
              <a
                href="https://afternoon-plains-91928.herokuapp.com/dataset/all"
                target="_blank"
                rel="noopener noreferrer"
              >
                click here and refresh page
              </a>
            </h4>
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
