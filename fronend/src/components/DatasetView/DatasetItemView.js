import React from "react";
import { Card, Button, Image } from "react-bootstrap";

export default function DatasetItemView(props) {
  return (
    <Card style={{ marginBottom: "12px" }}>
      <Image
        style={{ height: "200px" }}
        fluid
        variant="top"
        src={`https://afternoon-plains-91928.herokuapp.com/static/datasets/${props.dataset}/${props.category}/${props.imgName}`}
      />
      <Card.Body>
        <Card.Title>{props.imgName}</Card.Title>
        <Button variant="primary" onClick={() => alert("//TODO..")}>
          Open Editor
        </Button>
      </Card.Body>
    </Card>
  );
}
