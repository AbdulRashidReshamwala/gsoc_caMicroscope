import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import axios from "axios";
import DetailDatasetView from "./DetailDatasetView";

export default function DatasetView() {
  const [selectedDataset, setSelectedDataset] = useState(null);
  const [selectedDatasetData, setSelectedDatasetData] = useState(null);
  const [allDataset, setAllDataset] = useState(null);

  useEffect(() => {
    axios
      .get("https://afternoon-plains-91928.herokuapp.com/dataset/all")
      .then(res => setAllDataset(res.data.datasets))
      .catch(err => alert(err));
  }, []);

  useEffect(() => {
    selectedDataset
      ? axios
          .get(
            `https://afternoon-plains-91928.herokuapp.com/dataset/view/${selectedDataset}`
          )
          .then(res => setSelectedDatasetData(res.data))
      : console.log("select a datset");
  }, [selectedDataset]);

  return (
    <div>
      <Table responsive>
        <thead>
          <tr>
            <th>Number</th>
            <th>Name</th>
            <th>Classes</th>
            <th>Size (total image count)</th>
            <th>Last Updated</th>
          </tr>
        </thead>
        <tbody>
          {allDataset ? (
            allDataset.map((d, id) => {
              return (
                <tr key={id} onClick={() => setSelectedDataset(d.id)}>
                  <td>{d.id}</td>
                  <td>{d.name}</td>
                  <td>{d.no_classes}</td>
                  <td>{d.no_image}</td>
                  <td>{d.last_updated}</td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td>loading</td>
            </tr>
          )}
        </tbody>
      </Table>
      <div>
        {selectedDatasetData ? (
          <DetailDatasetView data={selectedDatasetData} />
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
