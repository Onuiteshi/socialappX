import React, {useEffect} from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import {fetchPosts, toggleLikePostInFirebase} from '@/slices/feedSlice';
import {router} from "expo-router";
import { AntDesign } from '@expo/vector-icons';
import {ThemedText} from "@/components/ThemedText";
import {selectCurrentUser} from "@/slices/authSlice";
import {getUser} from "@/auth";

const HomeScreen = () => {
    const posts = useSelector((state: RootState) => state.feed.posts);
    const user = useSelector(selectCurrentUser);
    const dispatch = useDispatch<any>();

    useEffect(() => {
        dispatch(fetchPosts());
    }, []);

    useEffect(() => {
        dispatch(getUser());
    }, []);

    const handleToggleLike =  (postId: string) => {

        try {
            dispatch(toggleLikePostInFirebase({postId, userId: user?.id}));
        }catch (error){
            console.log(error)
        }
    };


    return (
        <View style={{padding:20,paddingTop:30}}>
            <View style={styles.header}>
                <ThemedText style={styles.headerText}>SocialX</ThemedText>
                <Image source={{ uri: 'https://gravatar.com/avatar/5c8b5c603cffb64cf4265c53937d42ca?s=400&d=robohash&r=x' }} style={{width: 45, height: 45,borderRadius:99}} />
            </View>
            <FlatList
                data={posts}
                numColumns={2}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={ () => (<View style={{height:40}}></View>)}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                        <TouchableOpacity onPress={()=> router.push({
                            pathname: '/singlepost',
                            params: {
                                post: JSON.stringify(item)
                            }
                        })} style={styles.postContainer}>
                            <View style={styles.profileContainer}>
                                <View style={styles.profile}>
                                    <Image source={{ uri: item.userAvatar }} style={styles.avatar} />
                                    <Text style={styles.userName}>{item.userName}</Text>
                                </View>
                                <View style={styles.likeContainer}>
                                    <Text style={{fontFamily:'Outfit',fontSize:12,color:'white'}}>{item.likes}</Text>
                                    <TouchableOpacity onPress={() => handleToggleLike(item.id)}>
                                        <AntDesign style={styles.likeButton} name={item.likedBy.includes(user?.id) ? 'heart' : 'hearto'} size={24}  />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            {item.imageUrl && <Image source={{ uri: item.imageUrl }} style={styles.postImage} />}
                        </TouchableOpacity>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    postContainer: {
        margin: 5,
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    avatar: {
        width: 20,
        height: 20,
        borderRadius: 99,
       backgroundColor:"white"
    },
    headerText:{
        fontSize:30,
        marginTop:10,
        fontFamily:'OutfitBold'
    },
    userName: {
        fontWeight: 'bold',
        fontFamily:'Outfit',
        color:"white",
        fontSize: 10,
    },
    timestamp: {
        color: '#888',
    },
    content: {
        marginBottom: 8,
    },
    postImage: {
        width: '100%',
        height: 250,
        borderRadius: 10,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    likeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
       gap:3
    },
    likeButton: {
        color: '#E91E63',
    },
    profileContainer:{
        position:"absolute",
        zIndex:10,
        bottom:0,
        padding:5,
        flexDirection:"row",
        width:"100%",
        justifyContent:"space-between",
    },
    profile:{
        flexDirection:"row",
        alignItems:"center",
        gap:5
    }
});

export default HomeScreen;
