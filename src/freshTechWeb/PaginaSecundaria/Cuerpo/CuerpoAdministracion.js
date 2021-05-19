import { HourglassFullSharp } from '@material-ui/icons'
import Popup from '../../PopUp/Popup.js'
import React from 'react'
import add from '../../../imagenes/add_icon.png'
import passw from '../../../imagenes/password.png'
import removeuser from '../../../imagenes/remove-user.png'
import logout from '../../../imagenes/logout.png'
import okey from '../../../imagenes/okey.png'
import { Redirect } from 'react-router';
import axios from 'axios';
import PasswordStrengthMeter from '../../SeguridadContrasenya/PasswordStrengthMeter';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import emailjs from 'emailjs-com';
import 'materialize-css/dist/css/materialize.min.css'

const validate = values =>{
  const errors = {}
  console.log(values.passwdCorrecta);
  if (!values.code || values.code != values.codigop2p){
    errors.code = 'Codigo incorrecto'
  }
 

  return errors

}


const validateContra = values =>{
  const errorsC = {}
  if (!values.contrasenya){
    errorsC.contrasenya = 'Ingrese una contraseña válida'
    console.log("1");
  }
  if (!values.contrasenya_verif){
    console.log("2");
    errorsC.contrasenya_verif = 'Ingrese una contraseña'
  }
  if(values.contrasenya_verif != values.contrasenya ){
    errorsC.coinciden = 'Contraseñas no coinciden'
  
  }
  if(!values.registro){
    errorsC.registro = 'Contraseña no es segura'
  }
  
  return errorsC
}

const contact = { emailDestination:'', code:''};

class CuerpoAdministracion extends React.Component {

  constructor(props){
    super(props)
    this.state={
      showPopup1:false,
      showPopup2:false,
      showPopup3:false,
      okey:false,
      contrasenya:'',
      contrasenya_verif:'',
      errors: {},
      errorsC:{},
      code:'',
      coinciden:'',
      confirmado:false,
      eliminada:false,
      redireccion:false,
      ambasOpciones:false,
      avanzado:false,
      password:'',
      copied1:false,
      copied2:false,
      contrasenya_avanzado:'',
      longitud:'8',
      tipo:'',
      passwdCorrecta:false,
      codigop2p:'',
      send:true,
      registro:false,
      
    };
    this.inputContraVal = React.createRef();
    this.inputContra2Val = React.createRef();
    this.inputContra3Val = React.createRef();
   
  }
  generarContrasenyaDebil =e =>{
    this.setState({tipo:"debil"});

  }
  generarContrasenyaMedia =e =>{
    this.setState({tipo:"media"});

  }
  generarContrasenyaFuerte =e =>{
    this.setState({tipo:"fuerte"});

  }
  comprobarPasswd = (e) => {
   
    if ((this.state.password == '' && this.state.contrasenya_avanzado == '') || (this.state.password != '' && this.state.contrasenya_avanzado != '')){
      this.setState({ambasOpciones:true});
      console.log("REF1");
    }else{
     
      if (this.state.password != ''){
        console.log("REF2");
        this.setState({contrasenya:this.state.password,contrasenya_verif:this.state.password});
      }else{
        console.log("REF3: ",this.state.contrasenya_avanzado);
        this.setState({contrasenya:this.state.contrasenya_avanzado,contrasenya_verif:this.state.contrasenya_avanzado,errors:{},errorsC:{}});
      }
      this.setState({ambasOpciones:false,avanzado:true, showPopup4: !this.state.showPopup4,
        password:'',
        copied1:false,
        copied2:false,
        contrasenya_avanzado:'',
        longitud:'8',
        tipo:'',});
     
    }
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
  this.setState({registro:result});
  }

