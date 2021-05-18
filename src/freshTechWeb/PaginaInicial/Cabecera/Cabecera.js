import React from 'react'
import logo from '../../../imagenes/logo.jpg'
import Popup from '../../PopUp/Popup.js'
import {Link} from  'react-router-dom'
import edit from '../../../imagenes/edit.png'
import { Redirect } from 'react-router';
import PasswordStrengthMeter from '../../SeguridadContrasenya/PasswordStrengthMeter';
import axios from 'axios';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import emailjs from 'emailjs-com';
import Email from '../../Email/Email.js'
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Menu from '@material-ui/core/Menu';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';

import 'materialize-css/dist/css/materialize.min.css'


const useStyles = makeStyles((theme) => ({
  root: {
    "& > svg": {
      margin: theme.spacing(2)
    }
  },

  menuButton: {
    marginRight: theme.spacing(2),
  }
}));

const validateCode = values =>{
  const errors = {}
  console.log(values.passwdCorrecta);
  if (!values.code || values.code != values.codigop2p){
    errors.code = 'Codigo incorrecto'
  }
  return errors
}


const validate = values =>{
  const errors = {}
  console.log("ERROR: ", values.registro);
  if (!values.usuario){
    errors.usuario = 'Ingrese un usuario válido'
  }
  if (!values.contrasenya){
    errors.contrasenya = 'Ingrese una contraseña válida'
  }

  if(!values.registro){
    errors.registro = 'Contraseña no es segura'
    
  }

  return errors

}
const validateLogin = values =>{
  const errors = {}
 
  if (!values.usuario){
    errors.usuario = 'Ingrese un usuario válido'
  }
  if (!values.contrasenya){
    errors.contrasenya = 'Ingrese una contraseña válida'
  }


  return errors

}

const contact = { emailDestination:'', code:''};

