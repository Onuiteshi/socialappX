import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {addDoc, arrayRemove, arrayUnion, collection, getDocs, Timestamp, updateDoc} from "@firebase/firestore";
import {db} from "@/firebaseConfig";
import {RootState} from "@/store";
import {doc} from "firebase/firestore";
import {useSelector} from "react-redux";
import {selectCurrentUser} from "@/slices/authSlice";

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

interface FeedState {
    posts: Post[];
}

const initialState: FeedState = {
    posts: [],
};

export const fetchPosts = createAsyncThunk<Post[]>('feed/fetchPosts', async () => {
    try {
        const querySnapshot = await getDocs(collection(db, 'posts'));
        const posts: Post[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.timestamp instanceof Timestamp) {
                data.timestamp = data.timestamp.toDate().getTime();
            }
            data.comments = data.comments.map((comment: Comment) => ({
                ...comment,
                timestamp: comment.timestamp instanceof Timestamp ? comment.timestamp.toDate().getTime() : comment.timestamp,
            }));
            posts.push({ id: doc.id, ...data } as Post);
        });

        return posts;
    } catch (error) {
        console.error("Error fetching posts:", error);
        throw error;
    }
});

export const addPostToFirebase = createAsyncThunk<Post, Omit<Post, 'id'>>('feed/addPostToFirebase', async (newPost) => {
    const docRef = await addDoc(collection(db, 'posts'), newPost);
    return { ...newPost, id: docRef.id };
});


export const toggleLikePostInFirebase = createAsyncThunk<
    { postId: string; newLikes: number; userId: string },
    { postId: string; userId: string },
    { state: RootState }
>('feed/toggleLikePostInFirebase', async ({ postId, userId }, { getState }) => {
    const state = getState();
    const post = state.feed.posts.find((post) => post.id === postId);
    if (!post) return;

    let newLikes = post.likes;


    if (post.likedBy.includes(userId)) {
        newLikes -= 1;
        await updateDoc(doc(db, 'posts', postId), {
            likes: newLikes,
            likedBy: arrayRemove(userId),
        });
    } else {
        newLikes += 1;
        await updateDoc(doc(db, 'posts', postId), {
            likes: newLikes,
            likedBy: arrayUnion(userId),
        });
    }


    return { postId, newLikes,  userId };
});

export const addCommentToFirebase = createAsyncThunk<Comment, { postId: string; newComment: Comment }>('feed/addCommentToFirebase', async ({ postId,newComment} ) => {
    await updateDoc(doc(db, 'posts', postId), {
        comments: arrayUnion(newComment),
    });


    return newComment;
});

const feedSlice = createSlice<FeedState, {

}, "feed">({
    name: 'feed',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchPosts.fulfilled, (state, action: PayloadAction<Post[]>) => {
            state.posts = action.payload;
        });
        builder.addCase(addPostToFirebase.fulfilled, (state, action: PayloadAction<Post>) => {
            state.posts.unshift(action.payload);
        });
        builder.addCase(toggleLikePostInFirebase.fulfilled, (state, action: PayloadAction<{ postId: string; newLikes: number;userId:string }>) => {
            const { postId, newLikes, userId } = action.payload;
            const post = state.posts.find((post) => post.id === postId);
            if (post) {
                post.likes = newLikes;
                if (post.likedBy.includes(userId)) {
                    post.likedBy = post.likedBy.filter(id => id !== userId);
                } else {
                    post.likedBy.push(userId);

                }
            }
        });
        builder.addCase(addCommentToFirebase.fulfilled, (state, action: PayloadAction<Comment>) => {
            const newComment = action.payload;
            const post = state.posts.find((post) => post.id === newComment.postId);
            if (post) {
                post.comments.push(newComment);
            }
        });
    },
});

export default feedSlice.reducer;
