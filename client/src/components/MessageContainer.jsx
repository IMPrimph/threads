import { Avatar, Divider, Flex, Image, Skeleton, SkeletonCircle, Text, useColorModeValue } from "@chakra-ui/react"
import Message from "./Message"
import MessageInput from "./MessageInput"
import { useEffect, useRef, useState } from "react"
import showToast from "../hooks/showToast"
import { useRecoilValue, useSetRecoilState } from "recoil"
import { conversationsAtom, selectedConversationsAtom } from "../atoms/messagesAtom"
import { userAtom } from "../atoms/userAtom"
import { useSocket } from "../context/SocketContext"
import messageSound from '../assets/sounds/message.mp3';

const MessageContainer = () => {
    const toast = showToast();
    const selectedConversation = useRecoilValue(selectedConversationsAtom);
    const [loadingMessages, setLoadingMessages] = useState(true);
    const [messages, setMessages] = useState([]);
    const currentUser = useRecoilValue(userAtom);
    const { socket } = useSocket();
    const setConversations = useSetRecoilState(conversationsAtom);
    const messageEndRef = useRef(null);

    useEffect(() => {
        socket.on('newMessage', (message) => {

            if (selectedConversation._id === message.conversationId) {
                setMessages((prevMessages) => [...prevMessages, message]);
            }

            // play the notification sound
            if (!document.hasFocus()) {
                const audio = new Audio(messageSound);
                audio.play();
            }

            setConversations((prev) => {
				const updatedConversations = prev.map((conversation) => {
					if (conversation._id === message.conversationId) {
						return {
							...conversation,
							lastMessage: {
								text: message.text,
								sender: message.sender,
							},
						};
					}
					return conversation;
				});
				return updatedConversations;
			});
        });
        return () => socket.off('newMessage');
    }, [socket, selectedConversation, setConversations]);

    useEffect(() => {
        const lastMessageIsFromOtherUser = messages.length && messages[messages.length - 1].sender !== currentUser._id;

        if (lastMessageIsFromOtherUser) {
            socket.emit('markMessageAsSeen', {
                conversationId: selectedConversation._id,
                userId: selectedConversation.userId,
            });
        }

        socket.on('messageSeen', ({ conversationId }) => {
            if (conversationId === selectedConversation._id) {
                setMessages((prevMessages) => prevMessages.map((message) => ({
                   ...message,
                    seen: true
                })))
            }
        })

    }, [currentUser._id, socket, messages, selectedConversation]);

    useEffect(() => {
        const getMessages = async () => {
            setLoadingMessages(true);
            setMessages([]);
            try {
                if (selectedConversation?.mock) return;
                const res = await fetch(`/api/messages/${selectedConversation.userId}`);
                const data = await res.json();

                if (data.error) {
                    toast('Error', data.error, 'error');
                    return;
                }
                setMessages(data);

            } catch (error) {
                showToast('Error', error, 'error');
                return;
            } finally {
                setLoadingMessages(false);
            }
        };

        getMessages();

    }, [toast, selectedConversation]);

    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages]);

    return (
        <Flex
            flex={70}
            bg={useColorModeValue('gray.200', 'gray.dark')}
            borderRadius={'md'}
            flexDirection={'column'}
            p={2}
        >
            <Flex w={'full'} h={12} alignItems={'center'} gap={2}>
                <Avatar src={selectedConversation.userProfilePic} size={'sm'} />
                <Text>
                    {selectedConversation.username} <Image src="/verified.png" w={4} h={4} ml={1} />
                </Text>
            </Flex>

            <Divider />

            <Flex
                flexDir={'column'}
                gap={4}
                my={4}
                height={'400px'}
                overflowY={'auto'}
                p={2}
            >
                {loadingMessages && (
                    [0, 1, 2, 3, 4, 5].map((_, i) => (
                        <Flex
                            key={i}
                            gap={2}
                            alignItems={'center'}
                            p={1}
                            borderRadius={'md'}
                            alignSelf={i % 2 === 0 ? 'flex-start' : 'flex-end'}
                        >
                            {i % 2 === 0 && <SkeletonCircle size={7} />}
                            <Flex flexDirection={'column'} gap={2}>
                                <Skeleton h={'8px'} w={'250px'} />
                                <Skeleton h={'8px'} w={'250px'} />
                                <Skeleton h={'8px'} w={'250px'} />
                            </Flex>
                            {i % 2 !== 0 && <SkeletonCircle size={7} />}
                        </Flex>
                    ))
                )}

                {!loadingMessages && (
                    messages.map((message) => (
                        <Flex
                            key={message._id}
                            direction={'column'}
                            ref={messages.length -1 === messages.indexOf(message) ? messageEndRef : null}
                        >
                            <Message key={message._id} message={message} ownMessage={currentUser._id === message.sender} />
                        </Flex>
                    ))
                )}
            </Flex>

            <MessageInput setMessages={setMessages} />
        </Flex>
    )
}

export default MessageContainer