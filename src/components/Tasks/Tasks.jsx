/*!

=========================================================
* Light Bootstrap Dashboard React - v1.3.0
=========================================================

* Product Page: https://www.creative-tim.com/product/light-bootstrap-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/light-bootstrap-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { Component } from "react";

export class Tasks extends Component {
  handleCheckbox = event => {
    const target = event.target;
    console.log(event.target);
    this.setState({
      [target.name]: target.checked
    });
  };
  render() {

    const tasks_title = [
      'Know you Customers',
      "How to track customer records? ",
      "Develop Backend API for file uploads",
      "Create User Experiences you Never Knew About",
      'Develop API for List, Download and Delete',
      "Develop Admin Dashboard"
    ];
    var tasks = [];
  
    for (var i = 0; i < tasks_title.length; i++) {

      tasks.push(
        <tr key={i}>
          <td>

          </td>
          <td>{tasks_title[i]}</td>

        </tr>
      );
    }
    return <tbody>{tasks}</tbody>;
  }
}

export default Tasks;
