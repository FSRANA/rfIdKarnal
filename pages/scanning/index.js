import React, { useState, useEffect, useRef  } from 'react';
import { View, Text, TouchableOpacity, ScrollView, FlatList, TextInput, ActivityIndicator, Keyboard  } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'react-native';
import {useRouter}  from 'expo-router';
import LogoutComponent  from '../../shared/logout';
import { useSelector, useDispatch } from 'react-redux';

import * as MyLocation from 'expo-location';

import Location from '../../shared/location'

import API, {setClientToken} from '../../shared/api';


const ScanningScreen = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const textInputRef = useRef(null);
    const [rfid,setRfid] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isListLoading, setIsListLoading] = useState(false);
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const userData = useSelector((state) => state.user.userData);
    const token = useSelector((state) => state.user.token);


    const fetchCurrentLocation =  async () => {
        let { status } = await MyLocation.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Location Access is required for using this app.');
          return;
        }
  
        // Get the current location
        let location = await MyLocation.getCurrentPositionAsync({});
        setLocation(location);
    }

    useEffect(() => {
        fetchCurrentLocation();
    }, []);

    const handleKeyPress = (event) => {
        //const { key } = event.nativeEvent;
        
        if(rfid){
            setRfid("");
        }
    };
      
    const processInput = (rfid) => {
        setRfid(rfid);
        if(rfid.length == 10){
            setIsLoading(true);
            setClientToken(token);
            fetchCurrentLocation();
            // console.log(token);
            API.post(`updateTagScan`, {
                rfid: rfid, 
                latitude: location.coords.latitude ?? "",
                longitude: location.coords.longitude ?? ""

            }).then(function (response) {
                
                if(response.data.status === 0){
                    alert(response.data.message);
                } else {
                    alert(response.data.message);
                }
                setRfid("");
                setIsLoading(false);

            }).catch(function (error) {

                alert(error);
                setIsLoading(false);

            });
        } 
    }

    const DATA = [
        {
            id:'1',
            sr_no:'1',
            rfid:'123',
            address:'we',
            phone:'123',
            location_id:'3',
            created_at:'12',
            updated_at:'12',
            latitude:'123',
            longitude:'123',
            installed_by:'1',
            status:'1'
        },
        {
            id:'2',
            sr_no:'1',
            rfid:'1243',
            address:'wetegg',
            phone:'123',
            location_id:'3',
            created_at:'12',
            updated_at:'12',
            latitude:'44123',
            longitude:'666123',
            installed_by:'1',
            status:'1'
        },
        
    ];

    const Item = ({row}) => (
        <View style={{ 
            backgroundColor: '#fff',
            padding: 8,
            marginTop: 10,
            marginHorizontal: 10,
            borderRadius:5 }}
        >
            <Text style={{ position:'absolute',right:0, marginRight:8, marginTop:4 }}>
                <Ionicons name="md-calendar-outline" size={14} color="dodgerblue"/>
                &nbsp;
                {row.created_at}
            </Text>
            <Text style={{ fontSize: 15, fontWeight:'bold' }}>
                <Ionicons name="md-bookmark" size={14} color="dodgerblue"/>
                &nbsp;
                {row.rfid}
                
            </Text>
            <Text>
                <Ionicons name="md-location-outline" size={14} color="dodgerblue"/>
                &nbsp;
                {row.latitude} / {row.latitude}
            </Text>
        </View>
    );
   

    return (
        <View style={{ flex:1 }}>
            <View style={{ height:100, backgroundColor:"dodgerblue" }}>
                <View style={{ height:45, }}></View>
                <View style={{ flex:1, flexDirection:'row' }}>
                    <View style={{ flex:0.15}}>
                        <TouchableOpacity style={{ padding:15 }} onPress={() => {router.push(`/dashboard`);}}>
                            <Ionicons name="md-arrow-back" size={25} color="#fff" />
                        </TouchableOpacity>
                   </View>
                    <View style={{ flex:0.65, paddingTop:14  }}>
                        <Text
                            style={{ color:"#fff", fontSize:20, fontWeight:'bold' }}
                        >
                            Scanning
                        </Text>
                    </View>
                    <View style={{ flex:0.2, alignItems:'flex-end' }}>
                       <LogoutComponent/>
                    </View>
                </View>
            </View>
            <ScrollView style={{ backgroundColor:'#eee' }}>
            <View style={{ paddingHorizontal:15,paddingTop:10, textAlign:'center' }}>
                    <Text style={{ alignSelf:'center' }}>Welcome <Text style={{ fontWeight:'bold' }}>{userData.name}</Text> </Text>
                </View>
                <View style={{ flex:1, flexDirection:'column', paddingHorizontal:15, paddingVertical:15}}>
                    <View style={{ alignItems:'center' }}>
                        <TextInput 
                            ref={textInputRef}
                            style={{ 
                                borderColor:"transparent",
                                borderWidth:1,
                                width:"100%", padding:8,
                                paddingHorizontal:15,
                                borderRadius:50,
                                backgroundColor:'transparent',
                                fontSize:30,
                                textAlign:'center'
                            }} 
                            placeholder="Scan RFID Tag"
                            placeholderTextColor="#ccc"
                            autoCapitalize="none"
                            cursorColor="#111"
                            value={rfid}
                            onChangeText={ rfid => processInput(rfid) }
                            maxLength={10}
                            autoFocus={true}
                            // editable={false}
                            // inputMode='numeric'
                            onKeyPress={handleKeyPress}
                            onBlur={() => { textInputRef.current.focus() }}
                        />
                    </View>
                    {isLoading ? (<ActivityIndicator size="small" color={'dodgerblue'} />) : ("")}
                    
                </View>
                <View style={{ paddingVertical:15,display:'none' }}>
                    <View style={{ flex:1,paddingHorizontal:10,flexDirection:'row', borderTopColor:'#fff', marginTop:-15,borderTopWidth:1, paddingTop:10 }}>
                        <View style={{ flex:0.85 }}>
                            <Text style={{ fontWeight:'bold',fontSize:20,color:'dodgerblue', flex:1, marginHorizontal:0}}>
                                My Installed Tags 
                            </Text>
                        </View>
                        <View style={{ flex:0.15}}>
                            <TouchableOpacity style={{ flex:1, justifyContent:'center',alignItems:'center',borderRadius:50, backgroundColor:'dodgerblue' }}>
                                <Ionicons name="md-refresh-outline" size={20} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    </View>
                    
                    <View Style={{ flex:1,display:'none' }}>
                        {
                            isListLoading ?
                            (
                                <Text style={{ marginVertical:20, alignSelf:'center' }}> <ActivityIndicator size="large" color={'dodgerblue'} /> </Text>
                            ) :
                            (
                                <FlatList
                                    data={DATA}
                                    renderItem={({item}) => <Item row={item} />}
                                    keyExtractor={item => item.id}
                                /> 
                            )
                        }
                         
                    </View>
                </View>
                
            </ScrollView>
                <>
                    <Location />
                </>
           
        </View>
    )
}

export default ScanningScreen;