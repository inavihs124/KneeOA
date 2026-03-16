import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useState } from 'react';
import { api, setToken } from '../utils/apiClient';
import { storage } from '../utils/dataStorage';

interface Props { navigation: any; }

const OnboardingScreen: React.FC<Props> = ({ navigation }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [oaStage, setOaStage] = useState<'mild' | 'moderate' | 'severe'>('moderate');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if(!email || !password) return Alert.alert('Error', 'Please fill all fields');
        setLoading(true);
        try {
            const data = await api.login({ email, password });
            setToken(data.token);
            await storage.saveToken(data.token);
            await storage.saveUser(data.user);
            navigation.replace('Main');
        } catch(err: any) {
            Alert.alert('Login Failed', err.message || 'Please try again');
        } finally { setLoading(false); }
    };

    const handleRegister = async () => {
        if(!email || !password || !firstName || !lastName || !age) {
            return Alert.alert('Error', 'Please fill all required fields');
        }
        setLoading(true);
        try {
            const data = await api.register({
                email, password, firstName, lastName,
                age: parseInt(age), gender: gender || 'other', oaStage
            });
            setToken(data.token);
            await storage.saveToken(data.token);
            navigation.replace('Main');
        } catch(err: any) {
            Alert.alert('Registration Failed', err.message || 'Please try again');
        } finally { setLoading(false); }
    };

    const stageOptions: Array<'mild' | 'moderate' | 'severe'> = ['mild', 'moderate', 'severe'];

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.logo}>🦿</Text>
                    <Text style={styles.title}>ArthroEase</Text>
                    <Text style={styles.subtitle}>Adaptive Knee Pain Management</Text>
                </View>

                {/* Form */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>{isLogin ? 'Welcome Back' : 'Create Account'}</Text>

                    {!isLogin && (
                        <>
                            <TextInput style={styles.input} placeholder="First Name" placeholderTextColor="#666" value={firstName} onChangeText={setFirstName} />
                            <TextInput style={styles.input} placeholder="Last Name" placeholderTextColor="#666" value={lastName} onChangeText={setLastName} />
                            <TextInput style={styles.input} placeholder="Age" placeholderTextColor="#666" value={age} onChangeText={setAge} keyboardType="numeric" />
                            <TextInput style={styles.input} placeholder="Gender" placeholderTextColor="#666" value={gender} onChangeText={setGender} />

                            <Text style={styles.label}>OA Stage</Text>
                            <View style={styles.stageRow}>
                                {stageOptions.map(stage => (
                                    <TouchableOpacity key={stage} style={[styles.stageBtn, oaStage === stage && styles.stageBtnActive]}
                                        onPress={() => setOaStage(stage)}>
                                        <Text style={[styles.stageBtnText, oaStage === stage && styles.stageBtnTextActive]}>
                                            {stage.charAt(0).toUpperCase() + stage.slice(1)}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </>
                    )}

                    <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#666" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
                    <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#666" value={password} onChangeText={setPassword} secureTextEntry />

                    <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={isLogin ? handleLogin : handleRegister} disabled={loading}>
                        <Text style={styles.buttonText}>{loading ? 'Please wait...' : isLogin ? 'Log In' : 'Sign Up'}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setIsLogin(!isLogin)} style={styles.switchBtn}>
                        <Text style={styles.switchText}>
                            {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Log In'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0A1628' },
    scroll: { flexGrow: 1, justifyContent: 'center', padding: 24 },
    header: { alignItems: 'center', marginBottom: 32 },
    logo: { fontSize: 64 },
    title: { fontSize: 36, fontWeight: '800', color: '#00E5A0', marginTop: 8 },
    subtitle: { fontSize: 16, color: '#8899AA', marginTop: 4 },
    card: { backgroundColor: '#12233D', borderRadius: 20, padding: 24, borderWidth: 1, borderColor: '#1E3A5F' },
    cardTitle: { fontSize: 24, fontWeight: '700', color: '#FFF', marginBottom: 20, textAlign: 'center' },
    input: { backgroundColor: '#0A1628', borderRadius: 12, padding: 16, fontSize: 16, color: '#FFF', marginBottom: 12, borderWidth: 1, borderColor: '#1E3A5F' },
    label: { color: '#8899AA', fontSize: 14, marginBottom: 8, marginTop: 4 },
    stageRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
    stageBtn: { flex: 1, padding: 12, borderRadius: 10, backgroundColor: '#0A1628', borderWidth: 1, borderColor: '#1E3A5F', alignItems: 'center' },
    stageBtnActive: { backgroundColor: '#00E5A0', borderColor: '#00E5A0' },
    stageBtnText: { color: '#8899AA', fontWeight: '600' },
    stageBtnTextActive: { color: '#0A1628' },
    button: { backgroundColor: '#00E5A0', borderRadius: 14, padding: 18, alignItems: 'center', marginTop: 8 },
    buttonDisabled: { opacity: 0.6 },
    buttonText: { color: '#0A1628', fontSize: 18, fontWeight: '700' },
    switchBtn: { marginTop: 16, alignItems: 'center' },
    switchText: { color: '#00E5A0', fontSize: 14 }
});

export default OnboardingScreen;
