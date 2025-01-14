import React, { useState } from 'react';
import {
	View,
	StyleSheet,
	SafeAreaView,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	Text,
} from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { auth, db } from '@/firebaseConfig';
import { createUserWithEmailAndPassword, updateProfile } from '@firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export default function RegisterScreen() {
	const [role, setRole] = useState<'doctor' | 'patient' | null>(null);
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	const handleRegister = async () => {
		if (!role) {
			setError('Please select a role');
			return;
		}

		try {
			setLoading(true);
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			);
			if (userCredential.user) {
				await updateProfile(userCredential.user, {
					displayName: name,
				});

				await setDoc(doc(db, 'users', userCredential.user.uid), {
					name,
					email,
					role,
					createdAt: new Date().toISOString(),
				});

				if (role === 'doctor') {
					router.replace('/(doctor)/(tabs)');
				} else {
					router.replace('/(patient)/(tabs)');
				}
			}
		} catch (error: any) {
			console.log(error);
			setError('Registration failed: ' + error.message);
			alert('Sign in failed: ' + error.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<SafeAreaView style={styles.container}>
			<StatusBar style='dark' />
			<ScreenHeader title='Sign Up' />
			<KeyboardAvoidingView
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
				style={styles.keyboardView}
			>
				<ScrollView
					contentContainerStyle={styles.scrollContent}
					keyboardShouldPersistTaps='handled'
				>
					<View style={styles.form}>
						<View>
							<Text style={styles.roleLabel}>Select your role</Text>
							<View style={styles.roleButtons}>
								<Button
									title='Doctor'
									onPress={() => setRole('doctor')}
									variant={role === 'doctor' ? 'primary' : 'secondary'}
									style={styles.roleButton}
								/>
								<Button
									title='Patient'
									onPress={() => setRole('patient')}
									variant={role === 'patient' ? 'primary' : 'secondary'}
									style={styles.roleButton}
								/>
							</View>
						</View>

						<Input
							placeholder='Enter your name'
							value={name}
							onChangeText={setName}
							autoCapitalize='none'
							keyboardType='default'
							icon='user'
							error={error}
						/>

						<Input
							placeholder='Enter your email'
							value={email}
							onChangeText={setEmail}
							autoCapitalize='none'
							keyboardType='email-address'
							icon='mail'
							error={error}
						/>

						<Input
							placeholder='Create a password'
							value={password}
							onChangeText={setPassword}
							secureTextEntry
							icon='lock'
							error={error}
						/>

						<Button
							title='Sign Up'
							onPress={handleRegister}
							loading={loading}
							style={styles.button}
						/>

						{/* <Button
							title='Sign up with Google'
							variant='secondary'
							onPress={() => {}}
							style={styles.button}
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
	roleLabel: {
		fontSize: 16,
		fontWeight: '600',
		color: '#374151',
		marginBottom: 8,
		marginTop: 16,
		textAlign: 'center',
	},
	roleButtons: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 24,
		marginTop: 8,
	},
	roleButton: {
		flex: 1,
		marginHorizontal: 4,
	},
});
