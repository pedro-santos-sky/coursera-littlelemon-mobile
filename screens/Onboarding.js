import React, {useState, useRef, useContext} from "react";
import {
    View,
    Image,
    Text,
    KeyboardAvoidingView,
    TextInput,
    Pressable,
    StyleSheet,
    Platform,
} from "react-native";
import PagerView from 'react-native-pager-view';
import { validateName, validateEmail, validatePassword } from "../utils/validate";
import { AuthContext } from "../context/AuthContext";

export const Onboarding = ({navigation}) => {

    const [firstName, onChangeFirstName] = useState("")
    const [lastName, onChangeLastName] = useState("")
    const [email, onChangeEmail] = useState("")
    const [password, onChangePassword] = useState("")

    const isFirstNameValid = validateName(firstName)
    const isLastNameValid = validateName(lastName)
    const isEmailValid = validateEmail(email)
    const isPasswordValid = validatePassword(password)
    const pagerViewRef = useRef(PagerView)
    const { onboarded } = useContext(AuthContext)


    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? "padding" : "height"}>

            <View style={styles.headerBox}>
                <Image
                    source={require('../image/logo1.png')}
                    accessible={true}
                    accessibilityLabel={'Little Lemon Logo'}
                    style={styles.logo} />

                <Text style={styles.headerText}>Little Lemon</Text>
            </View>

            <View style={styles.ctn}>
                <Text style={styles.regularText}>Let us get to know you</Text>
            </View>

            <PagerView scrollEnabled={false} initialPage={0} style={styles.pageView} ref={pagerViewRef} >

                <View style={styles.page} key="1">
                    <View style={styles.pageBox}>
                        <Text style={styles.regularText}>First Name</Text>
                        <TextInput
                            style={styles.input}
                            value={firstName}
                            onChangeText={onChangeFirstName}
                            placeholder={'first Name'} />

                        <Text style={styles.regularText}>LastName</Text>
                        <TextInput
                            style={styles.input}
                            value={lastName}
                            onChangeText={onChangeLastName}
                            placeholder={'lastName'} />
                    </View>

                    <View style={styles.ellipsis}>
                        <View style={[styles.dot, styles.dotActive]}></View>
                        <View style={styles.dot}></View>
                        <View style={styles.dot}></View>
                    </View>

                    <Pressable
                        style={[styles.button, isFirstNameValid && isLastNameValid ? "" : styles.buttonDisabled]}
                        disabled={!isLastNameValid && !isFirstNameValid}
                        onPress={() => pagerViewRef.current.setPage(1)} >
                        <Text style={styles.regularText}>Next</Text>
                    </Pressable>

                </View>

                <View style={styles.page} key="2">
                    <View style={styles.pageBox}>
                        <Text style={styles.regularText}>Email</Text>
                        <TextInput
                            style={styles.input}
                            value={email}
                            onChangeText={onChangeEmail}
                            placeholder={'Email'}
                            keyboardType={'email-address'} />

                        <Text style={styles.regularText}>Password</Text>
                        <TextInput
                            style={styles.input}
                            value={password}
                            onChangeText={onChangePassword}
                            placeholder={'Password'}
                            keyboardType={'visible-password'} />
                    </View>

                    <View style={styles.ellipsis}>
                        <View style={styles.dot}></View>
                        <View style={[styles.dot, styles.dotActive]}></View>
                        <View style={styles.dot}></View>
                    </View>
                    <View style={styles.btnCtn}>
                        <Pressable
                            style={styles.smbtn}
                            onPress={() => pagerViewRef.current.setPage(0)} >
                                <Text style={styles.regularText}>Back</Text>
                        </Pressable>

                        <Pressable
                            style={[styles.smbtn, isEmailValid && isPasswordValid ? "" : styles.buttonDisabled]}
                            disabled={!isEmailValid && !isPasswordValid}
                            onPress={() => pagerViewRef.current.setPage(2)} >
                            <Text style={styles.regularText}>Next</Text>
                        </Pressable>
                    </View>

                </View>

                <View style={styles.page} key="3">
                    <View style={styles.pageBox}>
                        <Text style={styles.regularText}>Thank you for registering!</Text>
                    </View>

                    <View style={styles.ellipsis}>
                        <View style={styles.dot}></View>
                        <View style={styles.dot}></View>
                        <View style={[styles.dot, styles.dotActive]}></View>
                    </View>

                    <View style={styles.btnCtn}>
                        <Pressable
                            style={[styles.smbtn, isEmailValid && isPasswordValid ? "" : styles.buttonDisabled]}
                            disabled={!isEmailValid && !isPasswordValid}
                            onPress={() => onboarded({firstName, lastName, email, password})} >
                            <Text style={styles.regularText}>Submit</Text>
                        </Pressable>

                    </View>

                </View>

            </PagerView>
        </KeyboardAvoidingView>
    )
}




const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    },

    ctn: {
        marginTop: 30,
        marginBottom: 60,
    },

    regularText: {
        fontSize: 20,
        fontWeight: '500',
        justifyContent: 'center',
        alignSelf: 'center',
    },

    pageView: {
        flex: 1,
      },

    page: {
        justifyContent: 'center',
    },

    pageBox: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    input: {
        borderColor: "#fbdabb",
        backgroundColor: "#fbdabb",
        alignSelf: "stretch",
        height: 50,
        margin: 18,
        borderWidth: 1,
        padding: 10,
        fontSize: 20,
        borderRadius: 9,
    },

    btnCtn: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginLeft: 18,
        marginBottom: 60,
      },

    button: {
        borderColor: "#f4ce14",
        backgroundColor: "#f4ce14",
        borderRadius: 9,
        marginRight: 18,
        marginLeft: 18,
        padding: 10,
        borderWidth: 1,
        width: 200,
        alignSelf: 'flex-end',
    },

    smbtn: {
        flex: 1,
        borderColor: "#f4ce14",
        backgroundColor: "#f4ce14",
        borderRadius: 9,
        alignSelf: "stretch",
        marginRight: 18,
        padding: 10,
        borderWidth: 1,
    },

    btn: {
        margin: 10,
        borderColor: "#f4ce14",
        backgroundColor: "#f4ce14",
        borderRadius: 9,
        width: 200,
        alignSelf: 'center',
    },

    buttonDisabled: {
        backgroundColor: "#f1f4f7",
        marginRight: 18,
        marginLeft: 18,
        borderColor: '#333333',
    },

    ellipsis: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
      },

    dot: {
        backgroundColor: "#67788a",
        width: 22,
        height: 22,
        marginHorizontal: 10,
        borderRadius: 11,
      },

      dotActive: {
        backgroundColor: "#f4ce14",
        width: 22,
        height: 22,
        borderRadius: 11,
      },
})

