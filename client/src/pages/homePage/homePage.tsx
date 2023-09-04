import React, { useEffect, useState } from "react";
import "./homePage.scss";
import * as commons from "../../common/config";
import { useAuth } from "../../context/authContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const HomePage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const user = useAuth();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [data, setData] = useState<any[]>([]);

  const refreshTokenBuffer = 24 * 60 * 60 * 1000;
  const refreshTokenInterval = 13 * 60 * 1000; // 13 minutes

  useEffect(() => {
    setIsLoading(true);
    checkTokenValidity();
    setIsLoading(false);
  }, []);

  const checkTokenValidity = async () => {
    const accessTokenFromLocalStorage = localStorage.getItem("accessToken");
    const accessTokenExpirationFromLocalStorage = localStorage.getItem(
      "accessTokenExpiration"
    );
    const refreshTokenExpirationFromLocalStorage = localStorage.getItem(
      "refreshTokenExpiration"
    );

    if (
      accessTokenFromLocalStorage &&
      accessTokenExpirationFromLocalStorage &&
      refreshTokenExpirationFromLocalStorage
    ) {
      const currentTime = new Date().getTime();
      const refreshTokenExpiration = parseInt(
        refreshTokenExpirationFromLocalStorage,
        10
      );
      

      if (currentTime + refreshTokenInterval > refreshTokenExpiration) {
        console.log("7d")
        logoutUser();
        return;
      }

      const accessTokenExpiration = parseInt(
        accessTokenExpirationFromLocalStorage,
        10
      );
      console.log(currentTime > (refreshTokenExpiration- refreshTokenBuffer ))
      console.log(currentTime<accessTokenExpiration)
      console.log(currentTime<refreshTokenExpiration)
      
      console.log(currentTime)
      console.log(refreshTokenExpiration)
      console.log(accessTokenExpiration)

      if (currentTime > (refreshTokenExpiration- refreshTokenBuffer )) {
        console.log("near 7d")

       
        await getTokens(true);
      } else if (currentTime < accessTokenExpiration) {
        console.log("15")
       
        await getTokens(false);
      }
      await fetchData();
      
    } else {
      logoutUser();
    }
  };

  const getTokens = async (isRenew: boolean = false) => {
    try {
      const apiUrl = `${commons.baseUrl}/auth/refresh-token?isRenew=${isRenew}`;
      const response = await axios.post(apiUrl, {}, { withCredentials: true });
      const { accessToken } = response.data;
      localStorage.setItem("accessToken", accessToken);
      setAccessToken(accessToken);

      // Schedule the next token refresh
      setTimeout(() => getTokens(true), refreshTokenInterval);
    } catch (error) {
      console.error("Error refreshing access token:", error);
      logoutUser();
    }
  };

  const fetchData = async () => {
    if(accessToken){

    console.log("accessToken.....")
    const apiUrl = `${commons.baseUrl}/todo/${user?.user?._id}?page=${page}`;
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    try {
      const response = await axios.get(apiUrl, config);
      setData(response.data.todos);
    } catch (error) {
      console.error("Error fetching data:", error);
     
    }}
  };

  const logoutUser = () => {
   
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="todo-list">
      <div className="form-group">
        <input type="text" />
        <button> Add</button>
      </div>
      <div className="list-group">
        {data.map((item: any) => (
          <div key={item._id} className="todo-item">
            <div
              className={
                item.isDone ? "itemchek-circle" : "itemNotcheck-circle"
              }
            ></div>
            <div className="todo">{item.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
