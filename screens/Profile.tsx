import { View, Text, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Profile({ onLogOut }: any) {

    const handleLogOut = async () => {
        await AsyncStorage.removeItem('onboardingCompleted');
        onLogOut();
    };

    return (
        <View className="flex-1 bg-white items-center justify-center gap-6">
            <Text className="text-2xl font-bold text-[#333333]">Profile Page</Text>
            <Pressable
                onPress={handleLogOut}
                className="bg-[#F4CE14] px-8 py-3 rounded-lg"
            >
                <Text className="font-bold text-[#333333] text-base">Log Out</Text>
            </Pressable>
        </View>
    );
}