class Cabecera extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
          showPopup1:false,
          showPopup2:false,
          showPopup3:false,
          showPopup4:false,
          showPopup5:false,
          usuario:'',
          contrasenya:'',
          errors: {},
          errorsCode: {},
          redireccion:false,
          shown:false,
          login:true,
          signin:true,
          msg:'',
          token:'',
          email:'',
          code:'',
          codigop2p:'',
          registro:false,
          
         
          
        };
    }
    

    enviarMail(){

      console.log("SEND");
      var numberCode = Math.floor(Math.random() * (999999 - 100000 + 1) + 100000).toString();
      console.log(numberCode);
      contact.emailDestination=localStorage.getItem('correo');
      contact.code=numberCode;
      this.setState({codigop2p:numberCode});
      emailjs.send('service_7rxj0y9','template_a21tng6', contact, 'user_wAL9M7ycdftxE5fepZep7')
      .then((response) => {
             console.log('SUCCESS!', response.status, response.text);
             this.togglePopup2()
             this.togglePopup5()
      }, (err) => {
             console.log('FAILED...', err);
      });
    }

    validarPassword =(value) =>{
      let val1 = false,
          val2=false,
          val3=false;
      for(let i = 0; i < value.length; i++) {
        if(/[0-9]/.test(value.charAt(i))){
          val1=true;
        }
        if(/[a-zA-Z]/.test(value.charAt(i))){
          val2=true;
        }
        if((/[!@#$%*]/.test(value.charAt(i)))){
          val3=true;
        }
         
      }
      let result =  val1 && val2 && val3;
      this.setState({registro:result},()=>console.log("resultado: ",this.state.registro, " contra: ", value));
    }

    mensaje(){
      
      return <span style={{color: 'red'}}>Copiado</span>
      
    }

    togglePopup1() {
      this.setState({
        showPopup1: !this.state.showPopup1
      });
    }
    togglePopup2() {
      this.setState({
        showPopup2: !this.state.showPopup2,
        errors:{},
        login:true,
      });
    }
    togglePopup3() {
      this.setState({
        showPopup3: !this.state.showPopup3,
        contrasenya:"",
        errors:{},
        signin:true,
        
      });
    }
    togglePopup4() {
      this.setState({
        showPopup4: !this.state.showPopup4
      });
    
    }
    togglePopup5() {
      this.setState({
        showPopup5: !this.state.showPopup5
      });
    
    }
   
   iniciarSesion=async()=>{
      await axios.post('https://fresh-techh.herokuapp.com/login',{nombre:this.state.usuario,password:this.state.contrasenya})
      .then(response =>{
        console.log("RESPUESTA: ", response.data);
        if(response.data.codigo == 1){
          this.setState({login:true,msg:'',token:response.data.token},() => this.enviarMail());
          console.log(this.state.token);
          localStorage.setItem('token', this.state.token);
          localStorage.setItem('contrasenyaActual', this.state.contrasenya);
          localStorage.setItem('correo', this.state.usuario);
        }
      })
      .catch(error=>{
        console.log(error.response.data);
        if(error.response.data.codigo == 0){
          this.setState({login:false,msg:error.response.data.message,redireccion:false});
          
        }
      })
    }

    registrarse= async()=>{
      await axios.post('https://fresh-techh.herokuapp.com/signin',{nombre:this.state.usuario,password:this.state.contrasenya})
      .then(response =>{
        console.log(response.data);
        if(response.data.message == 1){
          this.setState({signin:true,msg:'',redireccion:true});
          console.log(this.state.signin);
          localStorage.setItem('correo', this.state.usuario);
        }
      })
      .catch(error=>{
        console.log(error.response.data);
        if(error.response.data.message == 0){
          this.setState({signin:false,redireccion:false});
          
        }
      })
    }

    setUsuario = (e) => {
      this.setState({usuario: e.target.value})
    }
    setContrasenya = (e) => {
      this.setState({contrasenya: e.target.value})
    }
    handleChange = ({target}) => {
      const{name,value} = target
      this.setState({[name]:value})
      this.setState({errors:{},login:true,errorsCode:{},signin:true});
    }
  
  
    handleChange2 = ({target}) => {
      const{name,value} = target
      this.setState({[name]:value})
      this.setState({errors:{},login:true,errorsCode:{},signin:true});
      this.validarPassword(value);
    }
    handleSubmit =e => {
      e.preventDefault()
      //Así separo errors del resto de estado
      const {errors, ...sinErrors} = this.state
      
      const result = validateLogin(sinErrors)
      
      this.setState({errors:result})
      if(!Object.keys(result).length){ //Si tiene propiedades, hay error
        //Envio formulario
        this.iniciarSesion(); 
        console.log('Formulario válido')
        //this.postData()
        
      }else{
        this.setState({redireccion:false});
        console.log('Formulario inválido')
      }

    }
  
    handleSubmitRegistro =e => {
      e.preventDefault()
      //Así separo errors del resto de estado
      const {errors, ...sinErrors} = this.state
      
      console.log(this.state.registro);
      const result = validate(sinErrors)
      
      this.setState({errors:result})
      if(!Object.keys(result).length){ //Si tiene propiedades, hay error
        //Envio formulario
        this.registrarse();
        console.log('Formulario válido')
        //this.postData()
      
        
      }else{
        this.setState({redireccion:false});
        console.log('Formulario inválido')
      }

    }
    handleSubmitCode =e => {
      e.preventDefault()
      const {errorsCode, ...sinErrors} = this.state
      const result = validateCode(sinErrors);
      this.setState({errorsCode:result})
      if(!Object.keys(result).length){ //Si tiene propiedades, hay error
        //Envio formulario
        this.setState({redireccion:true})
        console.log('Formulario válido')
      }else{
        console.log('Formulario inválido')
      }
    }

    msgError=e=>{
      var errorMsg = "";
      if(this.state.msg == "User does not exist"){
        errorMsg = "No existe el usuario";
      }
      else{
        errorMsg = "Contraseña incorrecta";
      }

      return <p className="warning">{errorMsg}</p>
    }

    
  
    render () {
    
        const {errors,errorsCode}=this.state
        return (
          <>
          <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"></link>
          
          <div>
            <Toolbar className="Toolbar">

              <Link to="/"><img className="logoEmpresa" src={logo} alt="Logo"/></Link>
              <Link to="/contacto"><Button onClick={this.togglePopup1.bind(this)}>Contacto</Button></Link>
              <Button onClick={this.togglePopup2.bind(this)}>Login</Button>
              <Button onClick={this.togglePopup3.bind(this)}>Sign-In</Button>
            
            </Toolbar>
          </div>


            {this.state.showPopup1 ? 
              <Popup
                text='Contacta con nosotros!'
                cuerpo={
                  <>
         
                    <pre><div className="emailBlock">
                     
                      <button className="btn-floating blue" onClick={this.togglePopup4.bind(this)}>
                        <i class="material-icons circle">mail</i>
                      </button>
                      <label>  </label>
                      <p className="email">freshtech@gmail.com</p>
                    <br></br>
                   
                   </div></pre>
                    <br></br><br></br>
                    <input type='button' className="btn waves-effect waves-light" value='Cerrar' onClick={this.togglePopup1.bind(this)}/>
                  </>
                }
                
                eliminada={false}
             />
            : null
            }
            {this.state.showPopup2 ? 
              <Popup
                text='Iniciar sesión'
                cuerpo = {
                  <form onSubmit={this.handleSubmit}>
                    <div className="formularioLogin">
                    
                      <div className="input-field">
                        <i className="material-icons prefix">account_circle</i>
                        <input type="text" name="usuario"id="usuario" onChange={this.handleChange} placeholder={"Usuario"}/>
                        {errors.usuario && <p className="warning">{errors.usuario}</p>}
                      </div>
                      
                      <br/>
                      <div className="input-field">
                        <i class="material-icons prefix">lock_open</i>
                        <input type='password' name = "contrasenya"id="contrasenya"onChange={this.handleChange} placeholder={"Contraseña"}/>
                        {errors.contrasenya && <p className="warning">{errors.contrasenya}</p>}
                        {!this.state.login && this.msgError()}
                      </div>
                   
                   
                      <br/>
                      <br></br> <br></br>  <br></br>
                      
                        <input class="btn waves-effect botonesLogin1 waves-light" type='submit'  value='Enviar'/>
                        <input class="btn waves-effect botonesLogin2 waves-light" type='button'  value='Cerrar' onClick={this.togglePopup2.bind(this)}/>
                      
                    
                  
                    </div>
                    </form>
                }
                
                eliminada={false}
             />
            : null
            }
            {this.state.showPopup3 ? 
              <Popup
                text='Registrarse'
                cuerpo = {
                  <pre>
                  <form onSubmit={this.handleSubmitRegistro}>
                  <div className="formularioLogin">

                  <div className="input-field">
                        <i className="material-icons prefix">account_circle</i>
                        <input type="email" name="usuario"id="usuario" onChange={this.handleChange} placeholder={"Usuario"}/>
                        {errors.usuario && <p className="warning">{errors.usuario}</p>}
                  </div>
                  <br/>
                  <div className="input-field">
                        <i class="material-icons prefix">lock_open</i>
                        <input type="password" name = "contrasenya"id="contrasenya"onChange={this.handleChange2} value={this.state.contrasenya} placeholder={"Contraseña"}/>
                        <br></br><br></br>
                        <PasswordStrengthMeter password = { this.state.contrasenya}/>
                        {errors.contrasenya && <p className="warning">{errors.contrasenya}</p>}
                        {!this.state.signin && <p className="warning">"El usuario ya existe"</p>}
                        {errors.registro && <p className="warning">{errors.registro}</p>}
                  </div>



                    <input type='submit' className="btn waves-effect botonesLogin1 waves-light" value='Enviar'/>
                    <input type='button' className="btn waves-effect botonesLogin2 waves-light" value='Cerrar' onClick={this.togglePopup3.bind(this)}/>
                    {this.state.redireccion && 
                    <>
                      {localStorage.removeItem('categoria')}
                      {localStorage.removeItem('ordenarPor')}
                      {localStorage.removeItem('ordenarDe')}
                      <Redirect to="/paginaSecundaria"/>
                    </>
                    }
                
                  </div>
                  </form>
                  </pre>
                }
               
                eliminada={false}
             />
            : null
            }

            {this.state.showPopup4 ? 
              <Popup
                text='Contacta con nosotros'
                cuerpo = {
                  <>
                    <Email tipo={false} close={this.togglePopup4.bind(this)}/>
                  </>

                }
              />
            :null
            }

            {this.state.showPopup5 ?
             <Popup
             text='Introduce el codigo que te hemos enviado'
             cuerpo = {
               <>
                <form onSubmit={this.handleSubmitCode}>
                <div className="formularioCode">
                  <div className="input-field">
                    <i className="material-icons prefix circle">password</i>
                    <input ref={this.inputContra2Val} type='password' name = "code"id="code"onChange={this.handleChange} placeholder="Introduce el codigo que te hemos enviado"/>
                    {errorsCode.code && <p className="warning">{errorsCode.code}</p>}
                  
                  </div>
                  {this.state.redireccion && 
                      <>
                        {localStorage.removeItem('categoria')}
                        {localStorage.removeItem('ordenarPor')}
                        {localStorage.removeItem('ordenarDe')}
                        <Redirect to="/paginaSecundaria"/>
                      </>
                  }
                  <br></br> <br></br>  <br></br>
                  <input class="btn waves-effect waves-light mr-5" type='submit'  value='Enviar'/>
                  <input class="btn waves-effect waves-light" type='button'  value='Cancelar' onClick={this.togglePopup5.bind(this)}/>
                  </div>
                  </form>
               </>

             }
           />
          
            :null

            }


            </>
          )
    }

}

export default Cabecera




