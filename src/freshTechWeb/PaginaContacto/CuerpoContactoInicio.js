import React from 'react'
import Email from '../Email/Email.js'
import EmailIcon from '@material-ui/icons/Email';
class CuerpoContactoInicio extends React.Component {

    constructor(props){
      super(props)
      this.state={
    
        
      };
     
    }
    
    render () {
     
      return (
        <>
        <br></br><br></br>
          <div className="contactoTitle">
            <h3 className="title1">Contacte con nosotros</h3>
            <h5 className="title2"> <EmailIcon fontSize="large" color="primary"/>  freshtechverify@gmail.com</h5>
          </div>
          <Email tipo={true}/>
        </>
      )
    }
  }
  
  export default CuerpoContactoInicio
  