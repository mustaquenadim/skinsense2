import React, { useState, useEffect } from 'react';
import {
	View,
	Text,
	ScrollView,
	TouchableOpacity,
	Image,
	SafeAreaView,
	ActivityIndicator,
} from 'react-native';
import { Search } from 'lucide-react-native';
import { Link } from 'expo-router';
import { getDatabase, ref, onValue } from 'firebase/database';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db, rtdb } from '@/firebaseConfig';

interface ChatMessage {
	id: string;
	doctorId: string;
	doctorName: string;
	doctorImage?: string;
	lastMessage: string;
	timestamp: number;
	unread: boolean;
}

const tabs = ['All', 'Group', 'Private'];

export default function MessagesScreen() {
	const [activeTab, setActiveTab] = useState('All');
	const [chats, setChats] = useState<ChatMessage[]>([]);
	const [loading, setLoading] = useState(true);
	const currentUserId = auth.currentUser?.uid;

	useEffect(() => {
		if (!currentUserId) return;

		// Listen to chats in realtime
		const chatsRef = ref(rtdb, 'chats');

		const unsubscribe = onValue(chatsRef, async (snapshot) => {
			const data = snapshot.val();
			if (!data) {
				setChats([]);
				setLoading(false);
				return;
			}

			const chatsList: ChatMessage[] = [];

			for (const [chatId, chat] of Object.entries<any>(data)) {
				if (!chat.metadata?.participants?.includes(currentUserId)) continue;

				const doctorId = chat.metadata.participants.find(
					(id: string) => id !== currentUserId
				);

				// Get doctor details from Firestore
				const doctorDoc = await getDoc(doc(db, 'users', doctorId));
				const doctorData = doctorDoc.data();

				chatsList.push({
					id: chatId,
					doctorId,
					doctorName: 'Dr. ' + doctorData?.name || 'Unknown Doctor',
					doctorImage: doctorData?.profileImage,
					lastMessage: chat.metadata.lastMessage || '',
					timestamp: chat.metadata.lastMessageTime || 0,
					unread: false, // TODO: Implement unread status
				});
			}

			// Sort by latest message
			setChats(chatsList.sort((a, b) => b.timestamp - a.timestamp));
			setLoading(false);
		});

		return () => unsubscribe();
	}, [currentUserId]);

	return (
		<SafeAreaView className='flex-1 bg-white'>
			<View className='px-4 pt-4'>
				{/* Header */}
				<View className='flex-row justify-between items-center mb-6'>
					<Text className='text-2xl font-semibold'>Message</Text>
					<TouchableOpacity>
						<Search size={24} color='#101623' />
					</TouchableOpacity>
				</View>

				{/* Message Tabs */}
				{/* <View className='flex-row bg-gray-100 rounded-full p-1 mb-6'>
					{tabs.map((tab) => (
						<TouchableOpacity
							key={tab}
							onPress={() => setActiveTab(tab)}
							className={`flex-1 py-2 px-4 rounded-full ${
								activeTab === tab ? 'bg-violet-600' : ''
							}`}
						>
							<Text
								className={`text-center ${
									activeTab === tab ? 'text-white' : 'text-gray-600'
								}`}
							>
								{tab}
							</Text>
						</TouchableOpacity>
					))}
				</View> */}

				<View className='gap-y-4'>
					{loading ? (
						<ActivityIndicator size='large' color='#7c3aed' />
					) : chats.length === 0 ? (
						<Text className='text-gray-500 text-center'>No messages yet</Text>
					) : (
						chats.map((chat) => (
							<Link href={`/chat/${chat.doctorId}`} key={chat.id} asChild>
								<TouchableOpacity className='flex-row items-center'>
									<Image
										source={{
											uri:
												chat.doctorImage || 'https://i.pravatar.cc/150?img=8',
										}}
										className='w-12 h-12 rounded-full'
									/>
									<View className='flex-1 ml-4'>
										<Text className='font-semibold text-gray-900'>
											{chat.doctorName}
										</Text>
										<Text className='text-gray-500'>{chat.lastMessage}</Text>
									</View>
									<View className='items-end'>
										<Text className='text-gray-500 text-sm'>
											{new Date(chat.timestamp).toLocaleTimeString([], {
												hour: '2-digit',
												minute: '2-digit',
											})}
										</Text>
										{chat.unread && (
											<View className='w-2 h-2 rounded-full bg-violet-600 mt-1' />
										)}
									</View>
								</TouchableOpacity>
							</Link>
						))
					)}
				</View>
			</View>
		</SafeAreaView>
	);
}
