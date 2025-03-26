import { useEffect, useState } from "react";
import http from "../helpers/http";
import { NavLink, useNavigate } from "react-router";
import { IoKey, IoMail } from "react-icons/io5";

const LoginPage = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("access_token")) {
      navigate("/");
    }
  }, []);

  async function handleCredentialResponse(response) {
    try {
      const { data } = await http({
        method: "POST",
        url: "/google-login",
        data: {
          token: response.credential,
        },
      });

      localStorage.setItem("access_token", data?.access_token);
      localStorage.getItem("access_token") !== undefined
        ? navigate("/")
        : navigate("/login");
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    // eslint-disable-next-line no-undef
    google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse,
    });
    // eslint-disable-next-line no-undef
    google.accounts.id.renderButton(
      document.getElementById("googleBtn"),
      { theme: "outline", size: "large" } // customization attributes
    );
  }, []);

  return (
    <form
      onSubmit={async (e) => {
        try {
          e.preventDefault();

          const { data } = await http({
            method: "POST",
            url: "/login",
            data: user,
          });

          localStorage.setItem("access_token", data?.access_token);
          localStorage.getItem("access_token") !== undefined
            ? navigate("/")
            : navigate("/login");
        } catch (error) {
          console.error(error);
        }
      }}
      className="w-full h-dvh flex justify-center items-center"
    >
      <div className="flex flex-col bg-gray-50 p-2 rounded-xl">
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
          Login
        </button>
        <div id="googleBtn"></div>

        <p className="text-xs mt-2 text-center">
          Don't have account?{" "}
          <NavLink to={"/register"} className={"font-bold text-primary"}>
            Sign up.
          </NavLink>
        </p>
      </div>
    </form>
  );
};

export default LoginPage;