  buildPassword = () => {
    let a = "",
        d = "",
        b = "1234567890abcdefghijklmnopqrstuvwxyz!@#$%*",
        c = this.state.longitud,
        valida = false;


    if(this.state.tipo != ''){
      while(!valida){
        for(let ma = 0; ma < c; ma++) {
          let n = 0;
          if (this.state.tipo == "debil"){
            n = Math.floor(Math.random() * 10);
          }else if (this.state.tipo == "media"){
            n = Math.floor(Math.random() * b.length-6);
          }else{
            n = Math.floor(Math.random() * b.length);
          }
          d = b.charAt(n);
          a = a + d;
        }
        if(this.state.tipo == "media" || this.state.tipo == "fuerte"){
          valida=this.validarPassword(a);
          if (!valida){
            a="";
          }
          
        }else{
          valida = true;
        }
      }
      this.setState({contrasenya_avanzado:a});
    }
  }

  setLongitud = ({ value }) => {
    this.setState({longitud:value}, () => { this.buildPassword();});
   
  }
  mensaje(){
    
    return <span style={{color: 'red'}}>Copiado</span>
    
  }
  eliminarCuenta=async(value)=>{
  
    await axios.delete('https://fresh-techh.herokuapp.com/removeAccount',
    
      {headers: {'Authorization':`Bearer ${value}`}},
    )
    .then(response =>{
      console.log(response.data);
      
    })
    .catch(error=>{
      console.log(error.response.data);
     
    })
  }
  actualizarContrasenya=async(value)=>{
    console.log("ENTRAAA");
    const datos = {password:this.state.contrasenya};
    const headers = {'Authorization':`Bearer ${value}`};
    await axios.post('https://fresh-techh.herokuapp.com/changepw',datos,{headers}
    )
    .then(response =>{
      console.log(response.data);
      localStorage.setItem('contrasenyaActual', this.state.contrasenya);
    })
    
  
  }
  togglePopup1() {
    this.setState({
      showPopup1: !this.state.showPopup1,
      confirmado:false,
      avanzado:false,
      password:'',
      copied1:false,
      copied2:false,
      contrasenya_avanzado:'',
      longitud:'8',
      tipo:'',
      contrasenya:'',
      okey:false,
      send:!this.state.send,
      errors:{},
      
    });
    if(this.state.send){
      this.enviarMail();
    }
    console.log("Avanzado: ", this.state.avanzado);
    
  }
  togglePopup2() {
    this.setState({
      showPopup2: !this.state.showPopup2,
      confirmado:false,
      okey:false,
      send:!this.state.send,
      avanzado:false,
    });
    if(this.state.send){
      this.enviarMail();
    }
  }
  togglePopup3() {
    this.setState({
      showPopup3: !this.state.showPopup3,
      confirmado:false,
     
    });
  }
  togglePopup4() {
    this.setState({
      showPopup4: !this.state.showPopup4,
      ambasOpciones:false,
      avanzado:false,
      password:'',
      copied1:false,
      copied2:false,
      contrasenya_avanzado:'',
      longitud:'8',
      tipo:'',
      errors:{},
      errorsC:{},
    });
  }
  setContrasenya = (e) => {
    this.setState({contrasenya: e.target.value})
  }

  handleChange = ({target}) => {
    const{name,value} = target
    this.setState({[name]:value})
    this.setState({avanzado:false});
    console.log("esto: ",name, " .. ", value);
  }
  handleChange2 = ({target}) => {
    const{name,value} = target
    this.setState({[name]:value})
    this.setState({avanzado:false,errorsC:{}});
    this.validarPassword(value);
  }

