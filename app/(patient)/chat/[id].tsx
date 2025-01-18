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

interface Message {
	id: string;
	text: string;
	senderId: string;
	receiverId: string;
	createdAt: number;
}

export default function ChatScreen() {
	const { id: receiverId } = useLocalSearchParams();
	const [messages, setMessages] = useState<Message[]>([]);
	const [message, setMessage] = useState('');
	const [doctor, setDoctor] = useState<any>(null);
	const scrollViewRef = useRef<ScrollView>(null);
	const currentUserId = auth.currentUser?.uid;

	useEffect(() => {
		if (!currentUserId || !receiverId) return;

		// Create a unique chat ID (sorted to ensure same ID for both users)
		const chatId = [currentUserId, receiverId].sort().join('_');

		// Listen to messages in real time
		const messagesRef = ref(rtdb, `chats/${chatId}/messages`);
		const unsubscribe = onValue(messagesRef, (snapshot) => {
			const data = snapshot.val();
			if (!data) return;

			const messagesList = Object.entries(data).map(([key, message]) => ({
				...(message as Message),
				id: key, // Override the id from the message with the key
			}));

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

	return (
		<SafeAreaView className='flex-1 bg-white mt-10'>
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
										? 'bg-violet-600'
										: 'bg-gray-100'
								}`}
							>
								<Text
									className={
										msg.senderId === auth.currentUser?.uid
											? 'text-white'
											: 'text-gray-800'
									}
								>
									{msg.text}
								</Text>
							</View>
						</View>
					))}
				</ScrollView>

				<View className='p-4 border-t border-gray-200'>
					<View className='flex-row items-center bg-gray-100 rounded-full px-4'>
						<TextInput
							className='flex-1 py-2'
							placeholder='Type message...'
							value={message}
							onChangeText={setMessage}
						/>
						<TouchableOpacity className='mr-2'>
							<Paperclip size={20} className='text-gray-600' />
						</TouchableOpacity>
						<TouchableOpacity
							className='bg-violet-600 rounded-full p-2'
							disabled={!message}
							onPress={handleSendMessage}
						>
							<Text className='text-white px-3'>Send</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</SafeAreaView>
	);
}
