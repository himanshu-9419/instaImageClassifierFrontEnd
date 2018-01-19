import React, { Component } from 'react';
import logo from './logo.svg';
import axios from 'axios';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state={
      login:false,
      userName:'',
      tokenCode:'',
      images:[]
    };
    this.login = this.login.bind(this);
    //this.updateState=this.updateState.bind(this);
  }
  
  componentDidUpdate= function(){
    debugger;
    if( window.location.href.split('?')[1] && window.location.href.split('?')[1].split('=')[1]) {
      if(this.state.tokenCode===window.location.href.split('?')[1].split('=')[1]) return;
      this.setState({
        login:true,
        tokenCode:window.location.href.split('?')[1].split('=')[1]
      });
      let images=[];
      var self=this;
      axios.get('https://api.instagram.com/v1/users/self/media/recent/?access_token='+window.location.href.split('?')[1].split('=')[1]).then(res=>{
       for(let i=0;i<res.data.data.length; i++){
         images[i]={};
          axios.get('https://instaimgclas-himanshu9419.c9users.io/predict/?image='+res.data.data[i].images.standard_resolution.url).then(res1=>{
         images[i].tag=res1.data.messages[0].text;
         if(i===res.data.data.length-1){self.updateState(images);}
         });
         images[i].url=res.data.data[i].images.standard_resolution.url;
        }
        //this.setState({images:images});
      });
    }
   
  }
  login = function(){
    const redirectURL='https://www.instagram.com/oauth/authorize/?client_id=37a34b51ffc0436e801f68b4dd5d5aaa&redirect_uri=https://instaimgclas-himanshu9419.c9users.io/login/&response_type=code&scope=public_content';
    window.location = redirectURL;
    this.setState({
      login:true,
      userName:''
    });
  }
  
  selectTag=function(tag){
    this.setState({selectedTag:tag});
  }
  
  updateState = function(images){
    this.setState({images:images})
  }
  
  render() {
    const imageStyle = {
        height:'100px',
        width:'auto',
        maxWidth:'200px'
    };
    const scrollDivStyle={
      overflowX: 'scroll',
      display: 'inline-block',
      whiteSpace: 'nowrap',
      width: '100%'
    }
    let login=false;
     if( window.location.href.split('?')[1] && window.location.href.split('?')[1].split('=')[1]) {
      login=true;
     if(this.state.login!==true) this.setState({login:true});
     }
     let img=this.state.images;
     let tagImgMap=[];
     let tags=[];
     img.forEach(elem=> {
       let tag=elem.tag.split(':')[1].split(',');
       for(let i=0;i<tag.length;i++){
         let req=""; req=tags.indexOf(tag[i])
         if(req !=-1) {tagImgMap[req].image.push(elem.url)}
         else{tags.push(tag[i]); tagImgMap.push({tag:tag[i],image:[elem.url]});}
       }
     });
     console.log(tagImgMap);
     //this.setState({selectedTag:tagImgMap[0]});
     let selectedTag=(this.state.selectedTag)?this.state.selectedTag:'';
     let selectedImages=(tagImgMap.filter(x=>x.tag==selectedTag).length>0)?tagImgMap.filter(x=>x.tag==selectedTag)[0].image:[];
     let selectedDivStyle={backgroundColor:'green'};
    var tagsButton=tagImgMap.map(x=> {
        return (<button onClick={this.selectTag.bind(this,x.tag)} style={selectedTag===x.tag?selectedDivStyle:{}} key={x.tag}>{x.tag}</button>)
    });
      var tagImage=selectedImages.map(x=>(<img style={imageStyle} src={x} alt={x}  key={x}/>))
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        {login || <button onClick={this.login}>Login</button>}
        <div style={scrollDivStyle}>{tagsButton}</div>
        <div>{tagImage}</div>
      </div>
    );
  }
}

export default App;
