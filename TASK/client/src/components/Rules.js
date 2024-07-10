import React from 'react'
//Bootstrap
import Col from 'react-bootstrap/Col';

//Rules function component
export default function Rules() {

    //=======JSX RENDERING===========
    
  return (
    // Application rules
      <Col xs={12} md={8} className='rulesCol'>
          <ul className='rulesList'>
              <li className='ruleItem'>
                  <h6 className='rule'>
                      ALL ADMIN USERS MUST BE OLDER THAN 18
                  </h6>
              </li>
              <li className='ruleItem'>
                  <h6 className='rule'>
                      THE APPLICATION DOES NOT SUPPORT ANY FORM OF GAMBLING
                  </h6>
              </li>
              <li>
                  <h6 className='rule'>
                      USER INFORMATION IS PRIVATE AND MAY NOT BE ACCESSED
                      WITHOUT AUTHORIZATION
                  </h6>
              </li>
              <li className='ruleItem'>
                  <h5 className='rule'>
                      ANY USER WHO DOES NOT ADHERE TO THESE RULES MAY BE REMOVED
                  </h5>
              </li>
          </ul>
      </Col>
  )
}
