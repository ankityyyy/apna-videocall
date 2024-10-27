import axios from "axios";
import { createContext, useContext, useReducer } from "react";
import { useNavigate } from "react-router-dom";

// Initial state for the reducer
const initialState = {
  userData: {},
};

// Reducer function to manage state updates
const authReducer = (state, action) => {
  switch (action.type) {
    case "REGISTER_SUCCESS":
      return {
        ...state,
        userData: action.payload,
      };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        userData: action.payload,
      };
    default:
      return state;
  }
};

// Create context
export const AuthContext = createContext({});

// Axios client
const client = axios.create({
  baseURL: "http://localhost:3002/api/v1/users",
});

export const AuthProvider = ({ children }) => {
  const router = useNavigate();
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Handle user registration
  const handleRegister = async (name, username, password) => {
    try {
      let request = await client.post("/register", {
        name,
        userName: username,
        password,
      });

      if (request.status === 201) {
        dispatch({ type: "REGISTER_SUCCESS", payload: request.data });
        return request.data.message;
      }
    } catch (err) {
      throw err;
    }
  };

  // Handle user login
  const handleLogin = async (username, password) => {
    try {
      let request = await client.post("/login", {
        userName: username,
        password,
      });

      if (request.status === 200) {
        localStorage.setItem("token", request.data.token);
        dispatch({ type: "LOGIN_SUCCESS", payload: request.data });
        router("/home");
      }
    } catch (err) {
      throw err;
    }
  };

  // Get user's activity history
  const getHistoryOfUser = async () => {
    try {
      let request = await client.get("/get_all_activity", {
        params: {
          token: localStorage.getItem("token"),
        },
      });
      return request.data;
    } catch (err) {
      throw err;
    }
  };

  // Add activity to user's history
  const addToUserHistory = async (meetingCode) => {
    try {
      let request = await client.post("/add_to_activity", {
        token: localStorage.getItem("token"),
        meeting_code: meetingCode,
      });
      return request;
    } catch (err) {
      throw err;
    }
  };

  // Data and methods passed through the context
  const data = {
    userData: state.userData,
    handleRegister,
    handleLogin,
    getHistoryOfUser,
    addToUserHistory,
  };

  return <AuthContext.Provider value={data}>{children}</AuthContext.Provider>;
};
