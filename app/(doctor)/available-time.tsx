import React, { useState, useEffect } from 'react';
import {
	View,
	Text,
	StyleSheet,
	SafeAreaView,
	TouchableOpacity,
	ScrollView,
	Alert,
	ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft, MoreVertical, ChevronRight } from 'lucide-react-native';
import {
	format,
	addDays,
	startOfMonth,
	endOfMonth,
	isSameMonth,
} from 'date-fns';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/firebaseConfig';

interface TimeSlot {
	time: string;
	available: boolean;
	selected: boolean; // New property
}

// Update initial timeSlots
const initialTimeSlots: TimeSlot[] = [
	{ time: '09:00 AM', available: false, selected: false },
	{ time: '10:00 AM', available: false, selected: false },
	{ time: '11:00 AM', available: false, selected: false },
	{ time: '01:00 PM', available: false, selected: false },
	{ time: '02:00 PM', available: false, selected: false },
	{ time: '03:00 PM', available: false, selected: false },
	{ time: '04:00 PM', available: false, selected: false },
	{ time: '07:00 PM', available: false, selected: false },
	{ time: '08:00 PM', available: false, selected: false },
];

export default function UpdateTimeScreen() {
	const router = useRouter();
	const today = new Date();
	const [selectedDate, setSelectedDate] = useState(addDays(today, 2));
	const [slots, setSlots] = useState<TimeSlot[]>(initialTimeSlots);
	const [loading, setLoading] = useState(true);
	const [monthIndex, setMonthIndex] = useState(0);

	const getDatesForNextSixMonths = () => {
		const dates = [];
		let currentDate = today;

		for (let i = 0; i < 180; i++) {
			// 6 months approx
			dates.push(currentDate);
			currentDate = addDays(currentDate, 1);
		}

		return dates;
	};

	const dates = getDatesForNextSixMonths();
	const [currentMonth, setCurrentMonth] = useState(format(today, 'MMMM yyyy'));

	// Group dates by month
	const datesByMonth = dates.reduce<{ [key: string]: Date[] }>((acc, date) => {
		const monthKey = format(date, 'MMMM yyyy');
		if (!acc[monthKey]) {
			acc[monthKey] = [];
		}
		acc[monthKey].push(date);
		return acc;
	}, {});
	const months = Object.keys(datesByMonth);

	useEffect(() => {
		fetchAvailability();
	}, [selectedDate]);

	const fetchAvailability = async () => {
		try {
			setLoading(true);
			if (!auth.currentUser?.uid) {
				throw new Error('User not authenticated');
			}

			const doctorId = auth.currentUser.uid;
			const availabilityRef = doc(db, 'doctorAvailability', doctorId);
			const docSnap = await getDoc(availabilityRef);

			if (docSnap.exists()) {
				const data = docSnap.data();
				const dateKey = selectedDate.toISOString().split('T')[0]; // Get just the date part

				if (data && data[dateKey]) {
					const availableSlots = data[dateKey].availableSlots;
					setSlots((prevSlots) =>
						prevSlots.map((slot) => ({
							...slot,
							available: availableSlots.includes(slot.time),
							selected: availableSlots.includes(slot.time),
						}))
					);
				} else {
					setSlots(initialTimeSlots);
				}
			}
		} catch (error) {
			console.error('Error fetching availability:', error);
			Alert.alert('Error', 'Failed to load availability');
		} finally {
			setLoading(false);
		}
	};

	const toggleTimeSlot = (time: string) => {
		setSlots((prevSlots) =>
			prevSlots.map((slot) =>
				slot.time === time
					? { ...slot, selected: !slot.selected, available: !slot.available }
					: slot
			)
		);
	};

	const handleUpdateTime = async () => {
		try {
			if (!auth.currentUser?.uid) {
				Alert.alert('Error', 'You must be logged in');
				return;
			}

			const doctorId = auth.currentUser.uid;
			const dateKey = selectedDate.toISOString().split('T')[0];

			const availabilityRef = doc(db, 'doctorAvailability', doctorId);
			await setDoc(
				availabilityRef,
				{
					[dateKey]: {
						doctorId,
						availableSlots: slots
							.filter((slot) => slot.available)
							.map((slot) => slot.time),
						updatedAt: new Date().toISOString(),
					},
				},
				{ merge: true }
			);

			router.back();
		} catch (error) {
			console.error('Error updating availability:', error);
			Alert.alert('Error', 'Failed to update availability');
		}
	};

	const handlePrevMonth = () => {
		if (monthIndex > 0) {
			setMonthIndex((prev) => prev - 1);
			const newMonth = months[monthIndex - 1];
			setCurrentMonth(newMonth);
			// Set selected date to first date of new month
			const firstDateOfMonth = datesByMonth[newMonth][0];
			setSelectedDate(firstDateOfMonth);
		}
	};

	const handleNextMonth = () => {
		if (monthIndex < months.length - 1) {
			setMonthIndex((prev) => prev + 1);
			const newMonth = months[monthIndex + 1];
			setCurrentMonth(newMonth);
			// Set selected date to first date of new month
			const firstDateOfMonth = datesByMonth[newMonth][0];
			setSelectedDate(firstDateOfMonth);
		}
	};

	if (loading) {
		return (
			<View style={[styles.container, styles.centered]}>
				<ActivityIndicator size='large' color='#6C63FF' />
			</View>
		);
	}

	return (
		<SafeAreaView style={styles.container}>
			<StatusBar style='dark' />

			{/* Header */}
			{/* <View style={styles.header}>
				<TouchableOpacity onPress={() => router.back()}>
					<ChevronLeft size={24} color='#000' />
				</TouchableOpacity>
				<Text style={styles.headerTitle}>Update Time</Text>
				<TouchableOpacity>
					<MoreVertical size={24} color='#000' />
				</TouchableOpacity>
			</View> */}

			<ScrollView contentContainerStyle={styles.content}>
				{/* Month and Date Selection */}
				<View style={styles.monthContainer}>
					<TouchableOpacity
						onPress={handlePrevMonth}
						disabled={monthIndex === 0}
						style={styles.monthArrow}
					>
						<ChevronLeft
							size={24}
							color={monthIndex === 0 ? '#9CA3AF' : '#1F2937'}
						/>
					</TouchableOpacity>

					<Text style={styles.monthText}>{currentMonth}</Text>

					<TouchableOpacity
						onPress={handleNextMonth}
						disabled={monthIndex === months.length - 1}
						style={styles.monthArrow}
					>
						<ChevronRight
							size={24}
							color={monthIndex === months.length - 1 ? '#9CA3AF' : '#1F2937'}
						/>
					</TouchableOpacity>
				</View>

				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={styles.dateList}
				>
					{datesByMonth[currentMonth].map((date) => (
						<TouchableOpacity
							key={date.toISOString()}
							style={[
								styles.dateItem,
								date.toDateString() === selectedDate.toDateString() &&
									styles.selectedDateItem,
							]}
							onPress={() => setSelectedDate(date)}
						>
							<Text
								style={[
									styles.dayText,
									date.toDateString() === selectedDate.toDateString() &&
										styles.selectedDateText,
								]}
							>
								{format(date, 'EEE')}
							</Text>
							<Text
								style={[
									styles.dateText,
									date.toDateString() === selectedDate.toDateString() &&
										styles.selectedDateText,
								]}
							>
								{format(date, 'd')}
							</Text>
						</TouchableOpacity>
					))}
				</ScrollView>

				{/* Time Slots */}
				<View style={styles.timeSlots}>
					{slots.map((slot) => (
						<TouchableOpacity
							key={slot.time}
							style={[
								styles.timeSlot,
								slot.selected && styles.selectedTimeSlot,
								!slot.available && styles.unavailableTimeSlot,
							]}
							onPress={() => toggleTimeSlot(slot.time)}
						>
							<Text
								style={[
									styles.timeText,
									slot.selected && styles.selectedTimeText,
									!slot.available && styles.unavailableTimeText,
								]}
							>
								{slot.time}
							</Text>
						</TouchableOpacity>
					))}
				</View>

				{/* Update Button */}
				<TouchableOpacity
					style={styles.updateButton}
					onPress={handleUpdateTime}
				>
					<Text style={styles.updateButtonText}>Update Time</Text>
				</TouchableOpacity>
			</ScrollView>
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
	content: {
		padding: 16,
	},
	dateList: {
		paddingVertical: 8,
		gap: 12,
	},
	dateItem: {
		width: 60,
		paddingVertical: 12,
		borderRadius: 20,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
		borderWidth: 1,
		borderColor: '#e5e7eb',
	},
	selectedDateItem: {
		backgroundColor: '#6C63FF',
		borderColor: '#6C63FF',
	},
	dayText: {
		fontSize: 14,
		color: '#6b7280',
		marginBottom: 4,
	},
	dateText: {
		fontSize: 16,
		fontWeight: '600',
		color: '#000',
	},
	selectedDateText: {
		color: '#fff',
	},
	timeSlots: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 12,
		marginTop: 24,
	},
	timeSlot: {
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderRadius: 20,
		backgroundColor: '#fff',
		borderWidth: 1,
		borderColor: '#e5e7eb',
	},
	selectedTimeSlot: {
		backgroundColor: '#6C63FF',
		borderColor: '#6C63FF',
	},
	unavailableTimeSlot: {
		backgroundColor: '#f3f4f6',
		borderColor: '#f3f4f6',
	},
	timeText: {
		fontSize: 14,
		color: '#000',
	},
	selectedTimeText: {
		color: '#fff',
	},
	unavailableTimeText: {
		color: '#9ca3af',
	},
	updateButton: {
		backgroundColor: '#6C63FF',
		borderRadius: 25,
		paddingVertical: 16,
		marginTop: 32,
		alignItems: 'center',
	},
	updateButtonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: '600',
	},
	centered: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	monthContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 16,
		paddingVertical: 12,
		marginBottom: 8,
	},
	monthArrow: {
		padding: 8,
	},
	monthText: {
		fontSize: 18,
		fontWeight: '600',
		color: '#1f2937',
	},
	differentMonthItem: {
		opacity: 0.5,
	},
});
