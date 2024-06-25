import { useRecoilValue } from "recoil"
import LoginCard from "../components/Login"
import SignupCard from "../components/SignUp"
import { authScreenAtom } from "../atoms/authAtom"

const AuthPage = () => {
    const authScreenState = useRecoilValue(authScreenAtom)
    return (
        <>
            {authScreenState === 'login' ? <LoginCard /> : <SignupCard />}
        </>
    )
}

export default AuthPage