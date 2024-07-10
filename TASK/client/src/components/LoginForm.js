import React from 'react'
import '../CSS/Login.css'
//Bootstrap
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

//LoginForm function component
export default function LoginForm(
    {//PROPS PASSED FROM PARENT COMPONENT
        setShowPassword,
        showPassword, 
        userData,
        handleLoginInput,
        handleLogin
    }
    ) {

    //=========JSX RENDERING==============
  return (
    <form id='LoginForm' onSubmit={handleLogin}>
        <div id='loginDetails'>
            <Row className='loginRow'>
                <Col className='loginCol'>
                {/* Username input */}
                    <label className='loginLabel' htmlFor='username'>
                        <p className='labelText'>USERNAME:</p>
                        <input
                        className='loginInput'
                        id='username'
                        type='text'
                        name='username'
                        value={userData.username}
                        onChange={handleLoginInput}
                        autoComplete='off'
                        placeholder='USERNAME'
                        required
                        />
                    </label>
                </Col>
            </Row>
            <Row className='loginRow'>
                <Col className='loginCol'>
                {/* Password Input*/}
                    <label className='loginLabel' htmlFor='password'>
                        <p className='labelText'>PASSWORD</p>
                        <input
                        className='loginInput'
                        id='password'
                        type={showPassword ? 'text' : 'password'}
                        autoComplete='off'
                        name='password'
                        value={userData.password}
                        onChange={handleLoginInput}
                        placeholder='PASSWORD'   
                           />
                        <div id='showPassword'>
                            {/* Button to display password */}
                              <Button 
                              variant="primary"
                              id='passwordDisplay'
                              type='button'
                                  onMouseDown={(e) => { e.preventDefault(); setShowPassword(true); }}
                                  onMouseUp={(e) => { e.preventDefault(); setShowPassword(false); }}
                              >
                                  {showPassword ? 'HIDE PASSWORD' : 'SHOW PASSWORD'}
                                </Button>
                        </div>
                    </label>
                </Col>
            </Row>
              <Row className='loginRow'>
                  <Col className='loginCol'>
                      {/* Login Button */}
                      <Button variant="primary" id='loginBtn' type='submit'>
                          LOGIN
                      </Button>
                  </Col>
              </Row>
        </div>
        
    </form>

  )
}
