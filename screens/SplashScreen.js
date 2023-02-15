import React from 'react';
import {View, Image, StyleSheet} from 'react-native'

const SplashScreen = () => {
    return (
        <View style={styles.ctn}>
            <Image
               style={styles.logo}
               source={require('../image/logo2.png')}
            />
        </View>
    )
}

export default SplashScreen;

const styles = StyleSheet.create({
    ctn: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },

    logo: {
        width: '50%',
        height: 40,
        resizeMode: 'contain',

    }
})