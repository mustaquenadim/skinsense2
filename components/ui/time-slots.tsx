import React from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	FlatList,
	StyleSheet,
} from 'react-native';

interface TimeSlotsProps {
	timeSlots: string[];
	selectedTime: string;
	onSelectTime: (time: string) => void;
}

export function TimeSlots({
	timeSlots,
	selectedTime,
	onSelectTime,
}: TimeSlotsProps) {
	return (
		<FlatList
			data={timeSlots}
			keyExtractor={(item) => item}
			numColumns={3}
			columnWrapperStyle={styles.columnWrapper}
			renderItem={({ item: time }) => (
				<TouchableOpacity
					onPress={() => onSelectTime(time)}
					style={[
						styles.timeSlot,
						selectedTime === time
							? styles.selectedTimeSlot
							: styles.unselectedTimeSlot,
					]}
				>
					<Text
						style={
							selectedTime === time
								? styles.selectedText
								: styles.unselectedText
						}
					>
						{time}
					</Text>
				</TouchableOpacity>
			)}
			contentContainerStyle={styles.container}
		/>
	);
}

const styles = StyleSheet.create({
	container: {
		justifyContent: 'flex-start',
	},
	columnWrapper: {
		justifyContent: 'flex-start',
		gap: 8,
	},
	timeSlot: {
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderRadius: 12,
		borderWidth: 1,
		margin: 4,
	},
	selectedTimeSlot: {
		backgroundColor: '#7c3aed',
		borderColor: '#7c3aed',
	},
	unselectedTimeSlot: {
		backgroundColor: 'white',
		borderColor: '#6b7280',
	},
	selectedText: {
		color: 'white',
	},
	unselectedText: {
		color: '#6b7280',
	},
});
