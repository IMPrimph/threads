import { Flex, Image, Input, InputGroup, InputRightElement, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Spinner, useDisclosure } from "@chakra-ui/react"
import { IoSendSharp } from 'react-icons/io5'
import showToast from "../hooks/showToast"
import { useRecoilValue, useSetRecoilState } from "recoil";
import { conversationsAtom, selectedConversationsAtom } from "../atoms/messagesAtom";
import { useRef, useState } from "react";
import { BsFillImageFill } from "react-icons/bs";
import { previewImage } from "../hooks/previewImage";

const MessageInput = ({ setMessages }) => {
    const toast = showToast();
    const [messageText, setMessageText] = useState('');
    const selectedConversation = useRecoilValue(selectedConversationsAtom);
    const setConversations = useSetRecoilState(conversationsAtom);

    const imageRef = useRef(null);
    const { onClose } = useDisclosure();
	const { handleImageChange, imgUrl, setImgUrl } = previewImage();
	const [isSending, setIsSending] = useState(false);

    const handleSendMessage = async (e) => {
        e.preventDefault();

        if (!messageText && !imgUrl) return;
        if (isSending) return;

        setIsSending(true);

        try {
            const res = await fetch('/api/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: messageText,
                    recipientId: selectedConversation.userId,
                    img: imgUrl
                })
            })

            const data = await res.json();

            if (data.error) {
                toast('Error', data.error, 'error');
                return;
            }

            setMessages((messages) => [...messages, data]);
            setConversations((prevConvs) => {
				const updatedConversations = prevConvs.map((conversation) => {
					if (conversation._id === selectedConversation._id) {
						return {
							...conversation,
							lastMessage: {
								text: messageText,
								sender: data.sender,
							},
						};
					}
					return conversation;
				});
				return updatedConversations;
			});

            setMessageText('');
            setImgUrl('');
        } catch (error) {
            toast('Error', error, 'error');
            return;
        } finally {
            setIsSending(false);
        }
    }

    return (
        <Flex gap={2} alignItems={'center'}>
            <form onSubmit={handleSendMessage} style={{ flex: 95 }}>
                <InputGroup>
                <Input
                    w={'full'}
                    placeholder='Type a message'
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                />
                    <InputRightElement onClick={handleSendMessage} cursor={'pointer'}>
                        <IoSendSharp  />
                    </InputRightElement>
                </InputGroup>
            </form>

            <Flex flex={5} cursor={"pointer"}>
				<BsFillImageFill size={20} onClick={() => imageRef.current.click()} />
				<Input type={"file"} hidden ref={imageRef} onChange={handleImageChange} />
			</Flex>
			<Modal
				isOpen={imgUrl}
				onClose={() => {
					onClose();
					setImgUrl("");
				}}
			>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader></ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Flex mt={5} w={"full"}>
							<Image src={imgUrl} />
						</Flex>
						<Flex justifyContent={"flex-end"} my={2}>
							{!isSending ? (
								<IoSendSharp size={24} cursor={"pointer"} onClick={handleSendMessage} />
							) : (
								<Spinner size={"md"} />
							)}
						</Flex>
					</ModalBody>
				</ModalContent>
			</Modal>
        </Flex>
    )
}

export default MessageInput