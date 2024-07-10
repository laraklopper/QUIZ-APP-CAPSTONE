// Import necessary modules and packages
import React from 'react'
//Bootstrap
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
// Import Link from react-router-dom for navigation
import { Link } from 'react-router-dom';

//MainHeader function component
export default function MainHeader(
    {//PROPS
        mainHeading
    }
) {


    //============JSX RENDERING================

  return (
    <header className='header'>
        <Row className='headingRow'>
            <Col className='headingCol'>
            <h1 className='h1'>{mainHeading}</h1>
            </Col>
        </Row>
          <Row>
              <Col xs={6} md={4}>
              </Col>
              <Col xs={6} md={4}>
              <nav className='navigation'>
                <ul className='navbar'>
                    {/* Link to LoginPage */}
                    <li className='linkItem'>
                        <Link className='refLink' to='/'>
                        <p className='linkText'>LOGIN</p>
                        </Link>
                    </li>
                    {/* Link to registration page */}
                    <li className='linkItem'>
                        <Link className='refLink' to='/reg'>
                            <p className='linkText'>REGISTRATION</p>                        
                        </Link>
                    </li>
                </ul>
              </nav>
              </Col>
              <Col xs={6} md={4}>
              </Col>
          </Row>
    </header>
  )
}
