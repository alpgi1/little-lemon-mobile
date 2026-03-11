import { View, Text, Image } from 'react-native';

export default function Header() {
    return (
        <View className="flex-1 bg-white flex-row items-center justify-center pt-10 pb-3 border-b border-gray-200">
            <Image
                source={require('../assets/logo.png')}
                style={{ width: 40, height: 40, marginRight: 12 }}
                resizeMode="contain"
            />
            <Text className="text-xl font-bold text-[#333333] tracking-wide">
                Little Lemon
            </Text>
        </View>
    );
}