import React from 'react';
import './App.css';
import Form from './app_components/form.component';
import Weather from './app_components/weather.component';
import "bootstrap/dist/css/bootstrap.min.css";
import "weather-icons/css/weather-icons.css";

//openweathermap.org apikey
 const api_key="12fedfd654ba4fb6479923bec83a0907";
 class App extends React.Component{
   constructor(){
     super();
     this.state={
       city:undefined,
       country:undefined,
       icon:undefined,
       celcius:undefined,
       temp_min:null,
       temp_max:null,
       description:'',
       error:false

     };

     //weather icons based on weather
     this.weathericon={
       Thunderstorm:"wi-thunderstorm",
       Drizzle:"wi-sleet",
       Rain:"wi-storm-showers",
       Snow:"wi-snow",
       Atmosphere:"wi-fog",
       Clear:"wi-day-sunny",
       Clouds:"wi-day-fog"
     };
   }

   //specify icon based on weather
   getWeatherIcon(icons,weatherIDRange){
     switch(true){
       case weatherIDRange>=200 && weatherIDRange<232:
         this.setState({icon:icons.Thunderstorm});
         break;
       case weatherIDRange>=300 && weatherIDRange<=321:
         this.setState({icon:icons.Drizzle});
         break;
       case weatherIDRange>=500 && weatherIDRange<=521:
         this.setState({icon:icons.Rain});
         break;
       case weatherIDRange>=600 && weatherIDRange<=622:
         this.setState({icon:icons.Snow});
         break;
       case weatherIDRange>=701 && weatherIDRange<=781:
         this.setState({icon:icons.Atmosphere});
         break;
       case weatherIDRange===800:
         this.setState({icon:icons.Clear});
         break;
       case weatherIDRange>=801 && weatherIDRange<=804:
         this.setState({icon:icons.Clouds});
         break;
       default:
        this.setState({icon:icons.Clouds});
     }
   }

   //convert to celcius
   convertToCelcius(temp){
     let celcius=Math.floor(temp-273.15);
     return celcius;
   }

   //event handler for onSubmit button in form component
   getWeather = async e =>{
     e.preventDefault();
    
      //get city and country name from input fields
      const country=e.target.elements.country.value;
      const city=e.target.elements.city.value;
      
     if(country && city){
       try{
       const result=await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city},q=${country}&appid=${api_key}`);
        
       const response=await result.json();

       //get values from api specify to state 
       this.setState({
         city:`${response.name},${response.sys.country}`,
         country:response.sys.country,
         main:response.weather[0].main,
         celcius:this.convertToCelcius(response.main.temp),
         temp_min:this.convertToCelcius(response.main.temp_min),
         temp_max:this.convertToCelcius(response.main.temp_max),
         description:response.weather[0].description,
         error:false
       });

       //set icons
       this.getWeatherIcon(this.weathericon,response.weather[0].id);
      // console.log(this.state.icon);
       console.log(response);
      }catch(error){
        alert('City you are searching is not found!');
      }
     }else{
       this.setState({error:true});
     }

   };

   render(){
     return(
       <div className="App">
         <Form loadweather={this.getWeather} error={this.state.error}/>
         <Weather
         cityname={this.state.city}
         weatherIcon={this.state.icon}
         temp_celcius={this.state.celcius}
         temp_min={this.state.temp_min}
         temp_max={this.state.temp_max}
         description={this.state.description}
         />                                                          
       </div>
     ); 
   }

 }

export default App;