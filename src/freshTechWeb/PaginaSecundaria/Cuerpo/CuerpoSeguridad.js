import React from 'react'
import PasswordStrengthMeter from '../../SeguridadContrasenya/PasswordStrengthMeter';
import {CopyToClipboard} from 'react-copy-to-clipboard';


class CuerpoSeguridad extends React.Component {

  constructor(props){
    super(props)
    this.state = {
     
      password:'',
      copied1:false,
      copied2:false,
      contrasenya_avanzado:'',
      longitud:'8',
      tipo:'',
    
    }
    this.inputContra1 = React.createRef();
    this.inputContra2 = React.createRef();
  }
  componentDidMount() {
    this.buildPassword();
  }
  generarContrasenyaDebil =e =>{
   
    this.setState({tipo:"debil",copied2:false});

  }
  generarContrasenyaMedia =e =>{
    this.setState({tipo:"media",copied2:false});

  }
  generarContrasenyaFuerte =e =>{
    this.setState({tipo:"fuerte",copied2:false});

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
        if (this.state.tipo == "fuerte"){
          if((/[!@#$%*]/.test(value.charAt(i)))){
            val3=true;
          }
        }else{
          val3=true;
        }
      }
      return val1 && val2 && val3;
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
    this.setState({longitud:value,copied2:false}, () => { this.buildPassword();});
   
  }
  mensaje(){
    
    return <span style={{color: 'red'}}>Copiado</span>
    
  }
  resetVal = ({ value }) => {
    this.setState({password:''});
   
  }
  resetAvanzado = ({ value }) => {
    this.setState({contrasenya_avanzado:'',longitud:'8'});
   
  }

  render () {
    const {password,copied1,copied2,contrasenya_avanzado} = this.state
    return (
      <>
      <div className="browser-default">
        <h4 className="tituloSeguridad text-center">Prueba la seguridad tus contraseñas!</h4>
      <div className="passwdMeter">
          <br/>
          <strong className="browser-default">Introduzca una contraseña a validar</strong>
          <div className="meter">
            <br/>

            <form>
              <input className="browser-default" ref={this.inputContra1} autoComplete="off" type="password" onChange={e => this.setState({ password: e.target.value,copied1:false})} />
              <CopyToClipboard text={password} onCopy={e => this.setState({ copied1:true})}><button className="copyTC">Copiar</button></CopyToClipboard>
              {copied1 ? this.mensaje(): null}
              <input type="reset" className="copyTC" onClick ={this.resetVal}value="Vaciar" />
            </form>

            <PasswordStrengthMeter password = {password}/>



            <strong>O genere una a su gusto</strong>
            <br/>
            <br/>

            <form>
              <input className="browser-default" ref={this.inputContra2} autoComplete="off" type="text" onChange={e => this.setState({ contrasenya_avanzado: e.target.value,copied2:false})} readOnly="readonly" value={this.state.contrasenya_avanzado}/>
              <CopyToClipboard text={contrasenya_avanzado} onCopy={e => this.setState({ copied2:true})}><button className="copyTC">Copiar</button></CopyToClipboard>
              {copied2 ? this.mensaje() : null}
              <input type="reset" className="copyTC" onClick={this.resetAvanzado} value="Vaciar" />
           

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
            </form>
{/*
            <div className="botones">
              <input  id="input1" name="radio" type="radio" onChange={this.generarContrasenyaDebil}/> Numeros <br></br>
              <input  id="input2" name="radio" type="radio" onChange={this.generarContrasenyaMedia}/>  Numeros y letras<br></br>
              <input  id="input3" name="radio" type="radio" onChange={this.generarContrasenyaFuerte}/> Numeros, letras y caracteres especiales<br></br><br></br>
              <pre><input className="browser-default" type="range" min="8" max="20"  defaultValue={this.state.longitud} onChange={ e => this.setLongitud(e.target) }/>   {this.state.longitud}</pre>
            </div>
*/}
          </div>
      </div>
      </div>
        
      </>
    )
  }
}

export default CuerpoSeguridad





