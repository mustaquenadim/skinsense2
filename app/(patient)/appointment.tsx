import React, { useState } from 'react';
import {
	View,
	Text,
	ScrollView,
	TouchableOpacity,
	Image,
	SafeAreaView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
	ChevronLeft,
	Calendar,
	ClipboardList,
	CreditCard,
} from 'lucide-react-native';
import { SuccessModal } from '@/components/ui/success-modal';
import { auth, db } from '@/firebaseConfig';
import { addDoc, collection } from 'firebase/firestore';

export default function BookingScreen() {
	const router = useRouter();
	const params = useLocalSearchParams();
	const { doctorId, doctorName, specialty, profileImage, date, time } = params;
	const [showSuccessModal, setShowSuccessModal] = useState(false);

	const formattedDate = new Date(date as string).toLocaleDateString('en-US', {
		weekday: 'long',
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	});

	const handleBooking = async () => {
		try {
			// Here you can add the logic to save the appointment to Firestore
			const appointmentData = {
				doctorId,
				patientId: auth.currentUser?.uid,
				date,
				time,
				status: 'pending',
				createdAt: new Date().toISOString(),
			};
			await addDoc(collection(db, 'appointments'), appointmentData);

			setShowSuccessModal(true);
		} catch (error) {
			console.error('Booking error:', error);
			alert('Failed to book appointment');
		}
	};

	const handleChatPress = () => {
		setShowSuccessModal(false);
		router.push(`/chat/${doctorId}`);
	};

	return (
		<SafeAreaView className='flex-1 bg-white'>
			<View className='flex-1'>
				<ScrollView className='flex-1 p-4'>
					<View className='flex-row items-center mb-6'>
						<Image
							source={{
								uri: Array.isArray(profileImage)
									? profileImage[0]
									: (profileImage as string) ||
									  'https://i.pravatar.cc/150?img=8',
							}}
							className='w-16 h-16 rounded-2xl'
						/>
						<View className='ml-4'>
							<Text className='text-xl font-semibold'>Dr. {doctorName}</Text>
							<Text className='text-gray-500'>
								{specialty ? specialty : 'Dermatologist'}
							</Text>
							<View className='flex-row items-center mt-1'>
								<Text className='text-violet-600'>4.7</Text>
								<Text className='text-gray-400 ml-2'>800m away</Text>
							</View>
						</View>
					</View>

					<View className='space-y-6'>
						<View>
							<View className='flex-row justify-between items-center mb-2'>
								<Text className='text-base font-semibold'>Date</Text>
								<TouchableOpacity>
									<Text className='text-violet-600'>Change</Text>
								</TouchableOpacity>
							</View>
							<View className='flex-row items-center'>
								<Calendar size={20} className='text-gray-500 mr-2' />
								<Text className='text-gray-600'>
									{formattedDate} | {time}
								</Text>
							</View>
						</View>

						<View>
							<View className='flex-row justify-between items-center mb-2'>
								<Text className='text-base font-semibold'>Reason</Text>
								<TouchableOpacity>
									<Text className='text-violet-600'>Change</Text>
								</TouchableOpacity>
							</View>
							<View className='flex-row items-center'>
								<ClipboardList size={20} className='text-gray-500 mr-2' />
								<Text className='text-gray-600'>Chest pain</Text>
							</View>
						</View>

						<View>
							<Text className='text-base font-semibold mb-4'>
								Payment Detail
							</Text>
							<View className='space-y-2'>
								<View className='flex-row justify-between'>
									<Text className='text-gray-500'>Consultation</Text>
									<Text className='text-gray-900'>$60.00</Text>
								</View>
								<View className='flex-row justify-between'>
									<Text className='text-gray-500'>Admin Fee</Text>
									<Text className='text-gray-900'>$01.00</Text>
								</View>
								<View className='flex-row justify-between'>
									<Text className='text-gray-500'>Additional Discount</Text>
									<Text className='text-violet-600'>-$0.00</Text>
								</View>
								<View className='flex-row justify-between pt-2 border-t border-gray-100'>
									<Text className='font-semibold'>Total</Text>
									<Text className='font-semibold text-violet-600'>$61.00</Text>
								</View>
							</View>
						</View>

						<View>
							<View className='flex-row justify-between items-center mb-2'>
								<Text className='text-base font-semibold'>Payment Method</Text>
								<TouchableOpacity>
									<Text className='text-violet-600'>Change</Text>
								</TouchableOpacity>
							</View>
							<View className='flex-row items-center'>
								<CreditCard size={20} className='text-gray-500 mr-2' />
								<Text className='text-gray-600'>VISA</Text>
							</View>
						</View>
					</View>
				</ScrollView>

				<View className='p-4 border-t border-gray-100'>
					<View className='flex-row justify-between items-center mb-4'>
						<Text className='text-gray-500'>Total</Text>
						<Text className='text-xl font-semibold'>$ 61.00</Text>
					</View>

					<TouchableOpacity
						onPress={handleBooking}
						className='bg-violet-600 p-4 rounded-xl'
					>
						<Text className='text-white text-center font-semibold text-lg'>
							Booking
						</Text>
					</TouchableOpacity>
				</View>

				<SuccessModal
					visible={showSuccessModal}
					onClose={() => setShowSuccessModal(false)}
					onChatPress={handleChatPress}
				/>
			</View>
		</SafeAreaView>
	);
}
