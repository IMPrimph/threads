import { SearchIcon } from "@chakra-ui/icons"
import { Box, Button, Flex, Input, Skeleton, SkeletonCircle, Text, useColorModeValue } from "@chakra-ui/react"
import Conversations from "../components/Conversations"
import MessageContainer from "../components/MessageContainer"
import { useEffect, useState } from "react"
import showToast from "../hooks/showToast"
import { useRecoilState, useRecoilValue } from "recoil"
import { conversationsAtom, selectedConversationsAtom } from "../atoms/messagesAtom"
import { GiConversation } from 'react-icons/gi'
import { userAtom } from "../atoms/userAtom"
import { useSocket } from "../context/SocketContext"

const ChatPage = () => {
    const toast = showToast();
    const currentUser = useRecoilValue(userAtom);
    const [loadingConversations, setLoadingConversations] = useState(true);
    const [conversations, setConversations] = useRecoilState(conversationsAtom);
    const [selectedConversation, setSelectedConversation] = useRecoilState(selectedConversationsAtom);
    const [searchConversation, setSearchConversation] = useState('');
    const [loadingUserSearch, setLoadingUserSearch] = useState(false);
    const { socket, onlineUsers } = useSocket();

    useEffect(() => {
        const getConversations = async () => {
            try {
                const res = await fetch('/api/messages/conversations');
                const data = await res.json();

                if (data.error) {
                    toast('Error', data.error, 'error');
                    return;
                }

                setConversations(data);

            } catch (error) {
                showToast('Error', error, 'error');
                return;
            } finally {
                setLoadingConversations(false);
            }
        };

        getConversations();
    }, [toast, setConversations]);

	useEffect(() => {
		socket?.on("messageSeen", ({ conversationId }) => {
			setConversations((prev) => {
				const updatedConversations = prev.map((conversation) => {
					if (conversation._id === conversationId) {
						return {
							...conversation,
							lastMessage: {
								...conversation.lastMessage,
								seen: true,
							},
						};
					}
					return conversation;
				});
				return updatedConversations;
			});
		});
	}, [socket, setConversations]);

    const handleConversationSearch = async(e) => {
        e.preventDefault();
        setLoadingUserSearch(true);

        try {
            const res = await fetch(`/api/users/profile/${searchConversation}`);
            const data = await res.json();

            if (data.error) {
                toast('Error', data.error, 'error');
                return;
            }

            const messagingSelf = data._id === currentUser._id;
            if (messagingSelf) {
                toast('Error', 'You can\'t send messages to yourself', 'error');
                return;
            }

            const existingConversation = conversations.find((conversation) => conversation.participants[0]._id === data._id);
            if (existingConversation) {
                setSelectedConversation({
                    _id: existingConversation._id,
                    userId: data._id,
                    username: data.username,
                    userProfilePic: data.profilePic
                });
                return;
            }

            const mockConversation = {
                mock: true,
                lastMessage: {
                    text: '',
                    sender: ''
                },
                _id: Date.now(),
                participants: [
                    {
                        _id: data._id,
                        username: data.username,
                        profilePic: data.profilePic
                    }
                ]
            }

            setConversations((prevCons) => [...prevCons, mockConversation])
        } catch (error) {
            showToast('Error', error, 'error');
            return;
        } finally {
            setSearchConversation('');
            setLoadingUserSearch(false);
        }
    }

    return (
        <Box
            position={'absolute'}
            w={{
                lg: '750px',
                md: '80%',
                base: '90%'
            }}
            p={4}
            left={'50%'}
            transform={'translateX(-50%)'}
        >
            <Flex
                gap={4}
                flexDirection={{
                    base: 'column',
                    md: 'row',
                }}
                maxW={{
                    sm: '400px',
                    md: 'full'
                }}
                mx={'auto'}
            >
                <Flex
                    flex={30}
                    gap={2}
                    flexDirection={'column'}
                    maxW={{
                        sm: '250px',
                        md: 'full'
                    }}
                    mx={'auto'}
                >
                    <Text fontWeight={700} color={useColorModeValue('gray.600', 'gray.400')}>
                        Your Conversations
                    </Text>
                    <form onSubmit={handleConversationSearch}>
                        <Flex alignItems={'center'} gap={2}>
                            <Input onChange={(e) => setSearchConversation(e.target.value)} placeholder="Search for a user" />
                            <Button isLoading={loadingUserSearch} size={'sm'} onClick={handleConversationSearch}>
                                <SearchIcon />
                            </Button>
                        </Flex>
                    </form>

                    {loadingConversations && (
                        [0, 1, 2, 3, 4, 5].map((_, i) => (
                            <Flex key={i} gap={4} alignItems={'center'} p={1} borderRadius={'md'}>
                                <Box>
                                    <SkeletonCircle size={10} />
                                </Box>
                                <Flex w={'full'} flexDirection={'column'} gap={3}>
                                    <Skeleton h={'10px'} w={'80px'} />
                                    <Skeleton h={'8px'} w={'90%'} />
                                </Flex>
                            </Flex>
                        ))
                    )}

                    {!loadingConversations && (
                        conversations?.map((conversation) => (
                            <Conversations
                                key={conversation._id}
                                isOnline={onlineUsers.includes(conversation.participants[0]._id)}
                                conversation={conversation}
                            />
                        ))
                    )}
                </Flex>

                {!selectedConversation._id && (
                    <Flex
                        flex={70}
                        borderRadius={'md'}
                        p={2}
                        flexDir={'column'}
                        alignItems={'center'}
                        justifyContent={'center'}
                        height={'400px'}
                    >
                        <GiConversation size={100} />
                        <Text fontSize={20} >Select a conversation to start messaging</Text>
                    </Flex>
                )}

                {selectedConversation._id && (
                    <MessageContainer />
                )}

            </Flex>
        </Box>
    )
}

export default ChatPage