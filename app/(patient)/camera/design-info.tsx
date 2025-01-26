import React, { useEffect, useState } from 'react';
import {
	View,
	Text,
	StyleSheet,
	SafeAreaView,
	TouchableOpacity,
	Image,
	ScrollView,
	ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft, MoreVertical, Info } from 'lucide-react-native';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { DoctorCard } from '@/components/ui/doctor-card';

type Tab = 'description' | 'doctors';

interface Doctor {
	id: string;
	name: string;
	specialty: string;
	image: string;
	rating: number;
	distance: string;
}

export default function DiseaseInfoScreen() {
	const router = useRouter();
	const [activeTab, setActiveTab] = useState<Tab>('description');
	const [doctors, setDoctors] = useState<Doctor[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const fetchDoctors = async () => {
			try {
				setLoading(true);
				const doctorsRef = collection(db, 'users');
				const q = query(doctorsRef, where('role', '==', 'doctor'));
				const querySnapshot = await getDocs(q);

				const doctorsData = querySnapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
					// Provide default values for required fields
					image: doc.data().image || 'https://i.pravatar.cc/150',
					rating: doc.data().rating || 4.5,
					distance: doc.data().distance || '1.2km away',
				})) as Doctor[];

				setDoctors(doctorsData);
			} catch (error) {
				console.error('Error fetching doctors:', error);
			} finally {
				setLoading(false);
			}
		};

		if (activeTab === 'doctors') {
			fetchDoctors();
		}
	}, [activeTab]);

	const symptoms = [
		'Melasma is characterized by yellow or white scaly patches that flake off',
		'Affected area may be itchy, greasy, or oily',
		'Over time, Melasma can cause a red rash. This rash may appear brown or gray on darker skin.',
	];

	return (
		<SafeAreaView style={styles.container}>
			<StatusBar style='dark' />

			{/* Header */}
			<View style={styles.header}>
				<TouchableOpacity onPress={() => router.back()}>
					<ChevronLeft size={24} color='#000' />
				</TouchableOpacity>
				<Text style={styles.headerTitle}>Detected Diseases</Text>
				<TouchableOpacity>
					<MoreVertical size={24} color='#000' />
				</TouchableOpacity>
			</View>

			<ScrollView style={styles.content}>
				{/* Disease Card */}
				<View style={styles.diseaseCard}>
					<Text style={styles.diseaseTitle}>Disease: Melasma</Text>

					{/* Image Carousel */}
					<View style={styles.imageContainer}>
						<Image
							source={{
								uri: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-FOwB0Y9tFTDU6mQY12ZkBNCPCFDC6f.png',
							}}
							style={styles.diseaseImage}
							resizeMode='cover'
						/>
						<View style={styles.carouselDots}>
							<View style={[styles.dot, styles.activeDot]} />
							<View style={styles.dot} />
							<View style={styles.dot} />
						</View>
					</View>

					{/* Why Section */}
					<View style={styles.whySection}>
						<Text style={styles.whyTitle}>Why Melasma?</Text>
						{symptoms.map((symptom, index) => (
							<View key={index} style={styles.symptomItem}>
								<Text style={styles.bulletPoint}>•</Text>
								<Text style={styles.symptomText}>{symptom}</Text>
							</View>
						))}
					</View>
				</View>

				{/* Tabs */}
				<View style={styles.tabContainer}>
					<TouchableOpacity
						style={[
							styles.tab,
							activeTab === 'description' && styles.activeTab,
						]}
						onPress={() => setActiveTab('description')}
					>
						<Text
							style={[
								styles.tabText,
								activeTab === 'description' && styles.activeTabText,
							]}
						>
							Description
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={[styles.tab, activeTab === 'doctors' && styles.activeTab]}
						onPress={() => setActiveTab('doctors')}
					>
						<Text
							style={[
								styles.tabText,
								activeTab === 'doctors' && styles.activeTabText,
							]}
						>
							Doctors
						</Text>
					</TouchableOpacity>
				</View>

				{/* Tab Content */}
				<View style={styles.tabContent}>
					{activeTab === 'description' ? (
						<Text style={styles.descriptionText}>
							Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed
							tortor nonummy pretium morbi quam. Interdum vitae a sit integer
							urna sem. Viverra ac nisl suspendisse donec. Sollicitudin
							scelerisque semper tempus viverra.
						</Text>
					) : (
						<View style={styles.doctorsContainer}>
							{loading ? (
								<ActivityIndicator size='large' color='#6C63FF' />
							) : doctors.length > 0 ? (
								doctors.map((doctor) => (
									<TouchableOpacity
										key={doctor.id}
										onPress={() => router.push(`/doctor/${doctor.id}`)}
									>
										<DoctorCard
											key={doctor.id}
											id={doctor.id}
											image={
												doctor.image
													? { uri: doctor.image }
													: require('@/assets/images/patient-avatar.jpeg')
											}
											name={doctor.name}
											specialty={doctor.specialty}
											rating={doctor.rating}
											distance={doctor.distance}
										/>
									</TouchableOpacity>
								))
							) : (
								<Text style={styles.noDataText}>No doctors found</Text>
							)}
						</View>
					)}
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
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 16,
		paddingVertical: 12,
		borderBottomWidth: 1,
		borderBottomColor: '#f3f4f6',
	},
	headerTitle: {
		fontSize: 16,
		fontWeight: '600',
		color: '#000',
	},
	content: {
		flex: 1,
	},
	diseaseCard: {
		margin: 16,
		padding: 16,
		backgroundColor: '#fff',
		borderRadius: 12,
		borderWidth: 1,
		borderColor: '#e5e7eb',
	},
	diseaseTitle: {
		fontSize: 16,
		fontWeight: '600',
		color: '#6C63FF',
		marginBottom: 12,
	},
	imageContainer: {
		width: '100%',
		height: 150,
		borderRadius: 8,
		overflow: 'hidden',
		marginBottom: 16,
	},
	diseaseImage: {
		width: '100%',
		height: '100%',
	},
	carouselDots: {
		position: 'absolute',
		bottom: 8,
		left: 0,
		right: 0,
		flexDirection: 'row',
		justifyContent: 'center',
		gap: 8,
	},
	dot: {
		width: 8,
		height: 8,
		borderRadius: 4,
		backgroundColor: '#fff',
		opacity: 0.5,
	},
	activeDot: {
		opacity: 1,
	},
	whySection: {
		gap: 8,
	},
	whyTitle: {
		fontSize: 14,
		fontWeight: '600',
		color: '#000',
		marginBottom: 4,
	},
	symptomItem: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		gap: 8,
	},
	bulletPoint: {
		fontSize: 14,
		color: '#374151',
	},
	symptomText: {
		flex: 1,
		fontSize: 14,
		color: '#374151',
		lineHeight: 20,
	},
	tabContainer: {
		flexDirection: 'row',
		backgroundColor: '#6C63FF',
		borderRadius: 8,
		margin: 16,
		padding: 4,
	},
	tab: {
		flex: 1,
		paddingVertical: 8,
		alignItems: 'center',
		borderRadius: 6,
	},
	activeTab: {
		backgroundColor: '#fff',
	},
	tabText: {
		fontSize: 14,
		fontWeight: '500',
		color: '#fff',
	},
	activeTabText: {
		color: '#6C63FF',
	},
	tabContent: {
		margin: 16,
		marginTop: 0,
	},
	descriptionText: {
		fontSize: 14,
		color: '#fff',
		lineHeight: 20,
		backgroundColor: '#6C63FF',
		padding: 16,
		borderRadius: 12,
	},
	doctorsContainer: {
		gap: 12,
	},
	loadingText: {
		fontSize: 14,
		color: '#6b7280',
		textAlign: 'center',
		padding: 16,
	},
	noDataText: {
		fontSize: 14,
		color: '#6b7280',
		textAlign: 'center',
		padding: 16,
	},
});
