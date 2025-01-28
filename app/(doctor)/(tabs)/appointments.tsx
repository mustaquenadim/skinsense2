import React, { useEffect, useState } from 'react';
import {
	View,
	Text,
	ScrollView,
	TouchableOpacity,
	Image,
	SafeAreaView,
} from 'react-native';
import { Bell, Calendar as CalendarIcon } from 'lucide-react-native';
import {
	collection,
	query,
	where,
	getDocs,
	doc as firestoreDoc,
	getDoc,
	updateDoc,
} from 'firebase/firestore';
import { db, auth } from '@/firebaseConfig';
import { useRouter } from 'expo-router';

const tabs = ['Requests', 'Approved', 'Canceled', 'Complete'];

const capitalizeFirstLetter = (string: string) => {
	return string.charAt(0).toUpperCase() + string.slice(1);
};

interface PatientData {
	name: string;
	phoneNumber?: string;
	email?: string;
	profileImage?: string;
}

interface Appointment {
	id: string;
	patientId: string;
	date: string;
	time: string;
	status: 'pending' | 'confirmed' | 'completed' | 'canceled';
	createdAt: string;
	patientName?: string;
	patientImage?: string;
}

export default function ScheduleScreen() {
	const [activeTab, setActiveTab] = useState('Upcoming');
	const [appointments, setAppointments] = useState<Appointment[]>([]);
	const [loading, setLoading] = useState(true);
	const [updateLoading, setUpdateLoading] = useState<string | null>(null);
	const currentUserId = auth.currentUser?.uid;
	const router = useRouter();

	useEffect(() => {
		const fetchAppointments = async () => {
			if (!currentUserId) return;

			try {
				setLoading(true);
				const appointmentsRef = collection(db, 'appointments');
				const q = query(
					appointmentsRef,
					where('doctorId', '==', currentUserId)
				);
				const querySnapshot = await getDocs(q);

				const appointmentsData: Appointment[] = [];

				for (const doc of querySnapshot.docs) {
					const data = doc.data() as Omit<
						Appointment,
						'id' | 'patientName' | 'patientImage'
					>;
					// Fetch patient details
					const patientRef = firestoreDoc(db, 'users', data.patientId);
					const patientDoc = await getDoc(patientRef);
					const patientData = patientDoc.data() as PatientData;

					appointmentsData.push({
						id: doc.id,
						patientId: data.patientId,
						date: data.date,
						time: data.time,
						status: data.status,
						createdAt: data.createdAt,
						patientName: patientData?.name || 'Unknown Patient',
						patientImage: patientData?.profileImage,
					});
				}

				setAppointments(appointmentsData);
			} catch (error) {
				console.error('Error fetching appointments:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchAppointments();
	}, [currentUserId]);

	const handleApprove = async (appointmentId: string) => {
		try {
			setUpdateLoading(appointmentId);
			const appointmentRef = firestoreDoc(db, 'appointments', appointmentId);
			await updateDoc(appointmentRef, {
				status: 'confirmed',
				updatedAt: new Date().toISOString(),
			});

			// Update local state
			setAppointments((prev) =>
				prev.map((apt) =>
					apt.id === appointmentId ? { ...apt, status: 'confirmed' } : apt
				)
			);
		} catch (error) {
			console.error('Error approving appointment:', error);
		} finally {
			setUpdateLoading(null);
		}
	};

	const handleCancel = async (appointmentId: string) => {
		try {
			setUpdateLoading(appointmentId);
			const appointmentRef = firestoreDoc(db, 'appointments', appointmentId);
			await updateDoc(appointmentRef, {
				status: 'canceled',
				updatedAt: new Date().toISOString(),
			});

			// Update local state
			setAppointments((prev) =>
				prev.map((apt) =>
					apt.id === appointmentId ? { ...apt, status: 'canceled' } : apt
				)
			);
		} catch (error) {
			console.error('Error canceling appointment:', error);
		} finally {
			setUpdateLoading(null);
		}
	};

	const handleAppointmentPress = (appointment: Appointment) => {
		router.push({
			pathname: '/(doctor)/patient-details',
			params: {
				appointmentId: appointment.id,
				patientId: appointment.patientId,
				patientName: appointment.patientName,
				patientImage: appointment.patientImage,
				date: appointment.date,
				time: appointment.time,
				status: appointment.status,
			},
		});
	};

	const filteredAppointments = appointments.filter((appointment) => {
		switch (activeTab) {
			case 'Requests':
				return appointment.status === 'pending';
			case 'Approved':
				return appointment.status === 'confirmed';
			case 'Canceled':
				return appointment.status === 'canceled';
			case 'Complete':
				return appointment.status === 'completed';
			default:
				return true;
		}
	});

	return (
		<SafeAreaView className='flex-1 bg-white'>
			<ScrollView className='flex-1'>
				<View className='px-4 pt-4'>
					<View className='flex-row justify-between items-center mb-6'>
						<Text className='text-2xl font-semibold'>Appointments</Text>
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
						{filteredAppointments.map((appointment) => (
							<TouchableOpacity
								key={appointment.id}
								onPress={() => handleAppointmentPress(appointment)}
								className='bg-gray-50 p-4 rounded-xl mb-3'
							>
								<View className='flex-row justify-between items-center mb-4'>
									<View className='flex-row items-center'>
										<Image
											source={
												appointment.patientImage
													? { uri: appointment.patientImage }
													: require('@/assets/images/patient-avatar.jpeg')
											}
											className='w-12 h-12 rounded-full'
										/>
										<View className='ml-3'>
											<Text className='font-semibold'>
												{appointment.patientName}
											</Text>
											<Text className='text-gray-500'>Patient</Text>
										</View>
									</View>
									<View className='w-12 h-12 rounded-full bg-white items-center justify-center'>
										<CalendarIcon size={20} className='text-violet-600' />
									</View>
								</View>

								<View className='flex-row items-center mb-4'>
									<View className='flex-row items-center'>
										<CalendarIcon size={16} />
										<Text className='text-gray-600 text-sm ml-1'>
											{new Date(appointment.date).toLocaleDateString('en-US', {
												weekday: 'short',
												year: 'numeric',
												month: 'short',
												day: 'numeric',
											})}
										</Text>
									</View>
									<Text className='text-gray-500 mx-2'>•</Text>
									<Text className='text-gray-500'>{appointment.time}</Text>
									<View className='flex-row items-center ml-2'>
										<View
											className={`px-1 py-1 rounded-full mr-2 ${
												appointment.status === 'pending'
													? 'bg-yellow-100'
													: appointment.status === 'confirmed'
													? 'bg-green-100'
													: appointment.status === 'completed'
													? 'bg-blue-100'
													: 'bg-red-100'
											}`}
										/>
										<Text className='text-gray-500'>
											{capitalizeFirstLetter(appointment.status)}
										</Text>
									</View>
								</View>

								<View className='flex-row'>
									{appointment.status === 'pending' && (
										<>
											<TouchableOpacity
												className='flex-1 py-2 bg-gray-200 rounded-xl mr-2'
												onPress={() => handleCancel(appointment.id)}
												disabled={updateLoading === appointment.id}
											>
												<Text className='text-center font-medium'>
													{updateLoading === appointment.id
														? 'Canceling...'
														: 'Cancel'}
												</Text>
											</TouchableOpacity>
											<TouchableOpacity
												className='flex-1 py-2 bg-violet-600 rounded-xl ml-2'
												onPress={() => handleApprove(appointment.id)}
												disabled={updateLoading === appointment.id}
											>
												<Text className='text-center text-white font-medium'>
													{updateLoading === appointment.id
														? 'Approving...'
														: 'Approve'}
												</Text>
											</TouchableOpacity>
										</>
									)}
								</View>
							</TouchableOpacity>
						))}
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
