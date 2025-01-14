import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Search } from 'lucide-react-native';

interface SearchBarProps {
	placeholder?: string;
	onChangeText?: (text: string) => void;
}

export function SearchBar({ placeholder, onChangeText }: SearchBarProps) {
	return (
		<View style={styles.container}>
			<Search size={20} color='#9ca3af' />
			<TextInput
				placeholder={placeholder}
				style={styles.input}
				placeholderTextColor='#9ca3af'
				onChangeText={onChangeText}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#f3f4f6',
		borderRadius: 12,
		paddingHorizontal: 12,
		paddingVertical: 8,
		gap: 8,
	},
	input: {
		flex: 1,
		fontSize: 16,
		color: '#1f2937',
	},
});
