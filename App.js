import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { FlatList, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';


export default function App() {

  const [selectedCurrency, setSelectedCurrency] = useState();
  const [currencies, setCurrencies] = useState([]);
  const [amount, setAmount] = useState(0);
  const [result, setResult] = useState('');

  var myHeaders = new Headers();
  myHeaders.append("apikey", "2wMj66O15ejLWUZNkUMYgoj2lumbYoAF");

  var requestOptions = {
    method: 'GET',
    redirect: 'follow',
    headers: myHeaders
  };


  useEffect(() => {
    fetch(`https://api.apilayer.com/exchangerates_data/symbols`, requestOptions)
      .then(response => response.json())
      .then(responseJson => setCurrencies(Object.keys(responseJson.symbols)))
      .catch(error => console.error(error));

  }, []);



  const fetchConvert = () => {
    fetch(`https://api.apilayer.com/exchangerates_data/convert?to=EUR&from=${selectedCurrency}&amount=${amount}`, requestOptions)
      .then(response => response.json())
      .then(responseJson => setResult(responseJson.result.toFixed(2)))
      .catch(error => {
        Alert.alert('Error', error.message);
      });

  }



  return (
    <View style={styles.container}>
      <Text style={styles.header}>Convert currencies to Euro</Text>
      <Text style={styles.text}>{result} €</Text>
      <View style={{ flex: 0, flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ flex: 0.2, margin: 20 }}>
          <TextInput
            style={{ width: 100, borderColor: 'gray', borderWidth: 1 }}
            keyboardType={"number-pad"}
            onChangeText={amount => setAmount(amount)}
            value={amount}
          />
        </View>
        <View style={{ flex: 0.5, marginLeft: 15 }}>
          <Picker style={styles.pickerStyle}

            selectedValue={selectedCurrency}
            onValueChange={(itemValue) => setSelectedCurrency(itemValue)}
          >
            {
              currencies.map((item) => (
                <Picker.Item key={item} label={item} value={item} />
              ))
            }
          </Picker>
        </View>
      </View>

      <Button
        title='Convert'
        onPress={fetchConvert}
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

  pickerStyle: {
    height: 150,
    width: "80%",
    color: '#344953',
    justifyContent: 'center',
  },

  header: {
    fontSize: 20,
    margin: 30
  },

  text: {
    fontSize: 20,
    marginTop: 20,
    marginBottom: 50
  }
});
