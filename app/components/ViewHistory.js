import React, { Component } from 'react';
import { spreadsheet_ID, API_key, sheet_ID_GID } from '../../Test_Properties';
import { Text, View, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { styles } from '../Styles/ExistingCustomerStyles';

class ViewHistory extends Component {
    state = { 
        history_records: [],
     }
     onViewPress() {
        var SQL_QUERY = "SELECT B,C,D,E,F WHERE A = '" + this.props.username + "'ORDER BY B DESC";
        var ENCODED_SQL_QUERY = encodeURI(SQL_QUERY);
        var URL = 'https://docs.google.com/spreadsheets/d/' + spreadsheet_ID + '/gviz/tq?gid=' + sheet_ID_GID + '&headers=1&tq=' + ENCODED_SQL_QUERY;
        // console.log(URL);
        fetch(URL)
          .then(async (response) => {
            var ResponseObjectnew = await (new Response(response._bodyBlob)).text();
            var newrecord1 = ResponseObjectnew.substring(ResponseObjectnew.indexOf("(") + 1, ResponseObjectnew.lastIndexOf(")"));
            var newrecord = "{" + newrecord1.substring((newrecord1.indexOf("rows") - 1), newrecord1.lastIndexOf("]") + 1) + "}";
            var response1 = JSON.parse(newrecord);
            // console.log(response1);
            const customer_records = [];
            if (!response1.rows.length == 0) {
              for (let i = 0; i < response1.rows.length; i++) {
                const obj = {};
                if (response1.rows[i].c[0] != null) {
                  obj["Date"] = response1.rows[i].c[0].f + " | ";
                } else {
                  obj["Date"] = "NA" + " |";
                }
                if (response1.rows[i].c[1] != null) {
                  obj["Name"] = response1.rows[i].c[1].v + " |";
                } else {
                  obj["Name"] = "NA" + " |";
                }
                if (response1.rows[i].c[2] != null) {
                  obj["JarsDelivered"] = response1.rows[i].c[2].v + " |";
                } else {
                  obj["JarsDelivered"] = "NA" + " |";
                }
                if (response1.rows[i].c[3] != null) {
                  obj["JarsPicked"] = response1.rows[i].c[3].v + " |";
                } else {
                  obj["JarsPicked"] = "NA" + " |";
                }
                if (response1.rows[i].c[4].v != null) {
    
                  obj["AmountPaid"] = response1.rows[i].c[4].v;
                } else {
    
                  obj["AmountPaid"] = "NA";
                }
                customer_records.push(obj);
            }
        } else {
              const obj1 = {};
              obj1["Date"] = 'No records found';
              obj1["Name"] = '';
              obj1["JarsDelivered"] = '';
              obj1["JarsPicked"] = '';
              obj1["AmountPaid"] = '';
              customer_records.push(obj1);
            }
            this.setState({
              history_records: customer_records,
            });
          })
          .then((response) => { })
          .catch((error) => {
            console.error(error);
          });
        }
    render() { 
        return (
          <View>      
             <View style={{ flexDirection: 'row' }}  >
                <TouchableOpacity onPress={this.onViewPress.bind(this)}>
                    <View style={styles.buttonView}>
                    <Text style={styles.buttonText}>View History</Text>
                    </View>
                </TouchableOpacity>
             </View>
             <View style={styles.container}>
                <ScrollView horizontal={true}>
                    <FlatList
                    data={this.state.history_records}
                    renderItem={({ item }) => <Text style={styles.item}>{item.Date}  {item.Name}  {item.JarsDelivered}  {item.JarsPicked}  {item.AmountPaid}</Text>}
                    ItemSeparatorComponent={() => <View style={{ width: 1, height: 1, backgroundColor: '' }} />}
                    keyExtractor={(item, index) => index.toString()}
                    />
                </ScrollView>
             </View>
          </View>    
        );
    }
}
export default ViewHistory;