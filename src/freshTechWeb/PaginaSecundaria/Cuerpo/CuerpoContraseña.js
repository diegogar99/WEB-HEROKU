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


///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
//FUNCIONES AUXILIARES PARA GESTIONAR FECHAS Y ERRORES

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
const validateEdit = values =>{
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
 
  if(values.contrasenya && !values.contrasenyaEdit && values.actualizaPasswd){
    errors.contrasenyaEdit = 'Introduzca una contraseña'
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

  return resDia+"-"+resMes+"-"+resAnyo;
}

//Busca elemento en lista y devuelve indice o -1 si no está
function buscar(lista,elemento){
  var i;
  for(i=0; i< lista.length; i++){
    if(lista[i] == elemento){
      return i;
    }
  }
  return -1;
}

//Permuta dos elementos de una lista
function permuta(indice1, indice2, lista){
  var elemento = lista[indice1];
  lista[indice1] = lista[indice2];
  lista[indice2] = elemento;
  return lista;
}

///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////

//CLASE CUERPOCONTRSEÑAS
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
      existe:false,
      actualizaPasswd:false,

     
      
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
  ///////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////

  //LISTA ORDENAR
  miListaV={
    listaV:["Nombre","Fecha de creación", "Fecha de caducidad", "Categoria"]
  }
  //LISTA CATEGORIAS
  miListaC={
    listaC:["sin categorias disponibles"]
  }
  

   ///////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////
  //FUNCIONES CONTRASEÑAS
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

  generarContrasenyaDebil =e =>{
    this.setState({tipo:"debil"});

  }
  generarContrasenyaMedia =e =>{
    this.setState({tipo:"media"});

  }
  generarContrasenyaFuerte =e =>{
    this.setState({tipo:"fuerte"});

  }




///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
//AXIOS CONEXION CON API

//SELECT CATEGORIAS

selectCategorias=async(value)=>{
   

  const config = {
    headers: {'Authorization':`Bearer ${value}`},
  }
  await axios.get('https://fresh-techh.herokuapp.com/getcat',config
  )
  .then(response =>{

    var categoriasList = response.data;
      
      if(categoriasList.length >0){
        categoriasList[categoriasList.length] = {nombrecat:"Sin categoría"};
      }
      
      this.setState({listadoCategorias:categoriasList,cargaContenido:false});
  })
}


//CREA USER-PASSWD
  crearContrasenya=async(value)=>{
    var catAEnviar=null;
    console.log("SENDD: ",localStorage.getItem('categoria'));
    if(localStorage.getItem('categoria') == null){
      if((this.miListaC.listaC[0] != "Sin categoría") && (this.miListaC.listaC[0] != "sin categorias disponibles")){
        catAEnviar = this.miListaC.listaC[0];
        console.log("SENDD");
      }
    }
    else if((localStorage.getItem('categoria') != "Sin categoría") && (localStorage.getItem('categoria') != "sin categorias disponibles")){
    
      catAEnviar=localStorage.getItem('categoria');
    }
    const datos = {concreteuser:this.state.usuario,concretepasswd:this.state.contrasenya, dominio:this.state.url,fechacreacion:this.state.fecha_actual,fechacaducidad:this.state.fecha_caducidad,nombre:this.state.nombre,categoria:catAEnviar};
    const headers = {'Authorization':`Bearer ${value}`};
    await axios.post('https://fresh-techh.herokuapp.com/passwd',datos,{headers}
    )
    .then(response =>{
      
      this.setState({cargaContenido:true},() => this.togglePopup());
      
      localStorage.removeItem('categoria');

    })
    .catch(error=>{
      this.setState({existe:true});
      console.log("error");
    })
  
  }

  //SELECCIONA USER-PASSWD PARA MOSTRARLAS
  selectContrasenyasName=async(value)=>{
    var lista = [];
    var indice = 0;
    var orden = '';
    var ordenarde ='';
    console.log("Ordenar por: ",this.state.ordenarPor);
    console.log("Ordenar de: ",this.state.ordenarDe);
    if(this.state.ordenarPor == "Nombre"){
      orden = "nombre";
    }else if(this.state.ordenarPor == "Categoria"){
        orden = "categoria";
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

//SELECCIONA DETALLES DE UN USER-pASSWD PARA EDITARLO
  selectPasswdDetails=async(value1,value2)=>{

    
    await axios.get('https://fresh-techh.herokuapp.com/detailspasswd',{params:{nombre:`${value1}`},headers:{'Authorization':`Bearer ${value2}`}}
    )
    .then(response =>{
     
     
      console.log("Supuesta passwd: ", response.data.concretpasswd);
      this.contraEdit.usuario=response.data.concreteuser;
      this.contraEdit.activacion=response.data.fechacreacion;
      this.contraEdit.caducidad=response.data.fechacaducidad;
      this.contraEdit.contrasenya=response.data.concretpasswd;
      this.contraEdit.url=response.data.dominio;
      this.contraEdit.nombre=value1;

      if(response.data.categoria == null){
        this.contraEdit.categoria="Sin categoría"
      }else{
        this.contraEdit.categoria=response.data.categoria;
      }
      
     let array = this.state.listadoCategorias;
      if(array.length > 0){
        this.copiaLista.listaCopia = array.map((data) => data.nombrecat);
      }else{
        if(this.contraEdit.categoria == null){
          this.copiaLista.listaCopia[0] =  "Sin categoría";
        }else{
          this.copiaLista.listaCopia[0] =  this.contraEdit.categoria;
        }
      }
      
      if(this.copiaLista.listaCopia[0] == "sin categorias disponibles"){
        this.copiaLista.listaCopia[0] =  this.contraEdit.categoria;
      }else{

        var indiceElemento = buscar( this.copiaLista.listaCopia,this.contraEdit.categoria);
        if(indiceElemento == -1){
          this.copiaLista.listaCopia[this.copiaLista.listaCopia.length] = this.copiaLista.listaCopia[0];
          this.copiaLista.listaCopia[0] = this.contraEdit.categoria;
        }else{
          this.copiaLista.listaCopia = permuta(0, indiceElemento,this.copiaLista.listaCopia);
        }
      }
      this.togglePopup2();
     
    })
 
  }


//ELIMINA USER-PASSWD
  deleteContrasenya=async(value1,value2)=>{
  
  
    await axios.delete('https://fresh-techh.herokuapp.com/deletepasswd',{headers:{'Authorization':`Bearer ${value2}`},data:{nombre:`${value1}`}}
    )
    .then(response =>{
      this.setState({cargaContenido:true});
    })
 
  }

  //ACTUALIZA USER-PASSWD
  actualizarContrasenya=async(value1,value2)=>{
    console.log("Nombre: ", this.state.nombreAnterior);
    console.log("Nombre: ", this.state.nombre);
    console.log("Usuario: ", this.state.usuario);
    console.log("Contrasenya: ", this.state.contrasenya);
    console.log("ContrasenyaNueva: ", this.state.contrasenyaEdit);
    console.log("URL: ", this.state.url);
    console.log("Contrasenya: ", value1);
    console.log("URL: ", this.state.fecha_caducidad);
    var contraActualizada = "";
    if(this.state.contrasenyaEdit == ""){
      contraActualizada = this.state.contrasenya;
    }else{
      if(this.state.actualizaPasswd){
        contraActualizada = this.state.contrasenyaEdit;
      }else{
        contraActualizada = this.state.contrasenya;
      }
     
    }
    var catAEnviar=null;
    if(value1 == null){
      if((this.copiaLista.listaCopia[0] != "Sin categoría") && (this.copiaLista.listaCopia[0] != "sin categorias disponibles")){
        catAEnviar = this.copiaLista.listaCopia[0];
	console.log("SEENNDDDDDD");
      }
    }
    else if((value1 != "Sin categoría") && (value1 != "sin categorias disponibles")){
    
      catAEnviar=value1;
    }

    
    const datos = {nombrePassword:this.state.nombreAnterior,concreteuser:this.state.usuario,concretepasswd:contraActualizada, dominio:this.state.url,fechacreacion:this.state.fecha_actual,fechacaducidad:this.state.fecha_caducidad,nombre:this.state.nombre,categoria:catAEnviar};
    const headers = {'Authorization':`Bearer ${value2}`};
    await axios.post('https://fresh-techh.herokuapp.com/editpasswd',datos,{headers}
    )
    .then(response =>{
      console.log(response.data);    
      this.setState({cargaContenido:true},() => this.togglePopup2());
      localStorage.removeItem('categoria');
      
      
    })
    .catch(error=>{
      this.setState({existe:true});
      console.log("error");
    })
 
  }


  ///////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////

  //FUNCIONES QUE USAN LAS AXIOS
  //ELIMINA USER-PASSWD
  delete =e =>{
    e.preventDefault();

    var pass = e.currentTarget.id;
    this.deleteContrasenya(pass,this.state.token);
    
  }


//SELECCIONA USER-PASSWD
  select =e =>{
    e.preventDefault();
    var pass = e.currentTarget.id;
    
    this.selectPasswdDetails(pass,this.state.token);
    
  }




  ///////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////
  //FUNCIONES AUXILIARES
  //MENSAJE DE ERROR
  mensaje(){
    
    return <span style={{color: 'red'}}>Copiado</span>
    
  }
  //NO SE USA
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


  ///////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////
  //POPUPS

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
      existe:false,

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
      existe:false,

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


  ///////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////

  //HANDLE CHANGE

  handleChange = ({target}) => {
    const{name,value} = target
    this.setState({[name]:value})
    this.setState({existe:false});

  }
  //HANDLE CHANGE ACTUALIZAR PASSWD
  handleChangeUploadPasswd = ({target}) => {
    const{name,value} = target
    this.setState({[name]:value})
    this.setState({actualizaPasswd:true});

  }

 //FORMULARIOS SUBMIT

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
    //Así separo errors del resto de estado
    const {errors, ...sinErrors} = this.state
    const result = validateEdit(sinErrors)
    this.setState({errors:result})
  
    if(!Object.keys(result).length){ //Si tiene propiedades, hay error
      //Envio formulario
      var cat = localStorage.getItem('categoria');
      this.actualizarContrasenya(cat,this.state.token);

    }else{

      console.log('Formulario inválido')
    }
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
            <div className="contenedorNombreUserPasswd">
              <p id={data.nombre} className="nombreItem">{data.nombre}</p>
            </div>
              <p className="fechas">Fecha creación: {data.fechacreacion}<br></br>
                  Fecha caducidad: {data.fechacaducidad}
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
      
      {this.state.showPopup ? 
          <Popup
            text='Añade una pareja usuario-passwdord!'
            cuerpo={
              <>
             
              <form onSubmit={this.handleSubmit}>
               <div  className="array"><ArrayList tipo={true} valores={this.miListaC.listaC}/></div>
          
              
               <div className="pup">
               <div className="input-field ">
                  <i className="material-icons prefix">assignment</i>
                  <input className="field" ref={this.nombre} type="text" name="nombre"id="nombre" onChange={this.handleChange} placeholder="Nombre"/>
                  {errors.nombre && <p className="warning">{errors.nombre}</p>}
                  {this.state.existe && <p className="warning">Existe contraseña con ese nombre</p>}

                </div>

            

                <div className="input-field">
                  <i className="material-icons prefix">assignment</i>
                  <input className="field" type="text" name="url"id="url" onChange={this.handleChange} placeholder="URL"/>
                  {errors.url && <p className="warning">{errors.url}</p>}
                </div>
              

                

                <div className="input-field">
                  <i className="material-icons prefix">assignment</i>
                  <input className="field" type="text" name="usuario"id="usuario" onChange={this.handleChange} placeholder="Usuario"/>
                  {errors.usuario && <p className="warning">{errors.usuario}</p>}
                </div>

                
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
                </div>
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
          
                
              <div className="pup">
               <div className="input-field ">
                  <i className="material-icons prefix">assignment</i>
                  <input className="field" ref={this.nombre} type="text" name="nombre"id="nombre" onChange={this.handleChange} defaultValue={this.contraEdit.nombre} placeholder="Nombre"/>
                  {errors.nombre && <p className="warning">{errors.nombre}</p>}
                  {this.state.existe && <p className="warning">Existe contraseña con ese nombre</p>}

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
                    <input ref={this.passwd} className="field" type='text' name = "contrasenyaEdit"id="contrasenyaEdit" onChange={this.handleChangeUploadPasswd} value={avanzado ? this.state.contrasenyaEdit:undefined}  defaultValue={this.contraEdit.contrasenya}/>  
                    <button type="button" className="btn-floating blue prefix" onClick={this.togglePopup4.bind(this)}>
                      <i className="material-icons circle">edit</i>
                    </button>
                              
                    <PasswordStrengthMeter password = {this.state.contrasenyaEdit}/>
                    {errors.contrasenyaEdit && <p className="warning">{errors.contrasenyaEdit}</p>}
                  </div>
               


                <br/>
          
                <input type='submit' className="btn waves-effect waves-light mr-5" value='Actualizar'/>
                <input type='button' className="btn waves-effect waves-light" value='Cerrar' onClick={this.togglePopup2.bind(this)}/>
                  </div>
              </form>
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
