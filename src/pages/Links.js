

import React, { useEffect, useState } from "react";
import { Table, Button, Input, Space, message, Modal } from "antd";
import { CopyOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
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
    left: ${(props) => (props.isVisible ? "0" : "-100%")};
    top: 0;
    bottom: 0;
    z-index: 1000;
    transition: left 0.3s;
    overflow-y: auto;
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
    margin-bottom: 15px;
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  @media (max-width: 768px) {
    width: 100%;
    flex-direction: column;
    gap: 12px;
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
    padding: 5px;
  }
`;

const SearchInput = styled.input`
  border: none;
  outline: none;
  font-size: 14px;
  flex-grow: 1;
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
    padding: 12px;
    font-size: 14px;
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

const UrlTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState("");
  const [selectedUrl, setSelectedUrl] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");
  const [analyticsData, setAnalyticsData] = useState(null);
  const [urlsData, setUrlsData] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear token
    navigate("/login"); // Redirect to login page (or wherever you want)
  };

  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  const handleSearch = async (query) => {
    try {
      setIsSearching(true);
      const response = await axios.get("http://localhost:8000/api/v1/url/search", {
        params: { query: query },
        headers: { Authorization: `Bearer ${token}` }
      });
      setSearchResults(response.data.results);
    } catch (error) {
      message.error("Failed to search URLs");
    } finally {
      setIsSearching(false);
    }
  };

  const debouncedSearch = debounce(handleSearch, 300);

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
            headers: { Authorization: `Bearer ${token}`},
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
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      debouncedSearch(searchQuery);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  useEffect(() => {
    const fetchUrls = async (page) => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:8000/api/v1/url/urls?page=${page}&limit=5`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setData(response.data.urls);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        message.error("Failed to fetch URLs");
      }
      setLoading(false);
    };

    fetchUrls(page);
  }, [page, token]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(`http://localhost:8000/api/v1/url/${text}`);
    message.success("Link Copied!");
  };

  const handleAction = (type, url) => {
    setModalType(type);
    setSelectedUrl(url);
    setIsModalVisible(true);
  };

  const handleModalOk = async () => {
    try {
      if (modalType === "edit") {
        const response = await axios.put(
          `http://localhost:8000/api/v1/url/edit/${selectedUrl.shortUrl}`,
          {
            originalUrl: selectedUrl.originalUrl,
            remark: selectedUrl.remark,
            expiresAt: selectedUrl.expiresAt,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setData(prev => prev.map(url => 
          url.shortUrl === selectedUrl.shortUrl ? response.data.url : url
        ));
        message.success("URL Updated!");
      } else if (modalType === "delete") {
        await axios.delete(
          `http://localhost:8000/api/v1/url/delete/${selectedUrl.shortUrl}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setData(prev => prev.filter(url => url.shortUrl !== selectedUrl.shortUrl));
        message.success("URL Deleted!");
      }
    } catch (error) {
      message.error(`Failed to ${modalType} URL`);
    }
    setIsModalVisible(false);
  };

  const handleModalCancel = () => setIsModalVisible(false);

  const handleLinkClick = (url) => {
    const isExpired = new Date(url.expiresAt) < new Date();
    if (isExpired) {
      message.error("This link is not active.");
      return; // Prevent redirection and click count increment
    }
    // Redirect to the link if it's active
    window.open(`http://localhost:8000/api/v1/url/${url.shortUrl}`, "_blank");
    // Optionally, you can also increment the click count here if needed
  };

  const columns = [
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      render: (text) => new Date(text).toLocaleString(),
      responsive: ['md'],
    },
    {
      title: "Original Link",
      dataIndex: "originalUrl",
      key: "originalUrl",
      render: (text) => (
        <a 
          href={text} 
          target="_blank" 
          rel="noopener noreferrer"
          style={{
            display: 'block',
            maxWidth: '200px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {text}
        </a>
      ),
    },
    {
      title: "Short Link",
      dataIndex: "shortUrl",
      key: "shortUrl",
      render: (text, record) => (
        <Space>
          <a 
            onClick={() => handleLinkClick(record)} // Use the new click handler
            style={{ 
              maxWidth: '120px', 
              overflow: 'hidden', 
              textOverflow: 'ellipsis', 
              cursor: 'pointer' 
            }}
          >
            {text}
          </a>
          <Button 
            icon={<CopyOutlined />} 
            onClick={() => copyToClipboard(text)}
            size="small"
          />
        </Space>
      ),
    },
    {
      title: "Remarks",
      dataIndex: "remark",
      key: "remark",
      responsive: ['md'],
      render: (text) => <span style={{ maxWidth: '150px', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis' }}>{text}</span>
    },
    {
      title: "Clicks",
      dataIndex: "clicks",
      key: "clicks",
      align: 'center',
      responsive: ['sm'],
    },
    {
      title: "Status",
      dataIndex: "expiresAt",
      key: "expiresAt",
      render: (expiresAt) => (
        <span style={{ 
          color: new Date(expiresAt) < new Date() ? "#ff4d4f" : "#52c41a",
          whiteSpace: 'nowrap'
        }}>
          {new Date(expiresAt) < new Date() ? "Expired" : "Active"}
        </span>
      ),
      responsive: ['md'],
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button 
            icon={<EditOutlined />} 
            onClick={() => handleAction("edit", record)}
            size="small"
          />
          <Button 
            icon={<DeleteOutlined />} 
            onClick={() => handleAction("delete", record)}
            size="small"
            danger
          />
        </Space>
      ),
    },
  ];

 
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
        <SidebarItem onClick={() => navigate("/dashboard")}>📊 Dashboard</SidebarItem>
        <SidebarItem onClick={() => navigate("/linkspage")}>🔗 Links</SidebarItem>
        <SidebarItem onClick={() => navigate("/analytics")}>📈 Analytics</SidebarItem>
        <SidebarItem onClick={() => navigate("/settings")}>⚙️ Settings</SidebarItem>
      </Sidebar>

      <MainContent>
        <TopBar>
          <div>
            <HamburgerButton onClick={() => setIsSidebarVisible(!isSidebarVisible)}>
              ☰
            </HamburgerButton>
            <h3 style={{ margin: 0 }}>{getTimeOfDayGreeting()}, {userData?.name}</h3>
            <small>{dayjs().format("ddd, MMM D")}</small>
          </div>
          <RightSection>
            <CreateButton onClick={() => navigate("/newlink")}>
              <FaPlus /> Create new
            </CreateButton>
            <SearchBar>
              <FaSearch style={{ color: '#666' }} />
              <SearchInput 
                placeholder="Search by remarks" 
                onChange={(e) => setSearchQuery(e.target.value)}
                value={searchQuery}
              />
            </SearchBar>
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

        {isSearching && (
          <div style={{ padding: 16, textAlign: 'center', color: '#666' }}>
            Searching links...
          </div>
        )}

        <Table
          columns={columns}
          dataSource={searchQuery.trim() ? searchResults : data}
          rowKey="_id"
          loading={loading || isSearching}
          scroll={isMobile ? { x: true } : undefined}
          pagination={!searchQuery.trim() && {
            current: page,
            total: totalPages * 5,
            pageSize: 5,
            onChange: (p) => setPage(p),
            responsive: true,
            showSizeChanger: false,
          }}
          size={isMobile ? "small" : "middle"}
        />

        <Modal
          title={modalType === "edit" ? "Edit URL" : "Delete URL"}
          open={isModalVisible}
          onCancel={handleModalCancel}
          width={isMobile ? '90%' : 520}
          footer={[
            <Button key="back" onClick={handleModalCancel}>
              Cancel
            </Button>,
            <Button 
              key="submit" 
              type="primary" 
              onClick={handleModalOk}
              danger={modalType === 'delete'}
            >
              {modalType === 'edit' ? 'Update' : 'Delete'}
            </Button>,
          ]}
        >
          {modalType === "edit" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", padding: '8px 0' }}>
              <Input
                placeholder="Original URL"
                value={selectedUrl?.originalUrl || ""}
                onChange={(e) => setSelectedUrl(prev => ({ ...prev, originalUrl: e.target.value }))}
                size={isMobile ? "small" : "middle"}
              />
              <Input
                placeholder="Remark"
                value={selectedUrl?.remark || ""}
                onChange={(e) => setSelectedUrl(prev => ({ ...prev, remark: e.target.value }))}
                size={isMobile ? "small" : "middle"}
              />
              <Input
                type="datetime-local"
                value={selectedUrl?.expiresAt ? new Date(selectedUrl.expiresAt).toISOString().slice(0, 16) : ""}
                onChange={(e) => setSelectedUrl(prev => ({ ...prev, expiresAt: e.target.value }))}
                size={isMobile ? "small" : "middle"}
              />
            </div>
          ) : (
            <p style={{ margin: 0 }}>Are you sure you want to delete this URL?</p>
          )}
        </Modal>
      </MainContent>
    </Container>
  );
};

export default UrlTable;