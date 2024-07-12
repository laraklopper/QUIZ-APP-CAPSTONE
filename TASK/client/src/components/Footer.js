import React from 'react'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

// Footer function component
export default function Footer({logout}) {

  //=====================================

  return (
    <footer className='pageFooter'>
          <Row>
              <Col xs={12} md={8}>
              </Col>
              <Col xs={6} md={4}>
                <Button variant="warning" type='button' onClick={logout}>LOGOUT</Button>          
              </Col>
          </Row>
    </footer> 
  )
}
