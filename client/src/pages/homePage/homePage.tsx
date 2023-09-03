import React, { useEffect, useState } from "react";
import "./homePage.scss";

import * as commons from "../../common/config";
import { useAuth } from "../../context/authContext";
import axios from "axios";

const HomePage: React.FC = () => {
  const user = useAuth();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const userFromLocalStorage = localStorage.getItem('accessToken');
    if (userFromLocalStorage) {
      setAccessToken(userFromLocalStorage);
    }
  }, []);

  useEffect(() => {
    if (accessToken) {
      const page = 1;
      const apiUrl = `${commons.baseUrl}/todo/${user?.user?._id}?page=${page}`;

      const config = {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      };

      axios.get(apiUrl, config)
        .then((response) => {
          // Handle the API response here
          setData(response.data.todos);
          console.log(response.data.todos);
        })
        .catch((error) => {
          // Handle any errors here
          console.error('Error:', error);
        });
    }
  }, [accessToken, user?.user?._id]);
  

  return (
    <div className="todo-list">
      <div className="form-group">
        <input type="text" />
        <button> Add</button>
      </div>
      <div className="list-group">
        {data.map((item: any) => (
            
          <div key={item._id} className="todo-item">
            <div className={item.isDone?"itemchek-circle":"itemNotcheck-circle"}></div>
            <div className="todo">{item.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
