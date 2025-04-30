/*
 *
 * Login
 *
 */

import React from 'react';

import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import { Row, Col } from 'reactstrap';

import actions from '../../actions';

import Input from '../../components/Common/Input';
import Button from '../../components/Common/Button';
import LoadingIndicator from '../../components/Common/LoadingIndicator';
import SignupProvider from '../../components/Common/SignupProvider';

import './css/login.scss';

class Login extends React.PureComponent {
  render() {
    const {
      authenticated,
      loginFormData,
      loginChange,
      login,
      formErrors,
      isLoading,
      isSubmitting
    } = this.props;

    if (authenticated) return <Redirect to='/dashboard' />;

    const registerLink = () => {
      this.props.history.push('/register');
    };

    const handleSubmit = event => {
      event.preventDefault();
      login();
    };

    return (
      <div className='login-form'>
        {isLoading && <LoadingIndicator />}
        <h1>LOGIN</h1>
        <hr />
        <form onSubmit={handleSubmit} noValidate>
          <Row className='row-row'>
            <Col
              // xs={{ size: 12, order: 2 }}
              // md={{ size: '6', order: 1 }}
              className='traditional-login'
            >
              <Col>
                <Input
                  type={'text'}
                  error={formErrors['email']}
                  label={'Email Address'}
                  name={'email'}
                  placeholder={'Please Enter Your Email'}
                  value={loginFormData.email}
                  onInputChange={(name, value) => {
                    loginChange(name, value);
                  }}
                />
              </Col>
              <Col>
                <Input
                  type={'password'}
                  error={formErrors['password']}
                  label={'Password'}
                  name={'password'}
                  placeholder={'Please Enter Your Password'}
                  value={loginFormData.password}
                  onInputChange={(name, value) => {
                    loginChange(name, value);
                  }}
                />
                <Link
                  className='redirect-link forgot-password-link'
                  to={'/forgot-password'}
                >
                  Forgot Password?
                </Link>
                <div className='button-wrapper-main'>
                  <div className='button-wrapper-second'>
                    <Button
                      type='submit'
                      variant='primary'
                      text='Login'
                      disabled={isSubmitting}
                    />
                    <Button
                      text='Create an account'
                      variant='link'
                      className='ml-md-3'
                      onClick={registerLink}
                    />
                  </div>
                </div>
              </Col>
            </Col>
          </Row>
          <hr />
          <SignupProvider className='third-party-auth' />
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    authenticated: state.authentication.authenticated,
    loginFormData: state.login.loginFormData,
    formErrors: state.login.formErrors,
    isLoading: state.login.isLoading,
    isSubmitting: state.login.isSubmitting
  };
};

export default connect(mapStateToProps, actions)(Login);
