import { View, Text, Image } from 'react-native';

export default function SplashScreen() {
    return (
        <View className="flex-1 bg-[#495E57] items-center justify-center">
            <Image
                source={require('../assets/logo.png')}
                style={{ width: 80, height: 80 }}
                resizeMode="contain"
            />
            <Text className="text-[#F4CE14] text-3xl font-extrabold mt-4">
                Little Lemon
            </Text>
        </View>
    );
}
