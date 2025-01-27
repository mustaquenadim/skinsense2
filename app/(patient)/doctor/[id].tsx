import React, { useEffect, useState } from 'react';
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
	MoreVertical,
	Star,
	MessageCircle,
} from 'lucide-react-native';
import { CalendarPicker } from '@/components/ui/calender-picker';
import { TimeSlots } from '@/components/ui/time-slots';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebaseConfig';

const timeSlots = [
	'09:00 AM',
	'10:00 AM',
	'11:00 AM',
	'02:00 PM',
	'03:00 PM',
	'04:00 PM',
	'07:00 PM',
	'08:00 PM',
];

interface Doctor {
	id: string;
	name: string;
	specialty: string;
	rating: number;
	distance?: string;
	about: string;
	profileImage?: string;
	experience?: string;
}

export default function DoctorDetailScreen() {
	const router = useRouter();
	const { id } = useLocalSearchParams();
	const [selectedDate, setSelectedDate] = useState(new Date());
	const [selectedTime, setSelectedTime] = useState('');
	const [isExpanded, setIsExpanded] = useState(false);
	const [doctor, setDoctor] = useState<Doctor | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	useEffect(() => {
		const fetchDoctor = async () => {
			try {
				setLoading(true);
				const docRef = doc(db, 'users', id as string);
				const docSnap = await getDoc(docRef);

				if (docSnap.exists() && docSnap.data()?.role === 'doctor') {
					const doctorData = docSnap.data();
					setDoctor({
						id: docSnap.id,
						name: doctorData.name,
						specialty: doctorData.specialty,
						rating: doctorData.rating,
						distance: doctorData.distance,
						about: doctorData.about,
						profileImage: doctorData.profileImage,
						experience: doctorData.experience,
					});
				} else {
					setError('Doctor not found');
				}
			} catch (err) {
				console.error('Error fetching doctor:', err);
				setError('Failed to load doctor data');
			} finally {
				setLoading(false);
			}
		};

		fetchDoctor();
	}, [id]);

	if (error || !doctor) {
		return (
			<SafeAreaView className='flex-1 bg-white justify-center items-center'>
				<Text className='text-red-500'>{error || 'Doctor not found'}</Text>
			</SafeAreaView>
		);
	}

	const handleBookAppointment = () => {
		if (!selectedTime) {
			// Show error if no time slot selected
			alert('Please select a time slot');
			return;
		}

		router.push({
			pathname: '/appointment',
			params: {
				doctorId: id,
				doctorName: doctor.name,
				specialty: doctor.specialty,
				profileImage: doctor.profileImage,
				date: selectedDate.toISOString(),
				time: selectedTime,
			},
		});
	};

	return (
		<SafeAreaView className='flex-1 bg-white'>
			<View className='flex-1 p-4'>
				{/* Doctor Intro */}
				<View className='flex-row items-center'>
					<Image
						source={
							doctor.profileImage
								? { uri: doctor.profileImage }
								: require('@/assets/images/patient-avatar.jpeg')
						}
						className='w-20 h-20 rounded-2xl'
					/>
					<View className='ml-4'>
						<Text className='text-xl font-semibold'>Dr. {doctor.name}</Text>
						<Text className='text-gray-500'>
							{doctor.specialty || 'Specialist'}
						</Text>
						<View className='flex-row items-center mt-1'>
							<Star size={16} fill='#7c3aed' color='#7c3aed' />
							<Text className='text-violet-600 ml-1'>{doctor.rating}</Text>
							{doctor.distance && (
								<Text className='text-gray-400 ml-2'>
									{doctor.distance} away
								</Text>
							)}
						</View>
					</View>
				</View>

				{/* About Doctor */}
				<View className='mt-6'>
					<Text className='text-lg font-semibold mb-2'>About</Text>
					<Text
						numberOfLines={isExpanded ? undefined : 3}
						className='text-gray-600 leading-6'
					>
						{doctor.about}
					</Text>
					<TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
						<Text className='text-violet-600 mt-2'>
							{isExpanded ? 'Read less' : 'Read more'}
						</Text>
					</TouchableOpacity>
				</View>

				{/* Date Selection */}
				<View className='mt-6'>
					<Text className='text-lg font-semibold mb-4'>Select Date</Text>
					<CalendarPicker
						selectedDate={selectedDate}
						onSelectDate={setSelectedDate}
					/>
				</View>

				{/* Available Time Slots */}
				<View className='mt-6'>
					<Text className='text-lg font-semibold mb-4'>Available Time</Text>
					<TimeSlots
						timeSlots={timeSlots}
						selectedTime={selectedTime}
						onSelectTime={setSelectedTime}
					/>
				</View>
			</View>

			<View className='flex-row items-center justify-between p-4 border-t border-gray-100 gap-4'>
				<TouchableOpacity
					className='w-14 h-14 bg-violet-200 rounded-2xl items-center justify-center'
					onPress={() => router.push(`/chat/${doctor.id}`)}
				>
					<MessageCircle size={20} color='#7c3aed' />
				</TouchableOpacity>
				<TouchableOpacity
					onPress={handleBookAppointment}
					disabled={!selectedTime}
					className={`px-4 py-3 rounded-2xl ${
						selectedTime ? 'bg-violet-600' : 'bg-gray-300'
					}`}
				>
					<Text className='text-white font-semibold text-lg text-center'>
						Book Appointment
					</Text>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
}
