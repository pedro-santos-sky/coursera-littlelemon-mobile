import React, {useState, useEffect, useContext, useCallback} from 'react';
import {View, Text, StyleSheet, Pressable, KeyboardAvoidingView, Platform, TextInput, Image, ScrollView} from 'react-native';
import { validateName,validateEmail, validatePassword, validateTelNum } from '../utils/validate';
import { AuthContext } from '../context/AuthContext';
import * as ImagePicker from 'expo-image-picker'
import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Checkbox from 'expo-checkbox'




const Profile = () => {

    const [profile, setProfile] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        orderStatuses: false,
        passwordChanges: false,
        specialOffers: false,
        newsletter: false,
        image: "",
    })

    const [clearProfile, setClearProfile] = useState(false)

    useEffect(() => {
        ( async () => {
            try{
                const getProfileData = await AsyncStorage.getItem("profile")
                setProfile(JSON.parse(getProfileData))
                setClearProfile(false)
            } catch (e) {
                console.error(e)
            }
        })();
    }, [clearProfile])

    const {update} = useContext(AuthContext)
    const {logout} = useContext(AuthContext)

    const updateProfile = (key, value) => {
        setProfile(prevState => ({
            ...prevState,
            [key]: value,
        }))
    }

    const validateForm = () => {
        return (
            validateName(profile.firstName) &&
            validateName(profile.lastName) &&
            validateEmail(profile.email) &&
            validateTelNum(profile.phoneNumber)
        )
    }


    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        })

        if (!result.canceled) {
            setProfile(prevState => ({
                ...prevState,
                ["image"]: result.assets[0].uri

            }))
        }
    }

    const clearImage = () => {
        setProfile(prevState => ({
            ...prevState,
            ['image']: "",
        }))
    }

    return (
       <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"} >
           <View style={styles.headerBox}>
                <Image
                    source={require('../image/logo1.png')}
                    accessible={true}
                    accessibilityLabel={'Little Lemon Logo'}
                    style={styles.logo} />

                <Text style={styles.headerText}>Little Lemon</Text>
            </View>

            <ScrollView style={styles.scrollviewBox}>
                <Text>Personal information</Text>
                <Text style={styles.text}>Avatar</Text>
                <View style={styles.avatarContainer}>
                    {profile.image ? (
                        <Image source={{uri: profile.image}} style={styles.avatarImage} />
                    ) : (
                        <View style={styles.avatarEmpty}>
                            <Text style={styles.avatarEmptyText}>
                                {profile.firstName && Array.from(profile.firstName)[0]}
                                {profile.lastName && Array.from(profile.lastName)[0]}
                            </Text>
                        </View>
                    )}
                    <View style={styles.avatarButtons}>
                        <Pressable
                            style={styles.saveBtn}
                            title="Pick an image from camera roll"
                            onPress={pickImage} >
                            <Text style={styles.saveBtnText}>select image</Text>
                        </Pressable>
                        <Pressable
                            style={styles.removeBtn}
                            title="Pick an image from camera roll"
                            onPress={clearImage} >
                            <Text style={styles.btnText}>remove image</Text>
                        </Pressable>
                    </View>
                </View>
                <Text style={[styles.text, !validateName(profile.firstName) ? "" : styles.error]}>firstName</Text>
                <TextInput
                    style={styles.inputBox}
                    value={profile.firstName}
                    onChangeText={newValue => updateProfile("firstName", newValue)}
                    placeholder={"First Name"} />

                <Text style={[styles.text,!validateName(profile.lastName) ? "" : styles.error]} >Last Name</Text>
                <TextInput
                    style={styles.inputBox}
                    value={profile.lastName}
                    onChangeText={newValue => updateProfile("lastName", newValue)}
                    placeholder={"Last Name"} />

                <Text style={[styles.text,validateEmail(profile.email) ? "" : styles.error,]}>Email</Text>
                <TextInput
                    style={styles.inputBox}
                    value={profile.email}
                    keyboardType="email-address"
                    onChangeText={newValue => updateProfile("email", newValue)}
                    placeholder={"Email"} />

                <Text style={[styles.text, validateTelNum(profile.phoneNumber) ? "" : styles.error]}>Tel number</Text>
                <TextInput
                    style={styles.inputBox}
                    value={profile.phoneNumber}
                    keyboardType="phone-pad"
                    onChangeText={newValue => updateProfile("phoneNumber", newValue)}
                    placeholder={"Phone number"} />

                <Text style={styles.headerText}>Email notifications</Text>
                <View style={styles.section}>
                    <Checkbox
                        style={styles.checkbox}
                        value={profile.orderStatuses}
                        onValueChange={newValue => updateProfile("orderStatuses", newValue)}
                        color={"#495e57"} />
                <Text style={styles.paragraph}>Order statuses</Text>
                </View>

                <View style={styles.section}>
                <Checkbox
                    style={styles.checkbox}
                    value={profile.passwordChanges}
                    onValueChange={newValue => updateProfile("passwordChanges", newValue)}
                    color={"#495e57"} />
                <Text style={styles.paragraph}>Password changes</Text>
                </View>

                <View style={styles.section}>
                <Checkbox
                    style={styles.checkbox}
                    value={profile.specialOffers}
                    onValueChange={newValue => updateProfile("specialOffers", newValue)}
                    color={"#495e57"} />
                <Text style={styles.paragraph}>Special offers</Text>
                </View>

                <View style={styles.section}>
                    <Checkbox
                        style={styles.checkbox}
                        value={profile.newsletter}
                        onValueChange={newValue => updateProfile("newsletter", newValue)}
                        color={"#495e57"} />
                    <Text style={styles.paragraph}>Newsletter</Text>
                </View>

                <Pressable style={styles.btn} onPress={() => logout()}>
                    <Text style={styles.btnText}>Log out</Text>
                </Pressable>

                <View style={styles.btnBox}>
                    <Pressable style={styles.clearBtn} onPress={() => setClearProfile(true)}>
                        <Text style={styles.btnText}>Clear Changes</Text>
                    </Pressable>
                    <Pressable style={[styles.saveChangesBtn, validateForm() ? "" : styles.btnDisabled]}
                        onPress={() => update(profile)} disabled={!validateForm()} >
                        <Text style={styles.saveBtnText}>Save changes</Text>
                    </Pressable>
                </View>

            </ScrollView>

       </KeyboardAvoidingView>
    )
}

