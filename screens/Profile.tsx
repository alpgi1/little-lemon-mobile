import { View, Text, TextInput, Pressable, Image, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { MaskedTextInput } from 'react-native-mask-text';

const STORAGE_KEYS = [
    'firstName', 'lastName', 'email', 'phoneNumber', 'avatar',
    'orderStatuses', 'passwordChanges', 'specialOffers', 'newsletter',
];

type ProfileData = {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    avatar: string;
    orderStatuses: boolean;
    passwordChanges: boolean;
    specialOffers: boolean;
    newsletter: boolean;
};

const defaultData: ProfileData = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    avatar: '',
    orderStatuses: true,
    passwordChanges: true,
    specialOffers: true,
    newsletter: true,
};

async function loadProfile(): Promise<ProfileData> {
    const values = await AsyncStorage.multiGet(STORAGE_KEYS);
    const map = Object.fromEntries(values);
    return {
        firstName: map.firstName ?? '',
        lastName: map.lastName ?? '',
        email: map.email ?? '',
        phoneNumber: map.phoneNumber ?? '',
        avatar: map.avatar ?? '',
        orderStatuses: map.orderStatuses !== 'false',
        passwordChanges: map.passwordChanges !== 'false',
        specialOffers: map.specialOffers !== 'false',
        newsletter: map.newsletter !== 'false',
    };
}

async function saveProfile(data: ProfileData) {
    await AsyncStorage.multiSet([
        ['firstName', data.firstName],
        ['lastName', data.lastName],
        ['email', data.email],
        ['phoneNumber', data.phoneNumber],
        ['avatar', data.avatar],
        ['orderStatuses', String(data.orderStatuses)],
        ['passwordChanges', String(data.passwordChanges)],
        ['specialOffers', String(data.specialOffers)],
        ['newsletter', String(data.newsletter)],
    ]);
}

function AvatarSection({
    avatar, firstName, lastName, onChangeAvatar, onRemoveAvatar,
}: {
    avatar: string; firstName: string; lastName: string;
    onChangeAvatar: (uri: string) => void; onRemoveAvatar: () => void;
}) {
    const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission required', 'Please allow photo library access.');
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });
        if (!result.canceled) {
            onChangeAvatar(result.assets[0].uri);
        }
    };

    return (
        <View className="flex-row items-center gap-4 mb-6">
            {avatar ? (
                <Image
                    source={{ uri: avatar }}
                    className="w-20 h-20 rounded-full"
                />
            ) : (
                <View className="w-20 h-20 rounded-full bg-[#495E57] items-center justify-center">
                    <Text className="text-white text-2xl font-bold">
                        {initials || '?'}
                    </Text>
                </View>
            )}
            <Pressable
                onPress={pickImage}
                className="bg-[#495E57] px-5 py-2 rounded-lg"
            >
                <Text className="text-white font-semibold">Change</Text>
            </Pressable>
            <Pressable
                onPress={onRemoveAvatar}
                className="border border-[#495E57] px-5 py-2 rounded-lg"
            >
                <Text className="text-[#495E57] font-semibold">Remove</Text>
            </Pressable>
        </View>
    );
}

function LabeledInput({
    label, value, onChangeText, keyboardType, autoCapitalize,
}: {
    label: string; value: string;
    onChangeText: (v: string) => void;
    keyboardType?: any; autoCapitalize?: any;
}) {
    return (
        <View className="mb-4">
            <Text className="text-xs text-gray-500 mb-1 font-medium">{label}</Text>
            <TextInput
                value={value}
                onChangeText={onChangeText}
                keyboardType={keyboardType}
                autoCapitalize={autoCapitalize ?? 'words'}
                className="border border-gray-300 rounded-lg px-3 py-3 text-base text-[#333]"
            />
        </View>
    );
}

function PhoneInput({ value, onChangeText }: { value: string; onChangeText: (v: string) => void }) {
    return (
        <View className="mb-4">
            <Text className="text-xs text-gray-500 mb-1 font-medium">Phone number</Text>
            <MaskedTextInput
                mask="(999) 999-9999"
                value={value}
                onChangeText={(text) => onChangeText(text)}
                keyboardType="phone-pad"
                style={{
                    borderWidth: 1,
                    borderColor: '#d1d5db',
                    borderRadius: 8,
                    paddingHorizontal: 12,
                    paddingVertical: 12,
                    fontSize: 16,
                    color: '#333',
                }}
            />
        </View>
    );
}

