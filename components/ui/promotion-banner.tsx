import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

interface PromotionBannerProps {
	title: string;
	buttonText?: string;
	onPress: () => void;
}

export function PromotionBanner({
	title,
	buttonText,
	onPress,
}: PromotionBannerProps) {
	return (
		<View style={styles.container}>
			<View style={styles.content}>
				<Text style={styles.title}>{title}</Text>
				<TouchableOpacity style={styles.button} onPress={onPress}>
					<Text style={styles.buttonText}>
						{buttonText ? buttonText : 'Learn more'}
					</Text>
				</TouchableOpacity>
			</View>
			<Image
				source={require('@/assets/images/doctor-banner.png')}
				style={styles.image}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		backgroundColor: '#f0f9ff',
		borderRadius: 12,
		padding: 16,
		overflow: 'hidden',
		position: 'relative',
	},
	content: {
		flex: 1,
		justifyContent: 'center',
		gap: 12,
	},
	title: {
		width: '70%',
		fontSize: 22,
		fontWeight: '600',
		color: '#1f2937',
	},
	button: {
		backgroundColor: '#6C63FF',
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderRadius: 20,
		alignSelf: 'flex-start',
	},
	buttonText: {
		color: '#fff',
		fontSize: 14,
		fontWeight: '500',
	},
	image: {
		position: 'absolute',
		right: 10,
		bottom: -4,
		width: 100,
		height: 120,
		objectFit: 'contain',
	},
});
