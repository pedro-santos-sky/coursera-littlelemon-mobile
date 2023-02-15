import React, {useState, useEffect, useCallback, useMemo} from 'react';
import {View, Text, StyleSheet, Pressable, SectionList, Image, Alert, SafeAreaView, ScrollView} from 'react-native';
import { Searchbar } from 'react-native-paper';
import debounce from 'lodash.debounce';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants'
import {
    createTable,
    getMenuItems,
    saveMenuItems,
    filterByQueryAndCategories,
} from "../db";
import Filters from "../components/Filters";
import { getSectionListData, useUpdateEffect } from "../utils/utils";


const apiURL = `https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json`


const sections = ['starters', 'mains', 'desserts']

const Item = ({name, price, description, image}) => {
    const menuImage = `https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${image}?raw=true`
    return (
        <View style={styles.menuBox}>
            <View style={styles.menuBody}>
                <Text style={styles.menuName}>{name}</Text>
                <Text style={styles.menuDesc}> {description} </Text>
                <Text style={styles.menuPrice}> ${price} </Text>
            </View>
            <View>
                <Image
                  style={styles.menuPix}
                  source={{ uri: menuImage}}  />
            </View>
        </View>
    )
}


const Home = ({navigation}) => {

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
      });
      const [data, setData] = useState([]);
      const [searchBarText, setSearchBarText] = useState("");
      const [query, setQuery] = useState("");
      const [filterSelections, setFilterSelections] = useState(sections.map(() => false));

    const getMenuData = async () => {
        try {
            const menuData = await fetch(apiURL)
            const menuJson = await menuData.json()
            const menuitem = await menuJson.menu.map((item, index) => ({
                id: index + 1,
                name: item.name,
                price: item.price,
                description: item.description,
                image: item.image,
                category: item.category,
            }))
            return menuitem
        } catch (e) {
            console.error(e)
        } finally {

        }
    }

    useEffect(() => {
        (async () => {
            let menuitems = []
            try{
                await createTable()
                menuitems = await getMenuItems()
                if(!menuitems.length){
                    menuitems = await getMenuData()
                    saveMenuItems(menuitems)
                }
                const sectionListData = getSectionListData(menuitems)
                setData(sectionListData)
                const getProfileData = await AsyncStorage.getItem('profile')
                setProfile(JSON.parse(getProfileData))
            } catch (e) {
                Alert.alert(e.message)
            }
        })()
    }, [])

    useUpdateEffect(() => {
        (async () => {
            const activeCategories = sections.filter((s, i) => {
                if(filterSelections.every((item) => item === false)) {
                    return true
                }
                return filterSelections[i]
            })
            try{
                const menuItems = await filterByQueryAndCategories(
                    query,
                    activeCategories
                )
                const sectionListData = getSectionListData(menuItems)
                setData(sectionListData)
            } catch (e){
                Alert.alert(e.message)
            }
        })()
    }, [filterSelections, query])

    const lookup = useCallback(q => {
        setQuery(q);
      }, []);

      const debouncedLookup = useMemo(() => debounce(lookup, 500), [lookup]);

      const handleSearchChange = (text) => {
        setSearchBarText(text);
        debouncedLookup(text);
      };

      const handleFiltersChange = async (index) => {
        const arrayCopy = [...filterSelections];
        arrayCopy[index] = !filterSelections[index];
        setFilterSelections(arrayCopy);
      };


    return (
       <SafeAreaView style={styles.container}>
            <View style={styles.headerBox}>
                <Image
                    source={require('../image/logo3.png')}
                    accessible={true}
                    accessibilityLabel={'Little Lemon Logo'}
                    style={styles.logo} />

                <Pressable style={styles.avatar} onPress={() => navigation.navigate("Profile")} >
                        {profile.image ? ( <Image source={{ uri: profile.image }} style={styles.avatarImage} />
                    ) : (
                        <View style={styles.avatarEmpty}>
                            <Text style={styles.avatarEmptyText}>
                            {profile.firstName && Array.from(profile.firstName)[0]}
                            {profile.lastName && Array.from(profile.lastName)[0]}
                            </Text>
                        </View>
                        )}
                </Pressable>
            </View>

            <View style={styles.heroSection}>
                <Text style={styles.mainHeader}>Little Lemon</Text>
                <Text style={styles.subHeader}>Chicago</Text>
                <View style={styles.heroBody}>
                    <Text style={styles.heroText}>We are a family owned Mediterranean restaurant,
                        focused on traditional recipes served with a modern twist.
                    </Text>
                    <Image
                        style={styles.heroImage}
                        source={require('../image/heroImage.png')}
                        accessible={true}
                        accessibilityLabel={'little lemon food'}  />
                </View>
                <Searchbar
                    placeholder="Search"
                    placeholderTextColor="#333333"
                    onChangeText={handleSearchChange}
                    value={searchBarText}
                    style={styles.searchBar}
                    iconColor="#333333"
                    inputStyle={{ color: "#333333" }}
                    elevation={0}
                />
            </View>

            <View>
                <View style={styles.orderHeader}>
                  <Text style={styles.orderText}>ORDER FOR DELIVERY!</Text>
                  <Image
                    style={styles.orderIcon}
                    source={require('../image/deliveryVan.png')}
                    accessible={true}
                    accessibilityLabel={'delivery van icon'} />
                </View>

                <Filters
                    selections={filterSelections}
                    onChange={handleFiltersChange}
                    sections={sections}
                />

                  <SectionList
                        style={styles.sectionList}
                        sections={data}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => (
                        <Item
                            name={item.name}
                            price={item.price}
                            description={item.description}
                            image={item.image}
                        />
                        )}
                        renderSectionHeader={({ section: { name } }) => (
                        <Text style={styles.sectionHeader}>{name}</Text>
                        )}
                    />



            </View>

       </SafeAreaView>
    )
}

