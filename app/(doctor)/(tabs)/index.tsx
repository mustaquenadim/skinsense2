import React from 'react';
import {
	View,
	Text,
	ScrollView,
	TouchableOpacity,
	Image,
	SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Bell, Search } from 'lucide-react-native';
import { PromotionBanner } from '@/components/ui/promotion-banner';

const patients = [
	{
		id: '1',
		name: 'Tazveer Khan',
		image: 'https://i.pravatar.cc/150?img=1',
		status: 'Available now',
		type: 'Initial Meeting',
		statusColor: 'text-green-500',
	},
	{
		id: '2',
		name: 'Tazveer Khann',
		image: 'https://i.pravatar.cc/150?img=2',
		status: 'Not Available',
		type: 'Meeting',
		statusColor: 'text-red-500',
	},
	{
		id: '3',
		name: 'Tazveer Khan',
		image: 'https://i.pravatar.cc/150?img=3',
		status: 'Regular',
		type: 'Initial Meeting',
		statusColor: 'text-gray-500',
	},
];

export default function DoctorHomeScreen() {
	const router = useRouter();

	return (
		<SafeAreaView className='flex-1'>
			<ScrollView className='flex-1 bg-white'>
				<View className='p-4'>
					<View className='flex-row justify-between items-center mb-6'>
						<View>
							<Text className='text-2xl font-semibold'>Find your desire</Text>
							<Text className='text-2xl font-semibold'>healt solution</Text>
						</View>
						<TouchableOpacity className='w-10 h-10 bg-gray-100 rounded-full items-center justify-center'>
							<Bell size={24} className='text-gray-800' />
						</TouchableOpacity>
					</View>

					<View className='flex-row items-center bg-gray-100 rounded-xl p-4 mb-6'>
						<Search size={20} className='text-gray-500 mr-2' />
						<Text className='text-gray-500'>
							Search doctor, drugs, articles...
						</Text>
					</View>

					<PromotionBanner
						title='Edit your Available time'
						buttonText='Available Time'
						onPress={() => router.push('/available-time')}
					/>

					<View className='mt-4'>
						<View className='flex-row justify-between items-center mb-4'>
							<Text className='text-lg font-semibold'>Today's Patients</Text>
							<TouchableOpacity>
								<Text className='text-violet-600'>See all</Text>
							</TouchableOpacity>
						</View>

						<View className='space-y-4'>
							{patients.map((patient) => (
								<TouchableOpacity
									key={patient.id}
									onPress={() => router.push('/doctor/patient-details')}
									className='flex-row items-center bg-white rounded-xl p-3 border border-gray-100'
								>
									<Image
										source={{ uri: patient.image }}
										className='w-16 h-16 rounded-full'
									/>
									<View className='flex-1 ml-3'>
										<Text className='text-base font-semibold'>
											{patient.name}
										</Text>
										<Text className='text-gray-500'>{patient.type}</Text>
										<Text className={patient.statusColor}>
											{patient.status}
										</Text>
									</View>
								</TouchableOpacity>
							))}
						</View>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
