import { Avatar, Box, Button, Flex, Link, Menu, MenuButton, MenuItem, MenuList, Portal, Text, VStack } from "@chakra-ui/react"
import { BsInstagram } from 'react-icons/bs'
import { CgMoreO } from 'react-icons/cg'
import showToast from "../hooks/showToast"
import { useRecoilValue } from "recoil"
import { userAtom } from "../atoms/userAtom"
import { Link as RouterLink } from 'react-router-dom'
import followUnfollowUser from "../hooks/followUnfollowUser"

const UserHeader = ({ user }) => {
  const toast = showToast()
  const currentUser = useRecoilValue(userAtom);

  const copyURL = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl).then(() => {
      toast('Profile link copied', '', 'success')
    });
  }

  const { updating, following, handleFollowUnFollow } = followUnfollowUser(user);

  return (
    <VStack gap={4} alignItems={'start'}>
      <Flex justifyContent={'space-between'} w={'full'}>
        <Box>
          <Text fontSize={'2xl'} fontWeight={'bold'}>
            {user.name}
          </Text>
          <Flex gap={2} alignItems={'center'}>
            <Text fontSize={'small'}>{user.username}</Text>
            <Text
              fontSize={'x-small'}
              bg={'gray.dark'}
              color={'gray.light'}
              p={1}
              borderRadius={'full'}
            >
              threads.net
            </Text>
          </Flex>
        </Box>
        <Box>
          {user.profilePic && (
            <Avatar
              name={user.name}
              src={user.profilePic}
              size={{
                base: 'md',
                md: 'xl'
              }}
            />
          )}
          {!user.profilePic && (
            <Avatar
              name={user.name}
              src='https://bit.ly/broken-link'
              size={{
                base: 'md',
                md: 'xl'
              }}
            />
          )}
        </Box>
      </Flex>
      <Text>{user.bio}</Text>

      {currentUser?._id === user._id && (
        <Link as={RouterLink} to="/update">
          <Button size={'sm'}>Update Profile</Button>
        </Link>
      )}

      {currentUser && currentUser?._id !== user._id && (
        <Button isLoading={updating} onClick={handleFollowUnFollow} size={'sm'}>{ following ? 'UnFollow' :  'Follow'}</Button>
      )}

      <Flex w={'full'} justifyContent={'space-between'}>
        <Flex gap={2} alignItems={'center'}>
          <Text color={'gray.light'}>{user?.followers?.length} followers</Text>
          <Box w='1' h='1' bg={'gray.light'} borderRadius={'full'}></Box>
          <Link color={'gray.light'}>instagram.com</Link>
        </Flex>
        <Flex>
          <Box className={'icon-container'}>
            <BsInstagram size={24} cursor={'pointer'}/>
          </Box>
          <Box className={'icon-container'}>
            <Menu>
              <MenuButton>
                <CgMoreO size={24} cursor={'pointer'}/>
              </MenuButton>
              <Portal>
                <MenuList bg={'dark.grey'}>
                  <MenuItem bg={'dark.grey'} onClick={copyURL}>Copy Link</MenuItem>
                </MenuList>
              </Portal>
            </Menu>
          </Box>
        </Flex>
      </Flex>

      <Flex w={'full'}>
        <Flex
          flex={1}
          borderBottom={'1.5px solid white'}
          pb='3'
          justifyContent={'center'}
          cursor={'pointer'}
        >
          <Text fontWeight={'bold'}>Threads</Text>
        </Flex>
        <Flex
          flex={1}
          borderBottom={'1px solid gray'}
          pb='3'
          justifyContent={'center'}
          cursor={'pointer'}
          color={'gray.light'}
        >
          <Text fontWeight={'bold'}>Replies</Text>
        </Flex>
      </Flex>
    </VStack>
  )
}

export default UserHeader