export default Profile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },

    headerBox: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        backgroundColor: '#EDEFEE',
    },

    logo: {
        width: 100,
        height: 50,
        resizeMode: 'contain',
    },

    headerText: {
        fontSize: 25,
        fontWeight: 'bold',
        paddingBottom: 8,
    },

    scrollviewBox: {
        flex: 1,
        padding: 8,
    },

    text: {
        fontSize: 16,
        marginBottom: 5,
    },
    inputBox: {
        alignSelf: "stretch",
        marginBottom: 10,
        borderWidth: 1,
        padding: 10,
        fontSize: 16,
        borderRadius: 9,
        borderColor: "#333333",
    },
    btn: {
        backgroundColor: "#f4ce14",
        borderRadius: 9,
        alignSelf: "center",
        marginVertical: 18,
        padding: 10,
        borderWidth: 1,
        borderColor: "#f4ce14",
        width: 190,
    },
    btnDisabled: {
        backgroundColor: "#5c686c",
    },
    btnBox: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        marginBottom: 60,
    },
    clearBtn: {
        backgroundColor: "#FFFFFF",
        borderRadius: 9,
        alignSelf: "stretch",
        marginRight: 18,
        padding: 10,
        borderWidth: 1,
        borderColor: "#83918c",
        width: 160,
    },
    saveChangesBtn: {
        backgroundColor: "#495E57",
        borderRadius: 9,
        alignSelf: "stretch",
        marginRight: 18,
        padding: 10,
        borderWidth: 1,
        borderColor: "#83918c",
        width: 160,
    },
    btnText: {
        fontSize: 18,
        color: "#3e524b",
        alignSelf: "center",
    },
    saveBtnText: {
        fontSize: 18,
        color: '#fff',
        alignSelf: 'center',
    },
    section: {
        flexDirection: "row",
        alignItems: "center",
    },
    paragraph: {
        fontSize: 15,
    },
    checkbox: {
        margin: 8,
      },
    error: {
        color: "#d14747",
        fontWeight: "bold",
    },
    avatarContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 8,
      },
    avatarImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    avatarEmpty: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "#0b9a6a",
        alignItems: "center",
        justifyContent: "center",
    },
    avatarEmptyText: {
        fontSize: 32,
        color: "#FFFFFF",
        fontWeight: "bold",
    },
      avatarButtons: {
        flexDirection: "row",
      },
    saveBtn: {
        backgroundColor: "#495E57",
        borderRadius: 9,
        marginHorizontal: 4,
        padding: 10,
        borderWidth: 1,
        borderColor: "#495E57",
        color: '#fff',
        // width: 150,
        // height: 50,
    },
    removeBtn: {
        backgroundColor: "#FFFFFF",
        borderRadius: 9,
        padding: 9,
        borderWidth: 1,
        borderColor: "#83918c",
        // width: 150,
        // height: 50,
        marginHorizontal: 6,
        flexShrink: 3,

    },
    });
