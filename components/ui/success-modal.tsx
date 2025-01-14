import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { Check } from 'lucide-react-native';

interface SuccessModalProps {
	visible: boolean;
	onClose: () => void;
	onChatPress: () => void;
}

export function SuccessModal({
	visible,
	onClose,
	onChatPress,
}: SuccessModalProps) {
	return (
		<Modal transparent visible={visible} animationType='fade'>
			<View className='flex-1 justify-center items-center bg-black/50'>
				<View className='bg-white rounded-3xl p-6 m-4 items-center max-w-sm'>
					<View className='w-16 h-16 rounded-full bg-violet-100 items-center justify-center mb-4'>
						<Check size={32} color='#7c3aed' />
					</View>

					<Text className='text-xl font-semibold text-center mb-2'>
						Payment Success
					</Text>

					<Text className='text-gray-500 text-center mb-6'>
						Your payment has been successful, you can have a consultation
						session with your trusted doctor
					</Text>

					<TouchableOpacity
						onPress={onChatPress}
						className='bg-violet-600 w-full py-4 rounded-xl'
					>
						<Text className='text-white text-center font-semibold'>
							Chat Doctor
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		</Modal>
	);
}
