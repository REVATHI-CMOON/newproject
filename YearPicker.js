// import React, { useState, useCallback } from 'react';
// import { View, SafeAreaView, Text, TouchableOpacity } from 'react-native';
// import MonthPicker from 'react-native-month-year-picker';
// import moment from 'moment';
// const YearPicker = () => {
//     const [date, setDate] = useState(new Date());
//     const [show, setShow] = useState(false);
//     const showPicker = useCallback((value) => setShow(value), []);

//     const onValueChange = useCallback(
//         (event, newDate) => {
//             const selectedDate = newDate || date;

//             showPicker(false);
//             setDate(selectedDate);
//         },
//         [date, showPicker],
//         console.log(date.toString().substr(4, 12))
//     );


//     return (
//         <SafeAreaView>
//             <TouchableOpacity onPress={() => showPicker(true)}>
//                 <Text>Select date</Text>
//             </TouchableOpacity>
//             {
//                 show && (
//                     <MonthPicker
//                         onChange={onValueChange}
//                         value={date}
//                         // minimumDate={new Date()}
//                         // maximumDate={new Date(2025, 5)}
//                         locale="en"
//                         mode="number"
//                     />
//                 )
//             }
//         </SafeAreaView>
//     );
// };

// export default YearPicker;


// import React, { useState, useCallback } from 'react';
// import { View, SafeAreaView, Text, TouchableOpacity } from 'react-native';
// import MonthPicker from 'react-native-month-year-picker';
// import moment from 'moment';

// export default class YearPicker extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             show: "",
//             selectedDate: new Date(),
//         }
//     }
//     onValueChange = (event, newDate) => {
//         this.setState({ selectedDate: newDate })
//         showPicker(false)
//     }
//     render() {
//         return (
//             <SafeAreaView>
//                 <TouchableOpacity onPress={() => showPicker(true)}>
//                     <Text>Select date</Text>
//                 </TouchableOpacity>
//                 {
//                     show && (
//                         <MonthPicker
//                             onChange={this.onValueChange}
//                             value={date}
//                             // minimumDate={new Date()}
//                             // maximumDate={new Date(2025, 5)}
//                             locale="en"
//                             mode="number"
//                         />
//                     )
//                 }
//             </SafeAreaView>
//         );
//     }
// }
{/* <MonthYearPicker
                            close={() => this.setState({ isShow: false })}
                            onChangeYear={(year) => console.log(year)}
                            onChangeMonth={(month) => {
                                // console.log(month)
                            }}
                        /> */}

import React, { useState, useCallback } from 'react';
import { View, SafeAreaView, Text, TouchableOpacity, StyleSheet, Picker, TouchableWithoutFeedback } from 'react-native';
import MonthYearPicker from 'react-native-simple-month-year-picker';
import Modal from 'react-native-modal';
import {
    Icon,
} from 'native-base';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
export default class YearPicker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isShow: false,
            isVisible: false,
            Months: [
                {
                    "id": "1",
                    "option_value": "Jan"
                },
                {
                    "id": "2",
                    "option_value": "Feb"
                },
                {
                    "id": "3",
                    "option_value": "Mar"
                },
                {
                    "id": "4",
                    "option_value": "Apr"
                },
                {
                    "id": "5",
                    "option_value": "May"
                },
                {
                    "id": "6",
                    "option_value": "Jun"
                },
                {
                    "id": "7",
                    "option_value": "Jul"
                },
                {
                    "id": "8",
                    "option_value": "Aug"
                },
                {
                    "id": "9",
                    "option_value": "Sep"
                },
                {
                    "id": "10",
                    "option_value": "Oct"
                },
                {
                    "id": "11",
                    "option_value": "Nov"
                },
                {
                    "id": "12",
                    "option_value": "Dec"
                },
            ],
            Years: [],
            year: "",
            month: ""
        }
    }
    componentDidMount() {
        this.generateArrayOfYears();
    }
    generateArrayOfYears = () => {
        var max = new Date().getFullYear()

        var years = []

        for (var i = max; i <= 2050; i++) {
            var obj = {
                id: i.toString()
            }
            years.push(obj)
        }
        this.setState({ Years: years })
    }
    modelClose = () => {
        this.setState({ isVisible: false })
    }
    PassValue = () => {
        console.log(this.state.month, this.state.year)
        this.setState({ isVisible: false })
    }
    render() {
        return (
            <View>
                <TouchableOpacity onPress={() => this.setState({ isVisible: true })}>
                    <Text>Select date</Text>
                </TouchableOpacity>
                {
                    <View>
                        <Modal isVisible={this.state.isVisible}>
                            <View style={styles.modal}>
                                <View style={{ backgroundColor: "#9572B4", padding: hp('2'), borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
                                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                        <Text style={{ textAlign: "center", fontSize: 15, color: "#fff", fontFamily: 'Poppins-SemiBold', marginLeft: wp('8') }}>Select Month & Year</Text>
                                        <Icon onPress={this.modelClose} type="FontAwesome" name="times-circle" style={{ color: '#fff', fontSize: 18, }} />
                                    </View>
                                </View>
                                <View style={{ alignItems: "center", justifyContent: "center", marginTop: hp('2') }}>
                                    <View style={styles.picker}>
                                        <Picker
                                            mode="dropdown"
                                            selectedValue={this.state.month}
                                            onValueChange={(itemValue, itemIndex) => { (this.setState({ month: itemValue })) }}
                                        >
                                            <Picker.Item label="Select Month" value="" />
                                            {
                                                this.state.Months.map((item, key) =>
                                                    <Picker.Item label={item.option_value} value={item.id} key={key} />
                                                )
                                            }
                                        </Picker>
                                    </View>
                                    <View style={styles.picker}>
                                        <Picker
                                            mode="dropdown"
                                            selectedValue={this.state.year}
                                            onValueChange={(itemValue, itemIndex) => { (this.setState({ year: itemValue })) }}
                                        >
                                            <Picker.Item label="Select Year" value="" />
                                            {
                                                this.state.Years.map((item, key) =>
                                                    <Picker.Item label={item.id} value={item.id} key={key} />
                                                )
                                            }
                                        </Picker>
                                    </View>
                                </View>
                                <TouchableWithoutFeedback onPress={this.PassValue}>
                                    <View style={{ marginTop: hp('2'), marginBottom: wp('5') }}>
                                        <View style={styles.buttonContainer}>
                                            <Text style={styles.submitText}>Submit</Text>
                                        </View>
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                        </Modal>
                    </View>
                }
            </View>
        );
    }
}
const styles = StyleSheet.create({
    modal: {
        backgroundColor: "#fff",
        borderRadius: 20,
    },
    picker: {
        borderWidth: 1.8,
        borderColor: "#717171",
        borderRadius: 28,
        width: wp('78'),
        margin: hp('1'),
        fontSize: 12,
        fontFamily: 'Poppins-SemiBold',
        color: '#717171',
        paddingLeft: wp('2.5')
    },
    buttonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#9572B4',
        width: wp('50'),
        padding: '3%',
        borderRadius: 15,
        alignSelf: "center"
    },
    submitText: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 14,
        color: '#fff'
    },
})