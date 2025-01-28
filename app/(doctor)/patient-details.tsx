import React, { useState } from 'react';
import {
	View,
	Text,
	StyleSheet,
	SafeAreaView,
	TouchableOpacity,
	Image,
	ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
	ChevronLeft,
	MoreVertical,
	Star,
	Calendar,
	FileText,
	MessageCircle,
	Phone,
	MapPin,
} from 'lucide-react-native';

const pictures = [
	'https://i.pravatar.cc/150?img=1',
	'https://i.pravatar.cc/150?img=2',
	'https://i.pravatar.cc/150?img=3',
	'https://i.pravatar.cc/150?img=4',
	'https://i.pravatar.cc/150?img=5',
	'https://i.pravatar.cc/150?img=6',
	'https://i.pravatar.cc/150?img=7',
	'https://i.pravatar.cc/150?img=8',
];

export default function PatientDetailsScreen() {
	const router = useRouter();
	const [isAboutExpanded, setIsAboutExpanded] = useState(false);

	return (
		<SafeAreaView style={styles.container}>
			<StatusBar style='dark' />

			{/* Header */}
			<View style={styles.header}>
				<TouchableOpacity onPress={() => router.back()}>
					<ChevronLeft size={24} color='#000' />
				</TouchableOpacity>
				<Text style={styles.headerTitle}>Patients</Text>
				<TouchableOpacity>
					<MoreVertical size={24} color='#000' />
				</TouchableOpacity>
			</View>

			<ScrollView contentContainerStyle={styles.content}>
				{/* Doctor Profile */}
				<View style={styles.doctorProfile}>
					<Image
						source={{
							uri: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-gHJ0mFS0bTpxmp4Zyyox7qiFSEXOsT.png',
						}}
						style={styles.doctorImage}
					/>
					<View style={styles.doctorInfo}>
						<Text style={styles.doctorName}>Dr. Marcus Horizon</Text>
						<Text style={styles.specialty}>Cardiologist</Text>
						<View style={styles.ratingContainer}>
							<Star size={16} color='#6C63FF' fill='#6C63FF' />
							<Text style={styles.rating}>4.7</Text>
							<Text style={styles.distance}>800m away</Text>
						</View>
					</View>
				</View>

				{/* Date Section */}
				<View style={styles.section}>
					<View style={styles.sectionHeader}>
						<Text style={styles.sectionTitle}>Date</Text>
						<TouchableOpacity onPress={() => router.push('/available-time')}>
							<Text style={styles.changeText}>Change</Text>
						</TouchableOpacity>
					</View>
					<View style={styles.dateContainer}>
						<Calendar size={20} color='#6C63FF' />
						<Text style={styles.dateText}>
							Wednesday, Jun 23, 2021 | 10:00 AM
						</Text>
					</View>
				</View>

				{/* Reason Section */}
				<View style={styles.section}>
					<View style={styles.sectionHeader}>
						<Text style={styles.sectionTitle}>Reason</Text>
						<TouchableOpacity>
							<Text style={styles.changeText}>Change</Text>
						</TouchableOpacity>
					</View>
					<View style={styles.reasonContainer}>
						<FileText size={20} color='#6C63FF' />
						<Text style={styles.reasonText}>Chest pain</Text>
					</View>
				</View>

				{/* Pictures Section */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Pictures</Text>
					<View style={styles.picturesGrid}>
						{pictures.slice(0, 4).map((uri, index) => (
							<View key={index} style={styles.pictureContainer}>
								<Image source={{ uri }} style={styles.picture} />
							</View>
						))}
						<TouchableOpacity style={styles.pictureContainer}>
							<Image source={{ uri: pictures[4] }} style={styles.picture} />
							<View style={styles.pictureOverlay}>
								<Text style={styles.pictureOverlayText}>+4</Text>
							</View>
						</TouchableOpacity>
					</View>
				</View>

				{/* About Section */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>About</Text>
					<Text
						style={styles.aboutText}
						numberOfLines={isAboutExpanded ? undefined : 3}
					>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
						eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
						ad minim veniam...
					</Text>
					<TouchableOpacity
						onPress={() => setIsAboutExpanded(!isAboutExpanded)}
					>
						<Text style={styles.readMoreText}>Read more</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>

			{/* Bottom Navigation */}
			<View style={styles.bottomNav}>
				<TouchableOpacity style={styles.navItem}>
					<MessageCircle size={24} color='#6b7280' />
				</TouchableOpacity>
				<TouchableOpacity style={styles.navItem}>
					<FileText size={24} color='#6b7280' />
				</TouchableOpacity>
				<TouchableOpacity style={[styles.navItem, styles.primaryNavItem]}>
					<Phone size={24} color='#fff' />
				</TouchableOpacity>
				<TouchableOpacity style={styles.navItem}>
					<MapPin size={24} color='#6b7280' />
				</TouchableOpacity>
			</View>
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
		padding: 16,
	},
	doctorProfile: {
		flexDirection: 'row',
		marginBottom: 24,
	},
	doctorImage: {
		width: 80,
		height: 80,
		borderRadius: 12,
		marginRight: 16,
	},
	doctorInfo: {
		flex: 1,
		justifyContent: 'center',
	},
	doctorName: {
		fontSize: 18,
		fontWeight: '600',
		color: '#000',
		marginBottom: 4,
	},
	specialty: {
		fontSize: 14,
		color: '#6b7280',
		marginBottom: 4,
	},
	ratingContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	rating: {
		fontSize: 14,
		color: '#6C63FF',
		marginLeft: 4,
		marginRight: 8,
	},
	distance: {
		fontSize: 14,
		color: '#6b7280',
	},
	section: {
		marginBottom: 24,
	},
	sectionHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 12,
	},
	sectionTitle: {
		fontSize: 16,
		fontWeight: '600',
		color: '#000',
	},
	changeText: {
		fontSize: 14,
		color: '#6C63FF',
	},
	dateContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12,
	},
	dateText: {
		fontSize: 14,
		color: '#374151',
	},
	reasonContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12,
	},
	reasonText: {
		fontSize: 14,
		color: '#374151',
	},
	picturesGrid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 8,
	},
	pictureContainer: {
		width: 80,
		height: 80,
		borderRadius: 12,
		overflow: 'hidden',
	},
	picture: {
		width: '100%',
		height: '100%',
	},
	pictureOverlay: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: 'rgba(0,0,0,0.4)',
		justifyContent: 'center',
		alignItems: 'center',
	},
	pictureOverlayText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: '600',
	},
	aboutText: {
		fontSize: 14,
		color: '#6b7280',
		lineHeight: 20,
		marginBottom: 8,
	},
	readMoreText: {
		fontSize: 14,
		color: '#6C63FF',
	},
	bottomNav: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center',
		paddingVertical: 12,
		borderTopWidth: 1,
		borderTopColor: '#f3f4f6',
		backgroundColor: '#fff',
	},
	navItem: {
		width: 48,
		height: 48,
		borderRadius: 24,
		justifyContent: 'center',
		alignItems: 'center',
	},
	primaryNavItem: {
		backgroundColor: '#6C63FF',
	},
});
