import { useState } from "react";
import http from "../helpers/http";
import { NavLink, useNavigate } from "react-router";
import { IoKey, IoMail, IoPersonSharp } from "react-icons/io5";

const RegisterPage = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });
  const navigate = useNavigate();

  return (
    <form
      onSubmit={async (e) => {
        try {
          e.preventDefault();

          await http({
            method: "POST",
            url: "/register",
            data: user,
          });

          navigate("/login");
        } catch (error) {
          console.error(error);
        }
      }}
      className="w-full h-dvh flex justify-center items-center"
    >
      <div className="flex flex-col bg-gray-50 p-2 rounded-xl">
        <label className="input floating-label mb-2">
          <span>First Name</span>
          <IoPersonSharp className="text-gray-500" />
          <input
            type="text"
            required
            placeholder="First Name"
            name="firstName"
            onChange={(e) =>
              setUser((value) => ({ ...value, firstName: e.target.value }))
            }
          />
        </label>

        <label className="input floating-label mb-2">
          <span>Last Name</span>
          <IoPersonSharp className="text-gray-500" />
          <input
            type="text"
            required
            placeholder="Last Name"
            name="lastName"
            onChange={(e) =>
              setUser((value) => ({ ...value, lastName: e.target.value }))
            }
          />
        </label>

        <label className="input floating-label mb-2">
          <span>Email</span>
          <IoMail className="text-gray-500" />
          <input
            type="email"
            required
            placeholder="Email"
            name="email"
            onChange={(e) =>
              setUser((value) => ({ ...value, email: e.target.value }))
            }
          />
        </label>

        <label className="input floating-label mb-3">
          <span>Password</span>
          <IoKey className="text-gray-500" />
          <input
            type="password"
            required
            placeholder="Password"
            name="password"
            onChange={(e) => {
              setUser((value) => ({ ...value, password: e.target.value }));
            }}
          />
        </label>

        <button className="btn btn-primary mb-2" type="submit">
          Sign Up
        </button>
        <div id="googleBtn"></div>

        <p className="text-xs mt-2 text-center">
          Already have account?{" "}
          <NavLink to={"/login"} className={"font-bold text-primary"}>
            Sign in.
          </NavLink>
        </p>
      </div>
    </form>
  );
};

export default RegisterPage;
