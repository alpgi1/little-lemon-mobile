import { View, Text, Image, FlatList, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initDatabase, getMenuItems, saveMenuItems, fetchMenuFromAPI, getImageUrl, MenuItem } from '../utils/database';

function AppHeader({ navigation }: { navigation: any }) {
    const [avatar, setAvatar] = useState('');
    const [initials, setInitials] = useState('');

    useEffect(() => {
        AsyncStorage.multiGet(['avatar', 'firstName', 'lastName']).then((values) => {
            const map = Object.fromEntries(values);
            setAvatar(map.avatar ?? '');
            const first = map.firstName?.charAt(0) ?? '';
            const last = map.lastName?.charAt(0) ?? '';
            setInitials(`${first}${last}`.toUpperCase());
        });
    }, []);

    return (
        <View className="flex-row items-center justify-between px-4 py-3 bg-white">
            <View className="w-10" />
            <Image
                source={require('../assets/logo.png')}
                style={{ width: 160, height: 40 }}
                resizeMode="contain"
            />
            <Pressable onPress={() => navigation.navigate('Profile')}>
                {avatar ? (
                    <Image source={{ uri: avatar }} className="w-10 h-10 rounded-full" />
                ) : (
                    <View className="w-10 h-10 rounded-full bg-[#495E57] items-center justify-center">
                        <Text className="text-white text-sm font-bold">{initials || '?'}</Text>
                    </View>
                )}
            </Pressable>
        </View>
    );
}

function HeroBanner() {
    return (
        <View className="bg-[#495E57] px-5 pt-5 pb-8">
            <View className="flex-row justify-between items-flex-start">
                <View className="flex-1 pr-4">
                    <Text className="text-[#F4CE14] text-4xl font-extrabold leading-tight">Little{'\n'}Lemon</Text>
                    <Text className="text-white text-lg font-semibold mt-1 mb-3">Chicago</Text>
                    <Text className="text-white text-sm leading-5">
                        We are a family owned Mediterranean restaurant, focused on traditional recipes served with a modern twist.
                    </Text>
                </View>
                <Image
                    source={require('../assets/image.png')}
                    style={{ width: 120, height: 120, borderRadius: 12 }}
                    resizeMode="cover"
                />
            </View>
        </View>
    );
}

function MenuItemCard({ item }: { item: MenuItem }) {
    return (
        <View className="flex-row px-5 py-4 border-b border-gray-200 items-center">
            <View className="flex-1 pr-4">
                <Text className="text-[#333] font-bold text-base mb-1">{item.name}</Text>
                <Text className="text-gray-500 text-sm mb-2" numberOfLines={2}>{item.description}</Text>
                <Text className="text-[#495E57] font-semibold text-base">${item.price.toFixed(2)}</Text>
            </View>
            <Image
                source={{ uri: getImageUrl(item.image) }}
                style={{ width: 80, height: 80, borderRadius: 8 }}
                resizeMode="cover"
            />
        </View>
    );
}

export default function Home({ navigation }: any) {
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadMenu() {
            try {
                await initDatabase();
                const storedItems = await getMenuItems();
                if (storedItems.length > 0) {
                    setMenuItems(storedItems);
                } else {
                    const apiItems = await fetchMenuFromAPI();
                    await saveMenuItems(apiItems);
                    setMenuItems(apiItems);
                }
            } catch (error) {
                console.error('Error loading menu:', error);
            } finally {
                setLoading(false);
            }
        }
        loadMenu();
    }, []);

    return (
        <SafeAreaView className="flex-1 bg-white">
            <AppHeader navigation={navigation} />
            <FlatList
                data={menuItems}
                keyExtractor={(item, index) => `${item.name}-${index}`}
                ListHeaderComponent={
                    <>
                        <HeroBanner />
                        <Text className="text-[#333] font-extrabold text-xl px-5 pt-5 pb-3">
                            ORDER FOR DELIVERY!
                        </Text>
                    </>
                }
                renderItem={({ item }) => <MenuItemCard item={item} />}
                ListEmptyComponent={
                    loading
                        ? <ActivityIndicator size="large" color="#495E57" className="mt-10" />
                        : <Text className="text-center text-gray-400 mt-10">No menu items found.</Text>
                }
            />
        </SafeAreaView>
    );
}
