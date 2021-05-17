import React from 'react'
import add from '../../../imagenes/add_icon.png'
import cajaFuerte from '../../../imagenes/cajaFuerte.png'
import Popup from '../../PopUp/Popup.js'
import ArrayList from '../../Desplegable/ArrayList.js'
import 'bootstrap/dist/css/bootstrap.min.css'
import PasswordStrengthMeter from '../../SeguridadContrasenya/PasswordStrengthMeter';
import contrasenyas from '../../../imagenes/contrasenyas.png'
import ArrayListJerarquia from '../../Desplegable/ArrayListJerarquia.js'
import {CopyToClipboard} from 'react-copy-to-clipboard';
import axios from 'axios';
import { createSvgIcon } from '@material-ui/core'
import 'materialize-css/dist/css/materialize.min.css'

function compararFechas(fecha1,fecha2){

  var fechaAct = Number(fecha1.split("-").reverse().join("-").replace(/-/g,""));
  var fechaCad = Number(fecha2.split("-").reverse().join("-").replace(/-/g,""));
  
  return fechaAct < fechaCad;

}
function verificarFecha(fechaVerif){

  var valida = false;
  var anyo = Number(fechaVerif[6] + fechaVerif[7] + fechaVerif[8] + fechaVerif[9]);
  var dia = Number(fechaVerif[0] + fechaVerif[1]);
  var mes = Number(fechaVerif[3] +  fechaVerif[4]);
  
  if(dia == 30 || dia == 31 || mes == 2){

    if (mes == 1 || mes == 3 || mes == 5 || mes == 7 || mes == 8 || mes == 10 || mes == 12){
      if(dia <= 31){
        valida = true;
      }
    }else if (mes == 2){
      if ((anyo % 4 == 0 && anyo % 100 != 0)||(anyo % 400 == 0)){
        if(dia <= 29){
          valida = true;
        }
      }else{
        if(dia <= 28){
          valida = true;
        }
      }
    }else if(mes == 4 || mes == 6 || mes == 9){
      if(dia <= 30){
        valida = true;
      }
    }
  }else{
    valida = true;
  }
  return valida;
}


const validate = values =>{
  const errors = {}

  if (!values.fecha_actual){
    errors.fecha_actual = 'Introduzca fecha válida'
  }
  if (!values.fecha_caducidad || !/[0-9][0-9]\-[0-9][0-9]\-[0-9][0-9][0-9][0-9]/.test(values.fecha_caducidad)||!compararFechas(values.fecha_actual,values.fecha_caducidad) ||!verificarFecha(values.fecha_caducidad)){
    errors.fecha_caducidad = 'Introduzca fecha válida'
  }
  
  if (!values.nombre){
    errors.nombre = 'Introduzca nombre válido'
  }
  if (!values.url){
    errors.url = 'Introduzca url válida'
  }
  if (!values.usuario){
    errors.usuario = 'Introduzca usuario válido'
  }
  if (!values.contrasenya){
    errors.contrasenya = 'Introduzca una contraseña'
  }
 
  return errors

}

function fecha(){
  var actual= new Date();

  var dia = actual.getDate();
  var anyo = actual.getFullYear();
  var mes = actual.getMonth() + 1;
  var resDia = dia.toString();
  var resMes = mes.toString();
  var resAnyo = anyo.toString();

  if (dia < 10){
    resDia = "0"+resDia;
  }
  if (mes < 10){
    resMes = "0"+resMes;
  }

  //this.setState=({fecha_actual:actual});
  return resDia+"-"+resMes+"-"+resAnyo;
}

