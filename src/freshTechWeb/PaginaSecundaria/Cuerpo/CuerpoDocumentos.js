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
      if(dia == 31){
        valida = true;
      }
    }else if (mes == 2){
      if ((anyo % 4 == 0 && anyo % 100 != 0)||(anyo % 400 == 0)){
        if(dia == 29){
          valida = true;
        }
      }else{
        if(dia == 28){
          valida = true;
        }
      }
    }else if(mes == 4 || mes == 6 || mes == 9){
      if(dia == 30){
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

  if (!values.nombreImg){
    errors.nombreImg = 'Introduzca nombre válido'
  }
  if (!values.expiracionImg || !/[0-9][0-9]\-[0-9][0-9]\-[0-9][0-9][0-9][0-9]/.test(values.expiracionImg)||!compararFechas(values.creacionImg,values.expiracionImg) || !verificarFecha(values.expiracionImg)){
    errors.expiracionImg = 'Introduzca fecha válida'
  }
  return errors
}

function compararFechas(fecha1,fecha2){

  var fechaAct = Number(fecha1.split("-").reverse().join("-").replace(/-/g,""));
  var fechaCad = Number(fecha2.split("-").reverse().join("-").replace(/-/g,""));
  
  return fechaAct < fechaCad;

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
      nombreImg:'',
      errors: {},
      creacionImg:fecha(),
      expiracionImg:'',
      cargaContenido:true,
      token: localStorage.getItem('token'),
      listadoCategorias:[],
      categoria:'cat',
      vacio:true,
      ordenarPor:localStorage.getItem('ordenarPor'),
      ordenarDe:localStorage.getItem('ordenarDe'),
      cargando:true,
      listadoDocumentos:[],
      nombreAnterior:'',
      imgShow: '',
      imgUrl:'',
    }
    this.imgEdit={
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
      listaV:["Nombre","Fecha de creación", "Fecha de caducidad"]
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
      this.setState({listadoCategorias:response.data,cargaContenido:false});
    })
  }
