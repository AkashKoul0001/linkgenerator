


import React, { useState } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import myImage from "../assets/m_image.png"; // Correct path to the image
import axios from "axios"; // Import axios for making API calls

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh; /* Full screen height */
  background-color: #f4f4f4;
  width: 100%; /* Ensure full width */
`;

const FormContainer = styled.div`
  display: flex;
  width: 100%;
  min-height: 100vh; /* Full screen height */
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    flex-direction: column;
    height: auto; /* Allow height to adjust for mobile */
  }
`;

const ImageSide = styled.div`
  background-image: url(${myImage});
  background-size: cover;
  background-position: center;
  width: 35%; /* 35% width for the image */
  min-height: 100vh; /* Full screen height */
  flex: 1;

  @media (max-width: 768px) {
    display: none; /* Hide the image on mobile */
  }
`;

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 40px 20px; /* Increased padding for better spacing */
  background-color: white;
  width: 65%; /* 65% width for the form */
  min-height: 100vh; /* Full screen height */
  align-items: center;
  justify-content: center;
  box-sizing: border-box;

  @media (max-width: 768px) {
    width: 100%; /* Full width on mobile */
    padding: 20px 15px; /* Adjust padding on mobile */
    min-height: auto; /* Allow height to adjust for mobile */
  }
`;

const Input = styled.input`
  padding: 12px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  width: 100%; /* Full width of the form */
  font-size: 16px;

  @media (max-width: 480px) {
    padding: 10px;
    font-size: 14px;
  }
`;

const Button = styled.button`
  padding: 12px;
  background-color: #1b48da;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 100%; /* Full width button */
  font-size: 16px;
  transition: background-color 0.3s;

  &:hover {
    background-color: rgb(5, 41, 158);
  }

  @media (max-width: 480px) {
    padding: 10px;
    font-size: 14px;
  }
`;

const MyForm = styled.form`
  width: 50%;
  max-width: 400px; /* Limit the width of the form */

  @media (max-width: 768px) {
    width: 90%; /* Adjust width on mobile */
  }

  @media (max-width: 480px) {
    width: 100%; /* Full width on very small screens */
  }
`;

const ButtonSection = styled.div`
  display: flex;
  gap: 10px;
  position: absolute;
  top: 20px;
  right: 20px;

  @media (max-width: 768px) {
    position: relative;
    top: auto;
    right: auto;
    width: 100%;
    justify-content: center;
    margin-bottom: 30px;
  }
`;

const BoxButton = styled.div`
  padding: 10px 20px;
  background-color: #1b48da;
  color: white;
  border: 1px solid #ddd;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;

  @media (max-width: 480px) {
    padding: 8px 16px;
    font-size: 13px;
  }
`;

const BoxButton2 = styled.div`
  padding: 10px 20px;
  background-color: white;
  color: black;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;

  &:hover {
    background-color: rgb(5, 41, 158);
  }

  @media (max-width: 480px) {
    padding: 8px 16px;
    font-size: 13px;
  }
`;

const Title = styled.h2`
  font-size: 24px;
  margin-bottom: 30px;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 20px;
    margin-bottom: 20px;
  }
`;

const InfoText = styled.p`
  text-align: center;
  font-size: 14px;
  margin-top: 20px;

  a {
    color: #1b48da;
    text-decoration: none;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }

  @media (max-width: 480px) {
    font-size: 13px;
  }
`;

const CuvetteText = styled.h1`
  position: absolute;
  top: 20px; 
  left: 20px; 
  color: ; black
  font-weight: bold;
  font-size: 36px; 

  @media (max-width: 768px) {
    display: none;
  }
`;

const Signup = () => {
  const navigate = useNavigate();
  
  // Define state to hold form input values
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError(null);

    // Make the API request to create the new user
    try {
      const response = await axios.post('http://localhost:8000/api/v1/users/create', {
        name,
        email,
        mobile,
        password,
      });

      // Handle successful response
      console.log(response.data);
      navigate("/login"); // Navigate to login page after successful signup

    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <FormContainer>
        <ImageSide>

        <CuvetteText>Cuvette</CuvetteText>
        </ImageSide>
        
        <FormWrapper>
          <ButtonSection>
            <BoxButton>Signup</BoxButton>
            <BoxButton2 onClick={handleLoginClick}>Login</BoxButton2>
          </ButtonSection>
          <Title>Join us Today!</Title>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <MyForm onSubmit={handleSubmit}>
            <Input 
              type="text" 
              placeholder="Name" 
              value={name}
              onChange={(e) => setName(e.target.value)} 
              required 
            />
            <Input 
              type="email" 
              placeholder="Email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
            <Input 
              type="number" 
              placeholder="Mobile no." 
              value={mobile}
              onChange={(e) => setMobile(e.target.value)} 
              required 
            />
            <Input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
            <Input 
              type="password" 
              placeholder="Confirm Password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)} 
              required 
            />
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating Account...' : 'Register'}
            </Button>
          </MyForm>
          <InfoText>
            Already have an account? <Link to="/login">Login</Link>
          </InfoText>
        </FormWrapper>
      </FormContainer>
    </Container>
  );
};

export default Signup;