function Checkbox({ label, value, onToggle }: { label: string; value: boolean; onToggle: () => void }) {
    return (
        <Pressable onPress={onToggle} className="flex-row items-center gap-3 mb-3">
            <View className={`w-5 h-5 rounded items-center justify-center border ${value ? 'bg-[#495E57] border-[#495E57]' : 'border-gray-400'}`}>
                {value && <Text className="text-white text-xs font-bold">✓</Text>}
            </View>
            <Text className="text-[#333] text-sm">{label}</Text>
        </Pressable>
    );
}

export default function Profile({ navigation }: { navigation: any }) {
    const [data, setData] = useState<ProfileData>(defaultData);
    const [saved, setSaved] = useState<ProfileData>(defaultData);

    useEffect(() => {
        loadProfile().then((profile) => {
            setData(profile);
            setSaved(profile);
        });
    }, []);

    const update = (key: keyof ProfileData, value: any) => {
        setData((prev) => ({ ...prev, [key]: value }));
    };

    const handleSave = async () => {
        await saveProfile(data);
        setSaved(data);
        Alert.alert('Saved', 'Your changes have been saved.');
    };

    const handleDiscard = () => {
        setData(saved);
    };

    const handleLogOut = async () => {
        await AsyncStorage.multiRemove([...STORAGE_KEYS, 'onboardingCompleted']);
        navigation.reset({ index: 0, routes: [{ name: 'Onboarding' }] });
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
                <Pressable onPress={() => navigation.goBack()} className="w-10 h-10 items-center justify-center rounded-full bg-gray-100">
                    <Text className="text-[#495E57] text-xl font-bold">←</Text>
                </Pressable>
                <Image source={require('../assets/logo.png')} style={{ width: 140, height: 36 }} resizeMode="contain" />
                <View className="w-10" />
            </View>
            <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>

                <View className="px-5 pt-6">
                    <Text className="text-xl font-bold text-[#333] mb-5">Personal information</Text>

                    <Text className="text-xs text-gray-500 mb-2 font-medium">Avatar</Text>
                    <AvatarSection
                        avatar={data.avatar}
                        firstName={data.firstName}
                        lastName={data.lastName}
                        onChangeAvatar={(uri) => update('avatar', uri)}
                        onRemoveAvatar={() => update('avatar', '')}
                    />

                    <LabeledInput label="First name" value={data.firstName} onChangeText={(v) => update('firstName', v)} />
                    <LabeledInput label="Last name" value={data.lastName} onChangeText={(v) => update('lastName', v)} />
                    <LabeledInput label="Email" value={data.email} onChangeText={(v) => update('email', v)} keyboardType="email-address" autoCapitalize="none" />
                    <PhoneInput value={data.phoneNumber} onChangeText={(v) => update('phoneNumber', v)} />
                </View>

                <View className="px-5 pt-2">
                    <Text className="text-xl font-bold text-[#333] mb-4">Email notifications</Text>
                    <Checkbox label="Order statuses" value={data.orderStatuses} onToggle={() => update('orderStatuses', !data.orderStatuses)} />
                    <Checkbox label="Password changes" value={data.passwordChanges} onToggle={() => update('passwordChanges', !data.passwordChanges)} />
                    <Checkbox label="Special offers" value={data.specialOffers} onToggle={() => update('specialOffers', !data.specialOffers)} />
                    <Checkbox label="Newsletter" value={data.newsletter} onToggle={() => update('newsletter', !data.newsletter)} />
                </View>

                <View className="px-5 pt-6">
                    <Pressable onPress={handleLogOut} className="bg-[#F4CE14] py-4 rounded-xl items-center mb-4">
                        <Text className="font-bold text-[#333] text-base">Log out</Text>
                    </Pressable>

                    <View className="flex-row gap-3">
                        <Pressable onPress={handleDiscard} className="flex-1 border border-[#495E57] py-3 rounded-xl items-center">
                            <Text className="font-semibold text-[#495E57]">Discard changes</Text>
                        </Pressable>
                        <Pressable onPress={handleSave} className="flex-1 bg-[#495E57] py-3 rounded-xl items-center">
                            <Text className="font-semibold text-white">Save changes</Text>
                        </Pressable>
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}
