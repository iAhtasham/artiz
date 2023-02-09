import React from "react";
import Table from "react-bootstrap/Table";

const Top = () => {
  return (
    <Table bordered hover style={{ width: "94vw" }}>
      <thead>
        <tr>
          <th>#</th>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Username</th>
        </tr>
      </thead>
      <tbody>
        <tr
          className="cursor-pointer"
          onClick={() => {
            console.log("hello");
          }}
        >
          <td>1</td>
          <td>Mark</td>
          <td>Otto</td>
          <td>@mdo</td>
        </tr>
        <tr>
          <td>2</td>
          <td>Jacob</td>
          <td>Thornton</td>
          <td>@fat</td>
        </tr>
        <tr>
          <td>3</td>
          <td>Thornton</td>
          <td>Thornton</td>
          <td>@twitter</td>
        </tr>
      </tbody>
    </Table>
  );
};

export default Top;
