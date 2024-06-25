/* eslint-disable react/prop-types */
import { Link, useNavigate } from "react-router-dom";
import { Avatar, Box, Flex, Image, Text } from "@chakra-ui/react";
import Actions from "./Actions";
import { useEffect, useState } from "react";
import showToast from "../hooks/showToast";
import { formatDistanceToNow } from "date-fns";
import { DeleteIcon } from '@chakra-ui/icons'
import { useRecoilState, useRecoilValue } from "recoil";
import { userAtom } from "../atoms/userAtom";
import { postsAtom } from "../atoms/postsAtom";

const Post = ({ post, postedBy }) => {
  const toast = showToast();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const currentUser = useRecoilValue(userAtom);
  const [posts, setPosts] = useRecoilState(postsAtom);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch('/api/users/profile/' + postedBy);

        const data = await res.json();

        if (data.error) {
          toast('Error', data.error, 'error');
          return;
        }
        setUser(data)
      } catch (error) {
        toast('Error', error, 'error')
        setUser(null);
        return;
      }
    };

    getUser();
  }, [postedBy, toast]);

  const handleDeletePost = async (e) => {
    e.preventDefault();
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      const res = await fetch(`/api/posts/${post._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (data.error) {
        toast('Error', data.error, 'error');
        return;
      }

      toast('Success', 'Post deleted successfully','success');
      setPosts(posts.filter((p) => p._id !== post._id));
    } catch (error) {
      toast('Error', error, 'error');
      return;
    }
  }

  if (!user) return null;

  return (
    <Link to={`/${user.username}/post/${post._id}`}>
      <Flex gap={3} mb={4} py={5}>
        <Flex flexDirection={"column"} alignItems={"center"}>
          <Avatar
            onClick={(e) => {
              e.preventDefault();
              navigate(`/${user.username}`);
            }}
            size="md"
            name={user?.name}
            src={user?.profilePic}
            />
          <Box w="1px" h={"full"} bg="gray.light" my="2"></Box>
          <Box position="relative" w="full">
            {post.replies.length === 0 && <Text textAlign={'center'}>🥱</Text>}
            {post.replies[0] && (
              <Avatar
                size="xs"
                name="primph"
                src={post.replies[0].userProfilePic}
                position="absolute"
                top="0px"
                left="15px"
                padding="2px"
              />
            )}
            {post.replies[1] && (
              <Avatar
                size="xs"
                name="primph"
                src={post.replies[1].userProfilePic}
                position="absolute"
                bottom="0px"
                right="-5px"
                padding="2px"
              />
            )}
            {post.replies[2] && (
              <Avatar
                size="xs"
                name="primph"
                src={post.replies[2].userProfilePic}
                position="absolute"
                bottom="0px"
                left="4px"
                padding="2px"
              />
            )}
          </Box>
        </Flex>
        <Flex flex="1" flexDirection="column" gap={2}>
          <Flex justifyContent={"space-between"} w="full">
            <Flex w="full" alignItems={"center"}>
              <Text
                fontSize={"small"}
                fontWeight={"bold"}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/${user.username}`);
                }}
              >
                {user?.username}
              </Text>
              <Image src="/verified.png" w="4" h="4" ml="1" />
            </Flex>

            <Flex gap={4} alignItems={"center"}>
              <Text fontSize={"small"} width={36} textAlign={'right'} color={"gray.light"}>
                {formatDistanceToNow(new Date(post.createdAt))} ago
              </Text>

              {currentUser?._id === user._id && (
                <DeleteIcon onClick={handleDeletePost} size={20} />
              )}
            </Flex>
          </Flex>

          <Text fontSize={"small"}>{post.text}</Text>
          {post.img && (
            <Box
              borderRadius={6}
              overflow={"hidden"}
              border={"1px solid"}
              borderColor={"gray.light"}
            >
              <Image src={post.img} w={"full"} />
            </Box>
          )}
          <Flex gap="3" my="1">
            <Actions post={post} />
          </Flex>
        </Flex>
      </Flex>
    </Link>
  );
};

export default Post;
