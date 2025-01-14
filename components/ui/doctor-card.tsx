import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Star } from 'lucide-react-native';

interface DoctorCardProps {
	image: string;
	name: string;
	specialty: string;
	rating: number;
	distance: string;
}

export function DoctorCard({
	image,
	name,
	specialty,
	rating,
	distance,
}: DoctorCardProps) {
	return (
		<View style={styles.container}>
			<Image source={{ uri: image }} style={styles.image} />
			<Text style={styles.name} numberOfLines={1} ellipsizeMode='tail'>
				{name}
			</Text>
			<Text style={styles.specialty}>{specialty}</Text>
			<View style={styles.details}>
				<View style={styles.rating}>
					<Star size={14} color='#6C63FF' fill='#6C63FF' />
					<Text style={styles.ratingText}>{rating}</Text>
				</View>
				<Text style={styles.distance}>{distance}</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		width: 120,
		alignItems: 'center',
		borderStyle: 'solid',
		borderWidth: 1,
		borderColor: '#E8F3F1',
		borderRadius: 12,
		padding: 8,
	},
	image: {
		width: 80,
		height: 80,
		borderRadius: 40,
		marginBottom: 8,
	},
	name: {
		width: '100%',
		fontSize: 14,
		fontWeight: '600',
		color: '#1f2937',
		textAlign: 'center',
	},
	specialty: {
		fontSize: 12,
		color: '#6b7280',
		marginBottom: 4,
		textAlign: 'center',
	},
	details: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
	},
	rating: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 4,
	},
	ratingText: {
		fontSize: 11,
		color: '#6C63FF',
	},
	distance: {
		fontSize: 11,
		color: '#9ca3af',
	},
});
