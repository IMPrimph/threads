import { Box, Flex, Spinner } from "@chakra-ui/react"
import showToast from "../hooks/showToast"
import { useEffect, useState } from "react";
import Post from '../components/Post'
import { useRecoilState } from "recoil";
import { postsAtom } from "../atoms/postsAtom";
import SuggestedUsers from "../components/SuggestedUsers";

const HomePage = () => {
  const toast = showToast();
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getFeedPosts = async () => {
      setPosts([]);
      setLoading(true);
      try {
        const res = await fetch('/api/posts/feed');

        const data = await res.json();

        if (data.error) {
          toast('Error', data.error, 'error')
          return;
        }

        setPosts(data);
      } catch (error) {
        console.log(error)
        toast('Error', error, 'error')
      } finally {
        setLoading(false);
      }
    }
    getFeedPosts();
  }, [toast, setPosts]);

  return (
    <Flex gap={10} alignItems={'flex-start'}>
      <Box flex={70}>
        {!loading && posts.length === 0 && <h1>Follow Some Users to see the posts</h1>}

        {loading && (
          <Flex justify={'center'}>
            <Spinner size={'xl'} />
          </Flex>
        )}

        {posts.map((post) => (
          <Post key={post._id} post={post} postedBy={post.postedBy} />
        ))}
      </Box>

      <Box
        flex={30}
        display={{
          base: 'none',
          md: 'block'
        }}
      >
        <SuggestedUsers/>
      </Box>
    </Flex>
  )
}

export default HomePage