import React from 'react'
//Bootstrap
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
// Import Link from react-router-dom for navigation
import { Link } from 'react-router-dom';

export default function Header({ heading }) {
  return (
    <header className='header'>
        <Row>
            <Col>
            <h1 className='h1'>{heading}</h1>
            </Col>
        </Row>
        <Row className='navRow'>
            <Col className='navCol'>
            <nav className='navigation'>
                      {/* Unordered list to hold the navigation links */}
                <ul className='navbar'>
                    <li className='linkItem'>
                        {/* Link to HOME page */}
                        <Link className='refLink' to='/'>
                             <p className='linkText'>HOME</p>
                        </Link> 
                    </li>
                    {/* Link to GAME PAGE */}
                    <li className='linkItem'>
                        <Link className='refLink' to='/page2'>
                        <p className='linkText'>GAME</p>
                        </Link>
                    </li>
                    {/* Link to add Quiz Page */}
                    <li className='linkItem'>
                        <Link className='refLink' to='/page3'>
                            <p className='linkText'>ADD QUIZ</p>
                        </Link>
                    </li>
                    {/* Link to USER ACCOUNT Page */}
                    <li className='linkItem'>
                        <Link className='refLink' to='/page4'>
                            <p className='linkText'>USER ACCOUNT</p>
                        </Link>

                    </li>
                </ul>
            </nav>
            </Col>
        </Row>
    </header>
  )
}
