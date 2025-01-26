import React, { useEffect, useState } from 'react';
import {
	View,
	Text,
	ScrollView,
	TouchableOpacity,
	Image,
	SafeAreaView,
	StyleSheet,
	ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, MoreVertical, Star } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { ScreenHeader } from '@/components/ui/screen-header';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/firebaseConfig';

interface Doctor {
	id: string;
	name: string;
	specialty: string;
	rating: number;
	profileImage?: string;
	distance?: string;
	role: string;
}

export default function TopDoctorsScreen() {
	const [doctors, setDoctors] = useState<Doctor[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const router = useRouter();

	useEffect(() => {
		fetchDoctors();
	}, []);

	const fetchDoctors = async () => {
		try {
			setLoading(true);
			const usersRef = collection(db, 'users');
			const q = query(usersRef, where('role', '==', 'doctor'));
			const querySnapshot = await getDocs(q);

			const doctorsData = querySnapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			})) as Doctor[];

			setDoctors(doctorsData);
		} catch (err) {
			console.error('Error fetching doctors:', err);
			setError('Failed to load doctors');
		} finally {
			setLoading(false);
		}
	};

	return (
		<SafeAreaView style={styles.container}>
			<StatusBar style='dark' />

			<ScrollView className='flex-1 p-4'>
				{loading ? (
					<ActivityIndicator size='large' color='#7c3aed' />
				) : error ? (
					<Text className='text-red-500 text-center'>{error}</Text>
				) : doctors.length === 0 ? (
					<Text className='text-gray-500 text-center'>No doctors found</Text>
				) : (
					doctors.map((doctor) => (
						<TouchableOpacity
							key={doctor.id}
							onPress={() => router.push(`/doctor/${doctor.id}`)}
							className='flex-row items-center bg-white rounded-2xl p-3 mb-3 shadow-sm border border-gray-100'
						>
							<View className='w-16 h-16 rounded-lg'>
								<Image
									source={
										doctor.profileImage
											? { uri: doctor.profileImage }
											: require('@/assets/images/patient-avatar.jpeg')
									}
									className='w-full h-full rounded-lg'
								/>
							</View>

							<View className='flex-1 ml-3'>
								<Text className='text-base font-semibold text-gray-900'>
									Dr. {doctor.name}
								</Text>
								<Text className='text-sm text-gray-500'>
									{doctor.specialty}
								</Text>

								<View className='flex-row items-center'>
									{doctor.rating ? (
										<View className='flex-row items-center'>
											<Star
												size={14}
												className='text-violet-600'
												fill='#7c3aed'
											/>
											<Text className='text-violet-600 text-sm ml-1'>
												{doctor.rating}
											</Text>
										</View>
									) : (
										<Text className='text-gray-400 text-sm'>No rating</Text>
									)}
									<Text className='text-gray-400 text-sm ml-3'>
										{doctor.distance}
									</Text>
								</View>
							</View>
						</TouchableOpacity>
					))
				)}
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#FFF',
	},
});
