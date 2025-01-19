import React, { useState } from 'react';
import { View, Image, Modal, TouchableOpacity, Dimensions } from 'react-native';
import {
	PinchGestureHandler,
	GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
	useAnimatedGestureHandler,
	useAnimatedStyle,
	useSharedValue,
} from 'react-native-reanimated';

const ImageMessage = ({ images }) => {
	const [modalVisible, setModalVisible] = useState(false);
	const [selectedImage, setSelectedImage] = useState('');
	const scale = useSharedValue(1);

	const pinchHandler = useAnimatedGestureHandler({
		onActive: (event) => {
			scale.value = event.scale;
		},
	});

	const imageStyle = useAnimatedStyle(() => {
		return {
			transform: [{ scale: scale.value }],
		};
	});

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<View>
				<Modal
					animationType='fade'
					transparent={true}
					visible={modalVisible}
					onRequestClose={() => setModalVisible(false)}
				>
					<PinchGestureHandler onGestureEvent={pinchHandler}>
						<Animated.View style={[{ flex: 1 }, imageStyle]}>
							<Image
								source={{ uri: selectedImage }}
								style={{
									width: Dimensions.get('window').width,
									height: Dimensions.get('window').height,
									resizeMode: 'contain',
								}}
							/>
						</Animated.View>
					</PinchGestureHandler>
				</Modal>
				{/* Thumbnail view */}
				{images?.map((image: string, index: number) => (
					<TouchableOpacity
						key={index}
						onPress={() => {
							setSelectedImage(image);
							setModalVisible(true);
						}}
					>
						<Image
							source={{ uri: image }}
							style={{ width: 200, height: 200, margin: 5, borderRadius: 10 }}
						/>
					</TouchableOpacity>
				))}
			</View>
		</GestureHandlerRootView>
	);
};

export default ImageMessage;
