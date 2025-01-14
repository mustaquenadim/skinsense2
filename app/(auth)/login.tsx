import React, { useState } from 'react';
import {
	View,
	StyleSheet,
	SafeAreaView,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScreenHeader } from '@/components/ui/screen-header';
import { signInWithEmailAndPassword } from '@firebase/auth';
import { auth, db } from '@/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

export default function LoginScreen() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	const handleLogin = async () => {
		try {
			const userCredential = await signInWithEmailAndPassword(
				auth,
				email,
				password
			);
			if (userCredential.user) {
				const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
				if (userDoc.exists()) {
					const userData = userDoc.data();
					if (userData.role === 'doctor') {
						router.replace('/(doctor)/(tabs)');
					} else {
						router.replace('/(patient)/(tabs)');
					}
				} else {
					setError('User data not found');
				}
			}
		} catch (error: any) {
			console.log(error);
			setError(error.message);
			alert('Sign in failed: ' + error.message);
		}
	};

	return (
		<SafeAreaView style={styles.container}>
			<StatusBar style='dark' />
			<ScreenHeader title='Login' />
			<KeyboardAvoidingView
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
				style={styles.keyboardView}
			>
				<ScrollView
					contentContainerStyle={styles.scrollContent}
					keyboardShouldPersistTaps='handled'
				>
					<View style={styles.form}>
						<Input
							label='Email'
							placeholder='Enter your email'
							value={email}
							onChangeText={setEmail}
							autoCapitalize='none'
							keyboardType='email-address'
							icon='mail'
							error={error}
						/>

						<Input
							label='Password'
							placeholder='Enter your password'
							value={password}
							onChangeText={setPassword}
							secureTextEntry
							icon='lock'
							error={error}
						/>

						<Button
							title='Login'
							onPress={handleLogin}
							loading={loading}
							style={styles.button}
						/>

						{/* <Button
							title='Sign up with Google'
							variant='secondary'
							onPress={() => {}}
							style={{ ...styles.button, borderRadius: 200 }}
						/> */}
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
	keyboardView: {
		flex: 1,
	},
	scrollContent: {
		flexGrow: 1,
		padding: 24,
	},
	form: {
		flex: 1,
		justifyContent: 'center',
	},
	button: {
		marginTop: 12,
	},
});
