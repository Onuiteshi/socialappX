import React, { useState} from 'react';
import {
    View,
    TextInput,
    Image,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView, Text, Alert
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {RouteProp, useRoute} from "@react-navigation/core";
import { selectCurrentUser} from "@/slices/authSlice";
import {addPostToFirebase} from "@/slices/feedSlice";
import {router} from "expo-router";
import { AntDesign } from '@expo/vector-icons';

export interface RouteParams {
    image?: string;
}

const PreviewPostScreen = () => {
    const route = useRoute<RouteProp<{ params: RouteParams }, 'params'>>();
    const image = route.params?.image;
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const user = useSelector(selectCurrentUser);
    const dispatch = useDispatch<any>();

    console.log(image)
    const handleCreatePost = async() => {
        if (!content && !image) return;

        setLoading(true);

        const newPost = {
            userId: user.id,
            userName: user.name || 'Anonymous',
            userAvatar: 'https://gravatar.com/avatar/5c8b5c603cffb64cf4265c53937d42ca?s=400&d=robohash&r=x',
            timestamp: Date.now(),
            content,
            imageUrl: image,
            likes: 0,
            likedBy: [],
            comments:[]
        };

        try {
            await dispatch(addPostToFirebase(newPost)).unwrap();
            setLoading(false);
            setContent('');
            Alert.alert('Success', 'Post created successfully!');
            setTimeout(() => {
                router.push('/(tabs)');
            }, 2000);
        } catch (error) {
            setLoading(false);
            Alert.alert('Error', 'Failed to create post. Please try again.');
        }
    };

    return (
        <KeyboardAvoidingView style={styles.container}>
            <ScrollView style={{padding: 20}}>
                <View>
                    <TouchableOpacity onPress={() => router.back()}>
                        <AntDesign name="arrowleft" size={44} color="black" />
                    </TouchableOpacity>
                </View>
                <View style={styles.imageContainer}>
                    <Text style={{fontFamily:'OutfitBold',fontSize:20}}>
                        Add Description
                    </Text>
                    {image && <Image source={{ uri: image }} style={styles.image} />}
                    <TextInput
                        numberOfLines={3}
                        placeholder={'Description...'}
                        style={styles.input}
                        value={content}
                        onChangeText={setContent}
                    />
                    <TouchableOpacity onPress={handleCreatePost} style={{backgroundColor:'#E91E63',padding:10,paddingHorizontal:25,borderRadius:99,marginTop:20}}>
                        <Text style={{fontFamily:'Outfit',fontSize:14,color:'white'}}> {loading ? 'Publishing...' : 'Publish'}</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    imageContainer: {
        alignItems: 'center',
        marginTop: 100,
    },
    input: {
        width: '100%',
        borderColor: '#ccc',
        borderWidth: 1,
        marginTop: 25,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    image: {
        width: 200,
        height: 300,
        borderRadius: 15,
        marginTop: 15,
    },
});

export default PreviewPostScreen;
