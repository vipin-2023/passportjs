import { Field, Formik, Form, ErrorMessage } from "formik";
import React, {  useState } from "react";
import * as Yup from "yup";
import { Login } from "../../types/registrationType";
import { useNavigate } from "react-router-dom";
import * as commons from "../../common/config";
import axios from "axios";
import "./loginPage.scss";
import { useAuth } from "../../context/authContext";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  
  
 
  const { login } = useAuth();
  
  const [isSubmit, setIsSubmit] = useState(false);
  const initialValues = {
    email: "",
    password: "",
  };
  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string()
      .min(5, "Password must be at least 5 charactors")
      .required("Required"),
  });

  const handleSubmit = async (value: Login) => {
    setIsSubmit(true);
    try {
      const response =await axios.post(`${commons.baseUrl}/auth/login`, value);
      if(response.status==200){
        console.log(response.data)
     
      localStorage.setItem("accessToken",response.data.accessToken)
      localStorage.setItem("accessTokenExpiration",response.data.accessTokenExpiration)
      localStorage.setItem("refreshTokenExpiration",response.data.refreshTokenExpiration)
      login(response.data.user);
      navigate("/");
      }else{
        alert("something went wrong")
      }
    } catch (error) {
      console.error("Error:", error);
    }
    setIsSubmit(false);
  };

  return (
    <div className="login-form">
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        <Form>
          <div className="form-group">
            <label htmlFor="email">email</label>
            <Field id="email" type="email" name="email" />
            <ErrorMessage
              name="email"
              componets="div"
              className="error-message"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">password</label>
            <Field id="password" type="password" name="password" />
            <ErrorMessage
              name="password"
              component="div"
              className="error-message"
            />
          </div>
          <button type="submit" disabled={isSubmit}>
            {isSubmit ? "Loging..." : "Login"}
          </button>
          
        </Form>
      </Formik>
    </div>
  );
};

export default LoginPage;
