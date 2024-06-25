import { Button, Text } from "@chakra-ui/react"
import showToast from "../hooks/showToast";
import useLogout from "../hooks/useLogout";

const SettingsPage = () => {
    const toast = showToast();
    const logout = useLogout();

    const freezeAccount = async() => {
        if (!window.confirm('Are you sure you want to freeze your account?')) return;

        try {
            const res = await fetch('/api/users/freeze', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await res.json();

            if (data.error) {
                toast('Error', data.error, 'error');
                return;
            }

            if (data.success) {
                await logout();
                toast('Success', 'Your account has been freezen', 'success');
            }

        } catch (error) {
            toast('Error', error.message, 'error');
        }
    }

    return (
        <>
            <Text my={1} fontWeight={'bold'}>
                Freeze Your Account
            </Text>
            <Text my={1}>You can unfreeze your account anytime by logging in</Text>
            <Button size={'sm'} colorScheme="red" onClick={freezeAccount}>
                Freeze
            </Button>
        </>
    )
}

export default SettingsPage