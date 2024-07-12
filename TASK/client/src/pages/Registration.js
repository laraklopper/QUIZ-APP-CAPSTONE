// Import necessary modules and packages
import React from 'react';
import '../CSS/registration.css'
//Bootstrap
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
//Components
import MainHeader from '../components/MainHeader';
import PageFooter from '../components/PageFooter';
import RegistrationForm from '../components/RegistrationForm';

//Registration Function Component
export default function Registration(
  {//PROPS PASSED FROM PARENT COMPONENT
    addUser, 
    newUserData, 
    setNewUserData
  }
  ) {

  //============EVENT LISTENERS===========
//Event Listener to handle input change
  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    const newValue = type === 'checkbox' ? checked : value;
    setNewUserData(prevState => (
      { ...prevState, [name]: newValue }));
  };

  //Event Listener to handle user registration
  const handleRegistration = (e) => {
    e.preventDefault();
    console.log('Registering new user');
    addUser(); 
  }

  //========JSX RENDERING=================

  return (
   <>
   {/* Header */}
   <MainHeader mainHeading='REGISTRATION'/>
   {/* Section1/ */}
   <section className='section1'>
        <Row className='regisRow'>
          <Col>
            <h3 className='h3'>ENTER REGISTRATION DETAILS</h3>
          </Col>
        </Row>
        {/* Regisrtration Form */}
    <RegistrationForm
    newUserData={newUserData}
    handleInputChange={handleInputChange}
    handleRegistration={handleRegistration}
    />
        
   </section>
   <section className='section2'>
        <Row>
          <Col xs={12} md={8}>
            <ul className='rulesList'>
              <li><h3 id='regisRequire'>REGISTRATION REQUIREMENTS</h3></li>
              <li className='rule'>
                THE USERNAME DOES NOT HAVE TO BE THE USERS REAL NAME
              </li>
              <li className='rule'>
                USERNAME AND PASSWORD MUST BE UNIQUE
              </li>
              <li className='rule'>
                PASSWORDS MUST BE AT LEAST 8 CHARACTERS
              </li>
              <li className='rule'>
                USERS MAY ONLY ON INITIAL REGISTRATION REGISTER AS AN
                ADMIN USER
              </li>
            </ul>
          </Col>
          <Col xs={6} md={4}>
          </Col>
        </Row>
   </section>
   <PageFooter/>
   </>
  )
}
