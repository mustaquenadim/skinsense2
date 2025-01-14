import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';

interface ScreenHeaderProps {
	title: string;
}

export function ScreenHeader({ title }: ScreenHeaderProps) {
	const router = useRouter();

	return (
		<View style={styles.header}>
			<TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
				<ChevronLeft size={24} color='#000' />
			</TouchableOpacity>
			<Text style={styles.title}>{title}</Text>
			<View style={styles.placeholder} />
		</View>
	);
}

const styles = StyleSheet.create({
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 12,
		paddingVertical: 12,
		backgroundColor: '#fff',
		paddingTop: 40,
	},
	backButton: {
		padding: 4,
	},
	title: {
		fontSize: 16,
		fontWeight: '600',
		color: '#000',
	},
	placeholder: {
		width: 32,
	},
});
