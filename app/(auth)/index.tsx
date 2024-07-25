import {StyleSheet, View, Text, TextInput, Button, TouchableOpacity, ActivityIndicator, Alert} from "react-native";
import {Video} from "expo-av";
import {useEffect, useState} from "react";
import {selectAuthError, selectAuthLoading, setUser} from "@/slices/authSlice";
import {useDispatch, useSelector} from "react-redux";
import {login, register} from "@/auth";
import {router} from "expo-router";
import { Entypo } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import {unwrapResult} from "@reduxjs/toolkit";
import { useForm, Controller } from 'react-hook-form';

export default function LoginScreen () {

    const { control, handleSubmit, formState: {errors, isValid}, setError, clearErrors } = useForm();
    const [isLogin, setIsLogin] = useState(true);
    const dispatch = useDispatch<any>();
    const loading = useSelector(selectAuthLoading);
    const error = useSelector(selectAuthError);


    const onSubmit= async (data) => {
        try {
            let resultAction;
            if (isLogin) {
                resultAction = await dispatch(login({ email:data.email, password:data.password }));
                // router.replace('/(tabs)');
            } else {
                resultAction = await dispatch(register({ email: data.email, password: data.password, name: data.name || "" }));
            }
            const originalPromiseResult = unwrapResult(resultAction);
            if (!originalPromiseResult.error) {
                router.replace('/(tabs)');
            }
        } catch (error) {
            Alert.alert("Error", error);
        }
    };


    return (
        <View style={styles.container}>
            <Video
                source={require("../../assets/images/21536-318978190_tiny.mp4")}
                style={styles.video}
                shouldPlay
                resizeMode="cover"
                isLooping
            />

            <View style={styles.titleContainer}>
                <Text style={styles.title}>
                    SocialX
                </Text>
            </View>

            <View style={{ padding: 20 }}>
                <Controller
                    control={control}
                    name="email"
                    rules={{ required: true, pattern: /^\S+@\S+$/i }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <View style={[styles.inputContainer, errors.email ? styles.inputError : {}]} >
                            <Entypo name="email" size={20} color="white" style={styles.icon} />
                            <TextInput
                                style={styles.input}
                                placeholderTextColor="white"
                                autoCapitalize="none"
                                placeholder="Email"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                            />
                        </View>
                    )}
                />
                {errors.email && <Text style={styles.errorText}>Email is required</Text>}
                <Controller
                    control={control}
                    name="password"
                    rules={{ required: true }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <View style={[styles.inputContainer, errors.password ? styles.inputError : {}]}>
                            <Entypo name="lock" size={20} color="white" style={styles.icon} />
                            <TextInput
                                style={styles.input}
                                placeholderTextColor="white"
                                placeholder="Password"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                secureTextEntry
                            />
                        </View>
                    )}
                />
                {errors.password && <Text style={styles.errorText}>Password is Required</Text>}
                {!isLogin && (
                    <>
                        <Controller
                            control={control}
                            name="name"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <View style={[styles.inputContainer, errors.name ? styles.inputError : {}]}>
                                    <Entypo name="user" size={20} color="white" style={styles.icon}  />
                                    <TextInput
                                        style={styles.input}
                                        placeholderTextColor="white"
                                        placeholder="Name"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                    />
                                    {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}
                                </View>

                            )}
                        />
                    </>
                )}

                <TouchableOpacity style={styles.buttonContainer} onPress={handleSubmit(onSubmit)}>
                    {loading ? (
                        <ActivityIndicator size="small" animating color="#FFFFFF" />
                    ) : (
                        <Text style={{ color: 'white', fontSize: 20, fontFamily: 'Outfit' }}>
                            {isLogin ? 'Sign In' : 'Sign Up'}
                        </Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity style={styles.bottomContainer} onPress={() => setIsLogin(!isLogin)}>
                    <Text style={styles.toggleText}>
                        {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Sign In'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    video: {
        width: 1000,
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
    titleContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 100,
    },
    title: {
        fontSize: 40,
        fontFamily:'OutfitBold',
        color: 'white',
    },
    icon: {
        marginRight: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'white',
        marginBottom: 16,
    },
    input:{
        height: 40,
        flex: 1,
        paddingVertical:8,
        color: 'white',
        fontFamily:'Outfit',
    },
    inputError: {
        borderBottomColor: 'red',
        borderBottomWidth: 2,
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        borderRadius: 5,
        padding: 5,
        height: 40,
        backgroundColor:"#E91E63"
    },
    bottomContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    toggleText: {
        fontSize: 16,
        fontFamily:'OutfitBold',
        color: 'white',
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: 4,
    },
});