  handleSubmitCode =e => {
    e.preventDefault()
    //Así separo errors del resto de estado
    const {errors, ...sinErrors} = this.state
    const result = validate(sinErrors);
    
    
    this.setState({errors:result})
  
    if(!Object.keys(result).length){ //Si tiene propiedades, hay error
      //Envio formulario
      //this.inputContraVal.current.value = "";
      this.inputContra2Val.current.value="";
      //console.log("Valiendo: ", this.inputContraVal.current.value);
      this.setState({confirmado:true,avanzado:false,contrasenya:''})
      console.log('Formulario válido')
    }else{

      console.log('Formulario inválido')
    }

  }
  handleSubmitCode2 =e => {
    e.preventDefault()
    //Así separo errors del resto de estado
    const {errors, ...sinErrors} = this.state
    const result = validate(sinErrors);
    
    
    this.setState({errors:result})
  
    if(!Object.keys(result).length){ //Si tiene propiedades, hay error
      //Envio formulario

      this.setState({confirmado:true,avanzado:false,contrasenya:''})
      console.log('Formulario válido')
    }else{

      console.log('Formulario inválido')
    }

  }
  handleSubmitContra =e => {
    e.preventDefault()
    //Así separo errors del resto de estado
    const {errorsC, ...sinErrors} = this.state
    const result = validateContra(sinErrors)
    
    console.log(result)
    this.setState({errorsC:result})
  
    if(!Object.keys(result).length){ //Si tiene propiedades, hay error
      //Envio formulario
      const userToken = localStorage.getItem('token');
      this.setState({okey:true})
      this.actualizarContrasenya(userToken);
      console.log('Formulario válido')
    }else{
      
      console.log('Formulario inválido')
    }

  }
  
