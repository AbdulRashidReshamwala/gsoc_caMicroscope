import React from "react";
import { Card, Button, Image } from "react-bootstrap";

export default function DatasetItemView(props) {
  return (
    <Card style={{ marginBottom: "12px" }}>
      <Image
        style={{ height: "200px" }}
        fluid
        variant="top"
        src={`http://0.0.0.0:5000/static/datasets/${props.dataset}/${props.category}/${props.imgName}`}
      />
      <Card.Body>
        <Card.Title>Card Title</Card.Title>
        <Button variant="primary">Go somewhere</Button>
      </Card.Body>
    </Card>
  );
}
