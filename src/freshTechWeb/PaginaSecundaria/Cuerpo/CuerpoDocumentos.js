import React from 'react'
import add from '../../../imagenes/add_icon.png'

import cajaFuerte from '../../../imagenes/cajaFuerte.png'
import Popup from '../../PopUp/Popup.js'
import 'bootstrap/dist/css/bootstrap.min.css'
import ArrayList from '../../Desplegable/ArrayList.js'

import axios from 'axios';
import 'materialize-css/dist/css/materialize.min.css'

///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
//FUNCIONES AUXILIARES PARA GESTIONAR FECHAS Y ERRORES
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

  if (!values.nombreFile){
    errors.nombreFile = 'Introduzca nombre válido'
  }
  if (!values.expiracionFile || !/[0-9][0-9]\-[0-9][0-9]\-[0-9][0-9][0-9][0-9]/.test(values.expiracionFile)||!compararFechas(values.creacionImg,values.expiracionFile) || !verificarFecha(values.expiracionFile)){
    errors.expiracionFile = 'Introduzca fecha válida'
  }
  if(!values.fileCreate){
    errors.fileCreate="Selecciona un documento";
  }
  return errors
}

const validateEdit = values =>{
  const errors = {}

  if (!values.nombreFile){
    errors.nombreFile = 'Introduzca nombre válido'
  }
  if (!values.expiracionFile || !/[0-9][0-9]\-[0-9][0-9]\-[0-9][0-9][0-9][0-9]/.test(values.expiracionFile)||!compararFechas(values.creacionImg,values.expiracionFile) || !verificarFecha(values.expiracionFile)){
    errors.expiracionFile = 'Introduzca fecha válida'
  }
  
  return errors
}

function compararFechas(fecha1,fecha2){

  var fechaAct = Number(fecha1.split("-").reverse().join("-").replace(/-/g,""));
  var fechaCad = Number(fecha2.split("-").reverse().join("-").replace(/-/g,""));
  
  return fechaAct < fechaCad;

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

//CLASE CUERPODOCUMENTOS

class CuerpoDocumentos extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      
      showPopup:false,
      showPopup2:false,
      showPopup5:false,
      nombreFile:'',
      errors: {},
      creacionImg:fecha(),
      expiracionFile:'',
      cargaContenido:true,
      token: localStorage.getItem('token'),
      listadoCategorias:[],
      categoria:localStorage.getItem('categoria'),
      vacio:true,
      ordenarPor:localStorage.getItem('ordenarPor'),
      ordenarDe:localStorage.getItem('ordenarDe'),
      cargando:true,
      listadoDocumentos:[],
      nombreAnterior:'',
      imgShow: '',
      imgUrl:'',
      fileCreate:'',
      existe:false,

    }
    this.fileEdit={
      nombre:'',
      url:'',
      caducidad:'',
      activacion:'',
      categoria:'',

    }
    this.copiaLista={listaCopia:[]};  
    this.numero = 0;
    this.subirFile=this.subirFile.bind(this);
    this.subirFileEdit=this.subirFileEdit.bind(this);
    this.dataFile = new FormData();
    this.dataFileFileEdit = new FormData();
    this.miListaV={
      listaV:["Nombre","Fecha de creación", "Fecha de caducidad","Categoria"]
    }
  }

///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
//AXIOS CONEXION CON API
//SELECT CATEGORIAS
  selectCategorias=async(value)=>{
    console.log("ENTRAAA2");

    const config = {
      headers: {'Authorization':`Bearer ${value}`},
    }
    await axios.get('https://fresh-techh.herokuapp.com/getcat',config
    )
    .then(response =>{
      console.log(response.data);
      var categoriasList = response.data;
      
      if(categoriasList.length >0){
        categoriasList[categoriasList.length] = {nombrecat:"Sin categoría"};
      }
      
      this.setState({listadoCategorias:categoriasList,cargaContenido:false});
    })
  }
//CREO NUEVO FICHERO
  sendFile=async(value1,value2)=>{
    
    const headers = {'Authorization':`Bearer ${value1}`};
    await axios.post('https://fresh-techh.herokuapp.com/addFile',value2,{headers}
    )
    .then(response =>{
      console.log("RESP:", response.data);
      if(response.data.message == "ok"){
        this.setState({cargaContenido:true},() => this.togglePopup());
        localStorage.removeItem('categoria');
      }else{
        this.setState({existe:true,fileCreate:''});
        console.log("error");
      }
    })
    .catch(error=>{
      this.setState({existe:true});
      console.log("error");
    })
  }

