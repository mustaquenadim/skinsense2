import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

const icons = {
	neurology: 'brain',
	odontology: 'tooth',
	cardiology: 'heartbeat',
	ambulance: 'ambulance',
};

interface ServiceCardProps {
	type: keyof typeof icons;
	label: string;
}

export function ServiceCard({ type, label }: ServiceCardProps) {
	const icon = icons[type];

	return (
		<View style={styles.container}>
			<View style={styles.iconContainer}>
				<FontAwesome5 name={icon} size={24} color='#6C63FF' />
			</View>
			<Text style={styles.label}>{label}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		gap: 8,
	},
	iconContainer: {
		width: 64,
		height: 64,
		borderRadius: 32,
		backgroundColor: '#f3f4f6',
		justifyContent: 'center',
		alignItems: 'center',
	},
	label: {
		fontSize: 12,
		color: '#4b5563',
	},
});
