import React, { useEffect, useRef, useState } from 'react';
import {
	View,
	Text,
	ScrollView,
	TextInput,
	TouchableOpacity,
	Image,
	SafeAreaView,
} from 'react-native';
import { router, useLocalSearchParams, useRouter } from 'expo-router';
import {
	ChevronLeft,
	Video,
	MoreVertical,
	Paperclip,
	Phone,
	Send,
} from 'lucide-react-native';
import {
	addDoc,
	collection,
	doc,
	getDoc,
	onSnapshot,
	orderBy,
	query,
	where,
} from 'firebase/firestore';
import { auth, db } from '@/firebaseConfig';
import { getDatabase, ref, push, onValue, set } from 'firebase/database';
import { rtdb } from '@/firebaseConfig';
import * as ImagePicker from 'expo-image-picker';
import { storage } from '@/firebaseConfig';
import {
	ref as storageRef,
	uploadBytes,
	getDownloadURL,
} from 'firebase/storage';
import ImageMessage from '@/components/ImageMessage';

interface Message {
	id: string;
	text: string;
	senderId: string;
	receiverId: string;
	createdAt: number;
	images?: string[];
	mediaType?: string;
	mediaUrl?: string;
}

export default function ChatScreen() {
	const { id: receiverId } = useLocalSearchParams();
	const [messages, setMessages] = useState<Message[]>([]);
	const [message, setMessage] = useState('');
	const [doctor, setDoctor] = useState<any>(null);
	const scrollViewRef = useRef<ScrollView>(null);
	const currentUserId = auth.currentUser?.uid;
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (!currentUserId || !receiverId) return;

		// Create a unique chat ID (sorted to ensure same ID for both users)
		const chatId = [currentUserId, receiverId].sort().join('_');

		// Listen to messages in real time
		const messagesRef = ref(rtdb, `chats/${chatId}/messages`);
		const unsubscribe = onValue(messagesRef, async (snapshot) => {
			const data = snapshot.val();
			if (!data) return;

			const messagesList = await Promise.all(
				Object.entries(data).map(async ([key, message]) => {
					const messageData = message as Message;
					let enhancedMessage = {
						...messageData,
						id: key,
					};

					if (messageData.mediaType) {
						try {
							const fileRef = storageRef(
								storage,
								`chat/${messageData.mediaType}`
							);
							const mediaUrl = await getDownloadURL(fileRef);
							enhancedMessage.mediaUrl = mediaUrl;
						} catch (error) {
							console.error('Error fetching media:', error);
							enhancedMessage.mediaUrl = undefined;
						}
					}

					return enhancedMessage;
				})
			);

			setMessages(messagesList.sort((a, b) => a.createdAt - b.createdAt));
			scrollViewRef.current?.scrollToEnd();
		});

		// Fetch doctor details
		const fetchDoctor = async () => {
			try {
				const docRef = doc(db, 'users', receiverId as string);
				const docSnap = await getDoc(docRef);
				if (docSnap.exists()) {
					setDoctor(docSnap.data());
				}
			} catch (error) {
				console.error('Error fetching doctor:', error);
			}
		};
		fetchDoctor();

		return () => {
			// Detach the listener
			unsubscribe();
		};
	}, [receiverId, currentUserId]);

	const handleSendMessage = async () => {
		if (!message.trim() || !currentUserId || !receiverId) return;

		try {
			const chatId = [currentUserId, receiverId].sort().join('_');
			const newMessage = {
				text: message,
				senderId: currentUserId,
				receiverId: receiverId,
				createdAt: Date.now(),
			};

			// Add message to Realtime Database
			const chatRef = ref(rtdb, `chats/${chatId}/messages`);
			const newMessageRef = push(chatRef);
			await set(newMessageRef, newMessage);

			// Update latest message in chat metadata
			const chatMetaRef = ref(rtdb, `chats/${chatId}/metadata`);
			await set(chatMetaRef, {
				lastMessage: message,
				lastMessageTime: Date.now(),
				participants: [currentUserId, receiverId],
			});

			setMessage('');
		} catch (error) {
			console.error('Error sending message:', error);
		}
	};

	const handleVoiceCall = () => {
		router.push(`/call/${receiverId}`);
	};

	const pickImages = async () => {
		try {
			const result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ['images'],
				quality: 0.8,
				allowsMultipleSelection: true,
				selectionLimit: 5,
			});

			if (!result.canceled) {
				setIsLoading(true);
				const uploadedUrls = [];

				for (const asset of result.assets) {
					const response = await fetch(asset.uri);
					const blob = await response.blob();

					if (blob.size > 5 * 1024 * 1024) {
						alert(`Image ${asset.fileName} is too large. Max size is 5MB`);
						continue;
					}

					const fileName = `chat/${Date.now()}-${Math.random()
						.toString(36)
						.slice(2)}`;
					const fileRef = storageRef(storage, fileName);

					await uploadBytes(fileRef, blob);
					const downloadURL = await getDownloadURL(fileRef);
					uploadedUrls.push(downloadURL);
				}

				if (uploadedUrls.length > 0) {
					const chatId = [currentUserId, receiverId].sort().join('_');

					// Create new message with images
					const newMessage = {
						images: uploadedUrls,
						senderId: currentUserId,
						receiverId: receiverId,
						createdAt: Date.now(),
					};

					// Add to Realtime Database
					const chatRef = ref(rtdb, `chats/${chatId}/messages`);
					const newMessageRef = push(chatRef);
					await set(newMessageRef, newMessage);

					// Update latest message metadata
					const chatMetaRef = ref(rtdb, `chats/${chatId}/metadata`);
					await set(chatMetaRef, {
						lastMessage: '📷 Photo',
						lastMessageTime: Date.now(),
						participants: [currentUserId, receiverId],
					});
				}
			}
		} catch (error) {
			console.error(error);
			alert('Error uploading images');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<SafeAreaView className='flex-1 bg-white'>
			<View className='flex-1'>
				<View className='flex-row items-center p-4 border-b border-gray-200'>
					<TouchableOpacity onPress={() => router.back()}>
						<ChevronLeft size={24} color='#1f2937' />
					</TouchableOpacity>

					<Image
						source={{
							uri: doctor?.profileImage || 'https://i.pravatar.cc/150?img=8',
						}}
						className='w-10 h-10 rounded-full mx-3'
					/>

					<View className='flex-1'>
						<Text className='font-semibold'>Dr. {doctor?.name}</Text>
						<Text className='text-gray-500 text-sm'>Online</Text>
					</View>

					<TouchableOpacity
						onPress={handleVoiceCall}
						className='flex flex-row gap-x-4 mr-4'
					>
						<Phone size={20} fill='#1f2937' />
					</TouchableOpacity>
					<TouchableOpacity className='flex flex-row gap-x-4 mr-4'>
						<Video size={20} fill='#1f2937' />
					</TouchableOpacity>

					<TouchableOpacity>
						<MoreVertical size={24} color='#1f2937' />
					</TouchableOpacity>
				</View>

				<ScrollView
					ref={scrollViewRef}
					className='flex-1 p-4'
					onContentSizeChange={() => scrollViewRef.current?.scrollToEnd()}
				>
					<View className='items-center mb-6'>
						<View className='bg-violet-100 rounded-lg px-4 py-2'>
							<Text className='text-violet-600'>Consultation Start</Text>
						</View>
						<Text className='text-gray-500 text-sm mt-2'>
							You can consult your problems to the doctor
						</Text>
					</View>

					{messages.map((msg) => (
						<View
							key={msg.id}
							className={`flex-row mb-4 ${
								msg.senderId === auth.currentUser?.uid
									? 'justify-end'
									: 'justify-start'
							}`}
						>
							{msg.senderId !== auth.currentUser?.uid && (
								<Image
									source={{
										uri:
											doctor?.profileImage || 'https://i.pravatar.cc/150?img=8',
									}}
									className='w-8 h-8 rounded-full mr-2'
								/>
							)}
							<View
								className={`rounded-2xl px-4 py-2 max-w-[80%] ${
									msg.senderId === auth.currentUser?.uid
										? msg.images == undefined
											? 'bg-violet-600'
											: 'bg-violet-200'
										: 'bg-white'
								}`}
							>
								{msg.images ? (
									<ImageMessage images={msg.images} />
								) : (
									<Text
										className={
											msg.senderId === auth.currentUser?.uid
												? 'text-white'
												: 'text-gray-800'
										}
									>
										{msg.text}
									</Text>
								)}
							</View>
						</View>
					))}
				</ScrollView>

				<View className='p-4 border-t border-gray-200'>
					<View className='flex-row items-center'>
						<TouchableOpacity
							className='mr-2'
							onPress={pickImages}
							disabled={isLoading}
						>
							<Paperclip
								size={20}
								className={`${isLoading ? 'text-gray-400' : 'text-gray-600'}`}
							/>
						</TouchableOpacity>
						<TextInput
							className='flex-1 py-2 px-4 bg-gray-100 rounded-full '
							placeholder='Type message...'
							value={message}
							onChangeText={setMessage}
						/>
						<TouchableOpacity
							disabled={!message}
							onPress={handleSendMessage}
							className='ml-2'
						>
							<Send color={'#7c3aed'} size='24' />
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</SafeAreaView>
	);
}
function serverTimestamp() {
	return Date.now();
}
