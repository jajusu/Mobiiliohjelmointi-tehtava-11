import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, Button, FlatList } from 'react-native';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('itemdb.db');

export default function App() {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [items, setItems] = useState([]);

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('create table if not exists item (id integer primary key not null, amount text, name text);');
    }, null, updateList); 
  }, []);

  // Save item
  const saveItem = () => {
    db.transaction(tx => {
        tx.executeSql('insert into item (amount, name) values (?, ?);', [amount, name]);    
      }, null, updateList
    )
  }

  // Update itemlist
  const updateList = () => {
    db.transaction(tx => {
      tx.executeSql('select * from item;', [], (_, { rows }) =>
        setItems(rows._array)
      ); 
    });
  }

  // Delete item
  const deleteItem = (id) => {
    db.transaction(
      tx => {
        tx.executeSql(`delete from item where id = ?;`, [id]);
      }, null, updateList
    )    
  }

  const listSeparator = () => {
    return (
      <View
        style={{
          height: 5,
          width: "80%",
          backgroundColor: "#fff",
          marginLeft: "10%"
        }}
      />
    );
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder='Name' style={{marginTop: 30, fontSize: 18, width: 200, borderColor: 'gray', borderWidth: 1}}
        onChangeText={(name) => setName(name)}
        value={name}/>  
      <TextInput placeholder='Amount' style={{ marginTop: 5, marginBottom: 5,  fontSize:18, width: 200, borderColor: 'gray', borderWidth: 1}}
        onChangeText={(amount) => setAmount(amount)}
        value={amount}/>      
      <Button onPress={saveItem} title="Save" /> 
      <Text style={{marginTop: 30, fontSize: 20}}>Shopping list</Text>
      <FlatList 
        style={{marginLeft : "5%"}}
        keyExtractor={item => item.id.toString()} 
        renderItem={({item}) => <View style={styles.listcontainer}><Text style={{fontSize: 18}}>{item.name}, {item.amount}</Text>
        <Text style={{fontSize: 18, color: '#0000ff'}} onPress={() => deleteItem(item.id)}> bought</Text></View>} 
        data={items} 
        ItemSeparatorComponent={listSeparator} 
      />      
    </View>
  );
}

const styles = StyleSheet.create({
 container: {
  flex: 1,
  backgroundColor: '#fff',
  alignItems: 'center',
  justifyContent: 'center',
 },
 listcontainer: {
  flexDirection: 'row',
  backgroundColor: '#fff',
  alignItems: 'center'
 },
});