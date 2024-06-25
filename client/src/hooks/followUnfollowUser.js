/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from 'react'
import showToast from './showToast';
import { useRecoilValue } from 'recoil';
import { userAtom } from '../atoms/userAtom';

const followUnfollowUser = (user) => {
  const currentUser = useRecoilValue(userAtom);
  const [following, setFollowing] = useState(user.followers.includes(currentUser._id));
  const [updating, setUpdating] = useState(false);
  const toast = showToast();

  const handleFollowUnFollow = async () => {
    if (!currentUser) {
      toast('Error', 'Please login to follow/unfollow', 'error')
      return;
    }

    if (updating) return;

    setUpdating(true)
    try {
      const res = await fetch(`/api/users/follow/${user._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await res.json();

      if (data.error) {
        toast('Error', data.error, 'error')
        return;
      }

      if (following) {
        toast('Success', `Unfollowed ${user.name}`, 'success')
        user.followers.pop();
      } else {
        toast('Success', `Followed ${user.name}`, 'success')
        user.followers.push(currentUser._id);
      }

      setFollowing(!following)
    } catch (error) {
      toast('Error', error, 'error')
    } finally {
      setUpdating(false)
    }
  }
  return { handleFollowUnFollow, updating, following }
}

export default followUnfollowUser