  handleSubmitEliminar =e => {
    const userToken = localStorage.getItem('token');
    this.eliminarCuenta(userToken)
    console.log("TOKEN: ",userToken);
    e.preventDefault();
    console.log();
    this.setState({eliminada:true})

  }
  handleSubmitCerrarSesion =e => {
    e.preventDefault()
    this.setState({redireccion:true})

  }
  handleSubmitFin=e => {
    e.preventDefault()
    this.setState({redireccion:true})
  }
  verificarPasswd=e=>{

    const actualPasswd = localStorage.getItem('contrasenyaActual');
    console.log("Actual: ", actualPasswd, " metida: ", e.target.value);
    
    if (e.target.value == actualPasswd){
      console.log("iguales");
      this.setState({passwdCorrecta:true});
    
    }else{
      console.log("diferentes");
      this.setState({passwdCorrecta:false});
    }
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
		}, (err) => {
				   console.log('FAILED...', err);
		});
  }


  render () {
    const {errors,errorsC,copied2,contrasenya_avanzado,avanzado}=this.state
    return (
      
      <>
       <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"></link>
      <div className="admin">
        <pre><div className="par1">
          <button className="check1"onClick={this.togglePopup1.bind(this)}><img className="add" src={passw} alt="add" onClick={this.pulsa}/></button>
          <p className="elimact">  Actualizar la contraseña</p>
        </div></pre>
        <br></br>
        <pre><div className="par2">
          <button className="check2"onClick={this.togglePopup2.bind(this)}><img className="add" src={removeuser} alt="add" /></button>
          <p className="elimact">  Eliminar cuenta</p>
        </div></pre>
        <br></br>
        <pre><div className="par3">
          <button className="check3"onClick={this.togglePopup3.bind(this)}><img className="add" src={logout} alt="add" /></button>
          <p className="elimact">  Cerrar Sesion</p>
        </div></pre>
      </div>

      {this.state.showPopup1 ? 
      
        <Popup
          text={

            <>

            {!this.state.okey ?
              'Actualizar contraseña'
              :
              'Contraseña cambiada con exito'
            }
            </>
            

          }
          cuerpo = {

              <div className="formularioCambio">
              {this.state.okey ?
              <>
              <img className="okey" src={okey} alt="okey" />
              <br></br><br></br><br></br>
              <input type='button' className="btn waves-effect waves-light"value='Cerrar' onClick={this.togglePopup1.bind(this)}/>
              </>

              :
              <>
                {!this.state.confirmado ?
                <>
                  <form className="formularioCode" onSubmit={this.handleSubmitCode}>
                     
                       <br></br>
                      <div className="input-field">
                        <i className="material-icons prefix circle">password</i>
                        <input ref={this.inputContra2Val} type='password' name = "code"id="code"onChange={this.handleChange} placeholder="Introduce el codigo que te hemos enviado"/>
                        
                      </div>
                      {errors.code && <p className="warning">{errors.code}</p>}
                      
                      <br></br><br></br>
                      <input type='submit' className="btn waves-effect waves-light" value='Enviar'/>
                      <input type='button' className="btn waves-effect waves-light ml-5" value='Cerrar' onClick={this.togglePopup1.bind(this)}/>
                  </form>
                </>
                :
                <>
                
                  <form className="formularioLogin"onSubmit={this.handleSubmitContra}>
 

                      <div className="input-field">
                        
                        <i className="material-icons prefix">lock</i>
                        <input type='password' name = "contrasenya"id="contrasenya"onChange={this.handleChange2} value={this.state.contrasenya} placeholder="Nueva contraseña"/>
                      
                        <button className="btn-floating blue prefix" onClick={this.togglePopup4.bind(this)}>
                          <i className="material-icons circle">edit</i>
                        </button>
                        
                        <PasswordStrengthMeter password = {this.state.contrasenya}/>
                        {errorsC.contrasenya && <p className="warning">{errorsC.contrasenya}</p>}
                      </div>

            
                                  
                
                      <div className="input-field">
                        <i className="material-icons prefix">lock</i>
                        <input ref={this.inputContra3Val}type='password' name = "contrasenya_verif"id="contrasenya_verif"onChange={this.handleChange} value={avanzado ? this.state.contrasenya:undefined}  placeholder="Repita la contraseña"/>
                        {errorsC.registro && <p className="warning">{errorsC.registro}</p>}
                        {errorsC.contrasenya_verif && <p className="warning">{errorsC.contrasenya_verif}</p>}
                        {errorsC.coinciden && <p className="warning">{errorsC.coinciden}</p>}
                      </div>



  



                    <input type='submit' className="btn waves-effect waves-light mr-5" value='Confirmar'/>
                    <input type='button' className="btn waves-effect waves-light" value='Cancelar' onClick={this.togglePopup1.bind(this)}/>
                    
                    </form>
                </>
                }
              </>  
              }
              </div>
            
          }
          closePopup={this.togglePopup1.bind(this)}
          eliminada={false}
        />
        : null
      }
      {this.state.showPopup2 ? 
        <Popup
        
          text={
            <>
            {!this.state.confirmado ?
              'Eliminar cuenta'
              :
              <>
              {this.state.eliminada ?
                'Cuenta eliminada con exito'
                
                :
                '¿Esta seguro?'
              }
              </>
            }
           
            </>
          }

          cuerpo = {

              <div className="formularioElimino">

                {!this.state.eliminada ?
                <>
                 {!this.state.confirmado ?
                  <form className="formularioCode" onSubmit={this.handleSubmitCode2}>

                      <div className="input-field">
                        <i className="material-icons prefix circle">password</i>
                        <input type='password' name = "code"id="code"onChange={this.handleChange} placeholder="Introduce el codigo que te hemos enviado"/>
                        
                      </div>
                      {errors.code && <p className="warning">{errors.code}</p>}
                   
                      <input type='submit' className="btn waves-effect waves-light mr-5" value='Enviar'/>
                      <input type='button' className="btn waves-effect waves-light" value='Cerrar' onClick={this.togglePopup2.bind(this)}/>
                  </form>
                  :
                    <form onSubmit={this.handleSubmitEliminar}>
                    <input type='submit' className="btn waves-effect waves-light mr-5" value='Confirmar'/>
                    <button className="btn waves-effect waves-light"onClick={this.togglePopup2.bind(this)}>Cancelar</button>
                </form>

                 }
                </>
                  :
                <>
                <img className="okey" src={okey} alt="okey" />
                <form onSubmit={this.handleSubmitFin}>
                  <input type='submit' className="btn waves-effect waves-light" value='Salir'/>
                  {this.state.redireccion && 
                  <>
                    {localStorage.removeItem('categoria')}
                    {localStorage.removeItem('ordenarPor')}
                    {localStorage.removeItem('ordenarDe')}
                    {localStorage.removeItem('token')}
                    {localStorage.removeItem('ordenarPorI')}
                    {localStorage.removeItem('ordenarDeI')}
                    <Redirect to="/"/>
                  </>
                  }
                  </form>
                </>
                } 



              </div>
          }
         
         
        />
        : null
      }
      
      {this.state.showPopup3 ? 
        <Popup
            
          text= '¿Seguro?'
          
          cuerpo = {
            
            <div className="formularioCierroSesion">
              <form onSubmit={this.handleSubmitCerrarSesion}>
                <br></br><br></br><br></br>
                <input type='submit' className="btn waves-effect waves-light mr-5" value='Confirmar'/>
                <button className="btn waves-effect waves-light" onClick={this.togglePopup3.bind(this)}>Cancelar</button>
                {this.state.redireccion && 
                <>
                  {localStorage.removeItem('categoria')}
                  {localStorage.removeItem('ordenarPor')}
                  {localStorage.removeItem('ordenarDe')}
                  {localStorage.removeItem('token')}
                  {localStorage.removeItem('ordenarPorI')}
                  {localStorage.removeItem('ordenarDeI')}
                  <Redirect to="/"/>
                </>
                }
              </form>
            </div>
          }
        />
        : null
      }
      {this.state.showPopup4 ? 
              <Popup
                text='Contraseña'
                cuerpo = {
                  <>

                  <div className="meter1">
                    {/*<strong>Escribe una contraseña</strong>
                    <br></br>
                    <input autoComplete="off" type="password" onChange={e => this.setState({ password: e.target.value,copied:false})} />
                    <CopyToClipboard text={password} onCopy={e => this.setState({ copied1:true})}><button className="copyTC">Copiar</button></CopyToClipboard>
                    {copied1 ? this.mensaje(): null}
                    <PasswordStrengthMeter password = {password}/>*/}
                    <strong>Gener una contraseña</strong>
                    <br/>
                  
                    <input className="browser-default" autoComplete="off" type="text" onChange={e => this.setState({ contrasenya_avanzado: e.target.value,copied:false})} readOnly="readonly" value={this.state.contrasenya_avanzado}/>
                    <CopyToClipboard text={contrasenya_avanzado} onCopy={e => this.setState({ copied2:true})}><button className="copyTC">Copiar</button></CopyToClipboard>
                    {copied2 ? this.mensaje() : null}
                    <br/>
                    <div className="botones">
                      <label>
                        <input  className="with-gap" id="input1" name="radio" type="radio"  onChange={this.generarContrasenyaDebil}/>
                        <span className="checkFont">Numeros</span> 
                      </label>
                      <br></br>
                      <label>
                        <input  className="with-gap" id="input2" name="radio" type="radio" onChange={this.generarContrasenyaMedia}/>
                        <span className="checkFont">Numeros y letras</span>
                      </label>
                      <br></br>
                      <label>
                        <input  className="with-gap" id="input3" name="radio" type="radio" onChange={this.generarContrasenyaFuerte}/>
                        <span className="checkFont">Numeros, letras y caracteres especiales</span>
                      </label>
                      <br></br>
                      <pre><input className="range" type="range" min="8" max="20"  defaultValue={this.state.longitud} onChange={ e => this.setLongitud(e.target) }/>   {this.state.longitud}</pre>
                    </div>
                  </div>

                    <input type='submit' className="btn waves-effect waves-light mr-5" value='Guardar' onClick={this.comprobarPasswd}/>
                    <input type='button' className="btn waves-effect waves-light" value='cancelar' onClick={this.togglePopup4.bind(this)}/>
                    {this.state.ambasOpciones && <p className="warning">"Rellene solo una opcion"</p>}
                  </>

                }
              
              
              />
              :null
        }
            </>
    )
  }
}

export default CuerpoAdministracion
