class CuerpoContraseña extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      
      showPopup:false,
      showPopup2:false,
      showPopup4:false,
      fecha_actual:fecha(),
      fecha_caducidad:'',
      nombre:'',
      url:'',
      usuario:'',
      contrasenya:'',
      email:'',
      errors: {},
      ambasOpciones:false,
      avanzado:false,
      password:'',
      copied1:false,
      copied2:false,
      contrasenya_avanzado:'',
      longitud:'8',
      tipo:'',
      categoria:localStorage.getItem('categoria'),
      ordenarPor:localStorage.getItem('ordenarPor'),
      ordenarDe:localStorage.getItem('ordenarDe'),
      token: localStorage.getItem('token'),
      listadoContrasenyas:[],
      cargaContenido:true,
      listadoCategorias:[],
      sinCategorias:false,
      contrasenyaEdit:'',
      vacio:true,
      nombreAnterior:'',
      cargando:true,
     
      
    }
    this.contraEdit={
      nombre:'',
      categoria:'',usuario:'',
      contrasenya:'',url:'',
      caducidad:'',activacion:'',

    }
    this.copiaLista={listaCopia:[]};  

    this.nombre=React.createRef();
    this.usuario=React.createRef();
    this.passwd=React.createRef();
    this.dominio=React.createRef();
    this.creacion=React.createRef();
    this.caducidad=React.createRef();


    
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
  crearContrasenya=async(value)=>{
 
    const datos = {concreteuser:this.state.usuario,concretepasswd:this.state.contrasenya, dominio:this.state.url,fechacreacion:this.state.fecha_actual,fechacaducidad:this.state.fecha_caducidad,nombre:this.state.nombre,categoria:localStorage.getItem('categoria')};
    const headers = {'Authorization':`Bearer ${value}`};
    await axios.post('https://fresh-techh.herokuapp.com/passwd',datos,{headers}
    )
    .then(response =>{
      
      this.setState({cargaContenido:true});
      this.togglePopup();
    })
  
  }

  selectContrasenyasName=async(value)=>{
    var lista = [];
    var indice = 0;
    var orden = '';
    var ordenarde ='';
    console.log("Ordenar por: ",this.state.ordenarPor);
    console.log("Ordenar de: ",this.state.ordenarDe);
    if(this.state.ordenarPor == "Nombre"){
      orden = "nombre";
    }else if(this.state.ordenarPor == "Fecha de creación"){
      orden = "fechacreacion";
    }else if(this.state.ordenarPor == "undefined"){
      orden = "nombre";
    }else if(this.state.ordenarPor == null || this.state.ordenarPor == "null"){
      orden = "nombre";

    }else{
      orden = "fechacaducidad";
    }
    if(this.state.ordenarDe == null){
      ordenarde = "ASC";
    }else{
      ordenarde = this.state.ordenarDe;
    }
    //const query = {ordenarPor:this.state.ordenarPor,ordenarDe:this.state.ordenarDe};
    //const headers = {'Authorization':`Bearer ${value}`};
    const config = {
      headers: {'Authorization':`Bearer ${value}`},
      params:{ordenarPor:orden,ordenarDe:ordenarde}
    }
    await axios.get('https://fresh-techh.herokuapp.com/passwdUser',config
    )
    .then(response =>{
      console.log("RespuestaSelect: ", response.data);
      
      
      for(var i=0; i < response.data.length;i++){
       if(response.data[i].tipo == "usuario-passwd"){
         
         lista[indice] = response.data[i];
         indice = indice + 1;
       }
      }
      if(lista.length == 0){
        this.setState({vacio:true});
      }else{
        this.setState({vacio:false});
      }
      this.setState({listadoContrasenyas:lista,cargaContenido:false,cargando:false});
    })
  
  }

  selectCategorias=async(value)=>{
   
    //const query = {ordenarPor:this.state.ordenarPor,ordenarDe:this.state.ordenarDe};
    //const headers = {'Authorization':`Bearer ${value}`};
    const config = {
      headers: {'Authorization':`Bearer ${value}`},
    }
    await axios.get('https://fresh-techh.herokuapp.com/getcat',config
    )
    .then(response =>{
  
    
      this.setState({listadoCategorias:response.data,cargaContenido:false});
    })
  }

  selectPasswdDetails=async(value1,value2)=>{

    
    await axios.get('https://fresh-techh.herokuapp.com/detailspasswd',{params:{nombre:`${value1}`},headers:{'Authorization':`Bearer ${value2}`}}
    )
    .then(response =>{
     
      let array = this.state.listadoCategorias;
      if(array.length > 0){
        this.miListaC.listaC = array.map((data) => data.nombrecat);
      }
      
     
      this.contraEdit.categoria=response.data.categoria;
      this.contraEdit.usuario=response.data.concreteuser;
      this.contraEdit.activacion=response.data.fechacreacion;
      this.contraEdit.caducidad=response.data.fechacaducidad;
      this.contraEdit.contrasenya=response.data.concretpasswd;
      this.contraEdit.url=response.data.dominio;
      this.contraEdit.nombre=value1;
      var longitud = (this.miListaC.listaC.length) + 1;
      var elemento = this.miListaC.listaC[0];
      var existe = false;
      var id = 0;
      this.setState({fecha_actual:this.contraEdit.activacion,contrasenyaEdit:this.contraEdit.contrasenya});

      for (var i= 0; i < this.miListaC.listaC.length; i++){
        this.copiaLista.listaCopia[i] = this.miListaC.listaC[i];
        if(elemento != "sin categorias disponibles"){
          if(this.copiaLista.listaCopia[i] == this.contraEdit.categoria){
            
            existe = true;
            id = i;
          }
        }
      } 
      
 
        if (elemento == "sin categorias disponibles"){
          
          this.copiaLista.listaCopia[0] = this.contraEdit.categoria;
 
        }else{
          if (existe){
            this.copiaLista.listaCopia[0] = this.contraEdit.categoria;
            this.copiaLista.listaCopia[id] = elemento;
          }else{
            this.copiaLista.listaCopia[0] = this.contraEdit.categoria;
            this.copiaLista.listaCopia[longitud] = elemento;
          }
      
        }
        
      
      
      
      this.ordenarListaC();
      this.togglePopup2();
     
    })
    .catch(error=>{
    
    })
  }

  ordenarListaC(){
    let cat = this.contraEdit.categoria;
    let indice;
    if(this.miListaC.listaC.length > 1){
      for(var i = 0; i < this.miListaC.listaC.length; i++){
        if(this.miListaC.listaC[i] == cat){
          indice = i;
        }
      }
      if(indice != 0 ){
        this.miListaC.listaC[indice] = this.miListaC.listaC[indice-1];
        this.miListaC.listaC[indice-1] = cat;
      }

    }
    
  }


  deleteContrasenya=async(value1,value2)=>{
  
  
    await axios.delete('https://fresh-techh.herokuapp.com/deletepasswd',{headers:{'Authorization':`Bearer ${value2}`},data:{nombre:`${value1}`}}
    )
    .then(response =>{
      //window.location.reload(true);
      this.setState({cargaContenido:true});
    })
    .catch(error=>{

    })
  }
  actualizarContrasenya=async(value1,value2)=>{
    console.log("Nombre: ", this.state.nombreAnterior);
    console.log("Nombre: ", this.state.nombre);
    console.log("Usuario: ", this.state.usuario);
    console.log("Contrasenya: ", this.state.contrasenya);
    console.log("URL: ", this.state.url);
    console.log("Contrasenya: ", value1);
    console.log("URL: ", this.state.fecha_caducidad);

    
    const datos = {nombrePassword:this.state.nombreAnterior,concreteuser:this.state.usuario,concretepasswd:this.state.contrasenyaEdit, dominio:this.state.url,fechacreacion:this.state.fecha_actual,fechacaducidad:this.state.fecha_caducidad,nombre:this.state.nombre,categoria:value1};
    const headers = {'Authorization':`Bearer ${value2}`};
    await axios.post('https://fresh-techh.herokuapp.com/editpasswd',datos,{headers}
    )
    .then(response =>{
      console.log(response.data);
      this.setState({cargaContenido:true},() => this.togglePopup2());
      
      
    })
    .catch(error=>{
  
    })
  }


  delete =e =>{
    e.preventDefault();

    var pass = e.currentTarget.id;
    this.deleteContrasenya(pass,this.state.token);
    
  }



  select =e =>{
    e.preventDefault();
    var pass = e.currentTarget.id;
    
    this.selectPasswdDetails(pass,this.state.token);
    
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
        tipo:'',contrasenyaEdit:this.state.contrasenya_avanzado});
     
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
    this.setState({longitud:value}, () => { this.buildPassword();});
   
  }
  mensaje(){
    
    return <span style={{color: 'red'}}>Copiado</span>
    
  }
  
  togglePopup() {
    this.setState({
      showPopup: !this.state.showPopup,
      errors: {},
      fecha_caducidad:'',
      nombre:'',
      url:'',
      usuario:'',
      contrasenya:'',
      email:'',
      fecha_actual:fecha(),
      isFectch: true,
      ambasOpciones:false,
      avanzado:false,
      password:'',
      copied1:false,
      copied2:false,
      contrasenya_avanzado:'',
      longitud:'8',
      tipo:'',
    });



    let array = this.state.listadoCategorias;
    if(array.length > 0){
      this.miListaC.listaC = array.map((data) => data.nombrecat);
    }
  
  
  }

  togglePopup2() {
    this.setState({
      showPopup2: !this.state.showPopup2,
      errors: {},
      fecha_caducidad:this.contraEdit.caducidad,
      nombre:this.contraEdit.nombre,
      url:this.contraEdit.url,
      usuario:this.contraEdit.usuario,
      contrasenya:this.contraEdit.contrasenya,
      email:'',
      fecha_actual:fecha(),
      isFectch: true,
      ambasOpciones:false,
      avanzado:false,
      password:'',
      copied1:false,
      copied2:false,
      contrasenya_avanzado:'',
      longitud:'8',
      tipo:'',
      nombreAnterior:this.contraEdit.nombre,
      errorsC:{},
    });
    console.log("ANTES: ", this.contraEdit.nombre);
    
    


    
  }

  
  togglePopup4() {
    this.setState({
      showPopup4: !this.state.showPopup4,
      errors:{},
      errorsC:{},
    
    });
  }

  miListaV={
    listaV:["Nombre","Fecha de creación", "Fecha de caducidad"]
  }
  miListaC={
    listaC:["sin categorias disponibles"]
  }

  


  handleChange = ({target}) => {
    const{name,value} = target
    this.setState({[name]:value})

  }


  handleSubmit =e => {
    e.preventDefault()
    //Así separo errors del resto de estado
    const {errors, ...sinErrors} = this.state
    const result = validate(sinErrors)
    
    
    this.setState({errors:result})
  
    if(!Object.keys(result).length){ //Si tiene propiedades, hay error
      //Envio formulario
      const userToken = localStorage.getItem('token');
      this.crearContrasenya(userToken);

    }else{

      console.log('Formulario inválido')
    }

  }

  handleSubmitEdit =e => {
    e.preventDefault()    

    var cat = localStorage.getItem('categoria');
   
    this.actualizarContrasenya(cat,this.state.token);
    

  }


  

  


  render () {
    const { errors,copied2,contrasenya_avanzado,avanzado,token,cargaContenido} = this.state
    {cargaContenido && this.selectContrasenyasName(token)}
    {cargaContenido && this.selectCategorias(token)}
    
    
    return (
      <>
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"></link>
      
      <div className="Filtro">
        <br></br><br></br>
        <div className="bloqueArray">
          {/*<div className="filtro3">
          <ArrayListJerarquia />
          </div>*/}
          <div className="filtro">
            <ArrayList tipo={false} valores={this.miListaV.listaV} contenido={"contrasenya"}/>
          </div>
        </div> 
      </div>
      <br></br><br></br>
    {this.state.cargando ?
     <div className="preloader">
      <div class="preloader-wrapper big active">
        <div class="spinner-layer spinner-blue-only">
          <div class="circle-clipper left">
            <div class="circle"></div>
          </div><div class="gap-patch">
            <div class="circle"></div>
          </div><div class="circle-clipper right">
            <div class="circle"></div>
          </div>
        </div>
      </div>
      </div>
    :
    <>
     
     
        <ul className="collection header col">
        <li className="collection-header header2 ml-4">
          <div className="contenidoList">
            <h4 className="header2">Contraseñas</h4>
            <button className="anyade" onClick={this.togglePopup.bind(this)}>Añade una!</button>
          </div>
        </li>
        {this.state.vacio ? 
         <li class="collection-item avatar"><h4>No hay contraseñas creadas</h4></li>
        :
        <>
          {this.state.listadoContrasenyas.map(data=>(
          <li key={data.nombre} className="collection-item avatar">
            <i className="material-icons iconoShow circle green">lock</i>
            <div className="contenidoList">
              
              <p id={data.nombre} className="nombreItem">{data.nombre}</p>
              
              <p className="fechas">creación: {data.fechacreacion}<br></br>
                  caducidad: {data.fechacaducidad}
              </p>
              <div className="botonesEditDel">
                <input className="btn btn-primary" name={data.nombre} id={data.nombre} type='button' value='Editar'  onClick={this.select}/>
                <input className="btn btn-primary ml-2" name={data.nombre} id={data.nombre} type='button' value='Eliminar' onClick={this.delete}/>
              </div>
            </div>
          </li>
        ))} 

      </>
      }
      </ul>
          
        
    </>
  }
      
        {/*<pre><table className="tablaContrasenya">
           <tbody>
            <tr>
              <td>
                <img className="contrasenyasDePrueba" src={contrasenyas}/>
                <br></br>
                <input type='button' value='Editar'/>
                <input type='button' value='Eliminar'/>
              </td>
              <td>
                <img className="contrasenyasDePrueba" src={contrasenyas}/>
                <br></br>
                <input type='button' value='Editar'/>
                <input type='button' value='Eliminar'/>
              </td>
              <td>
                <img className="contrasenyasDePrueba" src={contrasenyas}/>
                <br></br>
                <input type='button' value='Editar'/>
                <input type='button' value='Eliminar'/>
              </td>
              
            </tr>
           </tbody>
    </table></pre>*/}

      

      
      {this.state.showPopup ? 
          <Popup
            text='Usuario-contraseña:'
            cuerpo={
              <>
             
              <form onSubmit={this.handleSubmit}>
               <div  className="array"><ArrayList tipo={true} valores={this.miListaC.listaC}/></div>
          
              
             
               <div className="input-field ">
                  <i className="material-icons prefix">assignment</i>
                  <input className="field" ref={this.nombre} type="text" name="nombre"id="nombre" onChange={this.handleChange} placeholder="Nombre"/>
                  {errors.nombre && <p className="warning">{errors.nombre}</p>}
                </div>

               {/* <label htmlFor="nombre">Nombre                </label>
                <input type="text" name="nombre"id="nombre" onChange={this.handleChange}/>
            {errors.nombre && <p className="warning">{errors.nombre}</p>}*/}

                <div className="input-field">
                  <i className="material-icons prefix">assignment</i>
                  <input className="field" type="text" name="url"id="url" onChange={this.handleChange} placeholder="URL"/>
                  {errors.url && <p className="warning">{errors.url}</p>}
                </div>
              

                 {/* <br/>
                <label htmlFor="url">URL                   </label>
                <input type="text" name="url"id="url" onChange={this.handleChange}/>
                {errors.url && <p className="warning">{errors.url}</p>}*/}

                <div className="input-field">
                  <i className="material-icons prefix">assignment</i>
                  <input className="field" type="text" name="usuario"id="usuario" onChange={this.handleChange} placeholder="Usuario"/>
                  {errors.usuario && <p className="warning">{errors.usuario}</p>}
                </div>

                 {/*<br/>
                <label htmlFor="usuario">Usuario               </label>
                <input type="text" name="usuario"id="usuario" onChange={this.handleChange}/>
                {errors.usuario && <p className="warning">{errors.usuario}</p>}*/}

                {/*<br/>
                <label className="passwdControl" htmlFor="contrasenya">                          Contraseña
                  <label>            </label>
                  <input type='password' name = "contrasenya"id="contrasenya" onChange={this.handleChange} value={avanzado ? this.state.contrasenya:undefined}/>
                  <label> </label>
                  <input type="button" className="editButton" onClick={this.togglePopup4.bind(this)}/>
                </label>
                <PasswordStrengthMeter password = {this.state.contrasenya}/>
                {errors.contrasenya && <p className="warning">{errors.contrasenya}</p>}*/} 

             
                {/*<br/>
                
                <label htmlFor="email">Email                 </label>
                <input type="email" name="email"id="email" onChange={this.handleChange}/>
                {errors.email && <p className="warning">{errors.email}</p>}
                
                <br/>
              
                <label htmlFor="fecha_actual">Fecha de activación   </label>
                <input type="date" name="fecha_actual"id="fecha_actual" value={this.state.fecha_actual} onChange={this.handleChange} readOnly/>
                {errors.fecha_actual && <p className="warning">{errors.fecha_actual}</p>}

                <br/>
                
                <label htmlFor="fecha_caducidad">Fecha de caducidad    </label>
                <input type="date" name="fecha_caducidad"id="fecha_caducidad" placeholder={"DD-MM-YYYY"} onChange={this.handleChange}/>
                
                {errors.fecha_caducidad && <p className="warning">{errors.fecha_caducidad}</p>}*/} 

                
                  <div className="input-field">
                    <i className="material-icons icon prefix">send</i>
                    
                    <input className="field2" type="date" name="fecha_actual"id="fecha_actual" value={"Fecha creación: " + this.state.fecha_actual} onChange={this.handleChange} readonly="readonly"/>
                    {errors.fecha_actual && <p className="warning">{errors.fecha_actual}</p>}
                  </div>

                  <div className="input-field">
                    <i className="material-icons prefix">assignment</i>
                    <input className="field2" type="date" name="fecha_caducidad"id="fecha_caducidad" placeholder={"Fecha de caducidad: DD-MM-YYYY"} onChange={this.handleChange}/>
                    {errors.fecha_caducidad && <p className="warning">{errors.fecha_caducidad}</p>}
                  </div>
                  <div className="input-field">
                        
                    <i className="material-icons prefix">lock</i>
                    <input className="field" type='password' name = "contrasenya"id="contrasenya" onChange={this.handleChange} value={avanzado ? this.state.contrasenya:undefined}/>
                              
                    <button className="btn-floating blue prefix" onClick={this.togglePopup4.bind(this)}>
                    <i className="material-icons circle">edit</i>
                    </button>
                                
                    <PasswordStrengthMeter password = {this.state.contrasenya}/>
                    {errors.contrasenya && <p className="warning">{errors.contrasenya}</p>}
                  </div>
               


                <br/>
                <input type='submit' className="btn waves-effect waves-light mr-5" value='Enviar'/>
                <input type='button' className="btn waves-effect waves-light" value='Cerrar' onClick={this.togglePopup.bind(this)}/>
             
              </form>
             
                </>
            }
           

            eliminada={false}
          />
          : null
        }
      



          {this.state.showPopup2 ? 
              <Popup
                text='Edita la contraseña'
                cuerpo={
                  <>

                  <form onSubmit={this.handleSubmitEdit}>
                    <div  className="array"><ArrayList tipo={true} valores={this.copiaLista.listaCopia}/></div>
          
                
             
               <div className="input-field ">
                  <i className="material-icons prefix">assignment</i>
                  <input className="field" ref={this.nombre} type="text" name="nombre"id="nombre" onChange={this.handleChange} defaultValue={this.contraEdit.nombre} placeholder="Nombre"/>
                  {errors.nombre && <p className="warning">{errors.nombre}</p>}
                </div>

             

                <div className="input-field">
                  <i className="material-icons prefix">assignment</i>
                  <input className="field" ref={this.dominio} type="text" name="url"id="url" onChange={this.handleChange} defaultValue={this.contraEdit.url} placeholder="URL"/>
                  {errors.url && <p className="warning">{errors.url}</p>}
                </div>
              

              

                <div className="input-field">
                  <i className="material-icons prefix">assignment</i>
                  <input className="field" ref={this.usuario} type="text" name="usuario"id="usuario" onChange={this.handleChange} defaultValue={this.contraEdit.usuario} placeholder="Usuario"/>
                  {errors.usuario && <p className="warning">{errors.usuario}</p>}
                </div>

                
                  <div className="input-field">
                    <i className="material-icons icon prefix">send</i>
              
                    <input className="field2" ref={this.creacion} type="date" name="fecha_actual"id="fecha_actual" value={"Fecha creación: " + this.state.fecha_actual} onChange={this.handleChange} readonly="readonly"/>
                    {errors.fecha_actual && <p className="warning">{errors.fecha_actual}</p>}
                  </div>

                  <div className="input-field">
                    <i className="material-icons prefix">assignment</i>
                  
                    <input className="field2" ref={this.caducidad} type="date" name="fecha_caducidad"id="fecha_caducidad" placeholder={"Fecha de caducidad: DD-MM-YYYY"} onChange={this.handleChange} defaultValue={this.contraEdit.caducidad}/>
                    {errors.fecha_caducidad && <p className="warning">{errors.fecha_caducidad}</p>}
                  </div>
                  <div className="input-field">
                        
                    <i className="material-icons prefix">lock</i>
                    <input ref={this.passwd} className="field" type='text' name = "contrasenyaEdit"id="contrasenyaEdit" onChange={this.handleChange} value={avanzado ? this.state.contrasenyaEdit:undefined}  defaultValue={this.contraEdit.contrasenya}/>  
                    <button type="button" className="btn-floating blue prefix" onClick={this.togglePopup4.bind(this)}>
                      <i className="material-icons circle">edit</i>
                    </button>
                              
                    <PasswordStrengthMeter password = {this.state.contrasenyaEdit}/>
                    {errors.contrasenyaEdit && <p className="warning">{errors.contrasenyaEdit}</p>}
                  </div>
               


                <br/>
          
                <input type='submit' className="btn waves-effect waves-light mr-5" value='Actualizar'/>
                <input type='button' className="btn waves-effect waves-light" value='Cerrar' onClick={this.togglePopup2.bind(this)}/>
             
              </form>
             




































{/* 



                  <pre>
                  <form onSubmit={this.handleSubmitEdit}>
                   
                   <div  className="array"><ArrayList tipo={true} valores={this.copiaLista.listaCopia}/></div>
              
                   <br></br>

               
             
                  <label htmlFor="nombre">Nombre                </label>
                    <input ref={this.nombre} type="text" name="nombre"id="nombre" onChange={this.handleChange} defaultValue={this.contraEdit.nombre}/>
                {errors.nombre && <p className="warning">{errors.nombre}</p>}
    
                    <br/>
                    <label htmlFor="url">URL                   </label>
                    <input ref={this.dominio} type="text" name="url"id="url" onChange={this.handleChange} defaultValue={this.contraEdit.url}/>
                    {errors.url && <p className="warning">{errors.url}</p>}
    
                    <br/>
                    <label htmlFor="usuario">Usuario               </label>
                    <input ref={this.usuario} type="text" name="usuario"id="usuario" onChange={this.handleChange} defaultValue={this.contraEdit.usuario}/>
                    {errors.usuario && <p className="warning">{errors.usuario}</p>}
    
                    <br/>
                    <label className="passwdControl" htmlFor="contrasenyaEdit">                          Contraseña
                      <label>            </label>
                      <input ref={this.passwd} type='text' name = "contrasenyaEdit"id="contrasenyaEdit" onChange={this.handleChange} value={avanzado ? this.state.contrasenya:undefined}  defaultValue={this.contraEdit.contrasenya}/>
                      <label> </label>
                      <input type="button" className="editButton" onClick={this.togglePopup4.bind(this)}/>
                    </label>
                  
                    <PasswordStrengthMeter password = {this.state.contrasenyaEdit}/>
                    {errors.contrasenyaEdit && <p className="warning">{errors.contrasenyaEdit}</p>}

                    <br/>
                  
                    <label htmlFor="fecha_actual">Fecha de activación   </label>
                    <input ref={this.creacion} type="date" name="fecha_actual"id="fecha_actual" value={this.state.fecha_actual} onChange={this.handleChange} readOnly/>
                    {errors.fecha_actual && <p className="warning">{errors.fecha_actual}</p>}
    
                    <br/>
                    
                    <label htmlFor="fecha_caducidad">Fecha de caducidad    </label>
                    <input ref={this.caducidad} type="date" name="fecha_caducidad"id="fecha_caducidad" placeholder={"DD-MM-YYYY"} onChange={this.handleChange} defaultValue={this.contraEdit.caducidad}/>
                    
                    {errors.fecha_caducidad && <p className="warning">{errors.fecha_caducidad}</p>}
    
                    <br/>
                    <input type='submit' className="Send" value='Actualizar'/>
                    <input type='button' className="Close" value='Cerrar' onClick={this.togglePopup2.bind(this)}/>
    
                  </form>
                  </pre>*/}
                    </>
                }
              />
              :null
        }
          {this.state.showPopup4 ? 
              <Popup
                text='Genere una contraseña'
                cuerpo = {
                  <>

                  <div className="meter1">
                    {/*<strong>Escribe una contraseña</strong>
                    <br></br>
                    <input autoComplete="off" type="password" onChange={e => this.setState({ password: e.target.value,copied:false})} />
                    <CopyToClipboard text={password} onCopy={e => this.setState({ copied1:true})}><button className="copyTC">Copiar</button></CopyToClipboard>
                    {copied1 ? this.mensaje(): null}
                    <PasswordStrengthMeter password = {password}/>*/}
                    
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

export default CuerpoContraseña
