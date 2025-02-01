import React, { useState } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import myImage from "../assets/m_image.png";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f4f4f4;
  width: 100%;
`;

const FormContainer = styled.div`
  display: flex;
  width: 100%;
  min-height: 100vh;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    flex-direction: column;
    height: auto;
  }
`;

const ImageSide = styled.div`
  background-image: url(${myImage});
  background-size: cover;
  background-position: center;
  width: 35%;
  min-height: 100vh;
  flex: 1;
  position: relative; // Added for positioning the text

  @media (max-width: 768px) {
    display: none;
  }
`;

const CuvetteText = styled.h1`
  position: absolute;
  top: 20px; // Adjust this value to position the text vertically
  left: 20px; // Adjust this value to position the text horizontally
  color: ; black
  font-weight: bold;
  font-size: 36px; // Adjust font size as needed

  @media (max-width: 768px) {
    display: none; // Hide on mobile
  }
`;

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 40px 20px;
  background-color: white;
  width: 65%;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  position: relative;

  @media (max-width: 768px) {
    width: 100%;
    padding: 20px 15px;
    min-height: auto;
  }
`;

const Input = styled.input`
  padding: 12px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  width: 100%;
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
  width: 100%;
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
  max-width: 400px;

  @media (max-width: 768px) {
    width: 90%;
  }

  @media (max-width: 480px) {
    width: 100%;
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

const AuthButton = styled.div`
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
  border: 1px solid #ddd;

  ${({ active }) =>
    active &&
    `
    background-color: #1b48da;
    color: white;
    border-color: #1b48da;
  `}

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

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignUpClick = () => navigate("/signup");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/api/v1/users/login", {
        email,
        password
      });
      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password");
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
            <AuthButton onClick={handleSignUpClick}>Sign Up</AuthButton>
            <AuthButton active>Login</AuthButton>
          </ButtonSection>
          
          <Title>Join us Today!</Title>
          {error && <p style={{ color: "red", marginBottom: "15px" }}>{error}</p>}
          
          <MyForm onSubmit={handleLogin}>
            <Input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit">Login</Button>
          </MyForm>

          <InfoText>
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </InfoText>
        </FormWrapper>
      </FormContainer>
    </Container>
  );
};

export default Login;