import { useEffect, useState } from "react";
import http from "../helpers/http";
import { NavLink, useNavigate } from "react-router";

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
          <svg
            className="h-[1em] opacity-50"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <g
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2.5"
              fill="none"
              stroke="currentColor"
            >
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </g>
          </svg>
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
          <svg
            className="h-[1em] opacity-50"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <g
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2.5"
              fill="none"
              stroke="currentColor"
            >
              <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
              <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
            </g>
          </svg>
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