//ELIMINO FICHERO EXISTENTE

  eliminarFile=async(value1,value2)=>{

    await axios.delete('https://fresh-techh.herokuapp.com/deletepasswd',{headers:{'Authorization':`Bearer ${value1}`},data:{nombre:`${value2}`}}
    )
    .then(response =>{
      this.setState({cargaContenido:true});
    })
  }

  //SELECCIONO FICHEROS PARA MOSTRARLOS
  selectFiles=async(value)=>{
    var lista = [];
    var indice = 0;
    var orden = '';
    var ordenarde ='';
    console.log("Ordenar por I: ",this.state.ordenarPor);
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
    console.log("Ordenar por img: ",orden);
    console.log("Ordenar de img: ",ordenarde);

    const config = {
      headers: {'Authorization':`Bearer ${value}`},
      params:{ordenarPor:orden,ordenarDe:ordenarde}
    }
    await axios.get('https://fresh-techh.herokuapp.com/passwdUser',config
    )
    .then(response =>{
      console.log("RespuestaSelect: ", response.data);
      
      
      for(var i=0; i < response.data.length;i++){
        if(response.data[i].tipo == "file"){
          lista[indice] = response.data[i];
          indice = indice + 1;
        }
       }
       if(lista.length == 0){
         this.setState({vacio:true});
       }else{
         this.setState({vacio:false});
       }
        this.setState({listadoDocumentos:lista,cargaContenido:false,cargando:false});
    })
  }
//GET FILE PARA VISUALIZAR FICHERO
  showFiles=async(value1,value2)=>{

    await axios.get('https://fresh-techh.herokuapp.com/getFile',{params:{nombre:`${value1}`},headers:{'Authorization':`Bearer ${value2}`}}
    )
    .then(response =>{
      console.log("IMAGEN NOMBRE: ", response.data);
      this.descargar("https://fresh-techh.herokuapp.com/"+value1+".pdf");
    })
    .catch(error=>{
      
      console.log("error");
    })
  }

