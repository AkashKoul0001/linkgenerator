import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaSearch, FaBars,  FaTimes } from "react-icons/fa";
import axios from "axios";
import dayjs from "dayjs";




const Container = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f9f9f9;
  position: relative;

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
  position: sticky;
  top: 0;
  height: 100vh;

  @media (max-width: 768px) {
    position: fixed;
    left: ${props => props.isOpen ? '0' : '-100%'};
    top: 0;
    bottom: 0;
    width: 80%;
    max-width: 300px;
    z-index: 1000;
    transition: left 0.3s ease;
    box-shadow: ${props => props.isOpen ? '2px 0 10px rgba(0,0,0,0.1)' : 'none'};
  }
`;

const SidebarItem = styled.button`
  background: none;
  border: none;
  text-align: left;
  font-size: 16px;
  padding: 12px;
  cursor: pointer;
  color: #333;
  display: flex;
  align-items: center;
  gap: 10px;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: #eef1ff;
  }

  @media (max-width: 768px) {
    padding: 15px;
  }
`;

const MainContent = styled.div`
  flex: 1;
  padding: 30px 40px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 20px;
    margin-top: 50px;
  }
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 15px;

  @media (max-width: 768px) {
    margin-bottom: 20px;
  }
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background: white;
  border-radius: 8px;
  padding: 8px 15px;
  gap: 10px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
  flex: 1;
  max-width: 400px;

  @media (max-width: 768px) {
    width: 100%;
    max-width: none;
  }
`;

const StatCard = styled.div`
  background: white;
  padding: 20px;
  flex: 1;
  border-radius: 10px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
  min-width: 300px;

  @media (max-width: 768px) {
    width: 100%;
    min-width: unset;
  }

  h4 {
    margin-bottom: 15px;
  }

  div {
    display: flex;
    align-items: center;
    margin-top: 10px;
  }

  p {
    font-size: 14px;
    margin: 0;
  }

  /* For Bar element */
  .bar-container {
    display: flex;
    align-items: center;
    width: 100%; /* ensures that the container takes full width */
  }

  .bar {
    height: 8px;
    background-color: #1b48da;
    border-radius: 5px;
    margin: 0 10px;  /* Margin between the text and bar */
    flex-grow: 1;
  }

  .count {
    margin-left: 10px;
    font-size: 14px;
  }
`;

const Bar = styled.div`
  height: 8px;
  background-color: #1b48da;
  border-radius: 5px;
  width: ${(props) => (props.width > 100 ? 100 : props.width)}%; /* Max width of 100% */
  margin-left: 10px;
  flex-grow: 1; /* Allows the bar to fill available space */
`;









// const Container = styled.div`
//   display: flex;
//   min-height: 100vh;
//   background-color: #f9f9f9;
//   flex-wrap: wrap;
//   justify-content: center; /* Center content */
// `;

// const Sidebar = styled.div`
//   width: 250px;
//   background: white;
//   padding: 20px;
//   border-right: 1px solid #ddd;
//   display: flex;
//   flex-direction: column;
//   gap: 15px;

//   @media (max-width: 768px) {
//     display: ${(props) => (props.isOpen ? "flex" : "none")};
//     position: absolute;
//     left: 0;
//     top: 0;
//     bottom: 0;
//     width: 200px;
//     z-index: 999;
//     padding: 10px;
//   }
// `;

// const SidebarItem = styled.button`
//   background: none;
//   border: none;
//   text-align: left;
//   font-size: 16px;
//   padding: 10px;
//   cursor: pointer;
//   color: #333;
//   display: flex;
//   align-items: center;
//   gap: 10px;
//   &:hover {
//     background: #eef1ff;
//     border-radius: 5px;
//   }
// `;

// const MainContent = styled.div`
//   flex-grow: 1;
//   padding: 20px;
//   margin-left: 250px;
//   transition: margin-left 0.3s ease;
//   max-width: 1200px;
//   width: 100%; /* Ensuring it doesn't stretch too much */

//   @media (max-width: 768px) {
//     margin-left: 0;
//     padding: 15px;
//   }
// `;

// const TopBar = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   margin-bottom: 20px;

//   @media (max-width: 768px) {
//     flex-direction: column;
//     align-items: flex-start;
//     gap: 15px;
//   }
// `;

// const SearchBar = styled.div`
//   display: flex;
//   align-items: center;
//   background: white;
//   border-radius: 5px;
//   padding: 5px 10px;
//   gap: 10px;
//   box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);

//   @media (max-width: 768px) {
//     width: 100%;
//   }
// `;



const HamburgerButton = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: block;
    position: fixed;
    left: 15px;
    top: 15px;
    z-index: 1100;
    background: white;
    padding: 10px;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  }
`;

const Overlay = styled.div`
  display: ${props => props.visible ? 'block' : 'none'};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.3);
  z-index: 999;
`;

const SearchInput = styled.input`
  border: none;
  outline: none;
  font-size: 14px;
  width: 100%;
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
  &:hover {
    background: #153bb3;
  }

  @media (max-width: 768px) {
    padding: 8px 12px;
  }
