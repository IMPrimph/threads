import { useEffect, useState } from 'react'
import UserHeader from '../components/UserHeader'
import { useParams } from 'react-router-dom';
import showToast from '../hooks/showToast';
import { Flex, Spinner } from '@chakra-ui/react';
import Post from '../components/Post';
import getUserProfile from '../hooks/getUserProfile';
import { useRecoilState } from 'recoil';
import { postsAtom } from '../atoms/postsAtom';

const UserPage = () => {
  const { username } = useParams();
  const { user, loading } = getUserProfile();
  const toast = showToast()
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [fetchingPosts, setFetchingPosts] = useState(true);

  useEffect(() => {
    const getPosts = async() => {
      if (!user) return;

      setFetchingPosts(true);
      try {
        const res = await fetch(`/api/posts/user/${username}`);
        const data = await res.json();

        if (data.error) {
          toast('Error', data.error, 'error')
          return;
        }

        setPosts(data);
      } catch (error) {
        toast('Error', error, 'error')
        setPosts([]);
      } finally {
        setFetchingPosts(false);
      }
    }

    getPosts();
  }, [username, user, toast, setPosts]);

  if (!user && loading) {
    return(
      <Flex justifyContent={'center'}>
          <Spinner size={'xl'} />
      </Flex>
    )
  }

  if (!user && !loading) return <h1>User not found</h1>

  if (!user) return null;

  return (
    <>
      <UserHeader user={user} />

      {!fetchingPosts && posts.length === 0 && <h1>User has not posts</h1>}

      {fetchingPosts && (
        <Flex justifyContent={'center'} my={12}>
          <Spinner size={'xl'} />
        </Flex>
      )}

      {posts.map((post) => (
        <Post post={post} key={post._id} postedBy={post.postedBy} />
      ))}
    </>
  )
}

export default UserPage