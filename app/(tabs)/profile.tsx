import React, {useEffect} from 'react';
import {View, Text, FlatList, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import { RootState } from '@/store';
import {selectCurrentUser} from "@/slices/authSlice";
import {getUser, logout} from "@/auth";
import {router} from "expo-router";
import {ThemedText} from "@/components/ThemedText";
import { fetchPosts, toggleLikePostInFirebase} from "@/slices/feedSlice";
import {AntDesign, Ionicons} from '@expo/vector-icons';

const ProfileScreen = () => {
    const user = useSelector(selectCurrentUser);

    const posts = useSelector((state: RootState) => state.feed.posts.filter(post => post.userId === user?.id));

    const dispatch = useDispatch<any>();

    const handleToggleLike =  (postId: string) => {

        try {
            dispatch(toggleLikePostInFirebase({postId, userId: user?.id}));
        }catch (error){
            console.log(error)
        }
    };

    useEffect(() => {
        dispatch(fetchPosts());
    }, [dispatch]);
    useEffect(() => {
        dispatch(getUser());
    }, [dispatch]);
    const handleLogout = async () => {
        try {
            await dispatch(logout()).unwrap();
            router.replace('/(auth)');
        } catch (error) {
            console.error('Logout failed: ', error);
        }
    };

    const totalLikes = posts.reduce((sum, post) => sum + post.likes, 0);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image source={{ uri: 'https://gravatar.com/avatar/5c8b5c603cffb64cf4265c53937d42ca?s=400&d=robohash&r=x' }} style={styles.avatar} />
                <ThemedText style={styles.userName}>{user?.name ?? 'Anonymous'}</ThemedText>
                <ThemedText style={styles.email}>{user?.email ?? 'Anonymous'}</ThemedText>
                <TouchableOpacity onPress={handleLogout}>
                    <ThemedText style={styles.logout}>Logout</ThemedText>
                </TouchableOpacity>
            </View>
            <View style={styles.countContainer}>
                <View style={styles.count}>
                    <Ionicons name="image" size={20} color="#E91E63" />
                    <ThemedText style={{fontFamily:'OutfitBold',fontSize:17}}>{posts.length} Post(s)</ThemedText>
                </View>
                <View style={styles.count}>
                    <Ionicons name="heart-sharp" size={20} color="#E91E63" />
                    <ThemedText style={{fontFamily:'OutfitBold',fontSize:17}}>{totalLikes} Like(s)</ThemedText>
                </View>
            </View>
            <FlatList
                data={posts}
                numColumns={2}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={ () => (<View style={{height:40}}></View>)}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.postContainer}>
                        <View style={styles.profileContainer}>
                            <View style={styles.profile}>
                                <Image source={{ uri: item.userAvatar }} style={styles.postAvatar} />
                                <Text style={styles.postUserName}>{item.userName}</Text>
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
    container: {
        marginTop: 30,
    },
    header: {
        alignItems: 'center',
        marginTop: 20,
    },
    avatar: {
        width: 90,
        height: 90,
        borderRadius: 99,
    },
    userName: {
        fontSize: 22,
        fontFamily:'OutfitMedium'
    },
    email: {
        fontSize: 17,
        color: '#888',
        fontFamily:'Outfit'
    },
    countContainer:{
        flexDirection: 'row',
        marginTop: 20,
        justifyContent: 'space-between',
    },
    count:{
      padding:20,
      alignItems: 'center',
    },
    postContainer: {
       margin: 5,
        flex: 1,
    },
    postImage: {
        width: '100%',
        height: 250,
        borderRadius: 10,
    },
    content: {
        marginBottom: 8,
    },
    logout: {
        color: 'red',
        fontFamily:'OutfitBold',
        fontSize:20,
        marginTop:10
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
    },
    postAvatar: {
        width: 20,
        height: 20,
        borderRadius: 99,
        backgroundColor:"white"
    },
    postUserName: {
        fontWeight: 'bold',
        fontFamily:'Outfit',
        color:"white",
        fontSize: 10,
    },
});

export default ProfileScreen;