export default Home;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: Constants.statusBarHeight,
    },

    headerBox: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        backgroundColor: '#EDEFEE',
        padding: 10,
    },

    logo: {
        height: 50,
        width: 150,
        resizeMode: 'contain',
    },

    avatar: {
        flex: 1,
        position: "absolute",
        right: 10,
        top: 10,
      },

      avatarImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
      },

      avatarEmpty: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: "#0b9a6a",
        alignItems: "center",
        justifyContent: "center",
      },

      avatarEmptyText: {
        fontSize: 32,
        color: "#FFFFFF",
        fontWeight: "bold",
      },

      heroSection: {
        backgroundColor: "#495E57",
        padding: 16,
      },

      mainHeader: {
        color: "#f4ce14",
        fontSize: 48,
        marginTop: -8,
      },

      subHeader: {
        color: "#fff",
        fontSize: 30,
      },

      heroBody: {
        flexDirection: 'row',
        justifyContent: 'space-between',
      },

      heroText: {
        color: '#fff',
        fontSize: 16,
        width: '70%',
      },

      heroImage: {
        width: 104,
        height: 104,
        borderRadius: 16,
      },

      searchBar: {
        marginTop: 15,
        backgroundColor: "#edefee",
        shadowRadius: 0,
        shadowOpacity: 0,
      },

      orderHeader: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
      },

      orderText: {
        fontSize: 18,
        padding: 15,
        fontWeight: 'bold',
        width: '60%',
      },

      orderIcon: {
        height: 40,
        width: 40,
        resizeMode: 'contain',
      },

      sectionList: {
        paddingHorizontal: 16,
      },

      sectionHeader: {
        fontSize: 24,
        paddingVertical: 8,
        color: "#495e57",
        backgroundColor: "#fff",
      },

      menuBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopColor: '#cccccc',
        borderTopWidth: 2,
        paddingVertical: 8,
      },

      menuBody: {
        flex: 1,
      },

      menuName: {
        fontSize: 20,
        color: "#000000",
        paddingBottom: 5,
      },

      menuDesc: {
        color: "#495e57",
        paddingRight: 5,
      },

      menuPrice: {
        fontSize: 20,
        color: "#EE9972",
        paddingTop: 5,
      },

      menuPix: {
        width: 100,
        height: 100,
      }

})