import React, { useEffect, useState } from 'react';
import {
	View,
	Text,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
	SafeAreaView,
	ActivityIndicator,
} from 'react-native';
import { Bell } from 'lucide-react-native';
import { SearchBar } from '@/components/ui/search-bar';
import { ServiceCard } from '@/components/ui/service-card';
import { PromotionBanner } from '@/components/ui/promotion-banner';
import { DoctorCard } from '@/components/ui/doctor-card';
import { useRouter } from 'expo-router';
import { collection, getDocs, query, where, limit } from 'firebase/firestore';
import { db } from '@/firebaseConfig';

const services = [
	{ type: 'odontology', label: 'Odontology' },
	{ type: 'neurology', label: 'Neurology' },
	{ type: 'cardiology', label: 'Cardiology' },
	{ type: 'ambulance', label: 'Ambulance' },
] as const;

interface Doctor {
	id: string;
	name: string;
	specialty: string;
	rating: number;
	profileImage?: string;
	distance?: string;
	role: string;
}

export default function PatientHomeScreen() {
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
			const q = query(usersRef, where('role', '==', 'doctor'), limit(3));
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
			<ScrollView contentContainerStyle={styles.content}>
				<View style={styles.header}>
					<View>
						<Text style={styles.title}>Find your desire</Text>
						<Text style={styles.subtitle}>healt solution</Text>
					</View>
					<TouchableOpacity style={styles.notificationButton}>
						<Bell size={24} color='#1f2937' />
					</TouchableOpacity>
				</View>

				<SearchBar placeholder='Search doctor, drugs, articles...' />

				<View style={styles.section}>
					<View style={styles.sectionHeader}>
						<Text style={styles.sectionTitle}>Our Services</Text>
						<TouchableOpacity>
							<Text style={styles.seeAll}>See all</Text>
						</TouchableOpacity>
					</View>
					<View style={styles.services}>
						{services.map((service) => (
							<ServiceCard
								key={service.type}
								type={service.type}
								label={service.label}
							/>
						))}
					</View>
				</View>

				<PromotionBanner
					title='Early protection for your family health'
					onPress={() => {}}
				/>

				<View style={styles.section}>
					<View style={styles.sectionHeader}>
						<Text style={styles.sectionTitle}>Top Doctors</Text>
						<TouchableOpacity onPress={() => router.push('/top-doctors')}>
							<Text style={styles.seeAll}>See all</Text>
						</TouchableOpacity>
					</View>
					<ScrollView
						horizontal
						showsHorizontalScrollIndicator={false}
						contentContainerStyle={styles.doctors}
					>
						{loading ? (
							<ActivityIndicator size='large' color='#6C63FF' />
						) : error ? (
							<Text style={{ color: 'red' }}>{error}</Text>
						) : doctors.length === 0 ? (
							<Text>No doctors found</Text>
						) : (
							doctors.map((doctor) => (
								<DoctorCard
									key={doctor.id}
									id={doctor.id}
									image={
										doctor.profileImage
											? { uri: doctor.profileImage }
											: require('@/assets/images/patient-avatar.jpeg')
									}
									name={doctor.name}
									specialty={doctor.specialty}
									rating={doctor.rating}
									distance={doctor.distance}
								/>
							))
						)}
					</ScrollView>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
	content: {
		padding: 16,
		gap: 24,
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
	},
	title: {
		fontSize: 24,
		fontWeight: '600',
		color: '#1f2937',
	},
	subtitle: {
		fontSize: 24,
		fontWeight: '600',
		color: '#1f2937',
	},
	notificationButton: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: '#f3f4f6',
		justifyContent: 'center',
		alignItems: 'center',
	},
	section: {
		gap: 16,
	},
	sectionHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	sectionTitle: {
		fontSize: 16,
		fontWeight: '600',
		color: '#1f2937',
	},
	seeAll: {
		fontSize: 14,
		color: '#6C63FF',
	},
	services: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	doctors: {
		gap: 16,
	},
});
