import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import Header from '../components/Header';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Onboarding({ navigation, onComplete }: any) {
    const [firstName, setFirstName] = useState("");
    const [email, setEmail] = useState("");

    const isFirstNameValid = (value: string) =>
        value.trim().length > 0 && /^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/.test(value.trim());

    const isEmailValid = (value: string) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

    const isFormValid = isFirstNameValid(firstName) && isEmailValid(email);

    const handleNext = async () => {
        await AsyncStorage.setItem('onboardingCompleted', '1');
        onComplete();
    };


    return (
        <KeyboardAvoidingView
            className="flex-1"
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View className="flex-[0.15]">
                <Header />
            </View>

            <View className="flex-[0.75] bg-[#495E57] justify-center px-6">
                <Text className="text-center text-3xl font-extrabold text-[#F4CE14] mb-8 tracking-wide">
                    Let us get to know you
                </Text>

                <Text className="text-white text-sm font-semibold mb-2 ml-1">First Name</Text>
                <TextInput
                    value={firstName}
                    onChangeText={setFirstName}
                    placeholder="First Name"
                    placeholderTextColor="#aaa"
                    keyboardAppearance="dark"
                    className={`border-2 rounded-xl px-4 py-3 text-white text-base mb-1 ${firstName.length > 0 && !isFirstNameValid(firstName)
                        ? 'border-red-400'
                        : 'border-white'
                        }`}
                />
                {firstName.length > 0 && !isFirstNameValid(firstName) && (
                    <Text className="text-red-400 text-xs mb-4 ml-1">
                        Please enter a valid first name (letters only).
                    </Text>
                )}
                {!(firstName.length > 0 && !isFirstNameValid(firstName)) && (
                    <View className="mb-4" />
                )}

                <Text className="text-white text-sm font-semibold mb-2 ml-1">Email</Text>
                <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Email"
                    placeholderTextColor="#aaa"
                    keyboardType="email-address"
                    keyboardAppearance="dark"
                    autoCapitalize="none"
                    className={`border-2 rounded-xl px-4 py-3 text-white text-base mb-1 ${email.length > 0 && !isEmailValid(email)
                        ? 'border-red-400'
                        : 'border-white'
                        }`}
                />
                {email.length > 0 && !isEmailValid(email) && (
                    <Text className="text-red-400 text-xs ml-1">
                        Please enter a valid email address.
                    </Text>
                )}
            </View>

            <View className="flex-[0.10] bg-[#f5f5f5] justify-center items-end px-6">
                <Pressable
                    disabled={!isFormValid}
                    onPress={handleNext}
                    className={`px-8 py-3 rounded-lg ${isFormValid ? 'bg-[#F4CE14]' : 'bg-[#B8B8B8]'}`}
                >
                    <Text className={`font-bold text-base ${isFormValid ? 'text-[#333333]' : 'text-[#666666]'}`}>
                        Next
                    </Text>
                </Pressable>
            </View>
        </KeyboardAvoidingView>
    );
}