//CREO NUEVO FICHERO
  sendFile=async(value1,value2)=>{
    
    const headers = {'Authorization':`Bearer ${value1}`};
    await axios.post('https://fresh-techh.herokuapp.com/addFile',value2,{headers}
    )
    .then(response =>{
      console.log(response.data);
      this.setState({cargaContenido:true},() => this.togglePopup());
 
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
  selectImagenes=async(value)=>{
    var lista = [];
    var indice = 0;
    var orden = '';
    var ordenarde ='';
    console.log("Ordenar por I: ",this.state.ordenarPor);
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
//GET PIC PARA VISUALIZAR FICHERO
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

//GET PIC PARA VISUALIZAR FICHERO2
  selectFileDetails=async(value1,value2)=>{

    await axios.get('https://fresh-techh.herokuapp.com/getFile',{params:{nombre:`${value1}`},headers:{'Authorization':`Bearer ${value2}`}}
    )
    .then(response =>{

      console.log("IMAGEN NOMBRE: ", response.data);
      this.imgEdit.activacion=response.data.fechacreacion;
      this.imgEdit.caducidad=response.data.fechacaducidad;
      this.imgEdit.url=response.data.nombreImagen;
      this.imgEdit.categoria=response.data.categoria;
      this.imgEdit.nombre=value1;
      
      
      let array = this.state.listadoCategorias;
      console.log("LISTADO: ",this.state.listadoCategorias);
      if(array.length > 0){
        this.miListaC.listaC = array.map((data) => data.nombrecat);
      }
      console.log("ORIGINAL: ",  this.miListaC.listaC);
      var longitud = (this.miListaC.listaC.length) + 1;
      var elemento = this.miListaC.listaC[0];
      var existe = false;
      var id = 0;
     
      for (var i= 0; i < this.miListaC.listaC.length; i++){
        this.copiaLista.listaCopia[i] = this.miListaC.listaC[i];
        if(elemento != "sin categorias disponibles"){
          if(this.copiaLista.listaCopia[i] == this.imgEdit.categoria){
            existe = true;
            id = i;
          }
        }
      } 
      
 
        if (elemento == "sin categorias disponibles"){
          console.log("NANAI");
          this.copiaLista.listaCopia[0] = this.imgEdit.categoria;
 
        }else{
          if (existe){
            console.log("EXISTE");
            this.copiaLista.listaCopia[0] = this.imgEdit.categoria;
            this.copiaLista.listaCopia[id] = elemento;
          }else{
            console.log("NO EXISTE");
            this.copiaLista.listaCopia[0] = this.imgEdit.categoria;
            this.copiaLista.listaCopia[longitud] = elemento;
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
 //EDITAR FICHERO
  actualizarFile=async(value1,value2)=>{
    console.log("Token: ", value2);
    console.log("NombreAnt: ", this.state.nombreAnterior);
    console.log("Nombre: ", this.state.nombreImg);
    console.log("Categoria: ", value1);
    console.log("Caducidad: ", this.state.expiracionImg);
    console.log("Creacion: ", this.state.creacionImg);
    
    const datos = {nuevoNombre:this.state.nombreImg, categoria:value1,fechacreacion:this.state.creacionImg,fechacaducidad:this.state.expiracionImg,nombreAntiguo:this.state.nombreAnterior,actualizaImagen:'no'};
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
    console.log("Nombre: ", this.state.nombreImg);
    console.log("Categoria: ", value1);
    console.log("Caducidad: ", this.state.expiracionImg);
    console.log("Creacion: ", this.state.creacionImg);
    
    const datos = {nuevoNombre:this.state.nombreImg, categoria:value1,fechacreacion:this.state.creacionImg,fechacaducidad:this.state.expiracionImg,nombreAntiguo:this.state.nombreAnterior,actualizaImagen:'no'};
    console.log("DATOS: ", datos);
    const headers = {'Authorization':`Bearer ${value1}`};
    await axios.post('https://fresh-techh.herokuapp.com/editFile',value2,{headers},
    )
    .then(response =>{
      console.log("ACTUALIZO: ", response.data);
      this.setState({cargaContenido:true},() => this.togglePopup2());
      window.location.reload();
      
    })
    .catch(error=>{
      console.log(error.response);
    })
  }
  ///////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////

  //FUNCIONES QUE USAN LAS AXIOS
  //EDITA FICHERO
  actualizar(value){

    this.dataFileFileEdit.set('nuevoNombre', this.state.nombreImg);
    this.dataFileFileEdit.set('categoria', value);
    this.dataFileFileEdit.set('fechacreacion', this.state.creacionImg);
    this.dataFileFileEdit.set('fechacaducidad', this.state.expiracionImg);
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
  enviarImg(e){
    
    console.log('nombre', this.state.nombreImg);
    console.log('fechacaducidad', this.state.expiracionImg);
    this.dataFile.set('nombre', this.state.nombreImg);
    this.dataFile.set('categoria', this.state.categoria);
    this.dataFile.set('fechacreacion', this.state.creacionImg);
    this.dataFile.set('fechacaducidad', this.state.expiracionImg);
    this.sendFile(this.state.token,this.dataFile);

  }
  ///////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////
  //FICHEROS
  //SUBIR FICHERO AL CREAR NUEVO
  subirFile(e){
    let img = e.target.files[0];
    console.log("imagen: ",img);

    if (img) {

      this.dataFile.set('file', img);
      
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
      showPopup: !this.state.showPopup
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
      nombreAnterior:this.imgEdit.nombre,
      expiracionImg:this.imgEdit.caducidad,
      nombreImg:this.imgEdit.nombre,
  
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
      this.enviarImg();
    }else{

      console.log('Formulario inválido')
    }
  }
  handleSubmitEdit =e => {
    e.preventDefault()    

    var cat = localStorage.getItem('categoria');
    this.actualizar(cat);
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
    {cargaContenido && this.selectImagenes(token)}
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
              
              <p id={data.nombre} className="nombreItem">{data.nombre}</p>
              
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
            text='Selecciona los ficheros:'
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
                  <input type="text" name="nombreImg"id="nombreImg" onChange={this.handleChange} placeholder="Nombre"/>
                  {errors.nombreImg && <p className="warning">{errors.nombreImg}</p>}
                </div>
             
                <div className="input-field">
                  <i className="material-icons prefix">event_available</i>
                  <input className="fechaActual" type="date" name="creacionImg"id="creacionImg" value={"Fecha de creacion: " +this.state.creacionImg} readonly="readonly"/>
                  {errors.creacionImg && <p className="warning">{errors.creacionImg}</p>}
                </div>

                <div className="input-field">
                  <i className="material-icons prefix">event_busy</i>
                  <input type="date" name="expiracionImg"id="expiracionImg" placeholder={"Fecha de caducidad: DD-MM-YYYY"} onChange={this.handleChange}/>
                  {errors.expiracionImg && <p className="warning">{errors.expiracionImg}</p>}
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
                text='Edita la contraseña'
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
                    <input type="text" name="nombreImg"id="nombreImg" onChange={this.handleChange} placeholder="Nombre" defaultValue={this.imgEdit.nombre}/>
                    {errors.nombreImg && <p className="warning">{errors.nombreImg}</p>}
                  </div>
             
                  <div className="input-field">
                    <i className="material-icons prefix">event_available</i>
                    <input className="fechaActual" type="date" name="creacionImg"id="creacionImg" value={"Fecha de creacion: " +this.state.creacionImg} onChange={this.handleChange} readonly="readonly"/>
                    {errors.creacionImg && <p className="warning">{errors.creacionImg}</p>}
                  </div>

                  <div className="input-field">
                    <i className="material-icons prefix">event_busy</i>
                    <input type="date" name="expiracionImg"id="expiracionImg" placeholder={"Fecha de caducidad: DD-MM-YYYY"} onChange={this.handleChange} defaultValue={this.imgEdit.caducidad}/>
                    {errors.expiracionImg && <p className="warning">{errors.expiracionImg}</p>}
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

