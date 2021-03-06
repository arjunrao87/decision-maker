import React from 'react';
import {
  Platform,
  PropTypes,
  ScrollView,
  StyleSheet,
  Text,
  Linking,
  TouchableHighlight,
  TouchableOpacity,
  Slider,
  View,
  TextInput,
  Button,
} from 'react-native'
import Modal from 'react-native-modalbox';
import {baseURL} from '../App';
import {font} from '../App';
import {sendGoogleAnalytics} from '../App'

var fontSize = (Platform.OS === 'ios') ? 20 : 14;
//7/30/2017
const appVersion = "2.1.1"

export default class Menu extends React.Component {

  constructor( props ){
    super( props );
    this.state = {
      distance:100,
      price:2,
      priceRating:'$$',
      isOpen: false,
      isDisabled: false,
      swipeToClose: true,
      sliderValue: 0.3,
      text:'',
      appVersion:appVersion
    };
  }

  componentWillMount(){
    sendGoogleAnalytics( "Menu" );
  }

  render() {
    return (
      <View style={{flex:1}}>
        <View style={{flex:4, backgroundColor:'ivory', padding:20, paddingTop:50}}>
          <View style={styles.distance} >
            <Text style={styles.menuText}>Distance - {this.state.distance} m</Text>
              <Slider
               value= {100}
               maximumValue={750}
               minimumValue={0}
               onSlidingComplete={(value) => {
                 this.setState({distance:parseInt(value)})
                 this.props.passMenuOptions({price:this.state.price,distance:parseInt(value)});
                  }}/>
          </View>
          <View style={styles.distance} >
            <Text style={styles.menuText}>Price  - {this.state.priceRating} </Text>
              <Slider
               value={this.state.price}
               maximumValue={4}
               minimumValue={1}
               step={1}
               onSlidingComplete={(value) => {
                 this.setState({price:parseInt(value)})
                 if( value == 1 ){
                   this.setState( {priceRating:'$'});
                 } else if ( value == 2 ){
                   this.setState( {priceRating:'$$'});
                 } else if ( value == 3 ){
                   this.setState( {priceRating:'$$$'});
                 } else if ( value == 4 ){
                   this.setState( {priceRating:'$$$$'});
                 }
                 this.props.passMenuOptions({price:value,distance:this.state.distance});
                }
              }/>
          </View>
          <TouchableHighlight underlayColor='lightcyan' style={{flex:1}} onPress={() => this.refs.feedbackModal.open()}  >
            <Text style={styles.rating}>Rate Us</Text>
          </TouchableHighlight>
          <TouchableHighlight underlayColor='lightcyan' style={{flex:1}} onPress={() => this.refs.aboutModal.open()} >
            <Text style={styles.about}>About Us</Text>
          </TouchableHighlight>
          <View>
            <Text style={styles.versionText}>Version {this.state.appVersion}</Text>
          </View>
        </View>
        <View style={{flex:1, backgroundColor:'ivory'}}>
        </View>
        <Modal style={[styles.feedbackModal]} onClosed={()=>this.setState({text:''})} position={"center"} ref={"feedbackModal"} isDisabled={this.state.isDisabled}>
          <TextInput
           ref= {(el) => { this.username = el; }}
           style={styles.feedbackText}
           onChangeText={(text) => this.setState({text})}
           value={this.state.text}
           multiline={true}
           />
         <Button title="Send" onPress={() => this.makePostRequest(baseURL+'feedback',this.state.text)} style={styles.btn}></Button>
        </Modal>
        <Modal style={[styles.aboutUsModal]} position={"center"} ref={"aboutModal"} isDisabled={this.state.isDisabled}>
         <ScrollView>
           <Text style={styles.aboutUsText}>Tired by countless recommendations and filters to choose from, this app was built by Arjun Rao. The goal was to prevent the app-equivalent of 'deer caught in headlights' </Text>
         </ScrollView>
         <Button title="Visit Developer Site" style={{ paddingTop:30 }} onPress={() => {this.openHomePage()}} style={styles.btn}></Button>
        </Modal>
      </View>
    )
  }
  openHomePage(){
    Linking.openURL("http://www.arjunrao.co");
  }

  makePostRequest(url,text){
    console.log( "Making request to " + url );
    fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text:text
      })
    });
    this.refs.feedbackModal.close()
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 40,
  },
  aboutUsModal:{
    height: 300,
    width: 250,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#d6d7da',
    backgroundColor:'cornsilk'
  },
  feedbackModal:{
    height: 300,
    width: 250,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#d6d7da',
    backgroundColor:'cornsilk'
  },
  aboutUsText :{
    fontSize: fontSize,
    textAlign: 'center',
    fontFamily: font,
    padding:15,
    marginTop: 10,
    paddingBottom:30
  },
  versionText :{
    fontSize: fontSize/2,
    textAlign: 'center',
    fontFamily: font,
    padding:15,
    marginTop: 10,
    paddingBottom:30,
  },
  feedbackText :{
    height: 250,
    borderColor: 'gray',
    borderWidth: 10,
    fontSize: fontSize,
    padding:15,
    fontFamily: font,
  },
  menuText:{
    paddingTop:20,
    fontSize: 18,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    fontFamily:font
  },
  rating:{
    paddingTop: 40,
    fontSize: 18,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    fontFamily:font
  },
  about:{
    paddingTop: 40,
    fontSize: 18,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    fontFamily:font
  },
  btn:{
    paddingTop:40
  },
  distance: {
    flex: 1,
    marginLeft: 10,
    marginRight: 40,
    paddingBottom:50,
    alignItems: 'stretch',
    justifyContent: 'center',
  },
})
