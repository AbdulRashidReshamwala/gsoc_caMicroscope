import React from "react";

import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import DatasetClassView from "./DatasetClassView";

export default function DetailDatasetView(props) {
  const data = props.data;
  return (
    <Tabs>
      <TabList>
        {data.classes.map(c => (
          <Tab>{c}</Tab>
        ))}
      </TabList>
      {data.files.map((f, id) => {
        return (
          <TabPanel>
            <DatasetClassView
              items={f}
              category={data.classes[id]}
              dataset={data.name}
            />
          </TabPanel>
        );
      })}
    </Tabs>
  );
}
