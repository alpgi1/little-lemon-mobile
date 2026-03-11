import {
    View, Text, Image, FlatList, Pressable,
    ActivityIndicator, TextInput, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    initDatabase, getMenuItems, saveMenuItems,
    fetchMenuFromAPI, filterMenuItems, getImageUrl, MenuItem,
} from '../utils/database';

const CATEGORIES = ['starters', 'mains', 'desserts'];

function AppHeader({ navigation }: { navigation: any }) {
    const [avatar, setAvatar] = useState('');
    const [initials, setInitials] = useState('');

    useEffect(() => {
        AsyncStorage.multiGet(['avatar', 'firstName', 'lastName']).then((values) => {
            const map = Object.fromEntries(values);
            setAvatar(map.avatar ?? '');
            const f = map.firstName?.charAt(0) ?? '';
            const l = map.lastName?.charAt(0) ?? '';
            setInitials(`${f}${l}`.toUpperCase());
        });
    }, []);

    return (
        <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
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

function HeroBanner({ searchQuery, onSearchChange }: {
    searchQuery: string;
    onSearchChange: (v: string) => void;
}) {
    return (
        <View className="bg-[#495E57] px-5 pt-5 pb-6">
            <View className="flex-row justify-between items-flex-start mb-5">
                <View className="flex-1 pr-4">
                    <Text className="text-[#F4CE14] text-4xl font-extrabold leading-tight">
                        Little{'\n'}Lemon
                    </Text>
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
            <View className="flex-row items-center bg-white rounded-xl px-3 py-2">
                <Text className="text-gray-400 mr-2 text-base">🔍</Text>
                <TextInput
                    value={searchQuery}
                    onChangeText={onSearchChange}
                    placeholder="Search for your favorite dish"
                    placeholderTextColor="#aaa"
                    className="flex-1 text-[#333] text-sm"
                />
            </View>
        </View>
    );
}

function CategoryFilter({ active, onToggle }: {
    active: string[];
    onToggle: (cat: string) => void;
}) {
    return (
        <View className="px-5 pt-5 pb-3">
            <Text className="text-[#333] font-extrabold text-xl mb-3">ORDER FOR DELIVERY!</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-row gap-3">
                    {CATEGORIES.map((cat) => {
                        const isActive = active.includes(cat);
                        return (
                            <Pressable
                                key={cat}
                                onPress={() => onToggle(cat)}
                                className={`px-4 py-2 rounded-full ${isActive ? 'bg-[#495E57]' : 'bg-gray-100'}`}
                            >
                                <Text className={`font-semibold capitalize text-sm ${isActive ? 'text-white' : 'text-[#333]'}`}>
                                    {cat}
                                </Text>
                            </Pressable>
                        );
                    })}
                </View>
            </ScrollView>
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
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [activeCategories, setActiveCategories] = useState<string[]>([]);

    useEffect(() => {
        async function loadMenu() {
            try {
                await initDatabase();
                const stored = await getMenuItems();
                if (stored.length === 0) {
                    const api = await fetchMenuFromAPI();
                    await saveMenuItems(api);
                }
            } catch (e) {
                console.error('Error loading menu:', e);
            } finally {
                setLoading(false);
            }
        }
        loadMenu();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedQuery(searchQuery), 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => {
        if (loading) return;
        filterMenuItems(activeCategories, debouncedQuery).then(setMenuItems);
    }, [activeCategories, debouncedQuery, loading]);

    const toggleCategory = (cat: string) => {
        setActiveCategories((prev) =>
            prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
        );
    };

    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-white items-center justify-center">
                <ActivityIndicator size="large" color="#495E57" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-white">
            <AppHeader navigation={navigation} />
            <FlatList
                data={menuItems}
                keyExtractor={(item, index) => `${item.name}-${index}`}
                ListHeaderComponent={
                    <>
                        <HeroBanner searchQuery={searchQuery} onSearchChange={setSearchQuery} />
                        <CategoryFilter active={activeCategories} onToggle={toggleCategory} />
                        <View className="border-b border-gray-200" />
                    </>
                }
                renderItem={({ item }) => <MenuItemCard item={item} />}
                ListEmptyComponent={
                    <Text className="text-center text-gray-400 mt-10">No dishes found.</Text>
                }
            />
        </SafeAreaView>
    );
}
