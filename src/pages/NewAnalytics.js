
import React, { useEffect, useState } from "react";
import { Table, Input, Space, message } from "antd";
import axios from "axios";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaSearch } from "react-icons/fa";
import dayjs from "dayjs";

// Styled Components
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

const SidebarItem = styled.button`
  background: none;
  border: none;
  text-align: left;
  font-size: 16px;
  padding: 10px;
  cursor: pointer;
  color: #333;
  display: flex;
  align-items: center;
  gap: 10px;
  &:hover {
    background: #eef1ff;
    border-radius: 5px;
  }
  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const MainContent = styled.div`
  flex-grow: 1;
  padding: 20px;
  @media (max-width: 768px) {
    padding: 15px;
    padding-top: 70px;
  }
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background: white;
  border-radius: 5px;
  padding: 5px 10px;
  gap: 10px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const SearchInput = styled.input`
  border: none;
  outline: none;
  font-size: 14px;
  @media (max-width: 768px) {
    font-size: 13px;
  }
`;

const CreateButton = styled.button`
  background: #1b48da;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #153bb3;
  }
  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

const UserAvatar = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #f0f2f5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  @media (max-width: 768px) {
    width: 28px;
    height: 28px;
    font-size: 14px;
  }
`;

const RightSection = styled(Space)`
  @media (max-width: 768px) {
    width: 100%;
    .ant-space-item {
      width: 100%;
    }
  }
`;

const DropdownWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const DropdownButton = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #f0f2f5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  cursor: pointer;
`;

const DropdownMenu = styled.div`
  position: absolute;
  right: 0;
  top: 40px;
  background-color: white;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  min-width: 200px;
  z-index: 999;
`;

const DropdownItem = styled.div`
  padding: 12px 15px;
  font-size: 14px;
  cursor: pointer;
  color: #333;
  &:hover {
    background-color: #eef1ff;
    border-radius: 5px;
  }
`;

const ClickLogsTable = () => {
  const [clickLogs, setClickLogs] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [error, setError] = useState(""); 
  const [analyticsData, setAnalyticsData] = useState(null);
  const [urlsData, setUrlsData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear token
    navigate("/login"); // Redirect to login page (or wherever you want)
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileResponse = await axios.get(
          "http://localhost:8000/api/v1/users/profile",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUserData(profileResponse.data.user);

        const [urlsResponse, clickLogsResponse] = await Promise.all([
          axios.get("http://localhost:8000/api/v1/url/urls?page=1&limit=10", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:8000/api/v1/url/click-logs", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setUrlsData(urlsResponse.data.urls);
        setAnalyticsData(clickLogsResponse.data);
      } catch (err) {
        setError("Failed to fetch data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch user profile
        const profileResponse = await axios.get(
          "http://localhost:8000/api/v1/users/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserData(profileResponse.data.user);

        // Fetch click logs
        const clickLogsResponse = await axios.get(
          "http://localhost:8000/api/v1/url/click-logs",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        // Use analytics array from response
        const logs = clickLogsResponse.data?.analytics || [];
        setClickLogs(logs);
        
      } catch (error) {
        message.error("Failed to fetch data");
        setClickLogs([]);
      } finally {
        setLoading(false);
      }
    };

    if(token) {
      fetchData();
    } else {
      navigate("/login");
    }
  }, [token, navigate]);

  const filteredData = clickLogs.filter(log =>
    log.shortUrl?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    {
      title: "Timestamp",
      dataIndex: "createdAt",
      key: "timestamp",
      render: (text) => text ? dayjs(text).format("MMM D, YYYY HH:mm") : 'N/A',
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      responsive: ['md'],
    },
    {
      title: "Short Link",
      dataIndex: "shortUrl",
      key: "shortUrl",
      render: (text) => (
        <a 
          href={`http://localhost:8000/${text}`} 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ maxWidth: '120px', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
        >
          {text}
        </a>
      ),
    },
    {
      title: "IP Address",
      dataIndex: "ipAddress",
      key: "ipAddress",
      render: (text) => text || 'N/A',
      responsive: ['sm'],
    },
    {
      title: "Device Type",
      dataIndex: "deviceType",
      key: "os",
      render: (text) => (
        <span style={{ maxWidth: '100px', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {text || 'Unknown'}
        </span>
      ),
      responsive: ['lg'],
    },
  ];

  const handleSearch2 = (event) => {
    if (event.target.value.trim() === "") return;
    if (event.key === 'Enter' || event.type === 'click') {
      // When the Enter key is pressed, navigate to the search page
      navigate("/linkspage");
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
        <TopBar>
          <div style={{ flex: 1 }}>
            <HamburgerButton onClick={() => setIsSidebarVisible(!isSidebarVisible)}>
              ☰
            </HamburgerButton>
            <h3 style={{ margin: 0 }}>{getTimeOfDayGreeting()}, {userData?.name || "User "}</h3>
            <small style={{ color: '#666' }}>{dayjs().format("ddd, MMM D")}</small>
          </div>
          <RightSection>
            <SearchBar>
              <FaSearch style={{ color: '#666' }} />
              <SearchInput
                placeholder="Search by short URL"
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch2}
                onClick={handleSearch2}
              />
            </SearchBar>
            <CreateButton onClick={() => navigate("/create")}>
              <FaPlus /> Create new
            </CreateButton>
            <DropdownWrapper>
              <DropdownButton onClick={toggleDropdown}>
                {userData?.name?.[0]?.toUpperCase() || "U"}
              </DropdownButton>
              {isOpen && (
                <DropdownMenu>
                  <DropdownItem onClick={handleLogout}>Logout</DropdownItem>
                </DropdownMenu>
              )}
            </DropdownWrapper>
          </RightSection>
        </TopBar>

        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="_id"
          loading={loading}
          scroll={{ x: true }}
          size={isMobile ? "small" : "middle"}
          pagination={{
            pageSizeOptions: ["10", "20", "50"],
            showSizeChanger: true,
            responsive: true,
          }}
        />
      </MainContent>
    </Container>
  );
};

export default ClickLogsTable;