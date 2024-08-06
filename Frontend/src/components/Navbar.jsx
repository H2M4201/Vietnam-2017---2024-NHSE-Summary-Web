import React from "react";
import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import '../style/navbar.css';

const years = [2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017];

function CustomNavbar() {
  return (
    <Navbar className="navbar" expand="lg">
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand>
            <span className="navbar-title">THỐNG KÊ THPTQG</span>
          </Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto navbar-nav">
            <LinkContainer to="/">
              <Nav.Link>THỐNG KÊ TỔNG QUAN</Nav.Link>
            </LinkContainer>
            <NavDropdown title="THỐNG KÊ THEO NĂM" id="basic-nav-dropdown">
              {years.map((year) => (
                <LinkContainer key={year} to={`/StatisticByYear/${year}`}>
                  <NavDropdown.Item>{year}</NavDropdown.Item>
                </LinkContainer>
              ))}
            </NavDropdown>
            <NavDropdown title="TRA CỨU THEO NĂM" id="basic-nav-search-dropdown">
              {years.map((year) => (
                <LinkContainer key={year} to={`/SearchResult/${year}`}>
                  <NavDropdown.Item>{year}</NavDropdown.Item>
                </LinkContainer>
              ))}
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default CustomNavbar;
