import React from 'react';
import {View,Text,StyleSheet, TouchableOpacity} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Entypo } from '@expo/vector-icons';
import {router} from "expo-router";
import {ThemedText} from "@/components/ThemedText";

const CreatePostScreen = () => {

    const handleChooseImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            router.push({
                pathname: '/preview',
                params: {
                    image: result.assets[0].uri
                }
            })
        }
    };


    return (
        <View style={styles.container}>
            <Entypo name="folder-images" size={140} color="#FFC107" />
            <ThemedText style={{fontFamily:'Outfit',fontSize:22,marginTop:20}}>Start Uploading Your Post</ThemedText>
            <ThemedText style={styles.text}>Upload images to Show your passion</ThemedText>
            <TouchableOpacity onPress={handleChooseImage} style={{backgroundColor:'#E91E63',padding:10,paddingHorizontal:25,borderRadius:99,marginTop:20}}>
                <Text style={{fontFamily:'Outfit',fontSize:14,color:'white'}}>Upload Image</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    input: {
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 8,
        padding: 8,
        borderRadius: 4,
    },
    image: {
        width: 100,
        height: 100,
        marginBottom: 8,
    },
    text:{
        fontFamily:'Outfit',
        fontSize:14,
        textAlign:'center',
        marginTop:13
    }
});

export default CreatePostScreen;
