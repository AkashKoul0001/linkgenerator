import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import dayjs from "dayjs";

const Container = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f9f9f9;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Sidebar = styled.div`
  width: 250px;
  background: white;
  padding: 20px;
  border-right: 1px solid #ddd;
  display: flex;
  flex-direction: column;
  gap: 15px;
  @media (max-width: 768px) {
    width: 100%;
    position: fixed;
    left: ${props => props.isVisible ? '0' : '-100%'};
    top: 0;
    bottom: 0;
    z-index: 1000;
    transition: left 0.3s;
    overflow-y: auto;
  }
`;

const HamburgerButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 24px;
  padding: 10px;
  @media (max-width: 768px) {
    display: block;
  }
`;

const SidebarItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  cursor: pointer;
  color: #333;
  background: ${props => props.active ? '#eef1ff' : 'none'};
  border-radius: 5px;
  &:hover {
    background: #eef1ff;
  }
  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const Checkbox = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid #1b48da;
  border-radius: 3px;
  background: ${props => props.checked ? '#1b48da' : 'white'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const MainContent = styled.div`
  flex-grow: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  @media (max-width: 768px) {
    padding: 15px;
    padding-top: 70px;
  }
`;

const ProfileSection = styled.div`
  width: 100%;
  max-width: 400px;
`;

const ProfileHeader = styled.div`
  margin-bottom: 20px;
  h3 {
    margin: 0;
    font-size: 1.5rem;
  }
  small {
    color: #666;
  }
    @media (max-width: 768px) {
    flex-direction: row; 
    align-items: center; 
    gap: 10px; 
  }
`;

const ProfileForm = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  label {
    font-weight: 500;
    color: #666;
  }
  input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 16px;
    &:disabled {
      background: #f5f5f5;
      color: #666;
    }
  }
`;

const ActionButton = styled.button`
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  background: ${props => props.danger ? '#ff4d4f' : '#1b48da'};
  color: white;
  transition: background 0.2s;
  &:hover {
    background: ${props => props.danger ? '#ff7875' : '#153bb3'};
  }
`;

const Settings = () => {
  const [user, setUser] = useState({ name: "", email: "", mobile: "" });
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    axios.get("http://localhost:8000/api/v1/users/profile", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => {
      const userData = response.data.user;
      setUser(userData);
    })
    .catch(() => alert("Failed to fetch user data"));
  }, [token]);

  const handleUpdate = () => {
    axios.put("http://localhost:8000/api/v1/users/update", user, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => alert("Profile updated successfully!"))
    .catch(() => alert("Failed to update profile"));
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete your account?")) {
      axios.delete("http://localhost:8000/api/v1/users/delete", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(() => {
        localStorage.removeItem("token");
        navigate("/login");
      })
      .catch(() => alert("Failed to delete account"));
    }
  };


  const getTimeOfDayGreeting = () => {
    const currentHour = dayjs().hour(); // Get current hour
    if (currentHour >= 5 && currentHour < 12) {
      return "☀️ Good morning";
    } else if (currentHour >= 12 && currentHour < 17) {
      return "☀️ Good afternoon";
    } else if (currentHour >= 17 && currentHour < 21) {
      return "🌙 Good evening";
    } else {
      return "🌙 Good night";
    }
  };

  return (
    <Container>
      <Sidebar isVisible={isSidebarVisible}>
        <h2>Cuvette</h2>
        <HamburgerButton onClick={() => setIsSidebarVisible(false)}>
          ×
        </HamburgerButton>
        <SidebarItem onClick={() => navigate("/dashboard")}>📊 Dashboard</SidebarItem>
        <SidebarItem onClick={() => navigate("/linkspage")}>🔗 Links</SidebarItem>
        <SidebarItem onClick={() => navigate("/analytics")}>📈 Analytics</SidebarItem>
        <SidebarItem onClick={() => navigate("/settings")}>⚙️ Settings</SidebarItem>
      </Sidebar>

      <MainContent>
        <HamburgerButton onClick={() => setIsSidebarVisible(!isSidebarVisible)}>
          ☰
        </HamburgerButton>
        
        <ProfileSection>
          <ProfileHeader>
            <h3>{getTimeOfDayGreeting()}, {user.name}</h3>
            <small>{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</small>
          </ProfileHeader>

          <ProfileForm>
            <FormField>
              <label>Name</label>
              <input
                type="text"
                value={user.name}
                onChange={(e) => setUser({...user, name: e.target.value})}
              />
            </FormField>

            <FormField>
              <label>Email Id</label>
              <input
                type="email"
                value={user.email}
                disabled
              />
            </FormField>

            <FormField>
              <label>Mobile no.</label>
              <input
                type="tel"
                value={user.mobile}
                onChange={(e) => setUser({...user, mobile: e.target.value})}
              />
            </FormField>

            <ActionButton onClick={handleUpdate}>
              Save Changes
            </ActionButton>
            <ActionButton danger onClick={handleDelete}>
              Delete Account
            </ActionButton>
          </ProfileForm>
        </ProfileSection>
      </MainContent>
    </Container>
  );
};

export default Settings;