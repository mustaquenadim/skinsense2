import React, { useEffect, useState } from 'react';
import {
	View,
	Text,
	ScrollView,
	TouchableOpacity,
	Image,
	SafeAreaView,
	ActivityIndicator,
} from 'react-native';
import { Bell, Calendar as CalendarIcon } from 'lucide-react-native';
import {
	collection,
	getDoc,
	getDocs,
	query,
	where,
	doc,
} from 'firebase/firestore';
import { auth, db } from '@/firebaseConfig';

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

interface Appointment {
	id: string;
	doctorId: string;
	patientId: string;
	doctorName: string;
	specialty: string;
	profileImage?: string;
	date: string;
	time: string;
	status: 'pending' | 'completed' | 'canceled';
	createdAt: string;
}

export default function ScheduleScreen() {
	const [activeTab, setActiveTab] = useState('upcoming');
	const [appointments, setAppointments] = useState<Appointment[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		fetchAppointments();
	}, []);

	const fetchAppointments = async () => {
		try {
			setLoading(true);
			const appointmentsRef = collection(db, 'appointments');
			const q = query(
				appointmentsRef,
				where('patientId', '==', auth.currentUser?.uid)
			);

			const querySnapshot = await getDocs(q);
			const appointmentsData: Appointment[] = [];

			for (const docSnapshot of querySnapshot.docs) {
				const data = docSnapshot.data();
				// Fetch doctor details
				const doctorRef = doc(db, 'users', data.doctorId);
				const doctorDoc = await getDoc(doctorRef);
				const doctorData = doctorDoc.data();

				appointmentsData.push({
					id: docSnapshot.id,
					...data,
					doctorName: doctorData?.name || 'Unknown Doctor',
					specialty: doctorData?.specialty || 'Specialist',
					profileImage: doctorData?.profileImage,
				} as Appointment);
			}

			setAppointments(appointmentsData);
		} catch (err) {
			console.error('Error fetching appointments:', err);
			setError('Failed to load appointments');
		} finally {
			setLoading(false);
		}
	};

	const filteredAppointments = appointments.filter((appointment) => {
		switch (activeTab.toLowerCase()) {
			case 'upcoming':
				return appointment.status === 'pending';
			case 'completed':
				return appointment.status === 'completed';
			case 'canceled':
				return appointment.status === 'canceled';
			default:
				return true;
		}
	});

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
						{loading ? (
							<ActivityIndicator size='large' color='#7c3aed' />
						) : error ? (
							<Text className='text-red-500 text-center'>{error}</Text>
						) : filteredAppointments.length === 0 ? (
							<Text className='text-gray-500 text-center'>
								No appointments found
							</Text>
						) : (
							filteredAppointments.map((appointment) => (
								<View
									key={appointment.id}
									className='bg-gray-50 p-4 rounded-xl'
								>
									<View className='flex-row justify-between items-center mb-4'>
										<View className='flex-row items-center'>
											<Image
												source={{
													uri:
														appointment.profileImage ||
														'https://i.pravatar.cc/150?img=8',
												}}
												className='w-12 h-12 rounded-full'
											/>
											<View className='ml-3'>
												<Text className='font-semibold'>
													{appointment.doctorName}
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
											<Text className='text-gray-500'>
												{new Date(appointment.date).toLocaleDateString()}
											</Text>
										</View>
										<Text className='text-gray-500 mx-2'>•</Text>
										<Text className='text-gray-500'>{appointment.time}</Text>
										<View className='flex-row items-center ml-2'>
											<View
												className={`w-2 h-2 rounded-full ${
													appointment.status === 'pending'
														? 'bg-green-500'
														: appointment.status === 'completed'
														? 'bg-blue-500'
														: 'bg-red-500'
												} mr-1`}
											/>
											<Text className='text-gray-500'>
												{appointment.status}
											</Text>
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
							))
						)}
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
