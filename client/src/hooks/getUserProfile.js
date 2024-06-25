/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import showToast from './showToast';

const getUserProfile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const { username } = useParams();
    const toast = showToast();

    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await fetch(`/api/users/profile/${username}`);
                const data = await res.json();

                if (data.error) {
                    toast('Error', data.error, 'error')
                    return;
                }

                if (data.isFrozen) {
                    setUser(null);
                    return;
                }

                setUser(data);
            } catch (error) {
                toast('Error', error, 'error')
            } finally {
                setLoading(false);
            }
        }
        getUser();
    }, [username, toast])

    return { loading, user }
}

export default getUserProfile