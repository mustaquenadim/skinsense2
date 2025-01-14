import React from 'react';
import {
	View,
	Text,
	StyleSheet,
	Image,
	TouchableOpacity,
	SafeAreaView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft, MoreVertical } from 'lucide-react-native';

export default function AnalysisScreen() {
	const router = useRouter();
	const { imageUri } = useLocalSearchParams();

	return (
		<SafeAreaView style={styles.container}>
			<StatusBar style='dark' />

			{/* Header */}
			<View style={styles.header}>
				<TouchableOpacity onPress={() => router.back()}>
					<ChevronLeft size={24} color='#000' />
				</TouchableOpacity>
				<Text style={styles.headerTitle}>Problems</Text>
				<TouchableOpacity>
					<MoreVertical size={24} color='#000' />
				</TouchableOpacity>
			</View>

			{/* Captured Image */}
			<View style={styles.imageContainer}>
				<Image
					source={{ uri: imageUri as string }}
					style={styles.capturedImage}
					resizeMode='cover'
				/>
			</View>

			{/* Analysis Results */}
			<View style={styles.resultsContainer}>
				<Text style={styles.resultsTitle}>Your Problem</Text>
				<View style={styles.problemsList}>
					<View style={styles.problemItem}>
						<Text style={styles.problemText}>• Melasma Detected</Text>
					</View>
					<View style={styles.problemItem}>
						<Text style={styles.problemText}>• Type: Jenis Melasma</Text>
					</View>
					<View style={styles.problemItem}>
						<Text style={styles.problemText}>• Contact Doctor immediately</Text>
					</View>
				</View>
			</View>

			{/* Action Buttons */}
			<View style={styles.actionButtons}>
				<TouchableOpacity
					style={[styles.button, styles.recaptureButton]}
					onPress={() => router.back()}
				>
					<Text style={styles.recaptureButtonText}>Re-Capture</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[styles.button, styles.nextButton]}
					onPress={() => router.push('/(patient)/camera/design-info')}
				>
					<Text style={styles.nextButtonText}>Next</Text>
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
	imageContainer: {
		width: '100%',
		height: 300,
		backgroundColor: '#f3f4f6',
	},
	capturedImage: {
		width: '100%',
		height: '100%',
	},
	resultsContainer: {
		padding: 20,
	},
	resultsTitle: {
		fontSize: 16,
		fontWeight: '600',
		color: '#000',
		marginBottom: 12,
	},
	problemsList: {
		gap: 8,
	},
	problemItem: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	problemText: {
		fontSize: 14,
		color: '#374151',
	},
	actionButtons: {
		flexDirection: 'row',
		gap: 12,
		padding: 20,
		marginTop: 'auto',
	},
	button: {
		flex: 1,
		height: 48,
		borderRadius: 24,
		justifyContent: 'center',
		alignItems: 'center',
	},
	recaptureButton: {
		backgroundColor: '#f3f4f6',
	},
	recaptureButtonText: {
		color: '#374151',
		fontSize: 14,
		fontWeight: '600',
	},
	nextButton: {
		backgroundColor: '#6C63FF',
	},
	nextButtonText: {
		color: '#fff',
		fontSize: 14,
		fontWeight: '600',
	},
});