`;

const StatContainer = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 15px;
  }
`;

// const StatCard = styled.div`
//   background: white;
//   padding: 20px;
//   flex: 1;
//   border-radius: 10px;
//   box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
//   min-width: 300px;

//   @media (max-width: 768px) {
//     width: 100%;
//     min-width: unset;
//   }
// `;

const Dropdown = styled.div`
  position: relative;
  display: inline-block;
`;

const DropdownContent = styled.div`
  display: ${(props) => (props.isOpen ? "block" : "none")};
  position: absolute;
  right: 0;
  background-color: white;
  min-width: 160px;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
  z-index: 1;
  border-radius: 5px;
  padding: 10px 0;

  & > button {
    background: none;
    border: none;
    padding: 10px 20px;
    width: 100%;
    text-align: left;
    cursor: pointer;
    color: #333;
    &:hover {
      background: #eef1ff;
      border-radius: 5px;
    }
  }
`;

// const HamburgerButton = styled.div`
//   display: none;
//   @media (max-width: 768px) {
//     display: block;
//     cursor: pointer;
//     font-size: 24px;
//   }
// `;

const Dashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [urlsData, setUrlsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const token = localStorage.getItem("token");

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const processDeviceData = () => {
    const devices = { Mobile: 0, Desktop: 0, Tablet: 0 };
    analyticsData?.analytics?.forEach((log) => {
      const deviceType = log.deviceType.toLowerCase();
      if (deviceType.includes("mobile")) devices.Mobile++;
      else if (deviceType.includes("desktop")) devices.Desktop++;
      else if (deviceType.includes("tablet")) devices.Tablet++;
      else devices.Mobile++; // Default to mobile
    });
    return devices;
  };

  const processDateData = () => {
    const dateCounts = {};
    analyticsData?.analytics?.forEach((log) => {
      const date = dayjs(log.createdAt).format("YY-MM-DD");
      dateCounts[date] = (dateCounts[date] || 0) + 1;
    });
    return Object.entries(dateCounts)
      .sort((a, b) => b[0].localeCompare(a[0]))
      .slice(0, 4);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const deviceData = processDeviceData();
  const dateData = processDateData();

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
       <HamburgerButton onClick={() => setSidebarOpen(!sidebarOpen)}>
      {sidebarOpen ? <FaTimes /> : <FaBars />}
    </HamburgerButton>
      {/* <HamburgerButton onClick={() => setSidebarOpen(!sidebarOpen)}>
        <FaBars />
      </HamburgerButton> */}
      <Sidebar isOpen={sidebarOpen}>
        <h2>Cuvette</h2>
        <SidebarItem onClick={() => navigate("/dashboard")}>📊 Dashboard</SidebarItem>
        <SidebarItem onClick={() => navigate("/linkspage")}>🔗 Links</SidebarItem>
        <SidebarItem onClick={() => navigate("/analytics")}>📈 Analytics</SidebarItem>
        <SidebarItem onClick={() => navigate("/settings")}>⚙️ Settings</SidebarItem>
      </Sidebar>
      <MainContent>
        <TopBar>
          <div>
            <h3>{getTimeOfDayGreeting()}, {userData?.name || "User"}</h3>
            <small>{dayjs().format("ddd, MMM D")}</small>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <CreateButton onClick={() => navigate("/newlink")}>
              <FaPlus /> Create new
            </CreateButton>
            <SearchBar>
              <FaSearch />
              <SearchInput onKeyDown={handleSearch2} onClick={handleSearch2} placeholder="Search by remarks" />
            </SearchBar>
            <Dropdown>
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  background: "#f0f2f5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 500,
                  cursor: "pointer",
                }}
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {userData?.name?.[0]?.toUpperCase() || "U"}
              </div>
              <DropdownContent isOpen={dropdownOpen}>
                <button onClick={handleLogout}>Logout</button>
              </DropdownContent>
            </Dropdown>
          </div>
        </TopBar>

        <h3>
          Total Clicks: <span style={{ color: "blue" }}>{analyticsData?.totalClicks || 0}</span>
        </h3>

        <StatContainer>
        <StatCard>
  <h4>Date-wise Clicks</h4>
  {dateData.map(([date, count]) => {
    const maxCount = Math.max(...dateData.map(([_, c]) => c)); // Get max count
    return (
      <div key={date}>
        <div className="bar-container">
          <p>{date}:</p>
          <div className="bar" style={{ width: `${(count / maxCount) * 100}%` }} />
          <p className="count">{count}</p>
        </div>
      </div>
    );
  })}
</StatCard>

<StatCard>
  <h4>Click Devices</h4>
  {Object.entries(deviceData).map(([device, count]) => {
    const maxCount = Math.max(...Object.values(deviceData)); // Get max count for devices
    return (
      <div key={device}>
        <div className="bar-container">
          <p>{device}:</p>
          <div className="bar" style={{ width: `${(count / maxCount) * 100}%` }} />
          <p className="count">{count}</p>
        </div>
      </div>
    );
  })}
</StatCard>
        </StatContainer>
      </MainContent>
    </Container>
  );
};

export default Dashboard;




