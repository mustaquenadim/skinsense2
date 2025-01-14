import { addDays, format } from 'date-fns';
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';

interface CalendarPickerProps {
	selectedDate: Date;
	onSelectDate: (date: Date) => void;
}

export function CalendarPicker({
	selectedDate,
	onSelectDate,
}: CalendarPickerProps) {
	const dates = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));

	return (
		<ScrollView
			horizontal
			showsHorizontalScrollIndicator={false}
			className='flex flex-row gap-4'
		>
			<View className='flex-row gap-x-2'>
				{dates.map((date) => {
					const isSelected =
						format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
					return (
						<TouchableOpacity
							key={date.toISOString()}
							onPress={() => onSelectDate(date)}
							className={`items-center justify-center w-16 h-20 rounded-2xl ${
								isSelected ? 'bg-violet-600' : 'bg-gray-100'
							}`}
						>
							<Text
								className={`text-xs ${
									isSelected ? 'text-white' : 'text-gray-500'
								}`}
							>
								{format(date, 'EEE')}
							</Text>
							<Text
								className={`text-lg font-semibold ${
									isSelected ? 'text-white' : 'text-gray-900'
								}`}
							>
								{format(date, 'd')}
							</Text>
						</TouchableOpacity>
					);
				})}
			</View>
		</ScrollView>
	);
}
