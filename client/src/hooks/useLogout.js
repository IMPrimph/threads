import { useSetRecoilState } from "recoil";
import { userAtom } from "../atoms/userAtom";
import showToast from "./showToast";
import { useNavigate } from "react-router-dom";

const useLogout = () => {
  const toast = showToast();
  const setUserState = useSetRecoilState(userAtom);
  const navigate = useNavigate();

  const logout = async () => {
    try {
      const res = await fetch("/api/users/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (data.error) {
        toast("Error", data.error, "error");
        console.log(data.error);
        return;
      }

      localStorage.removeItem("user-threads");
      setUserState(null);
    } catch (error) {
      console.log(error);
      toast("Error", error, "error");
    } finally {
        navigate('/auth')
    }
  };
  return logout;
};

export default useLogout;
