import React, { forwardRef } from 'react';
import {
	View,
	TextInput,
	TextInputProps,
	StyleSheet,
	Text,
	ViewStyle,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

interface InputProps extends TextInputProps {
	label?: string;
	error?: string;
	icon?: keyof typeof Feather.glyphMap;
	containerStyle?: ViewStyle;
}

export const Input = forwardRef<TextInput, InputProps>(
	({ label, error, icon, containerStyle, ...props }, ref) => {
		return (
			<View style={[styles.container, containerStyle]}>
				{label && <Text style={styles.label}>{label}</Text>}
				<View
					style={[
						styles.inputContainer,
						error ? styles.inputError : props.value ? styles.inputFilled : null,
					]}
				>
					{icon && (
						<Feather
							name={icon}
							size={20}
							color={error ? '#ef4444' : props.value ? '#6C63FF' : '#9ca3af'}
							style={styles.icon}
						/>
					)}
					<TextInput
						ref={ref}
						style={styles.input}
						placeholderTextColor='#9ca3af'
						{...props}
					/>
				</View>
				{error && <Text style={styles.errorText}>{error}</Text>}
			</View>
		);
	}
);

const styles = StyleSheet.create({
	container: {
		marginBottom: 16,
	},
	label: {
		fontSize: 14,
		fontWeight: '500',
		color: '#374151',
		marginBottom: 4,
	},
	inputContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		borderWidth: 1,
		borderColor: '#e5e7eb',
		borderRadius: 12,
		paddingHorizontal: 12,
		height: 48,
		backgroundColor: '#fff',
	},
	inputError: {
		borderColor: '#ef4444',
	},
	inputFilled: {
		borderColor: '#6C63FF',
	},
	icon: {
		marginRight: 8,
	},
	input: {
		flex: 1,
		fontSize: 16,
		color: '#1f2937',
	},
	errorText: {
		fontSize: 12,
		color: '#ef4444',
		marginTop: 4,
	},
});
