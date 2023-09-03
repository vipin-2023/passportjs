import React, {useState } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import "./registerPage.scss";
import axios from "axios";
import * as commons from "../../common/config";
import { Register } from "../../types/registrationType";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";



const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
 
 
  const [isSubmit, setIsSubmit] = useState(false);
  const initialValues = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string()
      .min(5, "Password must be at least 5 charactors")
      .required("Required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Password must match")
      .required("Required"),
  });
  
  const handleSubmit = async (value: Register) => {
    setIsSubmit(true);

    try {
      const { confirmPassword, ...rest } = value;
      const response = await axios.post(
        `${commons.baseUrl}/auth/register`,
        rest
      );
      if(response.status== 201){
        navigate("/login");
      }else{
        alert("something went wrong...")
      }
    
    } catch (error) {
      console.error("Error:", error);
    }
    setIsSubmit(false);
  };

  return (
    <div className="registration-form">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form>
          <div className="form-group">
            <label htmlFor="name">name</label>
            <Field id="name" type="name" name="name" />
            <ErrorMessage
              name="name"
              component="div"
              className="error-message"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">email</label>
            <Field id="email" type="email" name="email" />
            <ErrorMessage
              name="email"
              component="div"
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
          <div className="form-group">
            <label htmlFor="confirm-password">Confirm password</label>
            <Field
              id="confirm-password"
              type="password"
              name="confirmPassword"
            />
            <ErrorMessage
              name="confirmPassword"
              component="div"
              className="error-message"
            />
          </div>
          <button type="submit" disabled={isSubmit}>
            {isSubmit ? "Registering..." : "Register"}
          </button>
          <h4>
            already user? <Link to="/login">Login</Link>
          </h4>
        </Form>
      </Formik>
    </div>
  );
};

export default RegisterPage;
