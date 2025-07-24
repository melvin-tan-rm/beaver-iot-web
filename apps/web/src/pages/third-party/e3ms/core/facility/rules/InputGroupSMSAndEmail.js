import { InputGroup, InputGroupText, Row, Col, Input, Label } from 'reactstrap'

const InputGroupSMSAndEmail = () => {
  return (
    <Row>
      <Label for='col-cb'>Email and SMS notification after booking</Label>
      <Col className='mb-1' md='6' sm='12'>
        <InputGroup>
          <InputGroupText>
            <div className='form-check'>
              <Input type='checkbox' id='emailAfterBooking' />
            </div>
          </InputGroupText>
          <Input type='text' placeholder='Email message text' />
        </InputGroup>
      </Col>
      <Col className='mb-1' md='6' sm='12'>
        <InputGroup>
          <InputGroupText>
            <div className='form-check'>
              <Input type='checkbox' id='SMSAfterBooking' />
            </div>
          </InputGroupText>
          <Input type='text' placeholder='SMS message text' />
        </InputGroup>
      </Col>
      <Label for='col-cb'>Email and SMS notification after cancellation of booking</Label>
      <Col className='mb-1' md='6' sm='12'>
        <InputGroup>
          <InputGroupText>
            <div className='form-check'>
              <Input type='checkbox' id='emailAfterCancel' />
            </div>
          </InputGroupText>
          <Input type='text' placeholder='Email message text' />
        </InputGroup>
      </Col>
      <Col className='mb-1' md='6' sm='12'>
        <InputGroup>
          <InputGroupText>
            <div className='form-check'>
              <Input type='checkbox' id='SMSAfterCancel' />
            </div>
          </InputGroupText>
          <Input type='text' placeholder='SMS message text' />
        </InputGroup>
      </Col>
    </Row>
  )
}

export default InputGroupSMSAndEmail
