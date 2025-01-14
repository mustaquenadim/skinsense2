import React, { useState } from 'react';
import {
	View,
	Text,
	ScrollView,
	TouchableOpacity,
	Image,
	SafeAreaView,
} from 'react-native';
import { Bell, Calendar as CalendarIcon } from 'lucide-react-native';

const tabs = ['Upcoming', 'Completed', 'Canceled'];

const appointments = [
	{
		id: '1',
		doctor: 'Dr. Marcus Horizon',
		specialty: 'Dermatologist',
		image: 'https://i.pravatar.cc/150?img=8',
		date: '28/06/2022',
		time: '10:30 AM',
		status: 'Confirmed',
	},
	{
		id: '2',
		doctor: 'Dr. Alysa Hana',
		specialty: 'Pediater',
		image: 'https://i.pravatar.cc/150?img=5',
		date: '28/06/2022',
		time: '2:00 PM',
		status: 'Confirmed',
	},
];

export default function ScheduleScreen() {
	const [activeTab, setActiveTab] = useState('Upcoming');

	return (
		<SafeAreaView className='flex-1 bg-white'>
			<ScrollView className='flex-1'>
				<View className='px-4 pt-4'>
					<View className='flex-row justify-between items-center mb-6'>
						<Text className='text-2xl font-semibold'>Schedule</Text>
						<TouchableOpacity>
							<Bell size={24} className='text-gray-800' />
						</TouchableOpacity>
					</View>

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

					<View className='space-y-4'>
						{appointments.map((appointment) => (
							<View key={appointment.id} className='bg-gray-50 p-4 rounded-xl'>
								<View className='flex-row justify-between items-center mb-4'>
									<View className='flex-row items-center'>
										<Image
											source={{ uri: appointment.image }}
											className='w-12 h-12 rounded-full'
										/>
										<View className='ml-3'>
											<Text className='font-semibold'>
												{appointment.doctor}
											</Text>
											<Text className='text-gray-500'>
												{appointment.specialty}
											</Text>
										</View>
									</View>
									<View className='w-12 h-12 rounded-full bg-white items-center justify-center'>
										<CalendarIcon size={20} className='text-violet-600' />
									</View>
								</View>

								<View className='flex-row items-center mb-4'>
									<View className='flex-row items-center'>
										<CalendarIcon size={16} className='text-gray-500 mr-2' />
										<Text className='text-gray-500'>{appointment.date}</Text>
									</View>
									<Text className='text-gray-500 mx-2'>•</Text>
									<Text className='text-gray-500'>{appointment.time}</Text>
									<View className='flex-row items-center ml-2'>
										<View className='w-2 h-2 rounded-full bg-green-500 mr-1' />
										<Text className='text-gray-500'>{appointment.status}</Text>
									</View>
								</View>

								<View className='flex-row'>
									<TouchableOpacity className='flex-1 py-2 bg-gray-200 rounded-xl mr-2'>
										<Text className='text-center font-medium'>Cancel</Text>
									</TouchableOpacity>
									<TouchableOpacity className='flex-1 py-2 bg-violet-600 rounded-xl ml-2'>
										<Text className='text-center text-white font-medium'>
											Reschedule
										</Text>
									</TouchableOpacity>
								</View>
							</View>
						))}
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
