import { Avatar, AvatarBadge, Box, Flex, Image, Stack, Text, WrapItem, useColorMode, useColorModeValue } from "@chakra-ui/react";
import { useRecoilState, useRecoilValue } from "recoil";
import { userAtom } from "../atoms/userAtom";
import { BsCheck2All, BsImageFill } from "react-icons/bs";
import { selectedConversationsAtom } from "../atoms/messagesAtom";

const Conversations = ({ conversation, isOnline }) => {
    const user = conversation.participants[0];
    const lastMessage = conversation.lastMessage;
    const currentUser = useRecoilValue(userAtom);
    const [selectedConversation, setSelectedConversation] = useRecoilState(selectedConversationsAtom);
    const colorMode = useColorMode();

    return (
        <Flex
            gap={4}
            alignItems={'center'}
            p={1}
            _hover={{
                cursor: 'pointer',
                bg: useColorModeValue('gray.600', 'gray.dark'),
                color: 'white'
            }}
            onClick={() => setSelectedConversation({
                _id: conversation._id,
                userId: user._id,
                username: user.username,
                userProfilePic: user.profilePic,
                mock: conversation?.mock
            })}
            borderRadius={'md'}
            bg={selectedConversation._id === conversation._id ? (colorMode === 'light' ? 'gray.400' : 'gray.dark') : ''}
        >
            <WrapItem>
                <Avatar
                    size={{
                        base: 'xs',
                        md: 'md',
                        sm: 'sm',
                    }}
                    src={user.profilePic}
                >
                    {isOnline && <AvatarBadge boxSize={'1em'} bg={'green.500'} />}
                </Avatar>
            </WrapItem>

            <Stack direction={'column'} fontSize={'small'}>
                <Text fontWeight={700} display={'flex'} alignItems={'center'}>
                    {user.username} <Image src="/verified.png" w={4} h={4} ml={1} />
                </Text>
                <Text fontSize={'x-small'} display={'flex'} alignItems={'center'} gap={1}>
                    {currentUser._id === lastMessage.sender ? (
                        <Box color={lastMessage.seen ? 'blue.400' : ''}>
                            <BsCheck2All size={16} />
                        </Box>
                    ) : ''}
                    {(lastMessage?.text?.length || lastMessage?.img) ? (lastMessage.text?.length > 18 ? lastMessage.text.substring(0, 18) + '...' : lastMessage.text || <BsImageFill size={16} />) : ''}
                </Text>
            </Stack>
        </Flex>
    );
};

export default Conversations;
