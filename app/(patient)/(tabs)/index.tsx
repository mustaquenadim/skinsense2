import React from 'react';
import {
	View,
	Text,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
	SafeAreaView,
} from 'react-native';
import { Bell } from 'lucide-react-native';
import { SearchBar } from '@/components/ui/search-bar';
import { ServiceCard } from '@/components/ui/service-card';
import { PromotionBanner } from '@/components/ui/promotion-banner';
import { DoctorCard } from '@/components/ui/doctor-card';
import { useRouter } from 'expo-router';

const services = [
	{ type: 'odontology', label: 'Odontology' },
	{ type: 'neurology', label: 'Neurology' },
	{ type: 'cardiology', label: 'Cardiology' },
	{ type: 'ambulance', label: 'Ambulance' },
] as const;

const doctors = [
	{
		id: '1',
		image: 'https://i.pravatar.cc/150?img=8',
		name: 'Dr. Marcus Horiz',
		specialty: 'Physician',
		rating: 4.9,
		distance: '1.2km away',
	},
	{
		id: '2',
		image: 'https://i.pravatar.cc/150?img=9',
		name: 'Dr. Maria Elena',
		specialty: 'Dentist',
		rating: 4.8,
		distance: '1.5km away',
	},
	{
		id: '3',
		image: 'https://i.pravatar.cc/150?img=10',
		name: 'Dr. Stevi Jessi',
		specialty: 'Neurologist',
		rating: 4.8,
		distance: '0.8km away',
	},
];

export default function PatientHomeScreen() {
	const router = useRouter();

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
						{doctors.map((doctor) => (
							<DoctorCard key={doctor.id} {...doctor} />
						))}
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
