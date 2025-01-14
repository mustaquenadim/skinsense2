import { Stack } from 'expo-router';
import React from 'react';

const AuthLayout = () => {
	return (
		<Stack
			screenOptions={{
				headerShown: false,
				contentStyle: {
					backgroundColor: '#fff',
				},
			}}
		>
			<Stack.Screen name='index' />
			<Stack.Screen name='login' />
			<Stack.Screen name='register' />
		</Stack>
	);
};

export default AuthLayout;
