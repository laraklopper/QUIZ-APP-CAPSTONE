import React from 'react';
// Bootstrap
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

//RegistrationForm function component
export default function RegistrationForm(
  {//PROPS PASSED FROM PARENT COMPONENT
    newUserData, 
    handleRegistration, 
    handleInputChange
  }
) {
  
  //================JSX RENDERING==============

  return (
    // RegistrationForm
    <form id='registrationForm' onSubmit={handleRegistration}>
      <Row className='regisCol'>
        <Col xs={6} md={4} className='regisCol'>
        {/* New Username input */}
        <label className='regisLabel' htmlFor='newUsername'>
          <p className='labelText'>USERNAME:</p>
          <input
          className='regisInput'
          type='text'
          id='newUsername'
          name='newUsername'
          value={newUserData.newUsername}
          onChange={handleInputChange}
          placeholder='USERNAME'
          autoComplete='off'
          required
          />
        </label>
        </Col>
        <Col xs={6} md={4} className='regisCol'>
        {/* New Email input */}
        <label className='regisLabel' htmlFor='email'>
          <p className='labelText'>EMAIL:</p>
          <input
          className='regisInput'
          id='email'
          type='email'
          name='newEmail'
          value={newUserData.newEmail}
          onChange={handleInputChange}
          placeholder='Enter Email'
          autoComplete='off'
          required
          />
        </label>
        </Col>
        <Col xs={6} md={4} className='regisCol'>
        {/* NewDate of Birth Input */}
          <label className='regisLabel'>
            <p className='labelText'>DATE OF BIRTH:</p>
            <input
              className='regisInput'
              type='date'
              name='newDateOfBirth'
              value={newUserData.newDateOfBirth}
              onChange={handleInputChange}
              placeholder='dd/mm/yyyy'
              required
              />
          </label>
        </Col>
      </Row>
      <Row className='regisRow'>
        <Col xs={6} md={4} className='regisCol'>
          <label className='regisLabel'>
            <p className='labelText'>PASSWORD:</p>
            <input
              className='regisInput'
              type='password'
              name='newPassword'
              value={newUserData.newPassword}
              onChange={handleInputChange}
              autoComplete='off'
              placeholder='PASSWORD'
              required
              />
          </label>
        </Col>
        <Col xs={6} md={4} className='regisCol'>
          <label id='regisLabelCheckBox' htmlFor='adminCheckBox'>
            {/* New admin Input */}
            <p className='labelText'>REGISTER AS ADMIN:</p>
            <input
              className='regisInput'
              id='adminCheckBox'
              type='checkbox'
              name='newAdmin'
              value={newUserData.newAdmin}
              onChange={handleInputChange}
              />
          </label>
        </Col>
        <Col xs={6} md={4} className='regisCol'>
          <Button variant="primary" type='submit'>
            REGISTER
          </Button>
        </Col>
      </Row>
    </form>
  )
}
