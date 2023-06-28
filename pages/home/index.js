import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, FlatList, RefreshControl, ActivityIndicator, Alert, Button } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'react-native';
import { useRouter } from 'expo-router';
import LogoutComponent  from '../../shared/logout';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';

import Location from '../../shared/location'

import API, { setClientToken } from '../../shared/api';



const Home = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(true);
    const [isListLoading, setIsListLoading] = useState(false);
    const [scanlist, setScanlist] = useState([]);
    const [myTotal, setMyTotal] = useState(0);
    const [myTodayTotal, setMyTodayTotal] = useState(0);
    const [nextpage, setNextpage] = useState(1);
    const userData = useSelector((state) => state.user.userData);
    const token = useSelector((state) => state.user.token);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');
    const currentDate = moment().format('DD-MM-YY');

    const [showdateSelected, setshowdateSelected] = useState(currentDate);
    const handleConfirm = (date) => {
        console.log(date.toISOString().split('T')[0]);
        setSelectedDate(date.toISOString().split('T')[0]); // Set the selected date
        getScanList(date.toISOString().split('T')[0]);
        setDatePickerVisibility(false);
        const adjustedDate = moment(date); // Add 1 day to the selected date
        const formattedDate = adjustedDate.format('DD-MM-YY');
        setshowdateSelected(formattedDate);
        // }
        // Process the selected date
        // You can update your state or perform any other actions here
    };

    const getScanList = (dateUserSelect) => {
        if (!dateUserSelect) { // Check if selectedDate is empty or undefined
            dateUserSelect = currentDate; // Set the current date as selectedDate
        } else {
        }
        //  alert(dateUserSelect);
        setIsLoading(true);
        setClientToken(token);
        setIsListLoading(true);
        // console.log(token);
        API.get(`drivers/scans?page=${nextpage}&created_at=${dateUserSelect}`, {
        }).then(function (response) {
            setScanlist([]);
            const originalString = response.data.data.next_page_url;
            if (originalString != null) {
                const explodedArray = originalString.split('?page=');
                if (explodedArray[1] !== undefined) {
                    setNextpage(explodedArray[1]);
                    if (scanlist === undefined) {
                        setScanlist(response.data.data.data);
                        console.log(response.data.data.data);
                    } else {
                        const mergedArray = [...scanlist, ...response.data.data.data];
                        const uniqueArray = mergedArray.filter((obj, index, self) => {
                            return index === self.findIndex((o) => o.id === obj.id);
                        });
                        setScanlist(uniqueArray);

                    }
                }
            } else {
                setScanlist(response.data.data.data);
                setNextpage("noPageFound");
            }

            // }
            setIsListLoading(false);
            setIsLoading(false);
            setRefreshing(false);

        }).catch(function (error) {

            alert(error);
            setIsLoading(false);
            setRefreshing(false);
            setIsListLoading(false);


        });
    }



    const getData = () => {
        setIsLoading(true);
        setClientToken(token);
        // console.log(token);
        API.get(`drivers/dashboard`, {
        }).then(function (response) {
            // console.log(response.data);
            if (response.data.status === 0) {
                alert(response.data.message);
            } else {

                let SetMyTodayTotal = 0;
                let SetMyTotal = 0;

                if (response.data.data.today_scans != undefined) {
                    SetMyTodayTotal = response.data.data.today_scans;
                }

                if (response.data.data.current_month_scans != undefined) {
                    SetMyTotal = response.data.data.current_month_scans;

                }

                setMyTodayTotal(SetMyTodayTotal);
                setMyTotal(SetMyTotal);

            }

            setIsLoading(false);
            setRefreshing(false);

        }).catch(function (error) {

            alert(error);
            setIsLoading(false);
            setRefreshing(false);

        });
    }

    useEffect(() => {
        getData();
        getScanList();
        setSelectedDate('');
    }, []);


    const getCurrentDateTime = (dateTimeString) => {
        const day = moment().format('DD');
        const year = moment().format('YY');

        const dateTime = new Date(dateTimeString);
        const month = dateTime.toLocaleString('default', { month: 'short' });
        const ampm = dateTime.getHours() < 12 ? 'AM' : 'PM';
        const hours = dateTime.getHours() % 12 || 12;
        const minutes = dateTime.getMinutes();
        // const seconds = dateTime.getSeconds();
        return `${day}-${month}-${year} ${hours}:${minutes} ${ampm}`;
    };


    // [{"created_at": "2023-06-17 16:47:06", "deleted_at": null, "id": 23, "lati
    // tude": "30.136582", "location": {"created_at": "2023-06-01 11:20:34", "id": 6, "
    // name": "Karnal", "updated_at": "2023-06-01 11:20:34"}, "location_id": 6, "longit
    // ude": "77.2765183", "rfid": "1360014082", "updated_at": "2023-06-17 16:47:06", "
    // user_id": 158}, {"created_at": "2023-06-17 16:47:02", "deleted_at": null, "id":
    // 22, "latitude": "30.136582", "location": {"created_at": "2023-06-01 11:20:34", "
    // id": 6, "name": "Karnal", "updated_at": "2023-06-01 11:20:34"}, "location_id": 6
    // , "longitude": "77.2765183", "rfid": "1348577778", "updated_at": "2023-06-17 16:
    // 47:02", "user_id": 158}, {"created_at": "2023-06-17 16:46:50", "deleted_at": nul
    // l, "id": 21, "latitude": "30.136582", "location": {"created_at": "2023-06-01 11:
    // 20:34", "id": 6, "name": "Karnal", "updated_at": "2023-06-01 11:20:34"}, "locati
    // on_id": 6, "longitude": "77.2765183", "rfid": "1362656770", "updated_at": "2023-
    // 06-17 16:46:50", "user_id": 158}]




    const Item = ({ row }) => (
        <View style={{
            backgroundColor: '#fff',
            padding: 8,
            marginTop: 10,
            marginHorizontal: 10,
            borderRadius: 5
        }}
        >
            <Text style={{ position: 'absolute', right: 0, marginRight: 8, marginTop: 4, color: '#888', fontSize: 12 }}>
                <Ionicons name="md-calendar-outline" size={14} color="#888" />
                &nbsp;
                {/* {} */}
                {getCurrentDateTime(row.created_at)}
            </Text>
            <Text style={{ fontSize: 15, fontWeight: 'bold' }}>
                <Ionicons name="md-bookmark" size={14} color="dodgerblue" />
                &nbsp;
                {row.rfid} id = {row.id}

            </Text>
            <Text style={{ fontSize: 15, marginTop: 5, marginBottom: 5 }}>
                <Ionicons name="list" size={14} color="dodgerblue" />
                &nbsp;
                title

            </Text>
            <Text>
                <Ionicons name="md-location-outline" size={14} color="dodgerblue" />
                &nbsp;
                {row.latitude} / {row.longitude}
            </Text>
        </View>
    );


    const handleScroll = ({ nativeEvent }) => {
        const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
        const isScrollEnd =
            layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;

        if (isScrollEnd) {
            if (nextpage != "noPageFound") {
                getScanList();
            }
        }
    };
    const RefreshList = () => {
        setNextpage("1");
        setSelectedDate('');
        setScanlist([]);
        getScanList();

    };

    return (
        <><View style={{ flex: 1 }}>
            <View style={{ height: 100, backgroundColor: "#007bff" }}>
                <View style={{ height: 45, }}></View>
                <View style={{ flex: 1, flexDirection: 'row' }}>

                    <View style={{ flex: 0.8, paddingTop: 14, paddingLeft: 15 }}>
                        <Text
                            style={{ color: "#fff", fontSize: 20, fontWeight: 'bold' }}
                        >
                            Dashboard
                        </Text>
                    </View>
                    <View style={{ flex: 0.2, alignItems: 'flex-end' }}>
                    <LogoutComponent/>
                    </View>
                </View>
            </View>
            <ScrollView style={{ backgroundColor: '#eee' }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={getData} />}>
                <View style={{ paddingHorizontal: 15, paddingTop: 10 }}>
                    <Text style={{ alignSelf: 'center' }}>Welcome <Text style={{ fontWeight: 'bold' }}>{userData.name}</Text> </Text>
                </View>
                <View style={{ flex: 1, flexDirection: 'row', paddingVertical: 15 }}>
                    <View style={{ flex: 0.5, marginLeft: 10, paddingHorizontal: 5 }}>
                        <View style={{ padding: 20, borderRadius: 10, backgroundColor: "#fff" }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 20, color: "dodgerblue" }}>
                                <Ionicons name="pricetags" size={20} color="lightblue" />
                                &nbsp;
                                {myTotal}

                            </Text>
                            <Text style={{ fontWeight: 'bold', fontSize: 15, color: "#999" }}>
                                Total Installs

                            </Text>
                        </View>
                    </View>
                    <View style={{ flex: 0.5, marginRight: 10, paddingHorizontal: 5 }}>
                        <View style={{ padding: 20, borderRadius: 10, backgroundColor: "#fff" }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 20, color: "dodgerblue" }}>
                                <Ionicons name="pricetags" size={20} color="lightblue" />
                                &nbsp;
                                {myTodayTotal}

                            </Text>
                            <Text style={{ fontWeight: 'bold', fontSize: 15, color: "#999" }}>
                                Today's Installs

                            </Text>
                        </View>
                    </View>
                </View>

                <View style={{ flex: 1, flexDirection: 'column', paddingHorizontal: 15, }}>
                    <TouchableOpacity onPress={() => { router.push(`/scanning`); }} style={{ backgroundColor: 'dodgerblue', padding: 10, alignItems: 'center', borderRadius: 100 }}>
                        <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                            Start Scanning
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={{ paddingVertical: 15, marginTop: 15 }}>
                    <View style={{ flex: 1, paddingHorizontal: 10, flexDirection: 'row', borderTopColor: '#eee', marginTop: -15, borderTopWidth: 1, paddingTop: 10 }}>
                        <View style={{ flex: 0.75 }}>
                            <Text style={{ fontWeight: 'bold', color: 'dodgerblue', flex: 1, marginHorizontal: 0 }}>
                                My Installed Tags
                            </Text>
                        </View>
                        <View style={{ flex: 0.25 }}>
                            <TouchableOpacity onPress={() => setDatePickerVisibility(true)}>
                                <Text style={{ fontWeight: 'bold', color: '#888', flex: 1, marginHorizontal: 0 }}>
                                    <Ionicons name="md-calendar-outline" size={22} color="dodgerblue" />  {showdateSelected}
                                </Text>
                            </TouchableOpacity>
                            <DateTimePickerModal
                                isVisible={isDatePickerVisible}
                                mode="date"
                                onConfirm={handleConfirm}
                                onCancel={() => setDatePickerVisibility(false)}
                            />

                        </View>
                        {/* <View style={{ flex: 0.15 }}>
                            <TouchableOpacity onPress={RefreshList} style={{ flex: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 50, backgroundColor: 'dodgerblue' }}>
                                <Ionicons name="md-refresh-outline" size={20} color="#fff" />
                            </TouchableOpacity>
                        </View> */}
                    </View>
                </View>
            </ScrollView>

            <View Style={{ flex: 1, height: "50%", backgroundColor: "#eee" }} >
                <View style={{ height: 450, backgroundColor: "#eee" }}>
                    {isListLoading ?
                        (
                            <Text style={{ marginVertical: 20, alignSelf: 'center' }}> <ActivityIndicator size="large" color={'dodgerblue'} /> </Text>
                        ) :
                        (
                            <FlatList
                                data={scanlist}
                                renderItem={({ item }) => <Item row={item} />}
                                keyExtractor={item => item.id}
                                onScroll={handleScroll}
                                ListEmptyComponent={() => (
                                    <View style={{ alignItems: 'center', marginTop: 20 }}>
                                        <Text style={{ fontSize: 16, color: 'gray' }}>No scanning entries found on selected date</Text>
                                    </View>
                                )}
                            />
                        )}
                </View>

            </View>
        </View><>
                <Location />
            </></>
    )
}

export default Home;