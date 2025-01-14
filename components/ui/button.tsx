import React from 'react';
import {
	TouchableOpacity,
	Text,
	StyleSheet,
	ActivityIndicator,
	ViewStyle,
	TextStyle,
} from 'react-native';

interface ButtonProps {
	onPress: () => void;
	title: string;
	variant?: 'primary' | 'secondary';
	loading?: boolean;
	disabled?: boolean;
	style?: ViewStyle;
	textStyle?: TextStyle;
}

export function Button({
	onPress,
	title,
	variant = 'primary',
	loading = false,
	disabled = false,
	style,
	textStyle,
}: ButtonProps) {
	return (
		<TouchableOpacity
			onPress={onPress}
			disabled={disabled || loading}
			style={[
				styles.button,
				variant === 'secondary' && styles.secondaryButton,
				(disabled || loading) && styles.disabledButton,
				style,
			]}
		>
			{loading ? (
				<ActivityIndicator color={variant === 'primary' ? '#fff' : '#6C63FF'} />
			) : (
				<Text
					style={[
						styles.text,
						variant === 'secondary' && styles.secondaryText,
						textStyle,
					]}
				>
					{title}
				</Text>
			)}
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	button: {
		height: 56,
		borderRadius: 12,
		backgroundColor: '#6C63FF',
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: 24,
	},
	secondaryButton: {
		backgroundColor: 'transparent',
		borderWidth: 1,
		borderColor: '#6C63FF',
	},
	disabledButton: {
		opacity: 0.5,
	},
	text: {
		color: '#fff',
		fontSize: 16,
		fontWeight: '600',
	},
	secondaryText: {
		color: '#6C63FF',
	},
});
