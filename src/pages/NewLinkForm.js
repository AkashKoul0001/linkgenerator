import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const FormContainer = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: 2rem auto;
  width: 90%;
  @media (min-width: 768px) {
    margin: 4rem auto;
    padding: 2rem;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
  h2 {
    margin: 0;
    font-size: 1.5rem;
    color: #1f2937;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6b7280;
  &:hover {
    color: #1f2937;
  }
`;

const FormBody = styled.form`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormLabel = styled.label`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-weight: 500;
  color: #374151;
  span {
    font-size: 0.875rem;
  }
`;

const FormInput = styled.input`
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 1rem;
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  }
  @media (max-width: 768px) {
    font-size: 0.875rem;
  }
`;

const FormTextarea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  min-height: 100px;
  resize: vertical;
  font-size: 1rem;
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  }
`;

const ExpirationToggle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
`;

const Switch = styled.label`
  position: relative;
  display: inline-block;
  width: 48px;
  height: 24px;
  input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #e5e7eb;
    transition: 0.4s;
    border-radius: 24px;
    &:before {
      position: absolute;
      content: "";
      height: 20px;
      width: 20px;
      left: 2px;
      bottom: 2px;
      background-color: white;
      transition: 0.4s;
      border-radius: 50%;
    }
  }
  input:checked + .slider {
    background-color: #3b82f6;
  }
  input:checked + .slider:before {
    transform: translateX(24px);
  }
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
  margin-top: 1rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
`;

const ClearButton = styled(Button)`
  background-color: #f3f4f6;
  color: #374151;
  &:hover {
    background-color: #e5e7eb;
  }
`;

const CreateButton = styled(Button)`
  background-color: #3b82f6;
  color: white;
  &:hover {
    background-color: #2563eb;
  }
`;



const NewLinkForm = ({ onClose }) => {
  const [originalUrl, setOriginalUrl] = useState("");
  const [remark, setRemark] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [expirationEnabled, setExpirationEnabled] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Authentication required");
      return;
    }

    const requestBody = {
      originalUrl,
      remark,
      ...(expirationEnabled && { expiresAt })
    };

    try {
      const response = await fetch("http://localhost:8000/api/v1/url/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });
      const data = await response.json();
      if (response.ok) {
        alert("Shortened link created successfully!");
        navigate("/dashboard")
        onClose();
      } else {
        alert(`Error: ${data.message}`);
      }
    } 
    catch (error) {
      //alert("Failed to create link");
    }
  };

  const handleClear = () => {
    setOriginalUrl("");
    setRemark("");
    setExpiresAt("");
    setExpirationEnabled(false);
  };

  const onCloseButton = () =>{
    navigate("/linkspage")
  }

  return (
    <FormContainer>
      <ModalHeader>
        <h2>New Link</h2>
        <CloseButton onClick={onCloseButton}>×</CloseButton>
      </ModalHeader>

      <FormBody onSubmit={handleSubmit}>
        <FormLabel>
          <span>Destination URL *</span>
          <FormInput
            type="url"
            placeholder="https://example.com"
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
            required
          />
        </FormLabel>

        <FormLabel>
          <span>Remarks *</span>
          <FormTextarea
            placeholder="Add remarks"
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            required
          />
        </FormLabel>

        <ExpirationToggle>
          <span>Link Expiration</span>
          <Switch>
            <input
              type="checkbox"
              checked={expirationEnabled}
              onChange={() => setExpirationEnabled(!expirationEnabled)}
            />
            <span className="slider" />
          </Switch>
        </ExpirationToggle>

        {expirationEnabled && (
          <FormInput
            type="datetime-local"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
            min={new Date().toISOString().slice(0, 16)}
          />
        )}

        <Footer>
          <ClearButton type="button" onClick={handleClear}>
            Clear
          </ClearButton>
          <CreateButton type="submit">Create New</CreateButton>
        </Footer>
      </FormBody>
    </FormContainer>
  );
};

export default NewLinkForm;