//GET FILE PARA VISUALIZAR FICHERO2
  selectFileDetails=async(value1,value2)=>{

    await axios.get('https://fresh-techh.herokuapp.com/getFile',{params:{nombre:`${value1}`},headers:{'Authorization':`Bearer ${value2}`}}
    )
    .then(response =>{

      console.log("Fichero NOMBRE: ", response.data);
      this.fileEdit.activacion=response.data.fechacreacion;
      this.fileEdit.caducidad=response.data.fechacaducidad;
      this.fileEdit.url=response.data.nombreImagen;
      this.fileEdit.nombre=value1;

      if(response.data.categoria == null){
        this.fileEdit.categoria="Sin categoría"
      }else{
        this.fileEdit.categoria=response.data.categoria;
      }
      
      let array = this.state.listadoCategorias;
      if(array.length > 0){
        this.copiaLista.listaCopia = array.map((data) => data.nombrecat);
      }else{
        if(this.fileEdit.categoria == null){
          this.copiaLista.listaCopia[0] =  "Sin categoría";
        }else{
          this.copiaLista.listaCopia[0] =  this.fileEdit.categoria;
        }
      }
      if(this.copiaLista.listaCopia[0] == "sin categorias disponibles"){
        this.copiaLista.listaCopia[0] =  this.fileEdit.categoria;
      }else{

        var indiceElemento = buscar( this.copiaLista.listaCopia,this.fileEdit.categoria);
        if(indiceElemento == -1){
          this.copiaLista.listaCopia[this.copiaLista.listaCopia.length] = this.copiaLista.listaCopia[0];
          this.copiaLista.listaCopia[0] = this.fileEdit.categoria;
        }else{
          this.copiaLista.listaCopia = permuta(0, indiceElemento,this.copiaLista.listaCopia);
        }
      }
     

      
      this.togglePopup2();
      
     
    })
    .catch(error=>{
      
      console.log("error");
    })
  }
   //DESCARGAR FICHERO
   descargar=async(value)=>{
    axios({
      url: value,
      method:"GET",
      responseType:"arraybuffer",
      headers: {
        'Content-Type': 'application/pdf'
      }
    })
    .then(responseDownload =>{
      const url = window.URL.createObjectURL(new Blob([responseDownload.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download",value);
      document.body.appendChild(link);
      link.click();
    })
  .catch(error=> {
    console.log(error.message);
  })

  }
 //EDITAR FICHERO NO SE USA
  actualizarFile=async(value1,value2)=>{
    console.log("Token: ", value2);
    console.log("NombreAnt: ", this.state.nombreAnterior);
    console.log("Nombre: ", this.state.nombreFile);
    console.log("Categoria: ", value1);
    console.log("Caducidad: ", this.state.expiracionFile);
    console.log("Creacion: ", this.state.creacionImg);
    
    const datos = {nuevoNombre:this.state.nombreFile, categoria:value1,fechacreacion:this.state.creacionImg,fechacaducidad:this.state.expiracionFile,nombreAntiguo:this.state.nombreAnterior,actualizaImagen:'no'};
    console.log("DATOS: ", datos);
    const headers = {'Authorization':`Bearer ${value2}`};
    await axios.post('https://fresh-techh.herokuapp.com/editFile',datos,{headers},
    )
    .then(response =>{
      console.log("ACTUALIZO: ", response.data);
      this.setState({cargaContenido:true},() => this.togglePopup2());
      
      
    })
    .catch(error=>{
      console.log(error.response);
    })
  }
   //EDITAR FICHERO2
  actualizFile=async(value1,value2)=>{
    console.log("Token: ", value2);
    console.log("NombreAnt: ", this.state.nombreAnterior);
    console.log("Nombre: ", this.state.nombreFile);
    console.log("Categoria: ", value1);
    console.log("Caducidad: ", this.state.expiracionFile);
    console.log("Creacion: ", this.state.creacionImg);
    
    const datos = {nuevoNombre:this.state.nombreFile, categoria:value1,fechacreacion:this.state.creacionImg,fechacaducidad:this.state.expiracionFile,nombreAntiguo:this.state.nombreAnterior,actualizaImagen:'no'};
    console.log("DATOS: ", datos);
    const headers = {'Authorization':`Bearer ${value1}`};
    await axios.post('https://fresh-techh.herokuapp.com/editFile',value2,{headers},
    )
    .then(response =>{
      console.log("RESP:", response.data);
      if(response.data.message == "ok"){
        this.setState({cargaContenido:true},() => this.togglePopup2());
        localStorage.removeItem('categoria');
      }else{
        this.setState({existe:true});
        console.log("error");
      }
      
    })
    .catch(error=>{
      this.setState({existe:true});
      console.log(error.response);
    })
   
  }
  ///////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////

  //FUNCIONES QUE USAN LAS AXIOS
  //EDITA FICHERO
  actualizar(value){

    this.dataFileFileEdit.set('nuevoNombre', this.state.nombreFile);
    //this.dataFileFileEdit.set('categoria', value);
    console.log("VAL EDIT: ",value);
    if(value== null){
      
      if((this.copiaLista.listaCopia[0] != "Sin categoría") && (this.copiaLista.listaCopia[0] != "sin categorias disponibles")){
        this.dataFileFileEdit.set('categoria', this.copiaLista.listaCopia[0]);
        console.log("NO1: ",this.copiaLista.listaCopia);
      }
    }
    else if((value != "Sin categoría") && (value != "sin categorias disponibles")){
   
      this.dataFileFileEdit.set('categoria', value);
    }else{
      this.dataFileFileEdit.delete('categoria');
    }
    this.dataFileFileEdit.set('fechacreacion', this.state.creacionImg);
    this.dataFileFileEdit.set('fechacaducidad', this.state.expiracionFile);
    this.dataFileFileEdit.set('nombreAntiguo', this.state.nombreAnterior);

    this.actualizFile(this.state.token,this.dataFileFileEdit);

  }

  //ELIMINA FICHERO
  eliminar=e=>{
    console.log("ENTRAAA3");
    var img = e.currentTarget.id;
    this.eliminarFile(this.state.token,img);
  }
  //SELECCIONA FICHERO
  select =e =>{
    e.preventDefault();
    
    var file = e.currentTarget.id;
   
    this.selectFileDetails(file,this.state.token);
  }
  //DESCARGAR FICHERO
  download =e =>{
    e.preventDefault();
    var nombre = e.currentTarget.id;
    this.showFiles(nombre,this.state.token);
    
    
  }

  //CREA FICHERO NUEVO
  enviarFile(e){
    
    console.log('nombre', this.state.nombreFile);
    console.log('fechacaducidad', this.state.expiracionFile);
    this.dataFile.set('nombre', this.state.nombreFile);
    if(localStorage.getItem('categoria') == null){
      console.log("NO1");
      if((this.miListaC.listaC[0] != "Sin categoría") && (this.miListaC.listaC[0] != "sin categorias disponibles")){
        this.dataFile.set('categoria', this.miListaC.listaC[0]);
       
      }
    }
    else if((localStorage.getItem('categoria') != "Sin categoría") && (localStorage.getItem('categoria') != "sin categorias disponibles")){
      console.log("NO2");
      this.dataFile.set('categoria', localStorage.getItem('categoria'));
    }else{
      this.dataFile.delete('categoria');
    }
    console.log("FICHERO ENVIADO: ", localStorage.getItem('file'));
    this.dataFile.set('fechacreacion', this.state.creacionImg);
    this.dataFile.set('fechacaducidad', this.state.expiracionFile);
    
    this.sendFile(this.state.token,this.dataFile);

  }

  ///////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////
  //FICHEROS
  //SUBIR FICHERO AL CREAR NUEVO
  subirFile(e){
    let img = e.target.files[0];
    

    if (img) {
      console.log("imagen: ",img);
      this.setState({errors:{},fileCreate:img},() =>  this.dataFile.set('file', img));
    
      
    }else{
      

      alert("Selecciona una imagen")
    }
  }

  //SUBIR FICHERO AL EDITAR 

  subirFileEdit(e){
    let img = e.target.files[0];
    console.log("imagen: ",img);

    if (img) {

      this.dataFileFileEdit.set('file', img);
      this.dataFileFileEdit.set('actualizaImagen', 'si');

    }else{
      this.dataFileFileEdit.set('actualizaImagen', 'no');
      alert("Selecciona una imagen")
    }
  }
 


  ///////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////
  //POPUPS

  togglePopup() {
    this.setState({
      showPopup: !this.state.showPopup,
      errors:{},
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
      errors:{},
      nombreAnterior:this.fileEdit.nombre,
      expiracionFile:this.fileEdit.caducidad,
      nombreFile:this.fileEdit.nombre,
      existe:false,
  
    });

  }
  togglePopup5() {
    this.setState({
      showPopup5: !this.state.showPopup5,
    });
    
  }



  ///////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////

  //HANDLE CHANGE
  handleChange = ({target}) => {
    const{name,value} = target
    this.setState({[name]:value})
    this.setState({existe:false,errors:{}});

   
  }
  //FORMULARIOS SUBMIT
  handleSubmit =e => {
    e.preventDefault()
    const {errors, ...sinErrors} = this.state
    const result = validate(sinErrors)
    this.setState({errors:result})
    
    if(!Object.keys(result).length){ //Si tiene propiedades, hay error
      //Envio formulario
      console.log('Formulario válido')
      this.enviarFile();
    }else{

      console.log('Formulario inválido')
    }
  }
  handleSubmitEdit =e => {
    /*e.preventDefault()    

    var cat = localStorage.getItem('categoria');
    console.log(cat);
    this.actualizar(cat);*/
    e.preventDefault()
    const {errors, ...sinErrors} = this.state
    const result = validateEdit(sinErrors)
    this.setState({errors:result})
    console.log("FAALAA ",result);
    if(!Object.keys(result).length){ //Si tiene propiedades, hay error
      //Envio formulario
      var cat = localStorage.getItem('categoria');
      console.log(cat);
      this.actualizar(cat);
    }else{

      console.log('Formulario inválido')
    }
  }

  ///////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////

  //LISTA CATEGORIAS
  miListaC={
    listaC:["sin categorias disponibles"]
   }
   
  render () {
    const { errors,token,cargaContenido} = this.state
    {cargaContenido && this.selectFiles(token)}
    {cargaContenido && this.selectCategorias(token)}

    return (
        <>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"></link>
       
        <div className="Filtro">
        <br></br><br></br>
        <div className="bloqueArray">

          <div className="filtro">
            <ArrayList tipo={false} valores={this.miListaV.listaV} contenido={"imagenes"}/>
          </div>
        </div>
      </div>
      <br></br><br></br>
      {this.state.cargando ?
     <div className="preloader">
      <div className="preloader-wrapper big active">
        <div className="spinner-layer spinner-blue-only">
          <div className="circle-clipper left">
            <div className="circle"></div>
          </div><div className="gap-patch">
            <div className="circle"></div>
          </div><div className="circle-clipper right">
            <div className="circle"></div>
          </div>
        </div>
      </div>
      </div>
    :
    <>
   
  
  
        <ul className="collection header col">
        <li className="collection-header header2 ml-4">
          <div className="contenidoList">
            <h4 className="header2">Documentos</h4>
            <button className="anyade" onClick={this.togglePopup.bind(this)}>Añade una!</button>
          </div>
          </li>
        {this.state.vacio ? 
         <li class="collection-item avatar"><h5>No hay documentos creados</h5></li>
        :
        <>
        {this.state.listadoDocumentos.map(data=>(
          <li key={data.nombre} className="collection-item avatar">
            <i className="material-icons iconoShow circle red">picture_as_pdf</i>
            <div className="contenidoList">
            <div className="contenedorNombreFile">
              <p id={data.nombre} className="nombreItemFile">{data.nombre}</p>
            </div>
              <p className="fechas">Fecha creación: {data.fechacreacion}<br></br>
                  Fecha caducidad: {data.fechacaducidad}
              </p>
              <div className="botonesEditDel">
                <input className="btn btn-primary" name={data.nombre} id={data.nombre} type='button' value='Editar'  onClick={this.select}/>
                <input className="btn btn-primary ml-2" name={data.nombre} id={data.nombre} type='button' value='Eliminar' onClick={this.eliminar}/>
                <input className="btn btn-primary ml-2" name={data.nombre} id={data.nombre} type='button' value='Descargar' onClick={this.download}/>
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
            text='Añade un fichero!'
            cuerpo={
              <>
               <form  onSubmit={this.handleSubmit}>
                
                <span className="par">
                  <input classname="form-control" type="file" name="image" accept="application/pdf" onChange={this.subirFile}/>
                  
                  <pre>      </pre>
                  <ArrayList className="arrayL" tipo={true} valores={this.miListaC.listaC}/>
                 
                  </span>
                <div className="pup">
                <div className="input-field">
                  <i className="material-icons prefix">assignment</i>
                  <input type="text" name="nombreFile"id="nombreFile" onChange={this.handleChange} placeholder="Nombre"/>
                  {errors.nombreFile && <p className="warning">{errors.nombreFile}</p>}
                  {this.state.existe && <p className="warning">Este nombre ya existe</p>}

                </div>
             
                <div className="input-field">
                  <i className="material-icons prefix">event_available</i>
                  <input className="fechaActual" type="date" name="creacionImg"id="creacionImg" value={"Fecha de creacion: " +this.state.creacionImg} readonly="readonly"/>
                  {errors.creacionImg && <p className="warning">{errors.creacionImg}</p>}
                </div>

                <div className="input-field">
                  <i className="material-icons prefix">event_busy</i>
                  <input type="date" name="expiracionFile"id="expiracionFile" placeholder={"Fecha de caducidad: DD-MM-YYYY"} onChange={this.handleChange}/>
                  {errors.expiracionFile && <p className="warning">{errors.expiracionFile}</p>}
                  {errors.fileCreate && <p className="warning">{errors.fileCreate}</p>}
                  
                </div>


               
                <br/>
                <input type='submit' className="btn waves-effect botonesLogin1 waves-light" value='Subir'/>
                <input type='button' className="btn waves-effect botonesLogin2 waves-light" value='Cerrar' onClick={this.togglePopup.bind(this)}/>
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
                text='Edita el documento'
                cuerpo={
                  <>
                <form onSubmit={this.handleSubmitEdit}>
                  <span className="par">
                   <input classname="form-control" type="file" name="image" accept="application/pdf" onChange={this.subirFileEdit}/>
                  
                    <pre>      </pre>
                    <ArrayList tipo={true} valores={this.copiaLista.listaCopia}/>
                 
                  </span>
                  <div className="pup">
                  <div className="input-field">
                    <i className="material-icons prefix">assignment</i>
                    <input type="text" name="nombreFile"id="nombreFile" onChange={this.handleChange} placeholder="Nombre" defaultValue={this.fileEdit.nombre}/>
                    {errors.nombreFile && <p className="warning">{errors.nombreFile}</p>}
                    {this.state.existe && <p className="warning">Este nombre ya existe</p>}

                  </div>
             
                  <div className="input-field">
                    <i className="material-icons prefix">event_available</i>
                    <input className="fechaActual" type="date" name="creacionImg"id="creacionImg" value={"Fecha de creacion: " +this.state.creacionImg} onChange={this.handleChange} readonly="readonly"/>
                    {errors.creacionImg && <p className="warning">{errors.creacionImg}</p>}
                  </div>

                  <div className="input-field">
                    <i className="material-icons prefix">event_busy</i>
                    <input type="date" name="expiracionFile"id="expiracionFile" placeholder={"Fecha de caducidad: DD-MM-YYYY"} onChange={this.handleChange} defaultValue={this.fileEdit.caducidad}/>
                    {errors.expiracionFile && <p className="warning">{errors.expiracionFile}</p>}
                  </div>
                <br/>
          
                <input type='submit' className="btn waves-effect waves-light botonesLogin1" value='Actualizar'/>
                <input type='button' className="btn waves-effect waves-light botonesLogin2" value='Cerrar' onClick={this.togglePopup2.bind(this)}/>
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

export default CuerpoDocumentos

