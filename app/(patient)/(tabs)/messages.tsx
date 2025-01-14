import React, { useState } from 'react';
import {
	View,
	Text,
	ScrollView,
	TouchableOpacity,
	Image,
	SafeAreaView,
} from 'react-native';
import { Search } from 'lucide-react-native';
import { Link } from 'expo-router';

const tabs = ['All', 'Group', 'Private'];

const messages = [
	{
		id: '1',
		doctor: 'Dr. Marcus Horizon',
		image: 'https://i.pravatar.cc/150?img=8',
		message: "I don't have any more headache...",
		time: '10:24',
		unread: true,
	},
	{
		id: '2',
		doctor: 'Dr. Alysa Hana',
		image: 'https://i.pravatar.cc/150?img=5',
		message: 'Hello, any help you?',
		time: '09:04',
		unread: false,
	},
	{
		id: '3',
		doctor: 'Dr. Maria Elena',
		image: 'https://i.pravatar.cc/150?img=9',
		message: 'Do you have fever?',
		time: '08:57',
		unread: false,
	},
];

export default function MessagesScreen() {
	const [activeTab, setActiveTab] = useState('All');

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
				<View className='flex-row bg-gray-100 rounded-full p-1 mb-6'>
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
				</View>

				<View className='gap-y-4'>
					{messages.map((message) => (
						<Link href={`/chat/${message.id}`} key={message.id} asChild>
							<TouchableOpacity className='flex-row items-center'>
								<Image
									source={{ uri: message.image }}
									className='w-12 h-12 rounded-full'
								/>
								<View className='flex-1 ml-4'>
									<Text className='font-semibold text-gray-900'>
										{message.doctor}
									</Text>
									<Text className='text-gray-500'>{message.message}</Text>
								</View>
								<View className='items-end'>
									<Text className='text-gray-500 text-sm'>{message.time}</Text>
									{message.unread && (
										<View className='w-2 h-2 rounded-full bg-violet-600 mt-1' />
									)}
								</View>
							</TouchableOpacity>
						</Link>
					))}
				</View>
			</View>
		</SafeAreaView>
	);
}
