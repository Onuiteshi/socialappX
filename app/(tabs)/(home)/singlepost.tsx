import React, {  useState } from 'react';
import {
    View,
    Text,
    FlatList,
    Image,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    TextInput,
    Alert
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { toggleLikePostInFirebase, addCommentToFirebase} from '@/slices/feedSlice';
import { router } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import { selectCurrentUser } from '@/slices/authSlice';
import { RouteProp, useRoute } from '@react-navigation/core';
import { RouteParams } from '@/app/(tabs)/(create)/preview';
import Ionicons from '@expo/vector-icons/Ionicons';
import Modal from 'react-native-modal';
import uuid from 'react-native-uuid';

interface Post {
    id: string;
    userId: string;
    userName: string;
    userAvatar: string;
    timestamp: number;
    content: string;
    imageUrl?: string;
    likes: number;
    likedBy: string[];
    comments: Comment[];
}

interface Comment {
    id: string;
    postId: string;
    userId: string;
    userName: string;
    content: string;
    timestamp: number;
}

interface RouteParams {
    post: string;
}

const SinglePostScreen = () => {
    const route = useRoute<RouteProp<{ params: RouteParams }, 'params'>>();
    const post: Post = JSON.parse(route.params?.post ?? '{}');
    const user = useSelector(selectCurrentUser);
    const dispatch = useDispatch<any>();
    const [isCommentModalVisible, setCommentModalVisible] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);

    const screenHeight = Dimensions.get('window').height;

    const handleToggleLike =  (postId: string) => {

        try {
            dispatch(toggleLikePostInFirebase({postId, userId: user?.id}));
        }catch (error){
            console.log(error)
        }
    };

    const handleAddComment = () => {

        if (newComment.trim() !== '') {
            const comment= {
                id: uuid.v4() as string,
                postId:post.id,
                userId:user?.id,
                userName:user?.name,
                content: newComment,
                timestamp: Date.now(),
            };
            setLoading(true);
            try {
                dispatch(addCommentToFirebase({ postId:post.id ,newComment:comment}));
                setLoading(false);
                setCommentModalVisible(false);
                Alert.alert('Success', 'Comment created successfully!');
            }catch (err){
                setLoading(false);
                Alert.alert('Error', 'Failed to create Comment. Please try again.');
            }
            setNewComment('');
        }
    };

    return (
        <View>
            <TouchableOpacity style={styles.back} onPress={() => router.back()}>
                <AntDesign name="arrowleft" size={34} color="black" />
            </TouchableOpacity>
            <View style={styles.profileContainer}>
                <View>
                    <View style={styles.profile}>
                        <Image source={{ uri: post.userAvatar }} style={styles.avatar} />
                        <Text style={styles.userName}>{post.userName}</Text>
                    </View>
                    <Text style={{ fontFamily: 'Outfit', fontSize: 17, color: 'white', marginTop: 7 }}>{post.content}</Text>
                </View>
                <View style={styles.icons}>
                    <View style={styles.likeContainer}>
                        <Text style={{ fontFamily: 'Outfit', fontSize: 12, color: 'white' }}>{post.likes}</Text>
                        <TouchableOpacity onPress={() => handleToggleLike(post.id)}>
                            <AntDesign style={styles.likeButton} name={post.likedBy.includes(user?.id) ? 'heart' : 'hearto'} size={34} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.likeContainer}>
                        <Text style={{ fontFamily: 'Outfit', fontSize: 12, color: 'white' }}>{post.comments.length}</Text>
                        <TouchableOpacity onPress={() => setCommentModalVisible(true)}>
                            <Ionicons name="chatbubble-outline" size={34} style={styles.likeButton} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <Image resizeMode={'cover'} source={{ uri: post?.imageUrl }} style={[styles.image, { height: screenHeight }]} />

            <Modal isVisible={isCommentModalVisible} onBackdropPress={() => setCommentModalVisible(false)}>
                <View style={styles.modalContainer}>
                    <FlatList
                        data={post.comments}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <View style={styles.commentContainer}>
                                <Text style={styles.commentUserName}>{item.userName}</Text>
                                <Text style={styles.commentContent}>{item.content}</Text>
                            </View>
                        )}
                    />
                    <TextInput
                        style={styles.commentInput}
                        placeholder="Add a comment..."
                        value={newComment}
                        onChangeText={setNewComment}
                    />
                    <TouchableOpacity onPress={handleAddComment} style={styles.commentBtn}>
                        <Text style={{fontFamily:'Outfit',fontSize:14,color:'white'}}> {loading ? 'Commenting...' : 'Comment'}</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    image: {
        width: Dimensions.get('window').width,
    },
    back: {
        position: 'absolute',
        paddingTop: 50,
        padding: 20,
        zIndex: 10,
    },
    likeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    likeButton: {
        color: 'white',
    },
    profileContainer: {
        position: 'absolute',
        zIndex: 10,
        bottom: 20,
        padding: 20,
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    profile: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 99,
        backgroundColor: 'white',
    },
    userName: {
        fontWeight: 'bold',
        fontFamily: 'Outfit',
        color: 'white',
        fontSize: 16,
    },
    icons: {
        gap: 15,
    },
    modalContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        maxHeight: '80%',
    },
    commentContainer: {
        marginBottom: 10,
    },
    commentUserName: {
        fontWeight: 'bold',
    },
    commentContent: {
        marginLeft: 10,
    },
    commentInput: {
        borderColor: 'gray',
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    commentBtn:{
        backgroundColor:'#E91E63',
        padding:10,
        alignItems:'center',
        borderRadius:99,
        marginTop:20
    }
});

export default SinglePostScreen;

