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

const initialMessages = [
	{
		id: '1',
		text: 'Hello, How can I help you?',
		sender: 'doctor',
		time: '10:00 AM',
	},
	{
		id: '2',
		text: 'I have suffering from headache and cold for 3 days, I took 2 tablets of solo, but still pain',
		sender: 'user',
		time: '10:02 AM',
	},
	{
		id: '3',
		text: 'Ok, Do you have fever? Is the headache severe',
		sender: 'doctor',
		time: '10:03 AM',
	},
	{
		id: '4',
		text: "I don't have any fever, but headache is painful",
		sender: 'user',
		time: '10:04 AM',
	},
];

interface Message {
	id: string;
	text: string;
	senderId: string;
	receiverId: string;
	createdAt: number;
}

export default function ChatScreen() {
	const { id: doctorId } = useLocalSearchParams();
	const [messages, setMessages] = useState<Message[]>([]);
	const [message, setMessage] = useState('');
	const [doctor, setDoctor] = useState<any>(null);
	const scrollViewRef = useRef<ScrollView>(null);

	useEffect(() => {
		// Fetch doctor details
		const fetchDoctor = async () => {
			try {
				const docRef = doc(db, 'users', doctorId as string);
				const docSnap = await getDoc(docRef);
				if (docSnap.exists()) {
					setDoctor(docSnap.data());
				}
			} catch (error) {
				console.error('Error fetching doctor:', error);
			}
		};
		fetchDoctor();

		// Set up real-time chat listener
		const messagesRef = collection(db, 'chats');
		const q = query(
			messagesRef,
			where('participants', 'array-contains', auth.currentUser?.uid),
			orderBy('createdAt', 'asc')
		);

		const unsubscribe = onSnapshot(q, (snapshot) => {
			const newMessages: Message[] = [];
			snapshot.forEach((doc) => {
				newMessages.push({ id: doc.id, ...doc.data() } as Message);
			});
			setMessages(newMessages);
			scrollViewRef.current?.scrollToEnd();
		});

		return () => unsubscribe();
	}, [doctorId]);

	const handleSendMessage = async () => {
		if (!message.trim() || !auth.currentUser) return;

		try {
			const chatRef = collection(db, 'chats');
			await addDoc(chatRef, {
				text: message,
				senderId: auth.currentUser.uid,
				receiverId: doctorId,
				participants: [auth.currentUser.uid, doctorId],
				createdAt: Date.now(),
			});

			setMessage('');
		} catch (error) {
			console.error('Error sending message:', error);
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

					<TouchableOpacity className='flex flex-row gap-x-4 mr-4'>
						<Phone size={20} fill='#1f2937' />
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
